"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { Transaction } from "@/types/transaction";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface TransactionSummaryProps {
  transactions: Transaction[];
}

export default function TransactionSummary({ transactions }: TransactionSummaryProps) {
  // Calculate total sales, refunds, and net revenue
  const financialSummary = useMemo(() => {
    const sales = transactions
      .filter((t) => t.status !== "Refunded" && t.status !== "Cancelled")
      .reduce((sum, t) => sum + t.amount, 0);

    const refunds = transactions
      .filter((t) => t.status === "Refunded")
      .reduce((sum, t) => sum + t.amount, 0);

    const cancelled = transactions
      .filter((t) => t.status === "Cancelled")
      .reduce((sum, t) => sum + t.amount, 0);

    const netRevenue = sales - refunds;
    const totalFees = transactions
      .filter((t) => t.status !== "Cancelled")
      .reduce((sum, t) => sum + t.fee, 0);
    const netProfit = netRevenue - totalFees;

    return { sales, refunds, cancelled, netRevenue, totalFees, netProfit };
  }, [transactions]);

  // Prepare data for product category breakdown chart
  const categoryData = useMemo(() => {
    const categoryMap = new Map<string, number>();

    transactions
      .filter((t) => t.status !== "Refunded" && t.status !== "Cancelled")
      .forEach((t) => {
        const currentAmount = categoryMap.get(t.category) || 0;
        categoryMap.set(t.category, currentAmount + t.amount);
      });

    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Prepare data for payment method breakdown
  const paymentMethodData = useMemo(() => {
    const methodMap = new Map<string, number>();

    transactions
      .filter((t) => t.status !== "Refunded" && t.status !== "Cancelled")
      .forEach((t) => {
        const currentAmount = methodMap.get(t.paymentMethod) || 0;
        methodMap.set(t.paymentMethod, currentAmount + t.amount);
      });

    return Array.from(methodMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Prepare data for daily trend chart
  const dailyData = useMemo(() => {
    const dailyMap = new Map<string, { sales: number; refunds: number; net: number }>();

    // Get date range
    const dates = transactions.map((t) => new Date(t.date).toISOString().split("T")[0]);
    const minDate = new Date(Math.min(...dates.map((d) => new Date(d).getTime())));
    const maxDate = new Date(Math.max(...dates.map((d) => new Date(d).getTime())));

    // Initialize all days in range
    const currentDate = new Date(minDate);
    while (currentDate <= maxDate) {
      const dateKey = currentDate.toISOString().split("T")[0];
      dailyMap.set(dateKey, { sales: 0, refunds: 0, net: 0 });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Aggregate transaction data by day
    transactions.forEach((t) => {
      const dateKey = new Date(t.date).toISOString().split("T")[0];
      const current = dailyMap.get(dateKey) || { sales: 0, refunds: 0, net: 0 };

      if (t.status === "Refunded") {
        current.refunds += t.amount;
      } else if (t.status !== "Cancelled") {
        current.sales += t.amount;
      }

      current.net = current.sales - current.refunds;
      dailyMap.set(dateKey, current);
    });

    // Convert to array and format for chart
    return Array.from(dailyMap.entries())
      .map(([date, data]) => ({
        date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        sales: data.sales,
        refunds: data.refunds,
        net: data.net,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [transactions]);

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  }

  return (
    <div className="space-y-8">
      {/* Financial summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
              <h3 className="text-2xl font-bold text-green-600 mt-2">
                {formatCurrency(financialSummary.sales)}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Total Refunds</p>
              <h3 className="text-2xl font-bold text-red-600 mt-2">
                {formatCurrency(financialSummary.refunds)}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Net Revenue</p>
              <h3
                className={`text-2xl font-bold mt-2 ${
                  financialSummary.netRevenue >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(financialSummary.netRevenue)}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Platform Fees</p>
              <h3 className="text-2xl font-bold text-amber-600 mt-2">
                {formatCurrency(financialSummary.totalFees)}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Net Profit</p>
              <h3
                className={`text-2xl font-bold mt-2 ${
                  financialSummary.netProfit >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(financialSummary.netProfit)}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Cancelled Transactions</p>
              <h3 className="text-2xl font-bold text-yellow-600 mt-2">
                {formatCurrency(financialSummary.cancelled)}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily trend chart */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Daily Sales Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Bar dataKey="sales" name="Sales" fill="#4ade80" />
                <Bar dataKey="refunds" name="Refunds" fill="#f87171" />
                <Bar dataKey="net" name="Net" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category breakdown chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Product Categories</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
