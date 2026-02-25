const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function calculateRatings() {
  try {
    console.log('Starting ratings calculation...');
    const startTime = Date.now();

    // Fetch all schools
    const { data: schools, error: fetchError } = await supabase
      .from('schools')
      .select('id, name')
      .order('id', { ascending: true });

    if (fetchError) {
      console.error('Error fetching schools:', fetchError);
      process.exit(1);
    }

    console.log(`Found ${schools.length} schools to process`);

    let updated = 0;
    let failed = 0;
    const errors = [];

    for (const school of schools) {
      try {
        // Call the calculate_rating SQL function
        const { data, error } = await supabase.rpc('calculate_rating', {
          school_id: school.id,
        });

        if (error) {
          errors.push({
            school: school.name,
            error: error.message,
          });
          failed++;
          console.log(`✗ Failed: ${school.name}`);
          continue;
        }

        updated++;
        console.log(`✓ Updated: ${school.name} (Rating: ${data?.toFixed(2) || 'N/A'})`);
      } catch (error) {
        errors.push({
          school: school.name,
          error: error.message,
        });
        failed++;
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n=== Calculation Summary ===');
    console.log(`Successfully updated: ${updated}`);
    console.log(`Failed: ${failed}`);
    console.log(`Duration: ${duration}s`);

    if (errors.length > 0) {
      console.log('\n=== Errors ===');
      errors.forEach((err) => {
        console.log(`${err.school}: ${err.error}`);
      });
    }

    console.log('\nRatings calculation completed!');
    process.exit(0);
  } catch (error) {
    console.error('Fatal calculation error:', error);
    process.exit(1);
  }
}

// Run calculation
calculateRatings();
