import { AccessRequest } from "../types/types";
import api from "./api/axios";

export const getAccessRequests = async (): Promise<AccessRequest[]> => {
  const response = await api.get("/requests");
  return response.data;
};

export const getManagerRequests = async (): Promise<AccessRequest[]> => {
  const response = await api.get("/requests/manager");
  return response.data;
};

export const getPendingRequests = async (): Promise<AccessRequest[]> => {
    const response = await api.get("/requests/pending");
    return response.data;
}

export const createRequest = async(
    folderId: number,
    justification: string
) : Promise<number> => {
    const response = await api.post("/requests/create", {folderId, justification});
    return response.status;
}

export const acceptRequest = async(
    requestId: number,
) : Promise<number> => {
    const response = await api.put("/requests/" + requestId + "/accept");
    return response.status;
}

export const rejectRequest = async(
    requestId: number,
    reason: string
) : Promise<number> => {
    const response = await api.put("/requests/" + requestId + "/reject", { reason });
    return response.status;
}
