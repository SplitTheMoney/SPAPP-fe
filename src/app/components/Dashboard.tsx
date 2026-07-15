import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Skeleton,
} from "@mui/material";
import {
  PendingActions,
  CheckCircle,
  Cancel,
  Folder,
} from "@mui/icons-material";
import { getAccessRequests } from "../service/accessRequestService";
import { useEffect, useState } from "react";
import { AccessRequest } from "../types/types";


const getStatusColor = (status: string) => {
  switch (status) {
    case "CREATED":
      return "warning";
    case "APPROVED":
      return "success";
    case "REJECTED":
      return "error";
    default:
      return "default";
  }
};

export function Dashboard() {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const pendingRequests = requests.filter(
    (r) => r.status === "CREATED"
  ).length;

  const approvedRequests = requests.filter(
    (r) => r.status === "APPROVED"
  ).length;

  const rejectedRequests = requests.filter(
    (r) => r.status === "REJECTED"
  ).length;

  const stats = [
    {
      title: "Pending Requests",
      value: pendingRequests,
      icon: <PendingActions sx={{ fontSize: 40 }} />,
      color: "#ff9800",
      bgColor: "#fff3e0",
    },
    {
      title: "Approved Requests",
      value: approvedRequests,
      icon: <CheckCircle sx={{ fontSize: 40 }} />,
      color: "#4caf50",
      bgColor: "#e8f5e9",
    },
    {
      title: "Rejected Requests",
      value: rejectedRequests,
      icon: <Cancel sx={{ fontSize: 40 }} />,
      color: "#f44336",
      bgColor: "#ffebee",
    },
    {
      title: "Total Folders",
      value: requests.length,
      icon: <Folder sx={{ fontSize: 40 }} />,
      color: "#1976d2",
      bgColor: "#e3f2fd",
    },
  ];


  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await getAccessRequests();
        setRequests(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);


  return (
    <Box>
      <Typography
        variant="h4"
        gutterBottom
        fontWeight={600}
        sx={{ mb: 3, fontSize: { xs: "1.75rem", sm: "2.125rem" } }}
      >
        Dashboard
      </Typography>

      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={6} sm={6} md={3} key={index}>
            <Paper
              sx={{
                p: { xs: 2, sm: 3 },
                display: "flex",
                flexDirection: "column",
                gap: 2,
                borderRadius: 2,
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 3,
                },
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                    sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" } }}
                  >
                    {stat.title}
                  </Typography>
                  <Typography
                    variant="h3"
                    fontWeight={700}
                    sx={{ fontSize: { xs: "1.75rem", sm: "3rem" } }}
                  >
                    <Typography variant="h3">
                      {loading ? (
                        <Skeleton width={80} />
                      ) : (
                        stat.value
                      )}
                    </Typography>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: { xs: 48, sm: 64 },
                    height: { xs: 48, sm: 64 },
                    borderRadius: 2,
                    backgroundColor: stat.bgColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: stat.color,
                  }}
                >
                  <Box sx={{ fontSize: { xs: 28, sm: 40 } }}>{stat.icon}</Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Box sx={{ p: { xs: 2, sm: 3 }, borderBottom: "1px solid #e0e0e0" }}>
          <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}>
            Recent Requests
          </Typography>
        </Box>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: { xs: 500, sm: 650 } }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f7fa" }}>
                <TableCell sx={{ fontWeight: 600 }}>Request ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Folder</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton width={80} /></TableCell>
                  </TableRow>
                ))
              ) :
                (requests.slice(0, 5).map((request) => (
                  <TableRow
                    key={request.id}
                    sx={{
                      "&:hover": { backgroundColor: "#f5f7fa" },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 500, color: "#1976d2" }}>
                      {request.id}
                    </TableCell>
                    <TableCell>{request.employeeName}</TableCell>
                    <TableCell>{request.folderPath}</TableCell>
                    <TableCell>{new Date(request.createdAt).toDateString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={request.status}
                        size="small"
                        color={getStatusColor(request.status)}
                      />
                    </TableCell>
                  </TableRow>
                )))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
