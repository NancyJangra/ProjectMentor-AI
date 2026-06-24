/**
 * Extracts owner and repo from any of these formats:
 *   https://github.com/owner/repo
 *   https://github.com/owner/repo/
 *   https://github.com/owner/repo.git
 *   https://github.com/owner/repo/tree/main  (extra path segments — ignored)
 *   github.com/owner/repo                    (no scheme)
 *   owner/repo                               (bare shorthand)
 *
 * Returns null for anything that doesn't match this shape.
 */
export function parseGithubRepoUrl(
  input: string
): { owner: string; repo: string } | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // If the string contains "github.com", treat it as a URL (with or without scheme).
  if (trimmed.includes("github.com")) {
    const withScheme =
      trimmed.startsWith("http://") || trimmed.startsWith("https://")
        ? trimmed
        : `https://${trimmed}`;

    let url: URL;
    try {
      url = new URL(withScheme);
    } catch {
      return null;
    }

    if (url.hostname !== "github.com") return null;

    // pathname is "/owner/repo" or "/owner/repo/tree/main" — take first two segments.
    const segments = url.pathname.split("/").filter(Boolean);
    if (segments.length < 2) return null;

    return extractOwnerRepo(segments[0], segments[1]);
  }

  // Bare "owner/repo" shorthand — no host, no scheme.
  // Accept exactly two path segments and nothing that looks like a URL path.
  const parts = trimmed.split("/").filter(Boolean);
  if (parts.length === 2) {
    return extractOwnerRepo(parts[0], parts[1]);
  }

  return null;
}

function extractOwnerRepo(
  rawOwner: string,
  rawRepo: string
): { owner: string; repo: string } | null {
  const owner = rawOwner;
  const repo = rawRepo.replace(/\.git$/i, "");

  if (!isValidGithubSegment(owner) || !isValidGithubSegment(repo)) {
    return null;
  }

  return { owner, repo };
}

function isValidGithubSegment(segment: string): boolean {
  return segment.length > 0 && /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(segment);
}
