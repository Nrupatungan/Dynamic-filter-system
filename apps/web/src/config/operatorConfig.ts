import type { FieldType } from "../types/filter.types";


export const operatorMap: Record<FieldType, string[]> = {
  text: ["equals", "contains", "startsWith", "endsWith", "notContains"],
  number: ["equals", "gt", "lt", "gte", "lte"],
  currency: ["between"],
  date: ["between", "before", "after"],
  singleSelect: ["is", "isNot"],
  multiSelect: ["in", "notIn"],
  boolean: ["is"]
};
