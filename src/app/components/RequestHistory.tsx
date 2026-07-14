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
import { Search, FilterList, Visibility, Person, Folder, CalendarToday, Description, CheckCircle, Cancel, EditDocument } from "@mui/icons-material";
import { getAccessRequests } from "../service/accessRequestService";
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

export function RequestHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null);
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

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.folderPath.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (request: AccessRequest) => {
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
              <MenuItem value="CREATED">Pending</MenuItem>
              <MenuItem value="APPROVED">Approved</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
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
              {filteredRequests.map((request) => (
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
                          {selectedRequest.employeeName}
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
                          {new Date(selectedRequest.createdAt).toLocaleDateString()}
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
                          {selectedRequest.folderPath}
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
                          {selectedRequest.employeeDepartment}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                      <EditDocument color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Access
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedRequest.accessType === "READ" ? "Read" : "Write"}
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

                {selectedRequest.status !== "CREATED" && (
                  <>
                    <Divider sx={{ my: 3 }} />

                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: selectedRequest.status === "APPROVED" ? "#e8f5e9" : "#ffebee",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        {selectedRequest.status === "APPROVED" ? (
                          <CheckCircle color="success" />
                        ) : (
                          <Cancel color="error" />
                        )}
                        <Typography variant="h6" fontWeight={600}>
                          {selectedRequest.status === "APPROVED" ? "Approved" : "Rejected"}
                        </Typography>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" color="text.secondary">
                            Reviewed By
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {selectedRequest.managerName}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" color="text.secondary">
                            Review Date
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {selectedRequest.decisionDate ? new Date(selectedRequest.decisionDate).toDateString() : "N/A"}
                          </Typography>
                        </Grid>
                      </Grid>
                      

                      {selectedRequest.status === "APPROVED" ? (
                        selectedRequest.expirationDate && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                              Expiration Date
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {new Date(selectedRequest.expirationDate).toDateString()}
                            </Typography>
                          </Box>
                        )
                      ):(
                        selectedRequest.rejectionReason && (
                          <Box sx={{ mt: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                          Rejection Reason
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {selectedRequest.rejectionReason}
                          </Typography>
                          </Box>
                        )
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
