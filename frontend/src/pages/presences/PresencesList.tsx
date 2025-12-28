import { useEffect, useState } from 'react';
import { presenceService } from '../../services/presenceService';
import { courseService } from '../../services/courseService';
import { studentService } from '../../services/studentService';
import { useAuth } from '../../contexts/AuthContext';
import type { Presence, Course } from '../../types/index.ts';

export const PresencesList = () => {
  const [presences, setPresences] = useState<Presence[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState<'class' | 'student' | 'period'>('class');
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
    setLoading(false);
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await courseService.getCourses();
      setCourses(response.data);
    } catch (err: any) {
      console.error('Failed to fetch courses:', err);
    }
  };

  const fetchPresences = async () => {
    try {
      setLoading(true);
      let response;

      if (filterType === 'class' && selectedCourse) {
        response = await presenceService.getPresencesByClass(selectedCourse);
      } else if (filterType === 'student' && selectedStudent) {
        response = await presenceService.getPresencesByStudent(selectedStudent);
      } else if (filterType === 'period' && startDate && endDate) {
        response = await presenceService.getPresencesByPeriod(startDate, endDate);
      } else {
        setLoading(false);
        return;
      }

      if (response.data && response.data.success) {
        setPresences(response.data.data);
      } else if (Array.isArray(response.data)) {
        // Handle case where response is directly an array
        setPresences(response.data);
      } else {
        setError(response.data?.error || 'Failed to fetch presences');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch presences');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = () => {
    setPresences([]);
    setError('');
  };

  if (loading && presences.length === 0) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Presences</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Filter Type</label>
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value as 'class' | 'student' | 'period');
              handleFilterChange();
            }}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="class">By Class</option>
            <option value="student">By Student</option>
            <option value="period">By Period</option>
          </select>
        </div>

        {filterType === 'class' && (
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Course</label>
            <select
              value={selectedCourse || ''}
              onChange={(e) => setSelectedCourse(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {filterType === 'student' && (
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Student ID</label>
            <input
              type="number"
              value={selectedStudent || ''}
              onChange={(e) => setSelectedStudent(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {filterType === 'period' && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        <button
          onClick={fetchPresences}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Fetch Presences
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {presences.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Session ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {presences.map((presence) => (
                <tr key={presence.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{presence.sessionId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{presence.studentId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      presence.status === 'present' ? 'bg-green-100 text-green-800' :
                      presence.status === 'absent' ? 'bg-red-100 text-red-800' :
                      presence.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {presence.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(presence.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};