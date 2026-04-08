import { getDailyRecommendations, UserProfile } from '@/lib/nutrition-calc';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const profile: UserProfile = body.profile;

    if (!profile || !profile.age || !profile.weight || !profile.height || !profile.sex) {
      return NextResponse.json(
        { success: false, error: 'Invalid profile data' },
        { status: 400 }
      );
    }

    const recommendations = getDailyRecommendations(profile);

    return NextResponse.json({
      success: true,
      profile,
      recommendations,
    });
  } catch (error) {
    console.error('Error calculating nutrition:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
