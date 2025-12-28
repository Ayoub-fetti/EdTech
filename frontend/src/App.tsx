import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { CoursesList } from './pages/courses/CoursesList';
import { CourseForm } from './pages/courses/CourseForm';
import { StudentsList } from './pages/students/StudentsList';
import { StudentForm } from './pages/students/StudentForm';
import { TeachersList } from './pages/teachers/TeachersList';
import { TeacherForm } from './pages/teachers/TeacherForm';
import { SessionsList } from './pages/sessions/SessionsList';
import { SessionForm } from './pages/sessions/SessionForm';
import { PresencesList } from './pages/presences/PresencesList';
import { MarkPresence } from './pages/presences/MarkPresence';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/login" replace />} />
            <Route path="login" element={<Login />} />
            
            <Route 
              path="dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Courses Routes */}
            <Route 
              path="courses" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                  <CoursesList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="courses/new" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                  <CourseForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="courses/:id/edit" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                  <CourseForm />
                </ProtectedRoute>
              } 
            />
            
            {/* Students Routes */}
            <Route 
              path="students" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                  <StudentsList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="students/new" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                  <StudentForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="students/:id/edit" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                  <StudentForm />
                </ProtectedRoute>
              } 
            />
            
            {/* Teachers Routes */}
            <Route 
              path="teachers" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <TeachersList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="teachers/new" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <TeacherForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="teachers/:id/edit" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <TeacherForm />
                </ProtectedRoute>
              } 
            />
            
            {/* Sessions Routes */}
            <Route 
              path="sessions" 
              element={
                <ProtectedRoute>
                  <SessionsList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="sessions/new" 
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <SessionForm />
                </ProtectedRoute>
              } 
            />
            
            {/* Presences Routes */}
            <Route 
              path="presences" 
              element={
                <ProtectedRoute>
                  <PresencesList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="presences/mark/:sessionId" 
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <MarkPresence />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;