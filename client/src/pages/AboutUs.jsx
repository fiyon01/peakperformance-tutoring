import { useState, useEffect, lazy, Suspense } from 'react';
import {
  Users, GraduationCap, Target, BookOpen, Award, 
  Globe, HandCoins, Quote, User, Phone, Mail, MapPin,
  ChevronRight, ArrowRight, Sparkles, Crown, Home, Rocket, Clock, Heart
} from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import Logo from "../assets/icons8-graduation-cap-30.png"
// Lazy load components for better performance
const TutorCard = lazy(() => import('./TutorCard'));
const MissionCard = lazy(() => import('./MissionCard'));

const AboutUs = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const controls = useAnimation();
  const [ref1, inView1] = useInView({ threshold: 0.1, triggerOnce: true });
  const [ref2, inView2] = useInView({ threshold: 0.1, triggerOnce: true });
  const [ref3, inView3] = useInView({ threshold: 0.1, triggerOnce: true });
  const [ref4, inView4] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Simulate loading for demonstration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (inView1) controls.start("visible");
  }, [controls, inView1]);

  // Tutor data with avatar colors
  const tutors = [
    {
      name: "Githinji Kamau",
      qualification: "BSc in Analytical Chemistry, Kenyatta University",
      subjects: ["Chemistry", "Mathematics"],
      isFounder: true,
      avatarColor: "from-indigo-500 to-indigo-700",
      image: "/images/tutors/githinji.jpg",
      bio: "Specializing in analytical chemistry and advanced mathematics with 8 years of teaching experience. Passionate about making complex concepts accessible to all students.",
      contact: {
        email: "githinji@peakperformance.com",
        phone: "+254 722 123456"
      }
    },
    {
      name: "Mr. Justus",
      qualification: "Bachelor of Education Math and Physics, University of Nairobi",
      subjects: ["Mathematics", "Physics"],
      avatarColor: "from-blue-500 to-blue-700",
      image: "/images/tutors/justus.jpg",
      bio: "Physics specialist with a talent for breaking down complex problems into understandable steps. 5 years of tutoring experience.",
      contact: {
        email: "justus@peakperformance.com",
        phone: "+254 733 234567"
      }
    },
    {
      name: "Mr. Anthony",
      qualification: "Bachelor of Education Math and Biology, Machakos University",
      subjects: ["Mathematics", "Biology"],
      avatarColor: "from-green-500 to-green-700",
      image: "/images/tutors/anthony.jpg",
      bio: "Biology expert with a focus on practical applications. Makes learning interactive and engaging for students.",
      contact: {
        email: "anthony@peakperformance.com",
        phone: "+254 711 345678"
      }
    },
    {
      name: "Vincent Wesalla",
      qualification: "Bachelor of Education Math and Chemistry, Karatina University",
      subjects: ["Mathematics", "Chemistry"],
      avatarColor: "from-purple-500 to-purple-700",
      // No image - will use avatar
      bio: "Chemistry tutor with a passion for experimental learning. Helps students connect theory with real-world applications.",
      contact: {
        email: "vincent@peakperformance.com",
        phone: "+254 700 456789"
      }
    },
    {
      name: "Madam Lilian",
      qualification: "Bachelor of Education History and Business, Egerton University",
      subjects: ["History", "Business"],
      avatarColor: "from-pink-500 to-pink-700",
      image: "/images/tutors/lilian.jpg",
      bio: "History and business specialist who brings subjects to life through storytelling and case studies.",
      contact: {
        email: "lilian@peakperformance.com",
        phone: "+254 722 567890"
      }
    },
    {
      name: "Mr. Faruck",
      qualification: "Biology Specialist",
      subjects: ["Biology"],
      avatarColor: "from-teal-500 to-teal-700",
      // No image - will use avatar
      bio: "Focused on exam preparation and practical biology skills. Known for simplifying complex biological processes.",
      contact: {
        email: "faruck@peakperformance.com",
        phone: "+254 733 678901"
      }
    },
    {
      name: "Ms. Wanjiku",
      qualification: "Master's in English Literature, University of Nairobi",
      subjects: ["English", "Literature"],
      avatarColor: "from-red-500 to-red-700",
      image: "/images/tutors/wanjiku.jpg",
      bio: "Literature expert who helps students develop critical thinking and analytical writing skills.",
      contact: {
        email: "wanjiku@peakperformance.com",
        phone: "+254 711 789012"
      }
    },
    {
      name: "Mr. Omondi",
      qualification: "Bachelor of Education Geography and CRE, Moi University",
      subjects: ["Geography", "CRE"],
      avatarColor: "from-yellow-500 to-yellow-700",
      // No image - will use avatar
      bio: "Makes geography come alive through interactive maps and real-world examples.",
      contact: {
        email: "omondi@peakperformance.com",
        phone: "+254 700 890123"
      }
    },
    {
      name: "Ms. Achieng",
      qualification: "Bachelor of Science in Computer Science, JKUAT",
      subjects: ["Computer Science", "Mathematics"],
      avatarColor: "from-orange-500 to-orange-700",
      image: "/images/tutors/achieng.jpg",
      bio: "Tech-savvy tutor who makes programming concepts accessible to beginners.",
      contact: {
        email: "achieng@peakperformance.com",
        phone: "+254 722 901234"
      }
    }
  ];

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  // Function to get initials from name
  const getInitials = (name) => {
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
  };

  // Skeleton loader component
  const SkeletonLoader = ({ count = 1, className = "" }) => {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => (
          <div 
            key={index} 
            className={`bg-gray-200 animate-pulse rounded-xl ${className}`}
          />
        ))}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50 p-4 md:p-8">
      {/* Navigation Back Button */}
      <div className="mb-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          <Home className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4">
          <img src={Logo} alt="logo" className="w-8 h-8 text-indigo-600" />
        </div>
        <div className="flex items-center justify-center mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Peak Performance
          </h1>
          <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Since August 12, 2024
          </span>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Empowering students across Kenya with personalized tutoring and coaching to unlock their full academic potential
        </p>
      </motion.div>

      {/* Mission, Vision & Goal Section */}
      <motion.section
        ref={ref1}
        initial="hidden"
        animate={inView1 ? "visible" : "hidden"}
        variants={staggerVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
      >
        {isLoading ? (
          <SkeletonLoader count={3} className="h-64" />
        ) : (
          <>
            {/* Mission */}
            <motion.div
              variants={itemVariants}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center mb-6">
                <div className="p-3 bg-blue-100 rounded-full mb-4">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h2>
                <p className="text-gray-600">
                  To empower Kenyan students with personalized, high-quality tutoring that makes academic excellence accessible to all, regardless of background or financial situation.
                </p>
              </div>
              <div className="flex justify-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <Heart className="w-4 h-4 mr-1" />
                  Passion-Driven
                </span>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              variants={itemVariants}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center mb-6">
                <div className="p-3 bg-purple-100 rounded-full mb-4">
                  <Globe className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h2>
                <p className="text-gray-600">
                  To transform Kenya's educational landscape by becoming the most trusted partner for student success, where every learner achieves their full potential.
                </p>
              </div>
              <div className="flex justify-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  <Rocket className="w-4 h-4 mr-1" />
                  Future-Focused
                </span>
              </div>
            </motion.div>

            {/* Goal */}
            <motion.div
              variants={itemVariants}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center mb-6">
                <div className="p-3 bg-green-100 rounded-full mb-4">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Our Goal</h2>
                <p className="text-gray-600">
                  To help 2,000 Kenyan students achieve academic breakthroughs by 2027 through our innovative tutoring approach and dedicated educator team.
                </p>
              </div>
              <div className="flex justify-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <Clock className="w-4 h-4 mr-1" />
                  Ambitious
                </span>
              </div>
            </motion.div>
          </>
        )}
      </motion.section>

      {/* Tutor Profiles Section */}
      <motion.section
        ref={ref2}
        initial="hidden"
        animate={inView2 ? "visible" : "hidden"}
        variants={sectionVariants}
        className="mb-16"
      >
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-indigo-600 mr-3" />
            Meet Our Expert Tutors
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our passionate educators bring knowledge, experience, and dedication to every session
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonLoader count={6} className="h-80" />
          </div>
        ) : (
          <Suspense fallback={<SkeletonLoader count={6} className="h-80" />}>
            <motion.div
              variants={staggerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {tutors.map((tutor, index) => (
                <TutorCard 
                  key={index}
                  tutor={tutor}
                  getInitials={getInitials}
                  variants={itemVariants}
                />
              ))}
            </motion.div>
          </Suspense>
        )}
      </motion.section>

      {/* Founder's Statement */}
      <motion.section
        ref={ref3}
        initial="hidden"
        animate={inView3 ? "visible" : "hidden"}
        variants={sectionVariants}
        className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 md:p-12 mb-16 text-white"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="mb-6 md:mb-0 md:mr-8 flex-shrink-0 relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-white to-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-3xl md:text-4xl">
                {getInitials("Githinji Kamau")}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <Crown className="w-3 h-3 mr-1" />
                Founder & CEO
              </div>
            </div>
            <div>
              <div className="flex items-center mb-4">
                <Quote className="w-6 h-6 text-indigo-200 mr-2" />
                <h2 className="text-xl md:text-2xl font-semibold">From the Founder</h2>
              </div>
              <blockquote className="text-lg md:text-xl text-indigo-100 mb-6">
                "After years of witnessing students struggle with traditional learning methods, I established Peak Performance with a clear vision: to create a transformative educational experience that adapts to each learner's unique needs. Our approach combines academic rigor with personalized mentorship, helping students not just learn, but truly understand and excel."
              </blockquote>
              <div className="flex items-center">
                <Sparkles className="w-5 h-5 text-yellow-300 mr-2" />
                <span className="font-medium">Githinji Kamau</span>
                <span className="mx-2">•</span>
                <span className="text-indigo-200">Founded August 12, 2024</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Commitment Section */}
      <motion.section
        ref={ref4}
        initial="hidden"
        animate={inView4 ? "visible" : "hidden"}
        variants={sectionVariants}
        className="mb-16"
      >
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Our Core Commitments</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            The principles that guide everything we do at Peak Performance
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <SkeletonLoader count={2} className="h-64" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-green-100 rounded-lg mr-4">
                  <HandCoins className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Affordable Excellence</h3>
              </div>
              <p className="text-gray-600 mb-6">
                We've structured our pricing to make top-tier tutoring accessible without compromising quality. Through innovative programs and scholarship opportunities, we ensure financial constraints never hinder academic potential.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-800">
                  Transparent Pricing
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-800">
                  Payment Plans
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-800">
                  Scholarship Options
                </span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-purple-100 rounded-lg mr-4">
                  <BookOpen className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Accessible Learning</h3>
              </div>
              <p className="text-gray-600 mb-6">
                We meet students where they are—literally and figuratively. With flexible in-person sessions across Kenya and adaptable teaching methods, we remove barriers to learning and create opportunities for all.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-800">
                  Nationwide Coverage
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-800">
                  Flexible Scheduling
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-800">
                  Customized Approaches
                </span>
              </div>
            </div>
          </div>
        )}
      </motion.section>

      {/* Contact CTA */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 md:p-10 text-center text-white shadow-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to unlock your academic potential?</h2>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto text-lg">
            Join hundreds of students who've transformed their learning journey with Peak Performance
          </p>
          <Link 
            to="/contact" 
            className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-semibold rounded-full shadow-sm text-indigo-600 bg-white hover:bg-indigo-50 transition-all transform hover:scale-105"
          >
            Get Started Today <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;