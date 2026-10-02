export interface Snippet {
  id: string;
  ownerId: string;
  language: string;
  code: string;
  visibility: "public" | "private";
}

export class SnippetServiceError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
  ) {
    super(message);
  }
}

export const fetchAccessibleSnippet = async (
  snippetId: string,
  authorization: string,
): Promise<Snippet> => {
  const baseUrl = process.env.SNIPPET_SERVICE_URL ?? "http://localhost:3003";
  let response: Response;

  try {
    response = await fetch(`${baseUrl}/snippet/${encodeURIComponent(snippetId)}`, {
      headers: { authorization },
      signal: AbortSignal.timeout(5_000),
    });
  } catch {
    throw new SnippetServiceError("Snippet service is unavailable", 502);
  }

  if (response.status === 404) {
    // The snippet service intentionally returns 404 for inaccessible private snippets.
    throw new SnippetServiceError("Snippet not found", 404);
  }
  if (!response.ok) {
    throw new SnippetServiceError("Snippet service request failed", 502);
  }

  const body = (await response.json()) as { snippet?: Snippet };
  if (
    !body.snippet?.id ||
    typeof body.snippet.code !== "string" ||
    !body.snippet.language
  ) {
    throw new SnippetServiceError("Snippet service returned an invalid response", 502);
  }
  return body.snippet;
};
