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
  limit: number
) => {
  const res = await fetch(
    `http://localhost:5000/employees/filter?page=${page}&limit=${limit}`,
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