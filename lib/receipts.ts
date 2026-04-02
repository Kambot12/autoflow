import { jsPDF } from "jspdf";
import { brand } from "@/lib/brand";

const naira = (value: number) => `N${value.toLocaleString()}`;

const addHeader = (pdf: jsPDF, title: string, subtitle: string) => {
  pdf.setTextColor(240, 240, 240);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(46);
  pdf.text(brand.shortName.toUpperCase(), 24, 150, { angle: 24 });
  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.text(brand.name, 20, 22);
  pdf.setFontSize(16);
  pdf.text(title, 20, 34);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.text(subtitle, 20, 42);
};

const addLine = (pdf: jsPDF, label: string, value: string, y: number) => {
  pdf.setFont("helvetica", "bold");
  pdf.text(label, 20, y);
  pdf.setFont("helvetica", "normal");
  pdf.text(value, 82, y);
};

export const downloadBookingReceipt = (appointment: any) => {
  const pdf = new jsPDF();
  addHeader(pdf, "Booking Receipt", "Service booking confirmation");
  addLine(pdf, "Booking ID", appointment.id, 60);
  addLine(pdf, "Service", appointment.serviceType, 70);
  addLine(pdf, "Date", new Date(appointment.appointmentDate).toLocaleDateString(), 80);
  addLine(pdf, "Time", appointment.appointmentTime, 90);
  addLine(pdf, "Status", appointment.status, 100);
  addLine(
    pdf,
    "Admin Review",
    appointment.verifiedByAdmin ? "Verified by admin" : "Awaiting admin verification",
    110
  );
  pdf.setFont("helvetica", "bold");
  pdf.text("Issue Description", 20, 126);
  pdf.setFont("helvetica", "normal");
  pdf.text(pdf.splitTextToSize(appointment.description || "No description", 170), 20, 136);
  pdf.save(`booking-${appointment.id}.pdf`);
};

export const downloadRepairInvoice = (repair: any) => {
  const workmanshipFee = Number(repair.workmanshipFee || 0);
  const subtotal = Number(repair.labourCost || 0) + Number(repair.partsCost || 0) + workmanshipFee;
  const vat = Math.round(subtotal * 0.05);
  const total = Number(repair.totalAmount || subtotal + vat);
  const depositAmount = Number(repair.depositAmount || Math.ceil(total * 0.7));
  const amountPaid = Number(repair.amountPaid || 0);
  const balanceDue = Number(
    repair.balanceDue ?? Math.max(total - amountPaid, 0)
  );
  const paymentStatus = repair.paymentStatus || "pending";

  const estimateItems = Array.isArray(repair.estimateItems) ? repair.estimateItems : [];
  const pdf = new jsPDF();
  addHeader(pdf, "Repair Invoice", "Detailed workshop invoice");
  addLine(pdf, "Invoice ID", `INV-${repair.id}`, 60);
  addLine(pdf, "Repair", repair.title, 70);
  addLine(pdf, "Status", repair.status, 80);
  addLine(pdf, "Created", new Date(repair.createdAt).toLocaleDateString(), 90);
  addLine(pdf, "Parts Listed", repair.partsBreakdown || "To be confirmed by workshop", 100);
  addLine(pdf, "Labour", naira(Number(repair.labourCost || 0)), 110);
  addLine(pdf, "Parts", naira(Number(repair.partsCost || 0)), 120);
  addLine(pdf, "Workmanship", naira(workmanshipFee), 130);
  addLine(pdf, "VAT (5%)", naira(vat), 140);
  addLine(pdf, "70% Deposit", naira(depositAmount), 150);
  addLine(pdf, "Amount Paid", naira(amountPaid), 160);
  addLine(pdf, "Balance Due", naira(balanceDue), 170);
  addLine(
    pdf,
    "Payment Status",
    paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1),
    180
  );
  addLine(pdf, "Assigned By", repair.assignedBy || "Workshop Manager", 190);
  pdf.setFont("helvetica", "bold");
  pdf.text("Total", 20, 204);
  pdf.text(naira(total), 82, 204);
  let detailsStartY = 222;
  if (estimateItems.length) {
    pdf.setFont("helvetica", "bold");
    pdf.text("Estimate Breakdown", 20, 218);
    pdf.setFont("helvetica", "normal");
    let y = 228;
    estimateItems.forEach((item: any) => {
      pdf.text(`${item.part}`, 20, y);
      pdf.text(naira(Number(item.price || 0)), 150, y);
      y += 8;
    });
    detailsStartY = Math.min(y + 8, 246);
  }
  pdf.setFont("helvetica", "bold");
  pdf.text("Workmanship Details", 20, detailsStartY);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    pdf.splitTextToSize(
      repair.workmanshipDetails || repair.notes || "No workmanship details provided.",
      170
    ),
    20,
    detailsStartY + 10
  );
  pdf.setFont("helvetica", "bold");
  pdf.text("Important Payment Notice", 20, Math.min(detailsStartY + 34, 278));
  pdf.setFont("helvetica", "normal");
  pdf.text("70% of the payment is required to start fixing the car.", 20, Math.min(detailsStartY + 42, 286));
  pdf.text("Account details: Test Bank / 0123456789 / AutoFlow Workshop", 20, Math.min(detailsStartY + 50, 294));
  pdf.save(`repair-invoice-${repair.id}.pdf`);
};

export const generateRepairInvoiceBase64 = (repair: any) => {
  const workmanshipFee = Number(repair.workmanshipFee || 0);
  const subtotal = Number(repair.labourCost || 0) + Number(repair.partsCost || 0) + workmanshipFee;
  const vat = Math.round(subtotal * 0.05);
  const total = Number(repair.totalAmount || subtotal + vat);
  const depositAmount = Number(repair.depositAmount || Math.ceil(total * 0.7));
  const amountPaid = Number(repair.amountPaid || 0);
  const balanceDue = Number(repair.balanceDue ?? Math.max(total - amountPaid, 0));
  const paymentStatus = repair.paymentStatus || "pending";

  const estimateItems = Array.isArray(repair.estimateItems) ? repair.estimateItems : [];
  const pdf = new jsPDF();
  addHeader(pdf, "Repair Invoice", "Detailed workshop invoice");
  addLine(pdf, "Invoice ID", `INV-${repair.id}`, 60);
  addLine(pdf, "Repair", repair.title, 70);
  addLine(pdf, "Status", repair.status, 80);
  addLine(pdf, "Created", new Date(repair.createdAt).toLocaleDateString(), 90);
  addLine(pdf, "Parts Listed", repair.partsBreakdown || "To be confirmed by workshop", 100);
  addLine(pdf, "Labour", naira(Number(repair.labourCost || 0)), 110);
  addLine(pdf, "Parts", naira(Number(repair.partsCost || 0)), 120);
  addLine(pdf, "Workmanship", naira(workmanshipFee), 130);
  addLine(pdf, "VAT (5%)", naira(vat), 140);
  addLine(pdf, "70% Deposit", naira(depositAmount), 150);
  addLine(pdf, "Amount Paid", naira(amountPaid), 160);
  addLine(pdf, "Balance Due", naira(balanceDue), 170);
  addLine(pdf, "Payment Status", paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1), 180);
  addLine(pdf, "Assigned By", repair.assignedBy || "Workshop Manager", 190);
  pdf.setFont("helvetica", "bold");
  pdf.text("Total", 20, 204);
  pdf.text(naira(total), 82, 204);
  let detailsStartY = 222;
  if (estimateItems.length) {
    pdf.setFont("helvetica", "bold");
    pdf.text("Estimate Breakdown", 20, 218);
    pdf.setFont("helvetica", "normal");
    let y = 228;
    estimateItems.forEach((item: any) => {
      pdf.text(`${item.part}`, 20, y);
      pdf.text(naira(Number(item.price || 0)), 150, y);
      y += 8;
    });
    detailsStartY = Math.min(y + 8, 246);
  }
  pdf.setFont("helvetica", "bold");
  pdf.text("Workmanship Details", 20, detailsStartY);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    pdf.splitTextToSize(
      repair.workmanshipDetails || repair.notes || "No workmanship details provided.",
      170
    ),
    20,
    detailsStartY + 10
  );
  pdf.setFont("helvetica", "bold");
  pdf.text("Important Payment Notice", 20, Math.min(detailsStartY + 34, 278));
  pdf.setFont("helvetica", "normal");
  pdf.text("70% of the payment is required to start fixing the car.", 20, Math.min(detailsStartY + 42, 286));
  pdf.text("Account details: Test Bank / 0123456789 / AutoFlow Workshop", 20, Math.min(detailsStartY + 50, 294));

  return pdf.output("datauristring").replace(/^data:application\/pdf;base64,/, "");
};

export const downloadMarketplaceReceipt = (listing: any) => {
  const pdf = new jsPDF();
  addHeader(pdf, "Marketplace Purchase Invoice", "Vehicle marketplace purchase summary");
  addLine(pdf, "Listing ID", listing.id, 60);
  addLine(pdf, "Vehicle", `${listing.year} ${listing.make} ${listing.model}`, 70);
  addLine(pdf, "Seller", listing.sellerName || brand.sellerName, 80);
  addLine(pdf, "Phone", listing.sellerPhone || "Not provided", 90);
  addLine(pdf, "Location", listing.location || "Not provided", 100);
  addLine(pdf, "Price", naira(Number(listing.price || 0)), 110);
  addLine(pdf, "Status", listing.status, 120);
  pdf.setFont("helvetica", "bold");
  pdf.text("Vehicle Description", 20, 136);
  pdf.setFont("helvetica", "normal");
  pdf.text(pdf.splitTextToSize(listing.description || "No description provided.", 170), 20, 146);
  pdf.save(`marketplace-invoice-${listing.id}.pdf`);
};
