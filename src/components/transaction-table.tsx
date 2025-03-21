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
import { ChevronDown, Download, Printer, MoreHorizontal, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TransactionTableProps {
  transactions: Transaction[];
}

export default function TransactionTable({ transactions }: TransactionTableProps) {
  const [sortField, setSortField] = useState<keyof Transaction>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  function viewTransactionDetails(transaction: Transaction) {
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
  }

  function exportCSV() {
    const headers = [
      "ID",
      "Date",
      "Product",
      "Amount",
      "Nett Amount",
      "Fee",
      "Payment Method",
      "Status",
      "Device ID",
    ];
    const csvData = transactions.map((t) => [
      t.id,
      formatDate(t.date),
      t.productName,
      t.amount,
      t.nettAmount,
      t.fee,
      t.paymentMethod,
      t.status,
      t.deviceId,
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

      <div className="rounded-md border overflow-x-auto">
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
              <TableHead>Product</TableHead>
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
                  onClick={() => handleSort("paymentMethod")}
                >
                  Payment
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      sortField === "paymentMethod" && sortDirection === "asc" ? "rotate-180" : ""
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
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              sortedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell>{transaction.productName}</TableCell>
                  <TableCell
                    className={
                      transaction.status === "Refunded" ? "text-red-600" : "text-green-600"
                    }
                  >
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>{transaction.paymentMethod}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === "Refunded"
                          ? "bg-red-100 text-red-800"
                          : transaction.status === "Cancelled"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
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
                        <DropdownMenuItem onClick={() => viewTransactionDetails(transaction)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View details
                        </DropdownMenuItem>
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

      {/* Transaction Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Transaction ID</h3>
                  <p className="mt-1">{selectedTransaction.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date</h3>
                  <p className="mt-1">{formatDate(selectedTransaction.date)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        selectedTransaction.status === "Refunded"
                          ? "bg-red-100 text-red-800"
                          : selectedTransaction.status === "Cancelled"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {selectedTransaction.status}
                    </span>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Device ID</h3>
                  <p className="mt-1">{selectedTransaction.deviceId}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-2">Product Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Product Name</h3>
                    <p className="mt-1">{selectedTransaction.productName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Category</h3>
                    <p className="mt-1">{selectedTransaction.category}</p>
                  </div>
                  {selectedTransaction.rawData.product.column && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Column</h3>
                      <p className="mt-1">{selectedTransaction.rawData.product.column}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-2">Payment Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Amount</h3>
                    <p className="mt-1">{formatCurrency(selectedTransaction.amount)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Nett Amount</h3>
                    <p className="mt-1">{formatCurrency(selectedTransaction.nettAmount)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Fee</h3>
                    <p className="mt-1">{formatCurrency(selectedTransaction.fee)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Payment Method</h3>
                    <p className="mt-1">{selectedTransaction.paymentMethod}</p>
                  </div>
                  {typeof selectedTransaction.rawData.payment.detail === "object" &&
                    selectedTransaction.rawData.payment.detail.issuer && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Issuer</h3>
                        <p className="mt-1">{selectedTransaction.rawData.payment.detail.issuer}</p>
                      </div>
                    )}
                  {typeof selectedTransaction.rawData.payment.detail === "object" &&
                    selectedTransaction.rawData.payment.detail.transaction_id && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Transaction ID</h3>
                        <p className="mt-1">
                          {selectedTransaction.rawData.payment.detail.transaction_id}
                        </p>
                      </div>
                    )}
                </div>
              </div>

              {selectedTransaction.status === "Refunded" && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-2">Refund Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedTransaction.rawData.detail.refund_time && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Refund Time</h3>
                        <p className="mt-1">
                          {new Date(
                            selectedTransaction.rawData.detail.refund_time
                          ).toLocaleString()}
                        </p>
                      </div>
                    )}
                    {selectedTransaction.rawData.detail.refund_amount && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Refund Amount</h3>
                        <p className="mt-1">
                          {formatCurrency(selectedTransaction.rawData.detail.refund_amount)}
                        </p>
                      </div>
                    )}
                    {selectedTransaction.rawData.detail.refund_reason && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Refund Reason</h3>
                        <p className="mt-1">{selectedTransaction.rawData.detail.refund_reason}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
