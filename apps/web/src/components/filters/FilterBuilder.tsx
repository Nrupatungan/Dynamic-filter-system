import { useCallback } from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import type { FilterCondition } from "../../types/filter.types";
import FilterRow from "./FilterRow";
import { fieldConfig } from "../../config/fieldConfig";
import { operatorMap } from "../../config/operatorConfig";

interface FilterBuilderProps {
  filters: FilterCondition[];
  setFilters: React.Dispatch<React.SetStateAction<FilterCondition[]>>;
}

const FilterBuilder = ({ filters, setFilters }: FilterBuilderProps) => {
  // Add new filter
  const handleAddFilter = useCallback(() => {
    const defaultField = fieldConfig[0];
    const defaultOperator =
      operatorMap[defaultField.type][0];

    const newFilter: FilterCondition = {
      id: crypto.randomUUID(),
      field: defaultField.field,
      operator: defaultOperator,
      value: ""
    };

    setFilters((prev) => [...prev, newFilter]);
  }, [setFilters]);

  // Remove filter
  const handleRemoveFilter = useCallback(
    (id: string) => {
      setFilters((prev) => prev.filter((f) => f.id !== id));
    },
    [setFilters]
  );

  // Update filter
  const handleUpdateFilter = useCallback(
    (updated: FilterCondition) => {
      setFilters((prev) =>
        prev.map((f) => (f.id === updated.id ? updated : f))
      );
    },
    [setFilters]
  );

  const handleClearAll = () => {
    setFilters([]);
  };

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">
          Filters
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={handleAddFilter}
          >
            Add Filter
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={handleClearAll}
            disabled={filters.length === 0}
          >
            Clear All
          </Button>
        </Stack>
      </Stack>

      <Stack spacing={2}>
        {filters.map((filter) => (
          <Paper
            key={filter.id}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "#fafafa"
            }}
            variant="outlined"
          >
            <FilterRow
              filter={filter}
              onUpdate={handleUpdateFilter}
              onRemove={handleRemoveFilter}
            />
          </Paper>
        ))}
      </Stack>
    </Box>
  );

};

export default FilterBuilder;
