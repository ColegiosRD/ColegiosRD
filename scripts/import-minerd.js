const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Utility function to generate slug from school name
function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50);
}

// Validation layer 1: Format validation
function validateFormat(record) {
  const requiredFields = ['minerd_code', 'name', 'province', 'type'];
  for (const field of requiredFields) {
    if (!record[field] || typeof record[field] !== 'string') {
      return false;
    }
  }

  if (typeof record.students_count !== 'number' || record.students_count < 0) {
    return false;
  }

  if (typeof record.prueba_nacional !== 'number' || record.prueba_nacional < 0) {
    return false;
  }

  return true;
}

// Validation layer 2: Range validation
function validateRange(record) {
  if (record.students_count < 15) {
    return false;
  }

  if (record.prueba_nacional === 0) {
    return false;
  }

  if (!['public', 'private'].includes(record.type.toLowerCase())) {
    return false;
  }

  return true;
}

// Validation layer 3: Historical consistency
function validateHistoricalConsistency(record, previousRecords = []) {
  // Check for duplicates by minerd_code
  const isDuplicate = previousRecords.some(
    (r) => r.minerd_code === record.minerd_code
  );

  if (isDuplicate) {
    return false;
  }

  return true;
}

// Fuzzy match to find potential duplicates
function findPotentialDuplicates(record, existingSchools, threshold = 0.8) {
  return existingSchools.filter((school) => {
    const similarity = calculateStringSimilarity(
      record.name.toLowerCase(),
      school.name.toLowerCase()
    );
    return similarity > threshold;
  });
}

// Calculate Levenshtein similarity
function calculateStringSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

// Calculate edit distance (Levenshtein)
function getEditDistance(s1, s2) {
  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

// Fetch data from local source or MINERD API
async function fetchMinerdData() {
  const csvPath = path.join(__dirname, '../data/minerd-schools.csv');

  if (fs.existsSync(csvPath)) {
    console.log('Reading from local CSV file...');
    const content = fs.readFileSync(csvPath, 'utf-8');
    return parseCSV(content);
  }

  console.log('Fetching from MINERD API...');
  try {
    // Try datos.gob.do API
    const response = await fetch('https://datos.gob.do/api/3/action/datastore_search', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.result.records || [];
  } catch (error) {
    console.error('Failed to fetch from MINERD API:', error.message);
    console.log('Falling back to empty dataset');
    return [];
  }
}

// Parse CSV content
function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map((line) => {
    const values = line.split(',');
    const record = {};

    headers.forEach((header, index) => {
      record[header.trim()] = values[index]?.trim() || '';
    });

    return record;
  });
}

// Get province ID by name
async function getProvinceIdByName(provinceName) {
  const { data, error } = await supabase
    .from('provinces')
    .select('id')
    .ilike('name', provinceName)
    .single();

  if (error) {
    console.warn(`Province not found: ${provinceName}`);
    return null;
  }

  return data?.id;
}

// Main import function
async function importSchools() {
  try {
    console.log('Starting MINERD schools import...');
    const startTime = Date.now();

    // Fetch existing schools for duplicate checking
    const { data: existingSchools = [], error: fetchError } = await supabase
      .from('schools')
      .select('id, name, minerd_code');

    if (fetchError) {
      console.error('Error fetching existing schools:', fetchError);
      process.exit(1);
    }

    // Fetch MINERD data
    const minerdData = await fetchMinerdData();
    console.log(`Fetched ${minerdData.length} records from MINERD`);

    let imported = 0;
    let skipped = 0;
    let duplicates = 0;
    const importedRecords = [];
    const errors = [];

    for (const record of minerdData) {
      try {
        // Validation layer 1: Format
        if (!validateFormat(record)) {
          skipped++;
          continue;
        }

        // Validation layer 2: Range
        if (!validateRange(record)) {
          skipped++;
          continue;
        }

        // Validation layer 3: Historical consistency
        if (!validateHistoricalConsistency(record, importedRecords)) {
          skipped++;
          continue;
        }

        // Check for fuzzy duplicates
        const potentialDups = findPotentialDuplicates(record, existingSchools);
        if (potentialDups.length > 0) {
          duplicates++;
          console.log(
            `Found potential duplicate for "${record.name}": ${potentialDups.map((d) => d.name).join(', ')}`
          );
          continue;
        }

        // Get province ID
        const provinceId = await getProvinceIdByName(record.province);
        if (!provinceId) {
          skipped++;
          continue;
        }

        const slug = generateSlug(record.name);

        // Upsert school record (only MINERD fields)
        const { data, error } = await supabase
          .from('schools')
          .upsert(
            {
              minerd_code: record.minerd_code,
              name: record.name,
              slug,
              type: record.type.toLowerCase(),
              address: record.address || '',
              province_id: provinceId,
              students_count: parseInt(record.students_count) || 0,
              prueba_nacional: parseFloat(record.prueba_nacional) || 0,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'minerd_code' }
          )
          .select()
          .single();

        if (error) {
          errors.push({
            record: record.name,
            error: error.message,
          });
          skipped++;
          continue;
        }

        importedRecords.push(record);
        imported++;
      } catch (error) {
        errors.push({
          record: record.name,
          error: error.message,
        });
        skipped++;
      }
    }

    // Create data import entry
    const { error: importLogError } = await supabase
      .from('data_imports')
      .insert({
        source: 'minerd',
        imported_count: imported,
        skipped_count: skipped,
        duplicate_count: duplicates,
        import_date: new Date().toISOString(),
        notes: `Imported ${imported} schools, skipped ${skipped}, found ${duplicates} potential duplicates`,
      });

    if (importLogError) {
      console.error('Error logging import:', importLogError);
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n=== Import Summary ===');
    console.log(`Total imported: ${imported}`);
    console.log(`Total skipped: ${skipped}`);
    console.log(`Duplicates found: ${duplicates}`);
    console.log(`Duration: ${duration}s`);

    if (errors.length > 0) {
      console.log('\n=== Errors ===');
      errors.forEach((err) => {
        console.log(`${err.record}: ${err.error}`);
      });
    }

    console.log('\nImport completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Fatal import error:', error);
    process.exit(1);
  }
}

// Run import
importSchools();
