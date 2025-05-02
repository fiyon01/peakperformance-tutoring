import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Calendar, MapPin, DollarSign, Star, ChevronLeft, ChevronRight,
  Quote, User, ArrowRight, Search, Mail, Phone, Home, Send, Check, 
  AlertCircle, BookOpen, GraduationCap, ClipboardCheck, Instagram, 
  Twitter, Facebook, Youtube, ArrowUpRight, Grid, Clock, Users as UsersIcon,
  Award, Rocket, Target, BarChart2, Bookmark, Zap, Shield, FileText,
  PieChart, TrendingUp, HelpCircle, Clock as ClockIcon,MessageSquare, UserCheck, Image as ImageIcon
} from 'lucide-react';

const PeakPerformanceTutoring = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [testimonialText, setTestimonialText] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [ratingError, setRatingError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gradeLevel: ''
  });
  const galleryRef = useRef(null);

  const closeMenu = () => setIsMenuOpen(false);

  // Sample data
  const programs = [
    { 
      id: 1, 
      name: "Advanced Mathematics", 
      category: "STEM",
      image: "https://images.unsplash.com/photo-1579248900371-0c9c0a56a9e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      schedule: "Mon & Wed, 4-6PM",
      duration: "8 weeks",
      level: "Advanced",
      spots: "4 spots left",
      price: "$399",
      description: "Master calculus, linear algebra, and advanced problem-solving techniques with our expert math tutors."
    },
    { 
      id: 2, 
      name: "Science Olympiad Prep", 
      category: "STEM",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      schedule: "Tue & Thu, 5-7PM",
      duration: "10 weeks",
      level: "Intermediate",
      spots: "2 spots left",
      price: "$449",
      description: "Comprehensive preparation for all Science Olympiad events with competition-winning strategies."
    },
    { 
      id: 3, 
      name: "College Essay Mastery", 
      category: "Language Arts",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      schedule: "Flexible scheduling",
      duration: "6 weeks",
      level: "All Levels",
      spots: "6 spots left",
      price: "$349",
      description: "Craft compelling personal statements and supplemental essays for college applications."
    },
    { 
      id: 4, 
      name: "Literary Analysis", 
      category: "Language Arts",
      image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      schedule: "Sat, 10AM-12PM",
      duration: "12 weeks",
      level: "Advanced",
      spots: "3 spots left",
      price: "$499",
      description: "Develop critical reading and analytical writing skills for advanced literature courses."
    }
  ];

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
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
  ];

  const filteredPrograms = programs.filter(program =>
    program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitTestimonial = (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setRatingError(true);
      return;
    }
    
    setFormSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setTestimonialText('');
      setRating(0);
      setFormSubmitted(false);
      setRatingError(false);
    }, 3000);
  };

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
    document.body.style.overflow = 'auto';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    alert(`Registration submitted for ${selectedProgram.name}! We'll contact you shortly.`);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      gradeLevel: ''
    });
    closeModal();
  };

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* Modern Navigation */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Rocket className="w-6 h-6 text-indigo-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Peak Performance
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 transition flex items-center gap-1">
                <Home className="w-4 h-4" /> Home
              </a>
              <a href="#programs" className="text-gray-700 hover:text-blue-600 transition flex items-center gap-1">
                <BookOpen className="w-4 h-4" /> Programs
              </a>
              <a href="#method" className="text-gray-700 hover:text-blue-600 transition flex items-center gap-1">
                <ClipboardCheck className="w-4 h-4" /> Method
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition flex items-center gap-1">
                <BarChart2 className="w-4 h-4" /> Results
              </a>
              <a href="#gallery" className="text-gray-700 hover:text-blue-600 transition flex items-center gap-1">
                <Grid className="w-4 h-4" /> Gallery
              </a>
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-full hover:opacity-90 transition shadow-lg shadow-blue-100 flex items-center gap-2">
                Enroll Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 focus:outline-none"
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
              <a href="#" onClick={closeMenu} className="text-lg text-gray-700 border-b border-gray-100 pb-4 flex items-center gap-2">
                <Home className="w-5 h-5" /> Home
              </a>
              <a href="#programs" onClick={closeMenu} className="text-lg text-gray-700 border-b border-gray-100 pb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Programs
              </a>
              <a href="#method" onClick={closeMenu} className="text-lg text-gray-700 border-b border-gray-100 pb-4 flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5" /> Method
              </a>
              <a href="#testimonials" onClick={closeMenu} className="text-lg text-gray-700 border-b border-gray-100 pb-4 flex items-center gap-2">
                <BarChart2 className="w-5 h-5" /> Results
              </a>
              <a href="#gallery" onClick={closeMenu} className="text-lg text-gray-700 border-b border-gray-100 pb-4 flex items-center gap-2">
                <Grid className="w-5 h-5" /> Gallery
              </a>
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-full text-lg mt-4 w-full flex items-center justify-center gap-2">
                Enroll Now <ArrowRight className="w-5 h-5" />
              </button>
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
              92% of our students achieve top 10% exam results. Ivy League-educated tutors with proven methodologies.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full hover:opacity-90 transition shadow-xl shadow-blue-100 font-medium flex items-center justify-center gap-2">
                Book Consultation <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-white text-gray-700 px-8 py-4 rounded-full hover:bg-gray-50 transition border-2 border-gray-200 font-medium flex items-center justify-center gap-2">
                Our Methodology <BookOpen className="w-5 h-5" />
              </button>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
                alt="Tutoring session" 
                className="w-full h-auto object-cover aspect-video"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">92%</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "Ivy League Tutors", value: "50+", icon: <GraduationCap className="w-8 h-8 text-blue-600" /> },
              { name: "Years Experience", value: "12+", icon: <Clock className="w-8 h-8 text-blue-600" /> },
              { name: "Student Satisfaction", value: "98%", icon: <Zap className="w-8 h-8 text-blue-600" /> },
              { name: "Success Rate", value: "92%", icon: <Award className="w-8 h-8 text-blue-600" /> }
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
                  {item.icon}
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">{item.value}</p>
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
              <Bookmark className="w-8 h-8 text-blue-600" />
              Tailored Academic Programs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specialized curricula designed by subject matter experts from top institutions.
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto mb-16 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search programs or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition pl-14 text-lg shadow-sm"
              />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

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
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition border border-gray-100"
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={program.image} 
                      alt={program.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{program.name}</h3>
                      <span className="inline-block bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full">
                        {program.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{program.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 my-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <ClockIcon className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">{program.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">{program.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <UserCheck className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">{program.level}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <UsersIcon className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">{program.spots}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-6">
                      <div className="text-xl font-bold text-gray-900">{program.price}</div>
                      <button 
                        onClick={() => openModal(program)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm"
                      >
                        Register Now <ArrowRight className="w-4 h-4" />
                      </button>
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
                    className="flex gap-4"
                  >
                    <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      {item.icon}
                    </div>
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
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
                  alt="Tutoring method" 
                  className="w-full h-auto object-cover aspect-square"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100 hidden lg:block">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <Award className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Proven Results</p>
                    <p className="text-2xl font-bold text-gray-900">4.9/5</p>
                  </div>
                </div>
              </div>
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
              <button 
                onClick={prevTestimonial}
                className="bg-white p-3 rounded-full shadow-md hover:bg-gray-50 transition"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button 
                onClick={nextTestimonial}
                className="bg-white p-3 rounded-full shadow-md hover:bg-gray-50 transition"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
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
                <img 
                  src={image} 
                  alt={`Gallery ${index + 1}`} 
                  className="w-full h-80 object-cover transition duration-500 group-hover:scale-105"
                />
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
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 shadow-xl"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <MessageSquare className="w-6 h-6" /> Share Your Experience
            </h2>
            <p className="text-blue-100 mb-8">We value your feedback to help us improve</p>
            
            {formSubmitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/20 p-6 rounded-lg text-center"
              >
                <div className="flex items-center justify-center gap-3">
                  <Check className="w-6 h-6 text-white" />
                  <span className="text-white font-medium">Thank you for your testimonial! We appreciate your feedback.</span>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmitTestimonial} className="space-y-6">
                <div>
                  <label className="block text-blue-100 font-medium mb-3">Your Rating</label>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => {
                          setRating(star);
                          setRatingError(false);
                        }}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${star <= (hoverRating || rating) ? 'text-yellow-300 fill-yellow-300' : 'text-blue-300'}`}
                        />
                      </button>
                    ))}
                  </div>
                  {ratingError && (
                    <p className="text-red-300 text-sm mt-2 flex items-center justify-center gap-1">
                      <AlertCircle className="w-4 h-4" /> Please provide a rating
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="name" className="block text-blue-100 font-medium mb-3">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setActiveField('name')}
                    onBlur={() => setActiveField(null)}
                    className={`w-full px-5 py-3 rounded-lg bg-white/10 border ${activeField === 'name' ? 'border-white/50 ring-2 ring-white/20' : 'border-white/20'} text-white placeholder-blue-200 focus:outline-none transition`}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-blue-100 font-medium mb-3">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setActiveField('email')}
                    onBlur={() => setActiveField(null)}
                    className={`w-full px-5 py-3 rounded-lg bg-white/10 border ${activeField === 'email' ? 'border-white/50 ring-2 ring-white/20' : 'border-white/20'} text-white placeholder-blue-200 focus:outline-none transition`}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="testimonial" className="block text-blue-100 font-medium mb-3">Your Testimonial</label>
                  <textarea
                    id="testimonial"
                    rows="4"
                    value={testimonialText}
                    onChange={(e) => setTestimonialText(e.target.value)}
                    onFocus={() => setActiveField('testimonial')}
                    onBlur={() => setActiveField(null)}
                    className={`w-full px-5 py-3 rounded-lg bg-white/10 border ${activeField === 'testimonial' ? 'border-white/50 ring-2 ring-white/20' : 'border-white/20'} text-white placeholder-blue-200 focus:outline-none transition`}
                    placeholder="Share your experience..."
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-white text-blue-600 py-4 rounded-lg hover:bg-gray-100 transition font-medium text-lg mt-6 flex items-center justify-center gap-2 shadow-lg"
                >
                  Submit Testimonial <Send className="w-5 h-5" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Academic Journey?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              Schedule a consultation with our enrollment team to discuss your goals and create a customized learning plan.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full hover:opacity-90 transition shadow-xl font-medium flex items-center justify-center gap-2">
                Book Consultation <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-white/10 text-white px-8 py-4 rounded-full hover:bg-white/20 transition border border-white/20 font-medium flex items-center justify-center gap-2">
                Call Us <Phone className="w-5 h-5" />
              </button>
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
                <Rocket className="w-6 h-6 text-indigo-400" />
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Peak Performance
                </span>
              </h3>
              <p className="mb-6">
                Elite academic tutoring for discerning families seeking transformative educational results.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition flex items-center gap-2"><ArrowRight className="w-3 h-3" /> About Us</a></li>
                <li><a href="#" className="hover:text-white transition flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Our Tutors</a></li>
                <li><a href="#" className="hover:text-white transition flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Results</a></li>
                <li><a href="#" className="hover:text-white transition flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Blog</a></li>
                <li><a href="#" className="hover:text-white transition flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Research</a></li>
                <li><a href="#" className="hover:text-white transition flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Webinars</a></li>
                <li><a href="#" className="hover:text-white transition flex items-center gap-2"><ArrowRight className="w-3 h-3" /> FAQs</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Support</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Help Center</a></li>
                <li><a href="#" className="hover:text-white transition flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Terms</a></li>
                <li><a href="#" className="hover:text-white transition flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> info@peakperformance.com
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> (555) 123-4567
                </li>
                <li className="flex items-center gap-2">
                  <Home className="w-4 h-4" /> 123 Academy Ave
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
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="mb-6">
                  <div className="h-48 rounded-lg overflow-hidden mb-4">
                    <img 
                      src={selectedProgram.image} 
                      alt={selectedProgram.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <p className="text-gray-600 mb-4">{selectedProgram.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <span>{selectedProgram.schedule}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-500" />
                      <span>{selectedProgram.duration}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-blue-500" />
                      <span className="font-bold">{selectedProgram.price}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <UsersIcon className="w-5 h-5 text-blue-500" />
                      <span>{selectedProgram.spots}</span>
                    </div>
                  </div>
                </div>
                
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="(123) 456-7890"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Student's Grade Level</label>
                    <select 
                      name="gradeLevel"
                      value={formData.gradeLevel}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select grade level</option>
                      <option value="Elementary School">Elementary School</option>
                      <option value="Middle School">Middle School</option>
                      <option value="High School">High School</option>
                      <option value="College">College</option>
                    </select>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium mt-6 flex items-center justify-center gap-2"
                  >
                    Complete Registration <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PeakPerformanceTutoring;