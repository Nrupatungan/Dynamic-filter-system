export type FieldType =
  | "text"
  | "number"
  | "date"
  | "currency"
  | "singleSelect"
  | "multiSelect"
  | "boolean";

export type FilterValue =
  | string
  | number
  | boolean
  | string[]
  | [number | undefined, number | undefined]
  | [string | undefined, string | undefined]
  | "";

export interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: FilterValue;
}