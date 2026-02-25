import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const {
      school_id,
      director_name,
      director_phone,
      requester_role,
      official_contact_email,
      email,
      email_type,
      documents,
    } = body;

    if (
      !school_id ||
      !director_name ||
      !director_phone ||
      !requester_role ||
      !official_contact_email ||
      !email ||
      !email_type
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use service client for server-side operations
    const supabaseAdmin = createServiceClient();

    // Insert verification request
    const { data: verificationRequest, error: insertError } = await supabaseAdmin
      .from('verification_requests')
      .insert({
        school_id,
        director_name,
        director_phone,
        requester_role,
        official_contact_email,
        email,
        email_type,
        documents: documents || [],
        status: 'pending',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert verification request error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create verification request' },
        { status: 500 }
      );
    }

    // Update school verification status
    const { error: updateError } = await supabaseAdmin
      .from('schools')
      .update({ verification_status: 'pending' })
      .eq('id', school_id);

    if (updateError) {
      console.error('Update school status error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update school status' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Verification request submitted successfully',
        verificationId: verificationRequest.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Verify API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
