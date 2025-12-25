import { Request, Response } from 'express';
import { PresenceService } from '../services/presenceService';
import { CreatePresenceDto, PresenceApiResponse, PresenceListApiResponse } from '../types';

const presenceService = new PresenceService();

export const createPresence = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: CreatePresenceDto = req.body;
    const presence = await presenceService.createPresence(data);
    
    const response: PresenceApiResponse = {
      success: true,
      data: presence
    };
    
    res.status(201).json(response);
  } catch (error) {
    const response: PresenceApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(400).json(response);
  }
};

export const getPresencesByClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const courseId = parseInt(req.params.courseId);
    const presences = await presenceService.getPresencesByClass(courseId);
    
    const response: PresenceListApiResponse = {
      success: true,
      data: presences
    };
    
    res.json(response);
  } catch (error) {
    const response: PresenceListApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(response);
  }
};

export const getPresencesByStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = parseInt(req.params.studentId);
    const presences = await presenceService.getPresencesByStudent(studentId);
    const indicators = await presenceService.getStudentIndicators(studentId);
    
    const response: PresenceListApiResponse = {
      success: true,
      data: presences,
      indicators
    };
    
    res.json(response);
  } catch (error) {
    const response: PresenceListApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(response);
  }
};

export const getPresencesByPeriod = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;
    const presences = await presenceService.getPresencesByPeriod(
      startDate as string, 
      endDate as string
    );
    
    const response: PresenceListApiResponse = {
      success: true,
      data: presences
    };
    
    res.json(response);
  } catch (error) {
    const response: PresenceListApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(response);
  }
};
