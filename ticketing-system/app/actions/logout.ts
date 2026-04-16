"use server"

import { clearAuthCookies } from "@/lib/cookies/auth-cookies";
import { redirect } from "next/navigation";

export async function logoutUser() {
    await clearAuthCookies();
    redirect("/"); 
}