import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { courseService } from '../services/courseService';
import { sessionService } from '../services/sessionService';
import { presenceService } from '../services/presenceService';
import { studentService } from '../services/studentService';

interface Course {
  id: number;
  title: string;
  description?: string;
  teacherId: number;
}

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    courses: 0,
    sessions: 0,
    students: 0,
  });
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (user?.role === 'teacher' || user?.role === 'admin') {
          const [coursesRes, sessionsRes] = await Promise.all([
            courseService.getCourses(),
            sessionService.getSessions(),
          ]);
          
          let studentsCount = 0;
          if (user?.role === 'admin') {
            const studentsRes = await studentService.getStudents();
            studentsCount = studentsRes.data.length;
          }
          
          setStats({
            courses: coursesRes.data.length,
            sessions: sessionsRes.data.length,
            students: studentsCount,
          });
        } else if (user?.role === 'student') {
          const presencesRes = await presenceService.getPresencesByStudent(user.id);
          const coursesRes = await courseService.getStudentCourses(user.id);
          setEnrolledCourses(coursesRes.data);
          setStats({
            courses: coursesRes.data.length,
            sessions: 0,
            students: 0,
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Welcome, {user?.name}!
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <>
            <div className="bg-blue-500 text-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Courses</h3>
              <p className="text-3xl font-bold">{stats.courses}</p>
              <button
                onClick={() => navigate('/courses')}
                className="mt-4 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
              >
                View Courses
              </button>
            </div>
            
            <div className="bg-green-500 text-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Sessions</h3>
              <p className="text-3xl font-bold">{stats.sessions}</p>
              <button
                onClick={() => navigate('/sessions')}
                className="mt-4 bg-green-600 px-4 py-2 rounded hover:bg-green-700"
              >
                View Sessions
              </button>
            </div>
          </>
        )}
        
        {user?.role === 'admin' && (
          <div className="bg-purple-500 text-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Students</h3>
            <p className="text-3xl font-bold">{stats.students}</p>
            <button
              onClick={() => navigate('/students')}
              className="mt-4 bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
            >
              View Students
            </button>
          </div>
        )}
        
        {user?.role === 'student' && (
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">My Courses</h3>
            <p className="text-3xl font-bold">{stats.courses}</p>
            <button
              onClick={() => navigate('/courses')}
              className="mt-4 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              View Courses
            </button>
          </div>
        )}
      </div>
      
      {user?.role === 'student' && enrolledCourses.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-semibold mb-4">My Enrolled Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="border p-4 rounded-lg hover:shadow-md transition">
                <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{course.description || 'No description'}</p>
                <button
                  onClick={() => navigate(`/sessions?courseId=${course.id}`)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
                >
                  View Sessions
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          {user?.role === 'teacher' && (
            <>
              <button
                onClick={() => navigate('/courses/new')}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Create Course
              </button>
              <button
                onClick={() => navigate('/sessions/new')}
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
              >
                Create Session
              </button>
            </>
          )}
          {user?.role === 'admin' && (
            <>
              <button
                onClick={() => navigate('/courses/new')}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Create Course
              </button>
              <button
                onClick={() => navigate('/students/new')}
                className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
              >
                Add Student
              </button>
              <button
                onClick={() => navigate('/teachers/new')}
                className="bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-600"
              >
                Create Teacher
              </button>
            </>
          )}
          {user?.role === 'teacher' && (
            <button
              onClick={() => navigate('/students/new')}
              className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
            >
              Add Student
            </button>
          )}
          <button
            onClick={() => navigate('/presences')}
            className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
          >
            View Presences
          </button>
        </div>
      </div>
    </div>
  );
};