/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { logout } from "@/actions/auth";
import type { Transaction } from "@/types/transaction";
import TransactionTable from "@/components/transaction-table";
import TransactionSummary from "@/components/transaction-summary";
import TransactionFilters from "@/components/transaction-filters";
import { LogOut } from "lucide-react";

interface DashboardContentProps {
  initialTransactions: Transaction[];
}

export default function DashboardContent({ initialTransactions }: DashboardContentProps) {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [filteredTransactions, setFilteredTransactions] =
    useState<Transaction[]>(initialTransactions);

  async function handleLogout() {
    await logout();
    router.push("/");
    router.refresh();
  }

  function handleFilterChange(filtered: Transaction[]) {
    setFilteredTransactions(filtered);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Finance Portal</h1>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Filters</CardTitle>
                <CardDescription>Filter transactions by date, amount, or type</CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionFilters
                  transactions={transactions}
                  onFilterChange={handleFilterChange}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transaction List</CardTitle>
                <CardDescription>
                  Showing {filteredTransactions.length} of {transactions.length} transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionTable transactions={filteredTransactions} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
                <CardDescription>Overview of transaction data for reporting</CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionSummary transactions={transactions} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
