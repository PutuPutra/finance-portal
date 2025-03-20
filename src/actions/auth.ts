"use server";

import { cookies } from "next/headers";

export async function login(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { success: false, error: "Username and password are required" };
  }

  try {
    if (username === "user" && password === "password") {
      (await cookies()).set("auth_token", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      });

      return { success: true };
    } else {
      return { success: false, error: "Invalid username or password" };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Authentication failed" };
  }
}

export async function logout() {
  (await cookies()).delete("auth_token");
  return { success: true };
}

export async function checkAuth() {
  const cookieStore = cookies();
  return (await cookieStore).has("auth_token");
}
