/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useMemo } from "react";
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
    if (!filter.field || !filter.operator) return false;

    const config = fieldConfig.find(
      (f) => f.field === filter.field
    );
    if (!config) return false;

    return operatorMap[config.type].includes(filter.operator);
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
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const loadInitialFilters = (): FilterCondition[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const parsed: FilterCondition[] = JSON.parse(stored);
      return Array.isArray(parsed) ? sanitizeFilters(parsed) : [];
    } catch {
      return [];
    }
  };

  const [filters, setFilters] =
    useState<FilterCondition[]>(loadInitialFilters);
  
  const validFilters = useMemo(() => {
    return filters.filter((f) =>
      validateFilter(f).isValid
    );
  }, [filters]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    if (mode === "client") {
      const filtered = applyFilters(data, validFilters);
      setTotalCount(filtered.length);

      const start = page * rowsPerPage;
      const end = start + rowsPerPage;

      setServerData(filtered.slice(start, end));
      return;
    }

    let ignore = false;

    setLoading(true);

    fetchFilteredEmployees(
      validFilters,
      page + 1,
      rowsPerPage,
      orderBy ?? undefined,
      order
    )
      .then((res) => {
        if (!ignore) {
          setServerData(res.data);
          setTotalCount(res.total);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };

  }, [validFilters, data, mode, page, rowsPerPage, orderBy, order]);

  return {
    filters,
    setFilters,
    filteredData: serverData,
    loading,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalCount,
    orderBy,
    setOrderBy,
    order,
    setOrder
  };
};