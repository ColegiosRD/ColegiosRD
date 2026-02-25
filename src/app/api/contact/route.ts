import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { school_id, request_type, parent_name, parent_email, parent_phone, message } = body;

    if (!school_id || !request_type || !parent_name || !parent_email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(parent_email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Insert contact request
    const { data: contactRequest, error } = await supabase
      .from('contact_requests')
      .insert({
        school_id,
        request_type,
        parent_name,
        parent_email,
        parent_phone: parent_phone || null,
        message,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Insert contact request error:', error);
      return NextResponse.json(
        { error: 'Failed to create contact request' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Contact request submitted successfully',
        requestId: contactRequest.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
