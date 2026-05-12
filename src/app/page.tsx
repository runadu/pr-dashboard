import { redirect } from "next/navigation";
import { buildSessionRequiredSignInPath } from "@/lib/github-session";
import { getServerAuth } from "@/lib/server-auth";

export default async function HomePage() {
  const { accessToken } = await getServerAuth();

  if (!accessToken) {
    redirect(buildSessionRequiredSignInPath("/dashboard"));
  }

  redirect("/dashboard");
}
