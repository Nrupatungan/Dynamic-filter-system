import { getNestedValue } from "./nestedAccessor";

export const exportToCSV = <T>(
  data: T[],
  columns: { label: string; field: string }[],
  filename = "export.csv"
) => {
  if (!data.length) return;

  // Create headers
  const headers = columns.map((col) => col.label);

  // Create rows
  const rows = data.map((row) =>
    columns.map((col) => {
      const value = getNestedValue(row, col.field);

      if (Array.isArray(value)) {
        return `"${value.join(", ")}"`;
      }

      if (value === null || value === undefined)
        return "";

      return `"${String(value).replace(/"/g, '""')}"`;
    })
  );

  const csvContent = [
    headers.join(","),
    ...rows.map((r) => r.join(","))
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
