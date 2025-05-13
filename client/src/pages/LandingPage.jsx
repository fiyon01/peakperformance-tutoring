import { useState, useRef, lazy, Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Calendar, MapPin, DollarSign, Star, ChevronLeft, ChevronRight,
  Quote, User, ArrowRight, Search, Mail, Phone, Home, Send, Check, 
  AlertCircle, BookOpen, GraduationCap, ClipboardCheck, Instagram, 
  Twitter, Facebook, Youtube, ArrowUpRight, Grid, Clock, Users as UsersIcon,
  Award, Rocket, Target, BarChart2, Bookmark, Zap, Shield, FileText,
  PieChart, TrendingUp, HelpCircle, Clock as ClockIcon, MessageSquare, UserCheck, Image as ImageIcon,
  Heart, Smile, School, Globe, ShieldCheck, Book, Lightbulb, Feather, Award as AwardIcon
} from 'lucide-react';
import { Link } from "react-router-dom";
import Logo from "../assets/icons8-graduation-cap-30.png";

// Lazy-loaded components
const TestimonialForm = lazy(() => import('./TestimonialForm'));
const ConsultationForm = lazy(() => import('./ConsultationForm'));
const HomeTuitionForm = lazy(() => import('./HomeTuitionForm'));

// Floating shapes component
const FloatingShapes = () => {
  const shapes = [
    { icon: <Book className="w-6 h-6 text-purple-400" />, size: 40, delay: 0, duration: 15, x: 10, y: 20 },
    { icon: <Lightbulb className="w-6 h-6 text-blue-400" />, size: 30, delay: 2, duration: 12, x: 80, y: 50 },
    { icon: <Feather className="w-6 h-6 text-indigo-400" />, size: 50, delay: 4, duration: 18, x: 40, y: 70 },
    { icon: <AwardIcon className="w-6 h-6 text-pink-400" />, size: 35, delay: 1, duration: 14, x: 70, y: 30 }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: shape.y, x: shape.x }}
          animate={{
            opacity: [0, 0.8, 0],
            y: [shape.y, shape.y - 100, shape.y - 200],
            x: [shape.x, shape.x + 20, shape.x - 20]
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear"
          }}
          className="absolute"
          style={{
            width: shape.size,
            height: shape.size,
          }}
        >
          {shape.icon}
        </motion.div>
      ))}
    </div>
  );
};

const AnimatedCounter = ({ value, duration = 1.5 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;

    const incrementTime = (duration * 1000) / end;
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}{value.includes('%') ? '%' : '+'}</span>;
};

const PeakPerformanceTutoring = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [showHomeTuitionModal, setShowHomeTuitionModal] = useState(false);
  const galleryRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [programs, setPrograms] = useState([]);
  const [loadedImages, setLoadedImages] = useState({});
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch programs from backend
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/programs');
        if (!response.ok) {
          throw new Error('Failed to fetch programs');
        }
        const data = await response.json();
        setPrograms(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching programs:', error);
        setIsLoading(false);
        // Fallback data if API fails
        setPrograms([
          { 
            id: 1, 
            name: "Primary Math Magic", 
            year: 2023,
            term: "Term 2",
            duration: "8 weeks",
            start_date: "2023-05-15",
            end_date: "2023-07-10",
            status: "upcoming",
            is_active: true,
            image_url: "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
            price: 250.00,
            description: "Fun and engaging math lessons for primary students. Games, puzzles, and interactive learning!",
            slots: 12,
            level: "Primary (Grades 1-8)",
            time: "Mon & Wed, 3-4PM",
            venue: "Online & In-Person"
          },
          { 
            id: 2, 
            name: "Science Explorers Club", 
            year: 2023,
            term: "Term 2",
            duration: "10 weeks",
            start_date: "2023-05-20",
            end_date: "2023-07-29",
            status: "upcoming",
            is_active: true,
            image_url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
            price: 300.00,
            description: "Exciting experiments and discovery-based learning for young scientists. Safety first!",
            slots: 10,
            level: "Primary (Grades 4-8)",
            time: "Tue & Thu, 4-5PM",
            venue: "Online & In-Person"
          },
          { 
            id: 3, 
            name: "Reading Adventure", 
            year: 2023,
            term: "Term 2",
            duration: "6 weeks",
            start_date: "2023-06-01",
            end_date: "2023-07-10",
            status: "upcoming",
            is_active: true,
            image_url: "https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
            price: 200.00,
            description: "Interactive reading program with storytime, comprehension games, and vocabulary building.",
            slots: 15,
            level: "Primary (Grades 1-4)",
            time: "Fri, 3-4PM",
            venue: "Online"
          },
          { 
            id: 4, 
            name: "Creative Writing Workshop", 
            year: 2023,
            term: "Term 2",
            duration: "8 weeks",
            start_date: "2023-05-15",
            end_date: "2023-07-10",
            status: "upcoming",
            is_active: true,
            image_url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
            price: 280.00,
            description: "Spark imagination and develop writing skills through fun prompts and storytelling activities.",
            slots: 12,
            level: "Primary (Grades 3-8)",
            time: "Sat, 10-11AM",
            venue: "In-Person"
          }
        ]);
      }
    };

    fetchPrograms();
  }, []);

  const handleImageLoad = (id) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  const closeMenu = () => setIsMenuOpen(false);

  // Sample testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Parent of Grade 3 Student",
      text: "My daughter used to hate math, but now she can't wait for her tutoring sessions! Her grades improved from Cs to As after just two months.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Parent of Grade 5 Student",
      text: "The personalized approach helped my son develop a love for reading. He's now reading books above his grade level!",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 3,
      name: "Grace Mwangi",
      role: "Grade 7 Student",
      text: "Science is now my favorite subject! The experiments are so cool and I understand everything much better.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/63.jpg"
    }
  ];

  const galleryImages = [
    "https://scontent.fnbo16-1.fna.fbcdn.net/v/t39.30808-6/475879454_1184209423370917_7326451790253706885_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=Ue3hYsF5Q1gQ7kNvwEfUn0r&_nc_oc=AdmYHFvAF6UYQGEJDH1DJSJKhgz2xchAeL4XNI8IN7Igyp_5d0OZJx7NDSMLT28o4H0&_nc_zt=23&_nc_ht=scontent.fnbo16-1.fna&_nc_gid=RItWCXsm_LPin5xswPXg6A&oh=00_AfHwhdv0z7akEJn9dB6FAzLIMTpFY--jw1Xs4-D_IKAg_A&oe=681B9B1E",
    "https://scontent.fnbo16-1.fna.fbcdn.net/v/t39.30808-6/490582004_1235073248284534_6947471108058900747_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=Nru45LgHYqkQ7kNvwFUtsSP&_nc_oc=AdmKFECrw-sIBY7qTGDSGAp9LSLTm4pAQcAkIKiVGQTC2tTlr67YZV7RIaa9LHA4904&_nc_zt=23&_nc_ht=scontent.fnbo16-1.fna&_nc_gid=vbE23qMXgBXxtkV7AiiwLQ&oh=00_AfHVxej-83_olkToC0UvczjN-4Tmx6xLCcB4Ip6QJB9Sbg&oe=681BAD8B",
    "https://scontent.fnbo16-1.fna.fbcdn.net/v/t39.30808-6/475539602_1184209480037578_3269351206353649665_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=nTHFQfnKVy4Q7kNvwFGaX91&_nc_oc=AdkJodbg2j2oK86Z02C4fZ1qwH35iA21PYsJ_rqdOwPJwqgc0cXebJQb6sLBf9owHLE&_nc_zt=23&_nc_ht=scontent.fnbo16-1.fna&_nc_gid=-FcFAzUJjLAa-CvhjBbQxg&oh=00_AfGViwGbcMOmvOyJ_c4rMC_YEUXQTI-Adgd7Sp9usQk4vw&oe=681B7E22",
    "https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
  ];

  const filteredPrograms = programs
  .filter(program =>
    program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (program.description && program.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )
  .sort((a, b) => a.level.localeCompare(b.level)); // Sort by grade level


  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const openModal = (program) => {
    setSelectedProgram(program);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setShowConsultationModal(false);
    setShowHomeTuitionModal(false);
    document.body.style.overflow = 'auto';
  };

  const openConsultationModal = () => {
    setShowConsultationModal(true);
    document.body.style.overflow = 'hidden';
  };

  const openHomeTuitionModal = () => {
    setShowHomeTuitionModal(true);
    document.body.style.overflow = 'hidden';
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-white font-sans antialiased overflow-x-hidden">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-purple-100/30 blur-3xl -z-10"></div>
        <div className="absolute top-2/3 right-1/4 w-60 h-60 rounded-full bg-blue-100/30 blur-3xl -z-10"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-indigo-100/20 blur-3xl -z-10"></div>
      </div>

      {/* Navigation */}
      <motion.nav 
        className={`fixed w-full ${isScrolled ? 'bg-white/95 shadow-md' : 'bg-white/80'} backdrop-blur-md z-50 border-b border-gray-100 transition-all duration-300`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <motion.div
                whileHover={{ rotate: 15 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <img 
                  src={Logo} 
                  alt="logo" 
                  className="w-8 h-8" 
                  loading="lazy"
                />
              </motion.div>
              <motion.span 
                className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                Peak Performance
              </motion.span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {[
                { name: "Home", icon: <Home className="w-4 h-4" />, href: "#" },
                { name: "About Us", icon: <User className="w-4 h-4" />, href: "/about-us" },
                { name: "Programs", icon: <BookOpen className="w-4 h-4" />, href: "#programs" },
                { name: "Method", icon: <ClipboardCheck className="w-4 h-4" />, href: "#method" },
                { name: "Results", icon: <BarChart2 className="w-4 h-4" />, href: "#testimonials" },
                { name: "Policies", icon: <ShieldCheck className="w-4 h-4" />, href: "/policies" }
              ].map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  className="text-gray-700 hover:text-purple-600 transition flex items-center gap-1 group"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
                  <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-600 after:to-purple-600 after:transition-all after:duration-300 group-hover:after:w-full">
                    {item.name}
                  </span>
                </motion.a>
              ))}
              <Link to="/auth/students-signup">
                <motion.button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-full hover:opacity-90 transition shadow-lg shadow-blue-100/50 hover:shadow-purple-100/50 flex items-center gap-2 group"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Students Signup</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-7 w-7 text-purple-600" />
              ) : (
                <Menu className="h-7 w-7 text-purple-600" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 bg-white z-40 pt-20 px-6"
          >
            <div className="flex flex-col space-y-6 py-8">
              {[
                { name: "Home", icon: <Home className="w-5 h-5" />, href: "#", onClick: closeMenu },
                { name: "About Us", icon: <User className="w-5 h-5" />, href: "/about-us", onClick: closeMenu },
                { name: "Programs", icon: <BookOpen className="w-5 h-5" />, href: "#programs", onClick: closeMenu },
                { name: "Method", icon: <ClipboardCheck className="w-5 h-5" />, href: "#method", onClick: closeMenu },
                { name: "Results", icon: <BarChart2 className="w-5 h-5" />, href: "#testimonials", onClick: closeMenu },
                { name: "Policies", icon: <ShieldCheck className="w-5 h-5" />, href: "/policies", onClick: closeMenu }
              ].map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  onClick={item.onClick}
                  className="text-lg text-gray-700 border-b border-gray-100 pb-4 flex items-center gap-2 group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ x: 5 }}
                >
                  <span className="group-hover:text-purple-600 transition-colors">{item.icon}</span>
                  <span className="group-hover:text-purple-600 transition-colors">{item.name}</span>
                </motion.a>
              ))}
              <Link to="/auth/students-signup">
                <motion.button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-full text-lg mt-4 w-full flex items-center justify-center gap-2 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Students Signup</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        <FloatingShapes />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="order-2 lg:order-1">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
            >
 <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
    Learning Made Fun, Join Peak Performance Tutoring
  </span>            
            
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600 mb-10 max-w-lg"
            >
              95% of our students show improved grades and confidence. Engaging lessons designed for young learners.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button 
                onClick={openConsultationModal}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full hover:opacity-90 transition shadow-xl shadow-blue-100/50 hover:shadow-purple-100/50 font-medium flex items-center justify-center gap-2 group"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Book Consultation</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button 
                onClick={openHomeTuitionModal}
                className="bg-white text-gray-700 px-8 py-4 rounded-full hover:bg-gray-50 transition border-2 border-gray-200 font-medium flex items-center justify-center gap-2 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Home Tuition</span>
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </motion.button>
            </motion.div>

            <motion.div 
              className="mt-10 flex flex-wrap gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {[
                { text: "Child-Safe", icon: <ShieldCheck className="w-5 h-5" /> },
                { text: "Engaging", icon: <Smile className="w-5 h-5" /> },
                { text: "Certified Tutors", icon: <GraduationCap className="w-5 h-5" /> }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full text-blue-700"
                  whileHover={{ scale: 1.05 }}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video">
              <img 
                src="https://scontent.fnbo16-1.fna.fbcdn.net/v/t39.30808-6/475776239_1184209490037577_6189773692748365533_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=u_QIscXupp0Q7kNvwFdUD6K&_nc_oc=Adm4nTnlINZdBagRS8fHMUfyHU8fY5hB-_Z5viZyKnUITCyzdAH8uwNuDueHlPhJ01s&_nc_zt=23&_nc_ht=scontent.fnbo16-1.fna&_nc_gid=G96zAa1gMKzKIyQkhVluMw&oh=00_AfF_-E46XI72xCip2h8_HWGFDnZtkiCprdkaIgZ0Cv6fpw&oe=681B95DB" 
                alt="Tutoring session" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            
            <motion.div 
              className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100 hidden lg:block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-3">
                <motion.div 
                  className="bg-blue-100 p-3 rounded-full"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Award className="w-6 h-6 text-blue-600" />
                </motion.div>
                <div>
                  <p className="text-sm text-gray-500">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter value="95" />%
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="absolute -top-6 -right-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100 hidden lg:block"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center gap-3">
                <motion.div 
                  className="bg-purple-100 p-3 rounded-full"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="w-6 h-6 text-purple-600" />
                </motion.div>
                <div>
                  <p className="text-sm text-gray-500">Happy Students</p>
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter value="200" />+
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-gradient-to-r from-blue-50 to-purple-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {[
              { name: "Certified Tutors", value: "10+", icon: <GraduationCap className="w-8 h-8 text-blue-600" />, color: "bg-blue-100" },
              { name: "Years Experience", value: "2+", icon: <Clock className="w-8 h-8 text-purple-600" />, color: "bg-purple-100" },
              { name: "Student Satisfaction", value: "95%", icon: <Smile className="w-8 h-8 text-indigo-600" />, color: "bg-indigo-100" },
              { name: "Success Rate", value: "95%", icon: <Award className="w-8 h-8 text-pink-600" />, color: "bg-pink-100" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-center mb-3">
                  <motion.div
                    className={`${item.color} p-4 rounded-full`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    {item.icon}
                  </motion.div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  <AnimatedCounter value={item.value} />
                </p>
                <p className="text-gray-600">{item.name}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="inline-block mb-4"
            >
              <Bookmark className="w-10 h-10 text-purple-600" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fun Learning Programs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Engaging courses designed specifically for primary school students.
            </p>
          </motion.div>

          <motion.div 
            className="max-w-2xl mx-auto mb-16 relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search programs by subject or grade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 border border-gray-200 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition pl-14 text-lg shadow-sm hover:shadow-md"
              />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </motion.div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-4 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-full"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-5/6"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse mt-6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
              {filteredPrograms.length > 0 ? (
                filteredPrograms.map((program) => (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition border border-gray-100 group relative"
                  >
                    <div className="absolute top-4 right-4 z-10">
                      <motion.div 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-3 py-1 rounded-full"
                        whileHover={{ scale: 1.1 }}
                      >
                        {program.level}
                      </motion.div>
                    </div>
                    
                    <div className="h-48 overflow-hidden relative">
                      {!loadedImages[program.id] && (
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse"></div>
                      )}
                      <img 
                        src={program.image_url} 
                        alt={program.name} 
                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${loadedImages[program.id] ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => handleImageLoad(program.id)}
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{program.name}</h3>
                        <span className="inline-block bg-purple-100 text-purple-600 text-xs px-3 py-1 rounded-full">
                          {program.term || "Term 2"}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{program.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 my-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <ClockIcon className="w-4 h-4 text-purple-500" />
                          <span className="text-sm">{program.time || "Flexible"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4 text-purple-500" />
                          <span className="text-sm">{program.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <School className="w-4 h-4 text-purple-500" />
                          <span className="text-sm">{program.venue || "Online"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <UsersIcon className="w-4 h-4 text-purple-500" />
                          <span className="text-sm">{program.slots ? `${program.slots} spots left` : "Limited spots"}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-6">
                        <div className="text-xl font-bold text-gray-900">Ksh{program.price?.toFixed(2) || "350"}</div>
                        <motion.button 
                          onClick={() => openModal(program)}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-2 text-sm group"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span>Register Now</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="bg-blue-50 p-8 rounded-xl inline-block">
                    <Search className="w-10 h-10 text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600">No programs found matching your search.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Method */}
      <section id="method" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/4 left-1/4 w-20 h-20 rounded-full bg-blue-300 blur-xl"></div>
          <div className="absolute top-2/3 right-1/4 w-32 h-32 rounded-full bg-purple-300 blur-xl"></div>
          <div className="absolute bottom-1/4 right-1/3 w-40 h-40 rounded-full bg-indigo-300 blur-xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" /> Our Methodology
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">How We Make Learning Fun</h2>
                <p className="text-xl text-gray-600 mb-8">
                  Our child-friendly approach combines education with engagement for optimal results.
                </p>
              </motion.div>

              <div className="space-y-6">
                {[
                  {
                    title: "Interactive Diagnostics",
                    description: "Game-based assessments to understand each child's learning style",
                    icon: <PieChart className="w-6 h-6 text-blue-600" />,
                    color: "bg-blue-100"
                  },
                  {
                    title: "Personalized Learning",
                    description: "Custom plans that match your child's interests and pace",
                    icon: <FileText className="w-6 h-6 text-purple-600" />,
                    color: "bg-purple-100"
                  },
                  {
                    title: "Engaging Instruction",
                    description: "Tutors trained in making learning fun and interactive",
                    icon: <UsersIcon className="w-6 h-6 text-indigo-600" />,
                    color: "bg-indigo-100"
                  },
                  {
                    title: "Progress Through Play",
                    description: "Educational games and rewards to track improvement",
                    icon: <TrendingUp className="w-6 h-6 text-pink-600" />,
                    color: "bg-pink-100"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-4 group bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition"
                    whileHover={{ x: 5 }}
                  >
                    <motion.div 
                      className={`${item.color} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition`}
                      whileHover={{ rotate: 15 }}
                    >
                      {item.icon}
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-square">
                <img 
                  src="https://scontent.fnbo16-1.fna.fbcdn.net/v/t39.30808-6/491011600_1235931784865347_4377647374567062304_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=XdZ5QbYG-tAQ7kNvwGGrVWL&_nc_oc=AdlquswI7hL0UNhZGPQWkHrjAW8YQgI5lFHYgvPRgp8hJ1G7e7Ex9FVki9lsfbYz1jk&_nc_zt=23&_nc_ht=scontent.fnbo16-1.fna&_nc_gid=INpWg3u8zZjpSY_KDooMRQ&oh=00_AfEhuKQnB_27wMfa-tWXilXqDdoiY23s67ImczvbroRmmw&oe=681BB21B" 
                  alt="Tutoring method" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <motion.div 
                className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100 hidden lg:block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Parent Rating</p>
                    <p className="text-2xl font-bold text-gray-900">4.9/5</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-blue-300 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full bg-purple-300 blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="inline-block mb-4"
            >
              <MessageSquare className="w-10 h-10 text-purple-600" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Parents & Students Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from families who've experienced the Peak Performance difference.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 md:p-12 rounded-2xl shadow-sm relative overflow-hidden"
              >
                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-blue-200/20"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-purple-200/20"></div>
                
                <div className="flex flex-col md:flex-row gap-8 relative z-10">
                  <div className="flex-shrink-0">
                    <motion.div 
                      className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md"
                      whileHover={{ scale: 1.05 }}
                    >
                      <img 
                        src={testimonials[currentTestimonial].avatar} 
                        alt={testimonials[currentTestimonial].name} 
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </div>
                  <div>
                    <Quote className="w-8 h-8 text-gray-300 mb-4" />
                    <p className="text-xl text-gray-700 mb-6">
                      "{testimonials[currentTestimonial].text}"
                    </p>
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonials[currentTestimonial].name}</h4>
                      <p className="text-gray-600">{testimonials[currentTestimonial].role}</p>
                      <div className="flex mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-5 h-5 ${i < testimonials[currentTestimonial].rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center mt-8 gap-4">
              <motion.button 
                onClick={prevTestimonial}
                className="bg-white p-3 rounded-full shadow-md hover:bg-gray-50 transition"
                aria-label="Previous testimonial"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </motion.button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition ${currentTestimonial === index ? 'bg-purple-600 w-4' : 'bg-gray-300'}`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              <motion.button 
                onClick={nextTestimonial}
                className="bg-white p-3 rounded-full shadow-md hover:bg-gray-50 transition"
                aria-label="Next testimonial"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Form Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Share Your Experience</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We'd love to hear how Peak Performance has helped your child's learning journey.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <MessageSquare className="w-8 h-8" />
                </motion.div>
                <h3 className="text-xl font-bold">Submit Your Testimonial</h3>
              </div>
            </div>
            
            <Suspense fallback={
              <div className="p-8">
                <div className="h-96 bg-gray-100 rounded-xl animate-pulse"></div>
              </div>
            }>
              <TestimonialForm />
            </Suspense>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="inline-block mb-4"
            >
              <ImageIcon className="w-10 h-10 text-purple-600" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Learning Adventures</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Glimpses of our students' exciting journey to academic success.
            </p>
          </motion.div>

          <div ref={galleryRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition"
              >
                <div className="aspect-square">
                  <img 
                    src={image} 
                    alt={`Gallery ${index + 1}`} 
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-6">
                  <div className="translate-y-4 group-hover:translate-y-0 transition">
                    <motion.div 
                      className="bg-white rounded-full w-10 h-10 flex items-center justify-center mb-3"
                      whileHover={{ scale: 1.1 }}
                    >
                      <ArrowUpRight className="w-5 h-5 text-gray-900" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-purple-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-blue-400 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full bg-purple-400 blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="inline-block mb-6"
            >
              <Rocket className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Boost Your Child's Learning?</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
              Schedule a consultation with our team to discuss your child's needs and create a personalized learning plan.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button 
                onClick={openConsultationModal}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full hover:opacity-90 transition shadow-xl font-medium flex items-center justify-center gap-2 group"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Book Consultation</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button 
                onClick={openHomeTuitionModal}
                className="bg-white/10 text-white px-8 py-4 rounded-full hover:bg-white/20 transition border border-white/20 font-medium flex items-center justify-center gap-2 group"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.1)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Home Tuition</span>
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 pt-16 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-60 h-60 rounded-full bg-blue-900 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-900 blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-5 gap-12">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <motion.img 
                  src={Logo} 
                  alt="logo" 
                  className="w-8 h-8" 
                  whileHover={{ rotate: 15 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Peak Performance
                </span>
              </h3>
              <p className="mb-6">
                Making learning fun and effective for primary school students.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: <Instagram className="w-5 h-5" />, label: "Instagram" },
                  { icon: <Twitter className="w-5 h-5" />, label: "Twitter" },
                  { icon: <Facebook className="w-5 h-5" />, label: "Facebook" },
                  { icon: <Youtube className="w-5 h-5" />, label: "YouTube" }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                    aria-label={social.label}
                    whileHover={{ y: -3, color: "#ffffff" }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
            
            {[
              {
                title: "Company",
                links: [
                  { name: "About Us", icon: <ArrowRight className="w-3 h-3" /> },
                  { name: "Our Tutors", icon: <ArrowRight className="w-3 h-3" /> },
                  { name: "Results", icon: <ArrowRight className="w-3 h-3" /> },
                  { name: "Careers", icon: <ArrowRight className="w-3 h-3" /> }
                ]
              },
              {
                title: "Resources",
                links: [
                  { name: "Blog", icon: <ArrowRight className="w-3 h-3" /> },
                  { name: "Research", icon: <ArrowRight className="w-3 h-3" /> },
                  { name: "Webinars", icon: <ArrowRight className="w-3 h-3" /> },
                  { name: "FAQs", icon: <ArrowRight className="w-3 h-3" /> }
                ]
              },
              {
                title: "Support",
                links: [
                  { name: "Help Center", icon: <ArrowRight className="w-3 h-3" /> },
                  { name: "Privacy Policy", icon: <ArrowRight className="w-3 h-3" /> },
                  { name: "Terms", icon: <ArrowRight className="w-3 h-3" /> },
                  { name: "Contact", icon: <ArrowRight className="w-3 h-3" /> }
                ]
              }
            ].map((section, index) => (
              <div key={index}>
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <motion.li 
                      key={linkIndex}
                      whileHover={{ x: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <a href="#" className="hover:text-white transition flex items-center gap-2">
                        <span className="text-purple-400 group-hover:text-white">{link.icon}</span>
                        {link.name}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact</h4>
              <ul className="space-y-3">
                <motion.li 
                  className="flex items-center gap-2 hover:text-white transition"
                  whileHover={{ x: 5 }}
                >
                  <Mail className="w-4 h-4 text-purple-400" /> info@peakperformance.com
                </motion.li>
                <motion.li 
                  className="flex items-center gap-2 hover:text-white transition"
                  whileHover={{ x: 5 }}
                >
                  <Phone className="w-4 h-4 text-purple-400" /> +254798971625
                </motion.li>
                <motion.li 
                  className="flex items-center gap-2 hover:text-white transition"
                  whileHover={{ x: 5 }}
                >
                  <Home className="w-4 h-4 text-purple-400" /> 338-00902 Kikuyu
                </motion.li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>© {new Date().getFullYear()} Peak Performance Tutoring. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <motion.a 
                href="#" 
                className="hover:text-white transition"
                whileHover={{ y: -2 }}
              >
                Privacy Policy
              </motion.a>
              <motion.a 
                href="#" 
                className="hover:text-white transition"
                whileHover={{ y: -2 }}
              >
                Terms of Service
              </motion.a>
            </div>
          </div>
        </div>
      </footer>

      {/* Registration Modal */}
      <AnimatePresence>
        {showModal && selectedProgram && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedProgram.name}</h3>
                  <button 
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 transition"
                    aria-label="Close modal"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="mb-6">
                  <div className="h-48 rounded-lg overflow-hidden mb-4 relative">
                    <img 
                      src={selectedProgram.image_url} 
                      alt={selectedProgram.name} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                      <div className="text-white font-bold">{selectedProgram.level}</div>
                    </div>
                  </div>
                  
                  <div className="mb-4 grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Term</p>
                      <p className="font-medium">{selectedProgram.term}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">{selectedProgram.duration}</p>
                    </div>
                    <div className="bg-indigo-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Dates</p>
                      <p className="font-medium">{formatDate(selectedProgram.start_date)} to {formatDate(selectedProgram.end_date)}</p>
                    </div>
                    <div className="bg-pink-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Venue</p>
                      <p className="font-medium">{selectedProgram.venue || "Online"}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{selectedProgram.description}</p>
                  
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock className="w-5 h-5 text-purple-500" />
                      <span>{selectedProgram.time || "Flexible scheduling"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <DollarSign className="w-5 h-5 text-purple-500" />
                      <span className="font-bold">Ksh{selectedProgram.price?.toFixed(2) || "350"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <UsersIcon className="w-5 h-5 text-purple-500" />
                      <span>{selectedProgram.slots ? `${selectedProgram.slots} spots left` : "Limited spots"}</span>
                    </div>
                  </div>
                </div>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  alert(`Registration submitted for ${selectedProgram.name}! We'll contact you shortly.`);
                  closeModal();
                }} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Parent's Full Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
                      placeholder="+254798971625"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Student's Grade Level</label>
                    <select 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
                      required
                    >
                      <option value="">Select grade level</option>
                      <optgroup label="Primary School">
                        {[...Array(8)].map((_, i) => (
                          <option key={`grade-${i+1}`} value={`Grade ${i+1}`}>Grade {i+1}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                  
                  <motion.button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition font-medium mt-6 flex items-center justify-center gap-2 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Complete Registration</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Consultation Modal */}
      <AnimatePresence>
        {showConsultationModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Suspense fallback={
                <div className="p-8">
                  <div className="h-96 bg-gray-100 rounded-xl animate-pulse"></div>
                </div>
              }>
                <ConsultationForm onClose={closeModal} />
              </Suspense>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Home Tuition Modal */}
      <AnimatePresence>
        {showHomeTuitionModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Suspense fallback={
                <div className="p-8">
                  <div className="h-96 bg-gray-100 rounded-xl animate-pulse"></div>
                </div>
              }>
                <HomeTuitionForm onClose={closeModal} />
              </Suspense>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to Top Button */}
      <motion.button
        className={`fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg ${isScrolled ? 'block' : 'hidden'}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Back to top"
      >
        <ArrowUpRight className="w-5 h-5 rotate-45" />
      </motion.button>
    </div>
  );
};

export default PeakPerformanceTutoring;