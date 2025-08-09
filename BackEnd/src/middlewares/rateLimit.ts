import type { Request, Response, NextFunction } from 'express';

const requestsMap = new Map<string, { count: number; lastReset: number }>();
const MAX_REQUESTS_PER_MINUTE = 5;

export function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const minuteAgo = now - 60 * 1000;

  let requestData = requestsMap.get(ip);
  if (!requestData) {
    requestData = { count: 0, lastReset: now };
  }

  if (requestData.lastReset < minuteAgo) {
    requestData.count = 0;
    requestData.lastReset = now;
  }

  requestData.count++;
  requestsMap.set(ip, requestData);

  if (requestData.count > MAX_REQUESTS_PER_MINUTE) {
    return res.status(429).json({ error: 'Too many requests. Please wait and try again.' });
  }

  next();
}
