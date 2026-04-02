// Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  avatar?: string;
  role: "user" | "admin";
  phone?: string;
  address?: string;
  bio?: string;
  primaryVehicleId?: string;
  createdAt: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}

// Vehicle Types
export interface Vehicle {
  id: string;
  userId: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  image?: string;
  createdAt: string;
  serviceHistory: ServiceRecord[];
  nextServiceDate?: string;
  serviceReminderNotes?: string;
  estimatedCost?: number;
}

export interface ServiceRecord {
  id: string;
  vehicleId: string;
  date: string;
  service: string;
  cost: number;
  status: "completed" | "pending";
}

// Appointment Types
export interface Appointment {
  id: string;
  userId: string;
  vehicleId: string;
  vehicleName?: string;
  vehicleImage?: string;
  customerName?: string;
  customerAddress?: string;
  customerEmail?: string;
  customerPhone?: string;
  broughtInBy?: string;
  broughtInByPhone?: string;
  carRegNumber?: string;
  vinNumber?: string;
  carType?: string;
  carModel?: string;
  carColor?: string;
  serviceType: string;
  description: string;
  damageAreas?: string[];
  bookingDate: string;
  appointmentDate: string;
  appointmentTime: string;
  status: "Pending" | "Confirmed" | "In Progress" | "Completed" | "Cancelled";
  notes?: string;
  verifiedByAdmin?: boolean;
  createdAt: string;
}

// Repair Types
export interface Repair {
  id: string;
  appointmentId?: string;
  userId: string;
  vehicleId: string;
  title: string;
  description: string;
  workflowStage?:
    | "Pending"
    | "Estimate Preparation In Progress"
    | "Awaiting Approval"
    | "Awaiting Payment"
    | "Workshop Repair In Progress"
    | "Job Completed"
    | "Awaiting Collection";
  estimateItems?: { part: string; price: number }[];
  assignedBy?: string;
  status: "Pending" | "In Progress" | "Completed";
  partsBreakdown?: string;
  workmanshipDetails?: string;
  labourCost: number;
  partsCost: number;
  workmanshipFee?: number;
  totalAmount?: number;
  depositAmount?: number;
  amountPaid?: number;
  balanceDue?: number;
  paymentStatus?: "pending" | "partial" | "paid";
  images: string[];
  notes: string;
  createdAt: string;
  completedAt?: string;
}

export interface PaymentRecord {
  id: string;
  repairJobId: string;
  userId: string;
  amount: number;
  method: "mock-paystack" | "mock-transfer";
  status: "pending" | "success" | "failed";
  paymentStatus: "pending" | "partial" | "paid";
  reference: string;
  paidAt?: string;
  createdAt: string;
}

// Message Types
export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  type: "text" | "system" | "repair_update";
  repairId?: string;
  senderName?: string;
  image?: string;
  createdAt: string;
  read: boolean;
}

export interface AppNotification {
  id: string;
  recipientId: string;
  title: string;
  content: string;
  category: "booking" | "repair" | "marketplace" | "message" | "system";
  createdAt: string;
  read: boolean;
}

// Email Types
export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  body: string;
  type: "otp" | "repair_update" | "appointment" | "receipt";
  sentAt: string;
}

// Marketplace Types
export interface Listing {
  id: string;
  userId: string;
  adminId?: string;
  images: string[];
  title: string;
  price: number;
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuel: string;
  location: string;
  description: string;
  faults?: string;
  verified: boolean;
  status: "pending" | "approved" | "rejected";
  sellerName?: string;
  sellerPhone?: string;
  createdAt: string;
}

// Receipt Types
export interface Receipt {
  id: string;
  repairId: string;
  userId: string;
  issueDate: string;
  description: string;
  labourCost: number;
  partsCost: number;
  tax: number;
  totalAmount: number;
  notes?: string;
}
