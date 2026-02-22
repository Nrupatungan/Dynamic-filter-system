import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  Paper,
  TablePagination
} from "@mui/material";
import { useMemo } from "react";
import { getNestedValue } from "../../utils/nestedAccessor";

export interface Column<T> {
  label: string;
  field: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  orderBy: string | null;
  order: "asc" | "desc";
  onSort: (field: string) => void;
}

function DataTable<T extends { id?: string | number }>({
  data,
  columns,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  orderBy,
  order,
  onSort
}: DataTableProps<T>) {

  const sortedData = useMemo(() => {
    if (!orderBy) return data;

    return [...data].sort((a, b) => {
      const aVal = getNestedValue(a, orderBy);
      const bVal = getNestedValue(b, orderBy);

      if (aVal == null) return -1;
      if (bVal == null) return 1;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return order === "asc"
          ? aVal - bVal
          : bVal - aVal;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();

      if (aStr < bStr) return order === "asc" ? -1 : 1;
      if (aStr > bStr) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, orderBy, order]);

  return (
    <Box mt={4}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="body2">
          Showing {data.length} of {totalCount} records
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.field}
                  sx={{ fontWeight: 600 }}
                >
                  {col.sortable ? (
                    <TableSortLabel
                      active={orderBy === col.field}
                      direction={
                        orderBy === col.field
                          ? order
                          : "asc"
                      }
                      onClick={() => onSort(col.field)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                >
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row) => (
                <TableRow
                  key={
                    row.id ??
                    JSON.stringify(row)
                  }
                  hover
                >
                  {columns.map((col) => (
                    <TableCell key={col.field}>
                      {col.render
                        ? col.render(row)
                        : String(
                            getNestedValue(
                              row,
                              col.field
                            ) ?? ""
                          )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) =>
          onPageChange(newPage)
        }
        onRowsPerPageChange={(e) =>
          onRowsPerPageChange(
            parseInt(e.target.value, 10)
          )
        }
        rowsPerPageOptions={[5, 10, 20, 50]}
      />
    </Box>
  );
}

export default DataTable;
