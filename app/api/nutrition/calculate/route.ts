import { getRecommendations, UserProfile } from '@/lib/recommendations';
import { NextRequest, NextResponse } from 'next/server';

function isValidProfile(profile: Partial<UserProfile> | undefined): profile is UserProfile {
  return Boolean(
    profile &&
    typeof profile.age === 'number' && profile.age > 0 &&
    typeof profile.weight === 'number' && profile.weight > 0 &&
    (profile.height === undefined || (typeof profile.height === 'number' && profile.height > 0)) &&
    (profile.sex === 'male' || profile.sex === 'female')
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const profile = body.profile as Partial<UserProfile> | undefined;

    if (!isValidProfile(profile)) {
      return NextResponse.json(
        { success: false, error: 'Invalid profile data' },
        { status: 400 }
      );
    }

    const recommendations = getRecommendations(profile);

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
