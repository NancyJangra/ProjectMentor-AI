export function parseJsonResponse<ExpectedShape>(
  rawResponseText: string
): ExpectedShape {
  const textWithoutMarkdownFences = rawResponseText
    .trim()
    .replace(/^```(json)?/i, "")
    .replace(/```$/, "")
    .trim();

  try {
    return JSON.parse(textWithoutMarkdownFences) as ExpectedShape;
  } catch (parsingError) {
    throw new Error(
      `The AI model returned a response that wasn't valid JSON. Raw response: ${rawResponseText}`
    );
  }
}
