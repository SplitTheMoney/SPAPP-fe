import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Add, Edit, Delete, PersonAdd } from "@mui/icons-material";
import { createUser, deleteUser, getUsers, updateUser } from "../service/adminService";
import { CreateUserDTO, User } from "../types/types";

const roles = ["EMPLOYEE", "MANAGER", "ADMIN"];
const departments = ["FINANCE", "HR", "IT", "MARKETING", "OPERATIONS", "SALES", "LEGAL"];

export function UserManagement() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [users, setUsers] = useState<User[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<CreateUserDTO>({
    name: "",
    email: "",
    password: "",
    department: "",
    role: ""
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await getUsers();
        setUsers(users);
      } catch (err: any) {
        console.error("Failed to load users", err.response?.data?.message);
      }
    } 

    loadUsers();
  }, []);

  const handleOpenDialog = (user?: any) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
        department: user.department,
      });
    } else {
      setEditingUser(null);
      setFormData({ name: "", email: "", password: "", role: "", department: "" });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setFormData({ name: "", email: "", password: "", role: "", department: "" });
  };

  const handleSaveUser = async () => {
    if (editingUser) {
      const user = await updateUser(editingUser.id, formData);
      setUsers(
        users.map((u) =>
          u.id === editingUser?.id ? user : u
        )
      );
    } else {
      const user = await createUser(formData);
      setUsers([
        ...users,
        user
      ]);
    }
    handleCloseDialog();
  };

  const handleDeleteUser = async (id: number) => {
    const user = await deleteUser(id);
    setUsers(users.filter((u) => u.id !== user.id));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "error";
      case "MANAGER":
        return "secondary";
      default:
        return "primary";
    }
  };

  return (
    <Box>
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography
          variant="h4"
          fontWeight={600}
          sx={{ fontSize: { xs: "1.75rem", sm: "2.125rem" } }}
        >
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          size="large"
          fullWidth={isMobile}
        >
          Add User
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Box sx={{ p: { xs: 2, sm: 3 }, borderBottom: "1px solid #e0e0e0" }}>
          <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}>
            All Users ({users.length})
          </Typography>
        </Box>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: { xs: 600, sm: 750 } }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f7fa" }}>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{
                    "&:hover": { backgroundColor: "#f5f7fa" },
                  }}
                >
                  <TableCell sx={{ fontWeight: 500 }}>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      size="small"
                      color={getRoleColor(user.role)}
                    />
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenDialog(user)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Delete />
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
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PersonAdd />
            {editingUser ? "Edit User" : "Add New User"}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              label="Full Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <TextField
              label={editingUser? "New Password" : "Password"}
              type="password"
              fullWidth
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value })}
              required={!editingUser}
            />
            <TextField
              select
              label="Role"
              fullWidth
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Department"
              fullWidth
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
            >
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveUser}
            disabled={!formData.name || !formData.email || !formData.role || !formData.department}
          >
            {editingUser ? "Save Changes" : "Add User"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
