import { useState, useEffect } from 'react';
import { courseService } from '../services/courseService';
import { type Course } from '../types/index';

export const StudentDashboard = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await courseService.getCourses();
        setCourses(response.data);
      } catch (error) {
        console.error('Failed to load courses:', error);
      }
    };
    loadCourses();
  }, []);

  return (
    <div>
      <h2>Student Dashboard</h2>
      
      <section>
        <h3>My Courses</h3>
        {courses.map(course => (
          <div key={course.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h4>{course.title}</h4>
            <p>{course.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
};
