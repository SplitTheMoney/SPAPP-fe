import { useEffect, useState } from "react";
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
import { getAllFolders } from "../service/sharedFolderService";
import { SharedFolder } from "../types/types";
import { createRequest } from "../service/accessRequestService";

export function CreateRequest() {
  const [sharedFolders, setSharedFolders] = useState<SharedFolder[]>([]);
  const [folderId, setFolderId] = useState<number>(-1);
  const [accessType, setAccessType] = useState<"READ"|"WRITE">("READ");
  const [justification, setJustification] = useState<string>("");
  const [submitted, setSubmitted] = useState(0);
  const [error, setError] = useState<string>("");
  const [disableButton, setDisableButton] = useState(false);

  useEffect(() => {
    const loadFolders = async () => {
      try {
        const folders = await getAllFolders();
        setSharedFolders(folders);
      } catch (err: any) {
        console.error("Failed to load folders", err.response?.data?.message);
      }
    }

    loadFolders();
  }, []);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      setDisableButton(true);
      let request = await createRequest({folderId, accessType, justification})
      setFolderId(-1);
      setJustification("");
      setSubmitted(1);

    } catch (error: any) {
      console.error(error.response?.data?.message);
      setError(error.response?.data?.message)
      setSubmitted(2);

    } finally {
      setDisableButton(false);
      setTimeout(() =>{
        setSubmitted(0);
      }, 3000);
    }
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
        {submitted === 1 && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Access request submitted successfully! You will be notified once it's reviewed.
          </Alert>
        )}

        {submitted === 2 && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
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
                value={folderId}
                onChange={(e) => setFolderId(Number(e.target.value))}
                required
                placeholder="Select a folder"
              >
                {sharedFolders.map((folder) => (
                  <MenuItem key={folder.id} value={folder.id}>
                    {folder.path}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Access type
              </Typography>
              <TextField
                select
                fullWidth
                value={accessType}
                onChange={(e) => setAccessType(e.target.value as "READ" | "WRITE")}
                required
                placeholder="Access"
              >
                <MenuItem key="READ" value="READ">
                  Read
                </MenuItem>
                <MenuItem key="WRITE" value="WRITE">
                  Write
                </MenuItem>
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
              disabled={disableButton}
            >
              {disableButton ? "Submitting..." : "Submit Request"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
