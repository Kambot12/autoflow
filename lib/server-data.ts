import { BACKEND_URL } from "@/lib/auth";

async function parseResponse(response: Response) {
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

export async function fetchServerUsers() {
  const response = await fetch(`${BACKEND_URL}/api/data/users`);
  const data = await parseResponse(response);
  return data.users || [];
}

export async function fetchServerAppointments() {
  const response = await fetch(`${BACKEND_URL}/api/data/appointments`);
  const data = await parseResponse(response);
  return data.appointments || [];
}

export async function syncServerAppointments(appointments: any[]) {
  const response = await fetch(`${BACKEND_URL}/api/data/appointments/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ appointments }),
  });
  const data = await parseResponse(response);
  return data.appointments || [];
}

export async function createServerAppointment(appointment: any) {
  const response = await fetch(`${BACKEND_URL}/api/data/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(appointment),
  });
  const data = await parseResponse(response);
  return data.appointment;
}

export async function updateServerAppointment(id: string, payload: any) {
  const response = await fetch(`${BACKEND_URL}/api/data/appointments/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await parseResponse(response);
  return data.appointment;
}

export async function fetchServerVehicles() {
  const response = await fetch(`${BACKEND_URL}/api/data/vehicles`);
  const data = await parseResponse(response);
  return data.vehicles || [];
}

export async function syncServerVehicles(vehicles: any[]) {
  const response = await fetch(`${BACKEND_URL}/api/data/vehicles/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ vehicles }),
  });
  const data = await parseResponse(response);
  return data.vehicles || [];
}

export async function updateServerVehicle(id: string, payload: any) {
  const response = await fetch(`${BACKEND_URL}/api/data/vehicles/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await parseResponse(response);
  return data.vehicle;
}

export async function fetchServerRepairs() {
  const response = await fetch(`${BACKEND_URL}/api/data/repairs`);
  const data = await parseResponse(response);
  return data.repairs || [];
}

export async function syncServerRepairs(repairs: any[]) {
  const response = await fetch(`${BACKEND_URL}/api/data/repairs/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ repairs }),
  });
  const data = await parseResponse(response);
  return data.repairs || [];
}

export async function createServerRepair(repair: any) {
  const response = await fetch(`${BACKEND_URL}/api/data/repairs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(repair),
  });
  const data = await parseResponse(response);
  return data.repair;
}

export async function updateServerRepair(id: string, payload: any) {
  const response = await fetch(`${BACKEND_URL}/api/data/repairs/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await parseResponse(response);
  return data.repair;
}

export async function createMockPayment(payload: {
  repairJobId: string;
  amount: number;
  method: "mock-paystack" | "mock-transfer";
}) {
  const response = await fetch(`${BACKEND_URL}/api/payment/mock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await parseResponse(response);
  return data;
}

export async function fetchServerPayments(params?: {
  repairJobId?: string;
  userId?: string;
}) {
  const query = new URLSearchParams();
  if (params?.repairJobId) query.set("repairJobId", params.repairJobId);
  if (params?.userId) query.set("userId", params.userId);
  const response = await fetch(
    `${BACKEND_URL}/api/payment${query.toString() ? `?${query.toString()}` : ""}`
  );
  const data = await parseResponse(response);
  return data.payments || [];
}
