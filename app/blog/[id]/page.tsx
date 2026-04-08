import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

type BlogPost = {
  id: string
  title: string
  description: string
  content?: string
  post_url: string
  cover_url?: string
  category: string
  slug: string
  published_at: string
  author: string
}

type Props = {
  params: Promise<{ id: string }>
}

export default async function BlogPostPage({ params }: Props) {
  const { id } = await params

  const supabase = createClient()

  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !post) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-4">Post Not Found</h1>
          <p className="text-slate-600 mb-8">The post you're looking for doesn't exist.</p>
          <a
            href="/blog"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors"
          >
            ← Back to Blog
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">

      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-6 md:px-24 py-5 z-50 backdrop-blur-md bg-black/90 border-b border-white/10">
        <div className="relative w-[120px] md:w-[140px] h-[35px] md:h-[40px]">
          <Image src="/logo.png" alt="Better Technologies" fill sizes="140px" className="object-contain" priority />
        </div>
        <a
          href="/#blog"
          className="text-white text-[10px] font-black uppercase tracking-widest hover:text-blue-600 transition-colors"
        >
          ← Back to Blog
        </a>
      </header>

      {/* ── HERO IMAGE ── */}
      <div className="w-full h-[50vh] relative overflow-hidden mt-[72px]">
        {post.cover_url ? (
          <img
            src={post.cover_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center">
            <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest">
              No Cover Image
            </span>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />

        {/* Category badge */}
        <div className="absolute top-6 left-6">
          <span className="text-[9px] font-black text-white bg-blue-600 px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
            {post.category}
          </span>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <article className="max-w-3xl mx-auto px-6 pb-24 -mt-8 relative z-10">

        {/* Meta */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {post.author}
          </span>
          <span className="text-slate-200 font-black">·</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {new Date(post.published_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none uppercase mb-6">
          {post.title}
        </h1>

        {/* Description / lead */}
        <div className="border-l-[3px] border-blue-600 pl-5 bg-slate-50 py-4 pr-5 rounded-r-2xl mb-10">
          <p className="text-slate-700 font-black italic text-sm leading-relaxed tracking-tight">
            {post.description}
          </p>
        </div>

        {/* Body content */}
        {post.content ? (
          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-base">
            {post.content.split('\n').map((paragraph: string, i: number) =>
              paragraph.trim() ? (
                <p key={i} className="mb-5 font-medium leading-relaxed">
                  {paragraph}
                </p>
              ) : null
            )}
          </div>
        ) : (
          <div className="py-12 text-center border border-dashed border-slate-200 rounded-3xl">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              Full content coming soon.
            </p>
            <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest mt-1">
              Add a &apos;content&apos; field in Supabase to display the full article.
            </p>
          </div>
        )}

        {/* Back CTA */}
        <div className="mt-16 pt-8 border-t border-slate-100 flex justify-between items-center">
          <a
            href="/#blog"
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
          >
            ← All posts
          </a>
          <a
            href="/#about"
            className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline"
          >
            Meet the team →
          </a>
        </div>

      </article>
    </main>
  )
}