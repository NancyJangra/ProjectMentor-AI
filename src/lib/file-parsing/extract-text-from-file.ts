import { extractTextFromPdf } from "./extract-text-from-pdf";
import { extractTextFromDocx } from "./extract-text-from-docx";
import { extractTextFromPlainTextFile } from "./extract-text-from-plain-text-file";
import type { ExtractedDocumentText } from "@/types/project-analysis";

export async function extractTextFromFile(
  fileBuffer: Buffer,
  originalFileName: string
): Promise<ExtractedDocumentText> {
  const fileExtension = getLowercaseFileExtension(originalFileName);

  let extractedText: string;

  if (fileExtension === ".pdf") {
    extractedText = await extractTextFromPdf(fileBuffer);
  } else if (fileExtension === ".docx") {
    extractedText = await extractTextFromDocx(fileBuffer);
  } else if (fileExtension === ".txt" || fileExtension === ".md") {
    extractedText = await extractTextFromPlainTextFile(fileBuffer);
  } else {
    throw new Error(
      `Unsupported file type "${fileExtension}". Please upload a PDF, DOCX, TXT, or MD file.`
    );
  }

  const trimmedText = extractedText.trim();

  if (trimmedText.length === 0) {
    throw new Error(
      `No readable text was found in "${originalFileName}". The file may be empty, image-only, or corrupted.`
    );
  }

  return {
    originalFileName,
    text: trimmedText,
  };
}

function getLowercaseFileExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return "";
  }
  return fileName.slice(lastDotIndex).toLowerCase();
}
