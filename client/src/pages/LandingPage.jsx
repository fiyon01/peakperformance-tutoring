import { useState, useRef, lazy, Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Calendar, MapPin, DollarSign, Star, ChevronLeft, ChevronRight,
  Quote, User, ArrowRight, Search, Mail, Phone, Home, Send, Check, 
  AlertCircle, BookOpen, GraduationCap, ClipboardCheck, Instagram, 
  Twitter, Facebook, Youtube, ArrowUpRight, Grid, Clock, Users as UsersIcon,
  Award, Rocket, Target, BarChart2, Bookmark, Zap, Shield, FileText,
  PieChart, TrendingUp, HelpCircle, Clock as ClockIcon, MessageSquare, UserCheck, Image as ImageIcon
} from 'lucide-react';
import { Link } from "react-router-dom";
import Logo from "../assets/icons8-graduation-cap-30.png";

// Lazy-loaded components
const TestimonialForm = lazy(() => import('./TestimonialForm'));
const ConsultationForm = lazy(() => import('./ConsultationForm'));
const HomeTuitionForm = lazy(() => import('./HomeTuitionForm'));

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
            name: "Advanced Mathematics", 
            year: 2023,
            term: "Term 2",
            duration: "8 weeks",
            start_date: "2023-05-15",
            end_date: "2023-07-10",
            status: "upcoming",
            is_active: true,
            image_url: "https://images.unsplash.com/photo-1579248900371-0c9c0a56a9e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
            price: 350.00,
            description: "Master calculus, linear algebra, and advanced problem-solving techniques with our expert math tutors.",
            slots: 15,
            level: "Advanced",
            time: "Mon & Wed, 4-6PM",
            venue: "Online"
          },
          { 
            id: 2, 
            name: "Science Olympiad Prep", 
            year: 2023,
            term: "Term 2",
            duration: "10 weeks",
            start_date: "2023-05-20",
            end_date: "2023-07-29",
            status: "upcoming",
            is_active: true,
            image_url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
            price: 500.00,
            description: "Comprehensive preparation for all Science Olympiad events with competition-winning strategies.",
            slots: 10,
            level: "Intermediate",
            time: "Tue & Thu, 5-7PM",
            venue: "Online"
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
      role: "Parent",
      text: "My daughter's grades improved from Cs to As after just two months. The tutors are exceptional at breaking down complex concepts.",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Student",
      text: "The personalized approach helped me score in the 98th percentile on my SATs. I couldn't have done it without Peak Performance.",
      rating: 5
    }
  ];

  const galleryImages = [
    "https://scontent.fnbo16-1.fna.fbcdn.net/v/t39.30808-6/475879454_1184209423370917_7326451790253706885_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=Ue3hYsF5Q1gQ7kNvwEfUn0r&_nc_oc=AdmYHFvAF6UYQGEJDH1DJSJKhgz2xchAeL4XNI8IN7Igyp_5d0OZJx7NDSMLT28o4H0&_nc_zt=23&_nc_ht=scontent.fnbo16-1.fna&_nc_gid=RItWCXsm_LPin5xswPXg6A&oh=00_AfHwhdv0z7akEJn9dB6FAzLIMTpFY--jw1Xs4-D_IKAg_A&oe=681B9B1E",
    "https://scontent.fnbo16-1.fna.fbcdn.net/v/t39.30808-6/490582004_1235073248284534_6947471108058900747_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=Nru45LgHYqkQ7kNvwFUtsSP&_nc_oc=AdmKFECrw-sIBY7qTGDSGAp9LSLTm4pAQcAkIKiVGQTC2tTlr67YZV7RIaa9LHA4904&_nc_zt=23&_nc_ht=scontent.fnbo16-1.fna&_nc_gid=vbE23qMXgBXxtkV7AiiwLQ&oh=00_AfHVxej-83_olkToC0UvczjN-4Tmx6xLCcB4Ip6QJB9Sbg&oe=681BAD8B",
    "https://scontent.fnbo16-1.fna.fbcdn.net/v/t39.30808-6/475539602_1184209480037578_3269351206353649665_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=nTHFQfnKVy4Q7kNvwFGaX91&_nc_oc=AdkJodbg2j2oK86Z02C4fZ1qwH35iA21PYsJ_rqdOwPJwqgc0cXebJQb6sLBf9owHLE&_nc_zt=23&_nc_ht=scontent.fnbo16-1.fna&_nc_gid=-FcFAzUJjLAa-CvhjBbQxg&oh=00_AfGViwGbcMOmvOyJ_c4rMC_YEUXQTI-Adgd7Sp9usQk4vw&oe=681B7E22"
  ];

  const filteredPrograms = programs.filter(program =>
    program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (program.description && program.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <motion.img 
                src={Logo} 
                alt="logo" 
                className="w-6 h-6" 
                loading="lazy"
                whileHover={{ rotate: 15 }}
                transition={{ type: 'spring', stiffness: 300 }}
              />
              <motion.span 
                className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
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
                { name: "Results", icon: <BarChart2 className="w-4 h-4" />, href: "#testimonials" }
              ].map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 transition flex items-center gap-1 group"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
                  <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 group-hover:after:w-full">
                    {item.name}
                  </span>
                </motion.a>
              ))}
              <Link to="/auth/students-signup">
                <motion.button 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-full hover:opacity-90 transition shadow-lg shadow-blue-100 flex items-center gap-2 group"
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
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

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
                { name: "Results", icon: <BarChart2 className="w-5 h-5" />, href: "#testimonials", onClick: closeMenu }
              ].map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  onClick={item.onClick}
                  className="text-lg text-gray-700 border-b border-gray-100 pb-4 flex items-center gap-2 group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <span className="group-hover:text-blue-600 transition-colors">{item.icon}</span>
                  <span className="group-hover:text-blue-600 transition-colors">{item.name}</span>
                </motion.a>
              ))}
              <Link to="/auth/students-signup">
                <motion.button 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-full text-lg mt-4 w-full flex items-center justify-center gap-2 group"
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
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
            >
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Peak Performance Tutoring</span> For Academic Excellence
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600 mb-10 max-w-lg"
            >
              82% of our students achieve top 10% exam results. Ivy League-educated tutors with proven methodologies.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button 
                onClick={openConsultationModal}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full hover:opacity-90 transition shadow-xl shadow-blue-100 font-medium flex items-center justify-center gap-2 group"
                whileHover={{ scale: 1.05 }}
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
                <div className="bg-blue-100 p-3 rounded-full">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter value="90" />%
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "Ivy League Tutors", value: "10+", icon: <GraduationCap className="w-8 h-8 text-blue-600" /> },
              { name: "Years Experience", value: "2+", icon: <Clock className="w-8 h-8 text-blue-600" /> },
              { name: "Student Satisfaction", value: "90%", icon: <Zap className="w-8 h-8 text-blue-600" /> },
              { name: "Success Rate", value: "90%", icon: <Award className="w-8 h-8 text-blue-600" /> }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="flex justify-center mb-3">
                  <motion.div
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
          </div>
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <motion.div
                whileHover={{ rotate: 15 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Bookmark className="w-8 h-8 text-blue-600" />
              </motion.div>
              Tailored Academic Programs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specialized curricula designed by subject matter experts from top institutions.
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
                placeholder="Search programs or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition pl-14 text-lg shadow-sm hover:shadow-md"
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
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition border border-gray-100 group"
                  >
                    <div className="h-48 overflow-hidden relative">
                      {!loadedImages[program.id] && (
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse"></div>
                      )}
                      <img 
                        src={program.image_url || "https://images.unsplash.com/photo-1579248900371-0c9c0a56a9e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"} 
                        alt={program.name} 
                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${loadedImages[program.id] ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => handleImageLoad(program.id)}
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{program.name}</h3>
                        <span className="inline-block bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full">
                          {program.term || "Term 2"}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{program.description || "Comprehensive program designed to enhance student performance."}</p>
                      
                      <div className="grid grid-cols-2 gap-4 my-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <ClockIcon className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">{program.time || "Flexible scheduling"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">{program.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <UserCheck className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">{program.level || "All Levels"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <UsersIcon className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">{program.slots ? `${program.slots} spots left` : "Limited spots"}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-6">
                        <div className="text-xl font-bold text-gray-900">Ksh{program.price?.toFixed(2) || "350"}</div>
                        <motion.button 
                          onClick={() => openModal(program)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm group"
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
                  <p className="text-gray-600">No programs found matching your search.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Method */}
      <section id="method" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" /> Our Methodology
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">The Peak Performance Difference</h2>
                <p className="text-xl text-gray-600 mb-8">
                  Our proprietary 4-phase approach ensures measurable results and academic transformation.
                </p>
              </motion.div>

              <div className="space-y-6">
                {[
                  {
                    title: "Diagnostic Assessment",
                    description: "Comprehensive evaluation to identify strengths and knowledge gaps",
                    icon: <PieChart className="w-6 h-6 text-blue-600" />
                  },
                  {
                    title: "Custom Learning Plan",
                    description: "Tailored curriculum targeting specific improvement areas",
                    icon: <FileText className="w-6 h-6 text-blue-600" />
                  },
                  {
                    title: "Expert Instruction",
                    description: "1:1 sessions with subject specialists using proven techniques",
                    icon: <UsersIcon className="w-6 h-6 text-blue-600" />
                  },
                  {
                    title: "Progress Optimization",
                    description: "Continuous feedback loops to maximize learning efficiency",
                    icon: <TrendingUp className="w-6 h-6 text-blue-600" />
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-4 group"
                  >
                    <motion.div 
                      className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-blue-200 transition-colors"
                      whileHover={{ scale: 1.1 }}
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
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <Award className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Proven Results</p>
                    <p className="text-2xl font-bold text-gray-900">4.9/5</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2 flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" /> Success Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Transformative Results</h2>
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
                className="bg-gray-50 p-8 md:p-12 rounded-2xl shadow-sm"
              >
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold">
                      {testimonials[currentTestimonial].name.charAt(0)}
                    </div>
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

      {/* Gallery */}
      <section id="gallery" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2 flex items-center justify-center gap-2">
              <ImageIcon className="w-4 h-4" /> Learning Moments
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Community</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Glimpses of our students' journeys to academic excellence.
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
                    <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center mb-3">
                      <ArrowUpRight className="w-5 h-5 text-gray-900" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Form */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <Suspense fallback={<div className="h-96 bg-gray-100 rounded-2xl animate-pulse"></div>}>
            <TestimonialForm />
          </Suspense>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Academic Journey?</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
              Schedule a consultation with our enrollment team to discuss your goals and create a customized learning plan.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button 
                onClick={openConsultationModal}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-4 rounded-full hover:opacity-90 transition shadow-xl font-medium flex items-center justify-center gap-2 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Book Consultation</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button 
                onClick={openHomeTuitionModal}
                className="bg-white/10 text-white px-8 py-4 rounded-full hover:bg-white/20 transition border border-white/20 font-medium flex items-center justify-center gap-2 group"
                whileHover={{ scale: 1.05 }}
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
      <footer className="bg-gray-950 text-gray-400 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-12">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <motion.img 
                  src={Logo} 
                  alt="logo" 
                  className="w-6 h-6 text-indigo-400" 
                  whileHover={{ rotate: 15 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                />
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Peak Performance
                </span>
              </h3>
              <p className="mb-6">
                Elite academic tutoring for discerning families seeking transformative educational results.
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
                    whileHover={{ y: -3 }}
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
                        <span className="text-blue-400">{link.icon}</span>
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
                <li className="flex items-center gap-2 hover:text-white transition">
                  <Mail className="w-4 h-4 text-blue-400" /> info@peakperformance.com
                </li>
                <li className="flex items-center gap-2 hover:text-white transition">
                  <Phone className="w-4 h-4 text-blue-400" /> +254798971625
                </li>
                <li className="flex items-center gap-2 hover:text-white transition">
                  <Home className="w-4 h-4 text-blue-400" /> 338-00902 Kikuyu
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>© {new Date().getFullYear()} Peak Performance Tutoring. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
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
                  <div className="h-48 rounded-lg overflow-hidden mb-4">
                    <img 
                      src={selectedProgram.image_url || "https://images.unsplash.com/photo-1579248900371-0c9c0a56a9e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"} 
                      alt={selectedProgram.name} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-600 mb-2"><strong>Term:</strong> {selectedProgram.term}</p>
                    <p className="text-gray-600 mb-2"><strong>Duration:</strong> {selectedProgram.duration}</p>
                    <p className="text-gray-600 mb-2"><strong>Dates:</strong> {formatDate(selectedProgram.start_date)} to {formatDate(selectedProgram.end_date)}</p>
                    <p className="text-gray-600 mb-2"><strong>Venue:</strong> {selectedProgram.venue || "Online"}</p>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{selectedProgram.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-500" />
                      <span>{selectedProgram.time || "Flexible scheduling"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-blue-500" />
                      <span className="font-bold">Ksh{selectedProgram.price?.toFixed(2) || "350"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <UsersIcon className="w-5 h-5 text-blue-500" />
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
                    <label className="block text-gray-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+254798971625"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Student's Grade Level</label>
                    <select 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select grade level</option>
                      <optgroup label="Primary School">
                        {[...Array(8)].map((_, i) => (
                          <option key={`grade-${i+1}`} value={`Grade ${i+1}`}>Grade {i+1}</option>
                        ))}
                      </optgroup>
                      <optgroup label="High School">
                        {[...Array(4)].map((_, i) => (
                          <option key={`form-${i+1}`} value={`Form ${i+1}`}>Form {i+1}</option>
                        ))}
                      </optgroup>
                      <option value="College">College/University</option>
                    </select>
                  </div>
                  
                  <motion.button 
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium mt-6 flex items-center justify-center gap-2 group"
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
              <Suspense fallback={<div className="h-96 bg-gray-100 rounded-2xl"></div>}>
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
              <Suspense fallback={<div className="h-96 bg-gray-100 rounded-2xl"></div>}>
                <HomeTuitionForm onClose={closeModal} />
              </Suspense>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PeakPerformanceTutoring;