type ContributionDay = {
  contributionCount: number;
  date: string;
};

type ContributionCalendar = {
  weeks: { contributionDays: ContributionDay[] }[];
};

type GraphQLUser = {
  contributionsCollection: {
    contributionCalendar: ContributionCalendar;
  };
};

type GraphQLResponse = {
  data?: {
    user?: GraphQLUser | null;
    viewer?: GraphQLUser;
  };
  errors?: { message: string }[];
};

const CONTRIBUTION_FIELDS = `
  contributionsCollection {
    contributionCalendar {
      weeks {
        contributionDays {
          contributionCount
          date
        }
      }
    }
  }
`;

export async function getGitHubStats(username = process.env.GITHUB_USERNAME?.trim()) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is not configured.");

  const query = username
    ? `query($login: String!) { user(login: $login) { ${CONTRIBUTION_FIELDS} } }`
    : `query { viewer { ${CONTRIBUTION_FIELDS} } }`;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      ...(username ? { variables: { login: username } } : {}),
    }),
    next: { revalidate: 3600 },
  });

  if (!response.ok) throw new Error(`GitHub GraphQL request failed (${response.status}).`);

  const result = (await response.json()) as GraphQLResponse;
  if (result.errors?.length) throw new Error("GitHub GraphQL returned an error.");

  const user = username ? result.data?.user : result.data?.viewer;
  const days = user?.contributionsCollection.contributionCalendar.weeks.flatMap(
    (week) => week.contributionDays,
  );
  if (!days) throw new Error("GitHub did not return contribution data.");

  return { currentStreak: calculateCurrentStreak(days) };
}

export function calculateCurrentStreak(days: ContributionDay[]): number {
  const newestFirst = [...days].reverse();
  if (newestFirst.length === 0) return 0;

  const startIndex = newestFirst[0].contributionCount === 0 ? 1 : 0;
  let streak = 0;

  for (let index = startIndex; index < newestFirst.length; index += 1) {
    if (newestFirst[index].contributionCount === 0) break;
    streak += 1;
  }

  return streak;
}