'use client'

import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react'
import type { Article, Category, Company } from '@/types'
import { Drawer } from '@/components/ui/Drawer'
import { useOrbitStore } from '@/store/useOrbitStore'

const CATEGORIES: Category[] = ['ALL', 'STARTUPS', 'AI', 'VENTURE', 'POLICY']

function Favicon({ domain }: { domain: string }) {
  const [err, setErr] = useState(false)
  if (err) return <div className="w-4 h-4 rounded bg-neutral-200 dark:bg-neutral-700 shrink-0" />
  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
      alt=""
      className="w-4 h-4 rounded shrink-0"
      onError={() => setErr(true)}
    />
  )
}

interface ArticleListProps {
  companies: Company[]
}

export function ArticleList({ companies }: ArticleListProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<Category>('ALL')
  const [companyFilters, setCompanyFilters] = useState<Set<string>>(new Set())
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const { addToast } = useOrbitStore()

  const fetchArticles = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (activeCategory !== 'ALL') params.set('category', activeCategory)
    const res = await fetch(`/api/articles?${params}`)
    const data: Article[] = await res.json()
    setArticles(data)
    setLoading(false)
  }

  useEffect(() => { fetchArticles() }, [activeCategory])

  const toggleBookmark = async (article: Article) => {
    const res = await fetch(`/api/articles/${article.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ saved: !article.saved }),
    })
    if (res.ok) {
      const updated = await res.json()
      setArticles((as) => as.map((a) => (a.id === article.id ? updated : a)))
      addToast(updated.saved ? 'Bookmarked' : 'Removed from bookmarks')
    }
  }

  const toggleCompanyFilter = (name: string) => {
    setCompanyFilters((f) => {
      const next = new Set(f)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const filtered = companyFilters.size === 0
    ? articles
    : articles.filter((a) => a.companyTags.some((t) => companyFilters.has(t)))

  return (
    <div className="flex flex-1 min-h-0 gap-0">
      {/* Main feed */}
      <div className="flex-[7] flex flex-col min-w-0 border-r border-neutral-200 dark:border-neutral-800">
        {/* Category tabs */}
        <div className="flex items-center gap-1 px-6 py-3 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors
                ${activeCategory === cat
                  ? 'bg-accent text-white'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
            >
              {cat.charAt(0) + cat.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Articles */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-neutral-400 text-sm">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-2 text-neutral-400">
              <p className="text-sm">No articles found.</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filtered.map((article) => (
                <div
                  key={article.id}
                  className="px-6 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer group"
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="flex items-start gap-3">
                    <Favicon domain={article.source} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-neutral-400">{article.source}</span>
                        <span className="text-xs text-neutral-300 dark:text-neutral-700">·</span>
                        <span className="text-xs font-mono text-neutral-400">
                          {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-snug mb-1">
                        {article.title}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                        {article.summary}
                      </p>
                      {article.companyTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {article.companyTags.map((tag) => (
                            <button
                              key={tag}
                              onClick={(e) => { e.stopPropagation(); toggleCompanyFilter(tag) }}
                              className={`px-2 py-0.5 text-xs font-mono rounded transition-colors
                                ${companyFilters.has(tag)
                                  ? 'bg-accent text-white'
                                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-accent/10 hover:text-accent'
                                }`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleBookmark(article) }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400 hover:text-accent p-1"
                    >
                      {article.saved
                        ? <BookmarkCheck className="w-4 h-4 text-accent" />
                        : <Bookmark className="w-4 h-4" />
                      }
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right panel — company filters */}
      <div className="flex-[3] min-w-0 p-4 overflow-y-auto">
        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-3">Filter by company</p>
        <div className="space-y-1">
          {companies.map((c) => (
            <button
              key={c.id}
              onClick={() => toggleCompanyFilter(c.name)}
              className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors
                ${companyFilters.has(c.name)
                  ? 'bg-accent/10 text-accent dark:bg-accent/20'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
            >
              <div className="w-5 h-5 rounded bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-xs font-bold text-neutral-500 shrink-0">
                {c.name[0]}
              </div>
              {c.name}
            </button>
          ))}
        </div>
        {companyFilters.size > 0 && (
          <button
            onClick={() => setCompanyFilters(new Set())}
            className="mt-3 text-xs text-neutral-400 hover:text-accent transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Reading drawer */}
      <Drawer
        open={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        title={selectedArticle?.source}
        width="w-[520px]"
      >
        {selectedArticle && (
          <div className="p-6 space-y-4">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
              {selectedArticle.title}
            </h2>
            <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono">
              <span>{selectedArticle.source}</span>
              <span>·</span>
              <span>{formatDistanceToNow(new Date(selectedArticle.publishedAt), { addSuffix: true })}</span>
            </div>
            {selectedArticle.companyTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedArticle.companyTags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 text-xs font-mono bg-accent/10 text-accent rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {selectedArticle.summary}
            </p>
            <a
              href={selectedArticle.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-accent hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Read full article
            </a>
          </div>
        )}
      </Drawer>
    </div>
  )
}
