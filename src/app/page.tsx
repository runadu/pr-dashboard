import { redirect } from "next/navigation";
import { getServerAuth } from "@/lib/server-auth";

export default async function HomePage() {
  const { accessToken, githubLogin } = await getServerAuth();

  if (!accessToken || !githubLogin) {
    redirect("/signin");
  }

  redirect("/dashboard");
}
