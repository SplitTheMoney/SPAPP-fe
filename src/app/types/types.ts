export type LoginRequestDTO = {
  email: string;
  password: string;
};

export type LoginResponseDTO = {
  token: string;
  id: number; 
  name: string;
  email: string;
  role: string;
};

export type User = {
  id: number,
  name: string,
  email: string,
  department: "FINANCE" | "HR" | "IT" | "MARKETING" | "OPERATIONS" | "SALES" | "LEGAL",
  role: "EMPLOYEE" | "MANAGER" | "ADMIN",
}

export type AccessRequest = {
  id: number,
  employeeId: number,
  employeeName: string,
  employeeDepartment: string,
  managerId: number,
  managerName: string,
  folderId: number,
  folderPath: string,
  justification: string,
  accessType: "READ" | "WRITE",
  status: "CREATED" | "REJECTED" | "APPROVED",
  rejectionReason?: string,
  expirationDate?: string,
  createdAt: string,
  decisionDate?: string
}

export type SharedFolder = {
  id: number;
  name: string;
  path: string;
  description: string;
}


export type CreateRequestRequestDTO = {
  folderId: number,
  justification: string,
  accessType: "READ" | "WRITE"
}

export type AccessRequestResponseDTO = {
  id: number,
  employeeId: number,
  employeeName: string,
  employeeDepartment: string,
  managerId: number,
  managerName: string,
  folderId: number,
  folderPath: string,
  justification: string,
  accessType: "READ" | "WRITE",
  status: "CREATED" | "REJECTED" | "APPROVED",
  rejectionReason?: string,
  expirationDate?: string,
  createdAt: string,
  decisionDate?: string
}

export type CreateUserDTO = {
  name: string,
  email: string,
  password: string,
  department: string,
  role: string
}
