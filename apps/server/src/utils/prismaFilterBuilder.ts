import type { FilterCondition } from "../types/filter.types.js";

const fieldMap: Record<string, string> = {
  "address.city": "city",
  "address.state": "state",
  "address.country": "country",
};

export const buildWhereClause = (
  filters: FilterCondition[]
) => {
  if (!filters.length) return {};

  const grouped: Record<string, FilterCondition[]> = {};

  for (const filter of filters) {
    const dbField = fieldMap[filter.field] ?? filter.field;

    if (!grouped[dbField]) {
      grouped[dbField] = [];
    }

    grouped[dbField].push({
      ...filter,
      field: dbField
    });
  }

  return {
    AND: Object.entries(grouped).map(
      ([field, fieldFilters]) => ({
        OR: fieldFilters.map((filter) =>
          mapOperator(filter)
        ),
      })
    ),
  };
};

function mapOperator(filter: FilterCondition) {
  const { operator, value } = filter;

  // 🔥 translate nested field to DB column
  const dbField = fieldMap[filter.field] ?? filter.field;

  switch (operator) {
    case "equals":
      return {
        [dbField]: value,
      };

    case "contains":
      return {
        [dbField]: {
          contains: String(value),
        },
      };

    case "gt":
      return {
        [dbField]: {
          gt: Number(value),
        },
      };

    case "lt":
      return {
        [dbField]: {
          lt: Number(value),
        },
      };

    case "between":
      if (Array.isArray(value)) {
        return {
          [dbField]: {
            gte: new Date(value[0] as string),
            lte: new Date(value[1] as string),
          },
        };
      }
      return {};

    default:
      return {};
  }
}