import type { FilterCondition } from "../types/filter.types.js";

const isEmpty = (val: unknown) =>
  val === undefined || val === null || val === "";

const parseNumber = (val: unknown) => {
  const num = Number(val);
  return isNaN(num) ? null : num;
};

const parseDate = (val: unknown) => {
  const date = new Date(String(val));
  return isNaN(date.getTime()) ? null : date;
};

const getNestedValue = (obj: any, path: string) =>
  path.split(".").reduce((acc, key) => acc?.[key], obj);

export const applyFilters = <T>(
  data: T[],
  filters: FilterCondition[]
): T[] => {
  if (!filters.length) return data;

  const grouped = filters.reduce((acc, filter) => {
    if (!filter.field) return acc;

    if (!acc[filter.field]) {
      acc[filter.field] = [];
    }

    acc[filter.field].push(filter);
    return acc;
  }, {} as Record<string, FilterCondition[]>);

  return data.filter((item) =>
    Object.values(grouped).every((fieldFilters) =>
      fieldFilters.some((filter) =>
        evaluateFilter(item, filter)
      )
    )
  );
};

function evaluateFilter<T>(
  item: T,
  filter: FilterCondition
): boolean {
  const fieldValue = getNestedValue(item, filter.field);
  if (fieldValue == null) return false;

  const value = filter.value;

  switch (filter.operator) {
    case "equals":
      return String(fieldValue).toLowerCase() ===
        String(value).toLowerCase();

    case "contains":
      return String(fieldValue)
        .toLowerCase()
        .includes(String(value).toLowerCase());

    case "gt":
      return parseNumber(fieldValue)! >
        parseNumber(value)!;

    case "lt":
      return parseNumber(fieldValue)! <
        parseNumber(value)!;

    case "between":
      if (!Array.isArray(value)) return true;

      const [min, max] = value;

      const numField = parseNumber(fieldValue);
      const numMin = parseNumber(min);
      const numMax = parseNumber(max);

      if (
        numField !== null &&
        numMin !== null &&
        numMax !== null
      ) {
        return numField >= numMin &&
               numField <= numMax;
      }

      const dateField = parseDate(fieldValue);
      const dateMin = parseDate(min);
      const dateMax = parseDate(max);

      if (
        dateField &&
        dateMin &&
        dateMax
      ) {
        return (
          dateField >= dateMin &&
          dateField <= dateMax
        );
      }

      return false;

    case "in":
      return Array.isArray(fieldValue) &&
        Array.isArray(value) &&
        value.some((v) =>
          fieldValue.includes(v)
        );

    case "notIn":
      return Array.isArray(fieldValue) &&
        Array.isArray(value) &&
        !value.some((v) =>
          fieldValue.includes(v)
        );

    default:
      return true;
  }
}