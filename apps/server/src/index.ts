import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";
import { buildWhereClause } from "./utils/prismaFilterBuilder.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://dynamic-filt.netlify.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    }
  })
);

app.use(express.json());

app.get("/employees", async (_, res) => {
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

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on PORT:${PORT}`);
});