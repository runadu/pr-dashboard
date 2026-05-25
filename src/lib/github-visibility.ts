import { getPullRequestLinkedIssues, getPullRequests } from "@/lib/github";

type GitHubTargetRef = {
  owner: string;
  repo: string;
  number: number;
};

function toTargetKey({ owner, repo, number }: GitHubTargetRef) {
  return `${owner}/${repo}#${number}`;
}

export async function isAppVisibleTarget(token: string, target: GitHubTargetRef): Promise<boolean> {
  const pullRequests = await getPullRequests(token);

  if (
    pullRequests.some(
      (pullRequest) =>
        pullRequest.owner === target.owner &&
        pullRequest.repo === target.repo &&
        pullRequest.number === target.number
    )
  ) {
    return true;
  }

  const linkedIssueGroups = await Promise.all(
    pullRequests.map((pullRequest) =>
      getPullRequestLinkedIssues(token, pullRequest.owner, pullRequest.repo, pullRequest.number)
    )
  );

  const visibleTargetKeys = new Set<string>();

  linkedIssueGroups.flatMap((group) => group.issues).forEach((issue) => {
    visibleTargetKeys.add(toTargetKey(issue));
  });

  return visibleTargetKeys.has(toTargetKey(target));
}
