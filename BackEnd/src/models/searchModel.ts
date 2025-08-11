import axios from 'axios';
import { JSDOM } from 'jsdom';

export interface Product {
  title: string;
  rating: string | null;
  reviews: string | null;
  image: string | null;
}

export async function scrapeAmazonProducts(keyword: string): Promise<Product[]> {
  try {
    // Fetch the Amazon search results page
    const response = await axios.get(`https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`, {
      
      // Use a user-agent to avoid being blocked
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
      },
      timeout: 10000,
    });

    // Check if blocked
    if (response.data.includes('Enter the characters you see below') ||
        response.data.includes('Robot Check')) {
      throw new Error('Request blocked by Amazon');
    }

    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    // Multiple selectors for robustness
    const productSelectors = [
      '.s-result-item[data-component-type="s-search-result"]',
      '[data-component-type="s-search-result"]',
      '.s-result-item:not([data-component-type="s-ads"])'
    ];

    let products: Element[] = [];
    for (const selector of productSelectors) {
      products = Array.from(document.querySelectorAll(selector));
      if (products.length > 0) break;
    }

    const results = products
      .map(item => {
        // Product Title
        const title = item.querySelector('h2 a span')?.textContent?.trim()
          || item.querySelector('h2 span')?.textContent?.trim()
          || item.querySelector('.a-size-medium span')?.textContent?.trim()
          || null;

        // Rating (stars out of five)
        const ratingElement = item.querySelector('span.a-icon-alt');
        const rating = ratingElement?.textContent?.trim() || null;

        // Number of reviews
        const reviews = item.querySelector('.a-size-base.a-link-normal')?.textContent?.trim()
          || item.querySelector('a[href*="#customerReviews"] .a-size-base')?.textContent?.trim()
          || null;

        // Product image URL
        const imgElement = item.querySelector('img.s-image') as HTMLImageElement
          || item.querySelector('.s-image') as HTMLImageElement;
        const image = imgElement?.src || imgElement?.getAttribute('data-src') || null;

        if (title) {
          return { title, rating, reviews, image };
        }
        return null;
      })
      .filter((item): item is Product => item !== null);

    return results;

  } catch (error) {
    console.error('Scraping error:', error);
    throw error;
  }
}