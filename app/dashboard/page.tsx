"use client";
export const dynamic = 'force-dynamic'; // Prevents prerendering issues with Supabase
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Content = {
  id: string;
  title: string;
  description: string;
  post_url: string;
  cover_url: string;
  author: string;
  category: string;
  published_at: string;
  slug: string;
};

const AUTHORS = [
  "Diego Vargas",
  "Charlotte Götz",
  "Ezequiel Alonso",
  "Victor Menendez",
  "Yanina Soto",
];

const CATEGORIES = [
  "Framework",
  "Strategy",
  "Data",
  "Engineering",
  "Marketing",
  "Case Study",
  "Actualidad",
  "Global",
];

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  // ── Tabs state ──
  const [activeTab, setActiveTab] = useState<"blog" | "news">("blog");

  // ── Blog state ──
  const [blogPosts, setBlogPosts] = useState<Content[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const [blogSaving, setBlogSaving] = useState(false);
  const [blogSuccess, setBlogSuccess] = useState(false);
  const [blogDeleteId, setBlogDeleteId] = useState<string | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: "",
    description: "",
    post_url: "",
    cover_url: "",
    author: AUTHORS[0],
    category: CATEGORIES[0],
  });

  // ── News state ──
  const [newsPosts, setNewsPosts] = useState<Content[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsSaving, setNewsSaving] = useState(false);
  const [newsSuccess, setNewsSuccess] = useState(false);
  const [newsDeleteId, setNewsDeleteId] = useState<string | null>(null);
  const [newsForm, setNewsForm] = useState({
    title: "",
    description: "",
    post_url: "",
    cover_url: "",
    author: AUTHORS[0],
    category: "Actualidad",
  });

  // ── Load blog posts ──
  const loadBlogPosts = async () => {
    setBlogLoading(true);
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false });
    setBlogPosts(data || []);
    setBlogLoading(false);
  };

  // ── Load news posts ──
  const loadNewsPosts = async () => {
    setNewsLoading(true);
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("category", "Actualidad")
      .order("published_at", { ascending: false });
    setNewsPosts(data || []);
    setNewsLoading(false);
  };

  useEffect(() => {
    loadBlogPosts();
    loadNewsPosts();
  }, []);

  const handleBlogChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setBlogForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNewsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setNewsForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ── Submit blog ──
  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlogSaving(true);
    setBlogSuccess(false);

    const slug =
      blogForm.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") +
      "-" + Date.now();

    const { error } = await supabase.from("blog_posts").insert([{
      ...blogForm,
      slug,
      published_at: new Date().toISOString(),
    }]);

    setBlogSaving(false);
    if (!error) {
      setBlogSuccess(true);
      setBlogForm({ title: "", description: "", post_url: "", cover_url: "", author: AUTHORS[0], category: CATEGORIES[0] });
      loadBlogPosts();
      setTimeout(() => setBlogSuccess(false), 3000);
    }
  };

  // ── Submit news ──
  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsSaving(true);
    setNewsSuccess(false);

    const slug =
      newsForm.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") +
      "-" + Date.now();

    const { error } = await supabase.from("blog_posts").insert([{
      ...newsForm,
      category: "Actualidad",
      slug,
      published_at: new Date().toISOString(),
    }]);

    setNewsSaving(false);
    if (!error) {
      setNewsSuccess(true);
      setNewsForm({ title: "", description: "", post_url: "", cover_url: "", author: AUTHORS[0], category: "Actualidad" });
      loadNewsPosts();
      setTimeout(() => setNewsSuccess(false), 3000);
    }
  };

  // ── Delete blog ──
  const handleBlogDelete = async (id: string) => {
    await supabase.from("blog_posts").delete().eq("id", id);
    setBlogDeleteId(null);
    loadBlogPosts();
  };

  // ── Delete news ──
  const handleNewsDelete = async (id: string) => {
    await supabase.from("blog_posts").delete().eq("id", id);
    setNewsDeleteId(null);
    loadNewsPosts();
  };

  // ── Sign out ──
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <main className="min-h-screen bg-slate-50">

      {/* ── NAV ── */}
      <header className="bg-white border-b border-slate-100 px-6 md:px-12 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="relative w-[120px] h-[34px]">
          <Image src="/logo.png" alt="Better Technologies" fill className="object-contain" />
        </div>
        <div className="flex items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:block">
            Content Dashboard
          </p>
          <button
            onClick={handleSignOut}
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
          >
            Sign out →
          </button>
        </div>
      </header>

      {/* ── TABS ── */}
      <div className="bg-white border-b border-slate-100 sticky top-[57px] z-40 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex gap-8">
          <button
            onClick={() => setActiveTab("blog")}
            className={`py-4 px-2 font-black uppercase text-sm tracking-widest border-b-2 transition-colors ${
              activeTab === "blog"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            📝 Blog Posts
          </button>
          <button
            onClick={() => setActiveTab("news")}
            className={`py-4 px-2 font-black uppercase text-sm tracking-widest border-b-2 transition-colors ${
              activeTab === "news"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            📰 News
          </button>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12 items-start">

        {/* ── BLOG TAB ── */}
        {activeTab === "blog" && (
          <>
            {/* LEFT: FORM */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
              <p className="text-blue-600 uppercase tracking-[0.2em] text-[10px] font-black mb-1">New post</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-6">Publish blog post</h2>

              <form onSubmit={handleBlogSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Title *</label>
                  <input
                    type="text" name="title" value={blogForm.title} onChange={handleBlogChange} required
                    placeholder="How we built X in 72 hours"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-slate-900 text-sm font-medium focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description *</label>
                  <textarea
                    name="description" value={blogForm.description} onChange={handleBlogChange} required rows={3}
                    placeholder="A short summary..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-slate-900 text-sm font-medium focus:outline-none focus:border-blue-600 transition-colors resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Article Link (URL) *</label>
                  <input
                    type="url" name="post_url" value={blogForm.post_url} onChange={handleBlogChange} required
                    placeholder="https://example.com/article"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-slate-900 text-sm font-medium focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cover image URL</label>
                  <input
                    type="url" name="cover_url" value={blogForm.cover_url} onChange={handleBlogChange}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-slate-900 text-sm font-medium focus:outline-none focus:border-blue-600 transition-colors"
                  />
                  {blogForm.cover_url && (
                    <div className="mt-2 h-32 rounded-xl overflow-hidden border border-slate-100">
                      <img src={blogForm.cover_url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Author</label>
                    <select name="author" value={blogForm.author} onChange={handleBlogChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-slate-900 text-sm font-medium focus:outline-none focus:border-blue-600 transition-colors bg-white">
                      {AUTHORS.map((a) => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</label>
                    <select name="category" value={blogForm.category} onChange={handleBlogChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-slate-900 text-sm font-medium focus:outline-none focus:border-blue-600 transition-colors bg-white">
                      {CATEGORIES.filter(c => c !== "Actualidad").map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <button type="submit" disabled={blogSaving}
                  className="mt-2 w-full py-4 bg-blue-600 text-white rounded-full font-black uppercase tracking-widest text-sm hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-xl shadow-blue-600/20">
                  {blogSaving ? "Publishing..." : "Publish post →"}
                </button>

                {blogSuccess && (
                  <p className="text-center text-[11px] font-black uppercase tracking-widest text-green-600">
                    ✓ Post published successfully!
                  </p>
                )}
              </form>
            </div>

            {/* RIGHT: POSTS LIST */}
            <div>
              <p className="text-blue-600 uppercase tracking-[0.2em] text-[10px] font-black mb-1">Published</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-6">Your posts</h2>

              {blogLoading ? (
                <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Loading...</p>
              ) : blogPosts.filter(p => p.category !== "Actualidad").length === 0 ? (
                <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">No posts yet. Publish your first one!</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {blogPosts.filter(p => p.category !== "Actualidad").map((post) => (
                    <div key={post.id}
                      className="bg-white border border-slate-100 rounded-2xl p-5 flex gap-4 items-start hover:border-blue-600/30 transition-colors">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                        {post.cover_url
                          ? <img src={post.cover_url} alt={post.title} className="w-full h-full object-cover" />
                          : <div className="w-full h-full bg-slate-200" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-black text-white bg-blue-600 px-2 py-0.5 rounded-full uppercase tracking-widest">
                          {post.category}
                        </span>
                        <p className="text-slate-900 font-black text-sm mt-1 leading-tight line-clamp-1">{post.title}</p>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wide mt-0.5">
                          {post.author} · {new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                      {blogDeleteId === post.id ? (
                        <div className="flex flex-col gap-1 items-end flex-shrink-0">
                          <span className="text-[9px] text-red-500 font-black uppercase">Sure?</span>
                          <button onClick={() => handleBlogDelete(post.id)} className="text-[9px] font-black uppercase text-red-500 hover:underline">Yes, delete</button>
                          <button onClick={() => setBlogDeleteId(null)} className="text-[9px] font-black uppercase text-slate-400 hover:underline">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setBlogDeleteId(post.id)}
                          className="text-slate-300 hover:text-red-400 transition-colors text-xl flex-shrink-0 leading-none">×</button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ── NEWS TAB ── */}
        {activeTab === "news" && (
          <>
            {/* LEFT: FORM */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
              <p className="text-blue-600 uppercase tracking-[0.2em] text-[10px] font-black mb-1">New news</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-6">Publish news</h2>

              <form onSubmit={handleNewsSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Title *</label>
                  <input
                    type="text" name="title" value={newsForm.title} onChange={handleNewsChange} required
                    placeholder="Latest innovation in tech..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-slate-900 text-sm font-medium focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description *</label>
                  <textarea
                    name="description" value={newsForm.description} onChange={handleNewsChange} required rows={3}
                    placeholder="A short summary..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-slate-900 text-sm font-medium focus:outline-none focus:border-blue-600 transition-colors resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Article Link (URL) *</label>
                  <input
                    type="url" name="post_url" value={newsForm.post_url} onChange={handleNewsChange} required
                    placeholder="https://example.com/news"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-slate-900 text-sm font-medium focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cover image URL</label>
                  <input
                    type="url" name="cover_url" value={newsForm.cover_url} onChange={handleNewsChange}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-slate-900 text-sm font-medium focus:outline-none focus:border-blue-600 transition-colors"
                  />
                  {newsForm.cover_url && (
                    <div className="mt-2 h-32 rounded-xl overflow-hidden border border-slate-100">
                      <img src={newsForm.cover_url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Author</label>
                  <select name="author" value={newsForm.author} onChange={handleNewsChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-slate-900 text-sm font-medium focus:outline-none focus:border-blue-600 transition-colors bg-white">
                    {AUTHORS.map((a) => <option key={a}>{a}</option>)}
                  </select>
                </div>

                <button type="submit" disabled={newsSaving}
                  className="mt-2 w-full py-4 bg-blue-600 text-white rounded-full font-black uppercase tracking-widest text-sm hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-xl shadow-blue-600/20">
                  {newsSaving ? "Publishing..." : "Publish news →"}
                </button>

                {newsSuccess && (
                  <p className="text-center text-[11px] font-black uppercase tracking-widest text-green-600">
                    ✓ News published successfully!
                  </p>
                )}
              </form>
            </div>

            {/* RIGHT: NEWS LIST */}
            <div>
              <p className="text-blue-600 uppercase tracking-[0.2em] text-[10px] font-black mb-1">Published</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-6">Your news</h2>

              {newsLoading ? (
                <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Loading...</p>
              ) : newsPosts.length === 0 ? (
                <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">No news yet. Publish your first one!</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {newsPosts.map((post) => (
                    <div key={post.id}
                      className="bg-white border border-slate-100 rounded-2xl p-5 flex gap-4 items-start hover:border-blue-600/30 transition-colors">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                        {post.cover_url
                          ? <img src={post.cover_url} alt={post.title} className="w-full h-full object-cover" />
                          : <div className="w-full h-full bg-slate-200" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-black text-white bg-green-600 px-2 py-0.5 rounded-full uppercase tracking-widest">
                          News
                        </span>
                        <p className="text-slate-900 font-black text-sm mt-1 leading-tight line-clamp-1">{post.title}</p>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wide mt-0.5">
                          {post.author} · {new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                      {newsDeleteId === post.id ? (
                        <div className="flex flex-col gap-1 items-end flex-shrink-0">
                          <span className="text-[9px] text-red-500 font-black uppercase">Sure?</span>
                          <button onClick={() => handleNewsDelete(post.id)} className="text-[9px] font-black uppercase text-red-500 hover:underline">Yes, delete</button>
                          <button onClick={() => setNewsDeleteId(null)} className="text-[9px] font-black uppercase text-slate-400 hover:underline">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setNewsDeleteId(post.id)}
                          className="text-slate-300 hover:text-red-400 transition-colors text-xl flex-shrink-0 leading-none">×</button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </main>
  );
}