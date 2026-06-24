export async function extractTextFromPlainTextFile(
  fileBuffer: Buffer
): Promise<string> {
  return fileBuffer.toString("utf-8");
}
