import { pool } from './database';
import { Course, CreateCourseDto, User } from '../types';

export class CourseService {
  async create(data: CreateCourseDto): Promise<Course> {
    const result = await pool.query(
      'INSERT INTO courses (title, description, teacher_id) VALUES ($1, $2, $3) RETURNING *',
      [data.title, data.description, data.teacherId]
    );
    return result.rows[0];
  }

  async findAll(): Promise<Course[]> {
    const result = await pool.query('SELECT * FROM courses ORDER BY created_at DESC');
    return result.rows;
  }

  async findById(id: number): Promise<Course | null> {
    const result = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async update(id: number, data: Partial<CreateCourseDto>): Promise<Course | null> {
    const fields = [];
    const values = [];
    let paramIndex = 2;

    if (data.title) {
      fields.push(`title = $${paramIndex++}`);
      values.push(data.title);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(data.description);
    }
    if (data.teacherId) {
      fields.push(`teacher_id = $${paramIndex++}`);
      values.push(data.teacherId);
    }

    if (fields.length === 0) return null;

    const result = await pool.query(
      `UPDATE courses SET ${fields.join(', ')} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM courses WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  async getEnrolledStudents(courseId: number): Promise<User[]> {
    const result = await pool.query(
      `SELECT u.id, u.email, u.name, u.role, u.created_at 
       FROM users u
       INNER JOIN enrollments e ON u.id = e.student_id
       WHERE e.course_id = $1 AND u.role = 'student'
       ORDER BY u.name`,
      [courseId]
    );
    return result.rows;
  }

  async getStudentCourses(studentId: number): Promise<Course[]> {
    const result = await pool.query(
      `SELECT c.id, c.title, c.description, c.teacher_id, c.created_at
       FROM courses c
       INNER JOIN enrollments e ON c.id = e.course_id
       WHERE e.student_id = $1
       ORDER BY c.title`,
      [studentId]
    );
    return result.rows;
  }
}
