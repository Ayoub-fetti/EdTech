-- Insert test data
INSERT INTO users (email, password, name, role) VALUES
('admin@edtech.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', 'admin'),
('teacher@edtech.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Teacher User', 'teacher'),
('student@edtech.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Student User', 'student');

INSERT INTO courses (title, description, teacher_id) VALUES
('Introduction to Programming', 'Learn the basics of programming', 2),
('Advanced Mathematics', 'Advanced mathematical concepts', 2);

INSERT INTO enrollments (student_id, course_id) VALUES
(3, 1),
(3, 2);

-- Test queries
SELECT * FROM users WHERE role = 'teacher';
SELECT c.*, u.name as teacher_name FROM courses c JOIN users u ON c.teacher_id = u.id;
SELECT u.name, c.title FROM enrollments e 
JOIN users u ON e.student_id = u.id 
JOIN courses c ON e.course_id = c.id;

-- TO RUN THIS sudo -u postgres psql -d edtech_db -f database/test_queries.sql
