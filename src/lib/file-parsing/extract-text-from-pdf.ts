import path from "node:path";

export async function extractTextFromPdf(fileBuffer: Buffer): Promise<string> {
  const pdfjsLibrary = await import("pdfjs-dist/legacy/build/pdf.mjs");

  const standardFontDataUrl = path.join(
    process.cwd(),
    "node_modules/pdfjs-dist/standard_fonts/"
  );

  const pdfDocument = await pdfjsLibrary.getDocument({
    data: new Uint8Array(fileBuffer),
    standardFontDataUrl,
  }).promise;

  const textByPage: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber++) {
    const page = await pdfDocument.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    textByPage.push(pageText);
  }

  return textByPage.join("\n\n");
}
