"use client";

import React, { useEffect, useState } from "react";
import Container from "../component/_container/Container";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import ManageExtension from "../_components/_manageExtension/ManageExtension";
import { useRouter } from "next/navigation";

const statusColors = {
  Pending: "warning",
  Approved: "success",
  Rejected: "error",
  Paid: "primary",
  "Payment Issue": "secondary",
};

const STORAGE_KEY = "my_secure_key";
const LOGIN_URL = "/&kkQSgDbHWshumdrNcMJaJtDL$wtX3nDJ4NTDg";

const Page = () => {
  const [reqList, setReqList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Fetch data from API
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await fetch("/api/getRequest");
        const data = await response.json();
        setReqList(data.domains);
        setFilteredList(data.domains);
      } catch (err) {
        console.error("Failed to fetch domains:", err);
      }
    };

    fetchDomains();
  }, []);

  // update status
  const updateStatus = (id, newStatus) => {
    axios
      .put("/api/updateStatus", {
        id,
        status: newStatus,
      })
      .then((res) => {
        console.log(res.data.message);
        // Optional: Refresh list after update
        setReqList((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, status: newStatus } : item
          )
        );
      })
      .catch((err) => {
        console.error("Failed to update status:", err);
      });
  };

  // delete data
  const deleteDomain = (id) => {
    axios
      .post(`/api/deleteData`, {
        id: id,
      })
      .then((res) => {
        toast.success("Domain Request Deleted Succcessfully!");
        console.log(res.data.message);
        setReqList((prev) => prev.filter((item) => item._id !== id));
      })
      .catch((err) => {
        toast.error("Failed to Delete Domain");
        console.error("Failed to delete domain:", err);
      });
  };

  // Handle Search
  useEffect(() => {
    const filtered = reqList.filter(
      (item) =>
        item.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredList(filtered);
    setPage(0); // reset page on search
  }, [searchQuery, reqList]);

  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // login and logout functionality

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "logged_in") {
        setIsAuthenticated(true);
      } else {
        router.push(LOGIN_URL);
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      router.push(LOGIN_URL);
    }
  };

  return (
    <Container>
      <ToastContainer />
      <button
        onClick={handleLogout}
        className="bg-red-600 fixed cursor-pointer top-[10px] right-[10px] z-50 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition"
      >
        🚪 Logout
      </button>
      <h1 className="text-[35px] font-bold text-center mt-2">
        Domain Buy Requests
      </h1>
      <TextField
        label="Search by Domain or Email & Status"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <TableContainer component={Paper} className="mt-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Domain</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{row.domain}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>${row.amount}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={statusColors[row.status] || "default"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="contained"
                        size="small"
                        color="success"
                        onClick={() => updateStatus(row._id, "Approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        onClick={() => updateStatus(row._id, "Rejected")}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="secondary"
                        onClick={() => updateStatus(row._id, "Payment Issue")}
                      >
                        Mark as Payment Issue
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={() => updateStatus(row._id, "Paid")}
                      >
                        Mark as Paid
                      </Button>
                      <Button
                        onClick={() => deleteDomain(row._id)}
                        variant="contained"
                        size="small"
                        color="error"
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredList.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </TableContainer>
      <div className="mt-5">
        <ManageExtension />
      </div>
    </Container>
  );
};

export default Page;
