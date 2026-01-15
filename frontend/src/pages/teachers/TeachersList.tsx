import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { teacherService } from '../../services/teacherService';
import { useAuth } from '../../contexts/AuthContext';

interface Teacher {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const TeachersList = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await teacherService.getTeachers();
      setTeachers(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this teacher?')) return;
    
    try {
      await teacherService.deleteTeacher(id);
      fetchTeachers();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete teacher');
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Teachers</h1>
        {user?.role === 'admin' && (
          <button
            onClick={() => navigate('/teachers/new')}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Add Teacher
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
              {user?.role === 'admin' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.email}</td>
                {user?.role === 'admin' && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/teachers/${teacher.id}/edit`)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(teacher.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {teachers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No teachers found
        </div>
      )}
    </div>
  );
};


