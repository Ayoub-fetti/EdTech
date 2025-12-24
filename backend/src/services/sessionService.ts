// services/sessionService.ts
import { pool } from './database';
import { Session, CreateSessionDto } from '../types';

export class SessionService {
  async create(data: CreateSessionDto): Promise<Session> {
    const result = await pool.query(
      'INSERT INTO sessions (date_session, start_time, end_time, course_id, teacher_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [data.dateSession, data.startTime, data.endTime, data.courseId, data.teacherId]
    );
    return result.rows[0];
  }

  async findAll(): Promise<Session[]> {
    const result = await pool.query('SELECT * FROM sessions ORDER BY date_session DESC, start_time ASC');
    return result.rows;
  }

  async findById(id: number): Promise<Session | null> {
    const result = await pool.query('SELECT * FROM sessions WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async findByCourse(courseId: number): Promise<Session[]> {
    const result = await pool.query('SELECT * FROM sessions WHERE course_id = $1 ORDER BY date_session DESC', [courseId]);
    return result.rows;
  }

  async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM sessions WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
}
