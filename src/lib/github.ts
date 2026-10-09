import { cacheLife } from "next/cache";

export type GitHubSummary = {
  publicRepos: number;
  followers: number;
  languages: { name: string; count: number }[];
  recent: { name: string; url: string; description: string | null; language: string | null; pushedAt: string }[];
};

type Repo = {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  pushed_at: string;
  fork: boolean;
};

export async function getGitHubSummary(username: string): Promise<GitHubSummary | null> {
  "use cache";
  cacheLife("hours");

  const api = process.env.GITHUB_API_URL ?? "https://api.github.com";
  const headers: HeadersInit = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`${api}/users/${username}`, { headers }),
      fetch(`${api}/users/${username}/repos?per_page=100&sort=pushed`, { headers }),
    ]);
    if (!userRes.ok || !reposRes.ok) return null;

    const user = (await userRes.json()) as { public_repos: number; followers: number };
    const repos = ((await reposRes.json()) as Repo[]).filter((r) => !r.fork && r.name !== username);

    const counts = new Map<string, number>();
    for (const r of repos) if (r.language) counts.set(r.language, (counts.get(r.language) ?? 0) + 1);

    return {
      publicRepos: user.public_repos,
      followers: user.followers,
      languages: [...counts].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 6),
      recent: repos.slice(0, 4).map((r) => ({
        name: r.name,
        url: r.html_url,
        description: r.description,
        language: r.language,
        pushedAt: r.pushed_at,
      })),
    };
  } catch {
    return null;
  }
}
