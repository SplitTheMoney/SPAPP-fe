import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Chip,
  Divider,
  Alert,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { CheckCircle, Cancel, Person, Folder, CalendarToday, Description } from "@mui/icons-material";
import { AccessRequest } from "../types/types";
import { acceptRequest, getPendingRequests, rejectRequest } from "../service/accessRequestService";

/*const pendingRequests = [
  {
    id: "REQ-2024-001",
    user: "John Smith",
    email: "john.smith@company.com",
    department: "Finance",
    folder: "Finance/Q4-Reports",
    date: "2026-05-28",
    justification:
      "I need access to Q4 financial reports to prepare the annual budget presentation for the board meeting next week. This data is essential for accurate forecasting and strategic planning.",
  },
  {
    id: "REQ-2024-003",
    user: "Mike Davis",
    email: "mike.davis@company.com",
    department: "IT",
    folder: "IT/Server-Configs",
    date: "2026-05-26",
    justification:
      "Requesting read access to review server configuration files as part of the security audit. This is required to ensure compliance with our security policies and identify potential vulnerabilities.",
  },
  {
    id: "REQ-2024-007",
    user: "Lisa Anderson",
    email: "lisa.anderson@company.com",
    department: "Operations",
    folder: "Operations/Procedures",
    date: "2026-05-22",
    justification:
      "I need write access to update standard operating procedures based on recent process improvements. These updates are critical for maintaining documentation accuracy and operational efficiency.",
  },
];*/

export function ApprovalScreen() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [pendingRequests, setPendingRequests] = useState<AccessRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionTaken, setActionTaken] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(!isMobile);

  useEffect(() => {
    const loadRequests = async () => {
        try {
          const requests = await getPendingRequests();
          setPendingRequests(requests);
          setSelectedRequest(requests[0]);
        } catch (error) {
          console.error("Failed to load pending requests", error);
        }
      }
  
      loadRequests();
  }, []);

  const handleApprove = () => {
    acceptRequest(selectedRequest!.id).then((result) => {
      if (result === 200) {
        setActionTaken("approved");
        const updatedRequests = pendingRequests.filter(
          request => request.id !== selectedRequest!.id
        );

        setPendingRequests(updatedRequests);
        setSelectedRequest(updatedRequests.length > 0 ? updatedRequests[0] : null);
        setTimeout(() => setActionTaken(null), 3000);
      }
    })
  };

  const handleReject = () => {
    if (rejectionReason.trim()) {
      rejectRequest(selectedRequest!.id, rejectionReason).then((result) => {
        if (result === 200) {
          setActionTaken("rejected");
          const updatedRequests = pendingRequests.filter(
            request => request.id !== selectedRequest!.id
          );

          setPendingRequests(updatedRequests);
          setSelectedRequest(updatedRequests.length > 0 ? updatedRequests[0] : null);
          setTimeout(() => {
            setActionTaken(null);
            setRejectionReason("");
          }, 3000);
        }
      })
    }
  };

  const handleSelectRequest = (request: any) => {
    setSelectedRequest(request);
    if (isMobile) {
      setShowDetails(true);
    }
  };

  if (!selectedRequest) {
    return (
      <Box>
        <Typography
          variant="h4"
          gutterBottom
          fontWeight={600}
          sx={{ mb: 3 }}
        >
          Approval Queue
        </Typography>

        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" gutterBottom>
            No pending requests
          </Typography>

          <Typography color="text.secondary">
            There are currently no access requests waiting for approval.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        variant="h4"
        gutterBottom
        fontWeight={600}
        sx={{ mb: 3, fontSize: { xs: "1.75rem", sm: "2.125rem" } }}
      >
        Approval Queue
      </Typography>

      {actionTaken && (
        <Alert
          severity={actionTaken === "approved" ? "success" : "error"}
          sx={{ mb: 3 }}
        >
          Request {selectedRequest!.id} has been {actionTaken}!
        </Alert>
      )}

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid item xs={12} md={4} sx={{ display: { xs: showDetails ? "none" : "block", md: "block" } }}>
          <Paper sx={{ borderRadius: 2 }}>
            <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
              <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}>
                Pending Requests ({pendingRequests.length})
              </Typography>
            </Box>
            <Box>
              {pendingRequests.map((request) => (
                <Box
                  key={request.id}
                  onClick={() => handleSelectRequest(request)}
                  sx={{
                    p: 2,
                    borderBottom: "1px solid #e0e0e0",
                    cursor: "pointer",
                    backgroundColor:
                      selectedRequest!.id === request.id ? "#e3f2fd" : "white",
                    "&:hover": {
                      backgroundColor:
                        selectedRequest!.id === request.id ? "#e3f2fd" : "#f5f7fa",
                    },
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={600} color="primary">
                    {request.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {request.employeeName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {request.folderPath}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8} sx={{ display: { xs: showDetails ? "block" : "none", md: "block" } }}>
          <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h5" gutterBottom fontWeight={600} sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
                Request Details
              </Typography>
              {isMobile && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setShowDetails(false)}
                >
                  Back
                </Button>
              )}
            </Box>
            <Chip
              label={selectedRequest!.id}
              color="primary"
              sx={{ mb: 3 }}
            />

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}>
                  <Person color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Requester
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {selectedRequest!.employeeName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedRequest!.employeeDepartment}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}>
                  <CalendarToday color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Request Date
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {new Date(selectedRequest!.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}>
                  <Folder color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Shared Folder
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {selectedRequest!.folderPath}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}>
                  <Description color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Department
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {selectedRequest!.employeeDepartment}
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
                <Typography variant="body2">{selectedRequest!.justification}</Typography>
              </Paper>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Rejection Reason (Optional)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Provide a reason if rejecting this request..."
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
              <Button
                variant="contained"
                color="success"
                size="large"
                startIcon={<CheckCircle />}
                onClick={handleApprove}
                sx={{ px: 4 }}
                fullWidth={isMobile}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="error"
                size="large"
                startIcon={<Cancel />}
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                sx={{ px: 4 }}
                fullWidth={isMobile}
              >
                Reject
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
