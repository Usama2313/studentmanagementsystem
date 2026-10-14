// server/data.js
// High-volume mock data generator for 1000s of Students, Teachers, Parents, News, Menu & Biometrics
// Specifically designed for GCC (Bahrain, Saudi Arabia, Kuwait, UAE/Dubai, Qatar, Oman)

const GCC_COUNTRIES = [
  { code: 'UAE', name: 'United Arab Emirates', city: 'Dubai', phonePrefix: '+971', campuses: ['Dubai Academic City Campus', 'Dubai Marina Campus', 'Abu Dhabi Global Campus'] },
  { code: 'KSA', name: 'Saudi Arabia', city: 'Riyadh', phonePrefix: '+966', campuses: ['Riyadh Elite Academy', 'Jeddah International School', 'Dhahran STEM Campus'] },
  { code: 'BHR', name: 'Bahrain', city: 'Manama', phonePrefix: '+973', campuses: ['Manama Capital Campus', 'Riffa British-GCC Academy'] },
  { code: 'KWT', name: 'Kuwait', city: 'Kuwait City', phonePrefix: '+965', campuses: ['Kuwait City International School', 'Salmiya Leadership Academy'] },
  { code: 'QAT', name: 'Qatar', city: 'Doha', phonePrefix: '+974', campuses: ['Doha West Bay Campus'] },
  { code: 'OMN', name: 'Oman', city: 'Muscat', phonePrefix: '+968', campuses: ['Muscat Heights Academy'] }
];

const NATIONALITIES = [
  'Emirati', 'Saudi', 'Bahraini', 'Kuwaiti', 'Qatari', 'Omani',
  'British', 'American', 'Canadian', 'Australian',
  'Indian', 'Pakistani', 'Egyptian', 'Jordanian', 'Lebanese',
  'French', 'German', 'Spanish', 'South African', 'Turkish'
];

const FIRST_NAMES_MALE = [
  'Mohammed', 'Ali', 'Zayed', 'Omar', 'Hamad', 'Sultan', 'Fahad', 'Abdullah',
  'Tariq', 'Khalid', 'Rashid', 'Saad', 'Yousef', 'Ibrahim', 'Kareem', 'Rayan',
  'Adam', 'Lucas', 'Oliver', 'Noah', 'Aryan', 'Arjun', 'Hamza', 'Mustafa'
];

const FIRST_NAMES_FEMALE = [
  'Fatima', 'Maryam', 'Noor', 'Aisha', 'Reem', 'Sara', 'Hessa', 'Latifa',
  'Salma', 'Lina', 'Layla', 'Yasmin', 'Zahra', 'Dana', 'Jana', 'Tala',
  'Sophia', 'Emma', 'Olivia', 'Maya', 'Ananya', 'Diya', 'Zainab', 'Huda'
];

const LAST_NAMES = [
  'Al-Maktoum', 'Al-Nahyan', 'Al-Saud', 'Al-Khalifa', 'Al-Sabah', 'Al-Thani',
  'Al-Mansoor', 'Al-Hashemi', 'Al-Farsi', 'Al-Ghamdi', 'Al-Dosari', 'Al-Otaibi',
  'Smith', 'Johnson', 'Williams', 'Brown', 'Davis', 'Khan', 'Sharma', 'Patel',
  'El-Sayed', 'Khoury', 'Haddad', 'Rahman', 'Aziz'
];

const SUBJECTS = [
  'Advanced Mathematics & Calculus',
  'Artificial Intelligence & Robotics',
  'Physics & Aerospace Exploration',
  'Chemistry & Molecular Sciences',
  'Biology & Biotechnology',
  'Arabic Literature & Islamic Studies',
  'English World Literature',
  'Global History & GCC Heritage',
  'Computer Science & Software Eng.',
  'Fine Arts & Digital Media',
  'Physical Education & Sports Science'
];

const GRADES = [
  'Kindergarten 1', 'Kindergarten 2',
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
  'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10',
  'Grade 11', 'Grade 12'
];

const SECTIONS = ['A', 'B', 'C', 'D'];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate 120 Teachers
function generateTeachers() {
  const teachers = [];
  let id = 1001;

  for (let i = 0; i < 120; i++) {
    const isMale = Math.random() > 0.45;
    const firstName = isMale ? getRandomItem(FIRST_NAMES_MALE) : getRandomItem(FIRST_NAMES_FEMALE);
    const lastName = getRandomItem(LAST_NAMES);
    const countryObj = getRandomItem(GCC_COUNTRIES);
    const nationality = getRandomItem(NATIONALITIES);
    const subject = getRandomItem(SUBJECTS);
    const campus = getRandomItem(countryObj.campuses);
    const phone = `${countryObj.phonePrefix} 5${getRandomInt(10000000, 99999999)}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/[^a-z]/g, '')}${id}@gccschools.edu`;

    teachers.push({
      id: `TCH-${id}`,
      name: `${firstName} ${lastName}`,
      role: 'Teacher',
      gender: isMale ? 'Male' : 'Female',
      subject,
      grade: getRandomItem(GRADES),
      campus,
      country: countryObj.name,
      countryCode: countryObj.code,
      nationality,
      phone,
      email,
      thumbprintId: `FP-TCH-${id}`,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + (id * 97) % 500000000}?auto=format&fit=crop&w=150&h=150&q=80`,
      availableSlots: [
        '09:00 AM - 09:30 AM',
        '10:30 AM - 11:00 AM',
        '01:15 PM - 01:45 PM',
        '03:00 PM - 03:30 PM'
      ]
    });
    id++;
  }
  return teachers;
}

// Generate 3,500 Students across GCC
function generateStudents() {
  const students = [];
  let id = 5001;

  for (let i = 0; i < 3500; i++) {
    const isMale = Math.random() > 0.5;
    const firstName = isMale ? getRandomItem(FIRST_NAMES_MALE) : getRandomItem(FIRST_NAMES_FEMALE);
    const lastName = getRandomItem(LAST_NAMES);
    const countryObj = getRandomItem(GCC_COUNTRIES);
    const nationality = getRandomItem(NATIONALITIES);
    const grade = getRandomItem(GRADES);
    const section = getRandomItem(SECTIONS);
    const campus = getRandomItem(countryObj.campuses);
    const parentFirstName = isMale ? getRandomItem(FIRST_NAMES_MALE) : getRandomItem(FIRST_NAMES_MALE);
    const parentName = `${parentFirstName} ${lastName}`;
    const parentPhone = `${countryObj.phonePrefix} 5${getRandomInt(10000000, 99999999)}`;
    const parentEmail = `parent.${lastName.toLowerCase().replace(/[^a-z]/g, '')}${id}@gccparents.com`;
    const avatar = `https://images.unsplash.com/photo-${1535713875002 + (id * 17) % 300000000}?auto=format&fit=crop&w=150&h=150&q=80`;

    // Simulated Biometric status
    const randState = Math.random();
    let currentStatus = 'Checked Out';
    let timeIn = null;
    let timeOut = null;

    if (randState < 0.65) {
      currentStatus = 'Inside Campus (Checked In)';
      timeIn = `07:${getRandomInt(15, 55).toString().padStart(2, '0')} AM`;
    } else if (randState < 0.9) {
      currentStatus = 'Checked Out';
      timeIn = `07:${getRandomInt(15, 55).toString().padStart(2, '0')} AM`;
      timeOut = `02:${getRandomInt(10, 45).toString().padStart(2, '0')} PM`;
    } else {
      currentStatus = 'Not Present Yet';
    }

    students.push({
      id: `GCC-STU-${id}`,
      name: `${firstName} ${lastName}`,
      role: 'Student',
      gender: isMale ? 'Male' : 'Female',
      grade,
      section,
      campus,
      country: countryObj.name,
      countryCode: countryObj.code,
      nationality,
      thumbprintId: `FP-STU-${id}`,
      parentName,
      parentPhone,
      parentEmail,
      avatar,
      attendanceStatus: currentStatus,
      timeIn,
      timeOut,
      emergencyContact: parentPhone
    });
    id++;
  }
  return students;
}


// Initial News and Announcements
const INITIAL_NEWS = [
  {
    id: 'news-1',
    title: 'GCC Inter-School Robotics & AI Grand Championship 2026',
    category: 'STEM & Robotics',
    campus: 'Dubai Academic City Campus (UAE)',
    date: 'October 12, 2026',
    author: 'Dean of Technology & Innovation',
    summary: 'Over 80 international student teams across Dubai, Riyadh, and Manama qualified for the autonomous robotics finals.',
    content: 'Students from Kindergarten through Grade 12 showcased breakthroughs in autonomous rover navigation, computer vision, and environmental sensor pods. The finals will be hosted at the Dubai Innovation Dome with live streaming to all sister campuses across Saudi Arabia, Bahrain, and Kuwait.',
    coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    cover_image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    featured: true
  },
  {
    id: 'news-2',
    title: 'Riyadh Campus Unveils High-Speed Clean Air Biometric Pods',
    category: 'Campus Facilities',
    campus: 'Riyadh Elite Academy (Saudi Arabia)',
    date: 'October 08, 2026',
    author: 'Campus Operations Directorate',
    summary: 'Sub-second optical thumb scanners installed across all 6 campus gates to ensure instant and secure time-in & time-out.',
    content: 'The new biometric stations log attendance in under 0.3 seconds and automatically sync with the Parent Portal app, sending real-time peace-of-mind alerts without any friction or paperwork.',
    coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    cover_image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    featured: true
  },
  {
    id: 'news-3',
    title: 'Bahrain Campus Celebrates 45+ Nationalities in Annual Global Heritage Day',
    category: 'Culture & Arts',
    campus: 'Manama Capital Campus (Bahrain)',
    date: 'September 28, 2026',
    author: 'Student Council Leadership',
    summary: 'Students presented cultural exhibits, folklore dance, and international cuisine representing their home countries.',
    content: 'With students hailing from over 45 nations—including Emirati, Saudi, British, Indian, Egyptian, and Canadian backgrounds—the campus transformed into a vibrant cultural showcase of unity and shared learning.',
    coverImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    cover_image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    featured: false
  },
  {
    id: 'news-4',
    title: 'Kuwait City Leadership Center Launches Space Science Observatory',
    category: 'Academic Excellence',
    campus: 'Kuwait City International School (Kuwait)',
    date: 'September 19, 2026',
    author: 'Astronomy & Physics Faculty',
    summary: 'Equipped with a 24-inch robotic telescope for celestial observation and planetary data science.',
    content: 'Secondary school students can now observe solar flares and lunar topographies in high definition, linking directly with space agency databases across the Arabian Gulf.',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    cover_image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    featured: false
  }
];


// Student Food & Nutrition Menu (GCC School Week: Sun - Thu)
const INITIAL_MENU = [
  {
    day: 'Sunday',
    theme: 'Mediterranean Sun & Vitality',
    breakfast: {
      dish: 'Fluffy Scrambled Eggs with Feta, Zaatar Croissant & Fresh Berries',
      calories: 340,
      protein: '18g',
      allergens: ['Dairy', 'Gluten', 'Eggs'],
      drink: 'Cold-Pressed Orange Juice / Fresh Laban'
    },
    snack: {
      dish: 'Organic Medjool Dates with Almond Slivers & Crisp Green Apples',
      calories: 160
    },
    lunch: {
      dish: 'Herb-Roasted Boneless Chicken Breast with Tricolor Quinoa & Roasted Zucchini',
      calories: 520,
      protein: '42g',
      carbs: '48g',
      halalCertified: true,
      vegetarianAlternative: 'Grilled Halloumi & Roasted Vegetable Quinoa Bowl',
      allergens: ['Halal Certified', 'Nut-Free Main']
    }
  },
  {
    day: 'Monday',
    theme: 'Traditional Arabian Gulf Flavors',
    breakfast: {
      dish: 'Warm Shakshouka with Crumbled Goat Cheese & Fresh Whole-Grain Pita',
      calories: 360,
      protein: '19g',
      allergens: ['Dairy', 'Gluten', 'Eggs'],
      drink: 'Minted Cucumber Infusion / Camel Milk Laban'
    },
    snack: {
      dish: 'Crunchy Carrot & Cucumber Batons with Creamy Chickpea Hummus',
      calories: 140
    },
    lunch: {
      dish: 'Traditional Slow-Cooked Chicken Mandi with Fragrant Saffron Basmati & Dakous Sauce',
      calories: 580,
      protein: '38g',
      carbs: '62g',
      halalCertified: true,
      vegetarianAlternative: 'Fragrant Vegetable & Lentil Biryani with Mint Raita',
      allergens: ['Halal Certified', 'Nut-Free Main']
    }
  },
  {
    day: 'Tuesday',
    theme: 'Italian Garden Freshness',
    breakfast: {
      dish: 'Baked Oats with Chia Seeds, Cinnamon, Wild Honey & Sliced Peaches',
      calories: 310,
      protein: '14g',
      allergens: ['Gluten-Free Oats Available', 'Nut-Free'],
      drink: 'Fresh Strawberry-Banana Smoothie'
    },
    snack: {
      dish: 'Baked Pita Chips with Guacamole & Cherry Tomatoes',
      calories: 150
    },
    lunch: {
      dish: 'Whole-Wheat Penne Primavera with Grilled Turkey Strips in Rich Basil Marinara',
      calories: 490,
      protein: '35g',
      carbs: '55g',
      halalCertified: true,
      vegetarianAlternative: 'Penne Primavera with Oven-Charred Buffalo Mozzarella',
      allergens: ['Dairy', 'Gluten', 'Halal Certified']
    }
  },
  {
    day: 'Wednesday',
    theme: 'Levantine Charcoal Grill',
    breakfast: {
      dish: 'Pressed Labneh & Mint Wrap in Saj Bread with Persian Cucumbers & Kalamata Olives',
      calories: 290,
      protein: '15g',
      allergens: ['Dairy', 'Gluten'],
      drink: 'Pomegranate & Hibiscus Herbal Cooler'
    },
    snack: {
      dish: 'Steamed Edamame Pods with Himalayan Pink Salt',
      calories: 120
    },
    lunch: {
      dish: 'Tender Chicken Shish Tawook Skewers with Vermicelli Brown Rice & Tossed Fattoush',
      calories: 540,
      protein: '40g',
      carbs: '50g',
      halalCertified: true,
      vegetarianAlternative: 'Crisp Baked Falafel Platters with Tahini & Tabouleh',
      allergens: ['Halal Certified', 'Sesame']
    }
  },
  {
    day: 'Thursday',
    theme: 'Pan-Asian Wellness & Celebration',
    breakfast: {
      dish: 'Coconut & Mango Chia Pudding with Toasted Coconut Flakes & Dragonfruit',
      calories: 280,
      protein: '11g',
      allergens: ['Dairy-Free', 'Gluten-Free', 'Vegan'],
      drink: 'Matcha & Pear Light Cooler'
    },
    snack: {
      dish: 'Watermelon Wedges & Sweet Rockmelon Cubes',
      calories: 90
    },
    lunch: {
      dish: 'Sweet Teriyaki Glazed Atlantic Salmon with Steamed Jasmine Rice & Broccoli Florets',
      calories: 510,
      protein: '39g',
      carbs: '46g',
      halalCertified: true,
      vegetarianAlternative: 'Crispy Sesame Glazed Tofu & Vegetable Rice Bowl',
      allergens: ['Fish', 'Soy', 'Halal Certified']
    }
  }
];

export const PARENT_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&h=200&q=80'
];

export function generateParents(studentsList = []) {
  const parents = [];
  const source = studentsList.length > 0 ? studentsList : generateStudents();
  const map = new Map();
  source.forEach((st, idx) => {
    if (!map.has(st.parentName)) {
      map.set(st.parentName, {
        id: `PRN-${4000 + map.size + 1}`,
        name: st.parentName,
        phone: st.parentPhone,
        email: st.parentEmail,
        country: st.country,
        countryCode: st.countryCode,
        campus: st.campus,
        nationality: st.nationality,
        avatar: PARENT_AVATARS[map.size % PARENT_AVATARS.length],
        studentId: st.id,
        studentName: st.name,
        studentGrade: st.grade,
        relationship: idx % 3 === 0 ? 'Mother' : idx % 3 === 1 ? 'Father' : 'Legal Guardian',
        notificationsEnabled: true,
        preferredChannel: idx % 2 === 0 ? 'WhatsApp & SMS' : 'SMS Only',
        verified: true
      });
    }
  });
  return Array.from(map.values());
}

export {
  GCC_COUNTRIES,
  NATIONALITIES,
  GRADES,
  SECTIONS,
  SUBJECTS,
  generateTeachers,
  generateStudents,
  INITIAL_NEWS,
  INITIAL_MENU
};

