import type { FilterCondition } from "../types/filter.types";

export const fetchEmployees = async () => {
  const res = await fetch("http://localhost:5000/employees");

  if (!res.ok) {
    throw new Error("Failed to fetch employees");
  }

  return res.json();
};


export const fetchFilteredEmployees = async (
  filters: FilterCondition[],
  page: number,
  limit: number,
  orderBy?: string,
  order?: "asc" | "desc"
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit)
  });

  if (orderBy) {
    params.append("orderBy", orderBy);
    params.append("order", order ?? "asc");
  }

  const res = await fetch(
    `http://localhost:5000/employees/filter?${params.toString()}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ filters })
    }
  );

  if (!res.ok)
    throw new Error("Filter request failed");

  return res.json();
};