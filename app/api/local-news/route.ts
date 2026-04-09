import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase env variables for local news route');
    return NextResponse.json(
      { news: [], error: 'Supabase configuration is missing.' },
      { status: 500 }
    );
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id,title,description,post_url,cover_url,author,category,published_at')
      .ilike('category', 'actualidad')
      .order('published_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Local news fetch error', error);
      return NextResponse.json(
        { news: [], error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ news: data || [] });
  } catch (error) {
    console.error('Local news fetch error', error);
    return NextResponse.json(
      { news: [], error: error instanceof Error ? error.message : 'Unexpected error' },
      { status: 500 }
    );
  }
}
