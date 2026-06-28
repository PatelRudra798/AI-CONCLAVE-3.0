export const EVENT_DATE = new Date('2026-07-10T08:00:00+05:30');

export const NAV_LINKS = [
  { label: 'About', id: 'about' },
  { label: 'Topics', id: 'topics' },
  { label: 'Schedule', id: 'schedule' },
  { label: 'Workshops', id: 'workshops' },
  { label: 'Speakers', id: 'speakers' },
  { label: 'Sponsors', id: 'sponsors' },
  { label: 'Get Badge', id: 'badge-section' },
  { label: 'Register', id: 'registration' },
];

export const HERO_STATS = [
  { num: '500+', label: 'Participants' },
  { num: '10+', label: 'Expert Speakers' },
  { num: '2', label: 'Workshops' },
  { num: '1', label: 'Day Event' },
];

export const TOPICS = [
  { shape: 'robot_head', title: 'Agentic AI', desc: 'Autonomous agents, AI workflows, multi-agent systems, and intelligent automation at scale.', color: 'rgba(57,255,143,0.10)' },
  { shape: 'lightning', title: 'High Performance Computing', desc: 'GPU acceleration, parallel processing, computational infrastructure, and AI scaling.', color: 'rgba(57,255,143,0.14)' },
  { shape: 'cloud', title: 'Distributed Computing', desc: 'Cloud systems, distributed architectures, edge computing, and modern scalability.', color: 'rgba(15,122,69,0.18)' },
  { shape: 'satellite', title: 'AI in Space Applications', desc: 'Satellite analytics, autonomous missions, and intelligent space systems.', color: 'rgba(124,255,184,0.10)' },
  { shape: 'film', title: 'Multimedia Data Processing', desc: 'Computer vision, speech processing, image analytics, and content understanding.', color: 'rgba(34,196,110,0.14)' },
  { shape: 'medical_cross', title: 'Robotics in Healthcare', desc: 'Medical robotics, AI-assisted diagnosis, healthcare automation, and smart systems.', color: 'rgba(57,255,143,0.08)' },
];

export const SCHEDULE = [
  {
    time: '08:00 AM',
    end: '08:30 AM',
    name: 'Registration & Check-In',
    desc: 'Collect your badge, welcome kit, and settle in.',
    icon: '🎫',
    badge: null,
    special: false,
    track: 'logistics',
  },
  {
    time: '08:30 AM',
    end: '09:15 AM',
    name: 'Breakfast & Networking',
    desc: 'Fuel up and connect with fellow participants before the sessions begin.',
    icon: '☕',
    badge: 'break',
    special: false,
    track: 'break',
  },
  {
    time: '09:30 AM',
    end: '09:45 AM',
    name: 'Inauguration Ceremony',
    desc: 'Official opening by faculty, IEEE chapter leads, and guest dignitaries.',
    icon: '🎙️',
    badge: 'opening',
    special: true,
    track: 'keynote',
  },
  {
    time: '09:50 AM',
    end: '10:40 AM',
    name: 'Technical Session 1',
    desc: 'Expert keynote on Agentic AI systems and autonomous workflow design.',
    icon: '🤖',
    badge: 'keynote',
    special: true,
    track: 'keynote',
    speaker: 'Dr. Speaker Name',
  },
  {
    time: '10:50 AM',
    end: '11:40 AM',
    name: 'Technical Session 2',
    desc: 'Deep dive into High Performance Computing and GPU architectures for AI.',
    icon: '⚡',
    badge: 'keynote',
    special: true,
    track: 'keynote',
    speaker: 'Speaker Name',
  },
  {
    time: '11:50 AM',
    end: '01:15 PM',
    name: 'Workshop 1 — AI Agents',
    desc: 'Hands-on: Build an intelligent agent that automates real-world workflows.',
    icon: '🧠',
    badge: 'workshop',
    special: false,
    track: 'workshop',
  },
  {
    time: '01:30 PM',
    end: '02:30 PM',
    name: 'Lunch Break',
    desc: 'Enjoy lunch and continue networking with speakers and participants.',
    icon: '🍽️',
    badge: 'break',
    special: false,
    track: 'break',
  },
  {
    time: '02:40 PM',
    end: '03:30 PM',
    name: 'Workshop 2 — HPC Fundamentals',
    desc: 'Hands-on: GPU programming, parallel computing, and AI infrastructure.',
    icon: '💻',
    badge: 'workshop',
    special: false,
    track: 'workshop',
  },
  {
    time: '03:40 PM',
    end: '04:20 PM',
    name: 'Panel Discussion',
    desc: 'Open Q&A with experts — AI futures, ethics, careers, and entrepreneurship.',
    icon: '🎤',
    badge: 'panel',
    special: true,
    track: 'keynote',
  },
  {
    time: '04:25 PM',
    end: '04:35 PM',
    name: 'Closing Note',
    desc: 'Reflections, acknowledgements, and what comes next.',
    icon: '🏆',
    badge: null,
    special: true,
    track: 'logistics',
  },
  {
    time: '04:40 PM',
    end: '05:00 PM',
    name: 'Swag Distribution',
    desc: 'Collect your exclusive event merchandise and certificate.',
    icon: '🎁',
    badge: null,
    special: false,
    track: 'logistics',
  },
  {
    time: '05:00 PM',
    end: '05:30 PM',
    name: 'Networking & Hi-Tea',
    desc: 'Wind down with hi-tea, meet speakers, exchange contacts, and celebrate.',
    icon: '🤝',
    badge: null,
    special: false,
    track: 'break',
  },
];

export const WORKSHOPS = [
  {
    num: '01', tag: 'Agentic AI', accent: 'cyan',
    title: 'Building Intelligent AI Agents',
    desc: 'Learn how modern AI agents work and how they can automate real-world workflows. Build autonomous pipelines from scratch with expert guidance.',
    items: ['Practical Learning', 'Guided Exercises', 'Expert Mentorship', 'Certificate Included'],
  },
  {
    num: '02', tag: 'HPC', accent: 'purple',
    title: 'Intro to High Performance Computing',
    desc: 'Explore parallel computing, GPUs, and large-scale AI infrastructure. Understand how modern AI systems are built and scaled at production level.',
    items: ['GPU Programming Basics', 'Parallel Architecture', 'Hands-On Labs', 'Certificate Included'],
  },
];

export const SPEAKERS = [
  {
    initials: 'AI',
    grad: 'from-accent2 to-accent',
    name: 'Dr. Speaker Name',
    role: 'Sr. AI Research Scientist',
    org: 'Research Institute',
    topic: 'Future of Agentic AI Systems',
    bio: 'Leading researcher with 12+ years in autonomous AI systems, published in Nature AI and NeurIPS. Formerly at DeepMind.',
    skills: ['Agentic AI', 'LLMs', 'AutoML'],
    linkedin: 'https://linkedin.com/in/speaker1',
  },
  {
    initials: 'HPC',
    grad: 'from-accent to-accent2-light',
    name: 'Speaker Name',
    role: 'Principal HPC Engineer',
    org: 'Tech Company',
    topic: 'GPU Acceleration & AI Scale',
    bio: 'Expert in massively parallel GPU workloads with 10+ years building distributed training infrastructure for billion-parameter models.',
    skills: ['CUDA', 'Distributed Training', 'MLOps'],
    linkedin: 'https://linkedin.com/in/speaker2',
  },
  {
    initials: 'SP',
    grad: 'from-accent2-light to-accent2',
    name: 'Prof. Speaker Name',
    role: 'Director of AI Research',
    org: 'University',
    topic: 'Multimedia Signal Processing',
    bio: 'Award-winning professor with 200+ citations. Pioneer in multimodal AI for video and speech understanding.',
    skills: ['Computer Vision', 'Speech AI', 'Signal Processing'],
    linkedin: 'https://linkedin.com/in/speaker3',
  },
  {
    initials: 'DC',
    grad: 'from-[color:var(--accent-dim)] to-accent',
    name: 'Speaker Name',
    role: 'Cloud Architect',
    org: 'Cloud Company',
    topic: 'Distributed AI Systems',
    bio: 'Architect behind cloud-native AI platforms serving 50M+ daily requests. Expert in fault-tolerant distributed systems design.',
    skills: ['Kubernetes', 'Cloud AI', 'System Design'],
    linkedin: 'https://linkedin.com/in/speaker4',
  },
];

export const ACTIVITIES = [
  { icon: '⚡', title: 'Rapid Fire Challenge', desc: '60-second questions from speakers and experts. Fast, fun, and intellectually charged — test your AI knowledge under pressure.' },
  { icon: '📱', title: 'Social Media Contest', desc: 'Share your experience using the official hashtag on Instagram & LinkedIn. One winner gets a live feature and event merchandise.' },
  { icon: '🤝', title: 'Networking Session', desc: 'Meet professionals, speakers, startups, and peers. Build connections that lead to collaborations, internships, and opportunities.' },
  { icon: '🎤', title: 'Open Panel Discussion', desc: 'Ask questions directly to our expert panel — AI futures, industry trends, ethics, career guidance, and entrepreneurship.' },
];

export const REG_TIERS = [
  { type: 'IEEE Student', price: '150', symbol: '₹', note: 'IEEE Student Admission', featured: false, cta: 'Register →' },
  { type: 'Non-IEEE Student', price: '200', symbol: '₹', note: 'Non-IEEE Student Admission', featured: true, cta: 'Register →' },
  { type: 'Professional', price: '350', symbol: '₹', note: 'Industry Professional Admission', featured: false, cta: 'Register →' },
];


export const REG_INCLUDES = [
  'Event Access', 'Both Workshops', 'Breakfast & Lunch',
  'Hi-Tea', 'Certificate', 'Networking Access', 'Event Swag', 'Smart Digital Badge',
];

export const SPONSORS = [
  { name: 'TechCorp AI', initials: 'TC', url: '#' },
  { name: 'CloudNova', initials: 'CN', url: '#' },
  { name: 'NeuralSys', initials: 'NS', url: '#' },
  { name: 'DataBridge', initials: 'DB', url: '#' },
  { name: 'AeroAI', initials: 'AA', url: '#' },
  { name: 'QuantumEdge', initials: 'QE', url: '#' },
  { name: 'ByteForge', initials: 'BF', url: '#' },
  { name: 'IntelliPath', initials: 'IP', url: '#' },
  { name: 'CoreMatrix', initials: 'CM', url: '#' },
  { name: 'GridMind', initials: 'GM', url: '#' },
  { name: 'IEEE Gujarat', initials: 'IG', url: '#' },
  { name: 'Google DSC', initials: 'GD', url: '#' },
  { name: 'MLH', initials: 'MH', url: '#' },
  { name: 'ACM Student', initials: 'AC', url: '#' },
  { name: 'TechMahindra', initials: 'TM', url: '#' },
];

export const FAQS = [
  { q: 'Who can attend AI Conclave 3.0?', a: 'Students, researchers, professionals, and technology enthusiasts are all welcome. The event is designed for participants across different backgrounds and experience levels.' },
  { q: 'Do participants receive certificates?', a: 'Yes, all registered participants receive a participation certificate along with a QR-enabled smart digital ID card.' },
  { q: 'Is prior AI knowledge required?', a: 'No prior knowledge is required. Sessions and workshops are designed to accommodate learners from complete beginners to advanced practitioners.' },
  { q: 'Will meals be provided?', a: 'Yes. Breakfast, lunch, and hi-tea are included in all registration tiers at no extra cost.' },
  { q: 'How can I become a sponsor?', a: 'Contact the organizing committee at info@aiconclave.com. We offer Title, Platinum, Gold, Silver, and Community partnership tiers.' },
];

export const CONTACT_ITEMS = [
  { icon: '✉️', label: 'Email', value: 'info@aiconclave.com' },
  { icon: '📍', label: 'Venue', value: 'Silver Oak University, Ahmedabad' },
  { icon: '🗓️', label: 'Date', value: '10 July 2026' },
  { icon: '📞', label: 'Contact', value: '+91 XXXXX XXXXX' },
];
