import type { ObjectId } from "../deps.ts";

export interface TokenStructure {
  expires: Date;
  token: string;
}

export interface UserStructure {
  id: string;
  username: string;
  email: string;
  role: string;
  isDisabled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoggingStructure {
  token: TokenStructure;
  user: UserStructure;
}

export interface CreateUserStructure {
  username: string;
  email: string;
  password: string;
  role: string;
  isDisabled: boolean;
}

export interface UpdateUserStructure {
  username?: string;
  role?: string;
  isDisabled?: boolean;
}

export interface UpdatedStructure {
  matchedCount: number;
  modifiedCount: number;
  upsertedId: typeof ObjectId | null;
}

export interface Err {
  status: number;
  name: string;
  path: string;
  param: string;
  message: string;
  type: string;
}

export interface JwtPayload {
  iss: string;
  iat: number;
  id: string;
  exp: number;
}
