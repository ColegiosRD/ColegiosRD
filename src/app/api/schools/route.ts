import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Extract query parameters
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const zone = searchParams.get('zone') || '';
    const province = searchParams.get('province') || '';
    const sortBy = searchParams.get('sortBy') || 'name';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('schools')
      .select(
        `
        id,
        name,
        slug,
        type,
        address,
        phone,
        email,
        website,
        rating,
        views,
        is_top_public,
        prueba_nacional,
        province_id,
        zone,
        provinces (id, name, region)
        `,
        { count: 'exact' }
      );

    // Apply filters
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,address.ilike.%${search}%`
      );
    }

    if (type) {
      query = query.eq('type', type);
    }

    if (zone) {
      query = query.eq('zone', zone);
    }

    if (province) {
      query = query.eq('province_id', province);
    }

    // Apply sorting
    if (sortBy === 'rating') {
      query = query.order('rating', { ascending: false });
    } else if (sortBy === 'views') {
      query = query.order('views', { ascending: false });
    } else if (sortBy === 'prueba_nacional') {
      query = query.order('prueba_nacional', { ascending: false });
    } else {
      query = query.order('name', { ascending: true });
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch schools' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      schools: data || [],
      total: count || 0,
      page,
      limit,
      pages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error('Schools API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
