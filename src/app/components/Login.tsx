import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Container
} from "@mui/material";
import { FolderShared } from "@mui/icons-material";
import { login } from "../service/authService";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    login({ email, password }).then((result) => {
      if (result) {
        console.log("RESULT---->", result);
        navigate("/dashboard");
      }
    })
  
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        p: { xs: 2, sm: 0 },
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 4, md: 6 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              width: { xs: 64, sm: 80 },
              height: { xs: 64, sm: 80 },
              borderRadius: "50%",
              background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <FolderShared sx={{ fontSize: { xs: 32, sm: 40 }, color: "white" }} />
          </Box>

          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight={600}
            sx={{ fontSize: { xs: "1.5rem", sm: "2.125rem" }, textAlign: "center" }}
          >
            Access Request System
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 4, textAlign: "center" }}
          >
            Sign in to manage folder access requests
          </Typography>

          <form onSubmit={handleLogin} style={{ width: "100%" }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              variant="outlined"
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ py: 1.5 }}
            >
              Login
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
