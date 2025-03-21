"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createTransaction } from "@/actions/transactions";
import { ArrowLeft, Save } from "lucide-react";
import { DatePicker } from "@/components/date-picker";

export default function NewTransactionForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [error, setError] = useState("");

  const transactionTypes = ["Income", "Expense", "Transfer", "Investment"];
  const categories = [
    "Salary",
    "Rent",
    "Utilities",
    "Office Supplies",
    "Marketing",
    "Travel",
    "Consulting",
    "Software",
    "Hardware",
    "Taxes",
    "Insurance",
    "Maintenance",
    "Other",
  ];

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError("");

    try {
      // Add the date from the date picker to the form data
      formData.append("date", date?.toISOString() || new Date().toISOString());

      const result = await createTransaction(formData);
      if (result.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(result.error || "Failed to create transaction. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transaction Details</CardTitle>
        <CardDescription>Enter the details of the new transaction</CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Enter transaction description"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (IDR)</Label>
              <Input id="amount" name="amount" type="number" placeholder="Enter amount" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transaction-date">Date</Label>
              <DatePicker date={date} setDate={setDate} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Transaction Type</Label>
              <Select name="type" defaultValue="Expense">
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {transactionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" defaultValue="Office Supplies">
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue="Completed">
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Additional notes about this transaction"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">Reference Number</Label>
            <Input id="reference" name="reference" placeholder="Invoice or reference number" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {isLoading ? "Saving..." : "Save Transaction"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
