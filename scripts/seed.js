const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Generate slug from school name
function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50);
}

// Sample schools data - 25 schools from prototype
const sampleSchools = [
  // Private schools - Santo Domingo (8)
  {
    name: 'Colegio de San Ignacio',
    type: 'private',
    province: 'Santo Domingo',
    description: 'Prestigious Jesuit school with strong academic tradition',
    address: 'Calle Hostos 123, Santo Domingo',
    phone: '809-555-0101',
    email: 'info@sananacio.do',
    website: 'www.sananacio.do',
    rating: 4.8,
    prueba_nacional: 85.5,
    students_count: 450,
    zone: 'urban',
    founded_year: 1952,
    headmaster_name: 'Dr. Juan Carlos Pérez',
    openHouseDate: '2026-03-15',
    openHouseTime: '10:00',
  },
  {
    name: 'Liceo Javier',
    type: 'private',
    province: 'Santo Domingo',
    description: 'International curriculum school with emphasis on languages',
    address: 'Avenida Independencia 456, Santo Domingo',
    phone: '809-555-0102',
    email: 'contact@liceojavier.do',
    website: 'www.liceojavier.do',
    rating: 4.7,
    prueba_nacional: 84.2,
    students_count: 380,
    zone: 'urban',
    founded_year: 1965,
    headmaster_name: 'Lic. María José González',
    openHouseDate: '2026-03-22',
    openHouseTime: '14:00',
  },
  {
    name: 'Colegio Santa María',
    type: 'private',
    province: 'Santo Domingo',
    description: 'All-girls Catholic school with strong STEM programs',
    address: 'Calle Duarte 789, Santo Domingo',
    phone: '809-555-0103',
    email: 'admisiones@colegiosantamaria.do',
    website: 'www.colegiosantamaria.do',
    rating: 4.6,
    prueba_nacional: 83.8,
    students_count: 320,
    zone: 'urban',
    founded_year: 1958,
    headmaster_name: 'Dra. Rosa María Sánchez',
  },
  {
    name: 'Instituto Técnico Capotillo',
    type: 'private',
    province: 'Santo Domingo',
    description: 'Vocational school specializing in technical trades',
    address: 'Avenida San Martín 234, Santo Domingo',
    phone: '809-555-0104',
    email: 'inscripcion@tecnicacapotillo.do',
    website: 'www.tecnicacapotillo.do',
    rating: 4.4,
    prueba_nacional: 78.5,
    students_count: 250,
    zone: 'urban',
    founded_year: 1980,
    headmaster_name: 'Ing. Rafael Jiménez',
  },
  {
    name: 'Colegio Dominicano',
    type: 'private',
    province: 'Santo Domingo',
    description: 'Traditional school with focus on Dominican culture and values',
    address: 'Calle Isabel la Católica 567, Santo Domingo',
    phone: '809-555-0105',
    email: 'registro@colegiodom.do',
    website: 'www.colegiodom.do',
    rating: 4.5,
    prueba_nacional: 82.1,
    students_count: 380,
    zone: 'urban',
    founded_year: 1962,
    headmaster_name: 'Prof. Eduardo Martínez',
    openHouseDate: '2026-04-05',
    openHouseTime: '09:00',
  },
  {
    name: 'Academia Lincoln',
    type: 'private',
    province: 'Santo Domingo',
    description: 'Bilingual academy with American-style curriculum',
    address: 'Avenida Bolívar 890, Santo Domingo',
    phone: '809-555-0106',
    email: 'admisiones@acadlincoln.do',
    website: 'www.acadlincoln.do',
    rating: 4.7,
    prueba_nacional: 84.9,
    students_count: 420,
    zone: 'suburban',
    founded_year: 1975,
    headmaster_name: 'Dra. Patricia Rodríguez',
  },
  {
    name: 'Escuela Montessori Santo Domingo',
    type: 'private',
    province: 'Santo Domingo',
    description: 'Progressive Montessori school for early childhood and elementary',
    address: 'Calle Colón 345, Santo Domingo',
    phone: '809-555-0107',
    email: 'info@montessorisdo.do',
    website: 'www.montessorisdo.do',
    rating: 4.6,
    prueba_nacional: 80.3,
    students_count: 200,
    zone: 'urban',
    founded_year: 1995,
    headmaster_name: 'Lic. Carmen López',
  },
  {
    name: 'Colegio Francés Domingo Savio',
    type: 'private',
    province: 'Santo Domingo',
    description: 'French-language school with European academic standards',
    address: 'Avenida Francia 123, Santo Domingo',
    phone: '809-555-0108',
    email: 'contact@colegiofrances.do',
    website: 'www.colegiofrances.do',
    rating: 4.8,
    prueba_nacional: 86.7,
    students_count: 280,
    zone: 'suburban',
    founded_year: 1970,
    headmaster_name: 'M. Pierre Dubois',
  },
  // Private schools - Santiago (7)
  {
    name: 'Liceo Espíritu Santo',
    type: 'private',
    province: 'Santiago',
    description: 'Faith-based school with holistic education approach',
    address: 'Calle Mella 456, Santiago',
    phone: '809-555-0201',
    email: 'info@liceoesp.do',
    website: 'www.liceoesp.do',
    rating: 4.7,
    prueba_nacional: 83.4,
    students_count: 350,
    zone: 'urban',
    founded_year: 1968,
    headmaster_name: 'Rev. Héctor Moreno',
    openHouseDate: '2026-03-20',
    openHouseTime: '15:00',
  },
  {
    name: 'Instituto Técnico de Santiago',
    type: 'private',
    province: 'Santiago',
    description: 'Technical school with strong industry partnerships',
    address: 'Autopista Santiago 789, Santiago',
    phone: '809-555-0202',
    email: 'admisiones@institecnico.do',
    website: 'www.institecnico.do',
    rating: 4.5,
    prueba_nacional: 79.8,
    students_count: 280,
    zone: 'suburban',
    founded_year: 1985,
    headmaster_name: 'Ing. Roberto Sánchez',
  },
  {
    name: 'Colegio Nuestra Señora del Rosario',
    type: 'private',
    province: 'Santiago',
    description: 'Catholic girls school with emphasis on arts and humanities',
    address: 'Calle Emilio Prud\'Homme 234, Santiago',
    phone: '809-555-0203',
    email: 'registro@rosariosgo.do',
    website: 'www.rosariosgo.do',
    rating: 4.6,
    prueba_nacional: 81.2,
    students_count: 290,
    zone: 'urban',
    founded_year: 1955,
    headmaster_name: 'Hna. Sofía Contreras',
  },
  {
    name: 'Academia Internacional Santiago',
    type: 'private',
    province: 'Santiago',
    description: 'International baccalaureate school with global curriculum',
    address: 'Avenida Kennedy 567, Santiago',
    phone: '809-555-0204',
    email: 'info@acadintsgo.do',
    website: 'www.acadintsgo.do',
    rating: 4.8,
    prueba_nacional: 85.6,
    students_count: 320,
    zone: 'suburban',
    founded_year: 1992,
    headmaster_name: 'Dr. Fernando Gómez',
    openHouseDate: '2026-04-12',
    openHouseTime: '10:00',
  },
  {
    name: 'Colegio San Luis Gonzaga',
    type: 'private',
    province: 'Santiago',
    description: 'Jesuit boys school with strong emphasis on civic education',
    address: 'Calle Restauración 890, Santiago',
    phone: '809-555-0205',
    email: 'admisiones@sanluiss.do',
    website: 'www.sanluiss.do',
    rating: 4.7,
    prueba_nacional: 84.3,
    students_count: 380,
    zone: 'urban',
    founded_year: 1960,
    headmaster_name: 'P. Luis Alberto Pérez',
  },
  {
    name: 'Escuela de Artes y Oficios Santiago',
    type: 'private',
    province: 'Santiago',
    description: 'Vocational school focused on creative and practical skills',
    address: 'Avenida Arturo Merced 123, Santiago',
    phone: '809-555-0206',
    email: 'inscripcion@artessgo.do',
    website: 'www.artessgo.do',
    rating: 4.3,
    prueba_nacional: 76.8,
    students_count: 200,
    zone: 'urban',
    founded_year: 1998,
    headmaster_name: 'Lic. Ángela Morales',
  },
  {
    name: 'Colegio Presidencial',
    type: 'private',
    province: 'Santiago',
    description: 'Elite preparatory school with prestigious alumni network',
    address: 'Altura Naco, Santiago',
    phone: '809-555-0207',
    email: 'admisiones@colegiopres.do',
    website: 'www.colegiopres.do',
    rating: 4.9,
    prueba_nacional: 87.2,
    students_count: 250,
    zone: 'suburban',
    founded_year: 1973,
    headmaster_name: 'Dr. Carlos Alberto González',
  },
  // Public schools - Multiple provinces (10)
  {
    name: 'Escuela Politécnica Loyola',
    type: 'public',
    province: 'Santo Domingo',
    description: 'Top public technical school in national rankings',
    address: 'Avenida 30 de Marzo, Santo Domingo',
    phone: '809-555-0301',
    email: 'info@politecnicaloyola.do',
    website: 'www.politecnicaloyola.do',
    rating: 4.4,
    prueba_nacional: 81.5,
    students_count: 1200,
    zone: 'urban',
    founded_year: 1975,
    headmaster_name: 'Ing. Marcelino Flores',
    is_top_public: true,
  },
  {
    name: 'Liceo Educación y Desarrollo',
    type: 'public',
    province: 'Santiago',
    description: 'Leading public secondary school in the northern region',
    address: 'Carretera Circunvalación, Santiago',
    phone: '809-555-0302',
    email: 'director@liceoyd.do',
    website: 'www.liceoyd.do',
    rating: 4.3,
    prueba_nacional: 79.8,
    students_count: 980,
    zone: 'suburban',
    founded_year: 1982,
    headmaster_name: 'Prof. Juan Carlos Mendoza',
    is_top_public: true,
  },
  {
    name: 'Liceo Técnico Industrial Enriquillo',
    type: 'public',
    province: 'La Romana',
    description: 'Public technical school with industry certifications',
    address: 'Avenida Santa Rosa, La Romana',
    phone: '809-555-0303',
    email: 'info@liceotecnico.do',
    website: 'www.liceotecnico.do',
    rating: 4.2,
    prueba_nacional: 77.6,
    students_count: 650,
    zone: 'urban',
    founded_year: 1988,
    headmaster_name: 'Ing. Roberto Acosta',
    is_top_public: true,
  },
  {
    name: 'Escuela Secundaria Juan Pablo Duarte',
    type: 'public',
    province: 'La Altagracia',
    description: 'Public school serving the Punta Cana area',
    address: 'Carretera Punta Cana, La Altagracia',
    phone: '809-555-0304',
    email: 'jpduarte@minerd.do',
    website: 'www.jpduarte.edu.do',
    rating: 4.1,
    prueba_nacional: 74.3,
    students_count: 520,
    zone: 'urban',
    founded_year: 2001,
    headmaster_name: 'Lic. Patricia Núñez',
    is_top_public: true,
  },
  {
    name: 'Liceo Nocturno Profesional',
    type: 'public',
    province: 'Santo Domingo',
    description: 'Evening school for working students',
    address: 'Avenida Luperón 345, Santo Domingo',
    phone: '809-555-0305',
    email: 'liceonocturno@minerd.do',
    website: 'www.liceonocturno.edu.do',
    rating: 3.9,
    prueba_nacional: 71.2,
    students_count: 450,
    zone: 'urban',
    founded_year: 1990,
    headmaster_name: 'Prof. Miguel Rodríguez',
    is_top_public: true,
  },
  {
    name: 'Escuela Secundaria Héroes de Bani',
    type: 'public',
    province: 'Peravia',
    description: 'Public secondary school in southern region',
    address: 'Avenida Independencia, Bani',
    phone: '809-555-0306',
    email: 'heroesdebani@minerd.do',
    website: 'www.heroesdebani.edu.do',
    rating: 4.0,
    prueba_nacional: 72.8,
    students_count: 580,
    zone: 'urban',
    founded_year: 1985,
    headmaster_name: 'Lic. Carmen Martínez',
    is_top_public: true,
  },
  {
    name: 'Liceo Agropecuario San Cristóbal',
    type: 'public',
    province: 'San Cristóbal',
    description: 'Agricultural technical school with hands-on training',
    address: 'Camino a San Cristóbal, San Cristóbal',
    phone: '809-555-0307',
    email: 'agroped@minerd.do',
    website: 'www.agroped.edu.do',
    rating: 4.1,
    prueba_nacional: 75.5,
    students_count: 420,
    zone: 'rural',
    founded_year: 1992,
    headmaster_name: 'Ing. Agr. Ramón García',
    is_top_public: true,
  },
  {
    name: 'Escuela Técnica Azua',
    type: 'public',
    province: 'Azua',
    description: 'Technical school in southwestern Dominican Republic',
    address: 'Avenida Principal, Azua',
    phone: '809-555-0308',
    email: 'tecazua@minerd.do',
    website: 'www.tecazua.edu.do',
    rating: 3.8,
    prueba_nacional: 70.9,
    students_count: 380,
    zone: 'rural',
    founded_year: 1989,
    headmaster_name: 'Prof. José Luis Sánchez',
    is_top_public: true,
  },
  {
    name: 'Liceo Politécnico Espaillat',
    type: 'public',
    province: 'Espaillat',
    description: 'Public polytechnic school in the Espaillat province',
    address: 'Avenida Duarte, Moca',
    phone: '809-555-0309',
    email: 'politecespaillat@minerd.do',
    website: 'www.politecespaillat.edu.do',
    rating: 4.0,
    prueba_nacional: 73.6,
    students_count: 490,
    zone: 'rural',
    founded_year: 1987,
    headmaster_name: 'Ing. Francisco Díaz',
    is_top_public: true,
  },
  {
    name: 'Escuela Secundaria María Trinidad Sánchez',
    type: 'public',
    province: 'María Trinidad Sánchez',
    description: 'Secondary school in the northern coast region',
    address: 'Avenida General Gregorio Luperón, Sosúa',
    phone: '809-555-0310',
    email: 'mts@minerd.do',
    website: 'www.mts.edu.do',
    rating: 3.9,
    prueba_nacional: 72.1,
    students_count: 410,
    zone: 'urban',
    founded_year: 1993,
    headmaster_name: 'Lic. Aida Flores',
    is_top_public: true,
  },
];

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

// Main seed function
async function seedDatabase() {
  try {
    console.log('Starting database seed with 25 sample schools...');
    const startTime = Date.now();

    let seededSchools = 0;
    let seededOpenHouses = 0;
    const errors = [];

    for (const schoolData of sampleSchools) {
      try {
        // Get province ID
        const provinceId = await getProvinceIdByName(schoolData.province);
        if (!provinceId) {
          errors.push(`Skipped ${schoolData.name}: Province not found`);
          continue;
        }

        const slug = generateSlug(schoolData.name);

        // Insert school
        const { data: school, error: schoolError } = await supabase
          .from('schools')
          .insert({
            name: schoolData.name,
            slug,
            type: schoolData.type,
            description: schoolData.description,
            address: schoolData.address,
            phone: schoolData.phone,
            email: schoolData.email,
            website: schoolData.website,
            rating: schoolData.rating,
            prueba_nacional: schoolData.prueba_nacional,
            students_count: schoolData.students_count,
            province_id: provinceId,
            zone: schoolData.zone,
            founded_year: schoolData.founded_year,
            headmaster_name: schoolData.headmaster_name,
            is_top_public: schoolData.is_top_public || false,
            verification_status: 'unverified',
          })
          .select()
          .single();

        if (schoolError) {
          errors.push(`${schoolData.name}: ${schoolError.message}`);
          continue;
        }

        seededSchools++;
        console.log(`✓ Seeded: ${schoolData.name}`);

        // Create open house event if date is provided
        if (schoolData.openHouseDate && school) {
          const { error: eventError } = await supabase
            .from('open_house_events')
            .insert({
              school_id: school.id,
              event_date: schoolData.openHouseDate,
              event_time: schoolData.openHouseTime || '10:00',
              location: school.address,
              description: `Open house event for ${schoolData.name}`,
              max_attendees: 200,
              current_attendees: 0,
            });

          if (eventError) {
            console.warn(`Failed to create open house for ${schoolData.name}: ${eventError.message}`);
          } else {
            seededOpenHouses++;
          }
        }
      } catch (error) {
        errors.push(`${schoolData.name}: ${error.message}`);
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n=== Seed Summary ===');
    console.log(`Schools seeded: ${seededSchools}`);
    console.log(`Open house events created: ${seededOpenHouses}`);
    console.log(`Duration: ${duration}s`);

    if (errors.length > 0) {
      console.log('\n=== Errors ===');
      errors.forEach((err) => console.log(`⚠ ${err}`));
    }

    console.log('\nDatabase seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Fatal seed error:', error);
    process.exit(1);
  }
}

// Run seed
seedDatabase();
