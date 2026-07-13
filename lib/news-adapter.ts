/**
 * News adapter — swappable interface for article fetching.
 *
 * To wire in a real source, implement the same signature:
 *
 *   // Example: NewsAPI
 *   // const res = await fetch(
 *   //   `https://newsapi.org/v2/everything?q=startups+AI&apiKey=${process.env.NEWS_API_KEY}`
 *   // )
 *   // const { articles } = await res.json()
 *   // return articles.map(a => ({ source: new URL(a.url).hostname, title: a.title, ... }))
 *
 *   // Example: RSS feed via rss-parser
 *   // const parser = new Parser()
 *   // const feed = await parser.parseURL('https://techcrunch.com/feed/')
 *   // return feed.items.map(item => ({ ... }))
 */

export interface ArticleSummary {
  source: string
  title: string
  summary: string
  url: string
  publishedAt: Date
  companyTags: string[]
  category: 'ALL' | 'STARTUPS' | 'AI' | 'VENTURE' | 'POLICY'
}

// MVP: returns seeded articles from the database via the API route.
// This function is a placeholder hook — real fetches would call an external API
// and upsert into the DB before returning.
export async function fetchArticles(): Promise<ArticleSummary[]> {
  return []
}
