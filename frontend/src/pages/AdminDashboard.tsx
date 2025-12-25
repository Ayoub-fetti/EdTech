// /home/ayoub/Documents/youcode/EdTech/frontend/src/pages/AdminDashboard.tsx

import { useState, useEffect } from 'react';
import { courseService, sessionService } from '../services/api';
import { type Course, type Session } from '../types/index.ts';

export const AdminDashboard = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [coursesRes, sessionsRes] = await Promise.all([
          courseService.getCourses(),
          sessionService.getSessions()
        ]);
        setCourses(coursesRes.data);
        setSessions(sessionsRes.data);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    loadData();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      
      <section>
        <h3>All Classes ({courses.length})</h3>
        {courses.map(course => (
          <div key={course.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h4>{course.title}</h4>
            <p>{course.description}</p>
          </div>
        ))}
      </section>

      <section>
        <h3>All Sessions ({sessions.length})</h3>
        {sessions.map(session => (
          <div key={session.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <p>Date: {session.dateSession}</p>
            <p>Time: {session.startTime} - {session.endTime}</p>
          </div>
        ))}
      </section>
    </div>
  );
};
