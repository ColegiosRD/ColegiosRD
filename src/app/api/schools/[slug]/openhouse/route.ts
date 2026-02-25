import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface Params {
  params: {
    slug: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: 'School slug is required' },
        { status: 400 }
      );
    }

    // First, get the school ID by slug
    const { data: school, error: schoolError } = await supabase
      .from('schools')
      .select('id')
      .eq('slug', slug)
      .single();

    if (schoolError || !school) {
      return NextResponse.json(
        { error: 'School not found' },
        { status: 404 }
      );
    }

    // Fetch open house events for the school
    const { data: openHouseEvents, error } = await supabase
      .from('open_house_events')
      .select(
        `
        id,
        school_id,
        event_date,
        event_time,
        location,
        registration_url,
        max_attendees,
        current_attendees,
        description,
        created_at
        `
      )
      .eq('school_id', school.id)
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Fetch open house events error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch open house events' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      schoolId: school.id,
      openHouseEvents: openHouseEvents || [],
      count: openHouseEvents?.length || 0,
    });
  } catch (error) {
    console.error('Open house API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
