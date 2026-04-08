import { foodsDatabase } from '@/lib/foods-data';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.toLowerCase() || '';
    const category = searchParams.get('category') || 'all';

    let results = foodsDatabase;

    // filters by search query
    if (query) {
      results = results.filter(food =>
        food.name.toLowerCase().includes(query) ||
        food.category.toLowerCase().includes(query)
      );
    }

    // filters by category
    if (category !== 'all') {
      results = results.filter(food => food.category === category);
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      foods: results,
    });
  } catch (error) {
    console.error('Error searching foods:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
