import { pool } from './database';
import { Course, CreateCourseDto } from '../types';

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
}
