import {
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { FilterCondition } from "../../types/filter.types";
import { fieldConfig } from "../../config/fieldConfig";
import { operatorMap } from "../../config/operatorConfig";
import DynamicInput from "./DynamicInput";
import { validateFilter } from "../../utils/filterValidation";

interface FilterRowProps {
  filter: FilterCondition;
  onUpdate: (filter: FilterCondition) => void;
  onRemove: (id: string) => void;
}

const FilterRow = ({
  filter,
  onUpdate,
  onRemove
}: FilterRowProps) => {
  const selectedField = fieldConfig.find(
    (f) => f.field === filter.field
  );

  const fieldType = selectedField?.type;

  const validation = validateFilter(filter);

  const isTouched =
    filter.field !== "" ||
    filter.operator !== "" ||
    filter.value !== "";

  const handleFieldChange = (field: string) => {
    const config = fieldConfig.find(
      (f) => f.field === field
    );

    const firstOperator =
      config && operatorMap[config.type][0];

    onUpdate({
      ...filter,
      field,
      operator: firstOperator ?? "",
      value: ""
    });
  };

  const handleOperatorChange = (operator: string) => {
    onUpdate({
      ...filter,
      operator,
      value: ""
    });
  };

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      alignItems="flex-start"
    >
      {/* FIELD */}
      <FormControl sx={{ minWidth: 200 }} size="small">
        <InputLabel>Field</InputLabel>
        <Select
          value={filter.field}
          label="Field"
          onChange={(e) =>
            handleFieldChange(e.target.value)
          }
        >
          {fieldConfig.map((field) => (
            <MenuItem
              key={field.field}
              value={field.field}
            >
              {field.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* OPERATOR */}
      <FormControl
        sx={{ minWidth: 160 }}
        size="small"
        disabled={!fieldType}
      >
        <InputLabel>Operator</InputLabel>
        <Select
          value={filter.operator}
          label="Operator"
          onChange={(e) =>
            handleOperatorChange(e.target.value)
          }
        >
          {fieldType &&
            operatorMap[fieldType].map((op) => (
              <MenuItem key={op} value={op}>
                {op}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      {/* VALUE */}
      <DynamicInput
        fieldType={fieldType}
        operator={filter.operator}
        value={filter.value}
        options={selectedField?.options}
        onChange={(val) =>
          onUpdate({
            ...filter,
            value: val as FilterCondition["value"]
          })
        }
      />

      {/* REMOVE BUTTON */}
      <IconButton
        color="error"
        onClick={() => onRemove(filter.id)}
      >
        <DeleteIcon />
      </IconButton>

      {/* VALIDATION */}
      {!validation.isValid && isTouched && (
        <Typography
          variant="caption"
          color="error"
          sx={{ mt: 0.5 }}
        >
          {validation.error}
        </Typography>
      )}
    </Stack>
  );
};

export default FilterRow;
