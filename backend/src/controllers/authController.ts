import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { LoginRequest, LoginResponse } from '../types';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password }: LoginRequest = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      const user = await UserService.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValid = await UserService.comparePassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = UserService.generateToken(user);
      const response: LoginResponse = {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async logout(req: Request, res: Response) {
    res.json({ message: 'Logged out successfully' });
  }
}
