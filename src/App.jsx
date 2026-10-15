import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import { 
  Github, Linkedin, Twitter, Search, Code2, Terminal, Cpu, Globe, 
  Palette, Database, ExternalLink, Menu, X, ChevronLeft, ChevronRight, Mail, 
  Trophy, Star, Zap, Layers, Rocket, Monitor, Server, Shield,
  Bot, User, ArrowRight, Activity, ToggleLeft, ToggleRight, Sun, Moon,
  ArrowLeft, MapPin, Calendar, GitCommit, Briefcase, Loader, RotateCw,
  Home, Users, Send, MessageSquare, Image, Handshake, Award, ClipboardList,
  Crown, Gem, Coffee, Sparkles, Quote, Atom, Cloud, Box, Brain,
  Bell, Radio, Building2, GraduationCap, Network, Wifi, CheckCircle2,
  UserMinus, UserCheck, Target, Flame, Hammer, Eye, Images, Milestone, Trees, Medal
} from 'lucide-react';

// --- CUSTOM LOGO COMPONENT ---
const SolutionDevelopersLogo = ({ className }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    className={className}
    role="img"
    aria-label="Golden Soluper's Logo"
  >
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FCD34D" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Stylized 'S' Monogram for Solution Developers */}
    {/* Top Curve */}
    <path 
      fill="url(#goldGradient)" 
      d="M70 20 H30 C18 20 8 30 8 42 C8 54 18 60 25 60 H60 V50 H30 C25 50 20 46 20 42 C20 36 25 30 30 30 H70 C76 30 80 34 80 40 V50 H92 V40 C92 28 82 20 70 20 Z" 
      filter="url(#glow)"
    />
    {/* Bottom Curve */}
    <path 
      fill="url(#goldGradient)" 
      d="M30 80 H70 C82 80 92 70 92 58 C92 46 82 40 75 40 H40 V50 H70 C75 50 80 54 80 58 C80 64 75 70 70 70 H30 C24 70 20 66 20 60 V50 H8 V60 C8 72 18 80 30 80 Z" 
      filter="url(#glow)"
    />
    
    {/* Central Hexagon Accent */}
    <path 
        fill="url(#goldGradient)" 
        d="M50 42 L57 46 V54 L50 58 L43 54 V46 Z"
        opacity="0.9"
    />
  </svg>
);

// --- GLOBAL STYLES (Custom Scrollbar & Animations) ---
const GlobalStyles = ({ theme }) => {
  const scrollColor = theme === 'bot' ? '#22c55e' : (theme === 'light' ? '#d97706' : '#f59e0b');
  const trackColor = theme === 'bot' ? '#000000' : (theme === 'light' ? '#f1f5f9' : '#0f172a');

  return (
    <style>{`
      ::-webkit-scrollbar {
        width: 8px;
      }
      ::-webkit-scrollbar-track {
        background: ${trackColor}; 
      }
      ::-webkit-scrollbar-thumb {
        background: ${scrollColor}; 
        border-radius: 4px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: ${theme === 'bot' ? '#16a34a' : '#d97706'}; 
      }
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      
      @keyframes gradient-x {
        0%, 100% {
          background-size: 200% 200%;
          background-position: left center;
        }
        50% {
          background-size: 200% 200%;
          background-position: right center;
        }
      }
      .animate-gradient-x {
        animation: gradient-x 3s ease infinite;
      }
      
      @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .animate-marquee {
        animation: marquee 30s linear infinite;
      }
      
      .perspective-1000 {
        perspective: 1000px;
      }
      .preserve-3d {
        transform-style: preserve-3d;
      }
      
      /* 3D Rotation Animation for Founders Note */
      @keyframes spin-3d {
        from { transform: rotateY(0deg); }
        to { transform: rotateY(-360deg); }
      }
      .animate-spin-3d {
        animation: spin-3d 25s linear infinite;
      }
      .pause-on-hover:hover {
        animation-play-state: paused;
      }
      .backface-hidden {
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
      }
      
      /* New Shimmer Animation for Loading Bar */
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }

      /* Radar Pulse Animation for Collabs */
      @keyframes radar-pulse {
        0% { transform: scale(1); opacity: 0.8; }
        100% { transform: scale(2); opacity: 0; }
      }
      .animate-radar {
        animation: radar-pulse 2s infinite ease-out;
      }
    `}</style>
  );
};

// --- MOCK DATA ---
// Added 'status' field: "Active" or "Past"
const SOLUPERS_DATA = [
  // Chief Lead Solupers
  {
    id: 9,
    name: "Hariom Sandve",
    role: "Founder & Chief Executive Lead",
    category: "Business & Strategy",
    status: "Active",
    roleGroup: "Chief Lead",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop",
    bio: "Driving the strategic vision and operational excellence of the collective. Focusing on sustainable growth and partnerships.",
    location: "Pune, India",
    joined: "March 2021",
    commits: 500,
    projects: 10,
    skills: [
        { name: "Strategy", level: 90 },
        { name: "Management", level: 85 },
        { name: "Operations", level: 88 },
        { name: "Growth", level: 92 }
    ],
    social: { github: "#", linkedin: "#", twitter: "#" },
    gradient: "from-amber-500 to-orange-600",
    featured: true,
    personalAchievements: [
        { title: "Startup of the Year", image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=400&auto=format&fit=crop", desc: "Recognized by Pune Innovation Hub." }
    ]
  },
  {
    id: 6,
    name: "Prem Gosawi",
    role: "Chief Technical Architect",
    category: "Backend",
    status: "Active",
    roleGroup: "Chief Lead",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop",
    bio: "Designing robust APIs that can handle millions of requests. Optimizing queries and ensuring 99.99% uptime.",
    location: "Google, Bangalore",
    joined: "July, 2024",
    commits: 3400,
    projects: 18,
    skills: [
        { name: "Go", level: 92 },
        { name: "PostgreSQL", level: 95 },
        { name: "Redis", level: 85 },
        { name: "Kafka", level: 80 }
    ],
    social: { github: "#", linkedin: "#", twitter: "#" },
    gradient: "from-indigo-500 to-purple-600",
    featured: true,
    personalAchievements: [
        { title: "Cloud Architect Cert", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop", desc: "Certified Solutions Architect Professional." }
    ]
  },
  // Lead Solupers
  {
    id: 7,
    name: "Sammed Chaugule",
    role: "President",
    category: "Mobile",
    status: "Active",
    roleGroup: "Lead",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    bio: "Bringing the desktop experience to your pocket. Expert in cross-platform development for iOS and Android.",
    location: "Meta, Bangalore",
    joined: "July 2025",
    commits: 650,
    projects: 9,
    skills: [
        { name: "Flutter", level: 95 },
        { name: "React Native", level: 85 },
        { name: "Swift", level: 70 },
        { name: "Firebase", level: 90 }
    ],
    social: { github: "#", linkedin: "#", twitter: "#" },
    gradient: "from-pink-500 to-rose-500",
    featured: false,
    personalAchievements: []
  },
  {
    id: 12,
    name: "Sneha Jadhav",
    role: "President",
    category: "Full Stack",
    status: "Active",
    roleGroup: "Lead",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
    bio: "Coordinating operations and leading strategic community initiatives globally.",
    location: "Mumbai, India",
    joined: "August 2025",
    commits: 450,
    projects: 12,
    skills: [
        { name: "Leadership", level: 95 },
        { name: "Management", level: 90 },
        { name: "Operations", level: 85 }
    ],
    social: { github: "#", linkedin: "#", twitter: "#" },
    gradient: "from-amber-400 to-yellow-500",
    featured: false,
    personalAchievements: []
  },
  {
    id: 13,
    name: "Pritee Badave",
    role: "Operational Lead",
    category: "DevOps",
    status: "Active",
    roleGroup: "Lead",
    image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=400&auto=format&fit=crop",
    bio: "Streamlining workflows and optimizing internal operational pipelines.",
    location: "Pune, India",
    joined: "September 2025",
    commits: 380,
    projects: 8,
    skills: [
        { name: "Operations", level: 92 },
        { name: "Agile", level: 88 },
        { name: "Communication", level: 90 }
    ],
    social: { github: "#", linkedin: "#", twitter: "#" },
    gradient: "from-yellow-500 to-amber-600",
    featured: false,
    personalAchievements: []
  },
  {
    id: 14,
    name: "Parth Chaudhari",
    role: "Technical Lead",
    category: "Full Stack",
    status: "Active",
    roleGroup: "Lead",
    image: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?q=80&w=400&auto=format&fit=crop",
    bio: "Spearheading engineering efforts, writing clean code, and shipping scalable products.",
    location: "Bangalore, India",
    joined: "July 2025",
    commits: 950,
    projects: 14,
    skills: [
        { name: "React", level: 90 },
        { name: "Node.js", level: 88 },
        { name: "System Design", level: 85 }
    ],
    social: { github: "#", linkedin: "#", twitter: "#" },
    gradient: "from-amber-500 to-yellow-500",
    featured: false,
    personalAchievements: []
  },
  {
    id: 8,
    name: "Avinash Ailwad",
    role: "Documentation Lead",
    category: "Security",
    status: "Active",
    roleGroup: "Lead",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    bio: "White hat hacker ensuring our solutions are bulletproof. Security first, always. Finding vulnerabilities before they do.",
    location: "Google, Singapore",
    joined: "June 2025",
    commits: 320,
    projects: 50,
    skills: [
        { name: "Pen Testing", level: 95 },
        { name: "OAuth", level: 90 },
        { name: "Cryptography", level: 85 },
        { name: "Auditing", level: 88 }
    ],
    social: { github: "#", linkedin: "#", twitter: "#" },
    gradient: "from-yellow-400 to-orange-500",
    featured: false,
    personalAchievements: []
  },
  {
    id: 5,
    name: "Riddhi Chaudhari",
    role: "Event Lead",
    category: "Frontend",
    status: "Active",
    roleGroup: "Lead",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    bio: "Pixel perfectionist. Building smooth, accessible web interfaces. Making the web look good on any device.",
    location: "Cognizant, Kolkata",
    joined: "July 2025",
    commits: 780,
    projects: 12,
    skills: [
        { name: "Vue.js", level: 90 },
        { name: "React", level: 85 },
        { name: "WebGL", level: 75 },
        { name: "GSAP", level: 80 }
    ],
    social: { github: "#", linkedin: "#", twitter: "#" },
    gradient: "from-cyan-400 to-blue-600",
    featured: false,
    personalAchievements: []
  },
  {
    id: 15,
    name: "Dipali Gundgal",
    role: "Legal Lead",
    category: "Security",
    status: "Active",
    roleGroup: "Lead",
    image: "https://images.unsplash.com/photo-1580894732444-8fecef2271ff?q=80&w=400&auto=format&fit=crop",
    bio: "Overseeing compliance, legal frameworks, and community governance guidelines.",
    location: "Delhi, India",
    joined: "October 2025",
    commits: 150,
    projects: 4,
    skills: [
        { name: "Governance", level: 95 },
        { name: "Compliance", level: 90 },
        { name: "Drafting", level: 88 }
    ],
    social: { github: "#", linkedin: "#", twitter: "#" },
    gradient: "from-yellow-500 to-amber-500",
    featured: false,
    personalAchievements: []
  },
  {
    id: 16,
    name: "Omkar Bhagepalle",
    role: "Accountability Lead",
    category: "Backend",
    status: "Active",
    roleGroup: "Lead",
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=400&auto=format&fit=crop",
    bio: "Tracking community contributions, project quality control, and ensuring operational transparency.",
    location: "Hyderabad, India",
    joined: "September 2025",
    commits: 410,
    projects: 6,
    skills: [
        { name: "Quality Control", level: 90 },
        { name: "Management", level: 85 },
        { name: "Tracking", level: 88 }
    ],
    social: { github: "#", linkedin: "#", twitter: "#" },
    gradient: "from-amber-600 to-yellow-500",
    featured: false,
    personalAchievements: []
  },
  {
    id: 17,
    name: "Rohan Vyavhare",
    role: "Media Lead",
    category: "Design",
    status: "Active",
    roleGroup: "Lead",
    image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=400&auto=format&fit=crop",
    bio: "Managing public relations, content creation, brand design, and community marketing.",
    location: "Mumbai, India",
    joined: "October 2025",
    commits: 320,
    projects: 15,
    skills: [
        { name: "Content Creation", level: 92 },
        { name: "Design", level: 90 },
        { name: "PR", level: 85 }
    ],
    social: { github: "#", linkedin: "#", twitter: "#" },
    gradient: "from-amber-500 to-yellow-500",
    featured: false,
    personalAchievements: []
  },
  {
    id: 18,
    name: "Kaveri Jadhav",
    role: "Project & Research Lead",
    category: "AI & Data",
    status: "Active",
    roleGroup: "Lead",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=400&auto=format&fit=crop",
    bio: "Coordinating technical research papers and managing community development projects.",
    location: "Pune, India",
    joined: "August 2025",
    commits: 600,
    projects: 10,
    skills: [
        { name: "Research", level: 92 },
        { name: "Data Science", level: 85 },
        { name: "Python", level: 88 }
    ],
    social: { github: "#", linkedin: "#", twitter: "#" },
    gradient: "from-amber-500 to-yellow-400",
    featured: false,
    personalAchievements: []
  },

  // Past Solupers Directory
  {
    id: 1,
    name: "Tasnim Chaugule",
    role: "Operational Lead",
    category: "Full Stack & AI/ML",
    status: "Past",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
    bio: "Architecting scalable solutions and mentoring the next generation of devs. Obsessed with clean code and distributed systems.",
    location: "Microsoft, Bangalore",
    joined: "March 2021",
    commits: 1240,
    projects: 5,
    skills: [
      { name: "React", level: 95 },
      { name: "Node.js", level: 90 },
      { name: "AWS", level: 85 },
      { name: "TypeScript", level: 92 },
      { name: "LLMs", level: 88 }
    ],
    social: { github: "#", linkedin: "#", twitter: "#" },
    gradient: "from-amber-500 to-yellow-400",
    featured: false,
    personalAchievements: [
      { title: "Smart India Hackathon Winner", image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?q=80&w=400&auto=format&fit=crop", desc: "Led the team to victory in SIH 2023." },
      { title: "Best Paper Award", image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=400&auto=format&fit=crop", desc: "Research on AI ethics published in IEEE." }
    ]
  },
  {
    id: 10,
    name: "Vaibhav Gangurde",
    role: "Project & Research Lead",
    category: "Full Stack",
    status: "Past",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop",
    bio: "Technical visionary ensuring our architecture scales. Passionate about bleeding-edge tech and developer experience.",
    location: "Nashik, India",
    joined: "March 2021",
    commits: 1100,
    projects: 12,
    skills: [
        { name: "System Arch", level: 95 },
        { name: "Cloud", level: 90 },
        { name: "Security", level: 85 },
        { name: "DevOps", level: 88 }
    ],
    social: { github: "#", linkedin: "#", twitter: "#" },
    gradient: "from-red-500 to-rose-600",
    featured: false,
    personalAchievements: [
        { title: "Open Source Contributor", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=400&auto=format&fit=crop", desc: "Top 1% contributor on GitHub in 2024." }
    ]
  },
  {
    id: 2,
    name: "Ragini Waghmare",
    role: "Co-Founder & Technical Director",
    category: "AI & Data",
    status: "Past",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
    bio: "Turning data into actionable intelligence. Specialist in NLP and computer vision models. Building the brain of the future.",
    location: "IBM, Hyderabad",
    joined: "July 2023",
    commits: 890,
    projects: 8,
    skills: [
        { name: "Python", level: 98 },
        { name: "PyTorch", level: 85 },
        { name: "TensorFlow", level: 80 },
        { name: "Data Pipelines", level: 90 }
    ],
    social: { github: "#", linkedin: "#", twitter: "#" },
    gradient: "from-purple-500 to-pink-500",
    featured: false,
    personalAchievements: [
        { title: "AI Summit Speaker", image: "https://images.unsplash.com/photo-1475721027767-p42f56b2327b?q=80&w=400&auto=format&fit=crop", desc: "Keynote on Future of NLP." }
    ]
  },
  {
    id: 3,
    name: "Laxmi Doke",
    role: "Full Stack Developer",
    category: "Design",
    status: "Past",
    image: "https://images.unsplash.com/photo-1598550874175-4d7112ee7f64?q=80&w=400&auto=format&fit=crop",
    bio: "Believes that good design is invisible. Master of Figma and Motion. Crafting experiences that delight users.",
    location: "Infosys, Mysuru",
    joined: "July 2025",
    commits: 450,
    projects: 22,
    skills: [
        { name: "Figma", level: 95 },
        { name: "Tailwind", level: 90 },
        { name: "Motion", level: 85 },
        { name: "Prototyping", level: 88 }
    ],
    social: { github: "#", linkedin: "#", twitter: "#" },
    gradient: "from-orange-400 to-red-500",
    featured: false,
    personalAchievements: []
  },
  {
    id: 4,
    name: "Durva Shinde",
    role: "DevOps Specialist",
    category: "DevOps",
    status: "Past",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    bio: "Keeping the servers humming. Automation is my love language. If you have to do it twice, automate it.",
    location: "TCS, Mumbai",
    joined: "July 2025",
    commits: 2100,
    projects: 40,
    skills: [
        { name: "Docker", level: 95 },
        { name: "Kubernetes", level: 85 },
        { name: "CI/CD", level: 90 },
        { name: "Terraform", level: 80 }
    ],
    social: { github: "#", linkedin: "#", twitter: "#" },
    gradient: "from-emerald-400 to-green-600",
    featured: false,
    personalAchievements: []
  },
  {
    id: 11,
    name: "Alex River",
    role: "Former UI Designer",
    category: "Design",
    status: "Past",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
    bio: "Contributed to the initial design system before moving on to start their own studio.",
    location: "Remote",
    joined: "Jan 2020",
    commits: 120,
    projects: 3,
    skills: [
        { name: "Sketch", level: 90 },
        { name: "CSS", level: 95 }
    ],
    social: { github: "#", linkedin: "#", twitter: "#" },
    gradient: "from-gray-500 to-gray-700",
    featured: false,
    personalAchievements: []
  }
];

const FOUNDERS_NOTES = [
  {
    name: "Hariom Sandve",
    role: "Founder & Chief Executive Lead",
    quote: "Strategy is not about being different. It's about being better. We define the path, then we pave it.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "Prem Gosawi",
    role: "Chief Technical Architect",
    quote: "Reliability is our currency. We build systems that stand the test of time and scale.",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "Sammed Chaugule",
    role: "President",
    quote: "Bringing clean architecture to mobile devices. High performance, native execution, and fluid user experiences drive our mobile vision.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "Sneha Jadhav",
    role: "President",
    quote: "Operations and leadership are about enabling others. We synchronize our talents to build something greater than ourselves.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "Riddhi Chaudhari",
    role: "Event Lead",
    quote: "Events build communities. We bring developers together to share knowledge, collaborate, and push the limits of technology.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "Parth Chaudhari",
    role: "Technical Lead",
    quote: "Writing clean, scalable code is an art. We craft engineering solutions that solve complex real-world problems.",
    image: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "Avinash Ailwad",
    role: "Documentation Lead",
    quote: "Excellent engineering requires impeccable documentation. We capture knowledge to enable seamless collaboration and growth.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "Pritee Badave",
    role: "Operational Lead",
    quote: "Operations keep the collective synchronized and running smoothly. We streamline workflows to build efficiently.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400&auto=format&fit=crop"
  }
];

const NOTICES = [
  { 
    id: 1, 
    type: 'Urgent', 
    date: 'Oct 24', 
    title: 'Hackathon Registration Closing', 
    desc: 'Final call for the AI Innovation Summit. Teams must submit proposals by Friday.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop'
  },
  { 
    id: 2, 
    type: 'System', 
    date: 'Oct 22', 
    title: 'v2.4 Deployment Successful', 
    desc: 'Performance optimizations are now live. API latency reduced by 40%. All clusters report normal health.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop'
  },
  { 
    id: 3, 
    type: 'Event', 
    date: 'Oct 20', 
    title: 'Community Meetup', 
    desc: 'Join us this Friday at the Tech Hub for a deep dive session on Distributed Systems and Rust.',
    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=600&auto=format&fit=crop'
  },
];

const LEADERSHIP_TIMELINE = [
    { 
      year: "Era III President (July 2026 - Dec 2026)", 
      leader: "Sammed Chaugule & Sneha Jadhav", 
      role: "President", 
      desc: "Current Presidents of Era III, leading the collective through new administrative expansion, mobile innovation, and community milestones." 
    },
    { 
      year: "Era II President (Jan 2026 - June 2026)", 
      leader: "Prem Gosawi & Ragini Waghmare", 
      role: "President", 
      desc: "Presidents of Era II, spearheading technological excellence, operational scaling, and core system modernization." 
    },
    { 
      year: "Era I President (July 2025 - Dec 2025)", 
      leader: "Hariom Sandve", 
      role: "President", 
      desc: "Founder and President of Era I, establishing the strategic foundation and visionary blueprint for Solution Developers." 
    }
];

const PROJECTS = [
  {
    title: "Edu-Advisory",
    desc: "AI-driven educational counseling platform helping students choose the right career path.",
    tags: ["React", "Python", "LLMs"],
    icon: <Database className="w-6 h-6" />
  },
  {
    title: "Digi-Traffic",
    desc: "Smart city traffic management system using IoT sensors and real-time computer vision.",
    tags: ["Python", "IoT", "TensorFlow"],
    icon: <Zap className="w-6 h-6" />
  },
  {
    title: "DevForge CLI",
    desc: "A developer tool that scaffolds production-ready microservices in seconds.",
    tags: ["Go", "Rust", "Docker"],
    icon: <Terminal className="w-6 h-6" />
  }
];

const GALLERY_DATA = {
  achievements: [
    {
      id: "sih-2024",
      title: "Smart India Hackathon 2024 Winners",
      desc: "Secured 1st Place in Smart Automation category for our real-time smart agriculture optimizer.",
      date: "Dec 2024",
      location: "New Delhi, India",
      badge: "🏆 1st Place",
      cover: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
      photos: [
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop"
      ],
      sizeClass: "md:col-span-2 md:row-span-2",
      icon: "trophy"
    },
    {
      id: "best-startup-2025",
      title: "Best Student Startup Award",
      desc: "Honored with the 'Best Student Startup' award by the Ministry of Technology for community engineering.",
      date: "Mar 2025",
      location: "Bangalore, India",
      badge: "🥇 National Award",
      cover: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop",
      photos: [
        "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop"
      ],
      sizeClass: "md:col-span-1 md:row-span-1",
      icon: "medal"
    },
    {
      id: "ai-summit-2025",
      title: "Global AI Summit Finalists",
      desc: "Selected among the top 10 student teams globally to pitch agentic AI solutions at the Global AI Summit.",
      date: "May 2025",
      location: "Virtual / Singapore",
      badge: "🚀 Finalist",
      cover: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
      photos: [
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop"
      ],
      sizeClass: "md:col-span-1 md:row-span-2",
      icon: "award"
    },
    {
      id: "gala-2025",
      title: "Decade Gala & Celebration",
      desc: "An evening honoring our seniors, alumni, and major milestones with awards and team tributes.",
      date: "June 2025",
      location: "Grand Palace Lounge",
      badge: "🎉 Celebration",
      cover: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop",
      photos: [
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1505232458627-a72726f5b710?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=800&auto=format&fit=crop"
      ],
      sizeClass: "md:col-span-2 md:row-span-1",
      icon: "cheers"
    },
    {
      id: "hack-victory-2025",
      title: "Inter-College Hackathon Winners",
      desc: "Won first prize for DevForge CLI, an automated microservices project setup tool.",
      date: "Oct 2025",
      location: "COEP Pune",
      badge: "🏆 1st Place",
      cover: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop",
      photos: [
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"
      ],
      sizeClass: "md:col-span-1 md:row-span-1",
      icon: "trophy"
    }
  ],
  surveys: [
    {
      id: "campus-tech-survey-2025",
      title: "Campus Tech Needs Survey",
      desc: "Conducted field interviews and quantitative data collection from over 1,200 students to identify software bugs in college portals.",
      date: "Jan 2025",
      location: "Main Campus Hub",
      badge: "📊 Survey",
      cover: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
      photos: [
        "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1531498860502-7c67cf02f6ac?q=80&w=800&auto=format&fit=crop"
      ],
      sizeClass: "md:col-span-2 md:row-span-2",
      icon: "clipboard"
    },
    {
      id: "factory-visit-2025",
      title: "Industry 4.0 Readiness Audit",
      desc: "Collaborated with local small scale manufacturing units to analyze automation readiness and compile production efficiency statistics.",
      date: "Feb 2025",
      location: "MIDC Industrial Area",
      badge: "🏭 Audit",
      cover: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
      photos: [
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop"
      ],
      sizeClass: "md:col-span-1 md:row-span-1",
      icon: "building"
    },
    {
      id: "outreach-2025",
      title: "Outreach: Coding for Kids",
      desc: "Spent a weekend teaching basic programming logic, block structures, and web development fundamentals to underprivileged students.",
      date: "Apr 2025",
      location: "Community Center",
      badge: "📸 Outreach",
      cover: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
      photos: [
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=800&auto=format&fit=crop"
      ],
      sizeClass: "md:col-span-1 md:row-span-2",
      icon: "users"
    },
    {
      id: "sysdesign-workshop-2025",
      title: "System Design Masterclass",
      desc: "Held a deep-dive technical whiteboard workshop on database partitioning, client-server load balancing, and cache layers.",
      date: "Aug 2025",
      location: "Newton Seminar Room",
      badge: "🎓 Workshop",
      cover: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop",
      photos: [
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop"
      ],
      sizeClass: "md:col-span-2 md:row-span-1",
      icon: "book"
    },
    {
      id: "outdoors-meeting-2025",
      title: "Annual Team Retreat",
      desc: "Recharged away from the laptops with outdoor team-building games, hiking, and casual fireside brain-storming.",
      date: "Nov 2025",
      location: "Lonavala Eco Resort",
      badge: "⛺ Retreat",
      cover: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=800&auto=format&fit=crop",
      photos: [
        "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800&auto=format&fit=crop"
      ],
      sizeClass: "md:col-span-1 md:row-span-1",
      icon: "tree"
    }
  ]
};

const COLLABORATIONS = [
  { 
    id: 1,
    name: "TechCorp Inc.", 
    type: "Industry Partner", 
    desc: "Joint research on AI pipelines and distributed computing architectures.",
    status: "Active",
    stats: "3 Joint Patents",
    icon: Building2,
    color: "blue"
  },
  { 
    id: 2,
    name: "OpenSource Alliance", 
    type: "Community", 
    desc: "Strategic contribution partnership to support critical open web infrastructure.",
    status: "Forever",
    stats: "1.2k Commits",
    icon: Globe,
    color: "green"
  },
  { 
    id: 3,
    name: "Future University", 
    type: "Academic", 
    desc: "Providing internship opportunities and syllabus consultancy for CS streams.",
    status: "Seasonal",
    stats: "50+ Interns",
    icon: GraduationCap,
    color: "purple"
  },
  { 
    id: 4,
    name: "CloudSystems", 
    type: "Infrastructure", 
    desc: "Sponsoring our high-performance computing clusters for ML training.",
    status: "Sponsor",
    stats: "$10k Credits",
    icon: Cloud,
    color: "cyan"
  }
];

const ACHIEVEMENTS = [
  { label: "Projects Shipped", value: "50+", icon: <Rocket className="w-6 h-6" /> },
  { label: "Hackathons Won", value: "12", icon: <Trophy className="w-6 h-6" /> },
  { label: "Lines of Code", value: "1.2M", icon: <Code2 className="w-6 h-6" /> },
  { label: "Contributors", value: "85", icon: <Globe className="w-6 h-6" /> },
];

const CATEGORIES = ["All", "Full Stack", "Frontend", "Backend", "AI & Data", "Design", "DevOps", "Mobile", "Security"];

// --- STYLING UTILS ---

const useTheme = () => {
  const [theme, setTheme] = useState('light'); 
  const toggleTheme = () => setTheme(prev => {
    if (prev === 'light') return 'dark';
    if (prev === 'dark') return 'bot';
    return 'light'; 
  });
  return { theme, toggleTheme };
};

// --- BASE COMPONENTS ---

const SectionTitle = ({ title, subtitle, align = "center", theme }) => (
  <div className={`mb-16 ${align === "left" ? "text-left" : "text-center"} relative z-10`}>
    <h2 className={`text-4xl md:text-5xl font-black mb-4 tracking-tight 
      ${theme === 'bot' ? 'text-green-400 font-mono uppercase' : (theme === 'light' ? 'text-slate-900' : 'text-white')}`}>
      {theme === 'bot' && <span className="mr-2 text-green-600 blink">&gt;</span>}
      {title}
      <span className={theme === 'bot' ? 'text-green-600' : 'text-amber-500'}>{theme === 'bot' ? '_' : '.'}</span>
    </h2>
    <div className={`h-1.5 w-24 rounded-full ${align === "center" ? "mx-auto" : ""} ${theme === 'bot' ? 'bg-green-700 h-0.5' : 'bg-gradient-to-r from-amber-600 to-yellow-400'}`}></div>
    {subtitle && <p className={`mt-6 max-w-2xl mx-auto text-lg 
      ${theme === 'bot' ? 'text-green-600/80 font-mono text-sm' : (theme === 'light' ? 'text-slate-600' : 'text-slate-400')}`}>
      {subtitle}</p>}
  </div>
);

const RevealOnScroll = ({ children, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`transition-all duration-1000 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className}`}>
      {children}
    </div>
  );
};

// --- ENHANCED BUTTON COMPONENT ---
const Button = ({ children, variant = 'primary', icon: Icon, theme, className = "", onClick, ...props }) => {
  const baseStyles = "relative px-6 py-3 font-bold transition-all duration-300 ease-out flex items-center justify-center gap-2 group cursor-pointer active:scale-95 focus:outline-none tracking-wide overflow-hidden";
  
  const lightStyles = {
    primary: "bg-slate-900 text-white rounded-xl shadow-[0_10px_20px_-5px_rgba(15,23,42,0.3)] hover:shadow-[0_20px_30px_-5px_rgba(15,23,42,0.4)] hover:-translate-y-1",
    secondary: "bg-white text-slate-700 border border-slate-200 rounded-xl shadow-sm hover:border-amber-500 hover:text-amber-600 hover:shadow-lg",
    outline: "border-2 border-slate-300 text-slate-600 hover:border-amber-600 hover:text-amber-600 rounded-lg bg-transparent"
  };

  const darkStyles = {
    primary: "bg-gradient-to-r from-amber-600 to-yellow-500 text-white rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:shadow-[0_0_35px_rgba(245,158,11,0.8)] border border-white/10 hover:-translate-y-1",
    secondary: "bg-slate-800/80 backdrop-blur-md text-white border border-slate-700 rounded-xl hover:bg-slate-700 hover:border-yellow-500 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]",
    outline: "border-2 border-slate-600 text-slate-400 hover:border-white hover:text-white rounded-lg bg-transparent"
  };

  const botStyles = {
    primary: "bg-green-500 text-black border-2 border-green-400 rounded-none uppercase font-mono shadow-[0_0_15px_rgba(34,197,94,0.6)] hover:bg-green-400 hover:shadow-[0_0_30px_rgba(34,197,94,1)]",
    secondary: "bg-black text-green-500 border-2 border-green-800 rounded-none font-mono uppercase hover:border-green-500 hover:text-green-400 hover:shadow-[inset_0_0_15px_rgba(34,197,94,0.4)]",
    outline: "border border-green-800 text-green-800 hover:text-green-500 hover:border-green-500 rounded-none font-mono uppercase bg-transparent"
  };

  let styles = lightStyles;
  if (theme === 'dark') styles = darkStyles;
  if (theme === 'bot') styles = botStyles;

  let selectedStyle = variant === 'primary' ? styles.primary : (variant === 'secondary' ? styles.secondary : styles.outline);

  return (
    <button className={`${baseStyles} ${selectedStyle} ${className}`} onClick={onClick} {...props}>
      {(theme !== 'bot' && variant === 'primary') && (
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />
      )}
      
      {theme === 'bot' && (
        <span className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}

      <span className="relative z-10 flex items-center gap-2">
        {children}
        {Icon && <Icon className={`w-4 h-4 transition-transform duration-300 group-hover:translate-x-1`} />}
      </span>
    </button>
  );
};

// --- FEATURE COMPONENTS ---

const LoadingScreen = ({ theme, onComplete, toggleTheme }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Organic loading simulation with random acceleration
    let current = 0;
    const interval = setInterval(() => {
      // Random increment between 1 and 5
      const increment = Math.random() * 4 + 1;
      current += increment;
      
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
            setIsFading(true);
            setTimeout(onComplete, 800); 
        }, 600);
      }
      setProgress(current);
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Dynamic Glamorous Gradients based on Theme
  const getBarGradient = () => {
    if (theme === 'bot') return 'bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.6)]';
    if (theme === 'light') return 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]';
    return 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 shadow-[0_0_20px_rgba(252,211,77,0.6)]';
  };

  const getTextColor = () => {
    if (theme === 'bot') return 'text-emerald-400';
    if (theme === 'light') return 'text-slate-800';
    return 'text-white';
  };

  const bgClass = theme === 'bot' ? 'bg-black' : (theme === 'light' ? 'bg-slate-50' : 'bg-slate-950');

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-1000 ${bgClass} ${isFading ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'}`}>
      
      {/* Theme Toggle in Corner */}
      <button onClick={toggleTheme} className={`absolute top-8 right-8 p-3 rounded-full transition-all duration-300 z-[110] flex items-center gap-2 group backdrop-blur-md border ${theme === 'bot' ? 'bg-black/50 border-green-500/30 text-green-500' : 'bg-white/10 border-slate-500/20 text-slate-500'}`}>
        <span className="text-[10px] font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute right-full mr-3 whitespace-nowrap">SWITCH MODE</span>
        {theme === 'bot' && <Bot className="w-5 h-5" />}
        {theme === 'light' && <Sun className="w-5 h-5" />}
        {theme === 'dark' && <Moon className="w-5 h-5" />}
      </button>

      <div className="w-full max-w-lg px-8 relative flex flex-col items-center">
        
        {/* Logo Container with Ambient Glow */}
        <div className="relative mb-16 group">
           <div className={`absolute -inset-10 opacity-20 group-hover:opacity-40 transition-opacity duration-1000 blur-3xl rounded-full ${theme === 'bot' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
           <img 
             src="/my-logo.png" 
             alt="Solution Developers Logo" 
             className="relative w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl animate-pulse" 
           />
        </div>

        {/* Typography */}
        <div className="text-center mb-10 space-y-2">
          <h2 className={`text-4xl md:text-5xl font-black tracking-tighter ${getTextColor()}`}>
            SOLUTION <span className="opacity-50">DEVELOPERS</span>
          </h2>
          <div className="flex items-center justify-center gap-3 opacity-60">
            <span className={`h-[1px] w-8 ${theme === 'bot' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
            <p className={`text-xs font-mono tracking-[0.4em] uppercase ${getTextColor()}`}>
              {theme === 'bot' ? 'INITIALIZING...' : 'INNOVATING FUTURE'}
            </p>
            <span className={`h-[1px] w-8 ${theme === 'bot' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
          </div>
        </div>

        {/* GLAMOROUS LOADING BAR */}
        <div className="w-full relative">
            {/* Percentage Float */}
            <div 
                className={`absolute -top-8 transition-all duration-100 ease-out font-mono font-bold text-xs ${getTextColor()}`}
                style={{ left: `calc(${progress}% - 12px)` }}
            >
                {Math.round(progress)}%
            </div>

            {/* Bar Container (Glass Effect) */}
            <div className={`h-2 w-full rounded-full overflow-hidden backdrop-blur-xl border ${theme === 'bot' ? 'bg-emerald-900/20 border-emerald-500/20' : 'bg-slate-200/50 border-white/50'}`}>
                {/* The Progress Fill */}
                <div 
                    className={`h-full relative transition-all duration-200 ease-out rounded-full ${getBarGradient()}`} 
                    style={{ width: `${progress}%` }}
                >
                    {/* Shimmer Effect Overlay */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]"></div>
                    
                    {/* Leading Glow Head */}
                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-white box-shadow-[0_0_10px_white] blur-[2px]"></div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

const Background3D = ({ theme }) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', (e) => {
      mouseRef.current = { x: e.clientX - canvas.width / 2, y: e.clientY - canvas.height / 2 };
    });

    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      scrollRef.current = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
    });

    const cubes = Array.from({ length: 40 }, () => ({
      x: (Math.random() - 0.5) * canvas.width * 1.5,
      y: (Math.random() - 0.5) * canvas.height * 1.5,
      z: Math.random() * 800 + 200,
      size: Math.random() * 40 + 20,
      vx: 0,
      vy: 0,
      vz: 0,
      baseVx: (Math.random() - 0.5) * 0.3,
      baseVy: (Math.random() - 0.5) * 0.3,
      baseVz: (Math.random() - 0.5) * 0.3,
      rotX: Math.random() * Math.PI,
      rotY: Math.random() * Math.PI,
      vRotX: (Math.random() - 0.5) * 0.02,
      vRotY: (Math.random() - 0.5) * 0.02
    }));

    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.16 + 0.04
    }));

    const project = (x, y, z) => {
      const scale = 800 / (800 + z);
      return { x: x * scale + canvas.width / 2, y: y * scale + canvas.height / 2, scale };
    };

    const rotate = (a, b, angle) => ({ a: a * Math.cos(angle) - b * Math.sin(angle), b: a * Math.sin(angle) + b * Math.cos(angle) });

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const strokeColor = theme === 'bot' ? '34, 197, 94' : (theme === 'light' ? '217, 119, 6' : '245, 158, 11');

      // Draw drifting particles background layer
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.fillStyle = `rgba(${strokeColor}, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      cubes.forEach(cube => {
        // Apply ambient base velocity + active dynamic velocity
        cube.x += cube.vx + cube.baseVx;
        cube.y += cube.vy + cube.baseVy;
        cube.z += cube.vz + cube.baseVz;
        
        // Interactions
        const dx = cube.x - mouseRef.current.x * 1.5;
        const dy = cube.y - mouseRef.current.y * 1.5;
        if (Math.sqrt(dx*dx + dy*dy) < 400) {
            cube.vx += (dx / 400) * 0.8;
            cube.vy += (dy / 400) * 0.8;
        }
        if (Math.abs(scrollRef.current) > 0.1) {
            cube.vy -= scrollRef.current * 0.15;
        }

        cube.rotX += cube.vRotX;
        cube.rotY += cube.vRotY;

        // Apply friction to dynamic velocity only
        cube.vx *= 0.95;
        cube.vy *= 0.95;
        cube.vz *= 0.95;

        // Wrap around boundaries dynamically
        const boundX = canvas.width * 1.2;
        const boundY = canvas.height * 1.2;

        if (cube.x > boundX) cube.x = -boundX;
        else if (cube.x < -boundX) cube.x = boundX;

        if (cube.y > boundY) cube.y = -boundY;
        else if (cube.y < -boundY) cube.y = boundY;

        if (cube.z > 1200) cube.z = 100;
        else if (cube.z < 100) cube.z = 1200;

        const s = cube.size;
        const vertices = [
          {x:-s, y:-s, z:-s}, {x:s, y:-s, z:-s}, {x:s, y:s, z:-s}, {x:-s, y:s, z:-s},
          {x:-s, y:-s, z:s},  {x:s, y:-s, z:s},  {x:s, y:s, z:s},  {x:-s, y:s, z:s}
        ].map(v => {
            let r = rotate(v.y, v.z, cube.rotX); let vy = r.a, vz = r.b;
            r = rotate(v.x, vz, cube.rotY); let vx = r.a; vz = r.b;
            return project(vx + cube.x, vy + cube.y, vz + cube.z);
        });

        ctx.beginPath();
        const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
        const distFromCenter = Math.sqrt(cube.x * cube.x + cube.y * cube.y);
        const maxDist = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height) * 0.5;
        const centerFade = Math.min(1, distFromCenter / (maxDist || 1));
        const opacity = Math.max(0.02, (1 - cube.z/1200) * 0.24 * centerFade);
        ctx.strokeStyle = `rgba(${strokeColor}, ${opacity})`;
        ctx.lineWidth = 1.5 * vertices[0].scale;
        edges.forEach(e => { ctx.moveTo(vertices[e[0]].x, vertices[e[0]].y); ctx.lineTo(vertices[e[1]].x, vertices[e[1]].y); });
        ctx.stroke();
      });
      scrollRef.current *= 0.9;
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [theme]);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0 blur-[0.8px]" />;
};

const DevBot = ({ theme }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ type: 'bot', text: 'Hello! I am DevBot. How can I assist you today?' }]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages(prev => [...prev, { type: 'user', text: input }]);
        setInput("");
        setTimeout(() => {
            let botText = "I'm focusing on the code right now. Contact the team for more info!";
            if (input.toLowerCase().includes('hire') || input.toLowerCase().includes('contact')) botText = "You can reach us via the Contact form below or email us directly at hello@solutiondevs.com";
            else if (input.toLowerCase().includes('tech')) botText = "We specialize in React, Node.js, Python, Go, and Cloud Native technologies.";
            setMessages(prev => [...prev, { type: 'bot', text: botText }]);
        }, 800);
    };

    const containerClass = theme === 'bot' ? 'bg-black border-green-500' : (theme === 'light' ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900 border-slate-700 shadow-xl');
    const textClass = theme === 'bot' ? 'text-green-500 font-mono' : (theme === 'light' ? 'text-slate-800' : 'text-white');

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen && (
                <div className={`mb-4 w-80 h-96 rounded-2xl border flex flex-col overflow-hidden ${containerClass}`}>
                    <div className={`p-4 border-b flex justify-between items-center ${theme === 'bot' ? 'border-green-800 bg-green-900/20' : 'border-slate-700/50 bg-slate-800/50'}`}>
                        <span className={`font-bold flex items-center gap-2 ${textClass}`}><Bot className="w-5 h-5" /> DevBot AI</span>
                        <button onClick={() => setIsOpen(false)} className={textClass}><X className="w-4 h-4"/></button>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto space-y-3">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.type === 'user' ? (theme === 'bot' ? 'bg-green-900/50 text-green-400 border border-green-700' : 'bg-amber-600 text-white') : (theme === 'bot' ? 'bg-black border border-green-800 text-green-500' : (theme === 'light' ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-300'))}`}>{msg.text}</div>
                            </div>
                        ))}
                    </div>
                    <div className="p-3 border-t border-slate-700/50 flex gap-2">
                        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Type a message..." className={`flex-1 bg-transparent border-none outline-none text-sm ${textClass}`} />
                        <button onClick={handleSend} className={theme === 'bot' ? 'text-green-500' : 'text-amber-500'}><Send className="w-4 h-4" /></button>
                    </div>
                </div>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className={`p-4 rounded-full shadow-lg transition-transform hover:scale-110 ${theme === 'bot' ? 'bg-black border border-green-500 text-green-500' : 'bg-amber-600 text-white'}`}>
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </button>
        </div>
    );
};

const TechTicker = ({ theme }) => {
    const techItems = [
      { name: "React", icon: Atom },
      { name: "Node.js", icon: Server },
      { name: "Python", icon: Terminal },
      { name: "AWS", icon: Cloud },
      { name: "Docker", icon: Box },
      { name: "Kubernetes", icon: Layers },
      { name: "Go", icon: Code2 },
      { name: "Rust", icon: Shield },
      { name: "TensorFlow", icon: Brain },
      { name: "Figma", icon: Palette },
      { name: "Next.js", icon: Zap },
      { name: "GraphQL", icon: Database }
    ];

    return (
        <div className={`w-full py-6 overflow-hidden border-y backdrop-blur-sm ${theme === 'bot' ? 'bg-black/50 border-green-900' : (theme === 'light' ? 'bg-white/50 border-slate-200' : 'bg-slate-900/50 border-slate-800')}`}>
            <div className="flex animate-marquee whitespace-nowrap">
                {[...techItems, ...techItems, ...techItems].map((item, i) => {
                    const Icon = item.icon;
                    return (
                        <div key={i} className="mx-8 flex items-center gap-2 group">
                             <Icon className={`w-6 h-6 ${theme === 'bot' ? 'text-green-500' : (theme === 'light' ? 'text-amber-600' : 'text-amber-400')} transition-transform group-hover:scale-110`} />
                             <span className={`text-lg font-bold uppercase tracking-wider ${theme === 'bot' ? 'text-green-500/70 font-mono' : (theme === 'light' ? 'text-slate-500' : 'text-slate-400')}`}>
                                {item.name}
                             </span>
                             <span className={`text-xs ml-2 ${theme === 'bot' ? 'text-green-900' : 'text-slate-700/20'}`}>•</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};// --- NEW COMPONENT: NOTICE SECTION ---
const NoticeSection = ({ theme }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % NOTICES.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + NOTICES.length) % NOTICES.length);
  };

  const activeNotice = NOTICES[activeIndex];

  const getTagColor = (type) => {
    if (type === 'Urgent') return theme === 'bot' ? 'border-red-900 bg-red-950/40 text-red-400' : 'bg-red-100 text-red-600 border-red-200';
    if (type === 'System') return theme === 'bot' ? 'border-amber-900 bg-amber-950/40 text-amber-400' : 'bg-amber-100 text-amber-600 border-amber-200';
    return theme === 'bot' ? 'border-green-900 bg-green-950/40 text-green-400' : 'bg-green-100 text-green-600 border-green-200';
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 relative z-20">
      <h3 className={`mb-6 text-sm font-bold uppercase tracking-widest flex items-center justify-center lg:justify-start gap-2 ${theme === 'bot' ? 'text-green-500 font-mono' : (theme === 'light' ? 'text-slate-500' : 'text-slate-400')}`}>
         <Radio className={`w-4 h-4 ${theme === 'bot' ? 'animate-pulse' : ''}`} /> {theme === 'bot' ? "SYSTEM_BROADCAST" : "Broadcast Feed"}
      </h3>
      <div className={`rounded-3xl overflow-hidden border flex flex-col transition-all duration-500 h-[280px] relative ${
        theme === 'bot' 
          ? 'bg-black border-green-900 rounded-none shadow-[0_0_15px_rgba(34,197,94,0.1)]' 
          : (theme === 'light' ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900/60 border-slate-800 shadow-2xl')
      }`}>
        <div className="relative flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Card Image */}
          <div className="w-full md:w-2/5 h-28 md:h-full relative overflow-hidden bg-slate-800 flex-shrink-0">
            <img 
              src={activeNotice.image} 
              alt={activeNotice.title} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 to-transparent"></div>
          </div>

          {/* Card Details */}
          <div className="flex-1 p-5 flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className={`text-[9px] px-2 py-0.5 rounded border font-bold uppercase tracking-wider ${getTagColor(activeNotice.type)}`}>
                  {activeNotice.type}
                </span>
                <span className={`text-[10px] ${theme === 'bot' ? 'text-green-700 font-mono' : 'text-slate-500'}`}>
                  {activeNotice.date}
                </span>
              </div>
              
              <h4 className={`text-sm font-bold mb-2 line-clamp-2 ${theme === 'bot' ? 'text-green-400 font-mono' : (theme === 'light' ? 'text-slate-900' : 'text-white')}`}>
                {activeNotice.title}
              </h4>
              
              <p className={`text-xs leading-relaxed line-clamp-4 ${theme === 'bot' ? 'text-green-800 font-mono' : (theme === 'light' ? 'text-slate-600' : 'text-slate-400')}`}>
                {activeNotice.desc}
              </p>
            </div>

            {/* Navigation and Indicators */}
            <div className="flex items-center justify-between pt-3 mt-auto border-t border-slate-200/10">
              {/* Dot Indicators */}
              <div className="flex gap-1.5">
                {NOTICES.map((_, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveIndex(idx)} 
                    className={`h-1.5 transition-all duration-300 rounded-full ${
                      idx === activeIndex 
                        ? (theme === 'bot' ? 'w-4 bg-green-500' : 'w-4 bg-amber-500') 
                        : (theme === 'bot' ? 'w-1.5 bg-green-900' : 'w-1.5 bg-slate-600')
                    }`}
                  />
                ))}
              </div>

              {/* Arrow Buttons */}
              <div className="flex gap-1.5">
                <button 
                  onClick={handlePrev} 
                  className={`p-1.5 rounded-full border transition-all ${
                    theme === 'bot' 
                      ? 'border-green-800 text-green-500 hover:border-green-500 hover:bg-green-950/30 rounded-none' 
                      : 'border-slate-700 text-slate-400 hover:text-amber-500 hover:border-amber-500 hover:bg-slate-800/40'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={handleNext} 
                  className={`p-1.5 rounded-full border transition-all ${
                    theme === 'bot' 
                      ? 'border-green-800 text-green-500 hover:border-green-500 hover:bg-green-950/30 rounded-none' 
                      : 'border-slate-700 text-slate-400 hover:text-amber-500 hover:border-amber-500 hover:bg-slate-800/40'
                  }`}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};// --- NEW COMPONENT: 3D FOUNDERS CAROUSEL ---
const FoundersCarousel = ({ theme }) => {
  const activeNotes = FOUNDERS_NOTES.filter(note => SOLUPERS_DATA.some(m => m.name === note.name && m.status === 'Active'));
  const count = activeNotes.length;
  
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const cardWidth = isTablet ? 165 : 200;
  const cardHeight = isTablet ? 135 : 150;
  const radius = isTablet ? 225 : 285;

  useEffect(() => {
    if (isMobile) {
      const timer = setInterval(() => {
        setActiveIndex(prev => (prev + 1) % count);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [isMobile, count]);

  if (isMobile) {
    return (
      <div className="w-full flex flex-col items-center justify-center relative z-20 px-4">
        <h3 className={`mb-6 text-sm font-bold uppercase tracking-widest flex items-center gap-2 ${theme === 'bot' ? 'text-green-500 font-mono' : (theme === 'light' ? 'text-slate-500' : 'text-slate-400')}`}>
           <Quote className="w-4 h-4" /> {theme === 'bot' ? "SOLUPERS_LOGS" : "Solupers' Notes"}
        </h3>
        <div className="w-full max-w-sm overflow-hidden relative pb-4">
          <div 
            className="flex transition-transform duration-500 ease-out" 
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {activeNotes.map((note, index) => {
              const soluper = SOLUPERS_DATA.find(m => m.name === note.name);
              const displayRole = soluper ? soluper.role : note.role;
              return (
                <div key={index} className="w-full flex-shrink-0 px-2">
                  <div className={`rounded-2xl p-5 border backdrop-blur-md flex flex-col justify-center h-[170px] text-left
                    ${theme === 'bot' ? 'bg-black/90 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : (theme === 'light' ? 'bg-white/95 border-slate-200 shadow-xl' : 'bg-slate-900/95 border-slate-700 shadow-2xl')}
                  `}>
                    <div className="flex items-center gap-3 mb-3">
                      <img src={note.image} alt={note.name} className={`w-10 h-10 rounded-full border-2 object-cover ${theme === 'bot' ? 'border-green-500' : 'border-amber-500'}`} />
                      <div>
                        <h4 className={`text-xs font-bold ${theme === 'bot' ? 'text-green-400' : (theme === 'light' ? 'text-slate-900' : 'text-white')}`}>{note.name}</h4>
                        <span className={`text-[10px] ${theme === 'bot' ? 'text-green-700 font-mono' : (theme === 'light' ? 'text-slate-500' : 'text-slate-400')}`}>{displayRole}</span>
                      </div>
                    </div>
                    <p className={`text-xs leading-relaxed italic ${theme === 'bot' ? 'text-green-600 font-mono' : (theme === 'light' ? 'text-slate-600' : 'text-slate-300')}`}>
                      "{note.quote}"
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-4 px-2">
            <button 
              onClick={() => setActiveIndex((activeIndex - 1 + count) % count)} 
              className={`p-1.5 rounded-full border transition-all ${theme === 'bot' ? 'border-green-800 text-green-500 rounded-none' : 'border-slate-800 text-slate-400 hover:text-amber-500'}`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            
            <div className="flex gap-1.5">
              {activeNotes.map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveIndex(idx)} 
                  className={`h-1.5 transition-all duration-300 rounded-full ${
                    idx === activeIndex 
                      ? (theme === 'bot' ? 'w-4 bg-green-500' : 'w-4 bg-amber-500') 
                      : (theme === 'bot' ? 'w-1.5 bg-green-900' : 'w-1.5 bg-slate-600')
                  }`}
                />
              ))}
            </div>
            
            <button 
              onClick={() => setActiveIndex((activeIndex + 1) % count)} 
              className={`p-1.5 rounded-full border transition-all ${theme === 'bot' ? 'border-green-800 text-green-500 rounded-none' : 'border-slate-800 text-slate-400 hover:text-amber-500'}`}
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3D Carousel view for Desktop / Tablet
  return (
    <div className="w-full h-[320px] perspective-1000 overflow-visible flex flex-col items-center justify-center relative z-20">
      <h3 className={`mb-8 text-sm font-bold uppercase tracking-widest flex items-center gap-2 ${theme === 'bot' ? 'text-green-500 font-mono' : (theme === 'light' ? 'text-slate-500' : 'text-slate-400')}`}>
         <Quote className="w-4 h-4" /> {theme === 'bot' ? "SOLUPERS_LOGS" : "Solupers' Notes"}
      </h3>
      {/* 3D Container */}
      <div 
        className="relative preserve-3d animate-spin-3d pause-on-hover cursor-pointer"
        style={{ width: `${cardWidth}px`, height: `${cardHeight}px` }}
      >
         {activeNotes.map((note, index) => {
            const soluper = SOLUPERS_DATA.find(m => m.name === note.name);
            const displayRole = soluper ? soluper.role : note.role;
            const angle = (360 / count) * index;
            return (
               <div 
                 key={index}
                 className={`absolute inset-0 rounded-2xl p-4 border backdrop-blur-md backface-hidden flex flex-col justify-center transition-all duration-300
                    ${theme === 'bot' ? 'bg-black/90 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : (theme === 'light' ? 'bg-white/95 border-slate-200 shadow-xl' : 'bg-slate-900/95 border-slate-700 shadow-2xl')}
                 `}
                 style={{
                    transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                    width: `${cardWidth}px`,
                    height: `${cardHeight}px`
                 }}
               >
                  <div className="flex items-center gap-3 mb-2 text-left">
                     <img src={note.image} alt={note.name} className={`w-9 h-9 rounded-full border border-2 object-cover ${theme === 'bot' ? 'border-green-500' : 'border-amber-500'}`} />
                     <div className="min-w-0">
                        <h4 className={`text-xs font-bold truncate ${theme === 'bot' ? 'text-green-400' : (theme === 'light' ? 'text-slate-900' : 'text-white')}`}>{note.name}</h4>
                        <span className={`text-[9px] block truncate ${theme === 'bot' ? 'text-green-700' : (theme === 'light' ? 'text-slate-500' : 'text-slate-400')}`}>{displayRole}</span>
                     </div>
                  </div>
                  <p className={`text-[11px] leading-relaxed italic text-left ${theme === 'bot' ? 'text-green-600 font-mono' : (theme === 'light' ? 'text-slate-600' : 'text-slate-300')}`}>
                    "{note.quote}"
                  </p>
               </div>
            );
         })}
      </div>
    </div>
  );
};

const MISSION_CARDS = [
  {
    title: "This is Not Just a Coding Club",
    desc: "We are not only a community of hackers, and we are not limited to software. House of Solupers is built for true innovation—where hardware meets software, physical engineering meets digital architecture, and execution matters more than a degree. There is no \"branch-ism\" here. Whether you study Civil Engineering, Computer Science, or any other discipline, this space is open to all. If you want to build and innovate, you belong here.",
    icon: Cpu,
    image: "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Mission",
    desc: "We want to give every innovator a real chance by providing the ecosystem they actually need to thrive. No gatekeeping, no institutional red tape, and no hand-holding. Just raw curiosity, hard work, and relentless execution. If you are stuck, ask. If you are learning, share. If you are building the future, showcase it. The idea is simple: learn by doing, solve real-world problems, and figure things out together.",
    icon: Target,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Vision",
    desc: "We see a borderless global hub where innovation feels natural and access is universal. A decentralized space where a beginner can start from scratch and a seasoned builder can launch a startup. Over time, House of Solupers will be more than just a tech community—it will be a global movement of independent thinkers and creators who don't just adapt to the future, but design it.",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Connect with Global Innovators",
    desc: "Stuck on a breaking bug, trying to calibrate a sensor, or need a sounding board for a wild product idea? Tap into a network that spans across institutions and borders. Whether you need a co-founder, a design review, or just a fresh perspective on complex engineering, you will find people here who are building, failing, and succeeding just like you.",
    icon: Globe,
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Want to Innovate without Limits?",
    desc: "Learning here isn't tied to a syllabus or a classroom. It’s about building projects that matter and pushing the boundaries of what's possible. Because we are entirely independent, you have the freedom to explore, experiment, and collaborate with tech enthusiasts from anywhere in the world, regardless of your academic background.",
    icon: Flame,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Fueled by Builders",
    desc: "When you are not grinding on a project, drop into the community to hang out, share ideas, talk about tech trends, or find your next teammate. House of Solupers is more than just a workspace; it’s a culture of ambitious students pushing each other to build something bigger than themselves.",
    icon: Hammer,
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop"
  }
];

const MissionSection = ({ theme }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.mission-goal-card');
      
      // Setup GSAP scroll-lock timeline with pinning
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${cards.length * 120}%`, // scroll space per card
          pin: true,
          scrub: 1, // smooth scroll-scrub
          anticipatePin: 1,
        }
      });

      // Animate card sequence sequentially
      cards.forEach((card, idx) => {
        if (idx === 0) {
          gsap.set(card, { opacity: 1, y: 0, scale: 1, pointerEvents: "auto" });
        } else {
          tl.fromTo(card, 
            { opacity: 0, y: 100, scale: 0.95 },
            { 
              opacity: 1, 
              y: 0, 
              scale: 1, 
              pointerEvents: "auto", 
              duration: 1 
            }, 
            idx * 1.5 - 0.3
          );
        }

        if (idx < cards.length - 1) {
          tl.to(card, {
            opacity: 0,
            y: -100,
            scale: 0.95,
            pointerEvents: "none",
            duration: 1
          }, (idx + 1) * 1.5 - 0.5);
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [theme]);

  const cardBgClass = theme === 'bot' 
    ? 'bg-black/90 border-green-950 text-green-500 rounded-none shadow-[0_0_25px_rgba(34,197,94,0.1)]' 
    : (theme === 'light' ? 'bg-white/95 border-amber-300 shadow-2xl shadow-amber-500/5 rounded-[32px]' : 'bg-slate-900/90 border-amber-500/25 shadow-2xl shadow-amber-500/5 rounded-[32px]');

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-transparent flex items-center justify-center overflow-hidden z-20">
      
      {/* Persistent Sticky Section Title */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center max-w-3xl px-6 pointer-events-none w-full z-30">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
          theme === 'bot' ? 'bg-green-950/40 text-green-500 border border-green-800' : 'bg-amber-100 text-amber-600 border border-amber-200'
        }`}>
          <Atom className="w-3.5 h-3.5 animate-spin" /> Our Core Philosophy
        </div>
        <h2 className={`text-3xl lg:text-4xl font-black tracking-tight ${
          theme === 'bot' ? 'text-green-500 font-mono' : 'text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-400'
        }`}>
          Our Mission, Together
        </h2>
      </div>

      {/* Card Reveal Showcase Box */}
      <div className="max-w-6xl mx-auto px-6 w-full h-[60vh] min-h-[480px] lg:h-[45vh] relative flex items-center justify-center mt-20 overflow-visible">
        {MISSION_CARDS.map((card, idx) => {
          const isEven = idx % 2 === 0;
          const Icon = card.icon;

          return (
            <div
              key={idx}
              className={`mission-goal-card absolute inset-x-0 p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center h-full w-full opacity-0 pointer-events-none border backdrop-blur-md transition-all duration-300 ${cardBgClass}`}
              style={{ willChange: "transform, opacity" }}
            >
              {/* Image Block: Left-Right Alternation */}
              <div className={`w-full h-[24vh] lg:h-full rounded-2xl overflow-hidden border shadow-md relative order-1 ${isEven ? 'lg:order-1' : 'lg:order-2'} ${
                theme === 'bot' ? 'border-green-900' : 'border-slate-200/10'
              }`}>
                <img 
                  src={card.image} 
                  alt={card.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              </div>

              {/* Text Block: Right-Left Alternation */}
              <div className={`space-y-4 lg:space-y-6 text-left flex flex-col justify-center order-2 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                    theme === 'bot' ? 'border-green-800 bg-green-950/40 text-green-400' : 'border-amber-200 bg-amber-50 text-amber-600'
                  }`}>
                    <Icon className="w-5 h-5 animate-pulse" />
                  </div>
                  <span className={`text-xs font-mono font-bold tracking-wider ${
                    theme === 'bot' ? 'text-green-600 font-mono' : 'text-amber-500'
                  }`}>
                    GOAL 0{idx + 1}
                  </span>
                </div>
                
                <h3 className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${
                  theme === 'bot' ? 'text-white font-mono' : (theme === 'light' ? 'text-slate-900' : 'text-white')
                }`}>
                  {card.title}
                </h3>
                
                <p className={`text-sm lg:text-base leading-relaxed ${
                  theme === 'bot' ? 'text-green-700 font-mono' : (theme === 'light' ? 'text-slate-600' : 'text-slate-400')
                }`}>
                  {card.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};

const ContactSection = ({ theme }) => {
    const inputClass = `w-full px-4 py-3 rounded-lg outline-none transition-all ${theme === 'bot' ? 'bg-black border border-green-800 text-green-500 placeholder-green-800 focus:border-green-500 font-mono' : (theme === 'light' ? 'bg-slate-50 border border-slate-200 text-slate-800 focus:border-indigo-500' : 'bg-slate-900 border border-slate-700 text-white focus:border-amber-500')}`;
    return (
        <div className={`py-20 px-6 ${theme === 'bot' ? 'bg-black border-t border-green-900' : (theme === 'light' ? 'bg-white border-t border-slate-200' : 'bg-slate-950 border-t border-slate-800')}`}>
            <div className="max-w-4xl mx-auto">
                <SectionTitle theme={theme} title="Initialize Contact" subtitle="Ready to start a project? Transmit your data." />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <input type="text" className={inputClass} placeholder="Name" />
                        <input type="email" className={inputClass} placeholder="Email" />
                        <textarea className={`${inputClass} h-32 resize-none`} placeholder="Message..."></textarea>
                        <Button theme={theme} variant="primary" className="w-full">{theme === 'bot' ? 'TRANSMIT_PACKET' : 'Send Message'}</Button>
                    </div>
                    <div className={`p-8 rounded-3xl border flex flex-col justify-center items-center text-center space-y-6 ${theme === 'bot' ? 'bg-black border-green-900' : (theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800')}`}>
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${theme === 'bot' ? 'bg-green-900/20 text-green-500' : 'bg-amber-600/10 text-amber-600'}`}><Mail className="w-8 h-8" /></div>
                        <div><h3 className={`text-xl font-bold mb-1 ${theme === 'bot' ? 'text-green-400 font-mono' : (theme === 'light' ? 'text-slate-900' : 'text-white')}`}>Direct Channel</h3><p className={theme === 'bot' ? 'text-green-700 font-mono' : 'text-slate-500'}>hello@solutiondevelopers.com</p></div>
                        <div className="flex gap-4"><Github className="w-6 h-6" /><Twitter className="w-6 h-6" /><Linkedin className="w-6 h-6" /></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LeadershipTimeline = ({ theme }) => {
    return (
        <div className={`mb-24 p-8 rounded-3xl border relative overflow-hidden ${theme === 'bot' ? 'bg-black/50 border-green-900 rounded-none' : (theme === 'light' ? 'bg-white/50 border-slate-200' : 'bg-slate-900/50 border-slate-800')}`}>
            <h3 className={`text-2xl font-bold mb-12 flex items-center gap-2 ${theme === 'bot' ? 'text-green-400 font-mono' : (theme === 'light' ? 'text-slate-900' : 'text-white')}`}><Activity className="w-6 h-6" /> Presidential Map</h3>
            <div className="relative">
                <div className={`absolute left-4 top-0 bottom-0 w-0.5 ${theme === 'bot' ? 'bg-green-900' : 'bg-slate-700'}`}></div>
                <div className="space-y-12">
                    {LEADERSHIP_TIMELINE.map((item, idx) => (
                        <div key={idx} className="relative pl-12">
                            <div className={`absolute left-[11px] top-1.5 w-3 h-3 rounded-full border-2 ${theme === 'bot' ? 'bg-black border-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-slate-900 border-amber-500'}`}></div>
                            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
                                <span className={`text-sm font-bold px-2 py-0.5 rounded ${theme === 'bot' ? 'bg-green-900/30 text-green-400 font-mono' : 'bg-amber-600/10 text-amber-500'}`}>{item.year}</span>
                                <h4 className={`text-lg font-bold ${theme === 'bot' ? 'text-white' : (theme === 'light' ? 'text-slate-900' : 'text-white')}`}>{item.leader}</h4>
                                <span className={`text-sm ${theme === 'bot' ? 'text-green-700' : 'text-slate-500'}`}>// {item.role}</span>
                            </div>
                            <p className={`${theme === 'bot' ? 'text-green-800 font-mono text-sm' : 'text-slate-400'}`}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const FoundersSection = ({ theme }) => {
    // Explicitly define the order
    const orderedNames = [
        "Hariom Sandve",
        "Tasnim Chaugule",
        "Sammed Chaugule",
        "Vaibhav Gangurde",
        "Prem Gosawi",
        "Ragini Waghmare",
        "Avinash Ailwad"
    ];

    // Filter SOLUPERS_DATA to get only active founders
    const founders = SOLUPERS_DATA.filter(m => orderedNames.includes(m.name) && m.status === 'Active');

    // Sort them exactly according to the orderedNames array
    founders.sort((a, b) => {
        return orderedNames.indexOf(a.name) - orderedNames.indexOf(b.name);
    });

    // Unified Styles for all Originators
    const cardClass = theme === 'bot' ? 'bg-black/90 border-green-500 rounded-none' : (theme === 'light' ? 'bg-white/90 border-amber-200 shadow-xl' : 'bg-slate-900/90 border-amber-500/50');
    const textClass = theme === 'bot' ? 'text-green-400 font-mono' : (theme === 'light' ? 'text-slate-900' : 'text-white');
    const subTextClass = theme === 'bot' ? 'text-green-700' : 'text-amber-500';

    return (
        <div className="mb-24">
             {/* --- THE ORIGINATORS --- */}
             <div className="flex items-end justify-between mb-8">
                 <h3 className={`text-2xl font-bold flex items-center gap-2 ${theme === 'bot' ? 'text-green-400 font-mono' : (theme === 'light' ? 'text-slate-900' : 'text-white')}`}>
                    <Crown className={`w-6 h-6 ${theme === 'bot' ? 'text-green-500' : 'text-amber-500'}`} /> 
                    The Originators
                 </h3>
             </div>
             
             {/* Single Grid for all Founders/Co-Founders */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
                 {founders.map(founder => (
                     <div key={founder.id} className={`p-8 border-2 flex flex-col items-center text-center gap-6 relative overflow-hidden group transition-all hover:scale-[1.02] ${cardClass}`}>
                         {theme !== 'bot' && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>}
                         <div className={`w-32 h-32 flex-shrink-0 rounded-full border-4 overflow-hidden shadow-lg ${theme === 'bot' ? 'border-green-500' : 'border-amber-400'}`}>
                             <img src={founder.image} alt={founder.name} className="w-full h-full object-cover bg-slate-800" />
                         </div>
                         <div className="relative z-10">
                             <h4 className={`text-2xl font-bold mb-2 ${textClass}`}>{founder.name}</h4>
                             <p className={`font-bold tracking-wide uppercase text-sm mb-4 ${subTextClass}`}>{founder.role}</p>
                             <p className={`text-sm leading-relaxed ${theme === 'bot' ? 'text-green-800' : 'text-slate-500'}`}>{founder.bio}</p>
                         </div>
                     </div>
                 ))}
             </div>
        </div>
    );
};

const SpotlightCard = ({ soluper, theme, onClick }) => (
  <div onClick={() => onClick(soluper)} className={`relative h-[26rem] overflow-hidden group cursor-pointer border ${theme === 'bot' ? 'rounded-none border-green-800 hover:border-green-500' : 'rounded-3xl border-transparent hover:border-white/20'}`}>
    {theme === 'bot' ? <div className="absolute inset-0 bg-black/80"><div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(34,197,94,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20"></div></div> : <div className={`absolute inset-0 bg-gradient-to-br ${soluper.gradient} opacity-90 transition-opacity duration-300 ${soluper.status === 'Past' || soluper.status === 'Alumni' ? 'grayscale opacity-70' : ''}`}></div>}
    
    <img src={soluper.image} alt={soluper.name} className={`absolute right-[-20px] bottom-[-20px] w-64 h-64 object-cover transform group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-500 opacity-80 mix-blend-overlay ${soluper.status === 'Past' || soluper.status === 'Alumni' ? 'grayscale' : ''}`} />
    
    <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
      <div className="flex justify-between items-start">
        <div className="flex gap-2">
            <span className={`px-3 py-1 backdrop-blur-md text-xs font-bold uppercase tracking-wider ${theme === 'bot' ? 'bg-green-900/50 text-green-400 border border-green-600 rounded-none' : 'bg-white/20 rounded-full text-white'}`}>Lead</span>
            {(soluper.status === 'Past' || soluper.status === 'Alumni') && (
                <span className={`px-3 py-1 backdrop-blur-md text-xs font-bold uppercase tracking-wider ${theme === 'bot' ? 'bg-gray-900/50 text-gray-400 border border-gray-600 rounded-none' : 'bg-black/40 rounded-full text-white/80'}`}>Past Soluper</span>
            )}
        </div>
        <div className={`p-2 transition-colors ${theme === 'bot' ? 'bg-green-900/30 text-green-400' : 'bg-white/10 rounded-full hover:bg-white/20'}`}><Star className={`w-5 h-5 ${theme === 'bot' ? 'text-green-500' : 'text-yellow-300 fill-yellow-300'}`} /></div>
      </div>
      <div>
        <h3 className={`text-3xl font-bold mb-1 ${theme === 'bot' ? 'text-green-400 font-mono' : 'text-white'}`}>{soluper.name}</h3>
        <p className={`font-medium mb-4 ${theme === 'bot' ? 'text-green-700 font-mono uppercase text-sm' : 'text-white/80'}`}>{soluper.role}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {soluper.skills.slice(0, 3).map((skill, i) => <span key={i} className={`text-xs font-semibold px-2 py-1 ${theme === 'bot' ? 'bg-green-900/20 text-green-500 border border-green-800 rounded-none font-mono' : 'bg-black/20 text-white/80 rounded'}`}>#{skill.name}</span>)}
        </div>
        <Button theme={theme} variant={theme === 'bot' ? 'outline' : 'secondary'} className="w-full text-center group-hover:bg-white group-hover:text-black">View Profile</Button>
      </div>
    </div>
  </div>
);

const DirectoryCard = ({ soluper, theme, onClick }) => {
  const getDesign = () => {
    const role = soluper.role.toLowerCase();
    const isPast = soluper.status === 'Past';
    
    if (isPast) {
      return {
        bg: theme === 'bot' 
          ? 'bg-black border-zinc-800 text-zinc-500 font-mono' 
          : 'bg-gradient-to-b from-zinc-900 via-neutral-900 to-black text-slate-350 shadow-[0_15px_30px_rgba(0,0,0,0.5)]',
        border: 'border-zinc-800/80',
        glow: 'shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]',
        badge: '🩶 Core Soluper',
        badgeColor: 'bg-zinc-800/30 border-zinc-700/50 text-zinc-400',
        accentColor: 'border-zinc-500/40',
        innerBorder: 'border-zinc-800/30'
      };
    }

    if (role.includes('founder') || role.includes('chief executive')) {
      return {
        bg: theme === 'bot' 
          ? 'bg-black border-red-600 text-red-500 font-mono shadow-[0_0_20px_rgba(220,38,38,0.25)]' 
          : 'bg-gradient-to-b from-red-950 via-red-900 to-rose-950 text-white shadow-[0_15px_35px_rgba(220,38,38,0.18)]',
        border: 'border-amber-500/50',
        glow: 'shadow-[inset_0_0_30px_rgba(245,158,11,0.18)]',
        badge: '👑 Founder',
        badgeColor: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
        accentColor: 'border-amber-400/70',
        innerBorder: 'border-amber-500/20'
      };
    }
    
    if (role.includes('architect')) {
      return {
        bg: theme === 'bot' 
          ? 'bg-black border-orange-500 text-orange-500 font-mono shadow-[0_0_20px_rgba(249,115,22,0.25)]' 
          : 'bg-gradient-to-b from-orange-950 via-amber-950 to-stone-900 text-white shadow-[0_15px_35px_rgba(249,115,22,0.15)]',
        border: 'border-yellow-500/50',
        glow: 'shadow-[inset_0_0_30px_rgba(234,179,8,0.18)]',
        badge: '🚀 Tech Architect',
        badgeColor: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400',
        accentColor: 'border-yellow-400/70',
        innerBorder: 'border-yellow-500/20'
      };
    }

    if (role.includes('president')) {
      return {
        bg: theme === 'bot' 
          ? 'bg-black border-red-500 text-red-500 font-mono shadow-[0_0_25px_rgba(239,68,68,0.25)]' 
          : 'bg-gradient-to-b from-red-950 via-red-900 to-rose-950 text-white shadow-[0_15px_35px_rgba(220,38,38,0.18)]',
        border: 'border-amber-500/50',
        glow: 'shadow-[inset_0_0_30px_rgba(245,158,11,0.18)]',
        badge: '👑 President',
        badgeColor: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
        accentColor: 'border-amber-400/70',
        innerBorder: 'border-amber-500/20'
      };
    }

    if (role.includes('technical lead')) {
      return {
        bg: theme === 'bot' 
          ? 'bg-black border-cyan-500 text-cyan-400 font-mono shadow-[0_0_20px_rgba(6,182,212,0.25)]' 
          : 'bg-gradient-to-b from-blue-950 via-slate-900 to-indigo-950 text-white shadow-[0_15px_35px_rgba(59,130,246,0.15)]',
        border: 'border-slate-400/50',
        glow: 'shadow-[inset_0_0_30px_rgba(148,163,184,0.18)]',
        badge: '🚀 Tech Lead',
        badgeColor: 'bg-slate-500/20 border-slate-400/40 text-slate-300',
        accentColor: 'border-slate-350/70 border-slate-300/70',
        innerBorder: 'border-slate-400/25'
      };
    }

    if (role.includes('operational')) {
      return {
        bg: theme === 'bot' 
          ? 'bg-black border-purple-500 text-purple-400 font-mono shadow-[0_0_20px_rgba(168,85,247,0.25)]' 
          : 'bg-gradient-to-b from-purple-950 via-fuchsia-950 to-indigo-950 text-white shadow-[0_15px_35px_rgba(168,85,247,0.15)]',
        border: 'border-pink-500/40',
        glow: 'shadow-[inset_0_0_30px_rgba(236,72,153,0.18)]',
        badge: '⚙️ Operational Lead',
        badgeColor: 'bg-pink-500/20 border-pink-500/40 text-pink-300',
        accentColor: 'border-pink-400/70',
        innerBorder: 'border-pink-500/20'
      };
    }

    if (role.includes('event')) {
      return {
        bg: theme === 'bot' 
          ? 'bg-black border-yellow-500 text-yellow-500 font-mono shadow-[0_0_20px_rgba(234,179,8,0.25)]' 
          : 'bg-gradient-to-b from-amber-950 via-yellow-950 to-stone-900 text-white shadow-[0_15px_35px_rgba(234,179,8,0.15)]',
        border: 'border-yellow-600/50',
        glow: 'shadow-[inset_0_0_30px_rgba(202,138,4,0.18)]',
        badge: '🎯 Event Lead',
        badgeColor: 'bg-yellow-600/20 border-yellow-500/40 text-yellow-400',
        accentColor: 'border-yellow-500/70',
        innerBorder: 'border-yellow-600/20'
      };
    }

    if (role.includes('documentation') || role.includes('marketing')) {
      return {
        bg: theme === 'bot' 
          ? 'bg-black border-green-500 text-green-400 font-mono shadow-[0_0_20px_rgba(34,197,94,0.25)]' 
          : 'bg-gradient-to-b from-emerald-950 via-green-950 to-stone-900 text-white shadow-[0_15px_35px_rgba(16,185,129,0.15)]',
        border: 'border-emerald-500/40',
        glow: 'shadow-[inset_0_0_30px_rgba(16,185,129,0.18)]',
        badge: '📄 Documentation Lead',
        badgeColor: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
        accentColor: 'border-amber-400/60',
        innerBorder: 'border-emerald-500/20'
      };
    }

    if (role.includes('media') || role.includes('project & research')) {
      return {
        bg: theme === 'bot' 
          ? 'bg-black border-purple-500 text-purple-400 font-mono shadow-[0_0_20px_rgba(168,85,247,0.25)]' 
          : 'bg-gradient-to-b from-purple-950 via-fuchsia-950 to-indigo-950 text-white shadow-[0_15px_35px_rgba(168,85,247,0.15)]',
        border: 'border-pink-500/40',
        glow: 'shadow-[inset_0_0_30px_rgba(236,72,153,0.18)]',
        badge: role.includes('media') ? '📢 Media Lead' : '🔬 Research Lead',
        badgeColor: 'bg-pink-500/20 border-pink-500/40 text-pink-300',
        accentColor: 'border-pink-400/70',
        innerBorder: 'border-pink-500/20'
      };
    }

    return {
      bg: theme === 'bot' 
        ? 'bg-black border-green-900 text-green-700 font-mono' 
        : 'bg-gradient-to-b from-zinc-900 via-stone-900 to-neutral-950 text-white shadow-[0_15px_30px_rgba(0,0,0,0.5)]',
      border: 'border-zinc-700/60',
      glow: 'shadow-[inset_0_0_25px_rgba(255,255,255,0.03)]',
      badge: `⭐ Lead`,
      badgeColor: 'bg-zinc-700/30 border-zinc-650/45 text-zinc-300',
      accentColor: 'border-zinc-500/60',
      innerBorder: 'border-zinc-700/20'
    };
  };

  const design = getDesign();

  return (
    <div 
      onClick={() => onClick(soluper)} 
      className={`relative p-5 pt-6 pb-5 cursor-pointer flex flex-col items-center justify-between overflow-hidden group transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1.5 active:scale-95 ${design.bg} ${design.border} ${design.glow} ${
        theme === 'bot' ? 'rounded-none border-[1.5px]' : 'rounded-3xl border-[1.5px] hover:shadow-[0_20px_45px_rgba(0,0,0,0.5)]'
      }`}
      style={{ height: '350px' }}
    >
      {/* Decorative Frame Layout (Apple / Luxury Style) */}
      {theme !== 'bot' && (
        <>
          {/* Golden/Silver Ornamental Corners */}
          <div className={`absolute top-3 left-3 w-3.5 h-3.5 border-t-[1.5px] border-l-[1.5px] ${design.accentColor} pointer-events-none z-10 transition-transform duration-500 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5`} />
          <div className={`absolute top-3 right-3 w-3.5 h-3.5 border-t-[1.5px] border-r-[1.5px] ${design.accentColor} pointer-events-none z-10 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5`} />
          <div className={`absolute bottom-3 left-3 w-3.5 h-3.5 border-b-[1.5px] border-l-[1.5px] ${design.accentColor} pointer-events-none z-10 transition-transform duration-500 group-hover:-translate-x-0.5 group-hover:translate-y-0.5`} />
          <div className={`absolute bottom-3 right-3 w-3.5 h-3.5 border-b-[1.5px] border-r-[1.5px] ${design.accentColor} pointer-events-none z-10 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:translate-y-0.5`} />

          {/* Double border inner box */}
          <div className={`absolute inset-3 border-[1.5px] ${design.innerBorder} rounded-[20px] pointer-events-none transition-all duration-500 group-hover:scale-[0.98]`} />
          
          {/* Radial Light glow / Radial background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_70%)] pointer-events-none opacity-40" />
          
          {/* High-end Metallic sheen hover effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_ease-out] pointer-events-none" />
        </>
      )}

      {/* Profile cut-out with circular background glow */}
      <div className="relative flex justify-center mt-2">
        {/* Glow behind portrait */}
        <div className="absolute w-44 h-44 rounded-full blur-xl opacity-35 bg-white/20 transition-all duration-500 group-hover:scale-110 pointer-events-none" />
        
        <div className="relative w-44 h-44 transition-transform duration-500 group-hover:scale-105">
          {/* Profile Image with Gold/Silver border frame (Bevel, Inner Glow, Secondary ring) */}
          <div className={`w-full h-full overflow-hidden relative flex-shrink-0 flex items-center justify-center transition-all duration-500 ${
            theme === 'bot' 
              ? 'rounded-none border border-green-500 grayscale group-hover:grayscale-0' 
              : `rounded-full p-[4px] bg-gradient-to-b from-white/10 via-transparent to-black/35 border-[1.5px] ${design.accentColor} shadow-[0_6px_20px_rgba(0,0,0,0.45),0_0_20px_rgba(255,255,255,0.02)] group-hover:shadow-[0_8px_30px_rgba(255,255,255,0.08)]`
          }`}>
            {/* Inner secondary border frame */}
            <div className={`w-full h-full rounded-full overflow-hidden border-[2px] border-black/40 flex items-center justify-center bg-slate-800`}>
              <img 
                src={soluper.image} 
                alt={soluper.name} 
                className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-[1.08]" 
              />
            </div>
          </div>

          {/* Small Active Status Dot (Aligned to larger frame) */}
          {soluper.status === 'Active' && (
            <div className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 z-10 transition-transform duration-500 group-hover:scale-105 ${
              theme === 'bot' ? 'border-black bg-green-500 rounded-none' : 'border-slate-955 bg-green-400'
            }`} />
          )}
        </div>
      </div>

      {/* Information Section / Glassmorphism Panel */}
      <div className="relative z-10 w-full text-center mt-2 pb-0.5 flex flex-col items-center flex-1 justify-end">
        {/* Role Badge */}
        <div className={`inline-flex items-center gap-1 px-3 py-0.5 mb-2 rounded-full border text-[9.5px] font-bold uppercase tracking-wider ${design.badgeColor}`}>
          {design.badge}
        </div>

        {/* Member Name */}
        <h4 className={`text-[17px] font-extrabold tracking-tight transition-colors ${
          theme === 'bot' ? 'text-green-400 font-mono group-hover:text-green-300' : 'text-white'
        }`}>
          {soluper.name}
        </h4>

        {/* Designation Title */}
        <p className={`text-[10.5px] font-semibold tracking-wider uppercase mt-1 ${
          theme === 'bot' ? 'text-green-700 font-mono' : 'text-slate-300/80'
        }`}>
          {soluper.role}
        </p>
      </div>
    </div>
  );
};

// --- VIEW COMPONENTS ---

const Navbar = ({ theme, toggleTheme, activePage, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'home', icon: Home },
    { name: 'Team', id: 'team', icon: Users },
    { name: 'Projects', id: 'projects', icon: Briefcase },
    { name: 'Gallery', id: 'gallery', icon: Image },
    { name: 'Legacy Map', id: 'legacy', icon: Activity },
    { name: 'Events', id: 'events', icon: Trophy },
    { name: 'Collabs', id: 'collabs', icon: Handshake }
  ];

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="w-4 h-4" />;
    if (theme === 'bot') return <Bot className="w-4 h-4" />;
    return <Moon className="w-4 h-4" />;
  };

  const getThemeLabel = () => {
    if (theme === 'light') return 'LIGHT';
    if (theme === 'bot') return 'BOT';
    return 'DARK';
  };

  const getNavButtonStyle = (linkId) => {
    const isActive = activePage === linkId;
    let style = "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium transition-all duration-300 relative group overflow-hidden ";
    if (theme === 'bot') {
        style += "rounded-none border-l-2 border-r-2 " + (isActive ? "border-green-500 bg-green-900/30 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)]" : "border-transparent text-green-700 hover:text-green-400 hover:bg-green-900/10");
    } else {
        if (isActive) {
            // Updated to be a distinct pill shape for light/dark modes
            if (theme === 'light') style += "bg-white text-indigo-600 shadow-md transform scale-105"; 
            else style += "bg-amber-600 text-white shadow-lg shadow-amber-500/25 transform scale-105";
        } else {
            if (theme === 'light') style += "text-slate-600 hover:bg-white/50 hover:text-slate-900";
            else style += "text-slate-400 hover:text-white hover:bg-white/10";
        }
    }
    return style;
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? (theme === 'bot' ? "bg-black/90 border-b border-green-900 py-3" : (theme === 'light' ? "bg-white/30 backdrop-blur-xl border-b border-slate-200 py-3" : "bg-slate-950/30 backdrop-blur-xl border-b border-slate-800 py-3")) : "bg-transparent py-5"}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 font-bold text-xl tracking-tighter cursor-pointer ${theme === 'bot' ? 'text-green-500 font-mono' : (theme === 'light' ? 'text-slate-900' : 'text-white')}`} onClick={() => onNavigate('home')}>
            {/* Replaced SVG with Image - Change 'image_cd1378.png' to your uploaded file name */}
            <img 
              src="/my-logo.png" 
              alt="Solution Developers" 
              className="w-10 h-10 object-contain" 
            />
            SOLUTION DEVELOPERS
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className={`flex items-center p-1 rounded-full border backdrop-blur-md transition-colors mr-2 ${theme === 'bot' ? 'bg-black/50 border-green-900 rounded-none' : (theme === 'light' ? 'bg-white/40 border-slate-200 shadow-sm' : 'bg-slate-900/40 border-slate-700 shadow-xl')}`}>
              {navLinks.map(link => {
                const Icon = link.icon;
                return <button key={link.id} onClick={() => onNavigate(link.id)} className={getNavButtonStyle(link.id)}><Icon className={`w-3.5 h-3.5 ${theme === 'bot' && activePage === link.id ? 'animate-pulse' : ''}`} /><span>{link.name}</span></button>;
              })}
            </div>
            <button onClick={toggleTheme} className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-[11px] font-bold border transition-all shadow-sm ${theme === 'bot' ? 'border-green-800 text-green-700 hover:border-green-500 hover:bg-green-950/30 rounded-none' : (theme === 'light' ? 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:shadow-md' : 'bg-slate-850 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 hover:shadow-lg hover:shadow-amber-500/10')}`}>{getThemeIcon()}{getThemeLabel()}</button>
            <button 
              onClick={() => onNavigate('auth')} 
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-bold border transition-all shadow-sm ${
                theme === 'bot' 
                  ? 'border-green-500 text-green-500 bg-black hover:border-green-400 hover:bg-green-950/30 rounded-none font-mono shadow-[0_0_10px_rgba(34,197,94,0.2)]' 
                  : (theme === 'light' ? 'bg-amber-600 border-amber-600 text-white hover:bg-amber-500 hover:shadow-md' : 'bg-amber-600 border-amber-600 text-white hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/15')
              }`}
            >
              <User className="w-3.5 h-3.5" /> Portal
            </button>
          </div>
          <div className="md:hidden flex items-center gap-4">
             <button onClick={toggleTheme} className={theme === 'bot' ? 'text-green-500' : (theme === 'light' ? 'text-slate-700' : 'text-white')}>{getThemeIcon()}</button>
             <button onClick={() => onNavigate('auth')} className={theme === 'bot' ? 'text-green-500' : (theme === 'light' ? 'text-slate-700' : 'text-white')}><User className="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const INITIATIVES_DATA = [
  {
    id: 1,
    title: "AI Innovation Triumph",
    category: "Competition",
    desc: "Our dev team clinched 1st Place at the Regional AI Hackathon with our smart city traffic optimization project, leveraging computer vision and real-time edge processing.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop",
    achievement: "1st Place Rank"
  },
  {
    id: 2,
    title: "Regional Tech Survey Leader",
    category: "Community Impact",
    desc: "Ranked as the most active peer-learning tech community in the annual student poll, validating our commitment to hands-on, branch-independent developer growth.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop",
    achievement: "Top Rated Community"
  },
  {
    id: 3,
    title: "Open Source Milestones",
    category: "Development",
    desc: "Crossed 50+ successful web and mobile app deployments, providing student creators with a battle-tested launchpad for launching production-grade products.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop",
    achievement: "50+ Active Projects"
  },
  {
    id: 4,
    title: "Embedded Systems Lab",
    category: "Hardware",
    desc: "Established a hardware sandbox where Solupers build real IoT integrations, bridging physical microcontrollers with digital architectures.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop",
    achievement: "IoT Lab Launch"
  }
];

const InitiativesSection = ({ theme }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      setTimeout(checkScroll, 100);
    }
    return () => {
      if (el) {
        el.removeEventListener('scroll', checkScroll);
      }
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const amount = direction === 'left' ? -clientWidth * 0.6 : clientWidth * 0.6;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className={`text-xs font-mono font-bold tracking-widest uppercase ${theme === 'bot' ? 'text-green-500' : 'text-amber-500'}`}>
              // OUR ACTIONS IN MOTION
            </span>
            <h2 className={`text-4xl font-extrabold mt-2 ${theme === 'bot' ? 'text-white font-mono' : (theme === 'light' ? 'text-slate-900' : 'text-white')}`}>
              Active Initiatives
            </h2>
          </div>
          
          {/* Custom Side-Scroll Controls */}
          <div className="flex gap-3 mt-6 md:mt-0">
            <button
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className={`p-2.5 rounded-full border transition-all ${
                !canScrollLeft 
                  ? 'opacity-40 cursor-not-allowed border-slate-800 text-slate-500' 
                  : (theme === 'bot' ? 'border-green-800 text-green-500 hover:border-green-500 hover:bg-green-950/30' : (theme === 'light' ? 'border-slate-200 text-slate-700 hover:bg-slate-100' : 'border-slate-700 text-slate-300 hover:bg-slate-800'))
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className={`p-2.5 rounded-full border transition-all ${
                !canScrollRight 
                  ? 'opacity-40 cursor-not-allowed border-slate-800 text-slate-500' 
                  : (theme === 'bot' ? 'border-green-800 text-green-500 hover:border-green-500 hover:bg-green-950/30' : (theme === 'light' ? 'border-slate-200 text-slate-700 hover:bg-slate-100' : 'border-slate-700 text-slate-300 hover:bg-slate-800'))
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {INITIATIVES_DATA.map((item) => (
            <div 
              key={item.id}
              className={`w-[290px] sm:w-[350px] flex-shrink-0 snap-start border backdrop-blur-md rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] ${
                theme === 'bot' 
                  ? 'bg-black/90 border-green-900 rounded-none shadow-[0_0_15px_rgba(34,197,94,0.1)]' 
                  : (theme === 'light' ? 'bg-white/90 border-slate-200 shadow-xl' : 'bg-slate-900/90 border-slate-850 shadow-2xl')
              }`}
            >
              <div>
                {/* Image Container with Hover Zoom */}
                <div className="relative h-44 w-full overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      theme === 'bot' ? 'bg-green-950/95 border border-green-500 text-green-400 font-mono rounded-none' : 'bg-amber-600/90 text-white'
                    }`}>
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Text Details */}
                <div className="p-6 text-left">
                  <h3 className={`text-lg font-bold mb-2 ${theme === 'bot' ? 'text-green-400 font-mono' : (theme === 'light' ? 'text-slate-900' : 'text-white')}`}>
                    {item.title}
                  </h3>
                  <p className={`text-xs leading-relaxed ${theme === 'bot' ? 'text-green-700 font-mono' : (theme === 'light' ? 'text-slate-650' : 'text-slate-400')}`}>
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Bottom Badge Detail */}
              <div className={`px-6 py-4 border-t flex items-center gap-2 ${
                theme === 'bot' ? 'border-green-950 font-mono text-green-500' : (theme === 'light' ? 'border-slate-100 text-amber-600' : 'border-slate-850 text-amber-500')
              }`}>
                <Trophy className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">{item.achievement}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HomePage = ({ theme, onNavigate }) => (
  <>
    <section className="min-h-[90vh] flex items-center justify-center relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center pt-20">
        <div className={`inline-flex items-center gap-2 px-4 py-2 mb-8 transition-colors cursor-pointer backdrop-blur-md ${theme === 'bot' ? 'bg-black/50 border border-green-700 rounded-none' : (theme === 'light' ? 'rounded-full bg-white/50 border border-slate-200 shadow-sm' : 'rounded-full bg-slate-900/50 border border-slate-700')}`}>
          <span className="flex h-2 w-2 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${theme === 'bot' ? 'bg-green-400' : 'bg-green-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${theme === 'bot' ? 'bg-green-500' : 'bg-green-500'}`}></span>
          </span>
          <span className={`text-sm font-medium ${theme === 'bot' ? 'text-green-500 font-mono tracking-widest uppercase' : (theme === 'light' ? 'text-slate-600' : 'text-slate-300')}`}>{theme === 'bot' ? 'SYSTEM ONLINE v2.0' : 'v2.0 System Online'}</span>
        </div>
        <h1 className={`text-6xl md:text-8xl font-black mb-6 leading-tight ${theme === 'bot' ? 'text-green-500 font-mono tracking-tighter' : (theme === 'light' ? 'text-slate-900 tracking-tighter' : 'text-white font-black tracking-tighter')}`}>
          {theme === 'bot' ? 'INITIATE_' : 'SOLVE'} <span className={`text-transparent bg-clip-text ${theme === 'bot' ? 'bg-green-400 animate-pulse' : 'bg-gradient-to-r from-amber-400 to-yellow-300'}`}>{theme === 'bot' ? 'FUTURE' : 'FUTURE'}</span><br />
          <span className={theme === 'bot' ? 'text-green-800 text-5xl md:text-7xl' : (theme === 'light' ? 'text-slate-400' : 'text-slate-600')}>{theme === 'bot' ? '>> DEVELOP_TODAY();' : 'DEVELOP TODAY.'}</span>
        </h1>
        <p className={`text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${theme === 'bot' ? 'text-green-700 font-mono text-sm' : (theme === 'light' ? 'text-slate-600' : 'text-slate-400')}`}>Once A Soluper , Always a Solution Developer.</p>
        
        {/* Side-by-side Founders Carousel and Interactive Notice Board */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-16 items-center">
           <FoundersCarousel theme={theme} />
           <NoticeSection theme={theme} />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Button theme={theme} variant="primary" icon={theme === 'bot' ? Terminal : ChevronRight} onClick={() => onNavigate('team')}>{theme === 'bot' ? 'EXECUTE: MEET_SQUAD' : 'Meet the Squad'}</Button>
          <Button theme={theme} variant="secondary" icon={theme === 'bot' ? Code2 : Terminal} onClick={() => onNavigate('projects')}>{theme === 'bot' ? 'SCAN ARSENAL' : 'View Arsenal'}</Button>
        </div>

        <TechTicker theme={theme} />
      </div>
    </section>
    <InitiativesSection theme={theme} />
    <MissionSection theme={theme} />
  </>
);

// --- INTERACTIVE ALBUM LIGHTBOX ---
const Lightbox = ({ album, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevAlbumId, setPrevAlbumId] = useState(album?.id);
  
  if (album?.id !== prevAlbumId) {
    setPrevAlbumId(album?.id);
    setCurrentIndex(0);
  }

  if (!isOpen || !album) return null;

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % album.photos.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + album.photos.length) % album.photos.length);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md animate-[fade-in_0.2s_ease-out]">
      {/* Close button */}
      <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white transition-all bg-white/10 hover:bg-white/20 p-3 rounded-full z-10">
        <X className="w-6 h-6" />
      </button>

      {/* Main Image Slider */}
      <div className="relative max-w-5xl w-full px-6 flex flex-col items-center">
        <div className="relative aspect-[16/10] w-full max-h-[70vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black/60 shadow-2xl border border-white/10">
          <img 
            src={album.photos[currentIndex]} 
            alt={`${album.title} - ${currentIndex + 1}`} 
            className="max-w-full max-h-full object-contain animate-[scale-up_0.3s_ease-out]"
          />
          
          {/* Prev/Next buttons */}
          {album.photos.length > 1 && (
            <>
              <button 
                onClick={handlePrev} 
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/75 hover:scale-105 active:scale-95 text-white p-3 rounded-full transition-all border border-white/10 hover:border-white/25 z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={handleNext} 
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/75 hover:scale-105 active:scale-95 text-white p-3 rounded-full transition-all border border-white/10 hover:border-white/25 z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Badge & Title overlay at bottom */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-6 pt-16 text-left">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-2 inline-block">
              {album.badge}
            </span>
            <h3 className="text-xl font-bold text-white">{album.title}</h3>
            <p className="text-xs text-slate-300 mt-1.5 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-amber-500" /> {album.date} &bull; <MapPin className="w-3.5 h-3.5 text-amber-500" /> {album.location}
            </p>
          </div>
        </div>

        {/* Thumbnail strip */}
        {album.photos.length > 1 && (
          <div className="flex gap-2.5 mt-6 overflow-x-auto max-w-full py-2 no-scrollbar justify-center">
            {album.photos.map((photo, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentIndex(i)} 
                className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all relative flex-shrink-0 ${
                  currentIndex === i ? 'border-amber-500 scale-105 shadow-lg shadow-amber-500/10' : 'border-white/10 hover:border-white/40 opacity-60 hover:opacity-90'
                }`}
              >
                <img src={photo} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Info Counter */}
        <p className="text-sm font-semibold font-mono text-slate-400 mt-4">
          Photo {currentIndex + 1} of {album.photos.length}
        </p>
      </div>
    </div>
  );
};

// --- JOURNEY TIMELINE COMPONENT ---
const JourneyTimeline = ({ theme }) => {
  const timelineEvents = [
    {
      date: "July 2025",
      title: "Club Formation & Vision Draft",
      desc: "Solution Developers was officially established as a syndicate of innovators, drafting our core guidelines and code rules.",
      tag: "Initiation",
      icon: Code2
    },
    {
      date: "August 2025",
      title: "First Advanced Whiteboard Session",
      desc: "Launched our first workshop session centering on microservice infrastructure pipelines and distributed cache setups.",
      tag: "Workshop",
      icon: Terminal
    },
    {
      date: "October 2025",
      title: "First Rural Field Tech Survey",
      desc: "Traveled to regional cooperatives to study user accessibility and analyze digital dashboard constraints.",
      tag: "Survey Field",
      icon: ClipboardList
    },
    {
      date: "December 2025",
      title: "Vanguard Hackathon Winner",
      desc: "Claimed first place with our fully automated DevForge CLI project bootstrapper tool.",
      tag: "Hackathon",
      icon: Trophy
    },
    {
      date: "January 2026",
      title: "Era II Presidential Launch",
      desc: "Promoted new leadership boards under Prem Gosawi & Ragini Waghmare to drive advanced platform initiatives.",
      tag: "Leadership Era II",
      icon: Sparkles
    },
    {
      date: "March 2026",
      title: "Active Partnership Protocol",
      desc: "Inked active collaborations with TechCorp Inc. and open-source infrastructure consortia.",
      tag: "Collaboration",
      icon: Building2
    },
    {
      date: "June 2026",
      title: "National Smart India Victory",
      desc: "Clinched the SIH grand prize for Smart Automation, deploying real-time regional dashboard pilots.",
      tag: "Award SIH",
      icon: Award
    },
    {
      date: "July 2026",
      title: "Era III Presidential Board",
      desc: "Inducted Sammed Chaugule & Sneha Jadhav as Era III Presidents, initiating the Solupers Ecosystem update.",
      tag: "Leadership Era III",
      icon: Milestone
    }
  ];

  const lineBg = theme === 'bot' ? 'bg-green-800' : 'bg-amber-500/20';
  const glowColor = theme === 'bot' ? 'rgba(34,197,94,0.3)' : (theme === 'light' ? 'rgba(217,119,6,0.2)' : 'rgba(245,158,11,0.25)');

  return (
    <div className="relative max-w-4xl mx-auto py-16 px-4">
      {/* Timeline line */}
      <div className={`absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 ${lineBg} hidden sm:block`} />
      
      <div className="space-y-12 relative">
        {timelineEvents.map((evt, idx) => {
          const IconComponent = evt.icon;
          const isEven = idx % 2 === 0;

          return (
            <div key={idx} className="flex flex-col sm:flex-row items-start sm:justify-between relative group">
              {/* Timeline dot */}
              <div 
                className={`absolute left-4 md:left-1/2 top-1.5 w-6 h-6 rounded-full border-2 -translate-x-1/2 flex items-center justify-center z-10 transition-all duration-300 group-hover:scale-115 ${
                  theme === 'bot' 
                    ? 'border-green-500 bg-black text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' 
                    : (theme === 'light' 
                        ? 'border-amber-600 bg-white text-amber-600 shadow-md' 
                        : 'border-amber-500 bg-slate-900 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.35)]')
                }`}
                style={{ boxShadow: `0 0 12px ${glowColor}` }}
              >
                <div className={`w-2 h-2 rounded-full ${theme === 'bot' ? 'bg-green-500' : 'bg-amber-500'}`} />
              </div>

              {/* Grid content columns */}
              <div className={`w-full sm:w-[45%] pl-12 sm:pl-0 ${isEven ? 'sm:text-right' : 'sm:order-2 sm:text-left'}`}>
                <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 ${
                  theme === 'bot' 
                    ? 'bg-green-950/40 text-green-400 border border-green-800 font-mono' 
                    : (theme === 'light' 
                        ? 'bg-amber-50 text-amber-800 border-amber-200' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20')
                }`}>
                  {evt.date} &bull; {evt.tag}
                </span>
                
                <h4 className={`text-lg font-extrabold flex items-center gap-2 ${
                  isEven ? 'sm:justify-end' : 'sm:justify-start'
                } ${
                  theme === 'bot' ? 'text-green-400 font-mono' : (theme === 'light' ? 'text-slate-900' : 'text-white')
                }`}>
                  {!isEven && <IconComponent className="w-4 h-4 text-amber-500 flex-shrink-0" />}
                  {evt.title}
                  {isEven && <IconComponent className="w-4 h-4 text-amber-500 flex-shrink-0" />}
                </h4>
                
                <p className={`mt-2 text-sm leading-relaxed ${
                  theme === 'bot' ? 'text-green-700 font-mono' : (theme === 'light' ? 'text-slate-650' : 'text-slate-455')
                }`}>
                  {evt.desc}
                </p>
              </div>

              {/* Spacer on the opposite side to balance grid */}
              <div className="hidden sm:block sm:w-[45%]" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- FUTURISTIC CENTERPIECE COMPONENT ---
const FuturisticCenterpiece = ({ theme, onClick }) => {
  const canvasRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const rotationSpeed = useRef(0.008);
  const angleX = useRef(Math.PI / 6);
  const angleY = useRef(Math.PI / 4);
  const scale = useRef(1);
  const pulseDirection = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = 300;
      canvas.height = 300;
    };
    resize();

    // 3D Box vertices (rectangular prism)
    const sizeX = 65;
    const sizeY = 85;
    const sizeZ = 65;
    const vertices = [
      { x: -sizeX, y: -sizeY, z: -sizeZ },
      { x: sizeX, y: -sizeY, z: -sizeZ },
      { x: sizeX, y: sizeY, z: -sizeZ },
      { x: -sizeX, y: sizeY, z: -sizeZ },
      { x: -sizeX, y: -sizeY, z: sizeZ },
      { x: sizeX, y: -sizeY, z: sizeZ },
      { x: sizeX, y: sizeY, z: sizeZ },
      { x: -sizeX, y: sizeY, z: sizeZ }
    ];

    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0], // back face
      [4, 5], [5, 6], [6, 7], [7, 4], // front face
      [0, 4], [1, 5], [2, 6], [3, 7]  // connecting edges
    ];

    const project = (x, y, z) => {
      const perspective = 350;
      const scaleProject = perspective / (perspective + z);
      return {
        x: x * scaleProject + canvas.width / 2,
        y: y * scaleProject + canvas.height / 2
      };
    };

    const rotateX = (x, y, z, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return { x, y: y * cos - z * sin, z: y * sin + z * cos };
    };

    const rotateY = (x, y, z, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return { x: x * cos + z * sin, y, z: -x * sin + z * cos };
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Pulse scaling
      if (pulseDirection.current === 1) {
        scale.current += 0.0008;
        if (scale.current >= 1.04) pulseDirection.current = -1;
      } else {
        scale.current -= 0.0008;
        if (scale.current <= 0.96) pulseDirection.current = 1;
      }

      // Dynamic speed based on hover
      const targetSpeed = isHovered ? 0.002 : 0.006;
      rotationSpeed.current += (targetSpeed - rotationSpeed.current) * 0.1;
      
      angleX.current += rotationSpeed.current;
      angleY.current += rotationSpeed.current * 0.75;

      // Project vertices
      const projected = vertices.map(v => {
        let x = v.x * scale.current;
        let y = v.y * scale.current;
        let z = v.z * scale.current;

        let rot = rotateX(x, y, z, angleX.current);
        rot = rotateY(rot.x, rot.y, rot.z, angleY.current);

        return project(rot.x, rot.y, rot.z);
      });

      // Translucent inner faces for glassmorphism look
      ctx.fillStyle = theme === 'bot' ? 'rgba(34, 197, 94, 0.04)' : 'rgba(245, 158, 11, 0.05)';
      ctx.beginPath();
      ctx.moveTo(projected[4].x, projected[4].y);
      ctx.lineTo(projected[5].x, projected[5].y);
      ctx.lineTo(projected[6].x, projected[6].y);
      ctx.lineTo(projected[7].x, projected[7].y);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(projected[0].x, projected[0].y);
      ctx.lineTo(projected[1].x, projected[1].y);
      ctx.lineTo(projected[2].x, projected[2].y);
      ctx.lineTo(projected[3].x, projected[3].y);
      ctx.closePath();
      ctx.fill();

      // Draw wireframe edges
      ctx.strokeStyle = theme === 'bot' ? 'rgba(34, 197, 94, 0.85)' : 'rgba(245, 158, 11, 0.95)';
      ctx.lineWidth = isHovered ? 2.2 : 1.6;
      ctx.shadowBlur = isHovered ? 18 : 6;
      ctx.shadowColor = theme === 'bot' ? 'rgba(34, 197, 94, 0.6)' : 'rgba(245, 158, 11, 0.6)';

      edges.forEach(edge => {
        ctx.beginPath();
        ctx.moveTo(projected[edge[0]].x, projected[edge[0]].y);
        ctx.lineTo(projected[edge[1]].x, projected[edge[1]].y);
        ctx.stroke();
      });

      // Vertex nodes
      ctx.shadowBlur = 0;
      projected.forEach(v => {
        ctx.beginPath();
        ctx.arc(v.x, v.y, isHovered ? 3.5 : 2.5, 0, Math.PI * 2);
        ctx.fillStyle = theme === 'bot' ? '#22c55e' : '#D4AF37';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [theme, isHovered]);

  const infoCards = [
    { label: "Achievements", value: "25+ Awards", icon: Trophy, posClass: "top-0 left-1/2 -translate-x-1/2 -translate-y-6 md:-translate-y-8" },
    { label: "Events & Memories", value: "60+ Memories", icon: Images, posClass: "bottom-0 left-1/2 -translate-x-1/2 translate-y-6 md:translate-y-8" },
    { label: "Hackathons", value: "15 Competitions", icon: Target, posClass: "top-1/2 left-0 -translate-y-1/2 -translate-x-6 md:-translate-x-12 lg:-translate-x-20" },
    { label: "Community", value: "500+ Members", icon: Users, posClass: "top-1/2 right-0 -translate-y-1/2 translate-x-6 md:translate-x-12 lg:translate-x-20" }
  ];

  return (
    <div 
      className="relative flex items-center justify-center w-full h-[420px] my-8 cursor-pointer select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* SVG Connecting lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        
        {/* Draw lines from center to 4 panels */}
        {/* Left connector line */}
        <line x1="20%" y1="50%" x2="40%" y2="50%" stroke="url(#glowGrad)" strokeWidth="1.5" strokeDasharray="3 3" className="opacity-80 animate-pulse" />
        {/* Right connector line */}
        <line x1="80%" y1="50%" x2="60%" y2="50%" stroke="url(#glowGrad)" strokeWidth="1.5" strokeDasharray="3 3" className="opacity-80 animate-pulse" />
        {/* Top connector line */}
        <line x1="50%" y1="18%" x2="50%" y2="40%" stroke="url(#glowGrad)" strokeWidth="1.5" strokeDasharray="3 3" className="opacity-80 animate-pulse" />
        {/* Bottom connector line */}
        <line x1="50%" y1="82%" x2="50%" y2="60%" stroke="url(#glowGrad)" strokeWidth="1.5" strokeDasharray="3 3" className="opacity-80 animate-pulse" />
      </svg>

      {/* Center 3D Cube Canvas Frame */}
      <div className={`relative z-10 w-[240px] h-[240px] md:w-[280px] md:h-[280px] flex items-center justify-center rounded-full transition-all duration-500 bg-gradient-to-br from-white/5 to-white/0 border border-white/5 ${
        isHovered ? 'scale-105 shadow-[0_0_60px_rgba(245,158,11,0.18)] border-amber-500/25' : ''
      }`}>
        <canvas ref={canvasRef} />
      </div>

      {/* Floating Info Panels */}
      {infoCards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div 
            key={i} 
            className={`absolute z-20 flex flex-col items-center p-3 md:p-4 rounded-2xl border backdrop-blur-md transition-all duration-350 shadow-md ${card.posClass} ${
              theme === 'bot' 
                ? 'bg-black/90 border-green-900 text-green-500 font-mono text-[10px]' 
                : (theme === 'light' 
                    ? 'bg-white/90 border-slate-200 text-slate-800 hover:shadow-lg' 
                    : 'bg-slate-900/90 border-slate-850 text-slate-250 hover:shadow-2xl')
            } ${isHovered ? 'scale-105 border-amber-500/35' : ''}`}
          >
            <div className={`p-2 rounded-xl mb-1.5 ${theme === 'light' ? 'bg-amber-50 text-amber-600' : 'bg-amber-500/10 text-amber-400'}`}>
              <Icon className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500">{card.label}</span>
            <span className={`text-xs md:text-sm font-black mt-0.5 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{card.value}</span>
          </div>
        );
      })}
    </div>
  );
};

// --- CORE REGISTRY STATS DASHBOARD MODAL ---
const StatsModal = ({ isOpen, onClose, theme }) => {
  if (!isOpen) return null;

  const bgClass = theme === 'bot' 
    ? 'bg-black/95 border-green-950 text-green-400 font-mono rounded-none' 
    : (theme === 'light' ? 'bg-white border-slate-200 text-slate-900 rounded-3xl' : 'bg-slate-950/95 border-slate-850 text-white rounded-3xl');

  const stats = [
    { label: "Achievements", value: "25+", desc: "Milestones & Trophies", icon: Trophy, color: "text-amber-500" },
    { label: "Hackathons", value: "15", desc: "National & Inter-College sprints", icon: Target, color: "text-red-500" },
    { label: "Workshops", value: "30+", desc: "Masterclasses & System Sessions", icon: GraduationCap, color: "text-blue-500" },
    { label: "Outreach & Surveys", value: "12+", desc: "Field visits & research audits", icon: ClipboardList, color: "text-emerald-500" },
    { label: "Active Contributors", value: "75+", desc: "Core and Lead Solupers", icon: Users, color: "text-purple-500" },
    { label: "Memories Captured", value: "60+", desc: "Living photographic logs", icon: Images, color: "text-pink-500" }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-[fade-in_0.2s_ease-out]">
      <div className={`relative max-w-3xl w-full p-8 border backdrop-blur-xl shadow-2xl overflow-y-auto max-h-[90vh] ${bgClass}`}>
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-slate-200 transition-all bg-white/5 hover:bg-white/10 p-2 rounded-full z-10">
          <X className="w-5 h-5" />
        </button>

        {/* Heading */}
        <div className="mb-8">
          <span className={`text-xs font-mono font-bold tracking-widest uppercase ${theme === 'bot' ? 'text-green-500' : 'text-amber-500'}`}>
            // CORE REGISTRY LOGS
          </span>
          <h2 className="text-2xl md:text-3xl font-black mt-1">Syndicate Dashboard Stats</h2>
          <p className="text-xs text-slate-500 mt-1">Live database index of Solution Developers milestones & accomplishments.</p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div 
                key={i} 
                className={`p-5 rounded-2xl border ${
                  theme === 'bot' 
                    ? 'border-green-950 bg-black/40' 
                    : (theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-slate-900/40 border-slate-800/40')
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-3xl font-black ${theme === 'bot' ? 'text-green-400' : 'text-amber-500'}`}>{stat.value}</span>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="font-extrabold text-sm mb-1">{stat.label}</div>
                <div className="text-[10.5px] text-slate-500 font-medium leading-tight">{stat.desc}</div>
              </div>
            );
          })}
        </div>

        {/* Short Timeline summary */}
        <div className={`p-6 rounded-2xl border mb-6 ${
          theme === 'bot' 
            ? 'border-green-950 bg-black/40' 
            : (theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-slate-900/40 border-slate-800/40')
        }`}>
          <h3 className="font-extrabold mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
            <Milestone className="w-4 h-4 text-amber-500" /> Historic Landmark Eras
          </h3>
          <div className="space-y-4 text-xs font-semibold">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Era I Presidential (Hariom Sandve)</span>
              <span className={theme === 'bot' ? 'text-green-500' : 'text-amber-500'}>July 2025 - Dec 2025</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Era II Presidential (Prem & Ragini)</span>
              <span className={theme === 'bot' ? 'text-green-500' : 'text-amber-500'}>Jan 2026 - June 2026</span>
            </div>
            <div className="flex items-center justify-between pb-1">
              <span className="text-slate-400">Era III Presidential (Sammed & Sneha)</span>
              <span className={theme === 'bot' ? 'text-green-500' : 'text-amber-500'}>July 2026 - Dec 2026</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] text-slate-650 font-mono">
          SECURE PROTOCOL // DB_VER_2.45 // SOLUTION DEVELOPERS
        </div>
      </div>
    </div>
  );
};

// --- REDESIGNED GALLERY PAGE ---
const GalleryPage = ({ theme }) => {
    const [activeTab, setActiveTab] = useState('achievements');
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isStatsOpen, setIsStatsOpen] = useState(false);

    const data = GALLERY_DATA[activeTab];
    const featuredAlbum = GALLERY_DATA.achievements[0]; // SIH Winners

    const cardClass = theme === 'bot' ? 'bg-black/80 border border-green-900 hover:border-green-500' : (theme === 'light' ? 'bg-white border border-slate-200 hover:border-amber-300' : 'bg-slate-900/80 border border-slate-800 hover:border-amber-500');
    
    return (
        <section className="px-6 pb-24 min-h-screen pt-24 bg-transparent relative z-10">
             <div className="max-w-7xl mx-auto">
                <SectionTitle theme={theme} title="Digital Museum" subtitle="Documenting our memories, collaborations, and celebrations." />
                
                {/* NEW Animated Centerpiece with Floating Panels */}
                <div className="animate-[fade-in_0.7s_ease-out]">
                  <FuturisticCenterpiece theme={theme} onClick={() => setIsStatsOpen(true)} />
                </div>

                {/* Segmented Control / Tabs */}
                <div className="flex justify-center mb-12">
                    <div className={`p-1.5 rounded-full flex gap-1 border backdrop-blur-md ${
                      theme === 'bot' 
                        ? 'bg-black border-green-900' 
                        : (theme === 'light' ? 'bg-slate-100/80 border-slate-200' : 'bg-slate-900/80 border-slate-800')
                    }`}>
                        <button 
                          onClick={() => setActiveTab('achievements')} 
                          className={`px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                            activeTab === 'achievements' 
                              ? (theme === 'bot' ? 'bg-green-950/40 text-green-500 border border-green-500' : 'bg-amber-600 text-white shadow-md') 
                              : (theme === 'bot' ? 'text-green-700' : 'text-slate-500 hover:text-slate-400')
                          }`}
                        >
                            <Trophy className="w-4 h-4"/> Achievements & Celebrations
                        </button>
                        <button 
                          onClick={() => setActiveTab('surveys')} 
                          className={`px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                            activeTab === 'surveys' 
                              ? (theme === 'bot' ? 'bg-green-950/40 text-green-500 border border-green-500' : 'bg-amber-600 text-white shadow-md') 
                              : (theme === 'bot' ? 'text-green-700' : 'text-slate-500 hover:text-slate-400')
                          }`}
                        >
                            <Images className="w-4 h-4"/> Surveys & Journey
                        </button>
                    </div>
                </div>

                {/* Masonry Mosaic Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[250px] md:auto-rows-[280px] mb-16 animate-[fade-in_0.5s_ease-out]">
                    {data.map((item) => {
                        let IconElement = Award;
                        if (item.icon === 'trophy') IconElement = Trophy;
                        else if (item.icon === 'medal') IconElement = Medal;
                        else if (item.icon === 'award') IconElement = Award;
                        else if (item.icon === 'cheers') IconElement = Sparkles;
                        else if (item.icon === 'clipboard') IconElement = ClipboardList;
                        else if (item.icon === 'building') IconElement = Building2;
                        else if (item.icon === 'users') IconElement = Users;
                        else if (item.icon === 'book') IconElement = GraduationCap;
                        else if (item.icon === 'tree') IconElement = Trees;

                        return (
                            <div 
                              key={item.id} 
                              onClick={() => {
                                  setSelectedAlbum(item);
                                  setIsLightboxOpen(true);
                              }}
                              className={`group relative overflow-hidden rounded-[24px] ${cardClass} ${item.sizeClass} hover:-translate-y-2 transition-all duration-350 cursor-pointer shadow-lg hover:shadow-2xl`}
                            >
                                 {/* Image cover with zoom */}
                                 <div className="absolute inset-0 bg-slate-900 z-0">
                                     <img 
                                       src={item.cover} 
                                       alt={item.title} 
                                       loading="lazy"
                                       className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500" 
                                     />
                                     {/* Gradient overlay */}
                                     <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-10" />
                                 </div>

                                 {/* Top badge */}
                                 <div className="absolute top-4 left-4 z-20">
                                     <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/60 text-amber-400 border border-amber-500/25`}>
                                         {item.badge}
                                     </span>
                                 </div>

                                 {/* Photo count indicator */}
                                 <div className="absolute top-4 right-4 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-black/60 text-slate-300 border border-white/10">
                                     <Images className="w-3 h-3 text-amber-500" />
                                     {item.photos.length} Photos
                                 </div>

                                 {/* Content overlay */}
                                 <div className="absolute inset-x-0 bottom-0 p-6 z-20 flex flex-col justify-end">
                                     <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2 mb-1.5 tracking-tight group-hover:text-amber-300 transition-colors">
                                         <IconElement className="w-5 h-5 text-amber-500 flex-shrink-0" />
                                         {item.title}
                                     </h3>
                                     
                                     <p className="text-xs text-slate-300 line-clamp-2 mb-2 font-medium leading-relaxed">
                                         {item.desc}
                                     </p>

                                     <div className="flex items-center gap-3 text-[10.5px] font-bold text-slate-400">
                                         <span className="flex items-center gap-1">
                                             <Calendar className="w-3.5 h-3.5 text-amber-500/80" /> {item.date}
                                         </span>
                                         <span className="flex items-center gap-1">
                                             <MapPin className="w-3.5 h-3.5 text-amber-500/80" /> {item.location}
                                         </span>
                                     </div>
                                 </div>
                            </div>
                        );
                    })}
                </div>

                {/* Featured Hero Section */}
                <div className="mb-16 animate-[fade-in_0.6s_ease-out]">
                    <div className={`relative overflow-hidden rounded-[24px] border transition-all duration-350 ${
                        theme === 'bot' 
                          ? 'bg-black/90 border-green-900' 
                          : (theme === 'light' ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900/90 border-slate-850')
                    }`}>
                        <div className="grid grid-cols-1 lg:grid-cols-12">
                            {/* Image banner */}
                            <div className="lg:col-span-7 h-64 sm:h-96 relative overflow-hidden bg-slate-950">
                                <img 
                                  src={featuredAlbum.cover} 
                                  alt={featuredAlbum.title} 
                                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent lg:hidden" />
                            </div>

                            {/* Content text */}
                            <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-center">
                                <div className="mb-4">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                                        theme === 'bot' 
                                          ? 'bg-green-950/40 text-green-400 border border-green-800 font-mono' 
                                          : (theme === 'light' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20')
                                    }`}>
                                      <Trophy className="w-3.5 h-3.5 text-amber-500" /> Featured Memory
                                    </span>
                                </div>

                                <h2 className={`text-2xl sm:text-3xl font-black tracking-tight mb-3 transition-colors ${
                                    theme === 'bot' ? 'text-green-400 font-mono' : (theme === 'light' ? 'text-slate-900' : 'text-white')
                                }`}>
                                    {featuredAlbum.title}
                                </h2>
                                
                                <p className={`text-sm leading-relaxed mb-6 ${
                                    theme === 'bot' ? 'text-green-700 font-mono' : (theme === 'light' ? 'text-slate-650' : 'text-slate-400')
                                }`}>
                                    {featuredAlbum.desc}
                                </p>

                                <div className={`flex flex-col sm:flex-row sm:items-center gap-4 mb-8 text-xs font-semibold ${
                                    theme === 'bot' ? 'text-green-700' : (theme === 'light' ? 'text-slate-500' : 'text-slate-400')
                                }`}>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4 text-amber-500" /> {featuredAlbum.date}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4 text-amber-500" /> {featuredAlbum.location}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Images className="w-4 h-4 text-amber-500" /> {featuredAlbum.photos.length} Photos
                                    </div>
                                </div>

                                <button 
                                  onClick={() => {
                                      setSelectedAlbum(featuredAlbum);
                                      setIsLightboxOpen(true);
                                  }}
                                  className={`inline-flex items-center justify-center gap-2 self-start px-6 py-3 rounded-full font-black text-xs uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 ${
                                      theme === 'bot' 
                                        ? 'bg-black border border-green-500 text-green-400 font-mono rounded-none' 
                                        : (theme === 'light' 
                                            ? 'bg-[#8a6500] hover:bg-[#705200] text-white hover:shadow-[0_0_15px_rgba(138,101,0,0.3)]' 
                                            : 'bg-[#D4AF37] hover:bg-[#c59f2e] text-black hover:shadow-[0_0_15px_rgba(212,175,55,0.35)]')
                                  }`}
                                >
                                    <Eye className="w-4 h-4" /> View Full Album
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline for Surveys & Journey */}
                {activeTab === 'surveys' && (
                  <div className="mt-16 animate-[fade-in_0.5s_ease-out]">
                    <div className="text-center mb-12">
                      <span className={`text-xs font-mono font-bold tracking-widest uppercase ${theme === 'bot' ? 'text-green-500' : 'text-amber-500'}`}>
                        // OUR CHRONOLOGY
                      </span>
                      <h3 className={`text-3xl font-extrabold mt-2 ${theme === 'bot' ? 'text-white' : (theme === 'light' ? 'text-slate-900' : 'text-white')}`}>
                        Journey Timeline
                      </h3>
                    </div>
                    <JourneyTimeline theme={theme} />
                  </div>
                )}
             </div>

             {/* Lightbox Album Modal */}
             <Lightbox 
               album={selectedAlbum} 
               isOpen={isLightboxOpen} 
               onClose={() => {
                   setIsLightboxOpen(false);
                   setSelectedAlbum(null);
               }} 
             />

             {/* Stats Summary Modal Dashboard */}
             <StatsModal 
               isOpen={isStatsOpen} 
               onClose={() => setIsStatsOpen(false)} 
               theme={theme} 
             />
        </section>
    );
};

const LegacyMapPage = ({ theme }) => {
    return (
        <section className="min-h-screen pt-24 pb-24 bg-transparent relative z-10">
            <div className="max-w-7xl mx-auto px-6">
                <SectionTitle theme={theme} title="Presidential Map" subtitle="The leadership eras of Solution Developers." />
                <LeadershipTimeline theme={theme} />
            </div>
        </section>
    );
};

const EVENTS_DATA = [
  {
    id: 1,
    title: "AI Innovation Summit 2025",
    date: "August 15, 2025",
    time: "10:00 AM - 4:00 PM IST",
    location: "Virtual & Tech Hub, Bangalore",
    desc: "Join us for a full day of keynotes, panel discussions, and project showcases centering on next-gen agentic workflows and LLM engineering.",
    tag: "Summit",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop",
    status: "Registration Open"
  },
  {
    id: 2,
    title: "Vanguard Hackathon v2.0",
    date: "September 05-07, 2025",
    time: "48-Hour Coding Sprint",
    location: "Online / Discord",
    desc: "Build innovative tools, themes, or integrations for the Solupers Ecosystem. $5,000 prize pool and mentoring from Chief Leads.",
    tag: "Hackathon",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop",
    status: "Coming Soon"
  },
  {
    id: 3,
    title: "Advanced System Design Workshop",
    date: "October 12, 2025",
    time: "2:00 PM - 6:00 PM IST",
    location: "Google Meet",
    desc: "Deep-dive session on distributed databases, event-driven architectures, Kafka pipelines, and horizontal scaling strategies.",
    tag: "Workshop",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop",
    status: "Registration Open"
  }
];

const EventsPage = ({ theme }) => {
  return (
    <section className="min-h-screen pt-24 pb-24 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle theme={theme} title="Events Protocol" subtitle="Upcoming sprints, workshops, and hackathons." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {EVENTS_DATA.map((evt) => (
            <RevealOnScroll key={evt.id}>
              <div className={`group h-full flex flex-col overflow-hidden transition-all duration-300 backdrop-blur-md border ${
                theme === 'bot' 
                  ? 'bg-black/80 border-green-900 hover:border-green-500 rounded-none hover:shadow-[0_0_20px_rgba(34,197,94,0.1)]' 
                  : (theme === 'light' ? 'bg-white/80 rounded-2xl border-slate-200 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-500/10' : 'bg-slate-900/80 rounded-2xl border-slate-800 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-900/20')
              }`}>
                <div className="h-48 relative overflow-hidden bg-slate-800">
                  <img src={evt.image} alt={evt.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className={`absolute top-4 right-4 text-xs font-mono px-2.5 py-1 border uppercase tracking-wider ${
                    theme === 'bot' ? 'bg-black border-green-700 text-green-400 rounded-none' : 'bg-slate-900/90 border-slate-800 text-amber-400 rounded-full'
                  }`}>
                    {evt.tag}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <span className={`text-xs font-mono uppercase tracking-wider mb-2 ${theme === 'bot' ? 'text-green-600' : 'text-amber-500'}`}>{evt.date} /// {evt.time}</span>
                  <h3 className={`text-xl font-bold mb-3 transition-colors ${theme === 'bot' ? 'text-green-400 font-mono group-hover:text-green-300' : (theme === 'light' ? 'text-slate-900 group-hover:text-amber-600' : 'text-white group-hover:text-amber-400')}`}>{evt.title}</h3>
                  <div className={`text-xs flex items-center gap-2 mb-4 ${theme === 'bot' ? 'text-green-800' : 'text-slate-500'}`}>
                    <MapPin className="w-4 h-4" /> {evt.location}
                  </div>
                  <p className={`mb-6 flex-1 text-sm ${theme === 'bot' ? 'text-green-700 font-mono' : (theme === 'light' ? 'text-slate-600' : 'text-slate-400')}`}>{evt.desc}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className={`text-xs font-bold font-mono ${evt.status === 'Registration Open' ? 'text-emerald-500' : 'text-amber-500'}`}>● {evt.status}</span>
                    <Button theme={theme} variant="primary">{theme === 'bot' ? 'INIT_REGISTRATION' : 'Register Now'}</Button>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

const AuthPage = ({ theme }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', roleCode: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(isLogin ? "Authenticating Soluper..." : "Registering new Soluper request...");
  };

  return (
    <section className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-transparent relative z-10 px-6">
      <div className={`w-full max-w-md p-8 backdrop-blur-md border transition-all duration-500 ${
        theme === 'bot' 
          ? 'bg-black/90 border-green-900 rounded-none shadow-[0_0_30px_rgba(34,197,94,0.15)]' 
          : (theme === 'light' ? 'bg-white/95 rounded-3xl border-slate-200 shadow-2xl' : 'bg-slate-900/95 rounded-3xl border-slate-800 shadow-2xl')
      }`}>
        <div className="text-center mb-8">
          <img 
            src="/my-logo.png" 
            alt="Solution Developers" 
            className="w-16 h-16 object-contain mx-auto mb-4" 
          />
          <h2 className={`text-2xl font-bold uppercase tracking-wider ${theme === 'bot' ? 'text-green-400 font-mono' : (theme === 'light' ? 'text-slate-900' : 'text-white')}`}>
            {isLogin ? "Soluper Portal" : "Join the Syndicate"}
          </h2>
          <p className={`text-xs mt-2 ${theme === 'bot' ? 'text-green-800 font-mono' : 'text-slate-500'}`}>
            {isLogin ? "Authenticate to access terminal core" : "Submit registry for new membership protocol"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className={`block text-xs uppercase tracking-widest font-bold mb-2 ${theme === 'bot' ? 'text-green-700' : 'text-slate-400'}`}>Full Name</label>
              <input 
                type="text" 
                required
                className={`w-full px-4 py-3 text-sm focus:outline-none transition-colors bg-transparent border ${
                  theme === 'bot' 
                    ? 'border-green-800 text-green-400 rounded-none focus:border-green-500 font-mono' 
                    : (theme === 'light' ? 'border-slate-200 text-slate-900 rounded-xl focus:border-amber-500' : 'border-slate-800 text-white rounded-xl focus:border-amber-500')
                }`}
                placeholder="Enter full name..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}
          
          <div>
            <label className={`block text-xs uppercase tracking-widest font-bold mb-2 ${theme === 'bot' ? 'text-green-700' : 'text-slate-400'}`}>Soluper Email</label>
            <input 
              type="email" 
              required
              className={`w-full px-4 py-3 text-sm focus:outline-none transition-colors bg-transparent border ${
                theme === 'bot' 
                  ? 'border-green-800 text-green-400 rounded-none focus:border-green-500 font-mono' 
                  : (theme === 'light' ? 'border-slate-200 text-slate-900 rounded-xl focus:border-amber-500' : 'border-slate-800 text-white rounded-xl focus:border-amber-500')
              }`}
              placeholder="name@solutiondevelopers.org"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className={`block text-xs uppercase tracking-widest font-bold mb-2 ${theme === 'bot' ? 'text-green-700' : 'text-slate-400'}`}>Security Key</label>
            <input 
              type="password" 
              required
              className={`w-full px-4 py-3 text-sm focus:outline-none transition-colors bg-transparent border ${
                theme === 'bot' 
                  ? 'border-green-800 text-green-400 rounded-none focus:border-green-500 font-mono' 
                  : (theme === 'light' ? 'border-slate-200 text-slate-900 rounded-xl focus:border-amber-500' : 'border-slate-800 text-white rounded-xl focus:border-amber-500')
              }`}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {!isLogin && (
            <div>
              <label className={`block text-xs uppercase tracking-widest font-bold mb-2 ${theme === 'bot' ? 'text-green-700' : 'text-slate-400'}`}>Syndicate Role Invitation Code</label>
              <input 
                type="text" 
                className={`w-full px-4 py-3 text-sm focus:outline-none transition-colors bg-transparent border ${
                  theme === 'bot' 
                    ? 'border-green-800 text-green-400 rounded-none focus:border-green-500 font-mono' 
                    : (theme === 'light' ? 'border-slate-200 text-slate-900 rounded-xl focus:border-amber-500' : 'border-slate-800 text-white rounded-xl focus:border-amber-500')
                }`}
                placeholder="INV-XXXX-2025"
                value={formData.roleCode}
                onChange={(e) => setFormData({ ...formData, roleCode: e.target.value })}
              />
            </div>
          )}

          <button 
            type="submit" 
            className={`w-full py-3.5 mt-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-95 ${
              theme === 'bot' 
                ? 'bg-green-500 text-black font-mono border-none hover:shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
                : 'bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-500/20'
            }`}
          >
            {isLogin ? "Execute Protocol" : "Initialize Registry"}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-slate-800/20 pt-4">
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className={`text-xs underline hover:text-amber-500 transition-colors ${
              theme === 'bot' ? 'text-green-700 hover:text-green-400 font-mono' : 'text-slate-400'
            }`}
          >
            {isLogin ? "Request Membership Protocol (Sign Up)" : "Access Existing Portal (Sign In)"}
          </button>
        </div>
      </div>
    </section>
  );
};

const CollaborationsPage = ({ theme }) => {
    // Helper to get color classes based on the 'color' prop in mock data
    const getColorClasses = (color) => {
        if (theme === 'bot') return {
            bg: 'bg-green-900/20',
            text: 'text-green-500', 
            border: 'border-green-800'
        };
        const colors = {
            blue: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
            green: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
            purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
            cyan: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20'
        };
        return {
            bg: colors[color].split(' ')[1],
            text: colors[color].split(' ')[0],
            border: colors[color].split(' ')[2]
        };
    };

    return (
    <section className="px-6 pb-24 min-h-screen pt-24 bg-transparent relative z-10 overflow-hidden">
        {/* Abstract Background Network Graphic */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
             <div className={`absolute top-1/4 -right-20 w-96 h-96 rounded-full blur-[100px] ${theme === 'bot' ? 'bg-green-900' : 'bg-amber-500'}`} />
             <div className={`absolute bottom-0 -left-20 w-80 h-80 rounded-full blur-[80px] ${theme === 'bot' ? 'bg-green-900' : 'bg-purple-500'}`} />
             
             {/* Simple Mesh Grid SVG */}
             <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                 <defs>
                     <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                         <path d="M 40 0 L 0 0 0 40" fill="none" stroke={theme === 'bot' ? '#22c55e' : (theme === 'light' ? '#cbd5e1' : '#334155')} strokeWidth="0.5" opacity="0.3"/>
                     </pattern>
                 </defs>
                 <rect width="100%" height="100%" fill="url(#grid)" />
             </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
             <div className="flex flex-col items-center mb-16">
                 <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2 border ${theme === 'bot' ? 'bg-green-900/20 text-green-500 border-green-800' : (theme === 'light' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-amber-900/20 text-amber-400 border-amber-800')}`}>
                    <Network className="w-4 h-4" /> Global Network Status: Online
                 </div>
                 <SectionTitle theme={theme} title="Strategic Alliances" subtitle="Expanding our capabilities through global partnerships." />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {COLLABORATIONS.map((collab, idx) => {
                     const colors = getColorClasses(collab.color);
                     const Icon = collab.icon;
                     
                     return (
                     <div key={idx} className={`group relative p-1 rounded-3xl transition-all duration-500 hover:-translate-y-2 ${theme === 'bot' ? 'bg-gradient-to-br from-green-900 via-black to-black' : 'bg-gradient-to-br from-slate-800 via-transparent to-transparent'}`}>
                         
                         {/* Card Content */}
                         <div className={`h-full p-8 rounded-[22px] border relative overflow-hidden backdrop-blur-md flex flex-col justify-between transition-all duration-300
                            ${theme === 'bot' ? 'bg-black border-green-900 hover:border-green-500' : (theme === 'light' ? 'bg-white/80 border-slate-200 hover:shadow-xl hover:border-amber-200' : 'bg-slate-900/80 border-slate-800 hover:bg-slate-800 hover:border-slate-600')}
                         `}>
                             {/* Hover Glow Effect */}
                             <div className={`absolute -right-20 -top-20 w-40 h-40 rounded-full blur-[50px] transition-opacity duration-500 opacity-0 group-hover:opacity-30 ${theme === 'bot' ? 'bg-green-500' : 'bg-amber-500'}`} />

                             <div className="flex justify-between items-start mb-6 relative z-10">
                                 <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${colors.bg} ${colors.text} ${colors.border}`}>
                                     <Icon className="w-8 h-8" />
                                 </div>
                                 <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border flex items-center gap-1.5
                                     ${theme === 'bot' ? 'bg-green-900/20 text-green-500 border-green-800' : (theme === 'light' ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-slate-800 text-slate-300 border-slate-700')}
                                 `}>
                                     <div className={`w-1.5 h-1.5 rounded-full ${theme === 'bot' ? 'bg-green-500 animate-pulse' : 'bg-green-500'}`} />
                                     {collab.status}
                                 </div>
                             </div>

                             <div className="relative z-10 mb-8">
                                 <h3 className={`text-2xl font-bold mb-2 ${theme === 'bot' ? 'text-green-400 font-mono' : (theme === 'light' ? 'text-slate-900' : 'text-white')}`}>
                                     {collab.name}
                                 </h3>
                                 <p className={`text-sm leading-relaxed ${theme === 'bot' ? 'text-green-800 font-mono' : (theme === 'light' ? 'text-slate-600' : 'text-slate-400')}`}>
                                     {collab.desc}
                                 </p>
                             </div>

                             {/* Bottom Stats / Footer */}
                             <div className={`pt-6 mt-auto border-t flex items-center justify-between ${theme === 'bot' ? 'border-green-900' : 'border-slate-200/10'}`}>
                                 <div className="flex items-center gap-2">
                                     <Activity className={`w-4 h-4 ${theme === 'bot' ? 'text-green-600' : 'text-slate-400'}`} />
                                     <span className={`text-sm font-semibold ${theme === 'bot' ? 'text-green-500 font-mono' : (theme === 'light' ? 'text-slate-700' : 'text-slate-200')}`}>
                                         {collab.stats}
                                     </span>
                                 </div>
                                 <div className={`transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ${theme === 'bot' ? 'text-green-500' : 'text-amber-500'}`}>
                                     <ArrowRight className="w-5 h-5" />
                                 </div>
                             </div>

                         </div>
                     </div>
                 )})}
             </div>

             {/* Bottom Call to Action */}
             <div className={`mt-20 p-8 rounded-3xl text-center border relative overflow-hidden ${theme === 'bot' ? 'bg-green-900/10 border-green-800' : (theme === 'light' ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100' : 'bg-slate-900 border-slate-800')}`}>
                 <div className={`inline-block p-4 rounded-full mb-4 ${theme === 'bot' ? 'bg-green-900/20 text-green-500' : 'bg-amber-100 text-amber-600'}`}>
                    <Handshake className="w-8 h-8" />
                 </div>
                 <h3 className={`text-2xl font-bold mb-3 ${theme === 'bot' ? 'text-green-400 font-mono' : (theme === 'light' ? 'text-slate-900' : 'text-white')}`}>Become a Partner</h3>
                 <p className={`max-w-xl mx-auto mb-8 ${theme === 'bot' ? 'text-green-700 font-mono' : 'text-slate-500'}`}>
                    We are always looking for organizations that share our vision for the future of technology.
                 </p>
                 <Button theme={theme} variant="primary" icon={Mail}>Initiate Protocol</Button>
             </div>
        </div>
    </section>
)};

const TeamPage = ({ theme, onSoluperClick }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubPage, setActiveSubPage] = useState("Chief Lead");
  
  const filteredSolupers = SOLUPERS_DATA.filter(soluper => {
    const matchesCategory = activeCategory === "All" || soluper.category === activeCategory;
    const matchesSearch = soluper.name.toLowerCase().includes(searchQuery.toLowerCase()) || soluper.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const chiefLeads = filteredSolupers.filter(s => s.status === 'Active' && s.roleGroup === 'Chief Lead');
  const leads = filteredSolupers.filter(s => s.status === 'Active' && s.roleGroup === 'Lead');
  const juniors = filteredSolupers.filter(s => s.status === 'Active' && s.roleGroup === 'Jr.');
  const pastSolupers = filteredSolupers.filter(s => s.status === 'Past');

  return (
    <section className="px-6 pb-24 min-h-screen pt-24 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto">
        <SectionTitle theme={theme} title="The Syndicate" subtitle="Meet the minds behind the machine." />
        
        {/* Sub-Page Navigation Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-16 -mt-8 relative z-20">
          {[
            { id: "Jr.", label: "Jr. Solupers", icon: Users },
            { id: "Lead", label: "Lead Solupers", icon: Zap },
            { id: "Chief Lead", label: "Chief Lead Solupers", icon: Crown },
            { id: "Past", label: "Past Solupers", icon: UserMinus }
          ].map(page => {
            const Icon = page.icon;
            const isActive = activeSubPage === page.id;
            
            let btnStyle = "px-6 py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm flex items-center gap-2 hover:scale-105 active:scale-95 ";
            if (theme === 'bot') {
              btnStyle += "rounded-none font-mono " + (isActive ? "border-green-500 bg-green-900/30 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]" : "border-green-900 text-green-700 bg-black hover:border-green-500");
            } else {
              if (isActive) {
                btnStyle += "bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-500/25";
              } else {
                btnStyle += (theme === 'light' ? "bg-white border-slate-200 text-slate-700 hover:border-amber-400 hover:text-amber-600" : "bg-slate-900 border-slate-800 text-slate-300 hover:border-amber-500/50 hover:text-amber-400");
              }
            }
            
            return (
              <button 
                key={page.id}
                onClick={() => setActiveSubPage(page.id)}
                className={btnStyle}
              >
                <Icon className="w-4 h-4" />
                {page.label}
              </button>
            );
          })}
        </div>

        <div className={`p-6 md:p-8 backdrop-blur-md ${theme === 'bot' ? 'bg-black/90 border border-green-900 rounded-none' : (theme === 'light' ? 'bg-white/90 rounded-3xl border border-slate-200 shadow-sm' : 'bg-slate-900/90 rounded-3xl border border-slate-800')}`}>
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
            <h3 className={`text-2xl font-bold flex items-center gap-2 ${theme === 'bot' ? 'text-green-400 font-mono' : (theme === 'light' ? 'text-slate-900' : 'text-white')}`}>
              <Database className={`w-6 h-6 ${theme === 'bot' ? 'text-green-500' : 'text-amber-400'}`} /> 
              {activeSubPage === "Chief Lead" && "Chief Lead Solupers"}
              {activeSubPage === "Lead" && "Lead Solupers"}
              {activeSubPage === "Jr." && "Jr. Solupers"}
              {activeSubPage === "Past" && "Past Solupers"}
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative group">
                <Search className={`absolute left-3 top-2.5 h-4 w-4 ${theme === 'bot' ? 'text-green-700' : 'text-slate-500 group-focus-within:text-amber-400'}`} />
                <input type="text" placeholder="Search..." className={`border text-sm pl-10 pr-4 py-2 w-full focus:outline-none transition-colors bg-transparent ${theme === 'bot' ? 'border-green-800 text-green-400 rounded-none focus:border-green-500 font-mono' : (theme === 'light' ? 'border-slate-200 text-slate-900 rounded-xl focus:border-amber-500' : 'border-slate-800 text-white rounded-xl focus:border-amber-500')}`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <select className={`border text-sm px-4 py-2 focus:outline-none bg-transparent ${theme === 'bot' ? 'border-green-800 text-green-400 rounded-none focus:border-green-500 font-mono' : (theme === 'light' ? 'border-slate-200 text-slate-900 rounded-xl focus:border-amber-500' : 'border-slate-800 text-white rounded-xl focus:border-amber-500')}`} value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c} className="text-slate-900">{c}</option>)}
              </select>
            </div>
          </div>
          
          <div className="animate-fade-in">
            {activeSubPage === "Chief Lead" && (
              chiefLeads.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto justify-center">
                  {chiefLeads.map(soluper => <DirectoryCard key={soluper.id} soluper={soluper} theme={theme} onClick={() => onSoluperClick(soluper)} />)}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">No Chief Lead Solupers match the criteria.</div>
              )
            )}

            {activeSubPage === "Lead" && (
              leads.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {leads.map(soluper => <DirectoryCard key={soluper.id} soluper={soluper} theme={theme} onClick={() => onSoluperClick(soluper)} />)}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">No Lead Solupers match the criteria.</div>
              )
            )}

            {activeSubPage === "Jr." && (
              juniors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {juniors.map(soluper => <DirectoryCard key={soluper.id} soluper={soluper} theme={theme} onClick={() => onSoluperClick(soluper)} />)}
                </div>
              ) : (
                /* Empty state as requested for Jr. Solupers: "Hide this section if it has no members. okey align then properly as the screen have to fill properly" */
                <div className="text-center py-20">
                  <Users className={`w-16 h-16 mx-auto mb-4 opacity-40 ${theme === 'bot' ? 'text-green-800' : 'text-slate-500'}`} />
                  <h4 className={`text-xl font-bold mb-2 ${theme === 'bot' ? 'text-green-500 font-mono' : (theme === 'light' ? 'text-slate-800' : 'text-white')}`}>No Active Junior Solupers</h4>
                  <p className={`text-sm ${theme === 'bot' ? 'text-green-800 font-mono' : 'text-slate-500'}`}>Currently, there are no Junior Solupers in active rotation.</p>
                </div>
              )
            )}

            {activeSubPage === "Past" && (
              pastSolupers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {pastSolupers.map(soluper => <DirectoryCard key={soluper.id} soluper={soluper} theme={theme} onClick={() => onSoluperClick(soluper)} />)}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">No past Solupers match the criteria.</div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const ProjectsPage = ({ theme }) => (
  <section className="min-h-screen pt-24 pb-24 bg-transparent relative z-10">
    <div className="max-w-7xl mx-auto px-6">
      <SectionTitle theme={theme} title="The Arsenal" subtitle="Tools we've built for the community." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PROJECTS.map((proj, idx) => (
          <RevealOnScroll key={idx} className={`delay-[${idx * 200}ms]`}>
            <div className={`group h-full flex flex-col overflow-hidden transition-all duration-300 backdrop-blur-md ${theme === 'bot' ? 'bg-black/80 border border-green-900 hover:border-green-500 rounded-none hover:shadow-[0_0_20px_rgba(34,197,94,0.1)]' : (theme === 'light' ? 'bg-white/80 rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-500/10' : 'bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-900/20')}`}>
              <div className={`h-48 relative overflow-hidden flex items-center justify-center ${theme === 'bot' ? 'bg-green-900/10' : (theme === 'light' ? 'bg-slate-50/50' : 'bg-slate-800/50')}`}>
                 <div className={`p-4 rounded-xl ${theme === 'bot' ? 'bg-black border border-green-700 text-green-500' : (theme === 'light' ? 'bg-white border border-slate-200 text-amber-500 shadow-sm' : 'bg-slate-950 border border-slate-700 text-white')}`}>{React.cloneElement(proj.icon, { className: "w-8 h-8" })}</div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className={`text-xl font-bold transition-colors ${theme === 'bot' ? 'text-green-400 font-mono group-hover:text-green-300' : (theme === 'light' ? 'text-slate-900 group-hover:text-amber-600' : 'text-white group-hover:text-amber-400')}`}>{proj.title}</h3>
                  <a href="#" className={theme === 'bot' ? 'text-green-700 hover:text-green-400' : (theme === 'light' ? 'text-slate-400 hover:text-slate-700' : 'text-slate-500 hover:text-white')}><ExternalLink className="w-5 h-5" /></a>
                </div>
                <p className={`mb-6 flex-1 ${theme === 'bot' ? 'text-green-800 font-mono text-sm' : (theme === 'light' ? 'text-slate-600' : 'text-slate-400')}`}>{proj.desc}</p>
                <div className="flex flex-wrap gap-2 mt-auto mb-6">
                  {proj.tags.map(tag => <span key={tag} className={`text-xs px-2 py-1 border ${theme === 'bot' ? 'font-mono text-green-500 bg-green-900/20 border-green-800 rounded-none' : (theme === 'light' ? 'font-mono text-amber-600 bg-amber-50 border-amber-200 rounded' : 'font-mono text-amber-300 bg-amber-900/20 border-amber-900/30 rounded')}`}>{tag}</span>)}
                </div>
                <Button theme={theme} variant={theme === 'bot' ? 'outline' : 'outline'} className="w-full">{theme === 'bot' ? 'INIT_PROJECT' : 'View Details'}</Button>
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  </section>
);

const SoluperProfile = ({ soluper, theme, onBack }) => {
  const [view, setView] = useState('overview'); // 'overview' or 'achievements'

  const getProfileDesign = () => {
    const role = soluper.role.toLowerCase();
    const isPast = soluper.status === 'Past';
    const isLight = theme === 'light';
    
    if (isPast) {
      return {
        headerGradient: 'from-zinc-950 via-zinc-900 to-black',
        accentBorder: 'border-zinc-800',
        textAccent: 'text-zinc-400',
        bgAccent: 'bg-zinc-800/10',
        badgeColor: 'bg-zinc-800/30 border-zinc-700/50 text-zinc-400',
        badgeText: '🩶 Core Soluper',
        accentColor: 'border-zinc-550/30 border-zinc-500/40',
        innerBorder: 'border-zinc-800/30',
        glowColor: 'rgba(255, 255, 255, 0.05)',
        cardClass: 'bg-slate-900/60 border border-zinc-800/60 backdrop-blur-md shadow-2xl',
        chipClass: 'bg-zinc-850/50 text-zinc-400 border-zinc-800/50',
        competencyClass: 'bg-zinc-900/40 text-zinc-400 border-zinc-800/40',
        roleColor: isLight ? 'text-zinc-700' : 'text-zinc-400'
      };
    }

    if (role.includes('founder') || role.includes('chief') || role.includes('architect')) {
      const isArchitect = role.includes('architect');
      return {
        headerGradient: isArchitect ? 'from-orange-950 via-amber-950 to-stone-950' : 'from-red-950 via-red-900 to-rose-950',
        accentBorder: isArchitect ? 'border-yellow-500/50' : 'border-amber-500/50',
        textAccent: 'text-[#D4AF37]',
        bgAccent: isArchitect ? 'bg-yellow-500/10' : 'bg-amber-500/10',
        badgeColor: 'bg-[#D4AF37]/10 border-[#D4AF37]/45 text-[#D4AF37]',
        badgeText: isArchitect ? '🚀 Tech Architect' : '👑 Founder',
        accentColor: isArchitect ? 'border-yellow-400/70' : 'border-amber-400/70',
        innerBorder: isArchitect ? 'border-yellow-500/20' : 'border-amber-500/20',
        glowColor: isArchitect ? 'rgba(234, 179, 8, 0.25)' : 'rgba(245, 158, 11, 0.25)',
        cardClass: isArchitect 
          ? 'bg-orange-955/10 border border-orange-900/25 backdrop-blur-md shadow-2xl'
          : 'bg-red-955/10 border border-red-900/25 backdrop-blur-md shadow-2xl',
        chipClass: 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20',
        competencyClass: 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/25',
        roleColor: isLight 
          ? (isArchitect ? 'text-amber-800' : 'text-red-800') 
          : (isArchitect ? 'text-yellow-400' : 'text-[#f5ebd5]/95')
      };
    }

    if (role.includes('president')) {
      return {
        headerGradient: 'from-red-950 via-red-900 to-rose-950',
        accentBorder: 'border-amber-500/50',
        textAccent: 'text-[#D4AF37]',
        bgAccent: 'bg-amber-500/10',
        badgeColor: 'bg-[#D4AF37]/10 border-[#D4AF37]/45 text-[#D4AF37]',
        badgeText: '👑 President',
        accentColor: 'border-amber-400/70',
        innerBorder: 'border-amber-500/20',
        glowColor: 'rgba(245, 158, 11, 0.25)',
        cardClass: 'bg-red-955/10 border border-red-900/25 backdrop-blur-md shadow-2xl',
        chipClass: 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20',
        competencyClass: 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/25',
        roleColor: isLight ? 'text-red-800' : 'text-[#f5ebd5]/95'
      };
    }

    if (role.includes('technical lead')) {
      return {
        headerGradient: 'from-blue-950 via-slate-900 to-indigo-950',
        accentBorder: 'border-slate-400/50',
        textAccent: 'text-[#D4AF37]',
        bgAccent: 'bg-slate-500/10',
        badgeColor: 'bg-[#D4AF37]/10 border-[#D4AF37]/45 text-[#D4AF37]',
        badgeText: '🚀 Tech Lead',
        accentColor: 'border-slate-350/70 border-slate-300/70',
        innerBorder: 'border-slate-400/25',
        glowColor: 'rgba(148, 163, 184, 0.25)',
        cardClass: 'bg-blue-955/10 border border-blue-900/25 backdrop-blur-md shadow-2xl',
        chipClass: 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20',
        competencyClass: 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/25',
        roleColor: isLight ? 'text-[#1e3a8a]' : 'text-slate-300'
      };
    }

    if (role.includes('operational')) {
      return {
        headerGradient: 'from-purple-950 via-fuchsia-950 to-indigo-950',
        accentBorder: 'border-pink-500/40',
        textAccent: 'text-[#D4AF37]',
        bgAccent: 'bg-pink-500/10',
        badgeColor: 'bg-[#D4AF37]/10 border-[#D4AF37]/45 text-[#D4AF37]',
        badgeText: '⚙️ Operational Lead',
        accentColor: 'border-pink-400/70',
        innerBorder: 'border-pink-500/20',
        glowColor: 'rgba(236, 72, 153, 0.25)',
        cardClass: 'bg-purple-955/10 border border-purple-900/25 backdrop-blur-md shadow-2xl',
        chipClass: 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20',
        competencyClass: 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/25',
        roleColor: isLight ? 'text-[#701a75]' : 'text-pink-300'
      };
    }

    if (role.includes('event')) {
      return {
        headerGradient: 'from-amber-950 via-yellow-950 to-stone-900',
        accentBorder: 'border-yellow-600/50',
        textAccent: 'text-[#D4AF37]',
        bgAccent: 'bg-yellow-600/10',
        badgeColor: 'bg-[#D4AF37]/10 border-[#D4AF37]/45 text-[#D4AF37]',
        badgeText: '🎯 Event Lead',
        accentColor: 'border-yellow-500/70',
        innerBorder: 'border-yellow-600/20',
        glowColor: 'rgba(234, 179, 8, 0.25)',
        cardClass: 'bg-amber-955/10 border border-amber-900/25 backdrop-blur-md shadow-2xl',
        chipClass: 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20',
        competencyClass: 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/25',
        roleColor: isLight ? 'text-amber-800' : 'text-yellow-400'
      };
    }

    if (role.includes('documentation') || role.includes('marketing')) {
      return {
        headerGradient: 'from-emerald-950 via-green-950 to-stone-900',
        accentBorder: 'border-emerald-500/40',
        textAccent: 'text-[#D4AF37]',
        bgAccent: 'bg-emerald-500/10',
        badgeColor: 'bg-[#D4AF37]/10 border-[#D4AF37]/45 text-[#D4AF37]',
        badgeText: '📄 Documentation Lead',
        accentColor: 'border-amber-400/60',
        innerBorder: 'border-emerald-500/20',
        glowColor: 'rgba(16, 185, 129, 0.25)',
        cardClass: 'bg-emerald-955/10 border border-emerald-900/25 backdrop-blur-md shadow-2xl',
        chipClass: 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20',
        competencyClass: 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/25',
        roleColor: isLight ? 'text-[#065f46]' : 'text-emerald-350'
      };
    }

    if (role.includes('media') || role.includes('project & research')) {
      return {
        headerGradient: 'from-purple-950 via-fuchsia-950 to-indigo-950',
        accentBorder: 'border-pink-500/40',
        textAccent: 'text-[#D4AF37]',
        bgAccent: 'bg-pink-500/10',
        badgeColor: 'bg-[#D4AF37]/10 border-[#D4AF37]/45 text-[#D4AF37]',
        badgeText: role.includes('media') ? '📢 Media Lead' : '🔬 Research Lead',
        accentColor: 'border-pink-400/70',
        innerBorder: 'border-pink-500/20',
        glowColor: 'rgba(236, 72, 153, 0.25)',
        cardClass: 'bg-purple-955/10 border border-purple-900/25 backdrop-blur-md shadow-2xl',
        chipClass: 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20',
        competencyClass: 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/25',
        roleColor: isLight ? 'text-[#701a75]' : 'text-pink-300'
      };
    }

    // Default Charcoal Theme
    return {
      headerGradient: 'from-zinc-900 via-stone-900 to-neutral-950',
      accentBorder: 'border-zinc-700/60',
      textAccent: 'text-zinc-350',
      bgAccent: 'bg-zinc-700/10',
      badgeColor: 'bg-zinc-700/30 border-zinc-650/45 text-zinc-300',
      badgeText: '⭐ Lead',
      accentColor: 'border-zinc-500/60',
      innerBorder: 'border-zinc-700/20',
      glowColor: 'rgba(255, 255, 255, 0.05)',
      cardClass: 'bg-slate-900/60 border border-zinc-800/60 backdrop-blur-md shadow-2xl',
      chipClass: 'bg-zinc-700/15 text-zinc-300 border-zinc-700/20',
      competencyClass: 'bg-zinc-700/15 text-zinc-300 border-zinc-700/25',
      roleColor: isLight ? 'text-slate-800' : 'text-slate-300'
    };
  };

  const profDesign = getProfileDesign();
  const bgClass = theme === 'bot' ? 'bg-black/95 border-green-900' : (theme === 'light' ? 'bg-white/95 border-slate-200' : 'bg-slate-955/95 border-slate-800');
  const textClass = theme === 'bot' ? 'text-green-400 font-mono' : (theme === 'light' ? 'text-slate-900' : 'text-white');
  const subTextClass = theme === 'bot' ? 'text-green-700 font-mono' : (theme === 'light' ? 'text-slate-500' : 'text-slate-400');
  const cardClass = theme === 'bot' ? 'bg-black/80 border border-green-800 backdrop-blur-md font-mono' : profDesign.cardClass;

  // Achievements View Component
  const renderAchievementsGallery = () => {
    const achievements = soluper.personalAchievements || [];
    
    if (achievements.length === 0) {
        return (
            <div className={`p-12 text-center rounded-2xl border border-dashed ${theme === 'bot' ? 'border-green-800 text-green-700' : 'border-slate-700 text-slate-500'}`}>
                <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50"/>
                <p>No specific achievements listed yet for this Soluper.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {achievements.map((ach, idx) => (
                <div key={idx} className={`group relative overflow-hidden rounded-2xl border transition-all hover:-translate-y-1 ${theme === 'bot' ? 'border-green-900' : (theme === 'light' ? 'border-slate-200' : profDesign.accentBorder)}`}>
                    <div className="aspect-video w-full overflow-hidden bg-slate-800">
                        <img src={ach.image} alt={ach.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className={`p-6 ${theme === 'bot' ? 'bg-black' : (theme === 'light' ? 'bg-white' : 'bg-slate-900')}`}>
                        <h4 className={`text-lg font-bold mb-2 ${textClass}`}>{ach.title}</h4>
                        <p className={`text-sm ${subTextClass}`}>{ach.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 relative z-10 animate-[fade-in_0.6s_ease-out]">
      <div className="max-w-5xl mx-auto">
        <button onClick={onBack} className={`mb-8 flex items-center gap-2 ${subTextClass} hover:${theme === 'bot' ? 'text-green-300' : (theme === 'light' ? 'text-[#8a6500]' : 'text-[#D4AF37]')} transition-colors bg-transparent font-bold`}><ArrowLeft className="w-5 h-5" /> Back to Team</button>
        
        <div className={`rounded-3xl overflow-hidden border ${theme === 'bot' ? 'border-green-900 rounded-none' : 'border-slate-800'} ${bgClass} backdrop-blur-xl shadow-2xl`}>
          {/* Header Banner */}
          <div className={`h-56 w-full bg-gradient-to-r ${theme === 'bot' ? 'from-black to-black' : profDesign.headerGradient} relative overflow-hidden`}>
            {theme === 'bot' ? (
              <div className="absolute inset-0 bg-black/60 bg-[size:20px_20px] bg-[linear-gradient(to_right,#0f0_1px,transparent_1px),linear-gradient(to_bottom,#0f0_1px,transparent_1px)] opacity-20"></div>
            ) : (
              <>
                {/* Patterns/Ornaments matching card design */}
                <div className={`absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 ${profDesign.accentColor} pointer-events-none z-10`} />
                <div className={`absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 ${profDesign.accentColor} pointer-events-none z-10`} />
                <div className={`absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 ${profDesign.accentColor} pointer-events-none z-10`} />
                <div className={`absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 ${profDesign.accentColor} pointer-events-none z-10`} />
                <div className={`absolute inset-4 border-[1.5px] ${profDesign.innerBorder} rounded-2xl pointer-events-none`} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_80%)] pointer-events-none opacity-55" />
              </>
            )}
            {(soluper.status === 'Past' || soluper.status === 'Alumni') && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-4xl font-black uppercase tracking-widest text-white/20 -rotate-12 border-4 border-white/20 p-4">Past Soluper</span>
                </div>
            )}
          </div>
          
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row gap-8 -mt-20 md:-mt-24 relative z-10 items-center md:items-end text-center md:text-left">
              {/* Profile image with matching frame */}
              <div className={`w-36 h-36 overflow-hidden relative flex-shrink-0 flex items-center justify-center ${
                theme === 'bot' 
                  ? 'border-2 border-green-500 rounded-none grayscale' 
                  : `rounded-full border-[4px] ${profDesign.accentColor} shadow-[0_0_25px_rgba(255,255,255,0.15)] bg-slate-800`
              } ${soluper.status === 'Past' || soluper.status === 'Alumni' ? 'grayscale' : ''}`}>
                <img src={soluper.image} alt={soluper.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 pb-4 w-full">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 w-full">
                  <div className="flex flex-col items-center md:items-start relative">
                    {/* Soft golden glow behind the profile name */}
                    {theme !== 'bot' && (
                      <div className="absolute -inset-x-8 top-10 h-16 bg-[#D4AF37]/5 blur-3xl rounded-full pointer-events-none" />
                    )}

                    {/* Badge */}
                    <div className={`inline-flex items-center gap-1 px-3 py-0.5 mb-3 rounded-full border text-[10px] font-bold uppercase tracking-wider ${theme === 'bot' ? 'border-green-800 text-green-500 font-mono rounded-none' : (theme === 'light' ? 'bg-[#8a6500]/10 border-[#8a6500]/30 text-[#8a6500]' : profDesign.badgeColor)}`}>
                      {profDesign.badgeText}
                    </div>
                    
                    {/* Name */}
                    <h1 className={`text-3xl md:text-4xl font-black tracking-tight mt-1.5 transition-colors ${
                      theme === 'bot' 
                        ? 'text-green-400 font-mono' 
                        : 'text-[#D4AF37] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]'
                    }`}>
                      {soluper.name}
                    </h1>
                    
                    {/* Role */}
                    <p className={`text-md md:text-lg font-bold tracking-wider mt-2.5 transition-colors ${
                      theme === 'bot' 
                        ? 'text-green-700 font-mono' 
                        : `${profDesign.roleColor} drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.35)]`
                    }`}>{soluper.role}</p>
                  </div>
                  
                  {/* Buttons */}
                  <div className="flex gap-3 flex-shrink-0">
                    <button 
                      className={`px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-wider transition-all duration-355 hover:scale-105 active:scale-95 flex items-center gap-2 shadow-md ${
                        theme === 'bot' 
                          ? 'bg-black border border-green-500 text-green-400 font-mono rounded-none' 
                          : (theme === 'light'
                              ? 'bg-[#8a6500] hover:bg-[#705200] text-white border-[#8a6500] hover:shadow-[0_0_15px_rgba(138,101,0,0.4)]'
                              : 'bg-[#D4AF37] hover:bg-[#c59f2e] text-black border-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]')
                      }`}
                    >
                      <Mail className="w-4 h-4" />
                      Contact
                    </button>
                    
                    <button 
                      onClick={() => setView(view === 'overview' ? 'achievements' : 'overview')}
                      className={`px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-wider transition-all duration-355 hover:scale-105 active:scale-95 flex items-center gap-2 border shadow-sm ${
                        theme === 'bot' 
                          ? 'bg-black border border-green-500 text-green-400 font-mono rounded-none' 
                          : (view === 'achievements' 
                              ? (theme === 'light' ? 'bg-[#8a6500] hover:bg-[#705200] text-white border-[#8a6500] hover:shadow-[0_0_15px_rgba(138,101,0,0.25)]' : 'bg-[#D4AF37] hover:bg-[#c59f2e] text-black border-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.25)]') 
                              : (theme === 'light' ? 'bg-transparent hover:bg-[#8a6500]/10 text-[#8a6500] border-[#8a6500]/50' : 'bg-transparent hover:bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/50'))
                      }`}
                    >
                      <Trophy className="w-4 h-4" />
                      {view === 'overview' ? 'Achievements' : 'Overview'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12">
                {view === 'overview' ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-[fade-in_0.5s_ease-out]">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <div className={`p-6 rounded-2xl ${cardClass}`}>
                            <h3 className={`font-extrabold mb-4 flex items-center gap-2.5 ${
                              theme === 'bot' ? 'text-green-400 font-mono' : (theme === 'light' ? 'text-[#8a6500] tracking-wide text-lg' : 'text-[#D4AF37] tracking-wide text-lg')
                            }`}>
                              <Cpu className={`w-5 h-5 ${theme === 'light' ? 'text-[#8a6500]' : 'text-[#D4AF37]'}`} /> Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {soluper.skills.map((skill, i) => (
                                  <span key={i} className={`text-xs px-2.5 py-1 rounded-md font-bold border ${theme === 'bot' ? 'border-green-800 bg-green-900/20 text-green-500 font-mono rounded-none' : (theme === 'light' ? 'bg-slate-100 text-slate-700 border-slate-200' : profDesign.chipClass)}`}>
                                      {skill.name}
                                  </span>
                                ))}
                            </div>
                            </div>

                            <div className={`p-6 rounded-2xl ${cardClass}`}>
                            <h3 className={`font-extrabold mb-4 flex items-center gap-2.5 ${
                              theme === 'bot' ? 'text-green-400 font-mono' : (theme === 'light' ? 'text-[#8a6500] tracking-wide text-lg' : 'text-[#D4AF37] tracking-wide text-lg')
                            }`}>
                              <Activity className={`w-5 h-5 ${theme === 'light' ? 'text-[#8a6500]' : 'text-[#D4AF37]'}`} /> Activity
                            </h3>
                            <div className="space-y-4 text-sm font-medium">
                                <div className="flex justify-between"><span className={theme === 'light' ? 'text-slate-500 font-bold' : subTextClass}>Commits</span><span className={textClass}>{soluper.commits}</span></div>
                                <div className="flex justify-between"><span className={theme === 'light' ? 'text-slate-500 font-bold' : subTextClass}>Projects</span><span className={textClass}>{soluper.projects}</span></div>
                            </div>
                            </div>
                        </div>

                        {/* Right Column: RICH ABOUT SECTION */}
                        <div className="md:col-span-2 space-y-6">
                            <div className={`p-6 rounded-2xl ${cardClass}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className={`font-extrabold flex items-center gap-2.5 ${
                                      theme === 'bot' ? 'text-green-400 font-mono' : (theme === 'light' ? 'text-[#8a6500] tracking-wide text-lg' : 'text-[#D4AF37] tracking-wide text-lg')
                                    }`}>
                                      <User className={`w-5 h-5 ${theme === 'light' ? 'text-[#8a6500]' : 'text-[#D4AF37]'}`} /> About
                                    </h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 ${
                                        soluper.status === 'Active' 
                                            ? (theme === 'bot' ? 'border-green-500 text-green-500' : (theme === 'light' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30'))
                                            : (theme === 'bot' ? 'border-gray-500 text-gray-500' : (theme === 'light' ? 'bg-gray-50 text-gray-700 border-gray-200' : 'bg-gray-100/10 text-gray-400 border-gray-500/20'))
                                    }`}>
                                        <div className={`w-2 h-2 rounded-full ${soluper.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                        {soluper.status}
                                    </span>
                                </div>
                                
                                <p className={`leading-relaxed text-[15.5px] md:text-[16.5px] mb-6 ${
                                  theme === 'bot' ? 'text-green-700 font-mono' : (theme === 'light' ? 'text-slate-700 font-medium' : 'text-slate-200/90 font-medium tracking-wide')
                                }`}>{soluper.bio}</p>

                                {/* Elegant divider line */}
                                {theme !== 'bot' && (
                                  <div className={`w-full h-[1.5px] mb-6 ${theme === 'light' ? 'bg-slate-200' : 'bg-[#D4AF37]/10'}`} />
                                )}

                                {/* Info Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                    <div className={`p-4 rounded-xl border ${theme === 'bot' ? 'border-green-900 bg-green-900/10' : (theme === 'light' ? 'bg-slate-50 border-slate-250 border-slate-200' : 'bg-slate-800/40 border-slate-700/40')}`}>
                                        <div className={`text-xs uppercase tracking-wider mb-1 ${theme === 'bot' ? 'text-green-700 font-mono' : 'text-slate-400/95 font-bold'}`}>Location</div>
                                        <div className={`font-semibold flex items-center gap-2 ${textClass}`}><MapPin className={`w-4 h-4 ${theme === 'light' ? 'text-[#8a6500]' : 'text-[#D4AF37]'}`} /> {soluper.location}</div>
                                    </div>
                                    <div className={`p-4 rounded-xl border ${theme === 'bot' ? 'border-green-900 bg-green-900/10' : (theme === 'light' ? 'bg-slate-50 border-slate-250 border-slate-200' : 'bg-slate-800/40 border-slate-700/40')}`}>
                                        <div className={`text-xs uppercase tracking-wider mb-1 ${theme === 'bot' ? 'text-green-700 font-mono' : 'text-slate-400/95 font-bold'}`}>Department</div>
                                        <div className={`font-semibold flex items-center gap-2 ${textClass}`}><Briefcase className={`w-4 h-4 ${theme === 'light' ? 'text-[#8a6500]' : 'text-[#D4AF37]'}`} /> {soluper.category}</div>
                                    </div>
                                    <div className={`p-4 rounded-xl border ${theme === 'bot' ? 'border-green-900 bg-green-900/10' : (theme === 'light' ? 'bg-slate-50 border-slate-250 border-slate-200' : 'bg-slate-800/40 border-slate-700/40')}`}>
                                        <div className={`text-xs uppercase tracking-wider mb-1 ${theme === 'bot' ? 'text-green-700 font-mono' : 'text-slate-400/95 font-bold'}`}>Join Date</div>
                                        <div className={`font-semibold flex items-center gap-2 ${textClass}`}><Calendar className={`w-4 h-4 ${theme === 'light' ? 'text-[#8a6500]' : 'text-[#D4AF37]'}`} /> {soluper.joined}</div>
                                    </div>
                                    <div className={`p-4 rounded-xl border ${theme === 'bot' ? 'border-green-900 bg-green-900/10' : (theme === 'light' ? 'bg-slate-50 border-slate-250 border-slate-200' : 'bg-slate-800/40 border-slate-700/40')}`}>
                                        <div className={`text-xs uppercase tracking-wider mb-1 ${theme === 'bot' ? 'text-green-700' : 'text-slate-450 font-bold'}`}>Status</div>
                                        <div className={`font-semibold flex items-center gap-2 ${textClass}`}>
                                            {soluper.status === 'Active' ? <UserCheck className="w-4 h-4 text-green-500" /> : <UserMinus className="w-4 h-4 text-gray-500" />} 
                                            {soluper.status === 'Active' ? 'Active Soluper' : 'Past Soluper'}
                                        </div>
                                    </div>
                                </div>

                                {/* Tags / "Superpowers" */}
                                <div>
                                    <div className={`text-xs uppercase tracking-wider mb-3 ${theme === 'bot' ? 'text-green-700 font-mono' : 'text-slate-400/95 font-bold'}`}>Core Competencies</div>
                                    <div className="flex flex-wrap gap-2">
                                        {["System Architecture", "Agile", "Problem Solving", "Team Leadership"].map((tag, i) => (
                                            <span key={i} className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${theme === 'bot' ? 'border-green-500 text-green-500 bg-transparent font-mono' : (theme === 'light' ? 'bg-amber-50 text-amber-800 border-amber-200' : profDesign.competencyClass)}`}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    renderAchievementsGallery()
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = ({ theme }) => (
  <footer className={`bg-transparent relative z-10`}>
    <ContactSection theme={theme} />
    <div className={`py-8 text-center text-sm border-t ${theme === 'bot' ? 'border-green-900 text-green-800 font-mono bg-black' : (theme === 'light' ? 'border-slate-200 text-slate-500 bg-white' : 'border-slate-800 text-slate-500 bg-slate-950')}`}>
        <p>&copy; 2025 SOLUTION DEVELOPERS. System Operational.</p>
    </div>
  </footer>
);

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [currentPage, setCurrentPage] = useState('home'); 
  const [selectedSoluper, setSelectedSoluper] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleNavigate = (page) => {
    // 1. Clean up and revert GSAP ScrollTriggers BEFORE unmounting to restore DOM hierarchy
    try {
      if (typeof window !== 'undefined' && typeof ScrollTrigger !== 'undefined' && typeof ScrollTrigger.getAll === 'function') {
        const allTriggers = ScrollTrigger.getAll();
        allTriggers.forEach(t => {
          // Passing true to kill() forces ScrollTrigger to revert its DOM changes (like pin-spacers)
          t.kill(true); 
        });
      }
    } catch (e) {
      console.error("GSAP ScrollTrigger pre-navigate cleanup failed:", e);
    }

    // 2. Change the route state
    setCurrentPage(page);
    
    // 3. Reset body lock styles immediately to restore scrollability
    try {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.height = '';
        document.documentElement.style.overflow = '';
      }
    } catch (e) {
      console.error("Body style reset failed:", e);
    }

    setTimeout(() => {
      try {
        window.scrollTo(0, 0);
        if (typeof ScrollTrigger !== 'undefined' && typeof ScrollTrigger.refresh === 'function') {
          ScrollTrigger.refresh();
        }
      } catch (err) {
        console.error("Navigation scroll cleanup error:", err);
      }
    }, 50);
  };

  const handleSoluperClick = (soluper) => {
    setSelectedSoluper(soluper);
    handleNavigate('profile');
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 overflow-x-hidden ${theme === 'bot' ? 'bg-black selection:bg-green-500/30' : (theme === 'light' ? 'bg-slate-50 selection:bg-amber-500/30' : 'bg-slate-950 selection:bg-amber-500/30')}`}>
      <GlobalStyles theme={theme} />
      <Background3D theme={theme} /> 
      {loading && <LoadingScreen theme={theme} onComplete={() => setLoading(false)} toggleTheme={toggleTheme} />}
      {!loading && (
        <>
          <Navbar theme={theme} toggleTheme={toggleTheme} activePage={currentPage} onNavigate={handleNavigate} />
          <main className="relative z-10 animate-fade-in">
            {currentPage === 'home' && <HomePage theme={theme} onNavigate={handleNavigate} />}
            {currentPage === 'team' && <TeamPage theme={theme} onSoluperClick={handleSoluperClick} />}
            {currentPage === 'projects' && <ProjectsPage theme={theme} />}
            {currentPage === 'gallery' && <GalleryPage theme={theme} />}
            {currentPage === 'legacy' && <LegacyMapPage theme={theme} />}
            {currentPage === 'events' && <EventsPage theme={theme} />}
            {currentPage === 'collabs' && <CollaborationsPage theme={theme} />}
            {currentPage === 'auth' && <AuthPage theme={theme} />}
            {currentPage === 'profile' && selectedSoluper && <SoluperProfile soluper={selectedSoluper} theme={theme} onBack={() => handleNavigate('team')} />}
          </main>
          <DevBot theme={theme} />
          <Footer theme={theme} />
        </>
      )}
    </div>
  );
}

