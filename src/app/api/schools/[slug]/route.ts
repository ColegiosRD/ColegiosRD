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

    // Fetch school with province information
    const { data: school, error: fetchError } = await supabase
      .from('schools')
      .select(
        `
        id,
        name,
        slug,
        type,
        description,
        address,
        phone,
        email,
        website,
        rating,
        views,
        is_top_public,
        prueba_nacional,
        students_count,
        province_id,
        zone,
        founded_year,
        headmaster_name,
        verification_status,
        provinces (id, name, region)
        `
      )
      .eq('slug', slug)
      .single();

    if (fetchError || !school) {
      console.error('Fetch school error:', fetchError);
      return NextResponse.json(
        { error: 'School not found' },
        { status: 404 }
      );
    }

    // Increment view count using RPC
    const { error: incrementError } = await supabase.rpc('increment_school_view', {
      school_id: school.id,
    });

    if (incrementError) {
      console.error('Increment view error:', incrementError);
      // Don't fail the request if increment fails
    }

    return NextResponse.json({ school });
  } catch (error) {
    console.error('School detail API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
