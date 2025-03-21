import { redirect } from "next/navigation";
import { checkAuth } from "@/actions/auth";
import { fetchTransactions } from "@/actions/transactions";
import DetailedReports from "@/components/detailed-reports";

export default async function DetailedReportsPage() {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    redirect("/");
  }

  const transactions = await fetchTransactions();

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Detailed Financial Reports</h1>
      <DetailedReports transactions={transactions} />
    </div>
  );
}
