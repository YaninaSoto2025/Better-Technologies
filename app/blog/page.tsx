'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type BlogPost = {
  id: string
  title: string
  description: string
  post_url: string
  cover_url?: string
  category: string
  slug: string
  published_at: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPosts = async () => {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setError('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
        setLoading(false)
        return
      }

      try {
        const client = createClient()
        const { data, error } = await client
          .from('blog_posts')
          .select('*')
          .order('published_at', { ascending: false })

        if (error) {
          throw error
        }

        setPosts(data || [])
        setError(null)
      } catch (err) {
        console.error('Blog page load error:', err)
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load blog posts at this time.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 p-8 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-500">Cargando posts...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 p-8 font-sans flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 text-center">
          <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tighter">Better Blog</h1>
          <p className="text-slate-500 uppercase tracking-widest text-sm font-bold">Better Technologies Insight</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts?.map((post: BlogPost) => (
            <a 
              key={post.id} 
              href={`/blog/${post.id}`} // <--- Cambiado a ruta interna
              className="group border border-slate-200 rounded-3xl overflow-hidden bg-white hover:shadow-2xl transition-all duration-300 flex flex-col"
            >
              <div className="relative h-56 overflow-hidden bg-slate-100">
                <img 
                  src={post.cover_url || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800'} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase">
                  {post.category || 'Global'}
                </div>
              </div>

              <div className="p-7 flex-1 flex flex-col">
                <h2 className="text-xl font-bold leading-tight mb-3 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-1">
                  {post.description}
                </p>
                <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase">Leer más</span>
                  <span className="text-[10px] text-slate-400">{new Date(post.published_at).toLocaleDateString()}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}