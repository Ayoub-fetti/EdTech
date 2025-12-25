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

export interface Session {
  id: number;
  dateSession: Date;
  startTime: string;
  endTime: string;
  courseId: number;
  teacherId: number;
  createdAt: Date;
}

export interface CreateSessionDto {
  dateSession: string;
  startTime: string;
  endTime: string;
  courseId: number;
  teacherId: number;
}

export interface CreateStudentDto {
  email: string;
  password: string;
  name: string;
}

export interface UpdateStudentDto {
  name?: string;
  email?: string;
}

export interface CreateCourseDto {
  title: string;
  description?: string;
  teacherId: number;
}

export enum PresenceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late'
}

export interface Presence {
  id: number;
  sessionId: number;
  studentId: number;
  status: PresenceStatus;
  createdAt: Date;
}

export interface CreatePresenceDto {
  sessionId: number;
  studentId: number;
  status: PresenceStatus;
}

export type PresenceApiResponse = {
  success: true;
  data: Presence;
} | {
  success: false;
  error: string;
};

export type PresenceListApiResponse = {
  success: true;
  data: Presence[];
  indicators?: {
    totalSessions: number;
    absences: number;
    lates: number;
    attendanceRate: number;
  };
} | {
  success: false;
  error: string;
};
