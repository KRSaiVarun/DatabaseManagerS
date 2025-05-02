import { Request, Response, NextFunction } from 'express';

// Middleware to require authentication
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
}

// Middleware to require admin role
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  next();
}
