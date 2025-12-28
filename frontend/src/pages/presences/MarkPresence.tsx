import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { presenceService } from '../../services/presenceService';
import { courseService } from '../../services/courseService';
import { sessionService } from '../../services/sessionService';

interface Student {
  id: number;
  name: string;
  email: string;
}

export const MarkPresence = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [presences, setPresences] = useState<Record<number, 'present' | 'absent' | 'late' | 'excused'>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSessionAndStudents();
  }, [sessionId]);

  const fetchSessionAndStudents = async () => {
    try {
      setLoading(true);
      setError('');
      
      // First, get the session to find the courseId
      const sessionResponse = await sessionService.getSession(Number(sessionId));
      const session = sessionResponse.data;
      
      // Handle both camelCase and snake_case field names
      const courseId = session?.courseId || session?.course_id;
      
      if (!session || !courseId) {
        console.error('Session data:', session);
        setError('Session not found or invalid');
        setLoading(false);
        return;
      }
      
      // Then, get enrolled students for that course
      const studentsResponse = await courseService.getEnrolledStudents(courseId);
      setStudents(studentsResponse.data);
    } catch (err: any) {
      console.error('Error fetching session:', err);
      setError(err.response?.data?.error || 'Failed to fetch session or enrolled students');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId: number, status: 'present' | 'absent' | 'late' | 'excused') => {
    setPresences({ ...presences, [studentId]: status });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const promises = Object.entries(presences).map(([studentId, status]) =>
        presenceService.createPresence({
          sessionId: Number(sessionId),
          studentId: Number(studentId),
          status,
        })
      );

      await Promise.all(promises);
      navigate('/sessions');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to mark presences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Mark Presence - Session {sessionId}</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {students.length === 0 && !error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          No students enrolled in this course.
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Absent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Late</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Excused</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.name} ({student.email})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="radio"
                      name={`status-${student.id}`}
                      checked={presences[student.id] === 'present'}
                      onChange={() => handleStatusChange(student.id, 'present')}
                      className="h-4 w-4 text-green-600"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="radio"
                      name={`status-${student.id}`}
                      checked={presences[student.id] === 'absent'}
                      onChange={() => handleStatusChange(student.id, 'absent')}
                      className="h-4 w-4 text-red-600"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="radio"
                      name={`status-${student.id}`}
                      checked={presences[student.id] === 'late'}
                      onChange={() => handleStatusChange(student.id, 'late')}
                      className="h-4 w-4 text-yellow-600"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="radio"
                      name={`status-${student.id}`}
                      checked={presences[student.id] === 'excused'}
                      onChange={() => handleStatusChange(student.id, 'excused')}
                      className="h-4 w-4 text-blue-600"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            disabled={saving || Object.keys(presences).length === 0 || students.length === 0}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Presences'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/sessions')}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};