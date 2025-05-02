import { useState, useEffect } from 'react';
import {
  Home, Calendar, Target, BookOpen, BarChart2, Mail, MapPin,
  HelpCircle, User, ChevronRight, Clock, CheckCircle2, XCircle,
  ChevronDown, ChevronUp, ArrowRight, Bookmark, Award, Bell,
  MessageSquare, ClipboardList, Search, Settings, Plus, Video, Book,
  FlaskConical, Calculator, Languages, Music, Activity, Feather
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
const DashboardHome = ({ isEnrolled = true, justLoggedIn = false }) => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // For session filtering
  const [expandedProgramId, setExpandedProgramId] = useState(null);
  const navigate = useNavigate()
  const activePrograms = [
    { 
      id: 1, 
      name: "Summer Intensive Maths", 
      date: "Jul 10 - Aug 5", 
      icon: <Bookmark className="w-5 h-5 text-blue-600" />,
      progress: 75,
      description: "Advanced algebra and calculus concepts with exam preparation",
      resources: 12,
      sessionsCompleted: 8
    },
    { 
      id: 2, 
      name: "Advanced Science Prep", 
      date: "Aug 15 - Sep 10", 
      icon: <Award className="w-5 h-5 text-purple-600" />,
      progress: 30,
      description: "Physics and chemistry intensive for competitive exams",
      resources: 5,
      sessionsCompleted: 3
    }
  ];

  const upcomingSessions = [
    { 
      id: 1, 
      subject: "Algebra II", 
      time: "Mon 9:00 AM", 
      duration: "1h 30m",
      tutor: "Dr. Smith", 
      type: "tuition",
      status: "upcoming",
      icon: <Calculator className="w-5 h-5" />,
      joinable: true
    },
    { 
      id: 2, 
      subject: "Chemistry Lab", 
      time: "Tue 11:00 AM", 
      duration: "2h",
      tutor: "Prof. Johnson", 
      type: "tuition",
      status: "upcoming",
      icon: <FlaskConical className="w-5 h-5" />,
      joinable: true
    },
    { 
      id: 3, 
      subject: "French Practice", 
      time: "Wed 4:00 PM", 
      duration: "1h",
      tutor: "Self-study", 
      type: "personal",
      status: "upcoming",
      icon: <Languages className="w-5 h-5" />,
      joinable: false
    },
    { 
      id: 4, 
      subject: "Music Theory", 
      time: "Fri 3:00 PM", 
      duration: "45m",
      tutor: "Self-study", 
      type: "personal",
      status: "upcoming",
      icon: <Music className="w-5 h-5" />,
      joinable: false
    }
  ];

  const weeklyAttendance = [
    { day: "Mon", attended: true, sessions: 2 },
    { day: "Tue", attended: true, sessions: 1 },
    { day: "Wed", attended: false, sessions: 0 },
    { day: "Thu", attended: true, sessions: 1 },
    { day: "Fri", attended: true, sessions: 1 }
  ];

  // useEffect(() => {
  //   const token = localStorage.getItem("token");

  //   if (!token) {
  //     navigate("/landingpage");
  //     return;
  //   }

  //   try {
  //     const decoded = jwtDecode(token);
  //     const currentTime = Date.now() / 1000; // in seconds

  //     if (decoded.exp < currentTime) {
  //       // Token expired
  //       localStorage.removeItem("token");
  //       navigate("/auth/students-login");
  //     } else {
  //       // Token is valid
  //       navigate("/"); // Redirect to dashboard if token is valid
  //     }
  //   } catch (err) {
  //     console.error("Invalid token:", err);
  //     localStorage.removeItem("token");
  //     navigate("/landingpage");
  //   }
  // }, [navigate])

  const toggleProgramExpand = (id) => {
    setExpandedProgramId(expandedProgramId === id ? null : id);
  };

  const filteredSessions = activeTab === 'all' 
    ? upcomingSessions 
    : upcomingSessions.filter(s => s.type === activeTab);

  const handleViewAll = (section) => {
    // In a real app, this would navigate to dedicated pages
    alert(`Navigating to ${section} page with full details`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 overflow-auto">
      {showWelcome && (
        <div className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl flex justify-between items-center animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, Alex!</h1>
            <p className="opacity-90">You have {upcomingSessions.length} sessions this week</p>
          </div>
          <XCircle 
            className="w-6 h-6 cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={() => setShowWelcome(false)} 
          />
        </div>
      )}

      {/* Summary Cards with hover effects */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Bookmark className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="text-lg font-semibold">{activePrograms.length}</h4>
            <p className="text-sm text-gray-500">My Programmes</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Target className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h4 className="text-lg font-semibold">2</h4>
            <p className="text-sm text-gray-500">Goals Set</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow">
          <div className="p-2 bg-green-100 rounded-lg">
            <Clock className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h4 className="text-lg font-semibold">{upcomingSessions.length}</h4>
            <p className="text-sm text-gray-500">Upcoming Sessions</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h4 className="text-lg font-semibold">80%</h4>
            <p className="text-sm text-gray-500">Attendance Rate</p>
          </div>
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Programmes Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <BookOpen className="w-5 h-5 text-blue-500 mr-2" />
              {isEnrolled ? "My Programmes" : "Upcoming Programmes"}
            </h3>
            <button 
              className="text-blue-600 text-sm flex items-center hover:text-blue-800 transition-colors"
              onClick={() => handleViewAll('programmes')}
            >
              View all <ChevronRight className="ml-1 w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {isEnrolled ? activePrograms.map(p => (
              <div key={p.id} className="border border-gray-100 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-50 rounded-lg">{p.icon}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{p.name}</h4>
                      <button 
                        onClick={() => toggleProgramExpand(p.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {expandedProgramId === p.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" /> {p.date}
                    </p>
                    <div className="mt-2 w-full h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-blue-500 rounded-full" 
                        style={{ width: `${p.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-right text-xs text-gray-500 mt-1">{p.progress}% complete</p>
                  </div>
                </div>
                
                {expandedProgramId === p.id && (
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-2 animate-fade-in">
                    <p className="text-sm text-gray-600">{p.description}</p>
                    <div className="flex space-x-4 text-sm mt-2">
                      <span className="flex items-center text-gray-500">
                        <Book className="w-4 h-4 mr-1" /> {p.resources} resources
                      </span>
                      <span className="flex items-center text-gray-500">
                        <CheckCircle2 className="w-4 h-4 mr-1" /> {p.sessionsCompleted} sessions
                      </span>
                    </div>
                    <button className="mt-3 text-sm text-blue-600 hover:text-blue-800 flex items-center">
                      View programme details <ArrowRight className="ml-1 w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )) : (
              <div className="p-6 text-center text-gray-500">
                <BookOpen className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p>No active programmes</p>
                <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Browse Programmes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Sessions with filtering */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Clock className="w-5 h-5 text-blue-500 mr-2" />
              Upcoming Sessions
            </h3>
            <button 
              className="text-blue-600 text-sm flex items-center hover:text-blue-800 transition-colors"
              onClick={() => handleViewAll('sessions')}
            >
              View all <ChevronRight className="ml-1 w-4 h-4" />
            </button>
          </div>
          
          {/* Session Type Tabs */}
          <div className="flex mb-4 border-b border-gray-200">
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'tuition' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('tuition')}
            >
              Tuition
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'personal' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('personal')}
            >
              Personal
            </button>
          </div>
          
          <div className="space-y-3">
            {filteredSessions.length > 0 ? filteredSessions.map(s => (
              <div 
                key={s.id} 
                className={`p-3 rounded-lg flex items-center space-x-3 border-l-4 ${s.type === 'tuition' ? 'border-blue-500 bg-blue-50' : 'border-purple-500 bg-purple-50'} hover:shadow-sm transition-shadow`}
              >
                <div className="p-2 bg-white rounded-lg shadow-sm">{s.icon}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{s.subject}</h4>
                  <div className="flex flex-wrap items-center text-sm text-gray-500">
                    <span className="flex items-center mr-3">
                      <Clock className="w-4 h-4 mr-1" /> {s.time}
                    </span>
                    <span className="mr-3">{s.duration}</span>
                    <span className="truncate">with {s.tutor}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    s.type === 'tuition' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {s.type}
                  </span>
                  {s.joinable && (
                    <button className="mt-1 text-xs text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded flex items-center">
                      Join <Video className="ml-1 w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )) : (
              <div className="p-4 text-center text-gray-500">
                No {activeTab === 'all' ? 'upcoming' : activeTab} sessions
              </div>
            )}
          </div>
        </div>

        {/* Weekly Attendance */}
        {isEnrolled && (
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <CheckCircle2 className="w-5 h-5 text-blue-500 mr-2" />
                Weekly Attendance
              </h3>
              <button 
                className="text-blue-600 text-sm flex items-center hover:text-blue-800 transition-colors"
                onClick={() => handleViewAll('attendance')}
              >
                View details <ChevronRight className="ml-1 w-4 h-4" />
              </button>
            </div>
            
            <div className="flex justify-between mb-3">
              {weeklyAttendance.map((day, idx) => (
                <div key={idx} className="text-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1 transition-all ${
                      day.attended 
                        ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                    }`}
                    title={day.attended ? `${day.sessions} session(s) attended` : 'No sessions attended'}
                  >
                    {day.attended ? (
                      <span className="font-medium">{day.sessions}</span>
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{day.day}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-2 bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full rounded-full" style={{ width: '80%' }}></div>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-500">4 of 5 days attended (80%)</p>
              <div className="flex items-center">
                <Activity className="w-4 h-4 text-gray-400 mr-1" />
                <span className="text-xs text-gray-500">+5% from last week</span>
              </div>
            </div>
          </div>
        )}

        {/* Goals Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Target className="w-5 h-5 text-blue-500 mr-2" />
              My Goals
            </h3>
            <button 
              className="text-blue-600 text-sm flex items-center hover:text-blue-800 transition-colors"
              onClick={() => handleViewAll('goals')}
            >
              View all <ChevronRight className="ml-1 w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Achieve A* in Maths</h4>
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">Academic</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="w-full h-2 bg-gray-200 rounded-full mr-2">
                  <div className="h-2 bg-blue-600 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <span className="text-sm font-medium">65%</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Started: Jun 15</span>
                <span>Target: Dec 20</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Improve Chemistry by 2 grades</h4>
                <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">Academic</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="w-full h-2 bg-gray-200 rounded-full mr-2">
                  <div className="h-2 bg-purple-600 rounded-full" style={{ width: '40%' }}></div>
                </div>
                <span className="text-sm font-medium">40%</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Started: Jul 1</span>
                <span>Target: Nov 30</span>
              </div>
            </div>
            
            <button className="w-full flex items-center justify-center text-blue-600 hover:text-blue-800 p-2 rounded-lg border border-dashed border-gray-300 hover:border-blue-300 transition-colors">
              <Plus className="w-4 h-4 mr-1" />
              Add New Goal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;