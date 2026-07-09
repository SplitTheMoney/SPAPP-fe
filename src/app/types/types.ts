export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export type AccessRequest = {
  id: number;
  user: string;
  email: string;
  department: string;
  folder: string;
  date: string;
  status: "CREATED" | "APPROVED" | "REJECTED";
  justification: string;
  reviewedBy: string;
  reviewDate: string;
  reviewComments: string;
};
