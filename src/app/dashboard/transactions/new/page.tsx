import { redirect } from "next/navigation";
import { checkAuth } from "@/actions/auth";
import NewTransactionForm from "@/components/new-transaction-form";

export default async function NewTransactionPage() {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    redirect("/");
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Create New Transaction</h1>
      <NewTransactionForm />
    </div>
  );
}
