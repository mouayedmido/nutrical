import { nutritionDatabase } from '@/lib/nutritionData';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.trim().toLowerCase() || '';
    const category = searchParams.get('category') || 'all';

    const foods = nutritionDatabase.filter(food => {
      const searchableText = [food.name, food.category, ...(food.aliases || [])]
        .join(' ')
        .toLowerCase();
      const matchesQuery = !query || searchableText.includes(query);
      const matchesCategory = category === 'all' || food.category === category;
      return matchesQuery && matchesCategory;
    });

    return NextResponse.json({
      success: true,
      count: foods.length,
      foods,
    });
  } catch (error) {
    console.error('Error searching foods:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
