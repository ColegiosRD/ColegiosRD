const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateTopPublicSchools() {
  try {
    console.log('Starting top public schools update...');
    const startTime = Date.now();

    // Fetch all public schools with province information
    const { data: publicSchools, error: fetchError } = await supabase
      .from('schools')
      .select(
        `
        id,
        name,
        province_id,
        prueba_nacional,
        is_top_public,
        provinces (id, name, region)
        `
      )
      .eq('type', 'public')
      .order('prueba_nacional', { ascending: false });

    if (fetchError) {
      console.error('Error fetching public schools:', fetchError);
      process.exit(1);
    }

    console.log(`Found ${publicSchools.length} public schools`);

    // Group schools by province
    const schoolsByProvince = {};

    for (const school of publicSchools) {
      const provinceId = school.province_id;

      if (!schoolsByProvince[provinceId]) {
        schoolsByProvince[provinceId] = [];
      }

      schoolsByProvince[provinceId].push(school);
    }

    console.log(`Schools grouped into ${Object.keys(schoolsByProvince).length} provinces`);

    let updated = 0;
    const errors = [];

    // Process each province
    for (const [provinceId, schools] of Object.entries(schoolsByProvince)) {
      // Sort by prueba_nacional descending
      schools.sort((a, b) => (b.prueba_nacional || 0) - (a.prueba_nacional || 0));

      // Take top 10 (or all if fewer than 10)
      const topTenCount = Math.min(10, schools.length);
      const topTen = schools.slice(0, topTenCount);
      const rest = schools.slice(topTenCount);

      console.log(`\nProvince ${provinceId}: ${schools.length} schools (top 10: ${topTen.length})`);

      // Mark top 10 as is_top_public = true
      for (const school of topTen) {
        if (!school.is_top_public) {
          const { error } = await supabase
            .from('schools')
            .update({ is_top_public: true })
            .eq('id', school.id);

          if (error) {
            errors.push({
              school: school.name,
              action: 'mark as top',
              error: error.message,
            });
            console.log(`  ✗ Failed to mark as top: ${school.name}`);
          } else {
            updated++;
            console.log(`  ✓ Marked as top: ${school.name} (Prueba Nacional: ${school.prueba_nacional})`);
          }
        }
      }

      // Mark rest as is_top_public = false
      for (const school of rest) {
        if (school.is_top_public) {
          const { error } = await supabase
            .from('schools')
            .update({ is_top_public: false })
            .eq('id', school.id);

          if (error) {
            errors.push({
              school: school.name,
              action: 'mark as non-top',
              error: error.message,
            });
            console.log(`  ✗ Failed to mark as non-top: ${school.name}`);
          } else {
            updated++;
            console.log(`  ✓ Marked as non-top: ${school.name}`);
          }
        }
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n=== Update Summary ===');
    console.log(`Total records updated: ${updated}`);
    console.log(`Duration: ${duration}s`);

    if (errors.length > 0) {
      console.log('\n=== Errors ===');
      errors.forEach((err) => {
        console.log(`${err.school} (${err.action}): ${err.error}`);
      });
    }

    console.log('\nTop public schools update completed!');
    process.exit(0);
  } catch (error) {
    console.error('Fatal update error:', error);
    process.exit(1);
  }
}

// Run update
updateTopPublicSchools();
