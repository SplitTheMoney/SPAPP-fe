import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
} from "@mui/material";
import { Send } from "@mui/icons-material";

const sharedFolders = [
  "Finance/Q4-Reports",
  "HR/Employee-Records",
  "IT/Server-Configs",
  "Marketing/Campaigns",
  "Sales/Q2-Data",
  "Legal/Contracts",
  "Operations/Procedures",
  "Research/Projects",
];

export function CreateRequest() {
  const [folder, setFolder] = useState("");
  const [justification, setJustification] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFolder("");
      setJustification("");
      setSubmitted(false);
    }, 3000);
  };

  return (
    <Box>
      <Typography
        variant="h4"
        gutterBottom
        fontWeight={600}
        sx={{ mb: 3, fontSize: { xs: "1.75rem", sm: "2.125rem" } }}
      >
        Create Access Request
      </Typography>

      <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 800, borderRadius: 2 }}>
        {submitted && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Access request submitted successfully! You will be notified once it's reviewed.
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Shared Folder
              </Typography>
              <TextField
                select
                fullWidth
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                required
                placeholder="Select a folder"
              >
                {sharedFolders.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Justification
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                required
                placeholder="Please provide a detailed justification for this access request..."
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<Send />}
              sx={{ alignSelf: "flex-start", px: 4 }}
            >
              Submit Request
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
