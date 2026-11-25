import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  Clock,
  Menu,
  X,
  Plus,
  Trash2,
  Edit3,
  ShieldCheck,
  Compass,
  Layers,
  Sparkles,
  MessageCircle,
  Lock,
  LayoutDashboard,
  FolderKanban,
  CalendarCheck,
  Inbox,
  LogOut,
  Send,
  Search,
  Eye,
  CalendarDays,
  UserRound,
  MessageSquareText,
  ChevronRight
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const formatAdminDate = (value) => {
  if (!value) return 'Date not recorded';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date not recorded';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

const getAdminStatusStyle = (status) => {
  if (status === 'New' || status === 'Unread') {
    return 'bg-[#F5E9D8] text-[#8A5E25] border-[#E8D5B8]';
  }
  if (status === 'Contacted' || status === 'Replied') {
    return 'bg-[#E3F0EA] text-[#277052] border-[#CBE3D6]';
  }
  if (status === 'Archived') {
    return 'bg-[#EEECE8] text-[#77736D] border-[#E1DED8]';
  }
  return 'bg-[#E9EDF2] text-[#526172] border-[#DCE3EA]';
};

const FALLBACK_PROJECTS = [
  {
    id: 'katameya-dunes-villa',
    title: 'Katameya Dunes Residence',
    category: 'Residential',
    location: 'New Cairo, Egypt',
    area: '740 sqm',
    year: '2026',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
    ],
    summary: 'Full architectural interior overhaul featuring travertine stone walls, custom walnut millwork, and warm indirect lighting.',
    challenge: 'Transforming a cavernous concrete shell into an intimate family sanctuary without sacrificing double height openness.',
    outcome: 'Delivered 3 weeks ahead of schedule with bespoke acoustic zoning and seamless indoor garden sightlines.'
  },
  {
    id: 'cairo-capital-hq',
    title: 'Vanguard Financial Headquarters',
    category: 'Commercial',
    location: 'Fifth Settlement, New Cairo',
    area: '1,180 sqm',
    year: '2026',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80'
    ],
    summary: 'Executive suites, acoustic boardrooms, and client hospitality lounges built for a regional investment firm.',
    challenge: 'Balancing strict acoustic privacy for 42 executive offices with natural daylight penetration across the floorplate.',
    outcome: 'Reduced ambient office noise by 38% using custom fluted oak panels and double glazed bronze partitions.'
  },
  {
    id: 'mivida-courtyard-home',
    title: 'Mivida Courtyard Villa',
    category: 'Residential',
    location: 'New Cairo, Egypt',
    area: '580 sqm',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80'
    ],
    summary: 'Minimalist limestone and brushed brass interior architecture designed around a central landscaped courtyard.',
    challenge: 'Unifying fragmented ground floor rooms into a cohesive entertaining and daily living layout.',
    outcome: 'Increased usable living footprint by 24% through concealed structural steel beams and custom pocket doors.'
  },
  {
    id: 'zamalek-atelier-boutique',
    title: 'Maison Solis Flagship',
    category: 'Commercial',
    location: 'Zamalek, Cairo',
    area: '310 sqm',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80'
    ],
    summary: 'Gallery inspired retail flagship crafted from hand troweled lime plaster, travertine plinths, and warm spotlighting.',
    challenge: 'Showcasing high jewelry and couture pieces inside a heritage building with strict structural constraints.',
    outcome: 'Freestanding architectural display volumes preserved original moldings while lifting dwell time by 41%.'
  }
];

const SERVICES = [
  {
    id: 'residential',
    title: 'Residential Interior Design',
    benefit: 'Bespoke villas and apartments tailored to your daily rituals with fixed milestone schedules.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    deliverables: [
      'Complete architectural space planning and circulation flow',
      'Custom furniture, kitchen, and wardrobe millwork drawings',
      'Natural stone, timber, textile, and lighting specification',
      'On site contractor supervision from shell to final styling'
    ]
  },
  {
    id: 'commercial',
    title: 'Commercial Interior Design',
    benefit: 'Executive offices, flagship retail, and hospitality spaces engineered for brand authority and acoustic comfort.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    deliverables: [
      'Brand aligned spatial strategy for offices, boutiques, and dining',
      'Acoustic engineering and ergonomic workstation layouts',
      'MEP, HVAC, and commercial lighting coordination',
      'Fast track turnkey execution with zero operational disruption'
    ]
  },
  {
    id: 'renovation',
    title: 'Renovation and Remodeling',
    benefit: 'Structural modernization of existing properties that unlocks hidden square footage and contemporary light.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    deliverables: [
      'Structural assessment and load bearing wall reconfiguration',
      'Complete electrical, plumbing, and smart home upgrades',
      'Flooring, facade glazing, and thermal insulation renewal',
      'Transparent itemized Bill of Quantities before demolition begins'
    ]
  },
  {
    id: 'visualization',
    title: '3D Visualization',
    benefit: 'Photorealistic architectural renders and material walkthroughs so you approve every surface before spending on construction.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    deliverables: [
      'Daylight and evening architectural interior renders',
      'True to scale furniture and bespoke joinery modeling',
      'Physical material sample boards paired with digital previews',
      'Interactive 360 degree room walkthroughs for stakeholder sign off'
    ]
  }
];

const FAQS = [
  {
    q: 'How do you prevent budget overruns during construction?',
    a: 'Before any site work begins, we deliver a complete, itemized Bill of Quantities with locked supplier pricing and a milestone payment schedule. Every material change requires your written approval first.'
  },
  {
    q: 'Can we hire LUMORA for design and 3D visualization only?',
    a: 'Yes. You can commission our complete architectural design, 3D visualization, and technical drawing package independently, or retain our site engineering team for full turnkey execution.'
  },
  {
    q: 'How long does a full villa or commercial project take?',
    a: 'Design and 3D visualization typically take 4 to 6 weeks depending on property size. Turnkey execution ranges from 12 weeks for apartments and offices to 24 weeks for full villas.'
  },
  {
    q: 'Do you handle contractor management and material procurement?',
    a: 'Yes. Our site architects supervise all civil, MEP, joinery, and finishing teams daily, inspecting every shipment against our approved sample board.'
  },
  {
    q: 'What happens during the initial consultation?',
    a: 'We review your floor plans, discuss your functional requirements, walk through realistic budget benchmarks per square meter, and outline a clear project roadmap with zero obligation.'
  },
  {
    q: 'Do you take on projects outside New Cairo?',
    a: 'While our studio is based in New Cairo, we actively execute residential and commercial commissions across Sheikh Zayed, Zamalek, Maadi, and the North Coast.'
  }
];

function RevealSection({ children, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
}

function TaglineReveal({ text }) {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const words = text.split(' ');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1);
      return undefined;
    }
    let ticking = false;
    const update = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const start = windowHeight * 0.85;
      const end = windowHeight * 0.25;
      const raw = (start - rect.top) / (start - end);
      const clamped = Math.max(0, Math.min(1, raw));
      setProgress(clamped);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section ref={containerRef} className="bg-[#EEEAE2] px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <p className="studio-eyebrow mb-6">
          Architectural Philosophy
        </p>
        <h2 className="studio-section-title max-w-[900px] text-[#191918]">
          {words.map((word, idx) => {
            const threshold = idx / words.length;
            const active = progress >= threshold;
            return (
              <span
                key={idx}
                style={{
                  opacity: active ? 1 : 0.28,
                  transition: 'opacity 500ms cubic-bezier(0.22,1,0.36,1)'
                }}
                className="mr-3 inline-block text-[#191918]"
              >
                {word}
              </span>
            );
          })}
        </h2>
      </div>
    </section>
  );
}

export default function App() {
  const [route, setRoute] = useState('home');
  const [selectedProject, setSelectedProject] = useState(FALLBACK_PROJECTS[0]);
  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState('All');
  const [openFaq, setOpenFaq] = useState(0);

  // Database-backed state (with graceful fallback if backend is offline)
  const [backendConnected, setBackendConnected] = useState(false);
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);
  const [consultations, setConsultations] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);

  // Admin Dashboard Sidebar & Tabs state
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('lumora_token') || '');
  const [adminEmail, setAdminEmail] = useState('admin@lumorainteriors.com');
  const [adminPassword, setAdminPassword] = useState('lumora2026');
  const [adminError, setAdminError] = useState('');
  const [adminSidebarTab, setAdminSidebarTab] = useState('overview'); // overview | projects | consultations | messages
  const [adminSidebarOpen, setAdminSidebarOpen] = useState(false);
  const [adminProjectSearch, setAdminProjectSearch] = useState('');
  const [adminProjectCategory, setAdminProjectCategory] = useState('All');
  const [consultationSearch, setConsultationSearch] = useState('');
  const [consultationStatusFilter, setConsultationStatusFilter] = useState('All');
  const [contactSearch, setContactSearch] = useState('');
  const [contactStatusFilter, setContactStatusFilter] = useState('All');
  const [selectedAdminItem, setSelectedAdminItem] = useState(null);
  const [pendingAdminDelete, setPendingAdminDelete] = useState(null);
  const [adminActionMessage, setAdminActionMessage] = useState('');
  const [projectSubTab, setProjectSubTab] = useState('list'); // list | form
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'Residential',
    location: 'New Cairo, Egypt',
    area: '',
    year: '2026',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80',
    summary: '',
    challenge: '',
    outcome: ''
  });

  // Consultation booking form state
  const [consultForm, setConsultForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    projectType: 'Residential Villa',
    location: '',
    budget: 'EGP 3M – 6M',
    size: '',
    preferredDate: '',
    details: ''
  });
  const [consultError, setConsultError] = useState('');
  const [consultSubmitted, setConsultSubmitted] = useState(false);

  // Contact page form state
  const [contactForm, setContactForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: 'New Project Inquiry',
    message: ''
  });
  const [contactError, setContactError] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Load projects from Prisma Backend on startup
  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE}/projects`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
        setBackendConnected(true);
      }
    } catch {
      setBackendConnected(false);
    }
  };

  const fetchAdminData = async (token) => {
    if (!token) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [cRes, mRes] = await Promise.all([
        fetch(`${API_BASE}/consultations`, { headers }),
        fetch(`${API_BASE}/contacts`, { headers })
      ]);
      if (cRes.ok) setConsultations(await cRes.json());
      if (mRes.ok) setContactMessages(await mRes.json());
    } catch {
      // keep existing state
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (adminToken) {
      fetchAdminData(adminToken);
    }
  }, [adminToken]);

  useEffect(() => {
    const pageTitles = {
      home: 'Luxury Architecture & Interior Design',
      about: 'About the Studio',
      services: 'Architecture & Interior Design Services',
      'service-detail': selectedService?.title || 'Service Details',
      projects: 'Selected Projects',
      'project-detail': selectedProject?.title || 'Project Details',
      process: 'Our Design & Delivery Process',
      contact: 'Contact the Studio',
      consultation: 'Book a Consultation',
      privacy: 'Privacy Policy',
      terms: 'Terms of Engagement',
      admin: 'Studio Management'
    };
    document.title = `${pageTitles[route] || 'Interiors'} | LUMORA Interiors`;
    const description = document.querySelector('meta[name="description"]');
    if (description && route === 'home') {
      description.setAttribute(
        'content',
        'LUMORA Interiors is a New Cairo architecture and interior design studio creating considered residential, commercial, and retail spaces across Egypt.'
      );
    }
  }, [route, selectedProject, selectedService]);

  useEffect(() => {
    if (!selectedAdminItem && !pendingAdminDelete && !adminSidebarOpen) return undefined;
    const handleAdminEscape = (event) => {
      if (event.key === 'Escape') {
        setSelectedAdminItem(null);
        setPendingAdminDelete(null);
        setAdminSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleAdminEscape);
    return () => window.removeEventListener('keydown', handleAdminEscape);
  }, [selectedAdminItem, pendingAdminDelete, adminSidebarOpen]);

  const navigate = (target) => {
    setRoute(target);
    setMobileMenuOpen(false);
    setAdminSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Consultation Form -> Node/Prisma API
  const handleConsultationSubmit = async (e) => {
    e.preventDefault();
    if (!consultForm.fullName.trim() || !consultForm.email.includes('@') || !consultForm.phone.trim()) {
      setConsultError('Please enter your full name, valid email address, and phone number.');
      return;
    }
    setConsultError('');
    try {
      const res = await fetch(`${API_BASE}/consultations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consultForm)
      });
      if (res.ok) {
        const created = await res.json();
        setConsultations([created, ...consultations]);
        setConsultSubmitted(true);
        return;
      }
    } catch {
      // fallback local state if backend not started yet
    }
    setConsultations([
      { ...consultForm, id: `INQ-${Date.now()}`, status: 'New', createdAt: new Date().toISOString() },
      ...consultations
    ]);
    setConsultSubmitted(true);
  };

  // Submit Contact Form -> Node/Prisma API
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.fullName.trim() || !contactForm.email.includes('@') || !contactForm.message.trim()) {
      setContactError('Please complete your name, email address, and message.');
      return;
    }
    setContactError('');
    try {
      const res = await fetch(`${API_BASE}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      if (res.ok) {
        const created = await res.json();
        setContactMessages([created, ...contactMessages]);
        setContactSubmitted(true);
        return;
      }
    } catch {
      // fallback local state
    }
    setContactMessages([
      { ...contactForm, id: `MSG-${Date.now()}`, status: 'Unread', createdAt: new Date().toISOString() },
      ...contactMessages
    ]);
    setContactSubmitted(true);
  };

  // Admin Login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminError('');
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword })
      });
      if (res.ok) {
        const data = await res.json();
        setAdminToken(data.token);
        localStorage.setItem('lumora_token', data.token);
        return;
      } else {
        setAdminError('Invalid credentials. Use admin@lumorainteriors.com / lumora2026');
        return;
      }
    } catch {
      // Offline demo fallback if backend is not running yet
      if (adminEmail === 'admin@lumorainteriors.com' && adminPassword === 'lumora2026') {
        setAdminToken('offline-demo-token');
      } else {
        setAdminError('Invalid credentials. Use admin@lumorainteriors.com / lumora2026');
      }
    }
  };

  // Save (Create or Edit) Project
  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!projectForm.title.trim() || !projectForm.summary.trim()) return;

    const payload = {
      ...projectForm,
      gallery: [projectForm.image]
    };

    if (editingProjectId) {
      try {
        const res = await fetch(`${API_BASE}/projects/${editingProjectId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`
          },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const updated = await res.json();
          setProjects(projects.map((p) => (p.id === editingProjectId ? updated : p)));
        } else {
          setProjects(projects.map((p) => (p.id === editingProjectId ? { ...p, ...payload } : p)));
        }
      } catch {
        setProjects(projects.map((p) => (p.id === editingProjectId ? { ...p, ...payload } : p)));
      }
    } else {
      try {
        const res = await fetch(`${API_BASE}/projects`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`
          },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const created = await res.json();
          setProjects([created, ...projects]);
        } else {
          setProjects([{ ...payload, id: `proj-${Date.now()}` }, ...projects]);
        }
      } catch {
        setProjects([{ ...payload, id: `proj-${Date.now()}` }, ...projects]);
      }
    }

    setEditingProjectId(null);
    setProjectForm({
      title: '',
      category: 'Residential',
      location: 'New Cairo, Egypt',
      area: '',
      year: '2026',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80',
      summary: '',
      challenge: '',
      outcome: ''
    });
    setProjectSubTab('list');
  };

  const startEditProject = (project) => {
    setEditingProjectId(project.id);
    setProjectForm({
      title: project.title,
      category: project.category,
      location: project.location,
      area: project.area || '',
      year: project.year || '2026',
      image: project.image,
      summary: project.summary,
      challenge: project.challenge || '',
      outcome: project.outcome || ''
    });
    setProjectSubTab('form');
  };

  const handleDeleteProject = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (!res.ok) throw new Error('Failed to delete project');
    } catch {
      if (backendConnected) {
        setAdminActionMessage('Could not delete the project. Please try again.');
        return;
      }
    }
    setProjects(projects.filter((p) => p.id !== id));
    setAdminActionMessage('');
  };

  const handleDeleteConsultation = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/consultations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (!res.ok) throw new Error('Failed to delete consultation');
    } catch {
      if (backendConnected) {
        setAdminActionMessage('Could not delete the consultation. Please try again.');
        return;
      }
    }
    setConsultations(consultations.filter((consultation) => consultation.id !== id));
    setSelectedAdminItem(null);
    setAdminActionMessage('');
  };

  const handleDeleteContact = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/contacts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (!res.ok) throw new Error('Failed to delete contact message');
    } catch {
      if (backendConnected) {
        setAdminActionMessage('Could not delete the message. Please try again.');
        return;
      }
    }
    setContactMessages(contactMessages.filter((message) => message.id !== id));
    setSelectedAdminItem(null);
    setAdminActionMessage('');
  };

  const handleConfirmAdminDelete = async () => {
    if (!pendingAdminDelete) return;
    const { type, id } = pendingAdminDelete;
    setPendingAdminDelete(null);
    if (type === 'project') await handleDeleteProject(id);
    if (type === 'consultation') await handleDeleteConsultation(id);
    if (type === 'contact') await handleDeleteContact(id);
  };

  const handleUpdateConsultationStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/consultations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update consultation status');
    } catch {
      if (backendConnected) {
        setAdminActionMessage('Could not update the consultation status. Please try again.');
        return;
      }
    }
    setConsultations(consultations.map((c) => (c.id === id ? { ...c, status } : c)));
    setAdminActionMessage('');
  };

  const handleUpdateContactStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/contacts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update contact status');
    } catch {
      if (backendConnected) {
        setAdminActionMessage('Could not update the message status. Please try again.');
        return;
      }
    }
    setContactMessages(contactMessages.map((m) => (m.id === id ? { ...m, status } : m)));
    setAdminActionMessage('');
  };

  const filteredProjects =
    projectFilter === 'All' ? projects : projects.filter((p) => p.category === projectFilter);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'projects', label: 'Projects' },
    { id: 'process', label: 'Our Process' },
    { id: 'contact', label: 'Contact' }
  ];

  // ---------------- DEDICATED SIDEBAR & TABS ADMIN DASHBOARD ----------------
  if (route === 'admin') {
    if (!adminToken) {
      return (
        <div className="min-h-screen bg-[#171715] text-[#F8F6F1] flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-2xl border border-[#F8F6F1]/15 bg-[#1F1F1F] p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#C5AD8A]" />
                <h1 className="heading-4 text-[#F8F6F1]">Studio Admin Portal</h1>
              </div>
              <button
                onClick={() => navigate('home')}
                className="caption-4 text-[#C5AD8A] hover:underline"
              >
                ← Back to site
              </button>
            </div>
            <p className="body-6 text-[#F8F6F1]/75 mb-6">
              Sign in to manage portfolio projects, consultation bookings, and contact messages.
            </p>
            {adminError && (
              <div className="p-3 mb-4 rounded-xl bg-red-950/60 border border-red-500/30 text-red-200 caption-2">
                {adminError}
              </div>
            )}
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="title-4 block mb-1 text-[#F8F6F1]/85">Admin Email</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#F8F6F1]/20 bg-[#171715] text-[#F8F6F1] px-4 py-2.5 body-6 focus:outline-none focus:ring-2 focus:ring-[#C5AD8A]"
                />
              </div>
              <div>
                <label className="title-4 block mb-1 text-[#F8F6F1]/85">Password</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#F8F6F1]/20 bg-[#171715] text-[#F8F6F1] px-4 py-2.5 body-6 focus:outline-none focus:ring-2 focus:ring-[#C5AD8A]"
                />
              </div>
              <button
                type="submit"
                className="button-md w-full bg-[#C5AD8A] text-[#171715] rounded-xl hover:bg-[#C5AD8A]/90 transition-colors"
              >
                Sign in to dashboard
              </button>
            </form>
          </div>
        </div>
      );
    }

    const unreadMessagesCount = contactMessages.filter((m) => m.status === 'Unread').length;
    const newConsultsCount = consultations.filter((c) => c.status === 'New').length;
    const activeAdminPageTitle = {
      overview: 'Studio overview',
      projects: 'Projects portfolio',
      consultations: 'Consultation requests',
      messages: 'Contact messages'
    }[adminSidebarTab];
    const normalizedProjectSearch = adminProjectSearch.trim().toLowerCase();
    const visibleAdminProjects = projects.filter((project) => {
      const matchesCategory = adminProjectCategory === 'All' || project.category === adminProjectCategory;
      const searchableText = `${project.title} ${project.category} ${project.location}`.toLowerCase();
      return matchesCategory && searchableText.includes(normalizedProjectSearch);
    });
    const normalizedConsultationSearch = consultationSearch.trim().toLowerCase();
    const visibleConsultations = consultations.filter((consultation) => {
      const matchesStatus = consultationStatusFilter === 'All' || consultation.status === consultationStatusFilter;
      const searchableText = `${consultation.fullName} ${consultation.email} ${consultation.phone} ${consultation.location}`.toLowerCase();
      return matchesStatus && searchableText.includes(normalizedConsultationSearch);
    });
    const normalizedContactSearch = contactSearch.trim().toLowerCase();
    const visibleContactMessages = contactMessages.filter((message) => {
      const matchesStatus = contactStatusFilter === 'All' || message.status === contactStatusFilter;
      const searchableText = `${message.fullName} ${message.email} ${message.subject} ${message.message}`.toLowerCase();
      return matchesStatus && searchableText.includes(normalizedContactSearch);
    });

    return (
      <div className="flex min-h-screen flex-col bg-[#F7F5F0] text-[#191919] md:flex-row">
        {adminSidebarOpen && (
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setAdminSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-[#171715]/45 backdrop-blur-[2px] md:hidden"
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-[min(84vw,18rem)] flex-col justify-between bg-[#171715] px-5 py-6 text-[#F7F5F0] shadow-2xl transition-transform duration-300 motion-reduce:transition-none md:sticky md:top-0 md:z-auto md:h-screen md:min-h-screen md:w-72 md:translate-x-0 md:shadow-none xl:w-80 ${
            adminSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div>
            <div className="mb-9 flex items-start justify-between border-b border-white/10 pb-6">
              <div>
                <p className="font-editorial text-3xl font-semibold tracking-[0.12em] text-white">LUMORA</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C8AD89]">
                  Studio management
                </p>
              </div>
              <span
                className={`mt-1 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-wide ${
                  backendConnected
                    ? 'border-emerald-800/70 bg-emerald-950/70 text-emerald-300'
                    : 'border-amber-800/70 bg-amber-950/70 text-amber-200'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${backendConnected ? 'bg-emerald-400' : 'bg-amber-300'}`} />
                {backendConnected ? 'LIVE' : 'LOCAL'}
              </span>
            </div>

            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
              Workspace
            </p>
            <nav aria-label="Studio management" className="space-y-1.5">
              {[
                { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                { id: 'projects', label: 'Projects', icon: FolderKanban, count: projects.length },
                { id: 'consultations', label: 'Consultations', icon: CalendarCheck, count: newConsultsCount },
                { id: 'messages', label: 'Contact inbox', icon: Inbox, count: unreadMessagesCount }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = adminSidebarTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => {
                      setAdminSidebarTab(item.id);
                      if (item.id === 'projects') setProjectSubTab('list');
                      setAdminSidebarOpen(false);
                      setAdminActionMessage('');
                    }}
                    className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 motion-reduce:transition-none ${
                      isActive
                        ? 'bg-[#C8AD89] text-[#191919] shadow-[0_8px_24px_rgba(200,173,137,0.12)]'
                        : 'text-white/65 hover:bg-white/[0.07] hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className={`h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-[#191919]' : 'text-white/50'}`} />
                      {item.label}
                    </span>
                    {item.count > 0 && (
                      <span className={`min-w-6 rounded-full px-2 py-0.5 text-center text-[11px] font-semibold ${
                        isActive ? 'bg-[#191919]/10 text-[#191919]' : 'bg-white/10 text-white/75'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="space-y-1 border-t border-white/10 pt-5">
            <button
              type="button"
              onClick={() => navigate('home')}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-white/60 transition-colors hover:bg-white/[0.07] hover:text-white"
            >
              <ArrowUpRight className="h-[18px] w-[18px]" />
              View live website
            </button>
            <button
              type="button"
              onClick={() => {
                setAdminToken('');
                localStorage.removeItem('lumora_token');
                setAdminSidebarOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-[#E7B0A8]/80 transition-colors hover:bg-[#D96B6B]/10 hover:text-[#F1B5AD]"
            >
              <LogOut className="h-[18px] w-[18px]" />
              Sign out
            </button>
            <div className="mt-4 flex items-center gap-3 border-t border-white/10 px-2 pt-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-[#E7D9C6]">
                {adminEmail.slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-white/85">Studio administrator</p>
                <p className="truncate text-[10px] text-white/40">{adminEmail}</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-h-screen min-w-0 md:ml-0 md:flex-1">
          <header className="sticky top-0 z-20 border-b border-[#E9E5DE] bg-[#F7F5F0]/95 backdrop-blur-xl">
            <div className="mx-auto flex min-h-[76px] max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  aria-label="Open navigation menu"
                  aria-expanded={adminSidebarOpen}
                  onClick={() => setAdminSidebarOpen(true)}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E9E5DE] bg-white text-[#4C4944] transition-colors hover:bg-[#F2EEE7] md:hidden"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div className="min-w-0">
                  <div className="mb-1 hidden items-center gap-2 text-[11px] font-medium text-[#918C83] sm:flex">
                    <span>LUMORA</span>
                    <ChevronRight className="h-3 w-3" />
                    <span>Studio management</span>
                  </div>
                  <h1 className="truncate text-base font-semibold tracking-[-0.02em] text-[#242321] sm:text-lg">
                    {activeAdminPageTitle}
                  </h1>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-xs font-medium text-[#33312E]">Studio administrator</p>
                  <p className="mt-0.5 max-w-48 truncate text-[11px] text-[#8A867F]">{adminEmail}</p>
                </div>
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#E5DED3] bg-[#EDE7DD] text-[#6A5943]">
                  <UserRound className="h-[18px] w-[18px]" />
                  {unreadMessagesCount > 0 && (
                    <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-[#F7F5F0] bg-[#D49A48]" />
                  )}
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1440px] space-y-8 px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
            {adminActionMessage && (
              <div role="alert" className="flex items-center justify-between gap-4 rounded-xl border border-[#E9C9C4] bg-[#FBF0EE] px-4 py-3 text-sm text-[#9A4D46]">
                <span>{adminActionMessage}</span>
                <button type="button" aria-label="Dismiss message" onClick={() => setAdminActionMessage('')} className="rounded-md p-1 hover:bg-[#F4DFDB]">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

          {/* TAB 1: OVERVIEW */}
          {adminSidebarTab === 'overview' && (
            <section className="space-y-8">
              <div className="relative overflow-hidden rounded-2xl border border-[#E8E1D6] bg-white px-6 py-7 shadow-[0_8px_30px_rgba(47,39,26,0.035)] sm:px-8 sm:py-9">
                <div className="absolute -right-10 -top-20 h-56 w-56 rounded-full border border-[#E7D9C6]/60" />
                <div className="absolute -right-1 top-8 h-36 w-36 rounded-full border border-[#E7D9C6]/50" />
                <p className="relative mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#927A5B]">
                  Your studio, at a glance
                </p>
                <h2 className="relative font-editorial text-4xl font-medium leading-none tracking-[-0.025em] text-[#191919] sm:text-5xl">
                  Welcome back
                </h2>
                <p className="relative mt-3 max-w-xl text-sm leading-6 text-[#77736D] sm:text-base">
                  Manage your studio, track projects, and stay connected with your clients.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[
                  {
                    title: 'Published projects',
                    value: projects.length,
                    description: 'Projects in your studio portfolio',
                    icon: FolderKanban,
                    tone: 'bg-[#F3EADD] text-[#826A48]',
                    target: 'projects'
                  },
                  {
                    title: 'Consultation bookings',
                    value: consultations.length,
                    description: `${newConsultsCount} new requests to review`,
                    icon: CalendarCheck,
                    tone: 'bg-[#E8EFEB] text-[#547A69]',
                    target: 'consultations'
                  },
                  {
                    title: 'Contact messages',
                    value: contactMessages.length,
                    description: `${unreadMessagesCount} unread messages`,
                    icon: MessageSquareText,
                    tone: 'bg-[#EEE9E1] text-[#89765B]',
                    target: 'messages'
                  }
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <button
                      key={stat.title}
                      type="button"
                      onClick={() => setAdminSidebarTab(stat.target)}
                      className="group rounded-2xl border border-[#E9E5DE] bg-white p-5 text-left shadow-[0_4px_18px_rgba(47,39,26,0.025)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D9CBB5] hover:shadow-[0_12px_28px_rgba(47,39,26,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8AD89] sm:p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-[#77736D]">{stat.title}</p>
                          <p className="mt-4 font-editorial text-5xl leading-none text-[#191919]">{stat.value}</p>
                        </div>
                        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.tone}`}>
                          <Icon className="h-5 w-5" />
                        </span>
                      </div>
                      <div className="mt-5 flex items-center justify-between border-t border-[#F0EDE7] pt-4">
                        <span className="text-xs text-[#8A867F]">{stat.description}</span>
                        <ArrowRight className="h-4 w-4 text-[#A59A88] transition-transform group-hover:translate-x-1" />
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
                <section className="rounded-2xl border border-[#E9E5DE] bg-white p-5 shadow-[0_4px_18px_rgba(47,39,26,0.025)] sm:p-6">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-[#282723]">Recent consultation requests</h3>
                      <p className="mt-1 text-xs text-[#8A867F]">The latest client enquiries submitted to your studio.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAdminSidebarTab('consultations')}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#806B4E] hover:text-[#5C4B35]"
                    >
                      View all <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {consultations.length === 0 ? (
                    <p className="rounded-xl bg-[#F8F6F1] px-4 py-5 text-sm text-[#817C73]">New requests will appear here.</p>
                  ) : (
                    <div className="divide-y divide-[#F0EDE7]">
                      {consultations.slice(0, 3).map((consultation) => (
                        <button
                          key={consultation.id}
                          type="button"
                          onClick={() => {
                            setAdminSidebarTab('consultations');
                            setSelectedAdminItem({ type: 'consultation', item: consultation });
                          }}
                          className="flex w-full items-center justify-between gap-4 py-3 text-left first:pt-0 last:pb-0"
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium text-[#34312C]">{consultation.fullName}</span>
                            <span className="mt-1 block truncate text-xs text-[#8A867F]">
                              {consultation.projectType} · {formatAdminDate(consultation.createdAt)}
                            </span>
                          </span>
                          <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getAdminStatusStyle(consultation.status)}`}>
                            {consultation.status}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </section>

                <section className="rounded-2xl border border-[#E9E5DE] bg-white p-5 shadow-[0_4px_18px_rgba(47,39,26,0.025)] sm:p-6">
                  <div className="mb-5">
                    <h3 className="text-sm font-semibold text-[#282723]">Quick actions</h3>
                    <p className="mt-1 text-xs text-[#8A867F]">Frequently used studio shortcuts.</p>
                  </div>
                  <div className="grid gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAdminSidebarTab('projects');
                        setEditingProjectId(null);
                        setProjectSubTab('form');
                      }}
                      className="flex items-center justify-between rounded-xl border border-[#E9E5DE] px-3.5 py-3 text-left text-sm font-medium text-[#48443D] transition-colors hover:border-[#D6C6AD] hover:bg-[#FBF9F5]"
                    >
                      <span className="flex items-center gap-3"><Plus className="h-4 w-4 text-[#977B54]" /> Add a project</span>
                      <ChevronRight className="h-4 w-4 text-[#A59A88]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminSidebarTab('consultations')}
                      className="flex items-center justify-between rounded-xl border border-[#E9E5DE] px-3.5 py-3 text-left text-sm font-medium text-[#48443D] transition-colors hover:border-[#D6C6AD] hover:bg-[#FBF9F5]"
                    >
                      <span className="flex items-center gap-3"><CalendarCheck className="h-4 w-4 text-[#977B54]" /> Review consultations</span>
                      <ChevronRight className="h-4 w-4 text-[#A59A88]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminSidebarTab('messages')}
                      className="flex items-center justify-between rounded-xl border border-[#E9E5DE] px-3.5 py-3 text-left text-sm font-medium text-[#48443D] transition-colors hover:border-[#D6C6AD] hover:bg-[#FBF9F5]"
                    >
                      <span className="flex items-center gap-3"><Inbox className="h-4 w-4 text-[#977B54]" /> Open contact inbox</span>
                      <ChevronRight className="h-4 w-4 text-[#A59A88]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('home')}
                      className="flex items-center justify-between rounded-xl border border-[#E9E5DE] px-3.5 py-3 text-left text-sm font-medium text-[#48443D] transition-colors hover:border-[#D6C6AD] hover:bg-[#FBF9F5]"
                    >
                      <span className="flex items-center gap-3"><ArrowUpRight className="h-4 w-4 text-[#977B54]" /> View live website</span>
                      <ChevronRight className="h-4 w-4 text-[#A59A88]" />
                    </button>
                  </div>
                </section>
              </div>
            </section>
          )}

          {/* TAB 2: PROJECTS */}
          {adminSidebarTab === 'projects' && (
            <section className="space-y-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#927A5B]">Selected work</p>
                  <h2 className="font-editorial text-4xl leading-none tracking-[-0.02em] text-[#191919] sm:text-5xl">
                    {projectSubTab === 'form' ? (editingProjectId ? 'Edit project' : 'Add a project') : 'Portfolio projects'}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[#77736D]">
                    Curate the residential and commercial work shown across the LUMORA portfolio.
                  </p>
                </div>
                {projectSubTab === 'list' ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProjectId(null);
                      setProjectForm({
                        title: '',
                        category: 'Residential',
                        location: 'New Cairo, Egypt',
                        area: '',
                        year: '2026',
                        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80',
                        summary: '',
                        challenge: '',
                        outcome: ''
                      });
                      setProjectSubTab('form');
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#191919] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#393733] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8AD89] focus-visible:ring-offset-2"
                  >
                    <Plus className="h-4 w-4" /> Add project
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProjectId(null);
                      setProjectSubTab('list');
                    }}
                    className="rounded-xl border border-[#DED9D0] bg-white px-4 py-2.5 text-sm font-medium text-[#514D46] transition-colors hover:bg-[#F6F3ED]"
                  >
                    Back to portfolio
                  </button>
                )}
              </div>

              {projectSubTab === 'list' ? (
                <>
                  <div className="flex flex-col gap-3 rounded-2xl border border-[#E9E5DE] bg-white p-4 shadow-[0_4px_18px_rgba(47,39,26,0.025)] sm:flex-row sm:items-center">
                    <label className="relative min-w-0 flex-1">
                      <span className="sr-only">Search projects</span>
                      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A958B]" />
                      <input
                        type="search"
                        value={adminProjectSearch}
                        onChange={(e) => setAdminProjectSearch(e.target.value)}
                        placeholder="Search projects, locations..."
                        className="w-full rounded-xl border border-[#E9E5DE] bg-[#FBFAF7] py-2.5 pl-10 pr-3 text-sm text-[#34312C] outline-none transition focus:border-[#C8AD89] focus:ring-2 focus:ring-[#C8AD89]/20"
                      />
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium text-[#77736D]">
                      Category
                      <select
                        value={adminProjectCategory}
                        onChange={(e) => setAdminProjectCategory(e.target.value)}
                        className="rounded-xl border border-[#E9E5DE] bg-white px-3 py-2.5 text-sm text-[#34312C] outline-none focus:border-[#C8AD89]"
                      >
                        <option>All</option>
                        <option>Residential</option>
                        <option>Commercial</option>
                      </select>
                    </label>
                  </div>

                  {visibleAdminProjects.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#DCD6CB] bg-white px-6 py-14 text-center">
                      <FolderKanban className="mx-auto h-8 w-8 text-[#B5A68D]" />
                      <h3 className="mt-4 text-base font-semibold text-[#302E2A]">
                        {projects.length === 0 ? 'Your portfolio is ready for its first project' : 'No projects match these filters'}
                      </h3>
                      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#817C73]">
                        {projects.length === 0
                          ? 'Add a project to begin building your studio portfolio.'
                          : 'Try a different search term or category.'}
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs text-[#8A867F]">
                        Showing {visibleAdminProjects.length} of {projects.length} projects
                      </p>
                      <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                        {visibleAdminProjects.map((project) => (
                          <article
                            key={project.id}
                            className="group overflow-hidden rounded-2xl border border-[#E9E5DE] bg-white shadow-[0_4px_18px_rgba(47,39,26,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D9CBB5] hover:shadow-[0_14px_32px_rgba(47,39,26,0.09)]"
                          >
                            <div className="relative aspect-[16/10] overflow-hidden bg-[#EAE5DC]">
                              <img
                                src={project.image}
                                alt={project.title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                              />
                              <span className="absolute left-4 top-4 rounded-full border border-white/60 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#51483B] backdrop-blur">
                                {project.category}
                              </span>
                            </div>
                            <div className="p-5">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <h3 className="truncate font-editorial text-2xl leading-tight text-[#25231F]">{project.title}</h3>
                                  <p className="mt-1.5 flex items-center gap-1.5 truncate text-xs text-[#827D73]">
                                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                                    {project.location}
                                  </p>
                                </div>
                                <span className="shrink-0 rounded-lg bg-[#F5F2EC] px-2.5 py-1.5 text-xs font-medium text-[#756B5C]">
                                  {project.createdAt ? formatAdminDate(project.createdAt) : `Year ${project.year}`}
                                </span>
                              </div>
                              <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#77736D]">{project.summary}</p>
                              <div className="mt-5 flex items-center justify-between border-t border-[#F0EDE7] pt-4">
                                <span className="text-xs text-[#8A867F]">{project.area || 'Area not specified'}</span>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    aria-label={`Edit ${project.title}`}
                                    onClick={() => startEditProject(project)}
                                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-[#67563E] transition-colors hover:bg-[#F5F0E7]"
                                  >
                                    <Edit3 className="h-3.5 w-3.5" /> Edit
                                  </button>
                                  <button
                                    type="button"
                                    aria-label={`Delete ${project.title}`}
                                    onClick={() => setPendingAdminDelete({ type: 'project', id: project.id, label: project.title })}
                                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-[#A55E57] transition-colors hover:bg-[#FBF0EE]"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" /> Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <form
                  onSubmit={handleSaveProject}
                  className="max-w-4xl space-y-6 rounded-2xl border border-[#E9E5DE] bg-white p-5 shadow-[0_8px_28px_rgba(47,39,26,0.04)] sm:p-8"
                >
                  <div className="border-b border-[#F0EDE7] pb-5">
                    <h3 className="text-sm font-semibold text-[#302E2A]">Project information</h3>
                    <p className="mt-1 text-xs text-[#8A867F]">Fields marked with * are required to publish this project.</p>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="project-title" className="mb-1.5 block text-xs font-semibold text-[#514D46]">Project title *</label>
                      <input
                        id="project-title"
                        type="text"
                        required
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        placeholder="e.g. Swan Lake Residence"
                        className="w-full rounded-xl border border-[#E3DED5] bg-[#FDFCF9] px-3.5 py-3 text-sm outline-none transition focus:border-[#C8AD89] focus:ring-2 focus:ring-[#C8AD89]/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="project-category" className="mb-1.5 block text-xs font-semibold text-[#514D46]">Category</label>
                      <select
                        id="project-category"
                        value={projectForm.category}
                        onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                        className="w-full rounded-xl border border-[#E3DED5] bg-[#FDFCF9] px-3.5 py-3 text-sm outline-none focus:border-[#C8AD89]"
                      >
                        <option>Residential</option>
                        <option>Commercial</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="project-location" className="mb-1.5 block text-xs font-semibold text-[#514D46]">Location</label>
                      <input
                        id="project-location"
                        type="text"
                        value={projectForm.location}
                        onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                        className="w-full rounded-xl border border-[#E3DED5] bg-[#FDFCF9] px-3.5 py-3 text-sm outline-none focus:border-[#C8AD89]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="project-area" className="mb-1.5 block text-xs font-semibold text-[#514D46]">Area</label>
                        <input
                          id="project-area"
                          type="text"
                          value={projectForm.area}
                          onChange={(e) => setProjectForm({ ...projectForm, area: e.target.value })}
                          placeholder="640 sqm"
                          className="w-full rounded-xl border border-[#E3DED5] bg-[#FDFCF9] px-3.5 py-3 text-sm outline-none focus:border-[#C8AD89]"
                        />
                      </div>
                      <div>
                        <label htmlFor="project-year" className="mb-1.5 block text-xs font-semibold text-[#514D46]">Year</label>
                        <input
                          id="project-year"
                          type="text"
                          value={projectForm.year}
                          onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                          className="w-full rounded-xl border border-[#E3DED5] bg-[#FDFCF9] px-3.5 py-3 text-sm outline-none focus:border-[#C8AD89]"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="project-image" className="mb-1.5 block text-xs font-semibold text-[#514D46]">Cover image URL</label>
                      <input
                        id="project-image"
                        type="url"
                        value={projectForm.image}
                        onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                        className="w-full rounded-xl border border-[#E3DED5] bg-[#FDFCF9] px-3.5 py-3 text-sm outline-none focus:border-[#C8AD89]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="project-summary" className="mb-1.5 block text-xs font-semibold text-[#514D46]">Project summary *</label>
                      <textarea
                        id="project-summary"
                        rows={3}
                        required
                        value={projectForm.summary}
                        onChange={(e) => setProjectForm({ ...projectForm, summary: e.target.value })}
                        className="w-full resize-y rounded-xl border border-[#E3DED5] bg-[#FDFCF9] px-3.5 py-3 text-sm leading-6 outline-none focus:border-[#C8AD89]"
                      />
                    </div>
                    <div>
                      <label htmlFor="project-challenge" className="mb-1.5 block text-xs font-semibold text-[#514D46]">Architectural challenge</label>
                      <textarea
                        id="project-challenge"
                        rows={3}
                        value={projectForm.challenge}
                        onChange={(e) => setProjectForm({ ...projectForm, challenge: e.target.value })}
                        className="w-full resize-y rounded-xl border border-[#E3DED5] bg-[#FDFCF9] px-3.5 py-3 text-sm leading-6 outline-none focus:border-[#C8AD89]"
                      />
                    </div>
                    <div>
                      <label htmlFor="project-outcome" className="mb-1.5 block text-xs font-semibold text-[#514D46]">Delivered outcome</label>
                      <textarea
                        id="project-outcome"
                        rows={3}
                        value={projectForm.outcome}
                        onChange={(e) => setProjectForm({ ...projectForm, outcome: e.target.value })}
                        className="w-full resize-y rounded-xl border border-[#E3DED5] bg-[#FDFCF9] px-3.5 py-3 text-sm leading-6 outline-none focus:border-[#C8AD89]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 border-t border-[#F0EDE7] pt-5">
                    <button type="submit" className="rounded-xl bg-[#191919] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#393733]">
                      {editingProjectId ? 'Save project changes' : 'Publish project'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProjectId(null);
                        setProjectSubTab('list');
                      }}
                      className="rounded-xl border border-[#DED9D0] px-5 py-3 text-sm font-medium text-[#514D46] transition-colors hover:bg-[#F6F3ED]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </section>
          )}

          {/* TAB 3: CONSULTATIONS */}
          {adminSidebarTab === 'consultations' && (
            <section className="space-y-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#927A5B]">Client relations</p>
                  <h2 className="font-editorial text-4xl leading-none tracking-[-0.02em] text-[#191919] sm:text-5xl">Consultations</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[#77736D]">
                    Review project briefs, follow up with clients, and keep each request moving.
                  </p>
                </div>
                <div className="rounded-xl border border-[#E9E5DE] bg-white px-4 py-2.5 text-xs text-[#77736D]">
                  <span className="font-semibold text-[#302E2A]">{consultations.length}</span> total requests
                </div>
              </div>

              <div className="flex flex-col gap-3 rounded-2xl border border-[#E9E5DE] bg-white p-4 shadow-[0_4px_18px_rgba(47,39,26,0.025)] sm:flex-row sm:items-center">
                <label className="relative min-w-0 flex-1">
                  <span className="sr-only">Search consultations</span>
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A958B]" />
                  <input
                    type="search"
                    value={consultationSearch}
                    onChange={(e) => setConsultationSearch(e.target.value)}
                    placeholder="Search by client, email, phone, or location..."
                    className="w-full rounded-xl border border-[#E9E5DE] bg-[#FBFAF7] py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#C8AD89] focus:ring-2 focus:ring-[#C8AD89]/20"
                  />
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-[#77736D]">
                  Status
                  <select
                    value={consultationStatusFilter}
                    onChange={(e) => setConsultationStatusFilter(e.target.value)}
                    className="rounded-xl border border-[#E9E5DE] bg-white px-3 py-2.5 text-sm text-[#34312C] outline-none focus:border-[#C8AD89]"
                  >
                    <option>All</option>
                    <option>New</option>
                    <option>Contacted</option>
                    <option>Consultation Scheduled</option>
                    <option>Proposal Sent</option>
                  </select>
                </label>
              </div>

              {visibleConsultations.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#DCD6CB] bg-white px-6 py-14 text-center">
                  <CalendarCheck className="mx-auto h-8 w-8 text-[#B5A68D]" />
                  <h3 className="mt-4 text-base font-semibold text-[#302E2A]">
                    {consultations.length === 0 ? 'No consultation requests yet' : 'No requests match these filters'}
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#817C73]">
                    {consultations.length === 0
                      ? 'New submissions from the consultation form will appear here.'
                      : 'Adjust your search or status filter to find a request.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {visibleConsultations.map((consultation) => (
                    <article
                      key={consultation.id}
                      className="rounded-2xl border border-[#E9E5DE] bg-white p-5 shadow-[0_4px_18px_rgba(47,39,26,0.025)] transition-all hover:border-[#DDD3C3] hover:shadow-[0_10px_26px_rgba(47,39,26,0.06)] sm:p-6"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h3 className="font-editorial text-2xl leading-tight text-[#25231F]">{consultation.fullName}</h3>
                            <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getAdminStatusStyle(consultation.status)}`}>
                              {consultation.status}
                            </span>
                            <span className="rounded-full bg-[#F3F0EA] px-2.5 py-1 text-[10px] font-medium text-[#746956]">
                              {consultation.projectType}
                            </span>
                          </div>
                          <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2 xl:grid-cols-3">
                            <p className="flex min-w-0 items-center gap-2 text-xs text-[#6F6B63]">
                              <Mail className="h-3.5 w-3.5 shrink-0 text-[#9A8B72]" />
                              <span className="truncate">{consultation.email}</span>
                            </p>
                            <p className="flex min-w-0 items-center gap-2 text-xs text-[#6F6B63]">
                              <Phone className="h-3.5 w-3.5 shrink-0 text-[#9A8B72]" />
                              <span className="truncate">{consultation.phone}</span>
                            </p>
                            <p className="flex min-w-0 items-center gap-2 text-xs text-[#6F6B63]">
                              <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[#9A8B72]" />
                              <span>Requested {consultation.preferredDate || 'Flexible'}</span>
                            </p>
                            <p className="flex min-w-0 items-center gap-2 text-xs text-[#6F6B63]">
                              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#9A8B72]" />
                              <span className="truncate">{consultation.location || 'Location not provided'}{consultation.size ? ` · ${consultation.size}` : ''}</span>
                            </p>
                            <p className="flex min-w-0 items-center gap-2 text-xs text-[#6F6B63]">
                              <span className="h-3.5 w-3.5 shrink-0 text-center font-semibold text-[#9A8B72]">₤</span>
                              <span>{consultation.budget || 'Budget not provided'}</span>
                            </p>
                            <p className="flex min-w-0 items-center gap-2 text-xs text-[#6F6B63]">
                              <Clock className="h-3.5 w-3.5 shrink-0 text-[#9A8B72]" />
                              <span>Received {formatAdminDate(consultation.createdAt)}</span>
                            </p>
                          </div>
                          {consultation.details && (
                            <p className="mt-4 line-clamp-2 border-t border-[#F0EDE7] pt-3 text-sm leading-6 text-[#77736D]">
                              {consultation.details}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 lg:w-48 lg:justify-end">
                          <label className="sr-only" htmlFor={`consultation-status-${consultation.id}`}>Update status</label>
                          <select
                            id={`consultation-status-${consultation.id}`}
                            value={consultation.status}
                            onChange={(e) => handleUpdateConsultationStatus(consultation.id, e.target.value)}
                            className="min-w-0 flex-1 rounded-xl border border-[#E4DED3] bg-[#FBFAF7] px-3 py-2.5 text-xs text-[#514D46] outline-none focus:border-[#C8AD89] lg:w-full lg:flex-none"
                          >
                            <option>New</option>
                            <option>Contacted</option>
                            <option>Consultation Scheduled</option>
                            <option>Proposal Sent</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => setSelectedAdminItem({ type: 'consultation', item: consultation })}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E4DED3] bg-white px-3 py-2.5 text-xs font-medium text-[#5D554A] transition-colors hover:bg-[#F6F3ED]"
                          >
                            <Eye className="h-3.5 w-3.5" /> Details
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* TAB 4: CONTACT MESSAGES */}
          {adminSidebarTab === 'messages' && (
            <section className="space-y-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#927A5B]">Client relations</p>
                  <h2 className="font-editorial text-4xl leading-none tracking-[-0.02em] text-[#191919] sm:text-5xl">Contact inbox</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[#77736D]">
                    Read incoming project enquiries and keep your follow-up status up to date.
                  </p>
                </div>
                <div className="rounded-xl border border-[#E9E5DE] bg-white px-4 py-2.5 text-xs text-[#77736D]">
                  <span className="font-semibold text-[#302E2A]">{unreadMessagesCount}</span> unread
                </div>
              </div>

              <div className="flex flex-col gap-3 rounded-2xl border border-[#E9E5DE] bg-white p-4 shadow-[0_4px_18px_rgba(47,39,26,0.025)] sm:flex-row sm:items-center">
                <label className="relative min-w-0 flex-1">
                  <span className="sr-only">Search contact messages</span>
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A958B]" />
                  <input
                    type="search"
                    value={contactSearch}
                    onChange={(e) => setContactSearch(e.target.value)}
                    placeholder="Search by sender, subject, or message..."
                    className="w-full rounded-xl border border-[#E9E5DE] bg-[#FBFAF7] py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#C8AD89] focus:ring-2 focus:ring-[#C8AD89]/20"
                  />
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-[#77736D]">
                  Status
                  <select
                    value={contactStatusFilter}
                    onChange={(e) => setContactStatusFilter(e.target.value)}
                    className="rounded-xl border border-[#E9E5DE] bg-white px-3 py-2.5 text-sm text-[#34312C] outline-none focus:border-[#C8AD89]"
                  >
                    <option>All</option>
                    <option>Unread</option>
                    <option>Replied</option>
                    <option>Archived</option>
                  </select>
                </label>
              </div>

              {visibleContactMessages.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#DCD6CB] bg-white px-6 py-14 text-center">
                  <Inbox className="mx-auto h-8 w-8 text-[#B5A68D]" />
                  <h3 className="mt-4 text-base font-semibold text-[#302E2A]">
                    {contactMessages.length === 0 ? 'Your inbox is clear' : 'No messages match these filters'}
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#817C73]">
                    {contactMessages.length === 0
                      ? 'Messages sent through the public contact form will appear here.'
                      : 'Try a different search term or status filter.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {visibleContactMessages.map((message) => (
                    <article
                      key={message.id}
                      className={`rounded-2xl border bg-white p-5 shadow-[0_4px_18px_rgba(47,39,26,0.025)] transition-all hover:border-[#DDD3C3] hover:shadow-[0_10px_26px_rgba(47,39,26,0.06)] sm:p-6 ${
                        message.status === 'Unread' ? 'border-[#DCCCB4]' : 'border-[#E9E5DE]'
                      }`}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 gap-3.5">
                          <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                            message.status === 'Unread' ? 'bg-[#F4EBDD] text-[#806B4E]' : 'bg-[#F1EFEB] text-[#77736D]'
                          }`}>
                            {message.status === 'Unread' ? <Mail className="h-4 w-4" /> : <UserRound className="h-4 w-4" />}
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="truncate text-sm font-semibold text-[#302E2A]">{message.fullName}</h3>
                              {message.status === 'Unread' && <span className="h-1.5 w-1.5 rounded-full bg-[#D49A48]" />}
                              <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getAdminStatusStyle(message.status)}`}>
                                {message.status}
                              </span>
                            </div>
                            <p className="mt-1 truncate text-sm font-medium text-[#57534C]">{message.subject}</p>
                            <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#817C73]">{message.message}</p>
                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#918C83]">
                              <span className="inline-flex items-center gap-1.5"><Mail className="h-3 w-3" />{message.email}</span>
                              {message.phone && <span className="inline-flex items-center gap-1.5"><Phone className="h-3 w-3" />{message.phone}</span>}
                              <span className="inline-flex items-center gap-1.5"><Clock className="h-3 w-3" />{formatAdminDate(message.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2 sm:pl-3">
                          <label className="sr-only" htmlFor={`contact-status-${message.id}`}>Update message status</label>
                          <select
                            id={`contact-status-${message.id}`}
                            value={message.status}
                            onChange={(e) => handleUpdateContactStatus(message.id, e.target.value)}
                            className="rounded-xl border border-[#E4DED3] bg-[#FBFAF7] px-3 py-2.5 text-xs text-[#514D46] outline-none focus:border-[#C8AD89]"
                          >
                            <option>Unread</option>
                            <option>Replied</option>
                            <option>Archived</option>
                          </select>
                          <button
                            type="button"
                            aria-label={`View message from ${message.fullName}`}
                            onClick={() => setSelectedAdminItem({ type: 'contact', item: message })}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#E4DED3] text-[#67563E] transition-colors hover:bg-[#F5F0E7]"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            aria-label={`Delete message from ${message.fullName}`}
                            onClick={() => setPendingAdminDelete({ type: 'contact', id: message.id, label: message.subject || message.fullName })}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#E4DED3] text-[#A55E57] transition-colors hover:border-[#E9C9C4] hover:bg-[#FBF0EE]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {selectedAdminItem && (
            <div
              role="presentation"
              onClick={() => setSelectedAdminItem(null)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-[#171715]/45 p-4 backdrop-blur-sm"
            >
              <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="admin-detail-title"
                onClick={(event) => event.stopPropagation()}
                className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#E9E5DE] bg-white p-6 shadow-2xl sm:p-8"
              >
                <div className="flex items-start justify-between gap-4 border-b border-[#F0EDE7] pb-5">
                  <div>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#927A5B]">
                      {selectedAdminItem.type === 'consultation' ? 'Consultation request' : 'Contact message'}
                    </p>
                    <h2 id="admin-detail-title" className="font-editorial text-3xl leading-tight text-[#25231F]">
                      {selectedAdminItem.type === 'consultation'
                        ? selectedAdminItem.item.fullName
                        : selectedAdminItem.item.subject}
                    </h2>
                  </div>
                  <button
                    type="button"
                    aria-label="Close details"
                    onClick={() => setSelectedAdminItem(null)}
                    className="rounded-lg p-2 text-[#77736D] transition-colors hover:bg-[#F3F0EA]"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {selectedAdminItem.type === 'consultation' ? (
                  <div className="space-y-5 pt-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getAdminStatusStyle(selectedAdminItem.item.status)}`}>
                        {selectedAdminItem.item.status}
                      </span>
                      <span className="rounded-full bg-[#F3F0EA] px-2.5 py-1 text-[10px] font-medium text-[#746956]">
                        {selectedAdminItem.item.projectType}
                      </span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {[
                        ['Email', selectedAdminItem.item.email],
                        ['Phone', selectedAdminItem.item.phone],
                        ['Requested date', selectedAdminItem.item.preferredDate || 'Flexible'],
                        ['Submitted', formatAdminDate(selectedAdminItem.item.createdAt)],
                        ['Location', selectedAdminItem.item.location || 'Not provided'],
                        ['Property size', selectedAdminItem.item.size || 'Not provided'],
                        ['Budget', selectedAdminItem.item.budget || 'Not provided']
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-xl bg-[#F8F6F1] p-3.5">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#918C83]">{label}</p>
                          <p className="mt-1.5 break-words text-sm text-[#45413A]">{value}</p>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-semibold text-[#514D46]">Project description</p>
                      <p className="whitespace-pre-wrap rounded-xl bg-[#F8F6F1] p-4 text-sm leading-6 text-[#6F6B63]">
                        {selectedAdminItem.item.details || 'No project description was provided.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5 pt-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getAdminStatusStyle(selectedAdminItem.item.status)}`}>
                        {selectedAdminItem.item.status}
                      </span>
                      <span className="text-xs text-[#8A867F]">Received {formatAdminDate(selectedAdminItem.item.createdAt)}</span>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl bg-[#F8F6F1] p-3.5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#918C83]">From</p>
                        <p className="mt-1.5 text-sm text-[#45413A]">{selectedAdminItem.item.fullName}</p>
                      </div>
                      <div className="rounded-xl bg-[#F8F6F1] p-3.5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#918C83]">Email</p>
                        <p className="mt-1.5 break-words text-sm text-[#45413A]">{selectedAdminItem.item.email}</p>
                      </div>
                      {selectedAdminItem.item.phone && (
                        <div className="rounded-xl bg-[#F8F6F1] p-3.5">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#918C83]">Phone</p>
                          <p className="mt-1.5 text-sm text-[#45413A]">{selectedAdminItem.item.phone}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-semibold text-[#514D46]">Message</p>
                      <p className="whitespace-pre-wrap rounded-xl bg-[#F8F6F1] p-4 text-sm leading-6 text-[#6F6B63]">{selectedAdminItem.item.message}</p>
                    </div>
                  </div>
                )}
                <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-[#F0EDE7] pt-5">
                  {selectedAdminItem.type === 'contact' && (
                    <a
                      href={`mailto:${selectedAdminItem.item.email}?subject=${encodeURIComponent(`Re: ${selectedAdminItem.item.subject || 'Project inquiry'}`)}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#191919] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#393733]"
                    >
                      <Send className="h-4 w-4" /> Reply by email
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setPendingAdminDelete({
                        type: selectedAdminItem.type,
                        id: selectedAdminItem.item.id,
                        label: selectedAdminItem.type === 'consultation'
                          ? selectedAdminItem.item.fullName
                          : selectedAdminItem.item.subject || selectedAdminItem.item.fullName
                      });
                      setSelectedAdminItem(null);
                    }}
                    className="rounded-xl border border-[#E9C9C4] px-4 py-2.5 text-sm font-medium text-[#A55E57] transition-colors hover:bg-[#FBF0EE]"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedAdminItem(null)}
                    className="rounded-xl border border-[#DED9D0] px-4 py-2.5 text-sm font-medium text-[#514D46] transition-colors hover:bg-[#F6F3ED]"
                  >
                    Close
                  </button>
                </div>
              </section>
            </div>
          )}

          {pendingAdminDelete && (
            <div
              role="presentation"
              onClick={() => setPendingAdminDelete(null)}
              className="fixed inset-0 z-[60] flex items-center justify-center bg-[#171715]/45 p-4 backdrop-blur-sm"
            >
              <section
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-delete-title"
                onClick={(event) => event.stopPropagation()}
                className="w-full max-w-md rounded-2xl border border-[#E9E5DE] bg-white p-6 shadow-2xl"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FBF0EE] text-[#B25F57]">
                  <Trash2 className="h-5 w-5" />
                </div>
                <h2 id="confirm-delete-title" className="mt-4 text-base font-semibold text-[#302E2A]">Delete this item?</h2>
                <p className="mt-2 text-sm leading-6 text-[#77736D]">
                  “{pendingAdminDelete.label}” will be permanently removed. This action cannot be undone.
                </p>
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setPendingAdminDelete(null)}
                    className="rounded-xl border border-[#DED9D0] px-4 py-2.5 text-sm font-medium text-[#514D46] hover:bg-[#F6F3ED]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmAdminDelete}
                    className="rounded-xl bg-[#B25F57] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#984C46]"
                  >
                    Delete permanently
                  </button>
                </div>
              </section>
            </div>
          )}
          </div>
        </main>
      </div>
    );
  }

  // ---------------- PUBLIC WEBSITE ----------------
  const activeNavRoute = route === 'service-detail'
    ? 'services'
    : route === 'project-detail'
      ? 'projects'
      : route;

  return (
    <div className="min-h-screen overflow-x-clip bg-[#F7F5F0] text-[#191918]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-[#191918] focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-[#191918]/[0.07] bg-[#F7F5F0]/95 backdrop-blur-xl">
        <nav
          aria-label="Primary navigation"
          className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-10"
        >
          <button
            type="button"
            onClick={() => navigate('home')}
            aria-label="LUMORA home"
            className="shrink-0 text-left"
          >
            <span className="block font-editorial text-[1.65rem] font-semibold leading-none tracking-[0.1em] text-[#191918]">
              LUMORA
            </span>
            <span className="mt-1 block text-[8px] font-semibold uppercase tracking-[0.25em] text-[#8A7B63]">
              Interiors · New Cairo
            </span>
          </button>

          <div className="hidden items-center gap-5 xl:flex">
            {navLinks.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-current={activeNavRoute === item.id ? 'page' : undefined}
                onClick={() => navigate(item.id)}
                className={`relative py-2 text-[12px] font-medium transition-colors ${
                  activeNavRoute === item.id ? 'text-[#191918]' : 'text-[#77736D] hover:text-[#191918]'
                }`}
              >
                {item.label}
                {activeNavRoute === item.id && (
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-[#C6AA83]" />
                )}
              </button>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2.5">
            <button
              type="button"
              onClick={() => navigate('consultation')}
              className="studio-button-primary hidden text-xs font-medium sm:inline-flex"
            >
              Book a consultation <ArrowUpRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              className="inline-flex h-10 w-10 items-center justify-center border border-[#DCD6CB] text-[#403D38] transition-colors hover:bg-[#EEEAE2] xl:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="fixed inset-x-0 bottom-0 top-[76px] z-30 overflow-y-auto bg-[#F7F5F0] px-6 pb-8 pt-8 xl:hidden sm:px-8"
        >
          <nav aria-label="Mobile navigation" className="mx-auto flex max-w-xl flex-col">
            {navLinks.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.id)}
                className={`flex items-center justify-between border-b border-[#191918]/10 py-4 text-left font-editorial text-3xl transition-colors hover:text-[#8A7352] ${
                  activeNavRoute === item.id ? 'text-[#8A7352]' : 'text-[#191918]'
                }`}
              >
                <span>{item.label}</span>
                <span className="text-sm font-sans text-[#A59A88]">0{index + 1}</span>
              </button>
            ))}
            <div className="mt-8 border-t border-[#191918]/10 pt-6">
              <p className="mb-4 text-xs text-[#77736D]">New Cairo, Egypt · +20 100 000 0000</p>
              <button
                type="button"
                onClick={() => navigate('consultation')}
                className="studio-button-primary w-full text-sm font-medium"
              >
                Book a consultation <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </nav>
        </div>
      )}

      <main id="main-content" className="min-h-[65vh]">
        {route === 'home' && (
          <>
            <section className="mx-auto max-w-[1440px] px-5 pb-16 pt-10 sm:px-8 lg:px-10 lg:pb-20 lg:pt-14">
              <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
                <div className="relative z-10 lg:col-span-5 lg:py-12">
                  <p className="studio-eyebrow mb-6 flex items-center gap-3">
                    <span className="h-px w-8 bg-[#C6AA83]" />
                    Architecture · Interiors · New Cairo
                  </p>
                  <h1 className="studio-display max-w-[750px] text-[#191918]">
                    Spaces designed <span className="italic text-[#806F55]">to inspire.</span>
                  </h1>
                  <p className="studio-copy mt-7 max-w-[510px] text-[15px] sm:text-base">
                    We architect and execute bespoke villas, corporate headquarters, and flagship commercial interiors across Egypt with fixed milestone budgets and single-point engineering accountability.
                  </p>
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => navigate('consultation')}
                      className="studio-button-primary text-sm font-medium"
                    >
                      Book a consultation <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('projects')}
                      className="studio-button-secondary text-sm font-medium"
                    >
                      Explore the portfolio
                    </button>
                  </div>
                  <div className="mt-10 flex items-center gap-3 text-[11px] text-[#77736D]">
                    <span className="flex -space-x-1.5" aria-hidden="true">
                      <span className="h-2 w-2 rounded-full bg-[#C6AA83]" />
                      <span className="h-2 w-2 rounded-full bg-[#D8C7AD]" />
                      <span className="h-2 w-2 rounded-full bg-[#B7A58B]" />
                    </span>
                    Thoughtful spaces, made to last.
                  </div>
                </div>

                <div className="relative lg:col-span-7">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#E5DED2] sm:aspect-[1.45/1] lg:aspect-[1.04/1]">
                    <img
                      src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=85"
                      alt="Sunlit contemporary living space with natural stone, warm timber, and sculptural furniture"
                      loading="eager"
                      className="h-full w-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#191918]/35 via-transparent to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-white sm:bottom-7 sm:left-7 sm:right-7">
                      <div>
                        <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/75">A considered point of view</p>
                        <p className="mt-1 font-editorial text-2xl sm:text-3xl">Quiet luxury, with purpose.</p>
                      </div>
                      <span className="hidden border-l border-white/50 pl-3 text-[9px] uppercase tracking-[0.16em] sm:block">
                        Cairo · Egypt
                      </span>
                    </div>
                  </div>
                  <div className="absolute -bottom-5 -left-4 hidden h-24 w-24 border border-[#C6AA83]/70 lg:block" />
                </div>
              </div>

              <div className="mt-14 grid gap-5 border-y border-[#191918]/15 py-6 sm:grid-cols-3 sm:gap-8">
                <div className="flex items-center gap-4">
                  <span className="font-editorial text-4xl leading-none text-[#191918]">85+</span>
                  <span className="max-w-28 text-[10px] uppercase leading-4 tracking-[0.13em] text-[#77736D]">Completed residential and commercial projects</span>
                </div>
                <div className="flex items-center gap-4 border-[#191918]/10 sm:border-l sm:pl-8">
                  <span className="font-editorial text-4xl leading-none text-[#191918]">5+</span>
                  <span className="max-w-28 text-[10px] uppercase leading-4 tracking-[0.13em] text-[#77736D]">Years shaping spaces in New Cairo</span>
                </div>
                <div className="flex items-center gap-4 border-[#191918]/10 sm:border-l sm:pl-8">
                  <span className="font-editorial text-2xl leading-none text-[#806F55]">One studio</span>
                  <span className="max-w-32 text-[10px] uppercase leading-4 tracking-[0.13em] text-[#77736D]">From concept design through delivery</span>
                </div>
              </div>
            </section>

            <RevealSection className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-16 lg:px-10 lg:py-28">
              <div className="relative lg:col-span-5">
                <div className="aspect-[4/5] overflow-hidden bg-[#E5DED2]">
                  <img
                    src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1100&q=85"
                    alt="Natural oak and stone interior materials in a calm contemporary living space"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-4 hidden w-44 border border-[#F7F5F0] bg-[#EEEAE2] p-4 sm:block lg:-right-8">
                  <span className="studio-eyebrow">The studio</span>
                  <p className="mt-2 font-editorial text-xl leading-tight text-[#292722]">Architecture with a human point of view.</p>
                </div>
              </div>
              <div className="lg:col-span-7 lg:py-8">
                <p className="studio-eyebrow mb-5">The LUMORA approach</p>
                <h2 className="studio-section-title max-w-[740px] text-[#191918]">
                  Design clarity. Material honesty. <span className="italic text-[#806F55]">Lasting calm.</span>
                </h2>
                <div className="mt-7 max-w-[650px] space-y-4">
                  <p className="studio-copy">
                    Good spaces begin with listening. Our New Cairo studio brings architectural design, interior detailing, and site engineering together from the earliest brief.
                  </p>
                  <p className="studio-copy">
                    We plan around the way people live and work, then carry each decision through material selection, technical coordination, and delivery.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('about')}
                  className="mt-8 inline-flex items-center gap-2 border-b border-[#C6AA83] pb-2 text-xs font-semibold text-[#403B33] transition-colors hover:text-[#806F55]"
                >
                  Discover the studio <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </RevealSection>

            <TaglineReveal text="Quiet luxury built on structural honesty, natural stone, and disciplined site execution." />

            <RevealSection className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
              <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                <div>
                  <p className="studio-eyebrow mb-4">What we do</p>
                  <h2 className="studio-section-title max-w-[700px] text-[#191918]">A complete vision, from first sketch to final detail.</h2>
                </div>
                <button type="button" onClick={() => navigate('services')} className="studio-button-secondary self-start text-xs font-medium sm:self-auto">
                  Explore all services <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:gap-x-10">
                {SERVICES.map((service, index) => (
                  <article key={service.id} className="group">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedService(service);
                        navigate('service-detail');
                      }}
                      className="block w-full text-left"
                    >
                      <div className="relative aspect-[1.55/1] overflow-hidden bg-[#E5DED2]">
                        <img
                          src={service.image}
                          alt={`${service.title} architectural inspiration`}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                        />
                        <span className="absolute left-4 top-4 font-editorial text-3xl text-white drop-shadow">
                          0{index + 1}
                        </span>
                      </div>
                      <div className="flex items-start justify-between gap-4 border-b border-[#191918]/15 py-4">
                        <div>
                          <h3 className="font-editorial text-2xl leading-tight text-[#25231F] sm:text-3xl">{service.title}</h3>
                          <p className="mt-2 max-w-xl text-xs leading-5 text-[#77736D]">{service.benefit}</p>
                        </div>
                        <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-[#9A8B72] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </button>
                  </article>
                ))}
              </div>
            </RevealSection>

            <RevealSection className="bg-[#EEEAE2] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
              <div className="mx-auto max-w-[1440px]">
                <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                  <div>
                    <p className="studio-eyebrow mb-4">Selected commissions</p>
                    <h2 className="studio-section-title max-w-[680px] text-[#191918]">Spaces with a story to tell.</h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-2" aria-label="Filter portfolio by project type">
                    {['All', 'Residential', 'Commercial'].map((category) => (
                      <button
                        key={category}
                        type="button"
                        aria-pressed={projectFilter === category}
                        onClick={() => setProjectFilter(category)}
                        className={`border px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                          projectFilter === category
                            ? 'border-[#191918] bg-[#191918] text-white'
                            : 'border-[#BFB6A8] text-[#5F5B54] hover:border-[#191918] hover:text-[#191918]'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredProjects.length === 0 ? (
                  <p className="border-t border-[#191918]/15 py-8 text-sm text-[#77736D]">Projects in this category will appear here.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-6">
                    {filteredProjects.slice(0, 3).map((project, index) => {
                      const leadProject = index === 0;
                      return (
                        <article key={project.id} className={leadProject ? 'group md:col-span-12' : 'group md:col-span-6'}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedProject(project);
                              navigate('project-detail');
                            }}
                            className={`grid w-full text-left ${
                              leadProject ? 'md:grid-cols-12 md:items-center' : ''
                            }`}
                          >
                            <div className={`relative overflow-hidden bg-[#DCD4C7] ${
                              leadProject ? 'aspect-[1.25/1] md:col-span-8 md:aspect-[1.5/1]' : 'aspect-[1.3/1] md:aspect-[1.2/1]'
                            }`}>
                              <img
                                src={project.image}
                                alt={`${project.title} — ${project.category.toLowerCase()} portfolio`}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                              />
                            </div>
                            <div className={leadProject ? 'flex items-center md:col-span-4 md:pl-10 md:pr-3' : ''}>
                              <div className={`${leadProject ? 'pt-4 md:py-8' : 'pt-4'}`}>
                                <div className="flex items-center justify-between gap-4 text-[10px] font-medium uppercase tracking-[0.15em] text-[#77736D]">
                                  <span>{project.category}</span>
                                  <span>{project.location}</span>
                                </div>
                                <h3 className="mt-3 font-editorial text-2xl leading-tight text-[#25231F] sm:text-3xl">{project.title}</h3>
                                <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#77736D]">{project.summary}</p>
                                <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64553E]">
                                  View project <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </span>
                              </div>
                            </div>
                          </button>
                        </article>
                      );
                    })}
                  </div>
                )}
                <div className="mt-10 border-t border-[#191918]/15 pt-5">
                  <button type="button" onClick={() => navigate('projects')} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.13em] text-[#3A3731] hover:text-[#806F55]">
                    Explore all projects <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </RevealSection>

            <RevealSection className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-16 lg:px-10 lg:py-28">
              <div className="lg:col-span-7">
                <p className="studio-eyebrow mb-4">The way we work</p>
                <h2 className="studio-section-title max-w-[680px] text-[#191918]">A considered process. A clear path forward.</h2>
                <p className="studio-copy mt-5 max-w-[600px]">
                  From the first conversation to handover, every stage is documented, coordinated, and connected to the decisions made at the start.
                </p>
                <div className="mt-8 divide-y divide-[#191918]/15 border-y border-[#191918]/15">
                  {[
                    ['01', 'Discover', 'We listen, survey the property, and define the brief.'],
                    ['02', 'Design', 'We develop the concept, visualizations, and material direction.'],
                    ['03', 'Plan', 'We coordinate technical drawings, suppliers, and budget.'],
                    ['04', 'Deliver', 'We supervise execution through installation and handover.']
                  ].map(([step, title, detail]) => (
                    <div key={step} className="grid grid-cols-[2.5rem_1fr] gap-4 py-4 sm:grid-cols-[3rem_10rem_1fr]">
                      <span className="font-editorial text-2xl text-[#9A8462]">{step}</span>
                      <h3 className="text-sm font-semibold text-[#33312C]">{title}</h3>
                      <p className="col-start-2 text-xs leading-5 text-[#77736D] sm:col-start-auto">{detail}</p>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => navigate('process')} className="mt-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.13em] text-[#3A3731] hover:text-[#806F55]">
                  View our full process <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="relative lg:col-span-5">
                <div className="aspect-[4/5] overflow-hidden bg-[#E5DED2]">
                  <img
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1100&q=85"
                    alt="Architectural interior with natural stone and oak finishes"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mt-3 text-right text-[9px] uppercase tracking-[0.18em] text-[#918C83]">Material · light · proportion</p>
              </div>
            </RevealSection>

            <RevealSection className="bg-[#191918] px-5 py-16 text-[#F7F5F0] sm:px-8 lg:px-10 lg:py-20">
              <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-5">
                  <p className="studio-eyebrow !text-[#C6AA83]">Why LUMORA</p>
                  <h2 className="mt-4 font-editorial text-4xl leading-tight text-white sm:text-5xl">
                    One accountable team, from concept to completion.
                  </h2>
                </div>
                <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:col-span-7">
                  {[
                    ['01', 'Integrated expertise', 'Architecture, interior design, and site engineering work as one team.'],
                    ['02', 'Clear project economics', 'Fixed milestone budgets and itemized planning before execution.'],
                    ['03', 'Material-led design', 'Natural stone, timber, light, and detail chosen with intention.'],
                    ['04', 'Disciplined delivery', 'Coordinated site supervision keeps decisions connected to the brief.']
                  ].map(([number, title, detail]) => (
                    <div key={number} className="border-t border-white/15 pt-4">
                      <div className="flex items-center gap-3">
                        <span className="font-editorial text-xl text-[#C6AA83]">{number}</span>
                        <h3 className="text-sm font-semibold text-white">{title}</h3>
                      </div>
                      <p className="mt-2 pl-9 text-xs leading-5 text-white/60">{detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </RevealSection>

            <RevealSection className="mx-auto max-w-4xl px-5 py-20 sm:px-8 lg:py-28">
              <p className="studio-eyebrow mb-4">Frequently asked</p>
              <h2 className="studio-section-title mb-9 text-[#191918]">Answers before we begin.</h2>
              <div className="divide-y divide-[#191918]/15 border-y border-[#191918]/15">
                {FAQS.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div key={faq.q}>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpenFaq(isOpen ? -1 : index)}
                        className="flex w-full items-center justify-between gap-5 py-5 text-left"
                      >
                        <span className="text-sm font-medium text-[#302E2A]">{faq.q}</span>
                        <ChevronDown className={`h-4 w-4 shrink-0 text-[#8A7352] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && <p className="max-w-3xl pb-5 pr-8 text-sm leading-7 text-[#77736D]">{faq.a}</p>}
                    </div>
                  );
                })}
              </div>
            </RevealSection>

            <RevealSection className="relative isolate overflow-hidden bg-[#2A2926] px-5 py-20 text-white sm:px-8 lg:px-10 lg:py-28">
              <img
                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85"
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="absolute inset-0 -z-20 h-full w-full object-cover opacity-35"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#191918]/90 via-[#191918]/70 to-[#191918]/25" />
              <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-8 md:flex-row md:items-end">
                <div className="max-w-3xl">
                  <p className="studio-eyebrow !text-[#E2CBA9]">Start a conversation</p>
                  <h2 className="mt-4 font-editorial text-5xl leading-[0.95] text-white sm:text-6xl">
                    Let&apos;s create something <span className="italic text-[#E2CBA9]">considered.</span>
                  </h2>
                  <p className="mt-5 max-w-xl text-sm leading-6 text-white/75">
                    Tell us about your property and what you hope to make of it. We&apos;ll help you find a thoughtful way forward.
                  </p>
                </div>
                <button type="button" onClick={() => navigate('consultation')} className="studio-button-primary shrink-0 bg-[#F7F5F0] text-[#191918] hover:bg-[#E7D9C6]">
                  Book a consultation <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </RevealSection>
          </>
        )}

        {route === 'about' && (
          <div className="mx-auto max-w-[1440px] px-5 pb-20 pt-12 sm:px-8 lg:px-10 lg:pt-16">
            <section className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
              <div className="lg:col-span-7">
                <p className="studio-eyebrow mb-5">About the studio · New Cairo</p>
                <h1 className="studio-display max-w-[850px] text-[#191918]">
                  Architecture rooted in <span className="italic text-[#806F55]">calm permanence.</span>
                </h1>
              </div>
              <p className="studio-copy max-w-xl lg:col-span-5 lg:pb-2">
                We bring architecture, interior design, and site execution into one considered process — shaping spaces made to serve the way people live and work.
              </p>
            </section>

            <div className="mt-10 aspect-[1.7/1] max-h-[690px] overflow-hidden bg-[#E5DED2]">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85"
                alt="Quiet contemporary interior with natural stone finishes and balanced daylight"
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
            </div>

            <section className="grid gap-10 border-b border-[#191918]/15 py-14 md:grid-cols-12 md:gap-12 lg:py-20">
              <div className="md:col-span-5">
                <p className="studio-eyebrow mb-4">A studio built around the brief</p>
                <h2 className="font-editorial text-4xl leading-tight text-[#191918] sm:text-5xl">
                  Thoughtful design, carried through every detail.
                </h2>
              </div>
              <div className="space-y-5 md:col-span-7">
                <p className="studio-copy">
                  Founded in New Cairo, LUMORA Interiors brings together architects, interior designers, and site execution engineers dedicated to residential and commercial spaces that age with grace.
                </p>
                <p className="studio-copy">
                  Across more than 85 completed commissions, our studio has focused on tactile natural materials, balanced daylight, disciplined acoustic planning, and the practical details that make a space work.
                </p>
                <p className="studio-copy">
                  Every project begins with a clear brief and realistic budget. Design decisions, technical drawings, and site coordination remain connected from the first conversation through final handover.
                </p>
              </div>
            </section>

            <section className="grid gap-8 py-14 sm:grid-cols-3 lg:py-16">
              {[
                ['01', 'Listen first', 'We begin by understanding the people, place, and everyday needs behind the project.'],
                ['02', 'Design with intent', 'Proportion, light, circulation, and honest materials guide each decision.'],
                ['03', 'Deliver with care', 'The studio stays involved through technical planning and site execution.']
              ].map(([number, title, copy]) => (
                <div key={number} className="border-t border-[#191918]/20 pt-4">
                  <p className="font-editorial text-2xl text-[#9A8462]">{number}</p>
                  <h3 className="mt-4 font-editorial text-2xl text-[#292722]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#77736D]">{copy}</p>
                </div>
              ))}
            </section>

            <section className="flex flex-col items-start justify-between gap-6 border-t border-[#191918]/15 pt-8 sm:flex-row sm:items-center">
              <p className="font-editorial text-3xl text-[#292722]">Let&apos;s talk about what you&apos;re planning.</p>
              <button type="button" onClick={() => navigate('consultation')} className="studio-button-primary text-sm">
                Book a consultation <ArrowRight className="h-4 w-4" />
              </button>
            </section>
          </div>
        )}

        {route === 'services' && (
          <div className="mx-auto max-w-[1440px] px-5 pb-20 pt-12 sm:px-8 lg:px-10 lg:pt-16">
            <section className="grid gap-8 border-b border-[#191918]/15 pb-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <p className="studio-eyebrow mb-5">Our services</p>
                <h1 className="studio-display max-w-[900px] text-[#191918]">
                  One vision. <span className="italic text-[#806F55]">Every stage.</span>
                </h1>
              </div>
              <p className="studio-copy max-w-lg lg:col-span-4">
                Architectural thinking and interior craft, coordinated around the needs of each property and client.
              </p>
            </section>
            <div className="divide-y divide-[#191918]/15">
              {SERVICES.map((service, index) => (
                <article key={service.id} className="grid gap-6 py-9 md:grid-cols-12 md:items-center lg:gap-12 lg:py-12">
                  <div className={`overflow-hidden bg-[#E5DED2] md:col-span-5 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                    <img
                      src={service.image}
                      alt={`${service.title} architectural inspiration`}
                      loading="lazy"
                      className="aspect-[1.45/1] h-full w-full object-cover transition-transform duration-700 hover:scale-[1.025]"
                    />
                  </div>
                  <div className={`md:col-span-7 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                    <p className="studio-eyebrow">0{index + 1} · Studio discipline</p>
                    <h2 className="mt-3 font-editorial text-3xl leading-tight text-[#22211E] sm:text-4xl">{service.title}</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#77736D]">{service.benefit}</p>
                    <ul className="mt-5 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                      {service.deliverables.map((deliverable) => (
                        <li key={deliverable} className="flex items-start gap-2.5 text-xs leading-5 text-[#5F5B54]">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#9A8462]" />
                          {deliverable}
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedService(service);
                        navigate('service-detail');
                      }}
                      className="mt-6 inline-flex items-center gap-2 border-b border-[#C6AA83] pb-2 text-xs font-semibold text-[#403B33] hover:text-[#806F55]"
                    >
                      Explore this service <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <section className="mt-8 flex flex-col items-start justify-between gap-6 bg-[#EEEAE2] px-6 py-8 sm:flex-row sm:items-center sm:px-9">
              <div>
                <p className="studio-eyebrow mb-2">Have a project in mind?</p>
                <p className="font-editorial text-3xl text-[#25231F]">Let&apos;s shape the brief together.</p>
              </div>
              <button type="button" onClick={() => navigate('consultation')} className="studio-button-primary text-sm">
                Start a conversation <ArrowRight className="h-4 w-4" />
              </button>
            </section>
          </div>
        )}

        {route === 'service-detail' && selectedService && (
          <div className="mx-auto max-w-[1440px] px-5 pb-20 pt-10 sm:px-8 lg:px-10 lg:pt-14">
            <button type="button" onClick={() => navigate('services')} className="mb-8 inline-flex items-center gap-2 text-xs font-medium text-[#77736D] hover:text-[#191918]">
              <ArrowRight className="h-3.5 w-3.5 rotate-180" /> All services
            </button>
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <p className="studio-eyebrow mb-4">LUMORA · Service scope</p>
                <h1 className="studio-display max-w-[900px] text-[#191918]">{selectedService.title}</h1>
              </div>
              <p className="studio-copy max-w-lg lg:col-span-4">{selectedService.benefit}</p>
            </div>
            <div className="mt-10 aspect-[1.6/1] max-h-[680px] overflow-hidden bg-[#E5DED2]">
              <img src={selectedService.image} alt={`${selectedService.title} architectural inspiration`} className="h-full w-full object-cover" />
            </div>
            <div className="grid gap-10 border-b border-[#191918]/15 py-12 md:grid-cols-12 lg:py-16">
              <h2 className="font-editorial text-3xl text-[#25231F] md:col-span-4">Included in this scope</h2>
              <ul className="grid gap-4 sm:grid-cols-2 md:col-span-8">
                {selectedService.deliverables.map((item, index) => (
                  <li key={item} className="flex items-start gap-4 border-t border-[#191918]/15 pt-3">
                    <span className="font-editorial text-xl text-[#9A8462]">0{index + 1}</span>
                    <span className="text-sm leading-6 text-[#5F5B54]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-start justify-between gap-6 py-9 sm:flex-row sm:items-center">
              <p className="font-editorial text-3xl text-[#25231F]">Let&apos;s discuss your project.</p>
              <button type="button" onClick={() => navigate('consultation')} className="studio-button-primary text-sm">
                Book a consultation <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {route === 'projects' && (
          <div className="mx-auto max-w-[1440px] px-5 pb-20 pt-12 sm:px-8 lg:px-10 lg:pt-16">
            <section className="flex flex-col justify-between gap-8 border-b border-[#191918]/15 pb-9 md:flex-row md:items-end">
              <div>
                <p className="studio-eyebrow mb-5">Selected work · LUMORA</p>
                <h1 className="studio-display max-w-[850px] text-[#191918]">
                  Places made to <span className="italic text-[#806F55]">belong.</span>
                </h1>
              </div>
              <p className="studio-copy max-w-md">A selection of residential and commercial projects shaped by their people and place.</p>
            </section>
            <div className="flex flex-wrap gap-2 py-6" aria-label="Filter projects by category">
              {['All', 'Residential', 'Commercial'].map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setProjectFilter(cat)}
                  aria-pressed={projectFilter === cat}
                  className={`rounded-full border px-4 py-2 text-xs transition-colors ${
                    projectFilter === cat
                      ? 'border-[#191918] bg-[#191918] text-[#F7F5F0]'
                      : 'border-[#191918]/20 text-[#5F5B54] hover:border-[#191918]/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {filteredProjects.length ? (
              <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project, index) => (
                  <button
                    type="button"
                    key={project.id}
                    onClick={() => {
                      setSelectedProject(project);
                      navigate('project-detail');
                    }}
                    className={`group text-left ${index % 3 === 1 ? 'lg:pt-12' : ''}`}
                  >
                    <div className="overflow-hidden bg-[#E5DED2]">
                      <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        className="aspect-[0.88/1] w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                      />
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="studio-eyebrow">{project.category} · {project.area}</p>
                      <ArrowUpRight className="h-4 w-4 text-[#9A8462] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                    <h2 className="mt-2 font-editorial text-2xl text-[#25231F]">{project.title}</h2>
                    <p className="mt-1 text-xs text-[#77736D]">{project.location} · {project.year}</p>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#77736D]">{project.summary}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="border-t border-[#191918]/15 py-16 text-center">
                <p className="font-editorial text-3xl text-[#25231F]">No projects in this category yet.</p>
                <button type="button" onClick={() => setProjectFilter('All')} className="mt-4 text-xs font-medium text-[#806F55] underline underline-offset-4">View all projects</button>
              </div>
            )}
          </div>
        )}

        {route === 'project-detail' && selectedProject && (
          <div className="mx-auto max-w-[1440px] px-5 pb-20 pt-10 sm:px-8 lg:px-10 lg:pt-14">
            <button type="button" onClick={() => navigate('projects')} className="mb-8 inline-flex items-center gap-2 text-xs font-medium text-[#77736D] hover:text-[#191918]">
              <ArrowRight className="h-3.5 w-3.5 rotate-180" /> Selected work
            </button>
            <section className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <p className="studio-eyebrow mb-4">{selectedProject.category} · {selectedProject.location} · {selectedProject.year}</p>
                <h1 className="studio-display max-w-[900px] text-[#191918]">{selectedProject.title}</h1>
              </div>
              <p className="studio-copy max-w-lg lg:col-span-4">{selectedProject.summary}</p>
            </section>
            <div className="mt-10 aspect-[1.65/1] max-h-[760px] overflow-hidden bg-[#E5DED2]">
              <img src={selectedProject.image} alt={`${selectedProject.title} in ${selectedProject.location}`} className="h-full w-full object-cover" />
            </div>
            <section className="grid gap-8 border-b border-[#191918]/15 py-12 md:grid-cols-12 lg:py-16">
              <div className="md:col-span-4">
                <p className="studio-eyebrow mb-3">Project notes</p>
                <p className="font-editorial text-3xl text-[#25231F]">{selectedProject.area}</p>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 md:col-span-8">
                <div>
                  <h2 className="font-editorial text-2xl text-[#25231F]">The brief</h2>
                  <p className="mt-3 text-sm leading-6 text-[#77736D]">{selectedProject.challenge}</p>
                </div>
                <div>
                  <h2 className="font-editorial text-2xl text-[#25231F]">The response</h2>
                  <p className="mt-3 text-sm leading-6 text-[#77736D]">{selectedProject.outcome}</p>
                </div>
              </div>
            </section>
            {selectedProject.gallery && selectedProject.gallery.length > 0 && (
              <div className="grid gap-4 py-8 sm:grid-cols-2">
                {selectedProject.gallery.map((imgUrl, i) => (
                  <img key={i} src={imgUrl} alt={`${selectedProject.title} interior detail ${i + 1}`} loading="lazy" className="aspect-[1.25/1] w-full object-cover" />
                ))}
              </div>
            )}
            <section className="flex flex-col items-start justify-between gap-6 border-t border-[#191918]/15 pt-8 sm:flex-row sm:items-center">
              <p className="font-editorial text-3xl text-[#25231F]">Planning a project of your own?</p>
              <button type="button" onClick={() => navigate('consultation')} className="studio-button-primary text-sm">
                Start a conversation <ArrowRight className="h-4 w-4" />
              </button>
            </section>
          </div>
        )}

        {route === 'process' && (
          <div className="mx-auto max-w-[1440px] px-5 pb-20 pt-12 sm:px-8 lg:px-10 lg:pt-16">
            <section className="grid gap-8 border-b border-[#191918]/15 pb-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <p className="studio-eyebrow mb-5">The LUMORA process</p>
                <h1 className="studio-display max-w-[850px] text-[#191918]">A clear path from <span className="italic text-[#806F55]">brief to build.</span></h1>
              </div>
              <p className="studio-copy max-w-md lg:col-span-4">A considered sequence keeps the creative vision and practical decisions connected throughout the project.</p>
            </section>
            <div className="divide-y divide-[#191918]/15">
              {[
                {
                  phase: 'Phase 01 · Week 1',
                  title: 'Site survey & spatial brief',
                  detail: 'Laser measurement of existing conditions, lifestyle or operational workflow interviews, and preliminary budget alignment.'
                },
                {
                  phase: 'Phase 02 · Weeks 2–4',
                  title: 'Concept architecture & visualization',
                  detail: 'Furniture layouts, lighting mood studies, physical stone and timber sample boards, and 3D renders.'
                },
                {
                  phase: 'Phase 03 · Weeks 5–6',
                  title: 'Technical drawings & BOQ',
                  detail: 'MEP, joinery, and ceiling drawings paired with an itemized Bill of Quantities.'
                },
                {
                  phase: 'Phase 04 · Weeks 7 to handover',
                  title: 'Site execution & styling',
                  detail: 'Architectural supervision, quality inspections, furniture installation, and final handover.'
                }
              ].map((step, index) => (
                <article key={step.phase} className="grid gap-4 py-7 md:grid-cols-12 md:gap-8 lg:py-9">
                  <p className="studio-eyebrow md:col-span-3">{step.phase}</p>
                  <div className="md:col-span-9">
                    <div className="flex flex-wrap items-baseline gap-4">
                      <span className="font-editorial text-2xl text-[#9A8462]">0{index + 1}</span>
                      <h2 className="font-editorial text-3xl text-[#25231F]">{step.title}</h2>
                    </div>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-[#77736D]">{step.detail}</p>
                  </div>
                </article>
              ))}
            </div>
            <section className="mt-8 flex flex-col items-start justify-between gap-6 bg-[#EEEAE2] px-6 py-8 sm:flex-row sm:items-center sm:px-9">
              <p className="font-editorial text-3xl text-[#25231F]">Have questions about the process?</p>
              <button type="button" onClick={() => navigate('contact')} className="studio-button-primary text-sm">
                Contact the studio <ArrowRight className="h-4 w-4" />
              </button>
            </section>
          </div>
        )}

        {/* CONTACT US PAGE WITH FULL WORKING CONTACT FORM */}
        {route === 'contact' && (
          <section className="public-form-page mx-auto max-w-[1440px] px-5 pb-20 pt-12 sm:px-8 lg:px-10 lg:pt-16">
            <p className="studio-eyebrow mb-5">Contact the studio · New Cairo</p>
            <h1 className="studio-display max-w-[950px] text-[#191918]">A good project begins with <span className="italic text-[#806F55]">a conversation.</span></h1>
            <p className="studio-copy mt-5 mb-10 max-w-[680px]">
              Send us a direct message for general questions, media inquiries, or supplier partnerships, or visit our Fifth Settlement studio.
            </p>

            <div className="grid items-start gap-6 md:grid-cols-12 lg:gap-10">
              {/* Studio Details */}
              <div className="studio-contact-details space-y-6 md:col-span-5">
                <div className="flex items-start gap-4 border-b border-[#191918]/15 pb-5">
                  <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#9A8462]" />
                  <div>
                    <h2 className="text-xs font-semibold text-[#292722]">Studio address</h2>
                    <p className="mt-1 text-sm text-[#77736D]">Fifth Settlement, New Cairo, Egypt</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 border-b border-[#191918]/15 pb-5">
                  <Phone className="mt-1 h-4 w-4 shrink-0 text-[#9A8462]" />
                  <div>
                    <h2 className="text-xs font-semibold text-[#292722]">Direct line & WhatsApp</h2>
                    <p className="mt-1 text-sm text-[#77736D]">+20 100 000 0000</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 border-b border-[#191918]/15 pb-5">
                  <Mail className="mt-1 h-4 w-4 shrink-0 text-[#9A8462]" />
                  <div>
                    <h2 className="text-xs font-semibold text-[#292722]">Project inquiries</h2>
                    <p className="mt-1 text-sm text-[#77736D]">hello@lumorainteriors.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 border-b border-[#191918]/15 pb-5">
                  <Clock className="mt-1 h-4 w-4 shrink-0 text-[#9A8462]" />
                  <div>
                    <h2 className="text-xs font-semibold text-[#292722]">Working hours</h2>
                    <p className="mt-1 text-sm text-[#77736D]">Saturday – Thursday, 10:00 AM – 7:00 PM</p>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="studio-eyebrow mb-3">
                    Planning a full villa or commercial build?
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('consultation')}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#806F55] hover:text-[#191918]"
                  >
                    Book a consultation <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Contact Us Form */}
              <div className="md:col-span-7">
                {contactSubmitted ? (
                  <div className="rounded-none border border-[#DED9D0] bg-[#EEEAE2] p-6 sm:p-8">
                    <h2 className="heading-4 mb-3">Message received from {contactForm.fullName}</h2>
                    <p className="body-3 text-[#171715]/80 mb-6">
                      Thank you for contacting LUMORA Interiors. Our studio coordinator has logged your message in our inbox and will reply to {contactForm.email} shortly.
                    </p>
                    <button
                      onClick={() => {
                        setContactSubmitted(false);
                        setContactForm({
                          fullName: '',
                          email: '',
                          phone: '',
                          subject: 'New Project Inquiry',
                          message: ''
                        });
                      }}
                      className="studio-button-primary text-sm"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleContactSubmit}
                    noValidate
                    className="studio-public-form space-y-5 border border-[#DED9D0] bg-white p-5 sm:p-8"
                  >
                    <h2 className="font-editorial text-3xl text-[#25231F]">Send a direct message</h2>
                    {contactError && (
                      <div className="p-4 rounded-xl border border-red-800/30 bg-red-50 text-red-900 body-6">
                        {contactError}
                      </div>
                    )}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="title-4 block mb-1.5">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={contactForm.fullName}
                          onChange={(e) => setContactForm({ ...contactForm, fullName: e.target.value })}
                          placeholder="Salma Hegazy"
                          className="w-full rounded-xl border border-[#171715]/20 px-4 py-3 body-6 focus:outline-none focus:ring-2 focus:ring-[#C5AD8A]"
                        />
                      </div>
                      <div>
                        <label className="title-4 block mb-1.5">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="salma@example.com"
                          className="w-full rounded-xl border border-[#171715]/20 px-4 py-3 body-6 focus:outline-none focus:ring-2 focus:ring-[#C5AD8A]"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="title-4 block mb-1.5">Phone Number</label>
                        <input
                          type="tel"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          placeholder="+20 100 000 0000"
                          className="w-full rounded-xl border border-[#171715]/20 px-4 py-3 body-6 focus:outline-none focus:ring-2 focus:ring-[#C5AD8A]"
                        />
                      </div>
                      <div>
                        <label className="title-4 block mb-1.5">Subject</label>
                        <select
                          value={contactForm.subject}
                          onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                          className="w-full rounded-xl border border-[#171715]/20 px-4 py-3 body-6 focus:outline-none focus:ring-2 focus:ring-[#C5AD8A]"
                        >
                          <option>New Project Inquiry</option>
                          <option>Commercial Partnership</option>
                          <option>Supplier or Material Catalog</option>
                          <option>Press and Media</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="title-4 block mb-1.5">Message *</label>
                      <textarea
                        rows={4}
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="How can our studio assist you?"
                        className="w-full rounded-xl border border-[#171715]/20 px-4 py-3 body-6 focus:outline-none focus:ring-2 focus:ring-[#C5AD8A]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="button-md bg-[#171715] text-[#F8F6F1] rounded-xl hover:bg-[#171715]/90 flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send message to studio</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </section>
        )}

        {/* BOOK A CONSULTATION PAGE */}
        {route === 'consultation' && (
          <section className="public-form-page mx-auto max-w-[1440px] px-5 pb-20 pt-12 sm:px-8 lg:px-10 lg:pt-16">
            <div className="grid gap-8 border-b border-[#191918]/15 pb-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <p className="studio-eyebrow mb-5">Consultation request</p>
                <h1 className="studio-display max-w-[850px] text-[#191918]">Let&apos;s understand your <span className="italic text-[#806F55]">project.</span></h1>
              </div>
              <p className="studio-copy max-w-lg lg:col-span-4">
                Share a few details about your property and goals. Our studio will review your brief and follow up about next steps.
              </p>
            </div>
            <div className="mx-auto mt-10 max-w-4xl">

            {consultSubmitted ? (
              <div className="rounded-none border border-[#DED9D0] bg-[#EEEAE2] p-6 sm:p-8">
                <h2 className="heading-4 mb-3">Consultation request confirmed for {consultForm.fullName}</h2>
                <p className="body-3 text-[#171715]/80 mb-6">
                  We have logged your project brief for {consultForm.location || 'your property'} and sent a confirmation summary to {consultForm.email}.
                </p>
                <button
                  onClick={() => {
                    setConsultSubmitted(false);
                    navigate('home');
                  }}
                  className="studio-button-primary text-sm"
                >
                  Return to homepage
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleConsultationSubmit}
                noValidate
                className="studio-public-form space-y-6 border border-[#DED9D0] bg-white p-5 sm:p-8"
              >
                {consultError && (
                  <div className="p-4 rounded-xl border border-red-800/30 bg-red-50 text-red-900 body-6">
                    {consultError}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="title-4 block mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={consultForm.fullName}
                      onChange={(e) => setConsultForm({ ...consultForm, fullName: e.target.value })}
                      placeholder="Karim El Mansoury"
                      className="w-full rounded-xl border border-[#171715]/20 px-4 py-3 body-6 focus:outline-none focus:ring-2 focus:ring-[#C5AD8A]"
                    />
                  </div>
                  <div>
                    <label className="title-4 block mb-2">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={consultForm.email}
                      onChange={(e) => setConsultForm({ ...consultForm, email: e.target.value })}
                      placeholder="karim@company.com"
                      className="w-full rounded-xl border border-[#171715]/20 px-4 py-3 body-6 focus:outline-none focus:ring-2 focus:ring-[#C5AD8A]"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="title-4 block mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={consultForm.phone}
                      onChange={(e) => setConsultForm({ ...consultForm, phone: e.target.value })}
                      placeholder="+20 100 000 0000"
                      className="w-full rounded-xl border border-[#171715]/20 px-4 py-3 body-6 focus:outline-none focus:ring-2 focus:ring-[#C5AD8A]"
                    />
                  </div>
                  <div>
                    <label className="title-4 block mb-2">Project Type</label>
                    <select
                      value={consultForm.projectType}
                      onChange={(e) => setConsultForm({ ...consultForm, projectType: e.target.value })}
                      className="w-full rounded-xl border border-[#171715]/20 px-4 py-3 body-6 focus:outline-none focus:ring-2 focus:ring-[#C5AD8A]"
                    >
                      <option>Residential Villa</option>
                      <option>Residential Apartment</option>
                      <option>Corporate Office</option>
                      <option>Retail or Hospitality</option>
                      <option>Renovation and Remodeling</option>
                      <option>3D Visualization Only</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="title-4 block mb-2">Project Location</label>
                    <input
                      type="text"
                      value={consultForm.location}
                      onChange={(e) => setConsultForm({ ...consultForm, location: e.target.value })}
                      placeholder="New Cairo / Fifth Settlement"
                      className="w-full rounded-xl border border-[#171715]/20 px-4 py-3 body-6 focus:outline-none focus:ring-2 focus:ring-[#C5AD8A]"
                    />
                  </div>
                  <div>
                    <label className="title-4 block mb-2">Estimated Budget</label>
                    <select
                      value={consultForm.budget}
                      onChange={(e) => setConsultForm({ ...consultForm, budget: e.target.value })}
                      className="w-full rounded-xl border border-[#171715]/20 px-4 py-3 body-6 focus:outline-none focus:ring-2 focus:ring-[#C5AD8A]"
                    >
                      <option>EGP 1.5M – 3M</option>
                      <option>EGP 3M – 6M</option>
                      <option>EGP 6M – 12M</option>
                      <option>Above EGP 12M</option>
                    </select>
                  </div>
                  <div>
                    <label className="title-4 block mb-2">Property Size (sqm)</label>
                    <input
                      type="text"
                      value={consultForm.size}
                      onChange={(e) => setConsultForm({ ...consultForm, size: e.target.value })}
                      placeholder="450 sqm"
                      className="w-full rounded-xl border border-[#171715]/20 px-4 py-3 body-6 focus:outline-none focus:ring-2 focus:ring-[#C5AD8A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="title-4 block mb-2">Preferred Consultation Date</label>
                  <input
                    type="date"
                    value={consultForm.preferredDate}
                    onChange={(e) => setConsultForm({ ...consultForm, preferredDate: e.target.value })}
                    className="w-full rounded-xl border border-[#171715]/20 px-4 py-3 body-6 focus:outline-none focus:ring-2 focus:ring-[#C5AD8A]"
                  />
                </div>

                <div>
                  <label className="title-4 block mb-2">Additional Project Details</label>
                  <textarea
                    rows={4}
                    value={consultForm.details}
                    onChange={(e) => setConsultForm({ ...consultForm, details: e.target.value })}
                    placeholder="Describe your property current condition (core and shell, semi finished, or renovation) and target move in date."
                    className="w-full rounded-xl border border-[#171715]/20 px-4 py-3 body-6 focus:outline-none focus:ring-2 focus:ring-[#C5AD8A]"
                  />
                </div>

                <button
                  type="submit"
                  className="button-md bg-[#171715] text-[#F8F6F1] rounded-xl hover:bg-[#171715]/90 active:scale-[0.98] transition-all"
                >
                  Confirm consultation request
                </button>
              </form>
            )}
            </div>
          </section>
        )}

        {(route === 'privacy' || route === 'terms') && (
          <section className="mx-auto max-w-3xl px-5 pb-20 pt-12 sm:px-8 lg:pt-16">
            <p className="studio-eyebrow mb-5">LUMORA · Studio information</p>
            <h1 className="studio-section-title mb-8 text-[#191918]">
              {route === 'privacy' ? 'Privacy Policy' : 'Terms of Engagement'}
            </h1>
            <p className="studio-copy mb-8">
              LUMORA Interiors respects client confidentiality. All architectural floor plans, property addresses, and contact details shared through our consultation forms are used strictly to prepare your design proposal and are never shared with third parties.
            </p>
            <button
              type="button"
              onClick={() => navigate('home')}
              className="studio-button-secondary text-sm"
            >
              Return home
            </button>
          </section>
        )}
      </main>

      {/* Floating WhatsApp Direct Inquiry Button */}
      <a
        href="https://wa.me/201000000000?text=Hello%20LUMORA%20Interiors,%20I%20would%20like%20to%20inquire%20about%20a%20project."
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with LUMORA Interiors on WhatsApp"
        className="fixed bottom-6 right-6 z-40 bg-[#171715] text-[#F8F6F1] border border-[#C5AD8A]/40 rounded-full px-4 py-3 shadow-lg flex items-center gap-2 hover:bg-[#171715]/90 transition-all max-sm:bottom-4 max-sm:right-4 max-sm:h-11 max-sm:w-11 max-sm:justify-center max-sm:p-0"
      >
        <MessageCircle className="w-5 h-5 text-[#C5AD8A]" />
        <span className="button-sm hidden sm:inline">WhatsApp Studio</span>
      </a>

      {/* Footer */}
      <footer className="bg-[#191918] px-5 py-14 text-[#F7F5F0] sm:px-8 lg:px-10 lg:py-16">
        <div className="mx-auto grid max-w-[1440px] gap-10 border-b border-white/10 pb-10 md:grid-cols-4 lg:gap-14">
          <div className="md:col-span-2">
            <p className="font-editorial text-3xl tracking-[0.12em]">LUMORA</p>
            <p className="mt-1 text-[0.62rem] uppercase tracking-[0.28em] text-[#C6AA83]">Interiors · Architecture</p>
            <p className="mt-5 max-w-md text-sm leading-6 text-white/65">
              Luxury residential and commercial interior architecture studio based in New Cairo, Egypt.
            </p>
            <p className="mt-5 text-xs leading-5 text-[#C6AA83]">
              Fifth Settlement, New Cairo · +20 100 000 0000 · hello@lumorainteriors.com
            </p>
          </div>
          <div>
            <h3 className="studio-eyebrow mb-4 text-[#C6AA83]">Explore</h3>
            <ul className="space-y-3 text-xs text-white/70">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button type="button" onClick={() => navigate(link.id)} className="transition-colors hover:text-white">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="studio-eyebrow mb-4 text-[#C6AA83]">Studio & legal</h3>
            <ul className="space-y-3 text-xs text-white/70">
              <li>
                <button type="button" onClick={() => navigate('consultation')} className="transition-colors hover:text-white">
                  Book a Consultation
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('admin')} className="transition-colors hover:text-white">
                  Studio Portal
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('privacy')} className="transition-colors hover:text-white">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('terms')} className="transition-colors hover:text-white">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-3 pt-6 text-[0.65rem] text-white/45 sm:flex-row sm:items-center">
          <span>© 2026 LUMORA Interiors. All rights reserved.</span>
          <span>Instagram @lumora.interiors · Saturday – Thursday</span>
        </div>
      </footer>
    </div>
  );
}
