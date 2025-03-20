import { redirect } from "next/navigation";
import DashboardContent from "@/components/dashboard-content";
import { checkAuth } from "@/actions/auth";
import { fetchTransactions } from "@/actions/transactions";

export default async function DashboardPage() {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    redirect("/");
  }

  const transactions = await fetchTransactions();

  return <DashboardContent initialTransactions={transactions} />;
}
