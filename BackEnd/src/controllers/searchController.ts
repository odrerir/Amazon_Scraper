import type { Request, Response } from 'express';
import { fetchAmazonProducts } from '../models/searchModel.ts';

export async function scrapeController(req: Request, res: Response) {
  const keyword = (req.query.keyword as string)?.trim();

  // Validações básicas
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
    const results = await fetchAmazonProducts(keyword);
    res.json({ results });
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ error: 'Failed to fetch search results.' });
  }
}
