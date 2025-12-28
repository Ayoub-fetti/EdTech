import { Request, Response } from 'express';
import { TeacherService } from '../services/teacherService';

const teacherService = new TeacherService();

export const createTeacher = async (req: Request, res: Response) => {
  try {
    const teacher = await teacherService.create(req.body);
    res.status(201).json(teacher);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getTeachers = async (req: Request, res: Response) => {
  try {
    const teachers = await teacherService.findAll();
    res.json(teachers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTeacher = async (req: Request, res: Response) => {
  try {
    const teacher = await teacherService.findById(parseInt(req.params.id));
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
    res.json(teacher);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const teacher = await teacherService.update(parseInt(req.params.id), req.body);
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
    res.json(teacher);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const deleted = await teacherService.delete(parseInt(req.params.id));
    if (!deleted) return res.status(404).json({ error: 'Teacher not found' });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

