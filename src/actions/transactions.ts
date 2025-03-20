"use server";

import type { Transaction } from "@/types/transaction";

// In a real application, this would fetch from the actual API
// For this example, we'll simulate the API response
export async function fetchTransactions(): Promise<Transaction[]> {
  try {
    // In a real implementation, you would use the actual API endpoint
    // const response = await fetch("https://login-bir3msoyja-et.a.run.app/transactions", {
    //   headers: {
    //     Authorization: `Basic ${Buffer.from("user:password").toString("base64")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch transactions");
    // return await response.json();

    // For demonstration, return mock data
    return generateMockTransactions();
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

function generateMockTransactions(): Transaction[] {
  const transactionTypes = ["Income", "Expense", "Transfer", "Investment"];
  const categories = [
    "Salary",
    "Rent",
    "Utilities",
    "Office Supplies",
    "Marketing",
    "Travel",
    "Consulting",
    "Software",
  ];

  return Array.from({ length: 50 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 60)); // Random date within last 60 days

    const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
    const amount =
      type === "Income"
        ? Math.floor(Math.random() * 10000) + 1000
        : -(Math.floor(Math.random() * 5000) + 100);

    return {
      id: `tr-${i + 1}`,
      date: date.toISOString(),
      description: `Transaction #${i + 1}`,
      amount,
      type,
      category: categories[Math.floor(Math.random() * categories.length)],
      status: Math.random() > 0.2 ? "Completed" : "Pending",
    };
  });
}
