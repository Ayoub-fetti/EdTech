import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { sessionService } from '../../services/sessionService';
import { courseService } from '../../services/courseService';
import type { Session, Course } from '../../types/index.ts';
import { useAuth } from '../../contexts/AuthContext';

export const SessionsList = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    const courseId = searchParams.get('courseId');
    if (courseId) {
      setSelectedCourse(Number(courseId));
      fetchSessionsByCourse(Number(courseId));
    } else {
      fetchSessions();
    }
    fetchCourses();
  }, [searchParams]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await sessionService.getSessions();
      setSessions(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  const fetchSessionsByCourse = async (courseId: number) => {
    try {
      setLoading(true);
      const response = await sessionService.getSessionsByCourse(courseId);
      setSessions(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await courseService.getCourses();
      setCourses(response.data);
    } catch (err: any) {
      console.error('Failed to fetch courses:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this session?')) return;
    
    try {
      await sessionService.deleteSession(id);
      if (selectedCourse) {
        fetchSessionsByCourse(selectedCourse);
      } else {
        fetchSessions();
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete session');
    }
  };

  const handleCourseFilter = (courseId: number | null) => {
    setSelectedCourse(courseId);
    if (courseId) {
      fetchSessionsByCourse(courseId);
    } else {
      fetchSessions();
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sessions</h1>
        {user?.role === 'teacher' && (
          <button
            onClick={() => navigate('/sessions/new')}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Create Session
          </button>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Filter by Course</label>
        <select
          value={selectedCourse || ''}
          onChange={(e) => handleCourseFilter(e.target.value ? Number(e.target.value) : null)}
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Courses</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sessions.map((session) => {
              // Handle both camelCase and snake_case field names
              const dateSession = session.dateSession || (session as any).date_session;
              const startTime = session.startTime || (session as any).start_time;
              const endTime = session.endTime || (session as any).end_time;
              const courseId = session.courseId || (session as any).course_id;
              
              return (
                <tr key={session.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dateSession ? new Date(dateSession).toLocaleDateString() : 'Invalid Date'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {startTime || ''} - {endTime || ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{courseId || ''}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    {user?.role === 'teacher' && (
                      <button
                        onClick={() => navigate(`/presences/mark/${session.id}`)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Mark Presence
                      </button>
                    )}
                    {user?.role === 'teacher' && (
                      <button
                        onClick={() => handleDelete(session.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sessions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No sessions found
        </div>
      )}
    </div>
  );
};