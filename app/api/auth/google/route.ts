import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const mockUsers: any[] = [
  {
    id: "user1",
    email: "test@gmail.com",
    name: "Test User",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=test",
    phone: "+234-123-456-7890",
    address: "123 Main St, Lagos, Nigeria",
    role: "user",
    createdAt: new Date().toISOString(),
  },
];

export async function POST(request: NextRequest) {
  try {
    const { action, email, name, image } = await request.json();

    if (action === "google-signin") {
      let user = mockUsers.find((entry) => entry.email === email);

      if (!user) {
        user = {
          id: "user_" + crypto.randomBytes(8).toString("hex"),
          email,
          name: name || email.split("@")[0],
          image: image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          role: "user",
          createdAt: new Date().toISOString(),
          phone: "",
          address: "",
        };
        mockUsers.push(user);
      }

      const token = crypto.randomBytes(32).toString("hex");

      return NextResponse.json({
        success: true,
        user,
        token,
        message: "User authenticated successfully",
      });
    }

    if (action === "get-user") {
      const token = request.headers.get("token");
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      return NextResponse.json({ user: mockUsers[0] });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
