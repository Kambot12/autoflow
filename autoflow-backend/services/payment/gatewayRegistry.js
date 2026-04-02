import { simulateMockPayment } from "./mockGateway.js";

export async function processMockPayment(payload) {
  return simulateMockPayment(payload);
}

export async function processPaystackPayment() {
  throw new Error("Paystack integration placeholder. Not implemented in test mode.");
}

export async function processFlutterwavePayment() {
  throw new Error("Flutterwave integration placeholder. Not implemented in test mode.");
}

export async function verifyPaystackWebhook() {
  throw new Error("Paystack webhook placeholder. Not implemented in test mode.");
}

export async function verifyFlutterwaveWebhook() {
  throw new Error("Flutterwave webhook placeholder. Not implemented in test mode.");
}
