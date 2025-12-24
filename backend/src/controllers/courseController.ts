import { Request, Response } from 'express';
import { CourseService } from '../services/courseService';

const courseService = new CourseService();

export const createCourse = async (req: Request, res: Response) => {
  try {
    const course = await courseService.create(req.body);
    res.status(201).json(course);
  } catch (error) {    
    res.status(400).json({ error: error.message });
  }
};


export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await courseService.findAll();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCourse = async (req: Request, res: Response) => {
  try {
    const course = await courseService.findById(parseInt(req.params.id));
    if (!course) return res.status(404).json({ error: 'Cours non trouvé' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const course = await courseService.update(parseInt(req.params.id), req.body);
    if (!course) return res.status(404).json({ error: 'Cours non trouvé' });
    res.json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const deleted = await courseService.delete(parseInt(req.params.id));
    if (!deleted) return res.status(404).json({ error: 'Cours non trouvé' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
