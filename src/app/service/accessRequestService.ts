import api from "./api/axios";

export const createRequest = async(
    folderId: number,
    justification: string
) : Promise<any> => {
    const response = await api.post("/requests/create", {folderId, justification});
    return response.status;
}
