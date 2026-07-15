import { SharedFolder } from "../types/types";
import api from "./api/axios";

export const getAllFolders = async (
): Promise<SharedFolder[]> => {
    const response = await api.get("/folders");
    return response.data;
}