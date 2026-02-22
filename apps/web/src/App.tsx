import { useEffect, useState } from "react";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import type { Column } from "./components/table/DataTable";
import { useFilters } from "./hooks/useFilters";
// import { employees } from "./lib/data/employees";
import type { Employee } from "./types/employee.types";
import FilterBuilder from "./components/filters/FilterBuilder";
import DataTable from "./components/table/DataTable";
import { CssBaseline } from "@mui/material";
import { exportToCSV } from "./utils/csvExport";
import { fetchEmployees } from "./api/employees";
import {
  ToggleButtonGroup,
  ToggleButton
} from "@mui/material";


const columns: Column<Employee>[] = [
  { label: "Name", field: "name", sortable: true },
  { label: "Department", field: "department", sortable: true },
  { label: "Salary", field: "salary", sortable: true },
  { label: "Join Date", field: "joinDate", sortable: true },
  { label: "City", field: "address.city", sortable: true },
  {
    label: "Skills",
    field: "skills",
    render: (row) => row.skills.join(", ")
  },
  {
    label: "Active",
    field: "isActive",
    render: (row) => (row.isActive ? "Yes" : "No")
  }
];


function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filterMode, setFilterMode] = useState<"client" | "server">("client");

  const {
    filters,
    setFilters,
    filteredData,
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
  } = useFilters(employees, filterMode);

    useEffect(() => {
      fetchEmployees()
        .then((data) => setEmployees(data))
    }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Dynamic Filter Component System
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          mb={3}
        >
          Reusable, type-safe filtering with AND / OR logic.
        </Typography>

        <Paper sx={{ p: 3, mb: 4 }} elevation={2}>
          <Box mb={2}>
            <ToggleButtonGroup
              value={filterMode}
              exclusive
              onChange={(_, value) => {
                if (value) setFilterMode(value);
              }}
              size="small"
            >
              <ToggleButton value="client">
                Client Mode
              </ToggleButton>
              <ToggleButton value="server">
                Server Mode
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <FilterBuilder
            filters={filters}
            setFilters={setFilters}
          />
        </Paper>

      <Paper sx={{ p: 2 }} elevation={2}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">
            Employees
          </Typography>

          <Button
            variant="outlined"
            onClick={() =>
              exportToCSV(
                filteredData,
                columns.map((c) => ({
                  label: c.label,
                  field: c.field
                })),
                "employees.csv"
              )
            }
            disabled={filteredData.length === 0}
          >
            Export CSV
          </Button>
        </Box>

        {loading && (
          <Typography variant="body2" mb={2}>
            Filtering...
          </Typography>
        )}

        <DataTable
          data={filteredData}
          columns={columns}
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={(val) => {
            setRowsPerPage(val);
            setPage(0);
          }}
          orderBy={orderBy}
          order={order}
          onSort={(field) => {
            if (orderBy === field) {
              setOrder(order === "asc" ? "desc" : "asc");
            } else {
              setOrderBy(field);
              setOrder("asc");
            }
          }}
        />
      </Paper>

      </Container>
    </>
  );
}

export default App;
