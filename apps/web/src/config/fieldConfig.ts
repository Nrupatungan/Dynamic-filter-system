import type { FieldConfig } from "../types/filter.types";

export const fieldConfig: FieldConfig[] = [
  { label: "Name", field: "name", type: "text" },
  { label: "Email", field: "email", type: "text" },
  { label: "Department", field: "department", type: "singleSelect", options: ["Engineering", "HR", "Finance", "Marketing"] },
  { label: "Role", field: "role", type: "text" },
  { label: "Salary", field: "salary", type: "currency" },
  { label: "Join Date", field: "joinDate", type: "date" },
  { label: "Active", field: "isActive", type: "boolean" },
  { label: "Skills", field: "skills", type: "multiSelect", options: ["React", "TypeScript", "Node.js", "GraphQL"] },
  { label: "City", field: "address.city", type: "text" },
  { label: "Projects", field: "projects", type: "number" },
  { label: "Performance Rating", field: "performanceRating", type: "number" }
];
