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
  // Calculate total income, expenses, and balance
  const financialSummary = useMemo(() => {
    const income = transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const balance = income - expenses;

    return { income, expenses, balance };
  }, [transactions]);

  // Prepare data for category breakdown chart
  const categoryData = useMemo(() => {
    const categoryMap = new Map<string, number>();

    transactions.forEach((t) => {
      if (t.amount < 0) {
        // Only consider expenses for category breakdown
        const currentAmount = categoryMap.get(t.category) || 0;
        categoryMap.set(t.category, currentAmount + Math.abs(t.amount));
      }
    });

    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Prepare data for monthly trend chart
  const monthlyData = useMemo(() => {
    const monthMap = new Map<string, { income: number; expenses: number }>();

    // Initialize last 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today);
      d.setMonth(d.getMonth() - i);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthMap.set(monthKey, { income: 0, expenses: 0 });
    }

    // Aggregate transaction data by month
    transactions.forEach((t) => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (monthMap.has(monthKey)) {
        const current = monthMap.get(monthKey)!;
        if (t.amount > 0) {
          current.income += t.amount;
        } else {
          current.expenses += Math.abs(t.amount);
        }
        monthMap.set(monthKey, current);
      }
    });

    // Convert to array and format for chart
    return Array.from(monthMap.entries()).map(([month, data]) => ({
      month: month.split("-")[1],
      income: data.income,
      expenses: data.expenses,
      net: data.income - data.expenses,
    }));
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
              <p className="text-sm font-medium text-muted-foreground">Total Income</p>
              <h3 className="text-2xl font-bold text-green-600 mt-2">
                {formatCurrency(financialSummary.income)}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
              <h3 className="text-2xl font-bold text-red-600 mt-2">
                {formatCurrency(financialSummary.expenses)}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Net Balance</p>
              <h3
                className={`text-2xl font-bold mt-2 ${
                  financialSummary.balance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(financialSummary.balance)}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly trend chart */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Monthly Financial Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label: string) => `Month ${label}`}
                />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#4ade80" />
                <Bar dataKey="expenses" name="Expenses" fill="#f87171" />
                <Bar dataKey="net" name="Net" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category breakdown chart */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Expense Categories</h3>
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
                  label={({ name, percent }: { name: string; percent: number }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
