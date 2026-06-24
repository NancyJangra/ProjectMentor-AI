"use client";

export function ExportToPdfButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-lg border border-muted/25 px-4 py-2 text-sm font-medium text-muted transition-all duration-150 hover:border-ink/50 hover:text-ink print:hidden"
    >
      Export to PDF
    </button>
  );
}
