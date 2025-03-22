import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { fetchLogs } from "../api/fetch-service";

export default function EnhancedTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("status");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchLogs();
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Status'a göre filtreleme
  const filteredData = data.filter((row) => {
    if (filterStatus === "all") return true;
    return row.status === filterStatus;
  });

  // Error Message'a göre filtreleme (sadece arama terimi varsa)
  const filteredDataWithSearch = filteredData.filter((row) => {
    if (searchTerm === "") return true; // Arama yoksa, hepsini göster
    return (
      row.errorMessage &&
      row.errorMessage.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sıralama fonksiyonu
  const sortedData = [...filteredDataWithSearch].sort((a, b) => {
    if (order === "asc") {
      return a[orderBy] < b[orderBy] ? -1 : 1;
    } else {
      return a[orderBy] > b[orderBy] ? -1 : 1;
    }
  });

  if (loading) return <CircularProgress />;
  if (error) return <p>Hata: {error}</p>;

  return (
    <Box sx={{ width: "100%", position: "relative", padding: "16px" }}>
      {/* Status Filtresi */}
      <FormControl
        sx={{
          width: 200,
          marginBottom: "16px",
        }}
        size="small"
      >
        <InputLabel>Status</InputLabel>
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="Success">Success</MenuItem>
          <MenuItem value="Error">Error</MenuItem>
        </Select>
      </FormControl>

      {/* Arama Inputu (Error Message için) */}
      <TextField
        label="Search Error Message"
        variant="outlined"
        size="small"
        sx={{
          width: 250,
          marginBottom: "16px",
        }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Paper sx={{ width: "100%", mb: 2, p: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "ipAddress"}
                    direction={orderBy === "ipAddress" ? order : "asc"}
                    onClick={() => handleRequestSort("ipAddress")}
                  >
                    IpAddress
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "startTime"}
                    direction={orderBy === "startTime" ? order : "asc"}
                    onClick={() => handleRequestSort("startTime")}
                  >
                    Start Time
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "status"}
                    direction={orderBy === "status" ? order : "asc"}
                    onClick={() => handleRequestSort("status")}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "endTime"}
                    direction={orderBy === "endTime" ? order : "asc"}
                    onClick={() => handleRequestSort("endTime")}
                  >
                    End Time
                  </TableSortLabel>
                </TableCell>
                <TableCell>Error Message</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <a
                        href={`http://${row.ipAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "blue",
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        {row.ipAddress}
                      </a>
                    </TableCell>
                    <TableCell>{row.startTime}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.endTime}</TableCell>
                    <TableCell>{row.errorMessage}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredDataWithSearch.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
