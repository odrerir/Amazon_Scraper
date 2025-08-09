import express from 'express';
import axios from 'axios';
import { JSDOM } from 'jsdom';

  const router = express.Router();

  // Define a route for search
  router.get('/api/scrape', async (req, res) => {
    try {
      const Keyword = req.query.Keyword as string;
      
      // Validate the query parameter
      if (!Keyword) {
        return res.status(400).json({ error: 'Query parameter "Keyword" is required.' });
      }

      // Fetch the search results from Amazon
      const response = await axios.get(
        `https://www.amazon.com/s?k=${encodeURIComponent(Keyword)}`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            "Accept-Language": "en-US,en;q=0.9"
          }
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
        .filter(Boolean); // Filter out null results

      res.json({ results });
    }
    catch (error) {
      // Handle errors, such as network issues or parsing errors
      console.error('Error fetching search results:', error);
      res.status(500).json({ error: 'Failed to fetch search results.' });
    }
  });

  export default router;