'use client'
import { useState, useEffect } from 'react'
// import { createClient } from '@/lib/supabase/client'

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
  const [supabase, setSupabase] = useState<any>(null)

  // Load posts
  useEffect(() => {
    const loadPosts = async () => {
      console.log('Starting to load posts...')

      try {
        console.log('Importing Supabase client...')
        const { createClient } = await import('@/lib/supabase/client')
        console.log('Creating Supabase client...')
        const client = createClient()
        console.log('Supabase client created, testing connection...')

        // First test the connection
        const { data: testData, error: testError } = await client
          .from('blog_posts')
          .select('count', { count: 'exact', head: true })

        console.log('Connection test result:', { count: testData, error: testError })

        if (testError) {
          throw new Error(`Connection test failed: ${testError.message}`)
        }

        console.log('Connection successful, loading posts...')
        const { data, error } = await client
          .from('blog_posts')
          .select('*')
          .order('published_at', { ascending: false })

        console.log('Posts query result:', { data: data?.length || 0, error })

        if (error) {
          console.error('Database error:', error)
          setError(`Database error: ${error.message}`)
        } else {
          console.log('Posts loaded successfully:', data?.length || 0, 'posts')
          setPosts(data || [])
        }
      } catch (err) {
        console.error('Error in loadPosts:', err)
        setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
      } finally {
        setLoading(false)
      }
    }

    // Add a timeout to show error if loading takes too long
    const timeout = setTimeout(() => {
      if (loading) {
        console.error('Loading timeout reached - this means the database query is taking too long or failing')
        setError('Loading timeout - please check your connection. The database query may be failing.')
        setLoading(false)
      }
    }, 15000) // Increased to 15 seconds

    loadPosts()

    return () => clearTimeout(timeout)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-zinc-400">Cargando posts...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-8 font-sans flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-500 text-black rounded-lg hover:bg-green-400 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 text-center">
          <h1 className="text-5xl font-extrabold text-green-400 mb-4 tracking-tighter">Better Blog</h1>
          <p className="text-zinc-500 uppercase tracking-widest text-sm font-bold">Better Technologies Insight</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts?.map((post: BlogPost) => (
            <a 
              key={post.id} 
              href={post.post_url} // <--- El link externo
              target="_blank" 
              rel="noopener noreferrer"
              className="group border border-zinc-900 rounded-3xl overflow-hidden bg-zinc-950 hover:border-green-500/50 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={post.cover_url || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800'} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute top-4 left-4 bg-green-500 text-black text-[10px] font-black px-2 py-1 rounded-md uppercase">
                  {post.category || 'Global'}
                </div>
              </div>

              <div className="p-7 flex-1 flex flex-col">
                <h2 className="text-xl font-bold leading-tight mb-3 group-hover:text-green-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-zinc-400 text-sm line-clamp-3 mb-6 flex-1">
                  {post.description}
                </p>
                <div className="pt-4 border-t border-zinc-900 flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-600 uppercase">Leer más</span>
                  <span className="text-[10px] text-zinc-700">{new Date(post.published_at).toLocaleDateString()}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}