import express from 'express';
import { scrapeController } from '../controllers/searchController.ts';
import { rateLimitMiddleware } from '../middlewares/rateLimit.ts';

const router = express.Router();

router.get('/api/scrape', rateLimitMiddleware, scrapeController);

export default router;
