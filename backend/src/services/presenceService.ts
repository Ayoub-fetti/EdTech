import { pool } from './database';
import { Presence, CreatePresenceDto, PresenceStatus } from '../types';

export class PresenceService {
  async createPresence(data: CreatePresenceDto): Promise<Presence> {
    // Validation séance existante
    const sessionCheck = await pool.query('SELECT id FROM sessions WHERE id = $1', [data.sessionId]);
    if (sessionCheck.rows.length === 0) {
      throw new Error('Session not found');
    }

    // Validation élève dans la classe
    const enrollmentCheck = await pool.query(`
      SELECT e.id FROM enrollments e 
      JOIN sessions s ON s.course_id = e.course_id 
      WHERE e.student_id = $1 AND s.id = $2
    `, [data.studentId, data.sessionId]);
    
    if (enrollmentCheck.rows.length === 0) {
      throw new Error('Student not enrolled in this course');
    }

    // Validation séance non validée deux fois
    const existingPresence = await pool.query(
      'SELECT id FROM presences WHERE session_id = $1 AND student_id = $2',
      [data.sessionId, data.studentId]
    );
    
    if (existingPresence.rows.length > 0) {
      throw new Error('Presence already recorded for this session');
    }

    const result = await pool.query(`
      INSERT INTO presences (session_id, student_id, status)
      VALUES ($1, $2, $3)
      RETURNING id, session_id as "sessionId", student_id as "studentId", status, created_at as "createdAt"
    `, [data.sessionId, data.studentId, data.status]);

    return result.rows[0];
  }

  async getPresencesByClass(courseId: number): Promise<Presence[]> {
    const result = await pool.query(`
      SELECT p.id, p.session_id as "sessionId", p.student_id as "studentId", 
             p.status, p.created_at as "createdAt"
      FROM presences p
      JOIN sessions s ON s.id = p.session_id
      WHERE s.course_id = $1
      ORDER BY s.date_session DESC, p.created_at DESC
    `, [courseId]);

    return result.rows;
  }

  async getPresencesByStudent(studentId: number): Promise<Presence[]> {
    const result = await pool.query(`
      SELECT p.id, p.session_id as "sessionId", p.student_id as "studentId",
             p.status, p.created_at as "createdAt"
      FROM presences p
      WHERE p.student_id = $1
      ORDER BY p.created_at DESC
    `, [studentId]);

    return result.rows;
  }

  async getPresencesByPeriod(startDate: string, endDate: string): Promise<Presence[]> {
    const result = await pool.query(`
      SELECT p.id, p.session_id as "sessionId", p.student_id as "studentId",
             p.status, p.created_at as "createdAt"
      FROM presences p
      JOIN sessions s ON s.id = p.session_id
      WHERE s.date_session BETWEEN $1 AND $2
      ORDER BY s.date_session DESC
    `, [startDate, endDate]);

    return result.rows;
  }

  async getStudentIndicators(studentId: number): Promise<{
    totalSessions: number;
    absences: number;
    lates: number;
    attendanceRate: number;
  }> {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_sessions,
        COUNT(CASE WHEN status = 'absent' THEN 1 END) as absences,
        COUNT(CASE WHEN status = 'late' THEN 1 END) as lates,
        COUNT(CASE WHEN status = 'present' THEN 1 END) as presents
      FROM presences
      WHERE student_id = $1
    `, [studentId]);

    const { total_sessions, absences, lates, presents } = result.rows[0];
    const attendanceRate = total_sessions > 0 ? (presents / total_sessions) * 100 : 0;

    return {
      totalSessions: parseInt(total_sessions),
      absences: parseInt(absences),
      lates: parseInt(lates),
      attendanceRate: Math.round(attendanceRate * 100) / 100
    };
  }
}
