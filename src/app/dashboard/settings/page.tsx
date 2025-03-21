import { redirect } from "next/navigation";
import { checkAuth, getUsername } from "@/actions/auth";
import UserSettings from "@/components/user-settings";

export default async function SettingsPage() {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    redirect("/");
  }

  const username = await getUsername();

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">User Settings</h1>
      <UserSettings username={username} />
    </div>
  );
}
