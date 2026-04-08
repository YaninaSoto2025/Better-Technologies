import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function GET() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id,title,description,post_url,cover_url,author,category,published_at')
      .eq('category', 'Actualidad')
      .order('published_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Local news fetch error', error);
      return NextResponse.json({ news: [] }, { status: 500 });
    }

    return NextResponse.json({ news: data || [] });
  } catch (error) {
    console.error('Local news fetch error', error);
    return NextResponse.json({ news: [] }, { status: 500 });
  }
}
