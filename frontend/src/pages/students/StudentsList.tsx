import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import { courseService } from '../../services/courseService';
import { useAuth } from '../../contexts/AuthContext';

interface Student {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Course {
  id: number;
  title: string;
  description?: string;
}

export const StudentsList = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrollingStudentId, setEnrollingStudentId] = useState<number | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentService.getStudents();
      setStudents(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch students');
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
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    try {
      await studentService.deleteStudent(id);
      fetchStudents();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete student');
    }
  };

  const handleEnrollClick = (studentId: number) => {
    setEnrollingStudentId(studentId);
    setSelectedCourseId('');
  };

  const handleEnrollCancel = () => {
    setEnrollingStudentId(null);
    setSelectedCourseId('');
  };

  const handleEnroll = async (studentId: number) => {
    if (!selectedCourseId) {
      alert('Please select a course');
      return;
    }
    
    try {
      await studentService.enrollStudent(studentId, Number(selectedCourseId));
      alert('Student enrolled successfully');
      setEnrollingStudentId(null);
      setSelectedCourseId('');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to enroll student');
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Students</h1>
        {(user?.role === 'admin' || user?.role === 'teacher') && (
          <button
            onClick={() => navigate('/students/new')}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Add Student
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {enrollingStudentId === student.id ? (
                    <div className="flex gap-2 items-center">
                      <select
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="px-3 py-1 border rounded text-sm"
                      >
                        <option value="">Select Course</option>
                        {courses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.title}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleEnroll(student.id)}
                        className="text-green-600 hover:text-green-900 px-2"
                        disabled={!selectedCourseId}
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleEnrollCancel}
                        className="text-gray-600 hover:text-gray-900 px-2"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEnrollClick(student.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Enroll
                      </button>
                      {(user?.role === 'admin' || user?.role === 'teacher') && (
                        <button
                          onClick={() => navigate(`/students/${student.id}/edit`)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          Edit
                        </button>
                      )}
                      {user?.role === 'admin' && (
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {students.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No students found
        </div>
      )}
    </div>
  );
};