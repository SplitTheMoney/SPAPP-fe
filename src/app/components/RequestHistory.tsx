import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  MenuItem,
  InputAdornment,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Search, FilterList, Visibility, Person, Folder, CalendarToday, Description, CheckCircle, Cancel } from "@mui/icons-material";
import { getAccessRequests } from "../service/accessRequestService";
import { AccessRequest } from "../types/types";

const allRequests = [
  {
    id: "REQ-2024-001",
    user: "John Smith",
    email: "john.smith@company.com",
    department: "Finance",
    folder: "Finance/Q4-Reports",
    date: "2026-05-28",
    status: "Pending",
    justification: "I need access to Q4 financial reports to prepare the annual budget presentation for the board meeting next week. This data is essential for accurate forecasting and strategic planning.",
    reviewedBy: null,
    reviewDate: null,
    reviewComments: null,
  },
  {
    id: "REQ-2024-002",
    user: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    department: "HR",
    folder: "HR/Employee-Records",
    date: "2026-05-27",
    status: "Approved",
    justification: "As HR Manager, I require access to employee records for conducting performance reviews and managing personnel files.",
    reviewedBy: "Robert Taylor (Administrator)",
    reviewDate: "2026-05-27",
    reviewComments: "Approved - valid business need and appropriate role.",
  },
  {
    id: "REQ-2024-003",
    user: "Mike Davis",
    email: "mike.davis@company.com",
    department: "IT",
    folder: "IT/Server-Configs",
    date: "2026-05-26",
    status: "Pending",
    justification: "Requesting read access to review server configuration files as part of the security audit. This is required to ensure compliance with our security policies and identify potential vulnerabilities.",
    reviewedBy: null,
    reviewDate: null,
    reviewComments: null,
  },
  {
    id: "REQ-2024-004",
    user: "Emily Chen",
    email: "emily.chen@company.com",
    department: "Marketing",
    folder: "Marketing/Campaigns",
    date: "2026-05-25",
    status: "Rejected",
    justification: "Need access to view marketing campaign materials for a competitor analysis project.",
    reviewedBy: "Lisa Anderson (Manager)",
    reviewDate: "2026-05-25",
    reviewComments: "Request denied - insufficient business justification. Competitor analysis does not require direct access to internal campaign files. Please work with the Marketing Manager who can provide the necessary information through proper channels.",
  },
  {
    id: "REQ-2024-005",
    user: "Robert Taylor",
    email: "robert.taylor@company.com",
    department: "Sales",
    folder: "Sales/Q2-Data",
    date: "2026-05-24",
    status: "Approved",
    justification: "Access needed to analyze Q2 sales performance and prepare reports for executive review.",
    reviewedBy: "Robert Taylor (Administrator)",
    reviewDate: "2026-05-24",
    reviewComments: "Approved - legitimate business requirement.",
  },
  {
    id: "REQ-2024-006",
    user: "Lisa Anderson",
    email: "lisa.anderson@company.com",
    department: "Legal",
    folder: "Legal/Contracts",
    date: "2026-05-23",
    status: "Approved",
    justification: "Need access to review vendor contracts for the upcoming audit.",
    reviewedBy: "Robert Taylor (Administrator)",
    reviewDate: "2026-05-23",
    reviewComments: "Approved - valid audit requirement.",
  },
  {
    id: "REQ-2024-007",
    user: "David Wilson",
    email: "david.wilson@company.com",
    department: "Operations",
    folder: "Operations/Procedures",
    date: "2026-05-22",
    status: "Pending",
    justification: "I need write access to update standard operating procedures based on recent process improvements. These updates are critical for maintaining documentation accuracy and operational efficiency.",
    reviewedBy: null,
    reviewDate: null,
    reviewComments: null,
  },
  {
    id: "REQ-2024-008",
    user: "Jennifer Lee",
    email: "jennifer.lee@company.com",
    department: "Research",
    folder: "Research/Projects",
    date: "2026-05-21",
    status: "Rejected",
    justification: "Want to see all research projects for general knowledge.",
    reviewedBy: "Lisa Anderson (Manager)",
    reviewDate: "2026-05-21",
    reviewComments: "Request denied - 'general knowledge' is not a sufficient justification for accessing confidential research data. Access to research projects is restricted to team members directly involved in those projects. If you have a specific project-related need, please submit a new request with detailed justification.",
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

export function RequestHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <p>Loading...</p>;
  }

  const filteredRequests = allRequests.filter((request) => {
    const matchesSearch =
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.folder.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (request: any) => {
    setSelectedRequest(request);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRequest(null);
  };

  return (
    <Box>
      <Typography
        variant="h4"
        gutterBottom
        fontWeight={600}
        sx={{ mb: 3, fontSize: { xs: "1.75rem", sm: "2.125rem" } }}
      >
        Request History
      </Typography>

      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search by Request ID, Folder, or User..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterList />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="All">All Status</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Box sx={{ p: { xs: 2, sm: 3 }, borderBottom: "1px solid #e0e0e0" }}>
          <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}>
            All Requests ({requests.length})
          </Typography>
        </Box>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: { xs: 600, sm: 750 } }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f7fa" }}>
                <TableCell sx={{ fontWeight: 600 }}>Request ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Folder</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow
                  key={request.id}
                  sx={{
                    "&:hover": { backgroundColor: "#f5f7fa" },
                  }}
                >
                  <TableCell sx={{ fontWeight: 500, color: "#1976d2" }}>
                    {request.id}
                  </TableCell>
                  <TableCell>{request.employee.name}</TableCell>
                  <TableCell>{request.folder.path}</TableCell>
                  <TableCell>{request.createdAt}</TableCell>
                  <TableCell>
                    <Chip
                      label={request.status}
                      size="small"
                      color={getStatusColor(request.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleViewDetails(request)}
                    >
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        {selectedRequest && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="h6" fontWeight={600}>
                  Request Details
                </Typography>
                <Chip
                  label={selectedRequest.status}
                  color={getStatusColor(selectedRequest.status)}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <Typography variant="overline" color="text.secondary">
                  Request ID
                </Typography>
                <Typography variant="h6" color="primary" gutterBottom>
                  {selectedRequest.id}
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                      <Person color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Requester
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedRequest.user}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {selectedRequest.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                      <CalendarToday color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Request Date
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedRequest.date}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                      <Folder color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Shared Folder
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedRequest.folder}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                      <Description color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Department
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedRequest.department}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                    Justification
                  </Typography>
                  <Paper sx={{ p: 2, backgroundColor: "#f5f7fa" }}>
                    <Typography variant="body2">{selectedRequest.justification}</Typography>
                  </Paper>
                </Box>

                {selectedRequest.status !== "Pending" && (
                  <>
                    <Divider sx={{ my: 3 }} />

                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: selectedRequest.status === "Approved" ? "#e8f5e9" : "#ffebee",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        {selectedRequest.status === "Approved" ? (
                          <CheckCircle color="success" />
                        ) : (
                          <Cancel color="error" />
                        )}
                        <Typography variant="h6" fontWeight={600}>
                          {selectedRequest.status === "Approved" ? "Approved" : "Rejected"}
                        </Typography>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" color="text.secondary">
                            Reviewed By
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {selectedRequest.reviewedBy}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" color="text.secondary">
                            Review Date
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {selectedRequest.reviewDate}
                          </Typography>
                        </Grid>
                      </Grid>

                      {selectedRequest.reviewComments && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            {selectedRequest.status === "Approved" ? "Comments" : "Rejection Reason"}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {selectedRequest.reviewComments}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </>
                )}
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={handleCloseDialog} variant="contained">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
