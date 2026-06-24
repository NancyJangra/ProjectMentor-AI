import AdmZip from "adm-zip";

export function findReadmeText(zipBuffer: Buffer): string | null {
  const zip = new AdmZip(zipBuffer);

  for (const entry of zip.getEntries()) {
    if (entry.isDirectory) continue;

    const parts = entry.entryName.split("/");
    if (parts.length !== 2) continue;

    const fileName = parts[1];
    if (/^readme(\.[a-z0-9]+)?$/i.test(fileName)) {
      return entry.getData().toString("utf-8");
    }
  }

  return null;
}
