import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers/oauth";
import type { GithubProfile } from "next-auth/providers/github";

export function GitHubAppProvider(
  options: OAuthUserConfig<GithubProfile>
): OAuthConfig<GithubProfile> {
  return {
    id: "github",
    name: "GitHub",
    type: "oauth",
    authorization: {
      url: "https://github.com/login/oauth/authorize",
    },
    token: "https://github.com/login/oauth/access_token",
    userinfo: {
      url: "https://api.github.com/user",
      async request({ client, tokens }) {
        const accessToken = tokens.access_token;

        if (!accessToken) {
          throw new Error("GitHub did not return an access token.");
        }

        const profile = (await client.userinfo(accessToken)) as GithubProfile;

        if (!profile.email) {
          const res = await fetch("https://api.github.com/user/emails", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/vnd.github+json",
              "X-GitHub-Api-Version": "2022-11-28",
            },
          });

          if (res.ok) {
            const emails = (await res.json()) as Array<{
              email: string;
              primary?: boolean;
            }>;

            profile.email = (emails.find((email) => email.primary) ?? emails[0])?.email ?? null;
          }
        }

        return {
          ...profile,
          name: profile.name ?? undefined,
          email: profile.email ?? undefined,
          image: profile.avatar_url ?? undefined,
        };
      },
    },
    profile(profile) {
      return {
        id: profile.id.toString(),
        name: profile.name ?? profile.login,
        email: profile.email,
        image: profile.avatar_url,
      };
    },
    checks: ["pkce", "state"],
    style: {
      logo: "/github.svg",
      bg: "#24292f",
      text: "#fff",
    },
    options,
  };
}
