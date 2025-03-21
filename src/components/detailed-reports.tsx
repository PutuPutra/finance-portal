"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Transaction } from "@/types/transaction";
import { DatePicker } from "@/components/date-picker";
import { Label } from "@/components/ui/label";
import { Download, FileText, Printer } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface DetailedReportsProps {
  transactions: Transaction[];
}

export default function DetailedReports({ transactions }: DetailedReportsProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  // Filter transactions by date range
  const filteredTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (!startDate || transactionDate >= startDate) && (!endDate || transactionDate <= endDate);
  });

  // Calculate financial metrics
  const totalIncome = filteredTransactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

  // Prepare data for category breakdown
  const expensesByCategory = filteredTransactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => {
      const category = t.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const categoryData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  // Prepare data for monthly trend
  const monthlyData = getMonthlyData(filteredTransactions);

  // Prepare data for daily trend
  const dailyData = getDailyData(filteredTransactions);

  // Colors for charts
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FFEAA7",
    "#FF6B6B",
    "#4ECDC4",
    "#C7F464",
  ];

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  }

  function getMonthlyData(transactions: Transaction[]) {
    const monthMap = new Map<string, { income: number; expenses: number }>();

    // Initialize months
    const startMonth = startDate ? new Date(startDate) : new Date();
    startMonth.setDate(1);
    const endMonth = endDate ? new Date(endDate) : new Date();
    endMonth.setDate(1);

    const currentMonth = new Date(startMonth);
    while (currentMonth <= endMonth) {
      const monthKey = `${currentMonth.getFullYear()}-${String(
        currentMonth.getMonth() + 1
      ).padStart(2, "0")}`;
      monthMap.set(monthKey, { income: 0, expenses: 0 });
      currentMonth.setMonth(currentMonth.getMonth() + 1);
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
    return Array.from(monthMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => {
        const [year, monthNum] = month.split("-");
        const monthName = new Date(
          Number.parseInt(year),
          Number.parseInt(monthNum) - 1
        ).toLocaleString("default", {
          month: "short",
        });
        return {
          month: `${monthName} ${year}`,
          income: data.income,
          expenses: data.expenses,
          profit: data.income - data.expenses,
        };
      });
  }

  function getDailyData(transactions: Transaction[]) {
    const dailyMap = new Map<string, { income: number; expenses: number }>();

    // Initialize days
    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date();

    const currentDay = new Date(start);
    while (currentDay <= end) {
      const dayKey = currentDay.toISOString().split("T")[0];
      dailyMap.set(dayKey, { income: 0, expenses: 0 });
      currentDay.setDate(currentDay.getDate() + 1);
    }

    // Aggregate transaction data by day
    transactions.forEach((t) => {
      const dayKey = new Date(t.date).toISOString().split("T")[0];

      if (dailyMap.has(dayKey)) {
        const current = dailyMap.get(dayKey)!;
        if (t.amount > 0) {
          current.income += t.amount;
        } else {
          current.expenses += Math.abs(t.amount);
        }
        dailyMap.set(dayKey, current);
      }
    });

    // Convert to array and format for chart
    return Array.from(dailyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, data]) => {
        const date = new Date(day);
        return {
          date: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          income: data.income,
          expenses: data.expenses,
          balance: data.income - data.expenses,
        };
      });
  }

  function handlePrint() {
    window.print();
  }

  function handleExportPDF() {
    // In a real application, this would generate a PDF
    alert("PDF export functionality would be implemented here");
  }

  function handleExportExcel() {
    // In a real application, this would generate an Excel file
    alert("Excel export functionality would be implemented here");
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Report Parameters</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="flex items-center gap-1"
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              className="flex items-center gap-1"
            >
              <FileText className="h-4 w-4" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportExcel}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              Export Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <DatePicker date={startDate} setDate={setStartDate} />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <DatePicker date={endDate} setDate={setEndDate} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-muted-foreground mt-1">For the selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground mt-1">For the selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {formatCurrency(netProfit)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">For the selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Profit Margin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                profitMargin >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {profitMargin.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Income to profit ratio</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monthly">Monthly Analysis</TabsTrigger>
          <TabsTrigger value="daily">Daily Trends</TabsTrigger>
          <TabsTrigger value="category">Category Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Financial Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="income" name="Income" fill="#4ade80" />
                    <Bar dataKey="expenses" name="Expenses" fill="#f87171" />
                    <Bar dataKey="profit" name="Profit" fill="#60a5fa" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily">
          <Card>
            <CardHeader>
              <CardTitle>Daily Financial Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="income"
                      name="Income"
                      stroke="#4ade80"
                      activeDot={{ r: 8 }}
                    />
                    <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#f87171" />
                    <Line type="monotone" dataKey="balance" name="Balance" stroke="#60a5fa" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="category">
          <Card>
            <CardHeader>
              <CardTitle>Expense Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Top Expense Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryData
              .sort((a, b) => b.value - a.value)
              .slice(0, 5)
              .map((category, index) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span>{category.name}</span>
                    </div>
                    <span className="font-medium">{formatCurrency(category.value)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full"
                      style={{
                        width: `${(category.value / totalExpenses) * 100}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
