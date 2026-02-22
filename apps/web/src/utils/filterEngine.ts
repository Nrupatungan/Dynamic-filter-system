/* eslint-disable @typescript-eslint/no-explicit-any */

import { fieldConfig } from "../config/fieldConfig";
import type { FilterCondition } from "../types/filter.types";
import { getNestedValue } from "./nestedAccessor";

const isEmpty = (val: any) =>
  val === undefined || val === null || val === "";

const parseNumber = (val: any) => {
  const num = Number(val);
  return isNaN(num) ? null : num;
};

const parseDate = (val: any) => {
  const date = new Date(val);
  return isNaN(date.getTime()) ? null : date;
};

const evaluateFilter = <T>(
  item: T,
  filter: FilterCondition
): boolean => {
  const fieldValue = getNestedValue(item, filter.field);
  if (fieldValue === undefined || fieldValue === null)
    return false;

  const config = fieldConfig.find(
    (f) => f.field === filter.field
  );

  const fieldType = config?.type;
  if (!fieldType) return true;

  const filterValue = filter.value;

  switch (fieldType) {
    case "text": {
      if (isEmpty(filterValue)) return true;

      const fieldStr = String(fieldValue).toLowerCase();
      const filterStr = String(filterValue).toLowerCase();

      switch (filter.operator) {
        case "equals":
          return fieldStr === filterStr;
        case "contains":
          return fieldStr.includes(filterStr);
        case "startsWith":
          return fieldStr.startsWith(filterStr);
        case "endsWith":
          return fieldStr.endsWith(filterStr);
        case "notContains":
          return !fieldStr.includes(filterStr);
        default:
          return true;
      }
    }

    case "number": {
      const numField = parseNumber(fieldValue);
      const numFilter = parseNumber(filterValue);
      if (numField === null || numFilter === null)
        return false;

      switch (filter.operator) {
        case "equals":
          return numField === numFilter;
        case "gt":
          return numField > numFilter;
        case "lt":
          return numField < numFilter;
        case "gte":
          return numField >= numFilter;
        case "lte":
          return numField <= numFilter;
        default:
          return true;
      }
    }

    case "currency": {
      if (!Array.isArray(filterValue))
        return true;

      const [min, max] = filterValue;
      const numField = parseNumber(fieldValue);
      const numMin = parseNumber(min);
      const numMax = parseNumber(max);

      if (
        numField === null ||
        numMin === null ||
        numMax === null
      )
        return false;

      return numField >= numMin && numField <= numMax;
    }

    case "date": {
      const dateField = parseDate(fieldValue);
      if (!dateField) return false;

      switch (filter.operator) {
        case "between": {
          if (!Array.isArray(filterValue))
            return true;

          const [start, end] = filterValue;
          const dateStart = parseDate(start);
          const dateEnd = parseDate(end);

          if (!dateStart || !dateEnd)
            return true;

          return (
            dateField >= dateStart &&
            dateField <= dateEnd
          );
        }

        case "before": {
          const dateFilter = parseDate(filterValue);
          if (!dateFilter) return false;
          return dateField < dateFilter;
        }

        case "after": {
          const dateFilter = parseDate(filterValue);
          if (!dateFilter) return false;
          return dateField > dateFilter;
        }

        default:
          return true;
      }
    }

    case "boolean":
      return fieldValue === filterValue;

    case "singleSelect":
      return filter.operator === "is"
        ? fieldValue === filterValue
        : fieldValue !== filterValue;

    case "multiSelect": {
      if (
        !Array.isArray(fieldValue) ||
        !Array.isArray(filterValue)
      )
        return false;

      return filter.operator === "in"
        ? filterValue.some((v) =>
            fieldValue.includes(v)
          )
        : !filterValue.some((v) =>
            fieldValue.includes(v)
          );
    }

    default:
      return true;
  }
};


export const applyFilters = <T>(
  data: T[],
  filters: FilterCondition[]
): T[] => {
  if (!filters.length) return data;

  const groupedFilters = filters.reduce((acc, filter) => {
    if (!filter.field) return acc;

    if (!acc[filter.field]) {
      acc[filter.field] = [];
    }

    acc[filter.field].push(filter);
    return acc;
  }, {} as Record<string, FilterCondition[]>);

  return data.filter((item) =>
    Object.entries(groupedFilters).every(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, fieldFilters]) =>
        fieldFilters.some((filter) =>
          evaluateFilter(item, filter)
        )
    )
  );
};


