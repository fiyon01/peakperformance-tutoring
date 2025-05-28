import { useEffect, useState, useRef, useContext } from 'react';

import { UserContext } from '../context/UserContext';
import { 
  Calendar, Clock, GraduationCap, Target, CreditCard, 
  Trophy, BookOpen, Users, BarChart2, Flag, Megaphone, CheckCircle,
  ChevronRight, X, Smile, Flame, Goal, Star, AlertTriangle, Plus,
  DollarSign, BookText, Award, ChevronDown, ChevronUp, Bookmark, Home,
  Sun, Moon, Waves, ArrowRight, Check, Lightbulb, Bell, Zap, BookmarkPlus,
  Sparkles, Rabbit, ChevronLeft, Info, HelpCircle, Clock3, CalendarCheck,
  CalendarClock, BookKey, BookMarked, BookPlus, BookUser, BookX, BrainCircuit,
  Clapperboard, Coffee, Compass, Crown, Dumbbell, Gauge, Gem, Goal as GoalIcon,
  HeartPulse, LampDesk, Library, Medal, NotebookPen, PartyPopper, PenLine, PencilLine,
  Rocket, School, ScrollText, ShieldCheck, Sparkle, Target as TargetIcon, Timer,
  Trophy as TrophyIcon, Wifi, Youtube, Atom, FlaskConical, Leaf, Calculator
} from 'lucide-react';
import Confetti from 'react-confetti';
import { FaEarlybirds, FaRobot, FaGamepad } from "react-icons/fa";
import { GiChemicalDrop, GiBrain, GiSoccerBall } from "react-icons/gi";
import { BsEmojiFrown, BsEmojiSmile, BsEmojiLaughing } from "react-icons/bs";

const DashboardHome = ({ isEnrolled }) => {
  const { user } = useContext(UserContext);

  const [showWelcome, setShowWelcome] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('goals');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [dismissedNotices, setDismissedNotices] = useState([]);
  const [showActivityAnswer, setShowActivityAnswer] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium'
  });
  const [mood, setMood] = useState(null);
  const [showMoodSubmitted, setShowMoodSubmitted] = useState(false);
  const [streakCount, setStreakCount] = useState(7);
  const [showScienceFact, setShowScienceFact] = useState(false);
  const [showMathTip, setShowMathTip] = useState(false);
  const [gameUnlocked, setGameUnlocked] = useState(false);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [hasSubmittedMoodToday, setHasSubmittedMoodToday] = useState(false);

  // Current program data
  const [currentProgram, setCurrentProgram] = useState({
    id: 1,
    name: 'Peak Performance Combined Programme',
    duration: '12 Weeks',
    startDate: '2025-09-01',
    endDate: '2025-11-30',
    currentWeek: 'Week 5',
    subjects: [
      { id: 1, name: 'Advanced Mathematics', tutor: 'Dr. Wanjiku', schedule: 'Mon/Wed 10:00-11:30', type: 'online' },
      { id: 2, name: 'Physics Mastery', tutor: 'Prof. Omondi', schedule: 'Tue/Thu 14:00-15:30', type: 'in-person' },
      { id: 3, name: 'Chemistry Intensive', tutor: 'Dr. Kamau', schedule: 'Fri 9:00-12:00', type: 'online' }
    ],
    balance: 0,
    totalFee: 0,
    progress: 0,
    nextPaymentDue: ''
  });

  // Dashboard data
  const [dashboardData, setDashboardData] = useState({
    upcomingSessions: [
      {
        id: 1,
        subject: 'Advanced Mathematics',
        date: '2025-10-15',
        time: '18:00 PM - 20:00 PM',
        location: 'Zoom Room 203',
        tutor: 'Tr. Wanjiku',
        type: 'online',
        materials: ['Calculator', 'Graph paper', 'Textbook Chapter 5']
      }
    ],
    activeGoals: [
      { 
        id: 1, 
        title: 'Complete Math Problem Set', 
        description: 'Finish all problems in Chapter 5',
        progress: 65, 
        dueDate: '2025-10-20', 
        priority: 'high',
        subject: 'Advanced Mathematics'
      },
      { 
        id: 2, 
        title: 'Read Physics Chapter 4', 
        description: 'Take notes on key concepts',
        progress: 30, 
        dueDate: '2025-10-18', 
        priority: 'medium',
        subject: 'Physics Mastery'
      }
    ],
    announcements: [
      { 
        id: 1, 
        title: 'Mid-Programme Assessments', 
        date: '2024-10-10', 
        content: 'Mid-programme tests will be conducted next week. Preparation materials are available in the resources section.' 
      },
      { 
        id: 2, 
        title: 'Parent-Teacher Conference', 
        date: '2024-10-05', 
        content: 'Sign up for parent-teacher conferences happening October 25th-27th.' 
      }
    ],
    performanceStats: {
      attendance: 0,
      averageScore: 0,
      assignmentsCompleted: 0,
      upcomingTests: 0
    },
    resources: [
      { id: 1, name: 'Math Formula Sheet', type: 'PDF', subject: 'Advanced Mathematics' },
      { id: 2, name: 'Physics Past Papers', type: 'PDF', subject: 'Physics Mastery' },
      { id: 3, name: 'Programme Calendar', type: 'PDF', subject: 'General' }
    ]
  });

  const [funFacts, setFunFacts] = useState([
    "Did you know? The human brain can process information as fast as 120 meters per second!",
    "Study tip: Taking short breaks every 45 minutes improves retention by up to 20%.",
    "Fun fact: The shortest war in history was between Britain and Zanzibar in 1896. Zanzibar surrendered after 38 minutes.",
    "Math magic: If you shuffle a deck of cards properly, chances are the order has never existed before in history!",
    "Science fun: There's enough DNA in your body to stretch from the sun to Pluto and back 17 times!",
    "Chemistry fact: Water expands when it freezes (which is why ice floats). Almost all other substances contract when freezing."
  ]);

  const [scienceFacts, setScienceFacts] = useState([
    "Physics: The Eiffel Tower can be 15 cm taller during summer due to thermal expansion!",
    "Biology: Your body has enough iron to make a nail 3 inches long!",
    "Chemistry: Helium can work against gravity - when it's cooled to near absolute zero, it becomes a superfluid!",
    "Physics: Light takes 8 minutes to travel from the Sun to Earth, but only a few nanoseconds to travel across a room!",
    "Biology: There are more bacteria in your mouth than there are people on Earth!",
    "Chemistry: The only letter not appearing on the periodic table is J!"
  ]);

  const [mathTips, setMathTips] = useState([
    "Struggling with math? Break problems into smaller steps - even Einstein did this!",
    "Math tip: Draw pictures to visualize problems. Many math concepts become clearer when you can see them.",
    "Remember: Every math genius was once a beginner. Keep practicing!",
    "Math secret: Understanding 'why' is more important than memorizing 'how'.",
    "Did you know? Making mistakes in math actually helps your brain grow stronger!"
  ]);

  const [morningEncouragements, setMorningEncouragements] = useState([
    "Good morning! Today is a new opportunity to learn and grow.",
    "Rise and shine! Your brain is most alert in the morning - perfect for tackling challenging subjects.",
    "Morning! Start your day with a small win - complete one task right away.",
    "Early bird gets the worm! Morning study sessions can be highly productive.",
    "Good morning! Remember, consistency beats intensity. Small daily progress leads to big results."
  ]);

  const [afternoonEncouragements, setAfternoonEncouragements] = useState([
    "Afternoon energy dip? Try a 5-minute walk to refresh your mind.",
    "You're halfway through the day! Keep up the momentum.",
    "Afternoon tip: Review what you learned this morning to reinforce memory.",
    "Stay hydrated! Proper hydration improves cognitive function.",
    "Afternoon is a great time for collaborative learning - consider a study group."
  ]);

  const [eveningEncouragements, setEveningEncouragements] = useState([
    "Evening is perfect for reflection. Review what you learned today.",
    "Wind down with some light reading related to your subjects.",
    "Evening tip: Prepare for tomorrow to start your day with clarity.",
    "Great work today! Celebrate your small wins.",
    "Evening is ideal for creative thinking - try solving problems differently."
  ]);

  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [showSessionDetails, setShowSessionDetails] = useState(null);
  const goalRefs = useRef([]);

  // Time-based display logic
  const isMorning = currentHour >= 5 && currentHour < 12;
  const isAfternoon = currentHour >= 12 && currentHour < 17;
  const isEvening = currentHour >= 17 || currentHour < 5;

  useEffect(() => {
    setShowWelcome(true);
    
    // Update time every minute
    const timeInterval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setCurrentHour(now.getHours());
    }, 60000);

    // Check if mood was already submitted today
    const lastMoodDate = localStorage.getItem('lastMoodDate');
    const today = new Date().toDateString();
    setHasSubmittedMoodToday(lastMoodDate === today);

    // Rotate fun facts every 15 seconds
    const factInterval = setInterval(() => {
      setCurrentFactIndex(prev => (prev + 1) % funFacts.length);
    }, 15000);

    // Random encouragement for STEM subjects
    const encouragementInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setShowEncouragement(true);
        setTimeout(() => setShowEncouragement(false), 8000);
      }
    }, 60000);

    // Animate progress bars
    goalRefs.current.forEach((ref, index) => {
      if (ref) {
        setTimeout(() => {
          ref.style.width = `${dashboardData.activeGoals[index].progress}%`;
        }, 300 * (index + 1));
      }
    });

    return () => {
      clearInterval(timeInterval);
      clearInterval(factInterval);
      clearInterval(encouragementInterval);
    };
  }, []);

  const dismissNotice = (id) => {
    setDismissedNotices([...dismissedNotices, id]);
  };

  const handleGoalInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const submitNewGoal = (e) => {
    e.preventDefault();
    const newGoalObj = {
      id: Math.max(...dashboardData.activeGoals.map(g => g.id)) + 1,
      title: newGoal.title,
      description: newGoal.description,
      dueDate: newGoal.dueDate,
      progress: 0,
      priority: newGoal.priority,
      subject: 'General'
    };
    
    setDashboardData(prev => ({
      ...prev,
      activeGoals: [...prev.activeGoals, newGoalObj]
    }));
    
    setNewGoal({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium'
    });
    setShowGoalModal(false);
    
    // Celebrate new goal
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const updateGoalProgress = (id, newProgress) => {
    setDashboardData(prev => ({
      ...prev,
      activeGoals: prev.activeGoals.map(goal => 
        goal.id === id ? { ...goal, progress: newProgress } : goal
      )
    }));
    
    if (newProgress === 100) {
      // Celebrate completed goal
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      setGameUnlocked(true);
    }
  };

  const submitMood = (selectedMood) => {
    setMood(selectedMood);
    setShowMoodSubmitted(true);
    setHasSubmittedMoodToday(true);
    localStorage.setItem('lastMoodDate', new Date().toDateString());
    
    setTimeout(() => {
      setShowMoodSubmitted(false);
      // Only remove the mood tracker in the evening after submission
      if (isEvening) {
        setHasSubmittedMoodToday(true);
      }
    }, 3000);
    
    if (selectedMood === 'happy') {
      setStreakCount(prev => prev + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getGreeting = () => {
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getCurrentTerm = (date) => {
    const month = date.getMonth() + 1;
    if (month >= 1 && month <= 4) return "Term 1";
    if (month >= 5 && month <= 8) return "Term 2";
    return "Term 3";
  };

  const getMascot = () => {
    if (currentHour < 12) return <Sun className="w-12 h-12 text-yellow-500 animate-pulse" />;
    if (currentHour < 17) return <Sparkles className="w-12 h-12 text-blue-500 animate-spin-slow" />;
    return <Moon className="w-12 h-12 text-indigo-500 animate-pulse" />;
  };

  const toggleActivityAnswer = () => {
    setShowActivityAnswer(!showActivityAnswer);
    if (!showActivityAnswer) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  const toggleScienceFact = () => {
    setShowScienceFact(!showScienceFact);
    if (!showScienceFact) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    }
  };

  const toggleMathTip = () => {
    setShowMathTip(!showMathTip);
    if (!showMathTip) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    }
  };

  const getRandomEncouragement = () => {
    if (isMorning) return morningEncouragements[Math.floor(Math.random() * morningEncouragements.length)];
    if (isAfternoon) return afternoonEncouragements[Math.floor(Math.random() * afternoonEncouragements.length)];
    return eveningEncouragements[Math.floor(Math.random() * eveningEncouragements.length)];
  };

  if (!isEnrolled) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center max-w-2xl mx-auto">
          <GraduationCap className="w-16 h-16 mx-auto text-blue-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Peak Performance!</h2>
          <p className="text-gray-600 mb-6">You're not currently enrolled in any programme. Our next intensive starts soon - don't miss out!</p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100 mb-6">
            <h3 className="font-medium text-gray-800 mb-2">Next Programme Starts:</h3>
            <div className="flex items-center justify-center space-x-2">
              <CalendarCheck className="w-5 h-5 text-blue-600" />
              <span className="font-medium">November 1, 2024</span>
            </div>
          </div>
          <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center mx-auto">
            <BookmarkPlus className="w-5 h-5 mr-2" />
            Explore Programmes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 relative overflow-hidden">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      {/* Welcome Section with Animated Mascot */}
      <div className={`transition-all duration-1000 transform ${showWelcome ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <div className="mr-4">
                {getMascot()}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">
                  {getGreeting()}, {user.username}!
                </h1>
                <p className="text-blue-100">Your peak performance journey continues today</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 bg-white bg-opacity-20 p-3 rounded-lg border border-white border-opacity-30 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-yellow-300" />
                  <span className="font-medium text-gray-800">
                    {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-yellow-300" />
                  <span className="font-medium text-gray-800">
                    {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center">
                  <Bookmark className="w-5 h-5 mr-2 text-yellow-300" />
                  <span className="font-medium text-gray-800">
                    {getCurrentTerm(currentTime)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Programme Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-blue-800 bg-blue-100 px-2 py-1 rounded-full">ACTIVE</span>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Current Programme</h3>
          <p className="text-xl font-bold text-gray-900 mb-2">Peak Performance</p>
          <div className="flex items-center text-sm text-blue-600">
            <Clock className="w-4 h-4 mr-1" />
            <span>Week 5 of 12</span>
          </div>
        </div>

        {/* Goals Card */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-purple-800 bg-purple-100 px-2 py-1 rounded-full">{dashboardData.activeGoals.length} ACTIVE</span>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Learning Goals</h3>
          <p className="text-xl font-bold text-gray-900 mb-2">Track Your Progress</p>
          <div className="flex items-center text-sm text-purple-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span>{dashboardData.activeGoals.filter(g => g.progress === 100).length} Completed</span>
          </div>
        </div>

        {/* Sessions Card */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Clock3 className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs font-medium text-green-800 bg-green-100 px-2 py-1 rounded-full">TODAY</span>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Upcoming Sessions</h3>
          <p className="text-xl font-bold text-gray-900 mb-2">{dashboardData.upcomingSessions.length} Scheduled</p>
          <div className="flex items-center text-sm text-green-600">
            <CalendarClock className="w-4 h-4 mr-1" />
            <span>Next: {formatDate(dashboardData.upcomingSessions[0]?.date)}</span>
          </div>
        </div>

        {/* Payment Card */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5 border border-amber-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-amber-100 p-2 rounded-lg">
              <CreditCard className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-xs font-medium text-amber-800 bg-amber-100 px-2 py-1 rounded-full">DUE SOON</span>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Payment Status</h3>
          <p className="text-xl font-bold text-gray-900 mb-2">Ksh {currentProgram.balance.toLocaleString()}</p>
          <div className="flex items-center text-sm text-amber-600">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Due {formatDate(currentProgram.nextPaymentDue)}</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center mb-6">
              <BarChart2 className="w-6 h-6 mr-2 text-blue-600" />
              My Performance Dashboard
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">Average Score</span>
                  <Trophy className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 animate-countup" data-target={dashboardData.performanceStats.averageScore}>
                  {dashboardData.performanceStats.averageScore}%
                </p>
                <p className="text-xs text-blue-600 mt-1">4.0 GPA Scale</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-800">Attendance</span>
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 animate-countup" data-target={dashboardData.performanceStats.attendance}>
                  {dashboardData.performanceStats.attendance}%
                </p>
                <p className="text-xs text-green-600 mt-1">Perfect this month</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-800">Assignments</span>
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 animate-countup" data-target={dashboardData.performanceStats.assignmentsCompleted}>
                  {dashboardData.performanceStats.assignmentsCompleted}
                </p>
                <p className="text-xs text-purple-600 mt-1">Completed</p>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-amber-800">Upcoming Tests</span>
                  <Flag className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 animate-countup" data-target={dashboardData.performanceStats.upcomingTests}>
                  {dashboardData.performanceStats.upcomingTests}
                </p>
                <p className="text-xs text-amber-600 mt-1">This week</p>
              </div>
            </div>
          </div>

          {/* STEM Encouragement Banner */}
          {showEncouragement && (
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white flex items-center justify-between animate-fade-in">
              <div className="flex items-center">
                <BrainCircuit className="w-8 h-8 mr-3 text-yellow-300" />
                <div>
                  <h3 className="font-bold">Remember!</h3>
                  <p>{getRandomEncouragement()}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowEncouragement(false)}
                className="text-white hover:text-yellow-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Goals Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Target className="w-6 h-6 mr-2 text-purple-600" />
                My Learning Goals
              </h2>
              <button 
                onClick={() => setShowGoalModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-sm hover:shadow-md flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                New Goal
              </button>
            </div>
            
            {dashboardData.activeGoals.length === 0 ? (
              <div className="text-center py-8">
                <Goal className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">No goals set yet</h3>
                <p className="text-gray-400 mb-4">Start your peak performance journey by setting your first goal</p>
                <button 
                  onClick={() => setShowGoalModal(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center mx-auto"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Your First Goal
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData.activeGoals.map((goal, index) => (
                  <div key={goal.id} className="p-5 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-sm transition-all hover:border-purple-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900 flex items-center">
                          <TargetIcon className="w-5 h-5 mr-2 text-purple-600" />
                          {goal.title}
                        </h3>
                        {goal.subject && (
                          <div className="text-xs text-gray-500 mt-1 ml-7">Subject: {goal.subject}</div>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        goal.priority === 'high' ? 'bg-red-100 text-red-800' :
                        goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {goal.priority}
                      </span>
                    </div>
                    
                    <div className="mb-3 ml-7">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          ref={el => goalRefs.current[index] = el}
                          className={`h-2.5 rounded-full transition-all duration-1000 ${
                            goal.progress < 30 ? 'bg-red-400' :
                            goal.progress < 70 ? 'bg-yellow-400' :
                            'bg-green-500'
                          }`}
                          style={{ width: '0%' }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 ml-7 mb-2">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Due {formatDate(goal.dueDate)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => updateGoalProgress(goal.id, Math.min(100, goal.progress + 10))}
                          className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded hover:bg-green-100 transition-colors"
                        >
                          +10%
                        </button>
                        <button 
                          onClick={() => updateGoalProgress(goal.id, Math.max(0, goal.progress - 10))}
                          className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded hover:bg-red-100 transition-colors"
                        >
                          -10%
                        </button>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                        Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-green-600" />
                Upcoming Sessions
              </h2>
              <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                View all
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            
            <div className="space-y-4">
              {dashboardData.upcomingSessions.map(session => (
                <div key={session.id} className="p-5 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-sm transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900 flex items-center">
                        {session.type === 'online' ? (
                          <Wifi className="w-5 h-5 mr-2 text-blue-600" />
                        ) : (
                          <School className="w-5 h-5 mr-2 text-green-600" />
                        )}
                        {session.subject}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1 ml-7">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{session.tutor}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{formatDate(session.date)}</div>
                      <div className="text-sm text-gray-600 flex items-center justify-end">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{session.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-sm text-gray-600 ml-7">
                    <Home className="w-4 h-4 mr-1" />
                    <span>{session.location}</span>
                  </div>
                  
                  <div className="mt-4 ml-7">
                    <button 
                      onClick={() => setShowSessionDetails(showSessionDetails === session.id ? null : session.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                    >
                      {showSessionDetails === session.id ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-1" />
                          Hide Details
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-1" />
                          View Details
                        </>
                      )}
                    </button>
                    
                    {showSessionDetails === session.id && (
                      <div className="mt-2 bg-white p-3 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-800 mb-2">Materials Needed:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                          {session.materials.map((material, i) => (
                            <li key={i}>{material}</li>
                          ))}
                        </ul>
                        {session.type === 'online' && (
                          <button className="mt-3 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center">
                            <Youtube className="w-4 h-4 mr-2" />
                            Join Zoom Session
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Scrollable */}
        <div className="space-y-6 lg:h-[calc(100vh-200px)] lg:overflow-y-auto lg:pr-2 lg:pb-6">
          {/* Mood Tracker - Only shown once per day and at appropriate times */}
          {!hasSubmittedMoodToday && (isMorning || isAfternoon || isEvening) && (
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl shadow-sm border border-pink-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4">
                <Smile className="w-6 h-6 mr-2 text-pink-600" />
                {isMorning ? "How Are You Feeling Today?" : 
                 isAfternoon ? "How's Your Day Going?" : 
                 "How Was Your Day Today?"}
              </h2>
              
              {showMoodSubmitted ? (
                <div className="bg-white rounded-lg border border-gray-200 p-5 text-center">
                  <div className="flex justify-center mb-3">
                    {mood === 'happy' ? (
                      <BsEmojiLaughing className="w-12 h-12 text-yellow-500 animate-bounce" />
                    ) : mood === 'neutral' ? (
                      <BsEmojiSmile className="w-12 h-12 text-blue-500 animate-pulse" />
                    ) : (
                      <BsEmojiFrown className="w-12 h-12 text-purple-500 animate-wiggle" />
                    )}
                  </div>
                  <p className="text-gray-700 mb-2">
                    {mood === 'happy' ? "Awesome! Keep that positive energy!" : 
                     mood === 'neutral' ? "Alright! Every day is a new opportunity!" : 
                     "It's okay to feel this way. Tomorrow is a new day!"}
                  </p>
                  {mood === 'happy' && (
                    <p className="text-sm text-pink-600">🔥 You're on a {streakCount}-day happy streak!</p>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <p className="text-gray-700 mb-4">
                    {isMorning ? "Let us know how you're feeling as you start your day:" : 
                     isAfternoon ? "How are you feeling about your progress so far today?" : 
                     "Share how your day of learning went:"}
                  </p>
                  <div className="flex justify-around">
                    <button 
                      onClick={() => submitMood('sad')}
                      className="flex flex-col items-center p-3 rounded-full hover:bg-pink-100 transition-colors"
                    >
                      <BsEmojiFrown className="w-8 h-8 text-purple-500" />
                      <span className="text-xs mt-1">{isEvening ? "Challenging" : "Struggling"}</span>
                    </button>
                    <button 
                      onClick={() => submitMood('neutral')}
                      className="flex flex-col items-center p-3 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      <BsEmojiSmile className="w-8 h-8 text-blue-500" />
                      <span className="text-xs mt-1">Okay</span>
                    </button>
                    <button 
                      onClick={() => submitMood('happy')}
                      className="flex flex-col items-center p-3 rounded-full hover:bg-yellow-100 transition-colors"
                    >
                      <BsEmojiLaughing className="w-8 h-8 text-yellow-500" />
                      <span className="text-xs mt-1">Great!</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEM Interactive Cards - Show different cards at different times */}
          {isMorning && (
            <div 
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-5 cursor-pointer transition-all hover:shadow-md"
              onClick={toggleScienceFact}
            >
              <div className="flex items-center mb-3">
                <Atom className="w-6 h-6 mr-2 text-blue-600" />
                <h3 className="font-medium text-gray-800">Morning Science Spark</h3>
              </div>
              <div className={`transition-opacity duration-300 ${showScienceFact ? 'opacity-0 h-0' : 'opacity-100 h-auto'}`}>
                <p className="text-gray-700">Start your day with an amazing science fact!</p>
                <div className="flex justify-end mt-2">
                  <button className="text-blue-600 text-sm flex items-center">
                    Reveal <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
              <div className={`transition-opacity duration-300 ${showScienceFact ? 'opacity-100 h-auto' : 'opacity-0 h-0'}`}>
                <p className="text-gray-700">{scienceFacts[Math.floor(Math.random() * scienceFacts.length)]}</p>
                <div className="flex justify-end mt-2">
                  <button className="text-blue-600 text-sm flex items-center">
                    Hide <ChevronUp className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {isAfternoon && (
            <div 
              className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl shadow-sm border border-green-200 p-5 cursor-pointer transition-all hover:shadow-md"
              onClick={toggleMathTip}
            >
              <div className="flex items-center mb-3">
                <Calculator className="w-6 h-6 mr-2 text-green-600" />
                <h3 className="font-medium text-gray-800">Afternoon Math Boost</h3>
              </div>
              <div className={`transition-opacity duration-300 ${showMathTip ? 'opacity-0 h-0' : 'opacity-100 h-auto'}`}>
                <p className="text-gray-700">Need a math study pick-me-up? Click here!</p>
                <div className="flex justify-end mt-2">
                  <button className="text-green-600 text-sm flex items-center">
                    Reveal <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
              <div className={`transition-opacity duration-300 ${showMathTip ? 'opacity-100 h-auto' : 'opacity-0 h-0'}`}>
                <p className="text-gray-700">{mathTips[Math.floor(Math.random() * mathTips.length)]}</p>
                <div className="flex justify-end mt-2">
                  <button className="text-green-600 text-sm flex items-center">
                    Hide <ChevronUp className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Brain Teaser - Show in the evening */}
          {isEvening && (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-sm border border-purple-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4">
                <Zap className="w-6 h-6 mr-2 text-purple-600" />
                Evening Brain Teaser
              </h2>
              
              <div 
                className="relative bg-white rounded-lg border border-gray-200 p-5 shadow-inner cursor-pointer transition-all duration-300 min-h-[120px]"
                onClick={toggleActivityAnswer}
              >
                {/* Question Side */}
                <div className={`flex flex-col h-full transition-opacity duration-300 ${showActivityAnswer ? 'opacity-0 absolute' : 'opacity-100'}`}>
                  <div className="flex items-center mb-3">
                    <Lightbulb className="w-5 h-5 mr-2 text-yellow-500 flex-shrink-0" />
                    <h3 className="font-medium text-gray-800">Physics Challenge</h3>
                  </div>
                  <p className="text-gray-700 mb-4 flex-grow">
                    If you drop a feather and a bowling ball from the same height in a vacuum, which hits the ground first?
                  </p>
                  <div className="flex justify-end">
                    <button 
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleActivityAnswer();
                      }}
                    >
                      <span>Reveal Answer</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
                
                {/* Answer Side */}
                <div className={`flex flex-col h-full transition-opacity duration-300 ${showActivityAnswer ? 'opacity-100' : 'opacity-0 absolute'}`}>
                  <div className="flex items-center mb-3">
                    <Check className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
                    <h3 className="font-medium text-gray-800">Answer</h3>
                  </div>
                  <p className="text-gray-700 mb-4 flex-grow">
                    They hit the ground at the same time! In a vacuum, there's no air resistance, so all objects accelerate at the same rate regardless of mass.
                  </p>
                  <div className="flex justify-between items-center">
                    <button 
                      className="px-3 py-1 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 transition-colors flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleActivityAnswer();
                      }}
                    >
                      <span>Show Question</span>
                      <ChevronLeft className="w-4 h-4 ml-1" />
                    </button>
                    <div className="flex items-center text-purple-600">
                      <Sparkles className="w-4 h-4 mr-1 text-yellow-500" />
                      <span>Great job!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Game Reward */}
          {gameUnlocked && (
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl shadow-sm border border-yellow-200 p-6 animate-bounce">
              <div className="flex items-center mb-3">
                <FaGamepad className="w-6 h-6 mr-2 text-yellow-600" />
                <h3 className="font-bold text-gray-800">Game Unlocked!</h3>
              </div>
              <p className="text-gray-700 mb-4">You've earned 15 minutes of educational game time for completing your goal!</p>
              <button className="w-full px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-lg hover:from-yellow-600 hover:to-amber-600 transition-all flex items-center justify-center">
                <FaGamepad className="w-5 h-5 mr-2" />
                Play Science Adventure
              </button>
            </div>
          )}

          {/* Announcements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center mb-6">
              <Megaphone className="w-6 h-6 mr-2 text-red-600" />
              Announcements
            </h2>
            
            <div className="space-y-4">
              {dashboardData.announcements
                .filter(notice => !dismissedNotices.includes(notice.id))
                .map(notice => (
                  <div key={notice.id} className="p-4 bg-red-50 rounded-lg border border-red-100 relative">
                    <button 
                      onClick={() => dismissNotice(notice.id)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <h3 className="font-medium text-gray-900 mb-1 flex items-center">
                      <Flag className="w-4 h-4 mr-2 text-red-600" />
                      {notice.title}
                    </h3>
                    <div className="text-xs text-gray-500 mb-2 ml-6">{formatDate(notice.date)}</div>
                    <p className="text-sm text-gray-700 ml-6">{notice.content}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* Motivational Quote - Show in the morning */}
          {isMorning && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-6">
              <div className="flex items-start">
                <FaEarlybirds className="w-12 h-12 text-indigo-500 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Morning Inspiration</h3>
                  <p className="text-gray-700 italic mb-2">"Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing."</p>
                  <p className="text-sm text-gray-500">— Pelé</p>
                </div>
              </div>
            </div>
          )}

          {/* Fun Facts - Show in the afternoon */}
          {isAfternoon && (
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl shadow-sm border border-amber-200 p-6">
              <div className="flex items-center mb-3">
                <Lightbulb className="w-5 h-5 mr-2 text-amber-600" />
                <h3 className="font-medium text-gray-800">Afternoon Did You Know?</h3>
              </div>
              <p className="text-gray-700">{funFacts[currentFactIndex]}</p>
            </div>
          )}

          {/* Quick Resources */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4">
              <BookText className="w-6 h-6 mr-2 text-green-600" />
              Quick Resources
            </h2>
            
            <div className="space-y-3">
              {dashboardData.resources.map(resource => (
                <div key={resource.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors flex items-center">
                  {resource.type === 'PDF' ? (
                    <BookText className="w-5 h-5 mr-3 text-red-500" />
                  ) : (
                    <BookOpen className="w-5 h-5 mr-3 text-blue-500" />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{resource.name}</h4>
                    <div className="text-xs text-gray-500">{resource.subject}</div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/30  flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md animate-fade-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Set New Goal</h3>
                <button 
                  onClick={() => setShowGoalModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={submitNewGoal}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Goal Title</label>
                    <input
                      type="text"
                      name="title"
                      value={newGoal.title}
                      onChange={handleGoalInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="What do you want to achieve?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={newGoal.description}
                      onChange={handleGoalInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      rows="3"
                      placeholder="Add details about your goal..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                      <input
                        type="date"
                        name="dueDate"
                        value={newGoal.dueDate}
                        onChange={handleGoalInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <select
                        name="priority"
                        value={newGoal.priority}
                        onChange={handleGoalInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowGoalModal(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition-all shadow-sm hover:shadow-md"
                    >
                      Save Goal
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;