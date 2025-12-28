import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import type { Course } from '../../types/index.ts';
import { useAuth } from '../../contexts/AuthContext';

interface Student {
  id: number;
  name: string;
  email: string;
}

export const CoursesList = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseService.getCourses();
      setCourses(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await courseService.deleteCourse(id);
      fetchCourses();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete course');
    }
  };

  const handleViewStudents = async (courseId: number) => {
    if (selectedCourseId === courseId) {
      setSelectedCourseId(null);
      setEnrolledStudents([]);
      return;
    }
    
    setSelectedCourseId(courseId);
    setLoadingStudents(true);
    try {
      const response = await courseService.getEnrolledStudents(courseId);
      setEnrolledStudents(response.data);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to fetch enrolled students');
      setEnrolledStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Courses</h1>
        {(user?.role === 'admin' || user?.role === 'teacher') && (
          <button
            onClick={() => navigate('/courses/new')}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Create Course
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
            <p className="text-gray-600 mb-4">{course.description || 'No description'}</p>
            <div className="flex gap-2 flex-wrap mb-4">
              <button
                onClick={() => navigate(`/sessions?courseId=${course.id}`)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
              >
                View Sessions
              </button>
              <button
                onClick={() => handleViewStudents(course.id)}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 text-sm"
              >
                {selectedCourseId === course.id ? 'Hide Students' : 'View Students'}
              </button>
              {(user?.role === 'admin' || user?.role === 'teacher') && (
                <>
                  <button
                    onClick={() => navigate(`/courses/${course.id}/edit`)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
            
            {selectedCourseId === course.id && (
              <div className="mt-4 border-t pt-4">
                <h3 className="font-semibold mb-2">Enrolled Students:</h3>
                {loadingStudents ? (
                  <div className="text-sm text-gray-500">Loading...</div>
                ) : enrolledStudents.length > 0 ? (
                  <ul className="space-y-1">
                    {enrolledStudents.map((student) => (
                      <li key={student.id} className="text-sm text-gray-700">
                        {student.name} ({student.email})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-500">No students enrolled</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No courses found
        </div>
      )}
    </div>
  );
};