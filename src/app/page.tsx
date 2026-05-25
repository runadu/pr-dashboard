import { redirect } from "next/navigation";
import { getServerAuth } from "@/lib/server-auth";

export default async function HomePage() {
  const { accessToken } = await getServerAuth();

  if (!accessToken) {
    redirect("/signin");
  }

  redirect("/dashboard");
}
