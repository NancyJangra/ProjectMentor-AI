import { GITHUB_REQUEST_USER_AGENT, MAXIMUM_CODEBASE_ZIP_SIZE_IN_BYTES } from "@/lib/constants";

export async function fetchRepoZipBuffer(
  owner: string,
  repo: string
): Promise<Buffer> {
  const branches = ["main", "master"] as const;

  for (const branch of branches) {
    const url = `https://codeload.github.com/${owner}/${repo}/zip/refs/heads/${branch}`;

    const response = await fetch(url, {
      headers: { "User-Agent": GITHUB_REQUEST_USER_AGENT },
    });

    if (response.status === 404) {
      continue;
    }

    if (!response.ok) {
      throw new Error(
        `GitHub returned an unexpected error (HTTP ${response.status}) for ${owner}/${repo}.`
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const maxMb = MAXIMUM_CODEBASE_ZIP_SIZE_IN_BYTES / (1024 * 1024);
    if (buffer.length > MAXIMUM_CODEBASE_ZIP_SIZE_IN_BYTES) {
      throw new Error(
        `This repository's zip exceeds the ${maxMb} MB size limit.`
      );
    }

    return buffer;
  }

  throw new Error(
    `Could not find this repository, or its default branch is not 'main' or 'master'. ` +
      `Make sure the repository is public.`
  );
}
