import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'super-secret-key';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      // For backward compatibility or internal scripts
      let userId = req.headers['x-user-id'];
      if (userId) {
        if (Array.isArray(userId)) userId = userId[0];
        (req as any).user = { id: userId };
        return next();
      }
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
