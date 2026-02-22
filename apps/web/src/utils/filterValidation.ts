/* eslint-disable @typescript-eslint/no-explicit-any */

import { fieldConfig } from "../config/fieldConfig";
import type { FilterCondition } from "../types/filter.types";

const isEmpty = (val: any) =>
  val === undefined || val === null || val === "";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateFilter = (
  filter: FilterCondition
): ValidationResult => {
  if (!filter.field || !filter.operator) {
    return { isValid: false, error: "Incomplete filter" };
  }

  const config = fieldConfig.find(
    (f) => f.field === filter.field
  );

  if (!config) return { isValid: false };

  const value = filter.value;

  switch (config.type) {

    // ===== TEXT =====
    case "text":
    case "number":
    case "singleSelect": {
      if (isEmpty(value)) {
        return {
          isValid: false,
          error: "Value required"
        };
      }
      return { isValid: true };
    }

    // ===== CURRENCY =====
    case "currency": {
      if (!Array.isArray(value)) {
        return {
          isValid: false,
          error: "Range required"
        };
      }

      const [min, max] = value;

      if (isEmpty(min) || isEmpty(max)) {
        return {
          isValid: false,
          error: "Both min and max required"
        };
      }

      if (Number(min) > Number(max)) {
        return {
          isValid: false,
          error: "Min cannot exceed Max"
        };
      }

      return { isValid: true };
    }

    // ===== DATE =====
    case "date": {
      if (filter.operator === "between") {
        if (!Array.isArray(value)) {
          return {
            isValid: false,
            error: "Date range required"
          };
        }

        const [start, end] = value;

        if (isEmpty(start) || isEmpty(end)) {
          return {
            isValid: false,
            error: "Both dates required"
          };
        }

        if (new Date(start!) > new Date(end!)) {
          return {
            isValid: false,
            error: "Start date must be before End"
          };
        }
      } else {
        if (isEmpty(value)) {
          return {
            isValid: false,
            error: "Date required"
          };
        }
      }

      return { isValid: true };
    }

    // ===== MULTI SELECT =====
    case "multiSelect": {
      if (!Array.isArray(value) || value.length === 0) {
        return {
          isValid: false,
          error: "Select at least one option"
        };
      }

      return { isValid: true };
    }

    // ===== BOOLEAN =====
    case "boolean":
      return { isValid: true };

    default:
      return { isValid: true };
  }
};

