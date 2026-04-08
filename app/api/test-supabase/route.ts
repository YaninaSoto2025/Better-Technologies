import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function GET() {
  try {
    const supabase = createClient();

    // Test connection
    const { count, error: countError } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      return NextResponse.json({
        error: countError.message,
        details: countError.details
      }, { status: 500 });
    }

    // Get sample data
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .limit(5);

    if (error) {
      return NextResponse.json({
        error: error.message,
        details: error.details
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count,
      sampleData: data
    });
  } catch (err) {
    return NextResponse.json({
      error: 'Unexpected error',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}