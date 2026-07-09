export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export type SharedFolder = {
  id: number;
  name: string;
  path: string;
  description: string;
}