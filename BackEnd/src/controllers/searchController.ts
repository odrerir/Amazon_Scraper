import type { Request, Response } from 'express';
import { scrapeAmazonProducts } from '../models/searchModel.ts';

export async function scrapeController(req: Request, res: Response) {
  const keyword = (req.query.keyword as string)?.trim();

  // Input validation
  if (!keyword) {
    return res.status(400).json({ error: 'Query parameter "keyword" is required.' });
  }
  if (keyword.length > 50) {
    return res.status(400).json({ error: 'Keyword is too long (max 50 characters).' });
  }
  if (!/^[\p{L}\p{N}\s-]+$/u.test(keyword)) {
    return res.status(400).json({ error: 'Keyword contains invalid characters.' });
  }

  try {
    const results = await scrapeAmazonProducts(keyword);
    res.json({ results });
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ error: 'Failed to fetch search results.' });
  }
}
