import { redirect } from "next/navigation";
import { checkAuth, getUsername } from "@/actions/auth";
import { fetchTransactions } from "@/actions/transactions";
import DashboardLayout from "@/components/dashboard-layout";

export default async function ReportsPage() {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    redirect("/");
  }

  const username = await getUsername();
  const transactions = await fetchTransactions();

  return (
    <DashboardLayout username={username} initialTransactions={transactions} activeTab="reports" />
  );
}
