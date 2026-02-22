/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { fieldConfig } from "../config/fieldConfig";
import { operatorMap } from "../config/operatorConfig";
import type { FilterCondition } from "../types/filter.types";
import { validateFilter } from "../utils/filterValidation";
import { applyFilters } from "../utils/filterEngine";
import { fetchFilteredEmployees } from "../api/employees";

const STORAGE_KEY = "dynamic-filters";

const sanitizeFilters = (
  filters: FilterCondition[]
): FilterCondition[] => {
  return filters.filter((filter) => {
    if (!filter.field || !filter.operator)
      return false;

    const config = fieldConfig.find(
      (f) => f.field === filter.field
    );

    if (!config) return false;

    const allowedOperators =
      operatorMap[config.type];

    if (!allowedOperators.includes(filter.operator))
      return false;

    return true;
  });
};

export const useFilters = <T>(
  data: T[],
  mode: "client" | "server"
) => {
  const [serverData, setServerData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const loadInitialFilters = (): FilterCondition[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const parsed: FilterCondition[] =
        JSON.parse(stored);

      if (!Array.isArray(parsed)) return [];

      return sanitizeFilters(parsed);
    } catch {
      return [];
    }
  };

  const [filters, setFilters] =
    useState<FilterCondition[]>(loadInitialFilters);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(filters)
      );
    } catch { /* empty */ }
  }, [filters]);

  useEffect(() => {
    const validFilters = filters.filter(
      (f) => validateFilter(f).isValid
    );

    if (mode === "client") {
      const filtered = applyFilters(data, validFilters);
      setTotalCount(filtered.length);

      const start = page * rowsPerPage;
      const end = start + rowsPerPage;

      setServerData(filtered.slice(start, end));
      return;
    }

    // SERVER MODE
    setLoading(true);

    fetchFilteredEmployees(
      validFilters,
      page + 1,
      rowsPerPage
    )
      .then((res) => {
        setServerData(res.data);
        setTotalCount(res.total);
      })
      .finally(() => setLoading(false));

  }, [filters, data, mode, page, rowsPerPage]);

  return {
    filters,
    setFilters,
    filteredData: serverData,
    loading,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalCount
  };
};
