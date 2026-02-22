import {
  TextField,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  Stack
} from "@mui/material";

import type { FieldType } from "../../types/filter.types";

interface DynamicInputProps {
  fieldType?: FieldType;
  operator: string;
  value: unknown;
  options?: string[];
  onChange: (value: unknown) => void;
}

const DynamicInput = ({
  fieldType,
  operator,
  value,
  options,
  onChange
}: DynamicInputProps) => {
  if (!fieldType || !operator) return null;

  // TEXT
  if (fieldType === "text") {
    return (
      <TextField
        sx={{ minWidth: 180 }}
        size="small"
        label="Value"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  // NUMBER
  if (fieldType === "number") {
    return (
      <TextField
        sx={{ minWidth: 180 }}
        size="small"
        type="number"
        label="Value"
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    );
  }

  // CURRENCY (range only)
  if (fieldType === "currency" && operator === "between") {
    const range =
      Array.isArray(value) && value.length === 2
        ? (value as [number | undefined, number | undefined])
        : [undefined, undefined];

    return (
      <Stack direction="row" spacing={2}>
        <TextField
          sx={{ minWidth: 180 }}
          size="small"
          type="number"
          label="Min"
          value={range[0] ?? ""}
          onChange={(e) =>
            onChange([
              e.target.value === ""
                ? undefined
                : Number(e.target.value),
              range[1]
            ])
          }
        />
        <TextField
          sx={{ minWidth: 180 }}
          size="small"
          type="number"
          label="Max"
          value={range[1] ?? ""}
          onChange={(e) =>
            onChange([
              range[0],
              e.target.value === ""
                ? undefined
                : Number(e.target.value)
            ])
          }
        />
      </Stack>
    );
  }

  // DATE
  if (fieldType === "date" && operator === "between") {
    const range =
      Array.isArray(value) && value.length === 2
        ? (value as [string | undefined, string | undefined])
        : [undefined, undefined];

    return (
      <Stack direction="row" spacing={2}>
        <TextField
          sx={{ minWidth: 180 }}
          size="small"
          type="date"
          label="From"
          slotProps={{ inputLabel: { shrink: true } }}
          value={range[0] ?? ""}
          onChange={(e) =>
            onChange([e.target.value || undefined, range[1]])
          }
        />
        <TextField
          sx={{ minWidth: 180 }}
          size="small"
          type="date"
          label="To"
          slotProps={{ inputLabel: { shrink: true } }}
          value={range[1] ?? ""}
          onChange={(e) =>
            onChange([range[0], e.target.value || undefined])
          }
        />
      </Stack>
    );
  }

  // BOOLEAN
  if (fieldType === "boolean") {
    return (
      <FormControlLabel
        control={
          <Switch
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
          />
        }
        label={value ? "True" : "False"}
      />
    );
  }

  // SINGLE SELECT
  if (fieldType === "singleSelect") {
    return (
      <FormControl sx={{ minWidth: 200 }} size="small">
        <InputLabel>Value</InputLabel>
        <Select
          value={value || ""}
          label="Value"
          onChange={(e) => onChange(e.target.value)}
        >
          {options?.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  // MULTI SELECT
  if (fieldType === "multiSelect") {
    const selectedValues = Array.isArray(value)
    ? (value as string[])
    : [];

    return (
      <FormControl sx={{ minWidth: 200 }} size="small">
        <InputLabel>Value</InputLabel>
        <Select
          multiple
          value={value || []}
          label="Value"
          onChange={(e) => onChange(e.target.value)}
          renderValue={(selected) => (selected as string[]).join(", ")}
        >
          {options?.map((opt) => (
            <MenuItem key={opt} value={opt}>
              <Checkbox checked={selectedValues.includes(opt)} />
              <ListItemText primary={opt} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  return null;
};

export default DynamicInput;
