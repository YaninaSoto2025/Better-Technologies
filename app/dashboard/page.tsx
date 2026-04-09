"use client";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

// --- Tipos y Constantes ---
type Content = {
  id: string;
  title: string;
  description: string;
  post_url: string; // URL del artículo o enlace al documento subido
  cover_url: string; // URL de la imagen de portada
  author: string;
  category: string;
  published_at: string;
  slug: string;
};

const AUTHORS = ["Diego Vargas", "Charlotte Götz", "Ezequiel Alonso", "Victor Menendez", "Yanina Soto"];
const CATEGORIES = ["Framework", "Strategy", "Data", "Engineering", "Marketing", "Case Study", "Actualidad", "Global"];

// Buckets de Supabase Storage
const DOCUMENTS_BUCKET = "documents"; // Para PDFs, Docs, etc.
const COVERS_BUCKET = "covers";       // Para imágenes de portada (¡Crea este bucket en Supabase!)

export default function DashboardPage() {
  const router = useRouter();

  // 1. Hooks de estado (Siempre arriba)
  const [supabase, setSupabase] = useState<any>(null);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"blog" | "news">("blog");

  // --- Blog State ---
  const [blogPosts, setBlogPosts] = useState<Content[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const [blogSaving, setBlogSaving] = useState(false);
  const [blogSuccess, setBlogSuccess] = useState(false);
  const [blogDeleteId, setBlogDeleteId] = useState<string | null>(null);

  // Estado para el documento (PDF/Doc)
  const [blogFile, setBlogFile] = useState<File | null>(null);
  const blogFileRef = useRef<HTMLInputElement | null>(null);

  // Estado para la imagen de portada (¡NUEVO!)
  const [blogImageFile, setBlogImageFile] = useState<File | null>(null);
  const [blogImagePreview, setBlogImagePreview] = useState<string | null>(null); // Para vista previa
  const blogImageFileRef = useRef<HTMLInputElement | null>(null);

  const [blogForm, setBlogForm] = useState({
    title: "",
    description: "",
    post_url: "", // Se llenará con URL externa o URL de documento subido
    cover_url: "", // Se llenará con la URL de la imagen subida
    author: AUTHORS[0],
    category: CATEGORIES[0],
  });

  // --- News State ---
  const [newsPosts, setNewsPosts] = useState<Content[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsSaving, setNewsSaving] = useState(false);
  const [newsSuccess, setNewsSuccess] = useState(false);
  const [newsDeleteId, setNewsDeleteId] = useState<string | null>(null);

  // Estado para el documento (PDF/Doc)
  const [newsFile, setNewsFile] = useState<File | null>(null);
  const newsFileRef = useRef<HTMLInputElement | null>(null);

  // Estado para la imagen de portada (¡NUEVO!)
  const [newsImageFile, setNewsImageFile] = useState<File | null>(null);
  const [newsImagePreview, setNewsImagePreview] = useState<string | null>(null); // Para vista previa
  const newsImageFileRef = useRef<HTMLInputElement | null>(null);

  const [newsForm, setNewsForm] = useState({
    title: "",
    description: "",
    post_url: "",
    cover_url: "",
    author: AUTHORS[0],
    category: "Actualidad",
  });

  // 2. Inicialización de Cliente
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      setSupabase(createClient(url, key));
    } else {
      setSupabaseError("Missing Supabase Environment Variables");
    }
  }, []);

  // 3. Carga inicial de datos
  useEffect(() => {
    if (supabase) {
      loadBlogPosts();
      loadNewsPosts();
    }
  }, [supabase]);

  // 4. Manejo de vistas previas de imágenes (¡NUEVO!)
  useEffect(() => {
    if (!blogImageFile) {
      setBlogImagePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(blogImageFile);
    setBlogImagePreview(objectUrl);
    // Limpieza de memoria
    return () => URL.revokeObjectURL(objectUrl);
  }, [blogImageFile]);

  useEffect(() => {
    if (!newsImageFile) {
      setNewsImagePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(newsImageFile);
    setNewsImagePreview(objectUrl);
    // Limpieza de memoria
    return () => URL.revokeObjectURL(objectUrl);
  }, [newsImageFile]);

  // --- Funciones de Lógica ---
  const loadBlogPosts = async () => {
    if (!supabase) return;
    setBlogLoading(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .neq("category", "Actualidad")
      .order("published_at", { ascending: false });
    if (error) setSupabaseError(error.message);
    else setBlogPosts(data || []);
    setBlogLoading(false);
  };

  const loadNewsPosts = async () => {
    if (!supabase) return;
    setNewsLoading(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("category", "Actualidad")
      .order("published_at", { ascending: false });
    if (error) setSupabaseError(error.message);
    else setNewsPosts(data || []);
    setNewsLoading(false);
  };

  const handleBlogChange = (e: any) => setBlogForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleNewsChange = (e: any) => setNewsForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // Función genérica para subir archivos (documentos o imágenes)
  const uploadFileToSupabase = async (file: File, bucketName: string): Promise<string | null> => {
    if (!supabase) return null;
    const fileName = `${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, "-").toLowerCase()}`;
    const { error } = await supabase.storage.from(bucketName).upload(fileName, file);
    if (error) {
        console.error(`Error uploading to ${bucketName}:`, error);
        return null;
    }
    const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
    return urlData?.publicUrl || null;
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setBlogSaving(true);
    setSupabaseError(null);

    let finalPostUrl = blogForm.post_url;
    let finalCoverUrl = ""; // Empezamos vacío

    // 1. Subir documento si existe (reemplaza post_url)
    if (blogFile) {
      const uploadedDoc = await uploadFileToSupabase(blogFile, DOCUMENTS_BUCKET);
      if (uploadedDoc) finalPostUrl = uploadedDoc;
      else {
          setSupabaseError("Failed to upload document.");
          setBlogSaving(false);
          return;
      }
    }

    // 2. Subir imagen de portada si existe (¡NUEVO!)
    if (blogImageFile) {
        const uploadedCover = await uploadFileToSupabase(blogImageFile, COVERS_BUCKET);
        if (uploadedCover) finalCoverUrl = uploadedCover;
        else {
            setSupabaseError("Failed to upload cover image.");
            setBlogSaving(false);
            return;
        }
    } else {
        // Validación opcional: ¿Es obligatoria la imagen?
        // setSupabaseError("Please upload a cover image.");
        // setBlogSaving(false);
        // return;
    }

    // 3. Insertar en Base de Datos
    const slug = `${blogForm.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
    
    const payload = {
        ...blogForm,
        post_url: finalPostUrl,
        cover_url: finalCoverUrl, // Usamos la URL de la imagen subida
        slug,
        published_at: new Date().toISOString()
    };

    const { error } = await supabase.from("blog_posts").insert([payload]);

    if (!error) {
      setBlogSuccess(true);
      // Resetear formulario y archivos
      setBlogForm({ title: "", description: "", post_url: "", cover_url: "", author: AUTHORS[0], category: CATEGORIES[0] });
      setBlogFile(null);
      if (blogFileRef.current) blogFileRef.current.value = "";
      setBlogImageFile(null); // Resetear archivo de imagen
      if (blogImageFileRef.current) blogImageFileRef.current.value = ""; // Resetear input de imagen

      loadBlogPosts();
      setTimeout(() => setBlogSuccess(false), 3000);
    } else {
        setSupabaseError(`Database error: ${error.message}`);
    }
    setBlogSaving(false);
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setNewsSaving(true);
    setSupabaseError(null);

    let finalPostUrl = newsForm.post_url;
    let finalCoverUrl = "";

    // 1. Subir documento si existe
    if (newsFile) {
      const uploadedDoc = await uploadFileToSupabase(newsFile, DOCUMENTS_BUCKET);
      if (uploadedDoc) finalPostUrl = uploadedDoc;
      else {
        setSupabaseError("Failed to upload document.");
        setNewsSaving(false);
        return;
      }
    }

    // 2. Subir imagen de portada si existe (¡NUEVO!)
    if (newsImageFile) {
        const uploadedCover = await uploadFileToSupabase(newsImageFile, COVERS_BUCKET);
        if (uploadedCover) finalCoverUrl = uploadedCover;
        else {
            setSupabaseError("Failed to upload cover image.");
            setNewsSaving(false);
            return;
        }
    }

    // 3. Insertar en Base de Datos
    const slug = `${newsForm.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
    
    const payload = {
        ...newsForm,
        post_url: finalPostUrl,
        cover_url: finalCoverUrl,
        category: "Actualidad",
        slug,
        published_at: new Date().toISOString()
    };

    const { error } = await supabase.from("blog_posts").insert([payload]);

    if (!error) {
      setNewsSuccess(true);
      setNewsForm({ title: "", description: "", post_url: "", cover_url: "", author: AUTHORS[0], category: "Actualidad" });
      setNewsFile(null);
      if (newsFileRef.current) newsFileRef.current.value = "";
      setNewsImageFile(null);
      if (newsImageFileRef.current) newsImageFileRef.current.value = "";
      
      loadNewsPosts();
      setTimeout(() => setNewsSuccess(false), 3000);
    } else {
        setSupabaseError(`Database error: ${error.message}`);
    }
    setNewsSaving(false);
  };

  const handleBlogDelete = async (id: string) => {
    await supabase.from("blog_posts").delete().eq("id", id);
    setBlogDeleteId(null);
    loadBlogPosts();
  };

  const handleNewsDelete = async (id: string) => {
    await supabase.from("blog_posts").delete().eq("id", id);
    setNewsDeleteId(null);
    loadNewsPosts();
  };

  // --- Sub-componente de Archivo (Documentos) ---
  const FileUploadField = ({ file, setFile, inputRef, urlValue, urlName, onUrlChange }: any) => (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Article Link (Optional)</label>
        <input type="url" name={urlName} value={urlValue} onChange={onUrlChange} disabled={!!file} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm focus:border-blue-600 focus:outline-none disabled:opacity-50" placeholder="https://..." />
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-100" />
        <span className="text-[10px] font-black uppercase text-slate-300">or</span>
        <div className="flex-1 h-px bg-slate-100" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upload PDF / DOC (Optional)</label>
        {file ? (
          <div className="flex items-center justify-between px-4 py-3 rounded-xl border-2 border-blue-600 bg-blue-50 text-xs font-black text-blue-600">
            <span className="truncate">📄 {file.name}</span>
            <button type="button" onClick={() => { setFile(null); if (inputRef.current) inputRef.current.value = ""; }} className="text-slate-400 hover:text-red-500">×</button>
          </div>
        ) : (
          <label className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate-200 cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all ${urlValue ? "opacity-40 pointer-events-none" : ""}`}>
            <span className="text-slate-400 text-lg">📎</span>
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Click to upload file</span>
            <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => setFile(e.target.files?.[0])} />
          </label>
        )}
      </div>
    </div>
  );

  // --- Sub-componente de Imagen (¡NUEVO!) ---
  const ImageUploadField = ({ file, setFile, inputRef, previewUrl }: any) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cover Image (Required)</label>
        
        {previewUrl ? (
            <div className="relative group rounded-xl overflow-hidden border-2 border-slate-100 shadow-inner">
                <img src={previewUrl} alt="Preview" className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        type="button" 
                        onClick={() => { setFile(null); if (inputRef.current) inputRef.current.value = ""; }}
                        className="px-4 py-2 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-700"
                    >
                        Remove Image
                    </button>
                </div>
            </div>
        ) : (
            <label className="flex flex-col items-center justify-center gap-2 h-40 rounded-xl border-2 border-dashed border-slate-200 cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all text-center p-4">
                <span className="text-slate-300 text-4xl">🖼️</span>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Click to upload cover image</span>
                <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">JPG, PNG, WEBP · Max 5MB</p>
                <input 
                    ref={inputRef} 
                    type="file" 
                    accept="image/jpeg,image/png,image/webp" 
                    className="hidden" 
                    onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setFile(f);
                    }} 
                    required // Imagen obligatoria
                />
            </label>
        )}
    </div>
  );

  // --- Renders de carga/error ---
  if (supabaseError) return <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-600 p-8 text-center font-bold border border-red-200 m-10 rounded-3xl"><p>Error: {supabaseError}</p></div>;
  if (!supabase) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 font-black uppercase tracking-widest">Initializing Better Dashboard...</div>;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 px-6 md:px-12 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="relative w-[120px] h-[34px]">
          <Image src="/logo.png" alt="Better Technologies" fill className="object-contain" />
        </div>
        <div className="flex items-center gap-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Content Dashboard</p>
            <button onClick={() => supabase.auth.signOut()} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500">Sign out →</button>
        </div>
      </header>

      <div className="bg-white border-b border-slate-100 sticky top-[57px] z-40 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex gap-8">
          <button onClick={() => setActiveTab("blog")} className={`py-4 font-black uppercase text-sm tracking-widest border-b-2 transition-colors ${activeTab === "blog" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}>📝 Blog Posts</button>
          <button onClick={() => setActiveTab("news")} className={`py-4 font-black uppercase text-sm tracking-widest border-b-2 transition-colors ${activeTab === "news" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}>📰 News</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12 items-start">
        {activeTab === "blog" ? (
          <>
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex flex-col gap-6 sticky top-[130px]">
              <div>
                <p className="text-blue-600 uppercase tracking-[0.2em] text-[10px] font-black mb-1">New post</p>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Publish blog post</h2>
              </div>

              <form onSubmit={handleBlogSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Title *</label>
                    <input type="text" name="title" value={blogForm.title} onChange={handleBlogChange} required placeholder="Post Title" className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm font-medium focus:border-blue-600 focus:outline-none transition-colors" />
                </div>
                
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description *</label>
                    <textarea name="description" value={blogForm.description} onChange={handleBlogChange} required rows={3} placeholder="Brief summary..." className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm font-medium resize-none focus:border-blue-600 focus:outline-none transition-colors" />
                </div>
                
                {/* Selector de Imagen de Portada (¡NUEVO!) */}
                <ImageUploadField file={blogImageFile} setFile={setBlogImageFile} inputRef={blogImageFileRef} previewUrl={blogImagePreview} />

                {/* Selector de Documento/Link */}
                <FileUploadField file={blogFile} setFile={setBlogFile} inputRef={blogFileRef} urlValue={blogForm.post_url} urlName="post_url" onUrlChange={handleBlogChange} />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Author</label>
                    <select name="author" value={blogForm.author} onChange={handleBlogChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm font-medium focus:border-blue-600 focus:outline-none bg-white">{AUTHORS.map(a => <option key={a}>{a}</option>)}</select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</label>
                    <select name="category" value={blogForm.category} onChange={handleBlogChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm font-medium focus:border-blue-600 focus:outline-none bg-white">{CATEGORIES.filter(c => c !== "Actualidad").map(c => <option key={c}>{c}</option>)}</select>
                  </div>
                </div>
                
                <button type="submit" disabled={blogSaving} className="w-full py-4 bg-blue-600 text-white rounded-full font-black uppercase text-sm tracking-widest hover:bg-blue-700 transition-all hover:scale-[1.01] disabled:opacity-50 shadow-lg shadow-blue-500/20 mt-2">
                    {blogSaving ? "Publishing..." : "Publish post →"}
                </button>
                {blogSuccess && <p className="text-center text-[11px] font-black text-green-600 uppercase tracking-widest">✓ Post published successfully!</p>}
              </form>
            </div>

            <div>
              <div className="mb-6">
                <p className="text-blue-600 uppercase tracking-[0.2em] text-[10px] font-black mb-1">Published</p>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Your posts</h2>
              </div>
              
              {blogLoading ? <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Loading...</p> : (
                <div className="flex flex-col gap-4">
                  {blogPosts.map(post => (
                    <div key={post.id} className="bg-white border border-slate-100 rounded-2xl p-5 flex gap-4 items-start hover:border-blue-100 transition-colors shadow-sm">
                      <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-100">
                        {post.cover_url ? <img src={post.cover_url} className="w-full h-full object-cover" alt={post.title} /> : <div className="w-full h-full flex items-center justify-center text-2xl bg-slate-50 text-slate-300">Better</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-black text-white bg-blue-600 px-2.5 py-1 rounded-full uppercase tracking-widest">{post.category}</span>
                        <p className="text-slate-900 font-black text-sm mt-1.5 truncate">{post.title}</p>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wide mt-0.5">{post.author} · {new Date(post.published_at).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</p>
                        {post.post_url && <a href={post.post_url} target="_blank" className="text-[9px] text-blue-500 hover:underline font-bold uppercase mt-1 block truncate">Link/File →</a>}
                      </div>
                      
                      {blogDeleteId === post.id ? (
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <span className="text-[9px] font-black text-red-500 uppercase">Sure?</span>
                            <button onClick={() => handleBlogDelete(post.id)} className="text-[10px] font-black text-red-500 hover:underline">YES</button>
                            <button onClick={() => setBlogDeleteId(null)} className="text-[10px] font-black text-slate-400 hover:underline">NO</button>
                        </div>
                      ) : (
                        <button onClick={() => setBlogDeleteId(post.id)} className="text-slate-300 hover:text-red-500 text-2xl flex-shrink-0 leading-none">×</button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* --- NEWS TAB --- */
          <>
             <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex flex-col gap-6 sticky top-[130px]">
              <div>
                <p className="text-green-600 uppercase tracking-[0.2em] text-[10px] font-black mb-1">New news</p>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Publish News</h2>
              </div>
              
              <form onSubmit={handleNewsSubmit} className="flex flex-col gap-5">
                <input type="text" name="title" value={newsForm.title} onChange={handleNewsChange} required placeholder="News Title" className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm font-medium focus:border-green-600 focus:outline-none" />
                <textarea name="description" value={newsForm.description} onChange={handleNewsChange} required rows={3} placeholder="Brief summary" className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm font-medium resize-none focus:border-green-600 focus:outline-none" />
                
                {/* Selector de Imagen de Portada (News) (¡NUEVO!) */}
                <ImageUploadField file={newsImageFile} setFile={setNewsImageFile} inputRef={newsImageFileRef} previewUrl={newsImagePreview} />

                <FileUploadField file={newsFile} setFile={setNewsFile} inputRef={newsFileRef} urlValue={newsForm.post_url} urlName="post_url" onUrlChange={handleNewsChange} />
                
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Author</label>
                    <select name="author" value={newsForm.author} onChange={handleNewsChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm font-medium focus:border-green-600 focus:outline-none bg-white">{AUTHORS.map(a => <option key={a}>{a}</option>)}</select>
                </div>

                <button type="submit" disabled={newsSaving} className="w-full py-4 bg-green-600 text-white rounded-full font-black uppercase text-sm tracking-widest hover:bg-green-700 transition-all hover:scale-[1.01] disabled:opacity-50 mt-2 shadow-lg shadow-green-500/20">
                    {newsSaving ? "Publishing..." : "Publish News →"}
                </button>
                {newsSuccess && <p className="text-center text-[11px] font-black text-green-600 uppercase tracking-widest">✓ News published successfully!</p>}
              </form>
            </div>
            
            <div>
              <div className="mb-6">
                <p className="text-green-600 uppercase tracking-[0.2em] text-[10px] font-black mb-1">Published</p>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Your news</h2>
              </div>
              
              <div className="flex flex-col gap-4">
                {newsPosts.map(post => (
                    <div key={post.id} className="bg-white border border-slate-100 rounded-2xl p-5 flex gap-4 items-start shadow-sm">
                         <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-100">
                            {post.cover_url ? <img src={post.cover_url} className="w-full h-full object-cover" alt={post.title} /> : <div className="w-full h-full flex items-center justify-center text-2xl bg-slate-50 text-slate-300">Better</div>}
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="text-[9px] font-black text-white bg-green-600 px-2.5 py-1 rounded-full uppercase tracking-widest">News</span>
                            <p className="text-slate-900 font-black text-sm mt-1.5">{post.title}</p>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wide mt-0.5">{post.author} · {new Date(post.published_at).toLocaleDateString()}</p>
                        </div>
                        
                        {newsDeleteId === post.id ? (
                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                <button onClick={() => handleNewsDelete(post.id)} className="text-[10px] font-black text-red-500 hover:underline">YES</button>
                                <button onClick={() => setNewsDeleteId(null)} className="text-[10px] font-black text-slate-400 hover:underline">NO</button>
                            </div>
                        ) : (
                            <button onClick={() => setNewsDeleteId(post.id)} className="text-slate-300 hover:text-red-500 text-2xl flex-shrink-0 leading-none">×</button>
                        )}
                    </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}