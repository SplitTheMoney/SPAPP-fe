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

export const getPendingRequests = async (): Promise<AccessRequest[]> => {
    const response = await api.get("/requests/pending");
    return response.data;
}


export const acceptRequest = async(
    requestId: number,
    expirationDate: string
) : Promise<number> => {
    const response = await api.put(`/requests/${requestId}/approve`, { expirationDate });
    return response.data;
}

export const rejectRequest = async(
    requestId: number,
    reason: string
) : Promise<number> => {
    const response = await api.put(`/requests/${requestId}/reject`, { rejectionReason: reason });
    return response.data;
}
