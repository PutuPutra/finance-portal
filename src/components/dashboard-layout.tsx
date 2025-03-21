"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { logout } from "@/actions/auth";
import type { Transaction } from "@/types/transaction";
import TransactionTable from "@/components/transaction-table";
import TransactionSummary from "@/components/transaction-summary";
import TransactionFilters from "@/components/transaction-filters";
import { BarChart3, FileText, Home, LogOut, Menu, UserIcon, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface DashboardLayoutProps {
  username: string;
  initialTransactions: Transaction[];
  activeTab?: "transactions" | "reports";
}

export default function DashboardLayout({
  username,
  initialTransactions,
  activeTab = "transactions",
}: DashboardLayoutProps) {
  const router = useRouter();
  const [transactions] = useState<Transaction[]>(initialTransactions);
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
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">PT X Finance</h2>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                  </div>
                  <div className="space-y-1">
                    <Link href="/dashboard" passHref>
                      <Button
                        variant={activeTab === "transactions" ? "secondary" : "ghost"}
                        className="w-full justify-start"
                      >
                        <Home className="mr-2 h-4 w-4" />
                        Transactions
                      </Button>
                    </Link>
                    <Link href="/dashboard/reports/detailed" passHref>
                      <Button
                        variant={activeTab === "reports" ? "secondary" : "ghost"}
                        className="w-full justify-start"
                      >
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Reports
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-auto">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-bold text-gray-900">Finance Portal</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
              <UserIcon className="h-4 w-4" />
              <span>{username}</span>
            </div>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop only */}
        <aside className="hidden md:block w-64 bg-white border-r min-h-[calc(100vh-65px)] p-4">
          <nav className="space-y-1">
            <Link href="/dashboard" passHref>
              <Button
                variant={activeTab === "transactions" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <FileText className="mr-2 h-4 w-4" />
                Transactions
              </Button>
            </Link>
            <Link href="/dashboard/reports/detailed" passHref>
              <Button
                variant={activeTab === "reports" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Reports
              </Button>
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-8">
          {activeTab === "transactions" ? (
            <div className="space-y-6 max-w-6xl mx-auto">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Transaction Filters</h2>
                <TransactionFilters
                  transactions={transactions}
                  onFilterChange={handleFilterChange}
                />
              </Card>

              <Card className="p-6">
                <TransactionTable transactions={filteredTransactions} />
              </Card>
            </div>
          ) : (
            <div className="space-y-6 max-w-6xl mx-auto">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Financial Reports</h2>
                <TransactionSummary transactions={transactions} />
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
