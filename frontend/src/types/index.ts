export interface User {
  id: number;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
}

export interface Course {
  id: number;
  title: string;
  description: string;
  teacherId: number;
}

export interface Session {
  id: number;
  dateSession: string;
  startTime: string;
  endTime: string;
  courseId: number;
  teacherId: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface LoginResponse {
  token: string;
  user: User;
}
