/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Transaction } from "@/types/transaction";
import { Search, X } from "lucide-react";

interface TransactionFiltersProps {
  transactions: Transaction[];
  onFilterChange: (filtered: Transaction[]) => void;
}

export default function TransactionFilters({
  transactions,
  onFilterChange,
}: TransactionFiltersProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [category, setCategory] = useState("all");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");

  // Get unique categories, payment methods, and statuses for filter options
  const categories = [...new Set(transactions.map((t) => t.category))].sort();
  const paymentMethods = [...new Set(transactions.map((t) => t.paymentMethod))].sort();
  const statuses = [...new Set(transactions.map((t) => t.status))].sort();

  useEffect(() => {
    applyFilters();
  }, [startDate, endDate, paymentMethod, category, minAmount, maxAmount, searchTerm, status]);

  function applyFilters() {
    let filtered = [...transactions];

    if (startDate) {
      filtered = filtered.filter((t) => new Date(t.date) >= new Date(startDate));
    }

    if (endDate) {
      const endDateObj = new Date(endDate);
      endDateObj.setHours(23, 59, 59, 999);
      filtered = filtered.filter((t) => new Date(t.date) <= endDateObj);
    }

    if (paymentMethod && paymentMethod !== "all") {
      filtered = filtered.filter((t) => t.paymentMethod === paymentMethod);
    }

    if (category && category !== "all") {
      filtered = filtered.filter((t) => t.category === category);
    }

    if (status && status !== "all") {
      filtered = filtered.filter((t) => t.status === status);
    }

    if (minAmount) {
      filtered = filtered.filter((t) => t.amount >= Number(minAmount));
    }

    if (maxAmount) {
      filtered = filtered.filter((t) => t.amount <= Number(maxAmount));
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.productName.toLowerCase().includes(term) ||
          t.id.toLowerCase().includes(term) ||
          t.deviceId.toLowerCase().includes(term)
      );
    }

    onFilterChange(filtered);
  }

  function resetFilters() {
    setStartDate("");
    setEndDate("");
    setPaymentMethod("all");
    setCategory("all");
    setStatus("all");
    setMinAmount("");
    setMaxAmount("");
    setSearchTerm("");
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by product name, ID, or device..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1 h-8 w-8"
            onClick={() => setSearchTerm("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date-range">Date Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start date"
            />
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End date"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment-method">Payment Method</Label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger id="payment-method">
              <SelectValue placeholder="All payment methods" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All payment methods</SelectItem>
              {paymentMethods.map((method) => (
                <SelectItem key={method} value={method}>
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Product Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Transaction Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount-range">Amount Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              id="min-amount"
              type="number"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              placeholder="Min amount"
            />
            <Input
              id="max-amount"
              type="number"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              placeholder="Max amount"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={resetFilters} className="flex items-center gap-1">
          <X className="h-4 w-4" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
