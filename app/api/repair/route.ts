import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

let repairs: any[] = [];
let messages: any[] = [];
let receipts: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    if (action === "create-repair") {
      const repair = {
        id: "repair_" + crypto.randomBytes(8).toString("hex"),
        ...data,
        createdAt: new Date().toISOString(),
      };

      repairs.push(repair);

      const message = {
        id: "msg_" + crypto.randomBytes(8).toString("hex"),
        senderId: "admin",
        recipientId: data.userId,
        content: `Repair created: ${data.title}`,
        type: "system",
        repairId: repair.id,
        createdAt: new Date().toISOString(),
        read: false,
      };

      messages.push(message);
      console.log("📧 Repair notification queued for:", data.userId);

      return NextResponse.json({ success: true, repair });
    }

    if (action === "update-repair") {
      const { repairId, status, notes, images } = data;
      const repair = repairs.find((entry) => entry.id === repairId);

      if (!repair) {
        return NextResponse.json({ error: "Repair not found" }, { status: 404 });
      }

      if (status) repair.status = status;
      if (notes) repair.notes = notes;
      if (images) repair.images = images;
      if (status === "Completed") repair.completedAt = new Date().toISOString();

      const message = {
        id: "msg_" + crypto.randomBytes(8).toString("hex"),
        senderId: "admin",
        recipientId: repair.userId,
        content: `Repair status updated to: ${status}. ${notes || ""}`,
        type: "repair_update",
        repairId,
        createdAt: new Date().toISOString(),
        read: false,
      };

      messages.push(message);

      if (status === "Completed") {
        const receipt = {
          id: "receipt_" + crypto.randomBytes(8).toString("hex"),
          repairId,
          userId: repair.userId,
          issueDate: new Date().toISOString(),
          description: repair.title,
          labourCost: repair.labourCost,
          partsCost: repair.partsCost,
          tax: (repair.labourCost + repair.partsCost) * 0.05,
          totalAmount:
            repair.labourCost +
            repair.partsCost +
            (repair.labourCost + repair.partsCost) * 0.05,
          notes: repair.notes,
        };

        receipts.push(receipt);
        console.log("📧 Receipt generated for:", repair.userId);
      }

      return NextResponse.json({ success: true, repair });
    }

    if (action === "get-repairs") {
      return NextResponse.json({ repairs });
    }

    if (action === "get-messages") {
      return NextResponse.json({ messages });
    }

    if (action === "send-message") {
      const message = {
        id: "msg_" + crypto.randomBytes(8).toString("hex"),
        ...data,
        createdAt: new Date().toISOString(),
        read: false,
      };

      messages.push(message);
      return NextResponse.json({ success: true, message });
    }

    if (action === "get-receipts") {
      return NextResponse.json({ receipts });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
