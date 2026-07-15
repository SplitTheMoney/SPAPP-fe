import { LoginRequestDTO, LoginResponseDTO } from "../types/types";
import api from "./api/axios";

export const login = async (data: LoginRequestDTO): Promise<LoginResponseDTO> => {
  const response = await api.post("/auth/login", data);
  localStorage.setItem("token", response.data.token);
  localStorage.setItem("role", response.data.role);
  return response.data;
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem("token");
};
