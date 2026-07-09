import { AccessRequest, AccessRequestResponseDTO, CreateRequestRequestDTO } from "../types/types";
import api from "./api/axios";

export const getAccessRequests = async (): Promise<AccessRequestResponseDTO[]> => {
  const response = await api.get("/requests");
  return response.data;
};

export const getManagerRequests = async (): Promise<AccessRequest[]> => {
  const response = await api.get("/requests/manager");
  return response.data;
};

export const createRequest = async(data: CreateRequestRequestDTO) : Promise<AccessRequestResponseDTO> => {
    const response = await api.post("/requests", data);
    return response.data;
}
