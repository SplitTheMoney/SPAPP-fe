export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export type User = {
  name: string,
  email: string,
  department: string,
  role: "EMPLOYEE" | "MANAGER" | "ADMIN"
}

export type AccessRequest = {
  id: number;
  employee: User;
  manager: User;
  folder: SharedFolder;
  createdAt: string;
  status: "CREATED" | "APPROVED" | "REJECTED";
  justification: string;
  decisionDate: string;
  rejectionReason: string;
};

export type SharedFolder = {
  id: number;
  name: string;
  path: string;
  description: string;
}