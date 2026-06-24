import mammoth from "mammoth";

export async function extractTextFromDocx(fileBuffer: Buffer): Promise<string> {
  const conversionResult = await mammoth.extractRawText({ buffer: fileBuffer });
  return conversionResult.value;
}
