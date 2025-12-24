import { Request, Response } from 'express';
import { SessionService } from '../services/sessionService';

const sessionService = new SessionService();

export const createSession = async (req: Request, res: Response) => {
  try {
    const session = await sessionService.create(req.body);
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getSessions = async (req: Request, res: Response) => {
  try {
    const sessions = await sessionService.findAll();
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSession = async (req: Request, res: Response) => {
  try {
    const session = await sessionService.findById(parseInt(req.params.id));
    if (!session) return res.status(404).json({ error: 'Séance non trouvée' });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSessionsByCourse = async (req: Request, res: Response) => {
  try {
    const sessions = await sessionService.findByCourse(parseInt(req.params.courseId));
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSession = async (req: Request, res: Response) => {
  try {
    const deleted = await sessionService.delete(parseInt(req.params.id));
    if (!deleted) return res.status(404).json({ error: 'Séance non trouvée' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
