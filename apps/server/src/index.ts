import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma";
import { buildWhereClause } from "./utils/prismaFilterBuilder";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/employees", async (req, res) => {
  const employees = await prisma.employee.findMany();
  res.json(employees);
});

app.post("/employees/filter", async (req, res) => {
  const { filters = [] } = req.body;

  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);

  const orderByField = req.query.orderBy as string | undefined;
  const orderDirection =
    req.query.order === "desc" ? "desc" : "asc";

  const skip = (page - 1) * limit;

  const where = buildWhereClause(filters);

  const orderBy = orderByField
    ? { [orderByField]: orderDirection }
    : undefined;

  const [data, total] = await Promise.all([
    prisma.employee.findMany({
      where,
      orderBy,
      skip,
      take: limit
    }),
    prisma.employee.count({ where })
  ]);

  res.json({
    data,
    total,
    page,
    limit
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});