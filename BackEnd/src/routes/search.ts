import express from 'express';
import axios from 'axios';
import { JSDOM } from 'jsdom';

  const router = express.Router();
  // Controle de requisições por IP (bem simples)
  const requestsMap = new Map<string, { count: number; lastReset: number }>();
  const MAX_REQUESTS_PER_MINUTE = 5;

  // Define a route for search
  router.get('/api/scrape', async (req, res) => {
    try {
      const keyword = (req.query.keyword as string)?.trim();

      // Validate the query parameter
      if (!keyword) {
      return res.status(400).json({ error: 'Query parameter "keyword" is required.' });
      }
      if (keyword.length > 50) {
        return res.status(400).json({ error: 'Keyword is too long (max 50 characters).' });
      }
      if (!/^[\p{L}\p{N}\s-]+$/u.test(keyword)) {
        return res.status(400).json({ error: 'Keyword contains invalid characters.' });
      }

      const ip = req.ip;
      const now = Date.now();
      const minuteAgo = now - 60 * 1000;

      const requestData = requestsMap.get(ip) || { count: 0, lastReset: now };
      if (requestData.lastReset < minuteAgo) {
        requestData.count = 0;
        requestData.lastReset = now;
      }
      requestData.count++;
      requestsMap.set(ip, requestData);

      if (requestData.count > MAX_REQUESTS_PER_MINUTE) {
        return res.status(429).json({ error: 'Too many requests. Please wait and try again.' });
      }

      // Requisição para Amazon com timeout
      const response = await axios.get(
        `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Accept-Language': 'en-US,en;q=0.9',
          },
          timeout: 8000, // 8 segundos de timeout
        }
      );


      const dom = new JSDOM(response.data);
      const document = dom.window.document;

      const results = Array.from(document.querySelectorAll('div.s-result-item'))
        .map(item => {
          const title = item.querySelector('h2 a span')?.textContent?.trim() || null;
          const rating = item.querySelector('span.a-icon-alt')?.textContent?.trim() || null;
          const reviews = item.querySelector('span.a-size-base')?.textContent?.trim() || null;
          const image = (item.querySelector('img.s-image') as HTMLImageElement)?.src || null;

          // Check if title is not null or empty
          if (title) {
            return { title, rating, reviews, image };
          }
          return null;
        })
        .filter(item => item !== null);  // Remove null items

      res.json({ results });
    }
    catch (error) {
      // Handle errors, such as network issues or parsing errors
      console.error('Error fetching search results:', error);
      res.status(500).json({ error: 'Failed to fetch search results.' });
    }
  });

  export default router;