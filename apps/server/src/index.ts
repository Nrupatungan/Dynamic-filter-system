import express from "express";
import cors from "cors";
import { employees } from "./data/employees";
import { applyFilters } from "./utils/filterEngine";
import type { FilterCondition } from "./types/filter.types";


const app = express();

app.use(cors());
app.use(express.json());

app.get("/employees", (req, res) => {
  res.json(employees);
});

app.post("/employees/filter", (req, res) => {
  const filters: FilterCondition[] = req.body?.filters ?? [];

  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);

  const filtered = applyFilters(employees, filters);

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginated = filtered.slice(start, end);

  res.json({
    data: paginated,
    total: filtered.length,
    page,
    limit
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});