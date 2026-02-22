/* eslint-disable react-hooks/set-state-in-effect */
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
import { useEffect, useRef, useState } from "react";
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

  const [localValue, setLocalValue] = useState(value ?? "");

  // keep latest onChange without triggering effect reruns
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // sync local state only when external value truly changes
  useEffect(() => {
    setLocalValue(value ?? "");
  }, [value]);

  // debounce only text + number
  useEffect(() => {
    if (fieldType !== "text" && fieldType !== "number") return;

    const timer = setTimeout(() => {
      if (fieldType === "number") {
        onChangeRef.current(
          localValue === "" ? "" : Number(localValue)
        );
      } else {
        onChangeRef.current(localValue);
      }
    }, 400);

    return () => clearTimeout(timer);

  }, [localValue, fieldType]);

  if (!fieldType || !operator) return null;

  // TEXT
  if (fieldType === "text") {
    return (
      <TextField
        sx={{ minWidth: 180 }}
        size="small"
        label="Value"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
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
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
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
      <FormControl size="small">
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
      <FormControl size="small">
        <InputLabel>Value</InputLabel>
        <Select
          multiple
          value={selectedValues}
          label="Value"
          onChange={(e) => onChange(e.target.value)}
          renderValue={(selected) =>
            (selected as string[]).join(", ")
          }
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