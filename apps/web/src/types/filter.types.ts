export type FieldType =
  | "text"
  | "number"
  | "date"
  | "currency"
  | "singleSelect"
  | "multiSelect"
  | "boolean";

export interface FieldConfig {
  label: string;
  field: string;
  type: FieldType;
  options?: string[];
}

export interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: FilterValue;
}

export type FilterValue =
  | string
  | number
  | boolean
  | string[]
  | [number | undefined, number | undefined]
  | [string | undefined, string | undefined]
  | "";
