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
} from "@mui/material";
import {
  PendingActions,
  CheckCircle,
  Cancel,
  Folder,
} from "@mui/icons-material";

const stats = [
  {
    title: "Pending Requests",
    value: 12,
    icon: <PendingActions sx={{ fontSize: 40 }} />,
    color: "#ff9800",
    bgColor: "#fff3e0",
  },
  {
    title: "Approved Requests",
    value: 45,
    icon: <CheckCircle sx={{ fontSize: 40 }} />,
    color: "#4caf50",
    bgColor: "#e8f5e9",
  },
  {
    title: "Rejected Requests",
    value: 8,
    icon: <Cancel sx={{ fontSize: 40 }} />,
    color: "#f44336",
    bgColor: "#ffebee",
  },
  {
    title: "Total Folders",
    value: 23,
    icon: <Folder sx={{ fontSize: 40 }} />,
    color: "#1976d2",
    bgColor: "#e3f2fd",
  },
];

const recentRequests = [
  {
    id: "REQ-2024-001",
    user: "John Smith",
    folder: "Finance/Q4-Reports",
    date: "2026-05-28",
    status: "Pending",
  },
  {
    id: "REQ-2024-002",
    user: "Sarah Johnson",
    folder: "HR/Employee-Records",
    date: "2026-05-27",
    status: "Approved",
  },
  {
    id: "REQ-2024-003",
    user: "Mike Davis",
    folder: "IT/Server-Configs",
    date: "2026-05-26",
    status: "Pending",
  },
  {
    id: "REQ-2024-004",
    user: "Emily Chen",
    folder: "Marketing/Campaigns",
    date: "2026-05-25",
    status: "Rejected",
  },
  {
    id: "REQ-2024-005",
    user: "Robert Taylor",
    folder: "Sales/Q2-Data",
    date: "2026-05-24",
    status: "Approved",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "warning";
    case "Approved":
      return "success";
    case "Rejected":
      return "error";
    default:
      return "default";
  }
};

export function Dashboard() {
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
                    {stat.value}
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
              {recentRequests.map((request) => (
                <TableRow
                  key={request.id}
                  sx={{
                    "&:hover": { backgroundColor: "#f5f7fa" },
                  }}
                >
                  <TableCell sx={{ fontWeight: 500, color: "#1976d2" }}>
                    {request.id}
                  </TableCell>
                  <TableCell>{request.user}</TableCell>
                  <TableCell>{request.folder}</TableCell>
                  <TableCell>{request.date}</TableCell>
                  <TableCell>
                    <Chip
                      label={request.status}
                      size="small"
                      color={getStatusColor(request.status)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
