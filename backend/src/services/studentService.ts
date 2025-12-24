import { pool } from './database';
import { User, CreateStudentDto, UpdateStudentDto } from '../types';
import bcrypt from 'bcryptjs';

export class StudentService {
  async create(data: CreateStudentDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [data.email, hashedPassword, data.name, 'student']
    );
    return result.rows[0];
  }

  async findAll(): Promise<User[]> {
    const result = await pool.query('SELECT * FROM users WHERE role = $1 ORDER BY created_at DESC', ['student']);
    return result.rows;
  }

  async findById(id: number): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE id = $1 AND role = $2', [id, 'student']);
    return result.rows[0] || null;
  }

  async update(id: number, data: UpdateStudentDto): Promise<User | null> {
    const fields = [];
    const values = [];
    let paramIndex = 2;

    if (data.name) {
      fields.push(`name = $${paramIndex++}`);
      values.push(data.name);
    }
    if (data.email) {
      fields.push(`email = $${paramIndex++}`);
      values.push(data.email);
    }

    if (fields.length === 0) return null;

    const result = await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $1 AND role = 'student' RETURNING *`,
      [id, ...values]
    );
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM users WHERE id = $1 AND role = $2', [id, 'student']);
    return result.rowCount > 0;
  }

  async enrollInCourse(studentId: number, courseId: number): Promise<boolean> {
    try {
      await pool.query(
        'INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2)',
        [studentId, courseId]
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  async unenrollFromCourse(studentId: number, courseId: number): Promise<boolean> {
    const result = await pool.query(
      'DELETE FROM enrollments WHERE student_id = $1 AND course_id = $2',
      [studentId, courseId]
    );
    return result.rowCount > 0;
  }
}
