import { redirect } from "next/navigation";
import LoginForm from "@/components/login-form";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.has("auth_token");

  if (isAuthenticated) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">PT X Finance Portal</h1>
          <p className="text-gray-600 mt-2">Access transaction data for financial reporting</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
