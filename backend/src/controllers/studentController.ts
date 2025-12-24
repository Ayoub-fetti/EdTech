import { Request, Response } from 'express';
import { StudentService } from '../services/studentService';

const studentService = new StudentService();

export const createStudent = async (req: Request, res: Response) => {
  try {
    const student = await studentService.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getStudents = async (req: Request, res: Response) => {
  try {
    const students = await studentService.findAll();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStudent = async (req: Request, res: Response) => {
  try {
    const student = await studentService.findById(parseInt(req.params.id));
    if (!student) return res.status(404).json({ error: 'Élève non trouvé' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const student = await studentService.update(parseInt(req.params.id), req.body);
    if (!student) return res.status(404).json({ error: 'Élève non trouvé' });
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const deleted = await studentService.delete(parseInt(req.params.id));
    if (!deleted) return res.status(404).json({ error: 'Élève non trouvé' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const enrollStudent = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.body;
    const enrolled = await studentService.enrollInCourse(parseInt(req.params.id), courseId);
    if (!enrolled) return res.status(400).json({ error: 'Erreur inscription' });
    res.json({ message: 'Inscription réussie' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
