import { Request } from 'express';

export enum Role {
  TEACHER = 'teacher',
  ADMIN = 'admin'
}

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  createdAt: Date;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  teacherId: number;
  createdAt: Date;
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}
