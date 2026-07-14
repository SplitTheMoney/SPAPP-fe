import { CreateUserDTO, User } from "../types/types";
import api from "./api/axios"

export const getUsers = async() : Promise<User[]> => {
    const response = await api.get("/users");
    return response.data;
}

export const createUser = async(data: CreateUserDTO) : Promise<User> => {
    const response = await api.post("/users/create", data);
    return response.data;
}

export const updateUser = async(
    userId: number,
    data: CreateUserDTO
) : Promise<User> => {
    const response = await api.put("/users/" + userId, data);
    return response.data;
}

export const deleteUser = async(userId: number) : Promise<User> => {
    const response = await api.delete("/users/" + userId);
    return response.data;
}