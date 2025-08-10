import axios from 'axios';
import { JSDOM } from 'jsdom';

export interface Product {
  title: string;
  rating: string | null;
  reviews: string | null;
  image: string | null;
}

export async function fetchAmazonProducts(keyword: string): Promise<Product[]> {
  const response = await axios.get(`https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
    },
    timeout: 8000,
  });

  const dom = new JSDOM(response.data);
  const document = dom.window.document;

  const results = Array.from(document.querySelectorAll('div.s-result-item'))
  .map(item => {
    const title = item.querySelector('h2 span')?.textContent?.trim() || null;

    // Rating - pega do span dentro do reviews-block
    const rating = item.querySelector('div[data-cy="reviews-block"] span.a-size-small.a-color-base')
      ?.textContent?.trim() || null;

    // Reviews - pega do link com aria-label contendo "classificações"
    const reviewsElement = item.querySelector('a[aria-label*="classificações"]') ||
                          item.querySelector('a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style');
    let reviews = null;
    if (reviewsElement) {
      const ariaLabel = reviewsElement.getAttribute('aria-label');
      if (ariaLabel) {
        // Extrai o número de classificações do aria-label
        const match = ariaLabel.match(/(\d+(?:,\d+)*)/);
        reviews = match ? match[1] : null;
      }
    }

    const image = (item.querySelector('img.s-image') as HTMLImageElement)?.src || null;

    if (title) {
      return { title, rating, reviews, image };
    }
    return null;
  })
  .filter((item): item is Product => item !== null);

  return results;
}