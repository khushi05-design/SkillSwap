import React, { useState, useMemo, useEffect, useRef } from 'react';
import ConstellationGrid from './components/ui/constellation-grid';
import {
  Users, BookOpen, Zap, ArrowRight, Search, Bell, MessageCircle,
  User, Settings, LogOut, Plus, Star, ChevronRight, Check,
  X, Clock, CheckCircle2, Send, Filter, Sparkles, Menu,
  ArrowLeft, Edit3, Trash2, Heart, Award, TrendingUp,
  BookMarked, Handshake, BarChart3, MessageSquare, RefreshCw,
  Eye, EyeOff, Mail, Lock, ChevronDown, Globe, GraduationCap,
  Layers, AlertCircle, Info, Hash, PlusCircle, XCircle,
  Activity, UserCheck, Inbox, Archive, CalendarCheck
} from 'lucide-react';

// ───────────────────────── Types ─────────────────────────

type Page =
  | 'landing'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'explore'
  | 'profile'
  | 'requests'
  | 'messages'
  | 'exchanges'
  | 'settings'
  | 'student-profile';

interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface Student {
  id: string;
  name: string;
  avatar: string;
  department: string;
  year: string;
  bio: string;
  rating: number;
  reviewCount: number;
  teachSkills: Skill[];
  learnSkills: Skill[];
  completedExchanges: number;
  joinedDate: string;
  online: boolean;
}

interface ExchangeRequest {
  id: string;
  fromStudent: Student;
  toStudent: Student;
  offerSkill: Skill;
  wantSkill: Skill;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  partner: Student;
  messages: Message[];
  exchangeId?: string;
}

interface Exchange {
  id: string;
  partner: Student;
  teachingSkill: Skill;
  learningSkill: Skill;
  status: 'active' | 'completed' | 'paused';
  startDate: string;
  sessions: number;
}

// ───────────────────────── Mock Data ─────────────────────────

const SKILL_CATEGORIES = ['Programming', 'Design', 'Music', 'Languages', 'Math', 'Science', 'Art', 'Business', 'Sports', 'Writing'];

const ALL_SKILLS: Skill[] = [
  { id: 's1', name: 'Python', category: 'Programming', level: 'Advanced' },
  { id: 's2', name: 'React', category: 'Programming', level: 'Intermediate' },
  { id: 's3', name: 'UI/UX Design', category: 'Design', level: 'Advanced' },
  { id: 's4', name: 'Guitar', category: 'Music', level: 'Intermediate' },
  { id: 's5', name: 'Spanish', category: 'Languages', level: 'Beginner' },
  { id: 's6', name: 'Linear Algebra', category: 'Math', level: 'Advanced' },
  { id: 's7', name: 'Photography', category: 'Art', level: 'Intermediate' },
  { id: 's8', name: 'Machine Learning', category: 'Programming', level: 'Intermediate' },
  { id: 's9', name: 'Piano', category: 'Music', level: 'Beginner' },
  { id: 's10', name: 'French', category: 'Languages', level: 'Intermediate' },
  { id: 's11', name: 'Statistics', category: 'Math', level: 'Advanced' },
  { id: 's12', name: 'Video Editing', category: 'Art', level: 'Intermediate' },
  { id: 's13', name: 'Figma', category: 'Design', level: 'Advanced' },
  { id: 's14', name: 'JavaScript', category: 'Programming', level: 'Advanced' },
  { id: 's15', name: 'Public Speaking', category: 'Business', level: 'Intermediate' },
  { id: 's16', name: 'Chess', category: 'Sports', level: 'Advanced' },
  { id: 's17', name: 'Data Analysis', category: 'Science', level: 'Intermediate' },
  { id: 's18', name: 'Creative Writing', category: 'Writing', level: 'Advanced' },
  { id: 's19', name: 'C++', category: 'Programming', level: 'Intermediate' },
  { id: 's20', name: 'German', category: 'Languages', level: 'Beginner' },
];

const MOCK_STUDENTS: Student[] = [
  {
    id: 'u1', name: 'Arjun Sharma', avatar: 'AS',
    department: 'Computer Science', year: '3rd Year',
    bio: 'Passionate full-stack developer who loves teaching Python. Always eager to pick up new creative skills.',
    rating: 4.9, reviewCount: 24, completedExchanges: 18,
    joinedDate: 'Sep 2025', online: true,
    teachSkills: [ALL_SKILLS[0], ALL_SKILLS[1], ALL_SKILLS[13]],
    learnSkills: [ALL_SKILLS[3], ALL_SKILLS[6]],
  },
  {
    id: 'u2', name: 'Priya Nair', avatar: 'PN',
    department: 'Fine Arts & Design', year: '4th Year',
    bio: 'UI/UX designer and Figma wizard. I can help you make beautiful interfaces. Looking to learn programming basics.',
    rating: 4.8, reviewCount: 19, completedExchanges: 14,
    joinedDate: 'Aug 2025', online: true,
    teachSkills: [ALL_SKILLS[2], ALL_SKILLS[12], ALL_SKILLS[6]],
    learnSkills: [ALL_SKILLS[0], ALL_SKILLS[7]],
  },
  {
    id: 'u3', name: 'Ravi Mehta', avatar: 'RM',
    department: 'Music & Performing Arts', year: '2nd Year',
    bio: 'Classical guitar player for 8 years. Passionate about music theory. Want to learn data analysis.',
    rating: 4.7, reviewCount: 11, completedExchanges: 8,
    joinedDate: 'Oct 2025', online: false,
    teachSkills: [ALL_SKILLS[3], ALL_SKILLS[8]],
    learnSkills: [ALL_SKILLS[16], ALL_SKILLS[1]],
  },
  {
    id: 'u4', name: 'Sneha Reddy', avatar: 'SR',
    department: 'Mathematics', year: '3rd Year',
    bio: 'Math enthusiast who loves explaining complex concepts simply. Eager to learn design and creative skills.',
    rating: 4.9, reviewCount: 32, completedExchanges: 25,
    joinedDate: 'Jul 2025', online: true,
    teachSkills: [ALL_SKILLS[5], ALL_SKILLS[10], ALL_SKILLS[16]],
    learnSkills: [ALL_SKILLS[2], ALL_SKILLS[11]],
  },
  {
    id: 'u5', name: 'Dev Kapoor', avatar: 'DK',
    department: 'Linguistics', year: '1st Year',
    bio: 'Fluent in 4 languages. Happy to teach French and Spanish. Want to learn chess and public speaking.',
    rating: 4.6, reviewCount: 7, completedExchanges: 5,
    joinedDate: 'Nov 2025', online: false,
    teachSkills: [ALL_SKILLS[9], ALL_SKILLS[4]],
    learnSkills: [ALL_SKILLS[15], ALL_SKILLS[14]],
  },
  {
    id: 'u6', name: 'Aisha Patel', avatar: 'AP',
    department: 'Data Science', year: '4th Year',
    bio: 'ML researcher with expertise in Python and data analysis. Love teaching and exchanging ideas.',
    rating: 4.8, reviewCount: 28, completedExchanges: 21,
    joinedDate: 'Jun 2025', online: true,
    teachSkills: [ALL_SKILLS[7], ALL_SKILLS[16], ALL_SKILLS[0]],
    learnSkills: [ALL_SKILLS[6], ALL_SKILLS[17]],
  },
];

const CURRENT_USER: Student = {
  id: 'me', name: 'You (Demo User)', avatar: 'YD',
  department: 'Computer Science', year: '2nd Year',
  bio: 'Enthusiastic learner and teacher. I know JavaScript and want to improve my design skills.',
  rating: 4.5, reviewCount: 6, completedExchanges: 4,
  joinedDate: 'Oct 2025', online: true,
  teachSkills: [ALL_SKILLS[13], ALL_SKILLS[18]],
  learnSkills: [ALL_SKILLS[2], ALL_SKILLS[9]],
};

const MOCK_REQUESTS: ExchangeRequest[] = [
  {
    id: 'req1', fromStudent: MOCK_STUDENTS[0], toStudent: CURRENT_USER,
    offerSkill: ALL_SKILLS[0], wantSkill: ALL_SKILLS[13],
    message: "Hi! I'd love to exchange Python tutoring for JavaScript. I can teach you advanced Python concepts!",
    status: 'pending', createdAt: '2 hours ago',
  },
  {
    id: 'req2', fromStudent: MOCK_STUDENTS[1], toStudent: CURRENT_USER,
    offerSkill: ALL_SKILLS[2], wantSkill: ALL_SKILLS[13],
    message: "Hey! I'm a UI/UX expert looking to learn JS. Would love to swap lessons!",
    status: 'pending', createdAt: '1 day ago',
  },
  {
    id: 'req3', fromStudent: CURRENT_USER, toStudent: MOCK_STUDENTS[3],
    offerSkill: ALL_SKILLS[13], wantSkill: ALL_SKILLS[2],
    message: "Hi Sneha! I'd love to learn UI design from you in exchange for JavaScript lessons.",
    status: 'accepted', createdAt: '3 days ago',
  },
  {
    id: 'req4', fromStudent: CURRENT_USER, toStudent: MOCK_STUDENTS[2],
    offerSkill: ALL_SKILLS[13], wantSkill: ALL_SKILLS[3],
    message: "Hey Ravi! Would love to learn guitar from you!",
    status: 'rejected', createdAt: '5 days ago',
  },
];

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv1', partner: MOCK_STUDENTS[3], exchangeId: 'exc1',
    messages: [
      { id: 'm1', senderId: 'u4', text: 'Hi! Great to connect. When can we start our first session?', timestamp: '10:30 AM' },
      { id: 'm2', senderId: 'me', text: 'Hey Sneha! How about Saturday morning?', timestamp: '10:45 AM' },
      { id: 'm3', senderId: 'u4', text: 'Perfect! I will share the meeting link. Looking forward to it! 🎨', timestamp: '11:00 AM' },
    ],
  },
  {
    id: 'conv2', partner: MOCK_STUDENTS[0],
    messages: [
      { id: 'm4', senderId: 'u1', text: 'Hi! Saw your profile. Would love to exchange Python for JS!', timestamp: 'Yesterday' },
      { id: 'm5', senderId: 'me', text: 'Hey Arjun! That sounds great, I sent you a request!', timestamp: 'Yesterday' },
    ],
  },
];

const MOCK_EXCHANGES: Exchange[] = [
  {
    id: 'exc1', partner: MOCK_STUDENTS[3],
    teachingSkill: ALL_SKILLS[13], learningSkill: ALL_SKILLS[2],
    status: 'active', startDate: 'Nov 10, 2026', sessions: 3,
  },
  {
    id: 'exc2', partner: MOCK_STUDENTS[5],
    teachingSkill: ALL_SKILLS[13], learningSkill: ALL_SKILLS[7],
    status: 'completed', startDate: 'Oct 1, 2026', sessions: 8,
  },
];

// ───────────────────────── Helper Components ─────────────────────────

const SkillBadge = ({ skill, variant = 'default' }: { skill: Skill; variant?: 'default' | 'teach' | 'learn' | 'sm' }) => {
  const levelColors: Record<string, string> = {
    Beginner: 'text-emerald-300 bg-emerald-950/60 border-emerald-800/60',
    Intermediate: 'text-sky-300 bg-sky-950/60 border-sky-800/60',
    Advanced: 'text-violet-300 bg-violet-950/60 border-violet-800/60',
  };
  if (variant === 'sm') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-medium">
        {skill.name}
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${levelColors[skill.level] || 'text-slate-300 bg-slate-800 border-slate-700'}`}>
      <span>{skill.name}</span>
      <span className="opacity-60">· {skill.level}</span>
    </span>
  );
};

const StatusBadge = ({ status }: { status: ExchangeRequest['status'] | Exchange['status'] }) => {
  const configs: Record<string, { label: string; cls: string }> = {
    pending: { label: 'Pending', cls: 'bg-amber-950/60 text-amber-300 border-amber-800/60' },
    accepted: { label: 'Accepted', cls: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60' },
    rejected: { label: 'Rejected', cls: 'bg-rose-950/60 text-rose-300 border-rose-800/60' },
    completed: { label: 'Completed', cls: 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60' },
    active: { label: 'Active', cls: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60' },
    paused: { label: 'Paused', cls: 'bg-slate-800 text-slate-400 border-slate-700' },
  };
  const cfg = configs[status] || configs['pending'];
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold border ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
};

const Avatar = ({ student, size = 'md' }: { student: Student; size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const sizes: Record<string, string> = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-lg',
  };
  return (
    <div className={`relative flex-shrink-0 ${sizes[size]} rounded-full bg-gradient-to-br from-cyan-600 to-sky-400 flex items-center justify-center font-bold text-slate-950`}>
      {student.avatar}
      {student.online && (
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
      )}
    </div>
  );
};

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
    ))}
  </div>
);

// ───────────────────────── Student Card ─────────────────────────

const StudentCard = ({
  student,
  onViewProfile,
  onSendRequest,
}: {
  student: Student;
  onViewProfile: (s: Student) => void;
  onSendRequest: (s: Student) => void;
}) => (
  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg hover:border-slate-700 transition-all group">
    <div className="flex items-start gap-3 mb-4">
      <Avatar student={student} size="lg" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-white text-sm truncate">{student.name}</h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-xs font-mono text-amber-300">{student.rating}</span>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">{student.department} · {student.year}</p>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{student.bio}</p>
      </div>
    </div>

    <div className="space-y-2.5">
      <div>
        <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold flex items-center gap-1 mb-1.5">
          <BookOpen className="w-3 h-3" /> Can Teach
        </span>
        <div className="flex flex-wrap gap-1">
          {student.teachSkills.map(sk => <SkillBadge key={sk.id} skill={sk} variant="sm" />)}
        </div>
      </div>
      <div>
        <span className="text-[10px] font-mono text-violet-400 uppercase font-bold flex items-center gap-1 mb-1.5">
          <GraduationCap className="w-3 h-3" /> Wants to Learn
        </span>
        <div className="flex flex-wrap gap-1">
          {student.learnSkills.map(sk => <SkillBadge key={sk.id} skill={sk} variant="sm" />)}
        </div>
      </div>
    </div>

    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80">
      <button
        onClick={() => onViewProfile(student)}
        className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition flex items-center justify-center gap-1.5"
      >
        <Eye className="w-3.5 h-3.5" /> View Profile
      </button>
      <button
        onClick={() => onSendRequest(student)}
        className="flex-1 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm shadow-cyan-500/20"
      >
        <Handshake className="w-3.5 h-3.5" /> Request
      </button>
    </div>
  </div>
);

// ───────────────────────── Request Card ─────────────────────────

const RequestCard = ({
  req,
  currentUserId,
  onAccept,
  onReject,
}: {
  req: ExchangeRequest;
  currentUserId: string;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}) => {
  const isIncoming = req.toStudent.id === currentUserId;
  const other = isIncoming ? req.fromStudent : req.toStudent;

  return (
    <div className={`bg-slate-900/80 border rounded-2xl p-5 shadow-lg transition-all ${req.status === 'pending' && isIncoming ? 'border-cyan-800/60 hover:border-cyan-700/60' : 'border-slate-800'}`}>
      <div className="flex items-center gap-3 mb-3">
        <Avatar student={other} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-white text-sm">{other.name}</span>
            <StatusBadge status={req.status} />
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{isIncoming ? 'Incoming Request' : 'Sent Request'} · {req.createdAt}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 my-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
        <div className="flex-1 text-center">
          <div className="text-[10px] font-mono text-cyan-400 uppercase mb-1">{isIncoming ? 'They Offer' : 'You Offer'}</div>
          <SkillBadge skill={req.offerSkill} variant="sm" />
        </div>
        <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
        <div className="flex-1 text-center">
          <div className="text-[10px] font-mono text-violet-400 uppercase mb-1">{isIncoming ? 'They Want' : 'You Want'}</div>
          <SkillBadge skill={req.wantSkill} variant="sm" />
        </div>
      </div>

      <p className="text-xs text-slate-400 italic mb-3">"{req.message}"</p>

      {req.status === 'pending' && isIncoming && (
        <div className="flex gap-2">
          <button
            onClick={() => onAccept(req.id)}
            className="flex-1 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" /> Accept
          </button>
          <button
            onClick={() => onReject(req.id)}
            className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-300 text-xs font-medium transition flex items-center justify-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" /> Decline
          </button>
        </div>
      )}
    </div>
  );
};

// ───────────────────────── Main App ─────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);

  // Forms
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDept, setRegDept] = useState('');

  // Explore
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Requests state
  const [requests, setRequests] = useState<ExchangeRequest[]>(MOCK_REQUESTS);
  const [requestTab, setRequestTab] = useState<'incoming' | 'sent'>('incoming');

  // Exchange request modal
  const [requestModal, setRequestModal] = useState<{ student: Student | null; open: boolean }>({ student: null, open: false });
  const [requestMessage, setRequestMessage] = useState('');
  const [offerSkillId, setOfferSkillId] = useState(CURRENT_USER.teachSkills[0]?.id || '');
  const [wantSkillId, setWantSkillId] = useState('');

  // Messages
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Profile edit
  const [editingBio, setEditingBio] = useState(false);
  const [bioValue, setBioValue] = useState(CURRENT_USER.bio);

  // Settings
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  // Notification badge
  const incomingPending = requests.filter(r => r.toStudent.id === 'me' && r.status === 'pending').length;

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [activeConvId, conversations]);

  const navigate = (p: Page) => {
    setPage(p);
    window.scrollTo(0, 0);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    navigate('dashboard');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    navigate('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('landing');
  };

  const handleAcceptRequest = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'accepted' } : r));
  };

  const handleRejectRequest = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
  };

  const handleSendRequest = (student: Student) => {
    setRequestModal({ student, open: true });
    setWantSkillId(student.teachSkills[0]?.id || '');
  };

  const handleSubmitRequest = () => {
    if (!requestModal.student) return;
    const offerSkill = ALL_SKILLS.find(s => s.id === offerSkillId) || CURRENT_USER.teachSkills[0];
    const wantSkill = ALL_SKILLS.find(s => s.id === wantSkillId) || requestModal.student.teachSkills[0];
    const newReq: ExchangeRequest = {
      id: `req${Date.now()}`,
      fromStudent: CURRENT_USER,
      toStudent: requestModal.student,
      offerSkill,
      wantSkill,
      message: requestMessage || 'I would love to exchange skills with you!',
      status: 'pending',
      createdAt: 'Just now',
    };
    setRequests(prev => [...prev, newReq]);
    setRequestModal({ student: null, open: false });
    setRequestMessage('');
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() || !activeConvId) return;
    setConversations(prev => prev.map(conv => {
      if (conv.id !== activeConvId) return conv;
      return {
        ...conv,
        messages: [...conv.messages, {
          id: `m${Date.now()}`,
          senderId: 'me',
          text: chatInput.trim(),
          timestamp: 'Now',
        }],
      };
    }));
    setChatInput('');
  };

  const openStudentProfile = (student: Student) => {
    setSelectedStudent(student);
    navigate('student-profile');
  };

  // Filtered students for explore
  const filteredStudents = useMemo(() => {
    return MOCK_STUDENTS.filter(s => {
      const q = searchQuery.toLowerCase();
      const matchesQuery = !q || s.name.toLowerCase().includes(q)
        || s.teachSkills.some(sk => sk.name.toLowerCase().includes(q))
        || s.learnSkills.some(sk => sk.name.toLowerCase().includes(q))
        || s.department.toLowerCase().includes(q);
      const matchesCat = selectedCategory === 'All'
        || s.teachSkills.some(sk => sk.category === selectedCategory)
        || s.learnSkills.some(sk => sk.category === selectedCategory);
      return matchesQuery && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  const activeConversation = conversations.find(c => c.id === activeConvId);

  // ─── Layout Wrapper ───
  const AppShell = ({ children, hideNav = false }: { children: React.ReactNode; hideNav?: boolean }) => (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {!hideNav && (
        <header className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => navigate(isLoggedIn ? 'dashboard' : 'landing')}
              className="flex items-center space-x-2.5 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-sky-400 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
                <Handshake className="w-5 h-5 text-slate-950 stroke-[2]" />
              </div>
              <span className="font-mono font-bold tracking-tight text-white">Skill<span className="text-cyan-400">Swap</span></span>
            </button>

            {/* Nav */}
            {isLoggedIn ? (
              <nav className="flex items-center gap-1">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                  { id: 'explore', label: 'Explore', icon: Search },
                  { id: 'exchanges', label: 'Exchanges', icon: Handshake },
                  { id: 'messages', label: 'Messages', icon: MessageCircle },
                  { id: 'requests', label: 'Requests', icon: Inbox, badge: incomingPending },
                ].map(({ id, label, icon: Icon, badge }) => (
                  <button
                    key={id}
                    onClick={() => navigate(id as Page)}
                    className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                      page === id
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{label}</span>
                    {badge ? (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full text-[9px] font-bold text-slate-950 flex items-center justify-center">
                        {badge}
                      </span>
                    ) : null}
                  </button>
                ))}
                <button
                  onClick={() => navigate('profile')}
                  className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg transition ${
                    page === 'profile'
                      ? 'bg-cyan-500/20 border border-cyan-500/40'
                      : 'hover:bg-slate-800/50'
                  }`}
                >
                  <Avatar student={CURRENT_USER} size="sm" />
                  <span className="text-xs font-medium text-slate-200 hidden sm:inline">Profile</span>
                </button>
                <button
                  onClick={() => navigate('settings')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </nav>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('login')}
                  className="px-4 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition"
                >
                  Log In
                </button>
                <button
                  onClick={() => navigate('register')}
                  className="px-4 py-1.5 rounded-lg text-sm font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition shadow-sm shadow-cyan-500/20"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </header>
      )}
      <main className="flex-1">{children}</main>
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-4 px-6 text-center text-xs text-slate-500 font-mono flex flex-wrap justify-between items-center max-w-7xl mx-auto w-full">
        <span>SkillSwap • Student Skill Exchange Platform</span>
        <span className="text-cyan-400/60">React • TypeScript • Tailwind CSS</span>
      </footer>

      {/* Exchange Request Modal */}
      {requestModal.open && requestModal.student && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Handshake className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-white text-base">Request Skill Exchange</h3>
              </div>
              <button
                onClick={() => setRequestModal({ student: null, open: false })}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <Avatar student={requestModal.student} size="md" />
              <div>
                <div className="font-medium text-white text-sm">{requestModal.student.name}</div>
                <div className="text-xs text-slate-400">{requestModal.student.department} · {requestModal.student.year}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-1.5 font-bold">
                  Skill you will teach
                </label>
                <select
                  value={offerSkillId}
                  onChange={e => setOfferSkillId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  {CURRENT_USER.teachSkills.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.level})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-violet-400 uppercase tracking-wider block mb-1.5 font-bold">
                  Skill you want to learn
                </label>
                <select
                  value={wantSkillId}
                  onChange={e => setWantSkillId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  {requestModal.student.teachSkills.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.level})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1.5 font-bold">
                  Message (Optional)
                </label>
                <textarea
                  value={requestMessage}
                  onChange={e => setRequestMessage(e.target.value)}
                  placeholder="Hey, I'd love to exchange skills! When are you free to chat?"
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setRequestModal({ student: null, open: false })}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRequest}
                className="flex-1 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ─── LANDING PAGE ───
  if (page === 'landing') {
    return (
      <AppShell>
        {/* Hero with ConstellationGrid background */}
        <section className="relative w-full overflow-hidden" style={{ minHeight: '100vh' }}>
          {/* ConstellationGrid as background */}
          <div className="absolute inset-0 z-0">
            <ConstellationGrid />
          </div>

          {/* Overlay gradient for content readability */}
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950/90 pointer-events-none" />

          {/* Hero content above animation */}
          <div className="relative z-20 flex flex-col items-center justify-center min-h-screen text-center px-4 pb-20">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-mono font-semibold mb-6 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Student Skill Exchange Network
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </div>

            {/* Headline */}
            <h1 className="font-mono font-black tracking-tighter text-5xl md:text-8xl text-white leading-none mb-4 uppercase">
              Skill<span className="text-cyan-400">Swap</span>
            </h1>
            <p className="mt-4 text-base md:text-xl text-slate-300 max-w-2xl leading-relaxed">
              Trade what you know for what you want to learn.
              Connect with fellow students, exchange skills, and grow together.
            </p>

            {/* CTA Buttons — pointer-events-auto ensures clicks work above canvas */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
              <button
                onClick={() => navigate('register')}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-cyan-500/30 flex items-center gap-2"
              >
                <Zap className="w-4 h-4" /> Get Started Free
              </button>
              <button
                onClick={() => navigate('explore')}
                className="px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-medium text-sm transition backdrop-blur-sm border border-slate-700/80 flex items-center gap-2"
              >
                <Search className="w-4 h-4" /> Explore Skills
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-14">
              {[
                { label: 'Students', value: '1,200+', icon: Users },
                { label: 'Skills Available', value: '340+', icon: BookOpen },
                { label: 'Exchanges Done', value: '4,800+', icon: Handshake },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="text-center backdrop-blur-sm bg-slate-900/60 border border-slate-800/60 rounded-2xl px-5 py-3">
                  <div className="flex items-center justify-center gap-1.5 text-cyan-400 mb-1">
                    <Icon className="w-4 h-4" />
                    <span className="text-xl font-black font-mono text-white">{value}</span>
                  </div>
                  <p className="text-xs text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-slate-950 border-t border-slate-800/60 py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">How It Works</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Exchange Skills in 3 Steps</h2>
              <p className="text-slate-400 mt-3 max-w-xl mx-auto">No money, no tutors. Just students helping students.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: '01', icon: User, color: 'from-cyan-600 to-sky-400',
                  title: 'Build Your Profile',
                  desc: 'List the skills you can teach and the skills you want to learn. Set your proficiency levels.',
                },
                {
                  step: '02', icon: Search, color: 'from-violet-600 to-purple-400',
                  title: 'Discover & Connect',
                  desc: 'Browse other students. Find perfect matches where you teach them something and they teach you back.',
                },
                {
                  step: '03', icon: Handshake, color: 'from-emerald-600 to-teal-400',
                  title: 'Exchange & Grow',
                  desc: 'Send a request, agree on a schedule, have sessions, and track your skill progress over time.',
                },
              ].map(({ step, icon: Icon, color, title, desc }) => (
                <div key={step} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg hover:border-slate-700 transition-all">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-xs font-mono text-slate-500 mb-1">Step {step}</div>
                  <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <button
                onClick={() => navigate('register')}
                className="px-8 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition shadow-lg shadow-cyan-500/20 flex items-center gap-2 mx-auto"
              >
                Join SkillSwap Today <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </AppShell>
    );
  }

  // ─── LOGIN PAGE ───
  if (page === 'login') {
    return (
      <AppShell hideNav>
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-sm space-y-6">
            {/* Logo */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-sky-400 flex items-center justify-center">
                  <Handshake className="w-5 h-5 text-slate-950 stroke-[2]" />
                </div>
                <span className="font-mono font-bold text-xl text-white">Skill<span className="text-cyan-400">Swap</span></span>
              </div>
              <h1 className="text-2xl font-bold text-white">Welcome back</h1>
              <p className="text-sm text-slate-400 mt-1">Sign in to your account</p>
            </div>

            <form onSubmit={handleLogin} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-9 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" /> Sign In
              </button>
            </form>

            <p className="text-center text-sm text-slate-400">
              Don't have an account?{' '}
              <button onClick={() => navigate('register')} className="text-cyan-400 hover:text-cyan-300 font-medium">Sign up free</button>
            </p>
            <p className="text-center">
              <button onClick={() => navigate('landing')} className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 mx-auto">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to home
              </button>
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  // ─── REGISTER PAGE ───
  if (page === 'register') {
    return (
      <AppShell hideNav>
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-sm space-y-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-sky-400 flex items-center justify-center">
                  <Handshake className="w-5 h-5 text-slate-950 stroke-[2]" />
                </div>
                <span className="font-mono font-bold text-xl text-white">Skill<span className="text-cyan-400">Swap</span></span>
              </div>
              <h1 className="text-2xl font-bold text-white">Create Account</h1>
              <p className="text-sm text-slate-400 mt-1">Join the student skill exchange network</p>
            </div>

            <form onSubmit={handleRegister} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" value={regName} onChange={e => setRegName(e.target.value)} placeholder="Your name"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition" required />
                </div>
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="student@university.edu"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition" required />
                </div>
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Department</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" value={regDept} onChange={e => setRegDept(e.target.value)} placeholder="Computer Science, Design, etc."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition" required />
                </div>
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type={showPassword ? 'text' : 'password'} value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="Create a password"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-9 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" /> Create Account
              </button>
            </form>

            <p className="text-center text-sm text-slate-400">
              Already have an account?{' '}
              <button onClick={() => navigate('login')} className="text-cyan-400 hover:text-cyan-300 font-medium">Sign in</button>
            </p>
            <p className="text-center">
              <button onClick={() => navigate('landing')} className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 mx-auto">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to home
              </button>
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  // ─── DASHBOARD ───
  if (page === 'dashboard') {
    const myIncoming = requests.filter(r => r.toStudent.id === 'me' && r.status === 'pending');
    return (
      <AppShell>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Welcome Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/30 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar student={CURRENT_USER} size="xl" />
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>WELCOME BACK</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Hello, {CURRENT_USER.name.split(' ')[0]}!</h1>
                  <p className="text-sm text-slate-400 mt-0.5">{CURRENT_USER.department} · {CURRENT_USER.year}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigate('explore')} className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow-md shadow-cyan-500/20 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5" /> Find Skills
                </button>
                <button onClick={() => navigate('profile')} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Active Exchanges', value: MOCK_EXCHANGES.filter(e => e.status === 'active').length, icon: Handshake, color: 'text-cyan-400' },
              { label: 'Completed', value: CURRENT_USER.completedExchanges, icon: CheckCircle2, color: 'text-emerald-400' },
              { label: 'Skills Teaching', value: CURRENT_USER.teachSkills.length, icon: BookOpen, color: 'text-sky-400' },
              { label: 'Pending Requests', value: incomingPending, icon: Inbox, color: 'text-amber-400' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
                <Icon className={`w-5 h-5 ${color} mb-2`} />
                <div className={`text-2xl font-black font-mono ${color}`}>{value}</div>
                <div className="text-xs text-slate-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Exchanges */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" /> Active Exchanges
                </h2>
                <button onClick={() => navigate('exchanges')} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                  View all <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              {MOCK_EXCHANGES.filter(e => e.status === 'active').length === 0 ? (
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center">
                  <Handshake className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">No active exchanges yet.</p>
                  <button onClick={() => navigate('explore')} className="mt-3 text-xs text-cyan-400 hover:text-cyan-300">Start exploring skills →</button>
                </div>
              ) : (
                MOCK_EXCHANGES.filter(e => e.status === 'active').map(exc => (
                  <div key={exc.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg hover:border-slate-700 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar student={exc.partner} size="md" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white text-sm">{exc.partner.name}</span>
                          <StatusBadge status={exc.status} />
                        </div>
                        <p className="text-xs text-slate-400">{exc.partner.department} · Started {exc.startDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                      <div className="flex-1 text-center">
                        <div className="text-[10px] font-mono text-cyan-400 uppercase mb-1">You Teach</div>
                        <SkillBadge skill={exc.teachingSkill} variant="sm" />
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-600" />
                      <div className="flex-1 text-center">
                        <div className="text-[10px] font-mono text-violet-400 uppercase mb-1">You Learn</div>
                        <SkillBadge skill={exc.learningSkill} variant="sm" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-slate-400 font-mono">{exc.sessions} sessions completed</span>
                      <button onClick={() => { setActiveConvId('conv1'); navigate('messages'); }} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" /> Message
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-4">
              {/* Incoming Requests */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Inbox className="w-4 h-4 text-cyan-400" /> New Requests
                    {myIncoming.length > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black">{myIncoming.length}</span>
                    )}
                  </h2>
                  <button onClick={() => navigate('requests')} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                    All <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                {myIncoming.length === 0 ? (
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-center">
                    <Inbox className="w-7 h-7 text-slate-700 mx-auto mb-2" />
                    <p className="text-slate-400 text-xs">No pending requests</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myIncoming.slice(0, 2).map(req => (
                      <RequestCard key={req.id} req={req} currentUserId="me"
                        onAccept={handleAcceptRequest} onReject={handleRejectRequest} />
                    ))}
                  </div>
                )}
              </div>

              {/* Suggested Students */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" /> Suggested
                  </h2>
                  <button onClick={() => navigate('explore')} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                    Explore <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-3">
                  {MOCK_STUDENTS.slice(0, 2).map(student => (
                    <div key={student.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center gap-3">
                      <Avatar student={student} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white text-sm truncate">{student.name}</div>
                        <div className="text-xs text-slate-400">{student.department}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {student.teachSkills.slice(0, 2).map(sk => (
                            <span key={sk.id} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">{sk.name}</span>
                          ))}
                        </div>
                      </div>
                      <button onClick={() => handleSendRequest(student)} className="shrink-0 p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 transition" title="Send Request">
                        <Handshake className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  // ─── EXPLORE SKILLS ───
  if (page === 'explore') {
    return (
      <AppShell>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/30 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                <Search className="w-3.5 h-3.5" /> EXPLORE STUDENTS & SKILLS
              </div>
              <h1 className="text-2xl font-bold text-white">Find Your Perfect Skill Match</h1>
              <p className="text-sm text-slate-400 mt-1">Discover students who can teach what you want to learn.</p>
            </div>
            {/* Search bar */}
            <div className="relative mt-4 max-w-xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by name, skill, or department..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {['All', ...SKILL_CATEGORIES].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results */}
          <div>
            <span className="text-xs font-mono text-slate-400 mb-4 block">
              Showing {filteredStudents.length} of {MOCK_STUDENTS.length} students
            </span>
            {filteredStudents.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/80 border border-slate-800 rounded-2xl">
                <Search className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-400">No students match your search.</p>
                <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="mt-3 text-xs text-cyan-400 hover:text-cyan-300">Clear filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredStudents.map(student => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    onViewProfile={openStudentProfile}
                    onSendRequest={handleSendRequest}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </AppShell>
    );
  }

  // ─── PROFILE PAGE ───
  if (page === 'profile') {
    return (
      <AppShell>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/30 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-5">
              <Avatar student={CURRENT_USER} size="xl" />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-bold text-white">{CURRENT_USER.name}</h1>
                    <p className="text-slate-400 text-sm mt-0.5">{CURRENT_USER.department} · {CURRENT_USER.year}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1">
                        <StarRating rating={CURRENT_USER.rating} />
                        <span className="text-xs text-amber-300 font-mono font-bold ml-1">{CURRENT_USER.rating}</span>
                      </div>
                      <span className="text-xs text-slate-500">·</span>
                      <span className="text-xs text-slate-400">{CURRENT_USER.reviewCount} reviews</span>
                      <span className="text-xs text-slate-500">·</span>
                      <span className="text-xs text-slate-400">{CURRENT_USER.completedExchanges} exchanges</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-4">
                  {editingBio ? (
                    <div className="space-y-2">
                      <textarea
                        value={bioValue}
                        onChange={e => setBioValue(e.target.value)}
                        rows={3}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 resize-none"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => setEditingBio(false)} className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition flex items-center gap-1">
                          <Check className="w-3 h-3" /> Save
                        </button>
                        <button onClick={() => setEditingBio(false)} className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-lg transition">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <p className="text-sm text-slate-300 leading-relaxed">{bioValue}</p>
                      <button onClick={() => setEditingBio(true)} className="shrink-0 p-1 text-slate-600 hover:text-slate-400 transition">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 font-mono">
                  <span className="flex items-center gap-1"><CalendarCheck className="w-3.5 h-3.5" /> Joined {CURRENT_USER.joinedDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skills I Can Teach */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" /> Skills I Can Teach
                </h2>
                <button className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              <div className="space-y-2">
                {CURRENT_USER.teachSkills.map(sk => (
                  <div key={sk.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <SkillBadge skill={sk} />
                    <button className="text-slate-600 hover:text-rose-400 transition">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button className="w-full py-2 rounded-xl border border-dashed border-slate-700 text-slate-500 text-xs hover:border-cyan-700 hover:text-cyan-400 transition flex items-center justify-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Add a skill you can teach
                </button>
              </div>
            </div>

            {/* Skills I Want to Learn */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-violet-400" /> Skills I Want to Learn
                </h2>
                <button className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              <div className="space-y-2">
                {CURRENT_USER.learnSkills.map(sk => (
                  <div key={sk.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <SkillBadge skill={sk} />
                    <button className="text-slate-600 hover:text-rose-400 transition">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button className="w-full py-2 rounded-xl border border-dashed border-slate-700 text-slate-500 text-xs hover:border-violet-700 hover:text-violet-400 transition flex items-center justify-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Add a skill you want to learn
                </button>
              </div>
            </div>
          </div>

          {/* Exchange History */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-amber-400" /> Exchange History
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 font-mono text-slate-400">
                    <th className="pb-2">Partner</th>
                    <th className="pb-2">Taught</th>
                    <th className="pb-2">Learned</th>
                    <th className="pb-2">Sessions</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {MOCK_EXCHANGES.map(exc => (
                    <tr key={exc.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <Avatar student={exc.partner} size="sm" />
                          <span className="text-slate-200 font-medium">{exc.partner.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-cyan-300">{exc.teachingSkill.name}</td>
                      <td className="py-2.5 text-violet-300">{exc.learningSkill.name}</td>
                      <td className="py-2.5 font-mono text-slate-300">{exc.sessions}</td>
                      <td className="py-2.5"><StatusBadge status={exc.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  // ─── STUDENT PROFILE (view another student) ───
  if (page === 'student-profile' && selectedStudent) {
    return (
      <AppShell>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <button onClick={() => navigate('explore')} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Explore
          </button>

          <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/30 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-5">
              <Avatar student={selectedStudent} size="xl" />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-bold text-white">{selectedStudent.name}</h1>
                    <p className="text-slate-400 text-sm mt-0.5">{selectedStudent.department} · {selectedStudent.year}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1">
                        <StarRating rating={selectedStudent.rating} />
                        <span className="text-xs text-amber-300 font-mono font-bold ml-1">{selectedStudent.rating}</span>
                      </div>
                      <span className="text-xs text-slate-500">·</span>
                      <span className="text-xs text-slate-400">{selectedStudent.reviewCount} reviews</span>
                      <span className="text-xs text-slate-500">·</span>
                      <span className="text-xs text-slate-400">{selectedStudent.completedExchanges} exchanges</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleSendRequest(selectedStudent)}
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow-md shadow-cyan-500/20 flex items-center gap-1.5">
                      <Handshake className="w-3.5 h-3.5" /> Send Request
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5" /> Message
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mt-4">{selectedStudent.bio}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 font-mono">
                  <span className="flex items-center gap-1"><CalendarCheck className="w-3.5 h-3.5" /> Joined {selectedStudent.joinedDate}</span>
                  {selectedStudent.online && <span className="flex items-center gap-1 text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Online</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-cyan-400" /> Can Teach
              </h2>
              <div className="flex flex-wrap gap-2">
                {selectedStudent.teachSkills.map(sk => <SkillBadge key={sk.id} skill={sk} />)}
              </div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
                <GraduationCap className="w-4 h-4 text-violet-400" /> Wants to Learn
              </h2>
              <div className="flex flex-wrap gap-2">
                {selectedStudent.learnSkills.map(sk => <SkillBadge key={sk.id} skill={sk} />)}
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  // ─── REQUESTS PAGE ───
  if (page === 'requests') {
    const incoming = requests.filter(r => r.toStudent.id === 'me');
    const sent = requests.filter(r => r.fromStudent.id === 'me');
    return (
      <AppShell>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/30 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                <Inbox className="w-3.5 h-3.5" /> SKILL EXCHANGE REQUESTS
              </div>
              <h1 className="text-2xl font-bold text-white">Requests</h1>
              <p className="text-sm text-slate-400 mt-1">Manage your incoming and outgoing skill exchange requests.</p>
            </div>
          </div>

          <div className="flex gap-2 border-b border-slate-800/80 pb-0">
            {[{ id: 'incoming', label: `Incoming (${incoming.length})` }, { id: 'sent', label: `Sent (${sent.length})` }].map(tab => (
              <button key={tab.id} onClick={() => setRequestTab(tab.id as 'incoming' | 'sent')}
                className={`px-4 py-2.5 text-sm font-medium transition border-b-2 -mb-px ${
                  requestTab === tab.id
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {(requestTab === 'incoming' ? incoming : sent).length === 0 ? (
              <div className="text-center py-16 bg-slate-900/80 border border-slate-800 rounded-2xl">
                <Inbox className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-400">No {requestTab} requests yet.</p>
              </div>
            ) : (
              (requestTab === 'incoming' ? incoming : sent).map(req => (
                <RequestCard key={req.id} req={req} currentUserId="me"
                  onAccept={handleAcceptRequest} onReject={handleRejectRequest} />
              ))
            )}
          </div>
        </div>
      </AppShell>
    );
  }

  // ─── MESSAGES PAGE ───
  if (page === 'messages') {
    return (
      <AppShell>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden" style={{ height: 'calc(100vh - 10rem)' }}>
            <div className="flex h-full">
              {/* Conversation List */}
              <div className="w-72 border-r border-slate-800 flex flex-col shrink-0">
                <div className="p-4 border-b border-slate-800">
                  <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-cyan-400" /> Messages
                  </h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {conversations.map(conv => (
                    <button
                      key={conv.id}
                      onClick={() => setActiveConvId(conv.id)}
                      className={`w-full flex items-center gap-3 p-4 hover:bg-slate-800/50 transition text-left border-b border-slate-800/60 ${activeConvId === conv.id ? 'bg-slate-800/60' : ''}`}
                    >
                      <Avatar student={conv.partner} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white text-sm truncate">{conv.partner.name}</div>
                        <div className="text-xs text-slate-400 truncate">
                          {conv.messages[conv.messages.length - 1]?.text}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              {activeConversation ? (
                <div className="flex-1 flex flex-col min-w-0">
                  {/* Chat Header */}
                  <div className="p-4 border-b border-slate-800 flex items-center gap-3">
                    <Avatar student={activeConversation.partner} size="md" />
                    <div>
                      <div className="font-medium text-white text-sm">{activeConversation.partner.name}</div>
                      <div className="text-xs text-slate-400">{activeConversation.partner.department}</div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {activeConversation.messages.map(msg => {
                      const isMe = msg.senderId === 'me';
                      return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                            isMe
                              ? 'bg-cyan-500 text-slate-950 font-medium rounded-br-sm'
                              : 'bg-slate-800 text-slate-200 rounded-bl-sm'
                          }`}>
                            <p>{msg.text}</p>
                            <p className={`text-[10px] mt-1 ${isMe ? 'text-slate-800' : 'text-slate-500'}`}>{msg.timestamp}</p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition shadow-sm shadow-cyan-500/20"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center px-6">
                  <div>
                    <MessageCircle className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  // ─── MY EXCHANGES PAGE ───
  if (page === 'exchanges') {
    return (
      <AppShell>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/30 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                <Handshake className="w-3.5 h-3.5" /> MY SKILL EXCHANGES
              </div>
              <h1 className="text-2xl font-bold text-white">My Exchanges</h1>
              <p className="text-sm text-slate-400 mt-1">Track your ongoing and completed skill exchange journeys.</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Active', value: MOCK_EXCHANGES.filter(e => e.status === 'active').length, color: 'text-emerald-400' },
              { label: 'Completed', value: MOCK_EXCHANGES.filter(e => e.status === 'completed').length, color: 'text-cyan-400' },
              { label: 'Total Sessions', value: MOCK_EXCHANGES.reduce((sum, e) => sum + e.sessions, 0), color: 'text-violet-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
                <div className={`text-2xl font-black font-mono ${color}`}>{value}</div>
                <div className="text-xs text-slate-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Exchanges list */}
          <div className="space-y-4">
            {MOCK_EXCHANGES.map(exc => (
              <div key={exc.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg hover:border-slate-700 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar student={exc.partner} size="md" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-white text-sm">{exc.partner.name}</span>
                      <StatusBadge status={exc.status} />
                    </div>
                    <p className="text-xs text-slate-400">{exc.partner.department} · Started {exc.startDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 mb-4">
                  <div className="flex-1 text-center">
                    <div className="text-[10px] font-mono text-cyan-400 uppercase mb-1">You Teach</div>
                    <SkillBadge skill={exc.teachingSkill} />
                  </div>
                  <div className="flex flex-col items-center">
                    <ArrowRight className="w-4 h-4 text-slate-600" />
                    <Handshake className="w-4 h-4 text-slate-700 mt-1" />
                    <ArrowLeft className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-[10px] font-mono text-violet-400 uppercase mb-1">You Learn</div>
                    <SkillBadge skill={exc.learningSkill} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5 text-cyan-400" /> {exc.sessions} sessions</span>
                    <span className="flex items-center gap-1"><CalendarCheck className="w-3.5 h-3.5 text-slate-500" /> {exc.startDate}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setActiveConvId(MOCK_CONVERSATIONS[0].id); navigate('messages'); }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Message
                    </button>
                    {exc.status === 'active' && (
                      <button className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-medium transition flex items-center gap-1.5 border border-cyan-800/60">
                        <CalendarCheck className="w-3.5 h-3.5" /> Log Session
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  // ─── SETTINGS PAGE ───
  if (page === 'settings') {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/30 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                <Settings className="w-3.5 h-3.5" /> ACCOUNT SETTINGS
              </div>
              <h1 className="text-2xl font-bold text-white">Settings</h1>
            </div>
          </div>

          {/* Account */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" /> Account Information
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Full Name', value: CURRENT_USER.name },
                { label: 'Email', value: 'demo@university.edu' },
                { label: 'Department', value: CURRENT_USER.department },
                { label: 'Year', value: CURRENT_USER.year },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div>
                    <div className="text-[10px] font-mono text-slate-500 uppercase">{label}</div>
                    <div className="text-sm text-slate-200 mt-0.5">{value}</div>
                  </div>
                  <button className="text-xs text-cyan-400 hover:text-cyan-300 transition">Edit</button>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyan-400" /> Notifications
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Push Notifications', desc: 'Receive alerts for new requests and messages', value: notificationsOn, onChange: setNotificationsOn },
                { label: 'Email Alerts', desc: 'Get email updates about your exchanges', value: emailAlerts, onChange: setEmailAlerts },
              ].map(({ label, desc, value, onChange }) => (
                <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div>
                    <div className="text-sm text-slate-200 font-medium">{label}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
                  </div>
                  <button
                    onClick={() => onChange(!value)}
                    className={`w-10 h-5.5 rounded-full relative transition-colors ${value ? 'bg-cyan-500' : 'bg-slate-700'}`}
                    style={{ height: '22px', width: '40px' }}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-slate-900/80 border border-rose-900/40 rounded-2xl p-5 shadow-lg space-y-4">
            <h2 className="text-sm font-semibold text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Account Actions
            </h2>
            <div className="flex flex-wrap gap-3">
              <button onClick={handleLogout} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition flex items-center gap-1.5">
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
              <button className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 text-xs font-medium transition flex items-center gap-1.5 border border-rose-900/60">
                <Trash2 className="w-3.5 h-3.5" /> Delete Account
              </button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  // Fallback
  return <AppShell><div className="flex items-center justify-center h-screen text-slate-400">Page not found.</div></AppShell>;
}
