import { useState, useEffect } from 'react';
import { 
  BookOpen, Shield, Calendar, Wallet, Users, Clock, BellOff, AlertCircle, 
  ClipboardCheck, HeartPulse, Lock, Mail, ChevronDown, ChevronUp, Handshake,
  Bookmark, CalendarCheck, UserCheck, ClipboardList, ArrowRight, ArrowLeft
} from 'lucide-react';

const TutoringPolicies = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [activePolicySet, setActivePolicySet] = useState('comprehensive');
  const [isScrolling, setIsScrolling] = useState(false);

  // Comprehensive Program Policies
  const comprehensiveSections = [
    {
      id: 'enrollment',
      title: 'Enrollment & Fee Policy',
      icon: <Wallet className="w-5 h-5" />,
      content: [
        "All students must be officially enrolled before attending any sessions.",
        "Tuition is charged on a weekly basis and is to be paid in full upfront (usually on Mondays).",
        "Fees secure your child's spot and our tutors' availability for the entire week.",
        "Fees are non-transferable and non-refundable for missed days, regardless of attendance.",
        "We do not accept daily payments. All payments must be made on a weekly basis in advance.",
        "All registrations must be completed through our website. We do not process physical or in-person registrations.",
        "Students must sign up to access their personalized dashboards."
      ],
      highlight: "By enrolling, you acknowledge that fees cover reserved tutor time and resources."
    },
    {
      id: 'refunds',
      title: 'Refund & Cancellation Policy',
      icon: <ClipboardCheck className="w-5 h-5" />,
      content: [
        {
          type: 'subheader',
          text: 'Refunds will only be granted under these circumstances:'
        },
        {
          type: 'list',
          title: 'Full Refund:',
          items: [
            "If cancellation is made within 7 days of the program start date.",
            "No sessions have been attended."
          ]
        },
        {
          type: 'list',
          title: 'Partial Refund:',
          items: [
            "Cancellation within the first 14 days.",
            "Only unused sessions are refunded, minus an administrative fee."
          ]
        },
        {
          type: 'list',
          title: 'No Refund:',
          items: [
            "Withdrawal after 14 days of starting the program.",
            "Missed sessions without notice.",
            "Loss of interest or change in personal schedules.",
            "Removal due to disciplinary reasons."
          ]
        }
      ],
      highlight: "Refunds are not given for absences, unless due to medical emergencies."
    },
    // ... other comprehensive sections
  ];

  // Private Tuition Program Policies
  const privateSections = [
    {
      id: 'private-payment',
      title: 'Payment & Enrollment Policy',
      icon: <Wallet className="w-5 h-5" />,
      content: [
        "All private tuition sessions must be booked and paid for in advance.",
        "Payments must be completed prior to the commencement of the scheduled session(s).",
        "Tuition fees cover reserved tutor time and travel (if applicable), and missed sessions are non-refundable.",
        "We do not accept daily or pay-after service models."
      ],
      highlight: "By enrolling in private tuition, you acknowledge that fees reserve exclusive tutor time and resources."
    },
    {
      id: 'private-attendance',
      title: 'Attendance & Communication Policy',
      icon: <CalendarCheck className="w-5 h-5" />,
      content: [
        "If a student is unable to attend, parent/guardian must notify us at least 24 hours in advance.",
        "No-shows or late cancellations without notice are non-refundable and cannot be rescheduled.",
        "Failure to communicate leads to wasted tutor travel and time.",
        "Frequent unnotified absences may result in withdrawal from private tuition."
      ]
    },
    {
      id: 'private-scheduling',
      title: 'Program Duration & Scheduling',
      icon: <Clock className="w-5 h-5" />,
      content: [
        "Duration must be clearly communicated and agreed upon during registration.",
        "Scheduling is done in advance based on availability.",
        "Change requests must be made at least 5 days in advance."
      ]
    },
    {
      id: 'private-dashboard',
      title: 'Dashboard & Student Access',
      icon: <ClipboardList className="w-5 h-5" />,
      content: [
        "All students must sign up via our website for dashboard access.",
        "Dashboards provide timetables, assignments, performance reports, and development plans.",
        "Ensures alignment between student, parent, and tutor."
      ],
      highlight: "These policies promote clarity, respect for tutor time, and academic consistency."
    }
  ];

  const currentSections = activePolicySet === 'comprehensive' ? comprehensiveSections : privateSections;

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return;
      
      const sections = document.querySelectorAll('.policy-section');
      let current = null;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200 && window.scrollY < sectionTop + sectionHeight - 200) {
          current = section.id;
        }
      });
      
      if (current !== activeSection) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection, isScrolling]);

  const scrollToSection = (sectionId) => {
    setIsScrolling(true);
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 120,
        behavior: 'smooth'
      });
    }
    setTimeout(() => setIsScrolling(false), 1000);
  };

  const renderSectionContent = (content) => {
    return content.map((item, index) => {
      if (typeof item === 'string') {
        return <p key={index} className="mb-4">{item}</p>;
      } else if (item.type === 'subheader') {
        return <p key={index} className="font-semibold text-purple-700 mb-3">{item.text}</p>;
      } else if (item.type === 'list') {
        return (
          <div key={index} className="mb-4">
            <p className="font-medium text-gray-800 mb-2">{item.title}</p>
            <ul className="list-disc pl-5 space-y-1">
              {item.items.map((point, i) => (
                <li key={i} className="text-gray-600">{point}</li>
              ))}
            </ul>
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-800">Peak Performance Tutoring Policies</h1>
          </div>
          <a href="#contact" className="hidden md:flex items-center space-x-1 text-purple-600 hover:text-purple-800 transition">
            <Mail className="w-5 h-5" />
            <span>Questions?</span>
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Policy Set Selector */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-lg bg-white shadow-sm border border-purple-100 overflow-hidden">
            <button
              onClick={() => setActivePolicySet('comprehensive')}
              className={`px-4 py-2 text-sm font-medium flex items-center space-x-2 transition ${activePolicySet === 'comprehensive' ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-purple-50'}`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Comprehensive Program</span>
            </button>
            <button
              onClick={() => setActivePolicySet('private')}
              className={`px-4 py-2 text-sm font-medium flex items-center space-x-2 transition ${activePolicySet === 'private' ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-purple-50'}`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Private Tuition</span>
            </button>
          </div>
        </div>

        {/* Introduction */}
        <section className="mb-12 bg-white rounded-xl shadow-sm p-6 border border-purple-100">
          <div className="flex items-start space-x-4">
            <Handshake className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                {activePolicySet === 'comprehensive' 
                  ? 'Comprehensive Tutoring Program Policies' 
                  : 'Private Tuition Program Policies'}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {activePolicySet === 'comprehensive' 
                  ? 'Our comprehensive policies ensure a structured, fair learning environment for all participants in our group tutoring programs.' 
                  : 'These specialized policies govern our premium private tuition services, ensuring personalized attention and commitment.'}
              </p>
            </div>
          </div>
        </section>

        {/* Table of Contents - Desktop */}
        <div className="hidden lg:block mb-12 bg-white rounded-xl shadow-sm p-6 border border-purple-100 sticky top-24 z-10">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-purple-600" />
            Table of Contents
          </h3>
          <nav className="grid grid-cols-2 gap-3">
            {currentSections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`flex items-center space-x-2 text-left p-2 rounded-lg transition ${activeSection === section.id ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-50 text-gray-700'}`}
              >
                {section.icon}
                <span>{section.title}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile accordion menu */}
        <div className="lg:hidden mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-purple-600" />
            Policy Sections
          </h3>
          <div className="space-y-2">
            {currentSections.map((section) => (
              <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition"
                >
                  <div className="flex items-center space-x-3">
                    {section.icon}
                    <span className="font-medium text-gray-800">{section.title}</span>
                  </div>
                  {expandedSections[section.id] ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedSections[section.id] && (
                  <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <div className="prose prose-sm text-gray-600">
                      {renderSectionContent(section.content)}
                      {section.highlight && (
                        <div className="mt-4 p-4 bg-purple-50 border border-purple-100 rounded-lg text-purple-800">
                          {section.highlight}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className="mt-3 text-sm text-purple-600 hover:text-purple-800 flex items-center"
                    >
                      View full details
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-8">
          {currentSections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="policy-section bg-white rounded-xl shadow-sm p-6 md:p-8 border border-purple-100 scroll-mt-24"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                  {section.icon}
                </div>
                <h2 className="text-xl font-bold text-gray-800">{section.title}</h2>
              </div>
              
              <div className="prose max-w-none text-gray-600">
                {renderSectionContent(section.content)}
              </div>
              
              {section.highlight && (
                <div className="mt-6 p-4 bg-purple-50 border border-purple-100 rounded-lg text-purple-800">
                  <p className="font-medium">{section.highlight}</p>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Contact Section */}
        <section id="contact" className="mt-16 bg-white rounded-xl shadow-sm p-6 md:p-8 border border-purple-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-purple-600" />
                Have Questions About Our Policies?
              </h2>
              <p className="text-gray-600">
                Our support team is happy to clarify any policy details or answer questions you may have.
              </p>
            </div>
            <div className="space-y-3">
              <a 
                href="mailto:support@peakperformance.com" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 transition"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Support
              </a>
              <a 
                href="/support" 
                className="inline-flex items-center px-4 py-2 border border-purple-200 text-sm font-medium rounded-md text-purple-700 bg-white hover:bg-purple-50 transition"
              >
                <ClipboardList className="w-4 h-4 mr-2" />
                Visit Support Center
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Peak Performance Tutoring. All rights reserved.</p>
          <p className="mt-1">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </footer>
    </div>
  );
};

export default TutoringPolicies;