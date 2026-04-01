import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
  const domains = 'bbc.co.uk,cnn.com,reuters.com';
  const query = encodeURIComponent('Frontend OR "Data Science" OR AI OR "Software Engineering"');

  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${query}&domains=${domains}&language=en&sortBy=publishedAt&pageSize=50&apiKey=${apiKey}`,
      { next: { revalidate: 3600 } } // Cache por 1 hora para no agotar tu plan gratuito
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch  {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}