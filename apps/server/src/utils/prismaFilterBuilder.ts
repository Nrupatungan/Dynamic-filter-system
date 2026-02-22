import type { FilterCondition } from "../types/filter.types.js";

export const buildWhereClause = (
  filters: FilterCondition[]
) => {
  if (!filters.length) return {};

  const grouped: Record<string, FilterCondition[]> = {};

  for (const filter of filters) {
    if (!grouped[filter.field]) {
      grouped[filter.field] = [];
    }
    grouped[filter.field].push(filter);
  }

  return {
    AND: Object.entries(grouped).map(
      ([field, fieldFilters]) => ({
        OR: fieldFilters.map((filter) =>
          mapOperator(field, filter)
        )
      })
    )
  };
};

function mapOperator(
  field: string,
  filter: FilterCondition
) {
  const { operator, value } = filter;

  switch (operator) {
    case "equals":
      return {
        [field]: value
      };

    case "contains":
      return {
        [field]: {
          contains: String(value),
          mode: "insensitive"
        }
      };

    case "gt":
      return {
        [field]: {
          gt: Number(value)
        }
      };

    case "lt":
      return {
        [field]: {
          lt: Number(value)
        }
      };

    case "between":
      if (Array.isArray(value)) {
        return {
          [field]: {
            gte: value[0],
            lte: value[1]
          }
        };
      }
      return {};

    default:
      return {};
  }
}