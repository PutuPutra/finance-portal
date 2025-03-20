"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@/types/transaction";
import { ChevronDown, Download, Printer, MoreHorizontal } from "lucide-react";

interface TransactionTableProps {
  transactions: Transaction[];
}

export default function TransactionTable({ transactions }: TransactionTableProps) {
  const [sortField, setSortField] = useState<keyof Transaction>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortField === "amount") {
      return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount;
    }

    if (sortField === "date") {
      return sortDirection === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }

    return sortDirection === "asc"
      ? String(a[sortField]).localeCompare(String(b[sortField]))
      : String(b[sortField]).localeCompare(String(a[sortField]));
  });

  function handleSort(field: keyof Transaction) {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  }

  function exportCSV() {
    const headers = ["ID", "Date", "Description", "Amount", "Type", "Category", "Status"];
    const csvData = transactions.map((t) => [
      t.id,
      formatDate(t.date),
      t.description,
      t.amount,
      t.type,
      t.category,
      t.status,
    ]);

    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `transactions_${new Date().toISOString().split("T")[0]}.csv`);
    link.click();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Transaction Data</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportCSV}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 p-0 h-auto font-medium"
                  onClick={() => handleSort("date")}
                >
                  Date
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      sortField === "date" && sortDirection === "asc" ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 p-0 h-auto font-medium"
                  onClick={() => handleSort("amount")}
                >
                  Amount
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      sortField === "amount" && sortDirection === "asc" ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 p-0 h-auto font-medium"
                  onClick={() => handleSort("type")}
                >
                  Type
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      sortField === "type" && sortDirection === "asc" ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 p-0 h-auto font-medium"
                  onClick={() => handleSort("category")}
                >
                  Category
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      sortField === "category" && sortDirection === "asc" ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 p-0 h-auto font-medium"
                  onClick={() => handleSort("status")}
                >
                  Status
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      sortField === "status" && sortDirection === "asc" ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              sortedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell
                    className={transaction.amount >= 0 ? "text-green-600" : "text-red-600"}
                  >
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit transaction</DropdownMenuItem>
                        <DropdownMenuItem>Download receipt</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
