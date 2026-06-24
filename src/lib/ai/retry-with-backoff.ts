import {
  FALLBACK_RETRY_DELAY_MS,
  MAX_RETRY_ATTEMPTS,
} from "@/lib/constants";

export async function callWithRetry<T>(
  makeApiCall: () => Promise<T>
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRY_ATTEMPTS; attempt++) {
    try {
      return await makeApiCall();
    } catch (error) {
      if (!isRateLimitError(error)) {
        throw error;
      }

      lastError = error;

      if (attempt === MAX_RETRY_ATTEMPTS) {
        break;
      }

      const delayMs = parseRetryDelay(error);
      await sleep(delayMs);
    }
  }

  throw lastError;
}

function isRateLimitError(error: unknown): boolean {
  if (typeof error === "object" && error !== null && "status" in error) {
    return (error as { status: number }).status === 429;
  }
  const msg = error instanceof Error ? error.message : String(error);
  return msg.toLowerCase().includes("rate limit") || msg.toLowerCase().includes("rate_limit");
}

function parseRetryDelay(error: unknown): number {
  if (typeof error === "object" && error !== null && "headers" in error) {
    const headers = (error as { headers?: { get?: (k: string) => string | null } }).headers;
    const retryAfter = headers?.get?.("retry-after");
    if (retryAfter) {
      const seconds = parseInt(retryAfter, 10);
      if (!isNaN(seconds)) return seconds * 1000 + 1000;
    }
  }

  const msg = error instanceof Error ? error.message : String(error);
  const match = msg.match(/(?:try again in|retry after)\s*(\d+)s/i);
  if (match) return parseInt(match[1], 10) * 1000 + 1000;

  return FALLBACK_RETRY_DELAY_MS;
}

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
