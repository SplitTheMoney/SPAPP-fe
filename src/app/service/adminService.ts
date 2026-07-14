import { CreateUserDTO, User } from "../types/types";
import api from "./api/axios"

export const getUsers = async() : Promise<User[]> => {
    const response = await api.get("/user");
    return response.data;
}

export const createUser = async(data: CreateUserDTO) : Promise<User> => {
    const response = await api.post("/user/create", data);
    return response.data;
}

export const updateUser = async(
    userId: number,
    data: CreateUserDTO
) : Promise<User> => {
    const response = await api.put("/user/" + userId, data);
    return response.data;
}

export const deleteUser = async(userId: number) : Promise<User> => {
    const response = await api.delete("/user/" + userId);
    return response.data;
}