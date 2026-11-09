export type GitHubProfile = {
  login: string;
  name: string | null;
  avatarUrl: string;
  htmlUrl: string;
  publicRepos: number;
  followers: number;
};

type GitHubUserResponse = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
};

export async function getGitHubProfile(): Promise<GitHubProfile | null> {
  const username = process.env.GITHUB_USERNAME?.trim();
  const token = process.env.GITHUB_TOKEN;
  if (!username && !token) return null;

  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const endpoint = username
      ? `/users/${encodeURIComponent(username)}`
      : "/user";
    const response = await fetch(`https://api.github.com${endpoint}`, {
      headers,
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;

    const user = (await response.json()) as GitHubUserResponse;
    return {
      login: user.login,
      name: user.name,
      avatarUrl: user.avatar_url,
      htmlUrl: user.html_url,
      publicRepos: user.public_repos,
      followers: user.followers,
    };
  } catch {
    return null;
  }
}