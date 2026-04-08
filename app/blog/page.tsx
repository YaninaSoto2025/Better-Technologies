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

export const revalidate = 0 

export default async function BlogPage() {
  const supabase = createClient()
  
  // Traemos los posts ordenados por fecha
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false })

  if (error) return <div className="p-10 text-white text-center">Error al conectar con la base de datos...</div>

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