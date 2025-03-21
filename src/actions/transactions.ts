/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import type { ApiResponse, Transaction } from "@/types/transaction";

// Replace the entire fetchTransactions function with this implementation that uses real API data
export async function fetchTransactions(): Promise<Transaction[]> {
  try {
    // Make a real API call to fetch transaction data
    const response = await fetch("https://login-bir3msoyja-et.a.run.app/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "user",
        password: "password",
      }),
    });

    console.log("response", response);

    if (!response.ok) throw new Error("Failed to fetch transactions");

    const apiResponse: ApiResponse = await response.json();

    // Transform the API response to our Transaction format
    return transformApiResponseToTransactions(apiResponse);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

function transformApiResponseToTransactions(apiResponse: ApiResponse): Transaction[] {
  const transactions: Transaction[] = [];

  for (const [id, data] of Object.entries(apiResponse.data as Record<string, any>)) {
    // Handle different transaction statuses
    let status = "Completed";
    let type = "Sale";

    if (
      data.detail.transaction_status === "refunded" ||
      data.detail.transaction_status === "refund_pending"
    ) {
      status = "Refunded";
      type = "Refund";
    } else if (
      data.detail.transaction_status === "cancel" ||
      data.detail.transaction_status === "timeout" ||
      data.detail.transaction_status === "expire"
    ) {
      status = "Cancelled";
      type = "Cancelled";
    }

    // Get payment method
    const paymentMethod = data.payment.method;

    // Get product name
    const productName = data.product.name || "Unknown Product";

    // Get category from product SKU
    const category = data.product.sku || "Unknown";

    // Calculate fee
    const fee = data.payment.fee.platform_sharing_revenue || 0;

    const transaction: Transaction = {
      id,
      date: new Date(data.time.timestamp).toISOString(),
      description: `Purchase of ${productName}`,
      amount: data.payment.amount,
      type,
      category,
      status,
      productName,
      deviceId: data.product.device_id,
      paymentMethod,
      nettAmount: data.payment.nett,
      fee,
      orderId: data.detail.order_id,
      rawData: data,
    };

    transactions.push(transaction);
  }

  return transactions;
}

export async function createTransaction(formData: FormData) {
  // In a real application, you would send this data to your API
  // and handle the response accordingly.
  // For this example, we'll just simulate a successful transaction creation.

  const description = formData.get("description") as string;
  const amount = formData.get("amount") as string;
  const date = formData.get("date") as string;
  const type = formData.get("type") as string;
  const category = formData.get("category") as string;
  const status = formData.get("status") as string;
  const notes = formData.get("notes") as string;
  const reference = formData.get("reference") as string;

  if (!description || !amount || !date || !type || !category || !status) {
    return { success: false, error: "Missing required fields." };
  }

  try {
    // Simulate successful creation
    console.log("Transaction created:", {
      description,
      amount,
      date,
      type,
      category,
      status,
      notes,
      reference,
    });

    return { success: true };
  } catch (error) {
    console.error("Error creating transaction:", error);
    return { success: false, error: "Failed to create transaction." };
  }
}
