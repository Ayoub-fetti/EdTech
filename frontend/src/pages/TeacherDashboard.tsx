// /home/ayoub/Documents/youcode/EdTech/frontend/src/pages/TeacherDashboard.tsx

import { useState, useEffect } from 'react';
import { courseService, sessionService } from '../services/api';
import { type Course, type Session } from '../types/index';

export const TeacherDashboard = () => {
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
      <h2>Teacher Dashboard</h2>
      
      <section>
        <h3>My Classes</h3>
        {courses.map(course => (
          <div key={course.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h4>{course.title}</h4>
            <p>{course.description}</p>
          </div>
        ))}
      </section>

      <section>
        <h3>Recent Sessions</h3>
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
