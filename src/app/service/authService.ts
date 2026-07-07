import { LoginRequest } from "../types/types";
import api from "./api/axios";

export const login = async (
  email: string,
  password: string,
): Promise<LoginRequest> => {
  const response = await api.post("/auth/login", { email, password });
  localStorage.setItem("token", response.data.token);
  return response.data;
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem("token");
};
