import { useState, useEffect, useRef } from 'react';
import { 
  Clock, Bookmark, Check, X, Settings, Play, Pause, 
  SkipForward, Volume2, VolumeX, BookOpen, Target, 
  Edit, Save, Trash2, ChevronDown, ChevronUp, 
  Calendar, CheckCircle, Leaf, ChevronRight, XCircle, Plus, History,
  Music, Moon, Sun, Coffee, Zap, Sparkles, Heart, Star, Palette,
  Flower, Droplets, Mountain, Cloud, Sunset, Sunrise, Award, Trophy,
  Smile, Frown, Meh, Laugh, Gauge, Rocket, Lightbulb, BrainCircuit,
  Atom, FlaskConical, Calculator, Shapes, Gift, PlusCircle, Clock3,
  AlarmClock, Notebook, PenTool, Feather, Gem, Wand2, Paintbrush
} from 'lucide-react';
import { FaBrain, FaLeaf, FaWater, FaFire, FaRegSnowflake, FaAtom, FaFlask } from 'react-icons/fa';
import { GiMeditation, GiCampfire, GiSpotedFlower, GiNightSleep, GiChemicalDrop, GiSpermWhale } from 'react-icons/gi';
import { IoMdTime, IoMdSchool } from 'react-icons/io';
import { RiRainbowLine, RiMentalHealthLine } from 'react-icons/ri';
import { FaCalculator } from 'react-icons/fa';
import Confetti from 'react-confetti';
import { Howl, Howler } from 'howler';

// Ambient sound files (would need to be imported in a real app)
const soundFiles = {
  rain: '/sounds/rain.mp3',
  forest: '/sounds/forest.mp3',
  coffee: '/sounds/coffee-shop.mp3',
  fire: '/sounds/fireplace.mp3',
  waves: '/sounds/ocean-waves.mp3',
  birds: '/sounds/morning-birds.mp3',
  space: '/sounds/space-ambient.mp3',
  underwater: '/sounds/underwater.mp3',
  silence: null
};

const WeeklyReflection = () => {
  // Session states
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [showMoodSettings, setShowMoodSettings] = useState(false);
  const [endedEarly, setEndedEarly] = useState(false);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [currentEncouragement, setCurrentEncouragement] = useState('');
  const [showExtendSession, setShowExtendSession] = useState(false);
  
  // Session details
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [objective, setObjective] = useState('');
  const [duration, setDuration] = useState(25);
  const [customDuration, setCustomDuration] = useState('');
  const [useCustomDuration, setUseCustomDuration] = useState(false);
  const [notes, setNotes] = useState('');
  const [objectiveAchieved, setObjectiveAchieved] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [points, setPoints] = useState(0);
  const [showPointsEarned, setShowPointsEarned] = useState(0);
  const [currentMood, setCurrentMood] = useState('');
  
  // Enhanced Mood settings
  const [moodSettings, setMoodSettings] = useState({
    theme: 'serene',
    colorScheme: 'purple',
    sound: 'rain',
    volume: 0.5,
    mascot: 'default',
    animation: 'pulse',
    particleEffects: true,
    darkMode: false
  });

  const [ambientSound, setAmbientSound] = useState(null);
  const timerRef = useRef(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [sessions, setSessions] = useState([]);
  const [showSubjectThemes, setShowSubjectThemes] = useState(false);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(5 * 60);
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [showSessionStats, setShowSessionStats] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [quickStartSubjects] = useState([
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 
    'Programming', 'Design', 'Writing', 'Research'
  ]);

  // Encouragement messages for STEM subjects
  const encouragementMessages = {
    mathematics: [
      "Math is tough, but so are you! Every problem solved makes you stronger.",
      "Remember: Even Einstein struggled with math at first. Keep going!",
      "You're building problem-solving superpowers with every equation!",
      "Math is like a puzzle - it's okay if it takes time to see the full picture.",
      "That complex problem is just several simple steps combined. Break it down!",
      "Mistakes are proof you're trying. Each one brings you closer to mastery."
    ],
    physics: [
      "Physics explains the universe - and you're learning its language!",
      "Every great physicist started where you are now. Keep experimenting!",
      "The laws of physics apply to everyone - even Newton had to learn them!",
      "You're uncovering the secrets of how the world works - how cool is that?",
      "Think like a proton - always positive!",
      "Physics is about understanding the 'why' behind everything. Stay curious!"
    ],
    chemistry: [
      "Chemistry is like magic, but real! You're becoming a science wizard.",
      "Every reaction takes time - just like your learning process!",
      "Mendeleev didn't create the periodic table in a day. Keep mixing knowledge!",
      "Atoms are tiny, but your potential is enormous!",
      "You're literally made of stardust learning about stardust. How amazing is that?",
      "Chemical bonds take energy to form - just like your knowledge connections!"
    ],
    biology: [
      "You're learning the code of life itself - that's amazing!",
      "Every living thing started small and grew - just like your knowledge!",
      "Biology shows us how incredible life is - and you're part of that story!",
      "Your brain is learning about itself - how meta is that?",
      "Nature's complexity is beautiful - and you're understanding it piece by piece!",
      "From cells to ecosystems, you're seeing the connections. Keep going!"
    ],
    programming: [
      "Every programmer was once a beginner. You're on the right path!",
      "Debugging is like being a detective - you'll solve the mystery!",
      "The computer only does what you tell it. Be patient with yourself!",
      "Every error message is a clue, not a criticism.",
      "Complex systems are built one line at a time. Keep coding!",
      "You're learning to speak the language of the future. How exciting!"
    ],
    default: [
      "Your brain grows stronger every time you learn something new!",
      "Struggle means you're challenging yourself - that's where growth happens!",
      "You're building knowledge brick by brick - keep stacking!",
      "Every expert was once a beginner. You're on your way!",
      "The more you practice, the more your brain changes. Keep going!",
      "Learning is a journey. Enjoy each step along the way!"
    ]
  };

  // Timer logic
  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
        
        // Show random encouragement for challenging subjects
        if (['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Programming'].includes(subject) && 
            Math.random() < 0.002 && !showEncouragement) {
          showRandomEncouragement();
        }
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleSessionComplete();
    }
    
    return () => clearInterval(timerRef.current);
  }, [isActive, isPaused, timeLeft, subject, showEncouragement]);

  // Break timer logic
  useEffect(() => {
    if (isBreakActive && breakTimeLeft > 0) {
      const breakTimer = setInterval(() => {
        setBreakTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(breakTimer);
    } else if (breakTimeLeft === 0 && isBreakActive) {
      endBreak();
    }
  }, [isBreakActive, breakTimeLeft]);

  // Handle window resize for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle ambient sound
  useEffect(() => {
    if (isActive && moodSettings.sound !== 'silence') {
      const sound = new Howl({
        src: [soundFiles[moodSettings.sound]],
        loop: true,
        volume: moodSettings.volume
      });
      sound.play();
      setAmbientSound(sound);

      return () => {
        sound.stop();
        setAmbientSound(null);
      };
    }
  }, [isActive, moodSettings.sound, moodSettings.volume]);

  const showRandomEncouragement = () => {
    const subjectKey = subject.toLowerCase();
    const messages = encouragementMessages[subjectKey] || encouragementMessages.default;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    setCurrentEncouragement(randomMessage);
    setShowEncouragement(true);
    
    setTimeout(() => {
      setShowEncouragement(false);
    }, 10000); // Increased display time to 10 seconds
  };

  const startSession = () => {
    if (!subject || !topic || !objective) return;
    
    // Use custom duration if selected and valid
    const sessionDuration = useCustomDuration && customDuration > 0 ? 
      parseInt(customDuration) : duration;
      
    setTimeLeft(sessionDuration * 60);
    setIsActive(true);
    setIsPaused(false);
    setSessionComplete(false);
    setEndedEarly(false);
    setShowEncouragement(false);
    
    // Apply subject-specific theme if available
    applySubjectTheme();
  };

  const applySubjectTheme = () => {
    const subjectThemes = {
      'Mathematics': { theme: 'space', colorScheme: 'indigo', sound: 'space', mascot: 'calculator' },
      'Physics': { theme: 'cosmic', colorScheme: 'purple', sound: 'space', mascot: 'atom' },
      'Chemistry': { theme: 'lab', colorScheme: 'green', sound: 'underwater', mascot: 'flask' },
      'Biology': { theme: 'nature', colorScheme: 'green', sound: 'forest', mascot: 'leaf' },
      'Programming': { theme: 'galaxy', colorScheme: 'blue', sound: 'space', mascot: 'brain' },
      'Design': { theme: 'rainbow', colorScheme: 'pink', sound: 'coffee', mascot: 'sparkle' }
    };
    
    if (subjectThemes[subject]) {
      setMoodSettings(prev => ({
        ...prev,
        ...subjectThemes[subject]
      }));
    }
  };

  const pauseSession = () => {
    setIsPaused(!isPaused);
    if (ambientSound) {
      isPaused ? ambientSound.play() : ambientSound.pause();
    }
  };

  const endSessionEarly = () => {
    clearInterval(timerRef.current);
    setIsActive(false);
    setSessionComplete(true);
    setEndedEarly(true);
    if (ambientSound) {
      ambientSound.stop();
      setAmbientSound(null);
    }
  };

  const extendSession = (minutes) => {
    setTimeLeft(prev => prev + (minutes * 60));
    setShowExtendSession(false);
    
    // Award points for extending
    const extensionPoints = minutes * 2;
    setPoints(prev => prev + extensionPoints);
    setShowPointsEarned(extensionPoints);
    
    setTimeout(() => {
      setShowPointsEarned(0);
    }, 3000);
  };

  const startBreak = (minutes) => {
    setBreakTimeLeft(minutes * 60);
    setIsBreakActive(true);
    setIsActive(false);
    setShowBreakModal(false);
    
    // Change theme for break time
    setMoodSettings(prev => ({
      ...prev,
      theme: 'sunset',
      sound: 'birds',
      colorScheme: 'orange'
    }));
  };

  const endBreak = () => {
    setIsBreakActive(false);
    setBreakTimeLeft(5 * 60);
    
    // Restore previous theme
    applySubjectTheme();
  };

  const handleSessionComplete = () => {
    clearInterval(timerRef.current);
    setIsActive(false);
    setSessionComplete(true);
    setEndedEarly(false);
    setShowConfetti(true);
    setShowBreakModal(true); // Suggest taking a break
    
    // Calculate points earned
    const basePoints = (useCustomDuration && customDuration > 0 ? parseInt(customDuration) : duration) * 2;
    const bonusPoints = objectiveAchieved ? basePoints * 0.5 : 0;
    const totalPoints = basePoints + bonusPoints;
    
    setPoints(prev => prev + totalPoints);
    setShowPointsEarned(totalPoints);
    setStreakCount(prev => prev + 1);
    
    if (ambientSound) {
      ambientSound.stop();
      setAmbientSound(null);
    }
    
    if (moodSettings.volume > 0) {
      const completionSound = new Howl({
        src: ['/sounds/completion-chime.mp3'],
        volume: moodSettings.volume
      });
      completionSound.play();
    }
    
    setTimeout(() => {
      setShowConfetti(false);
      setShowPointsEarned(0);
    }, 5000);
  };

  const saveSession = () => {
    const newSession = {
      id: Date.now(),
      date: new Date().toISOString(),
      subject,
      topic,
      objective,
      duration: (useCustomDuration && customDuration > 0 ? parseInt(customDuration) : duration) * 60 - timeLeft,
      notes,
      objectiveAchieved,
      endedEarly,
      mood: currentMood,
      moodSettings: {...moodSettings}
    };
    
    setSessions([newSession, ...sessions]);
    resetSession();
  };

  const resetSession = () => {
    setTopic('');
    setObjective('');
    setNotes('');
    setObjectiveAchieved(false);
    setSessionComplete(false);
    setUseCustomDuration(false);
    setCustomDuration('');
    setEndedEarly(false);
    setCurrentMood('');
  };

  const quickStartSession = (subject) => {
    setSubject(subject);
    setTopic('Quick Start Session');
    setObjective('Complete focused work on ' + subject);
    setDuration(25);
    setUseCustomDuration(false);
    setCustomDuration('');
    startSession();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  // Enhanced theme system with better contrast and more options
  const getThemeClass = () => {
    const colorSchemes = {
      purple: 'from-purple-600 to-indigo-600',
      blue: 'from-blue-600 to-cyan-600',
      green: 'from-green-600 to-teal-600',
      pink: 'from-pink-600 to-rose-600',
      orange: 'from-orange-600 to-amber-600',
      yellow: 'from-yellow-500 to-amber-500',
      red: 'from-red-600 to-pink-600',
      indigo: 'from-indigo-600 to-violet-600',
      teal: 'from-teal-500 to-emerald-500',
      cyan: 'from-cyan-500 to-sky-500'
    };

    const themes = {
      serene: `bg-gradient-to-br ${colorSchemes[moodSettings.colorScheme]} text-white`,
      nature: 'bg-gradient-to-br from-green-100 to-teal-100 text-green-900',
      ocean: 'bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-900',
      fire: 'bg-gradient-to-br from-orange-100 to-amber-100 text-orange-900',
      cosmic: 'bg-gradient-to-br from-indigo-900 to-purple-900 text-white',
      sunrise: 'bg-gradient-to-br from-yellow-100 to-pink-100 text-orange-900',
      sunset: 'bg-gradient-to-br from-orange-200 to-purple-300 text-purple-900',
      princess: 'bg-gradient-to-br from-pink-200 to-purple-200 text-pink-900',
      galaxy: 'bg-gradient-to-br from-indigo-900 to-black text-white',
      forest: 'bg-gradient-to-br from-green-800 to-emerald-900 text-white',
      winter: 'bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-900',
      rainbow: 'bg-gradient-to-br from-red-400 via-yellow-400 to-blue-400 text-white',
      space: 'bg-gradient-to-br from-gray-900 to-blue-900 text-white',
      autumn: 'bg-gradient-to-br from-amber-500 to-red-500 text-white',
      summer: 'bg-gradient-to-br from-yellow-300 to-orange-400 text-white',
      spring: 'bg-gradient-to-br from-green-300 to-pink-300 text-white',
      lab: 'bg-gradient-to-br from-green-100 to-blue-100 text-green-900',
      underwater: 'bg-gradient-to-br from-blue-200 to-teal-200 text-blue-900',
      candy: 'bg-gradient-to-br from-pink-300 to-purple-300 text-white',
      dinosaur: 'bg-gradient-to-br from-green-300 to-yellow-300 text-green-900',
      unicorn: 'bg-gradient-to-br from-purple-200 to-pink-200 text-purple-900',
      robot: 'bg-gradient-to-br from-gray-300 to-blue-300 text-gray-900',
      jungle: 'bg-gradient-to-br from-green-600 to-yellow-600 text-white',
      desert: 'bg-gradient-to-br from-yellow-200 to-orange-200 text-orange-900',
      arctic: 'bg-gradient-to-br from-blue-100 to-white text-blue-900',
      safari: 'bg-gradient-to-br from-yellow-500 to-brown-500 text-white',
      superhero: 'bg-gradient-to-br from-red-500 to-blue-500 text-white'
    };

    return themes[moodSettings.theme] || themes.serene;
  };

  // Get button style based on theme
  const getButtonStyle = () => {
    const darkThemes = ['cosmic', 'galaxy', 'space', 'forest', 'jungle'];
    if (darkThemes.includes(moodSettings.theme)) {
      return 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white';
    }
    return 'bg-white bg-opacity-20 hover:bg-opacity-30 text-gray-800';
  };

  // Get mascot icon based on setting
  const getMascotIcon = () => {
    switch(moodSettings.mascot) {
      case 'default': return <Zap className="w-6 h-6 text-yellow-400" />;
      case 'sparkle': return <Sparkles className="w-6 h-6 text-yellow-400" />;
      case 'heart': return <Heart className="w-6 h-6 text-pink-500" />;
      case 'star': return <Star className="w-6 h-6 text-yellow-400" />;
      case 'flower': return <Flower className="w-6 h-6 text-green-500" />;
      case 'moon': return <Moon className="w-6 h-6 text-indigo-400" />;
      case 'calculator': return <Calculator className="w-6 h-6 text-blue-500" />;
      case 'atom': return <FaAtom className="w-6 h-6 text-purple-500" />;
      case 'flask': return <FaFlask className="w-6 h-6 text-green-500" />;
      case 'leaf': return <FaLeaf className="w-6 h-6 text-green-500" />;
      case 'rocket': return <Rocket className="w-6 h-6 text-red-500" />;
      case 'brain': return <BrainCircuit className="w-6 h-6 text-indigo-500" />;
      default: return <Zap className="w-6 h-6 text-yellow-400" />;
    }
  };

  // Get mascot animation
  const getMascotAnimation = () => {
    switch(moodSettings.animation) {
      case 'pulse': return 'animate-pulse';
      case 'bounce': return 'animate-bounce';
      case 'spin': return 'animate-spin';
      case 'ping': return 'animate-ping';
      case 'wiggle': return 'animate-wiggle';
      default: return 'animate-pulse';
    }
  };

  // Get subject icon
  const getSubjectIcon = (subjectName) => {
    switch(subjectName) {
      case 'Mathematics': return <FaCalculator className="w-5 h-5 mr-2" />;
      case 'Physics': return <Atom className="w-5 h-5 mr-2" />;
      case 'Chemistry': return <FlaskConical className="w-5 h-5 mr-2" />;
      case 'Biology': return <GiSpotedFlower className="w-5 h-5 mr-2" />;
      case 'English': return <BookOpen className="w-5 h-5 mr-2" />;
      case 'History': return <Calendar className="w-5 h-5 mr-2" />;
      case 'Programming': return <BrainCircuit className="w-5 h-5 mr-2" />;
      case 'Design': return <PenTool className="w-5 h-5 mr-2" />;
      default: return <IoMdSchool className="w-5 h-5 mr-2" />;
    }
  };

  // Calculate session statistics
  const calculateStats = () => {
    const totalSessions = sessions.length;
    const totalTime = sessions.reduce((sum, session) => sum + session.duration, 0);
    const completedObjectives = sessions.filter(s => s.objectiveAchieved).length;
    const favoriteSubject = sessions.length > 0 
      ? sessions.reduce((acc, session) => {
          acc[session.subject] = (acc[session.subject] || 0) + 1;
          return acc;
        }, {})
      : null;
    
    return {
      totalSessions,
      totalTime: formatTime(totalTime),
      completionRate: totalSessions > 0 ? Math.round((completedObjectives / totalSessions) * 100) : 0,
      favoriteSubject: favoriteSubject 
        ? Object.entries(favoriteSubject).sort((a, b) => b[1] - a[1])[0][0] 
        : 'None yet',
      pointsEarned: points
    };
  };

  const stats = calculateStats();

  return (
    <div className={`max-w-6xl mx-auto p-4 md:p-6 ${moodSettings.darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50'}`}>
      {/* Header with points and streak - Made more responsive */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg p-4 md:p-6 mb-6 text-white relative overflow-hidden">
        {moodSettings.particleEffects && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-white bg-opacity-20 animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                  animationDuration: `${Math.random() * 10 + 10}s`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}
          </div>
        )}
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
            <div className="flex flex-col sm:mb-0">
              <div className="flex items-center mb-2">
                <Zap className="w-8 h-8 mr-3" />
                <h1 className="text-3xl font-bold">Focus Session Tracker</h1>
              </div>
              <p className="text-purple-100 sm:mt-0 mt-2">
                Maximize your productivity with timed focus sessions and reflection tracking
              </p>
            </div>

            <div className="flex space-x-4 mt-4 sm:mt-0">
              <div className="bg-yellow-500 bg-opacity-20 px-3 py-1 rounded-full flex items-center">
                <Trophy className="text-white w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Streak: {streakCount}</span>
              </div>
              <div className="bg-yellow-500 bg-opacity-20 px-3 py-1 rounded-full flex items-center">
                <Star className="text-white w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Points: {points}</span>
              </div>
            </div>
          </div>
          
          {showPointsEarned > 0 && (
            <div className="absolute right-4 md:right-6 top-4 md:top-6 bg-yellow-400 text-yellow-900 px-2 py-1 md:px-3 md:py-1 rounded-full animate-bounce flex items-center text-sm md:text-base">
              <span className="font-bold">+{showPointsEarned} pts!</span>
            </div>
          )}
        </div>
      </div>
      
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      
      {/* Quick Start Modal */}
      {showQuickStart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Quick Start Session</h2>
              <button onClick={() => setShowQuickStart(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="mb-4">Start a focus session instantly with these common subjects:</p>
            <div className="grid grid-cols-2 gap-3">
              {quickStartSubjects.map(subject => (
                <button
                  key={subject}
                  onClick={() => {
                    quickStartSession(subject);
                    setShowQuickStart(false);
                  }}
                  className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors"
                >
                  {getSubjectIcon(subject)}
                  <span>{subject}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Break Modal */}
      {showBreakModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Take a Break</h2>
              <button onClick={() => setShowBreakModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="mb-4">Great job completing your session! Taking breaks improves retention and prevents burnout.</p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => startBreak(5)} 
                className="p-3 bg-green-100 hover:bg-green-200 rounded-lg flex flex-col items-center"
              >
                <Coffee className="w-6 h-6 mb-1" />
                <span>Short Break (5 min)</span>
              </button>
              <button 
                onClick={() => startBreak(15)} 
                className="p-3 bg-blue-100 hover:bg-blue-200 rounded-lg flex flex-col items-center"
              >
                <Leaf className="w-6 h-6 mb-1" />
                <span>Long Break (15 min)</span>
              </button>
            </div>
            <button 
              onClick={() => setShowBreakModal(false)} 
              className="mt-4 w-full p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Skip Break
            </button>
          </div>
        </div>
      )}
      
      {/* Active Break */}
      {isBreakActive && (
        <div className="bg-gradient-to-br from-orange-200 to-purple-300 rounded-xl shadow-lg p-6 mb-6 text-purple-900">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Leaf className="w-12 h-12 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Break Time</h2>
            <p className="text-lg mb-6">Step away from your work and relax for a bit</p>
            <div className="text-4xl font-bold mb-6">{formatTime(breakTimeLeft)}</div>
            <button
              onClick={endBreak}
              className="px-6 py-2 bg-white bg-opacity-30 hover:bg-opacity-40 rounded-lg transition-colors"
            >
              End Break Early
            </button>
          </div>
        </div>
      )}
      
      {/* Session History */}
      <div className={`rounded-xl shadow-lg p-4 md:p-6 mb-6 ${moodSettings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
          <h2 className="text-xl font-bold flex items-center">
            <History className="w-5 h-5 mr-2" />
            Your Focus History
          </h2>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowSessionStats(!showSessionStats)}
              className="text-sm flex items-center px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded-full"
            >
              <Gauge className="w-4 h-4 mr-1" />
              {showSessionStats ? 'Hide Stats' : 'Show Stats'}
            </button>
            <button 
              onClick={() => setShowQuickStart(true)}
              className="text-sm flex items-center px-3 py-1 bg-green-100 hover:bg-green-200 rounded-full"
            >
              <Zap className="w-4 h-4 mr-1" />
              Quick Start
            </button>
          </div>
        </div>
        
        {showSessionStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-600 mb-1">Total Sessions</div>
              <div className="text-2xl font-bold">{stats.totalSessions}</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600 mb-1">Total Time</div>
              <div className="text-2xl font-bold">{stats.totalTime}</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-sm text-purple-600 mb-1">Completion Rate</div>
              <div className="text-2xl font-bold">{stats.completionRate}%</div>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <div className="text-sm text-amber-600 mb-1">Favorite Subject</div>
              <div className="text-2xl font-bold">{stats.favoriteSubject}</div>
            </div>
          </div>
        )}
        
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {sessions.length === 0 ? (
            <div className="text-center py-8">
              <IoMdTime className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">No sessions recorded yet</h3>
              <p className="text-gray-400">Complete a focus session to see it here</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div key={session.id} className={`p-4 rounded-lg border ${moodSettings.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} hover:shadow-sm transition-all`}>
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 gap-2">
                  <div className="flex-1">
                    <h3 className="font-medium flex items-center">
                      {getSubjectIcon(session.subject)}
                      {session.subject}: {session.topic}
                    </h3>
                    <div className="text-xs text-gray-500 mt-1 ml-6">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {new Date(session.date).toLocaleString()}
                      <span className="mx-2">•</span>
                      <IoMdTime className="w-3 h-3 inline mr-1" />
                      {formatTime(session.duration)}
                      {session.endedEarly && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="text-orange-500">Ended Early</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    session.objectiveAchieved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {session.objectiveAchieved ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <XCircle className="w-3 h-3 mr-1" />
                    )}
                    {session.objectiveAchieved ? 'Achieved' : 'Not Met'}
                  </div>
                </div>
                
                <div className="ml-6 mb-2">
                  <div className="flex items-center text-sm">
                    <Target className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{session.objective}</span>
                  </div>
                  {session.notes && (
                    <div className="flex items-start text-sm mt-2">
                      <Edit className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{session.notes}</span>
                    </div>
                  )}
                  {session.mood && (
                    <div className="flex items-center text-sm mt-2">
                      {session.mood === 'Still Tough' && <Frown className="w-4 h-4 mr-2 text-red-500" />}
                      {session.mood === 'Getting There' && <Meh className="w-4 h-4 mr-2 text-yellow-500" />}
                      {session.mood === 'More Confident' && <Smile className="w-4 h-4 mr-2 text-green-500" />}
                      {session.mood === 'I Got This!' && <Laugh className="w-4 h-4 mr-2 text-blue-500" />}
                      <span>Felt: {session.mood}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Session Setup */}
      {!isActive && !sessionComplete && !isBreakActive && (
        <div className={`rounded-xl shadow-lg p-4 md:p-6 mb-6 ${moodSettings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center">
            <Zap className="w-5 h-5 md:w-6 md:h-6 mr-2 text-yellow-500" />
            Plan Your Focus Session
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Subject
                </label>
                <div className="flex gap-2">
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      moodSettings.darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="English">English</option>
                    <option value="History">History</option>
                    <option value="Programming">Programming</option>
                    <option value="Design">Design</option>
                    <option value="Business">Business</option>
                  </select>
                  <button 
                    onClick={() => setShowSubjectThemes(!showSubjectThemes)}
                    className={`px-3 rounded-md transition-colors text-sm ${
                      moodSettings.darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {showSubjectThemes ? 'Hide' : 'Themes'}
                  </button>
                </div>
                
                {showSubjectThemes && (
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        setMoodSettings({
                          ...moodSettings,
                          theme: 'space',
                          colorScheme: 'indigo',
                          sound: 'space',
                          mascot: 'calculator'
                        });
                        setSubject('Mathematics');
                      }}
                      className="p-2 bg-indigo-50 rounded-md text-indigo-800 text-xs md:text-sm flex items-center"
                    >
                      <FaCalculator className="w-3 h-3 md:w-4 md:h-4 mr-1" /> Math
                    </button>
                    <button
                      onClick={() => {
                        setMoodSettings({
                          ...moodSettings,
                          theme: 'cosmic',
                          colorScheme: 'purple',
                          sound: 'space',
                          mascot: 'atom'
                        });
                        setSubject('Physics');
                      }}
                      className="p-2 bg-purple-50 rounded-md text-purple-800 text-xs md:text-sm flex items-center"
                    >
                      <Atom className="w-3 h-3 md:w-4 md:h-4 mr-1" /> Physics
                    </button>
                    <button
                      onClick={() => {
                        setMoodSettings({
                          ...moodSettings,
                          theme: 'lab',
                          colorScheme: 'green',
                          sound: 'underwater',
                          mascot: 'flask'
                        });
                        setSubject('Chemistry');
                      }}
                      className="p-2 bg-green-50 rounded-md text-green-800 text-xs md:text-sm flex items-center"
                    >
                      <FlaskConical className="w-3 h-3 md:w-4 md:h-4 mr-1" /> Chemistry
                    </button>
                    <button
                      onClick={() => {
                        setMoodSettings({
                          ...moodSettings,
                          theme: 'nature',
                          colorScheme: 'green',
                          sound: 'forest',
                          mascot: 'leaf'
                        });
                        setSubject('Biology');
                      }}
                      className="p-2 bg-teal-50 rounded-md text-teal-800 text-xs md:text-sm flex items-center"
                    >
                      <GiSpotedFlower className="w-3 h-3 md:w-4 md:h-4 mr-1" /> Biology
                    </button>
                    <button
                      onClick={() => {
                        setMoodSettings({
                          ...moodSettings,
                          theme: 'serene',
                          colorScheme: 'blue',
                          sound: 'coffee',
                          mascot: 'default'
                        });
                        setSubject('English');
                      }}
                      className="p-2 bg-blue-50 rounded-md text-blue-800 text-xs md:text-sm flex items-center"
                    >
                      <BookOpen className="w-3 h-3 md:w-4 md:h-4 mr-1" /> English
                    </button>
                    <button
                      onClick={() => {
                        setMoodSettings({
                          ...moodSettings,
                          theme: 'autumn',
                          colorScheme: 'orange',
                          sound: 'fire',
                          mascot: 'default'
                        });
                        setSubject('History');
                      }}
                      className="p-2 bg-amber-50 rounded-md text-amber-800 text-xs md:text-sm flex items-center"
                    >
                      <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1" /> History
                    </button>
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 flex items-center">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Topic
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    moodSettings.darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
                  }`}
                  placeholder="What will you focus on?"
                  required
                />
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Objective
                </label>
                <textarea
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    moodSettings.darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
                  }`}
                  rows="2"
                  placeholder="What do you want to achieve?"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Duration (minutes)
                </label>
                <div className="flex gap-2">
                  <select
                    value={useCustomDuration ? '' : duration}
                    onChange={(e) => {
                      setDuration(Number(e.target.value));
                      setUseCustomDuration(false);
                    }}
                    disabled={useCustomDuration}
                    className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      useCustomDuration ? 'bg-gray-100 text-gray-400' : moodSettings.darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
                    }`}
                  >
                    <option value="15">15 minutes</option>
                    <option value="25">25 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                  </select>
                  <span className="flex items-center">or</span>
                  <input
                    type="number"
                    min="1"
                    max="240"
                    value={useCustomDuration ? customDuration : ''}
                    onChange={(e) => {
                      setCustomDuration(e.target.value);
                      setUseCustomDuration(true);
                    }}
                    placeholder="Custom"
                    className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      moodSettings.darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-6 gap-3">
            <button
              onClick={() => setShowMoodSettings(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 rounded-lg hover:from-purple-200 hover:to-indigo-200 transition-colors flex items-center justify-center"
            >
              <Palette className="w-4 h-4 mr-2" />
              Customize Environment
            </button>
            
            <button
              onClick={startSession}
              className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
              disabled={!subject || !topic || !objective || (useCustomDuration && !customDuration)}
            >
              <Play className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Start Focus Session
            </button>
          </div>
        </div>
      )}
      
      {/* Active Session */}
      {isActive && (
        <div className={`${getThemeClass()} rounded-xl shadow-lg p-4 md:p-6 mb-6 transition-all duration-500 relative overflow-hidden`}>
          {moodSettings.particleEffects && (
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(30)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute rounded-full bg-white bg-opacity-20 animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${Math.random() * 10 + 5}px`,
                    height: `${Math.random() * 10 + 5}px`,
                    animationDuration: `${Math.random() * 10 + 10}s`,
                    animationDelay: `${Math.random() * 5}s`
                  }}
                />
              ))}
            </div>
          )}
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 gap-3">
              <h2 className="text-xl font-bold flex items-center">
                <span className={`inline-block mr-2 ${getMascotAnimation()}`}>
                  {getMascotIcon()}
                </span>
                Focus Session Active
              </h2>
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="bg-white bg-opacity-20 px-2 py-1 md:px-3 md:py-1 rounded-full text-sm">
                  {formatTime(timeLeft)}
                </div>
                <button
                  onClick={() => setShowMoodSettings(true)}
                  className={`p-2 rounded-full ${getButtonStyle()} transition-colors`}
                >
                  <Settings className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
            
            {showEncouragement && (
              <div className="mb-4 p-3 bg-white bg-opacity-20 rounded-lg animate-fade-in">
                <div className="flex items-start">
                  <Lightbulb className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" />
                  <p className="text-sm">{currentEncouragement}</p>
                </div>
              </div>
            )}
            
            <div className="flex flex-col items-center justify-center py-4 md:py-8">
              <div className="relative w-48 h-48 md:w-64 md:h-64 mb-6 md:mb-8">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-white text-opacity-20"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-yellow-300"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 - (progressPercentage / 100) * 2 * Math.PI * 40}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl md:text-4xl font-bold">{formatTime(timeLeft)}</span>
                  <span className="text-xs md:text-sm opacity-80 mt-1">remaining</span>
                </div>
              </div>
              
              <div className="text-center mb-6 md:mb-8">
                <h3 className="text-base md:text-lg font-medium mb-1 flex items-center justify-center">
                  {getSubjectIcon(subject)}
                  {subject}: {topic}
                </h3>
                <p className="opacity-90 flex items-center justify-center text-sm md:text-base">
                  <Target className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  {objective}
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
                <button
                  onClick={pauseSession}
                  className={`px-4 py-2 ${getButtonStyle()} rounded-lg flex items-center justify-center transition-colors`}
                >
                  {isPaused ? (
                    <>
                      <Play className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      Pause
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => setShowExtendSession(true)}
                  className={`px-4 py-2 ${getButtonStyle()} rounded-lg flex items-center justify-center transition-colors`}
                >
                  <PlusCircle className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Extend Session
                </button>
                
                <button
                  onClick={endSessionEarly}
                  className={`px-4 py-2 ${getButtonStyle()} rounded-lg flex items-center justify-center transition-colors`}
                >
                  <SkipForward className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  End Early
                </button>
              </div>
            </div>
          </div>
          
          {/* Extend Session Modal */}
          {showExtendSession && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-10">
              <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Extend Session</h3>
                  <button onClick={() => setShowExtendSession(false)} className="text-gray-500 hover:text-gray-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="mb-4">Add more time to your current session:</p>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => extendSession(5)} 
                    className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                  >
                    +5 minutes
                  </button>
                  <button 
                    onClick={() => extendSession(10)} 
                    className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                  >
                    +10 minutes
                  </button>
                  <button 
                    onClick={() => extendSession(15)} 
                    className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                  >
                    +15 minutes
                  </button>
                  <button 
                    onClick={() => extendSession(25)} 
                    className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                  >
                    +25 minutes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Session Complete */}
      {sessionComplete && (
        <div className={`rounded-xl shadow-lg p-4 md:p-6 mb-6 transition-all duration-500 ${moodSettings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="text-center mb-4 md:mb-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              {endedEarly ? (
                <X className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
              ) : (
                <Check className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
              )}
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">
              {endedEarly ? 'Session Ended Early' : 'Session Complete!'}
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              {endedEarly 
                ? `You focused for ${formatTime((useCustomDuration && customDuration > 0 ? parseInt(customDuration) : duration) * 60 - timeLeft)} before ending early`
                : `Great job! You completed ${formatTime((useCustomDuration && customDuration > 0 ? parseInt(customDuration) : duration) * 60)} of focused work on ${subject}`}
            </p>
            
            {!endedEarly && showPointsEarned > 0 && (
              <div className="mt-3 md:mt-4 bg-yellow-100 inline-flex items-center px-3 py-1 md:px-4 md:py-2 rounded-full">
                <Star className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2 text-yellow-500" />
                <span className="font-medium text-sm md:text-base">You earned {showPointsEarned} points!</span>
              </div>
            )}
          </div>
          
          <div className="mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-medium mb-2 md:mb-3 flex items-center">
              <Target className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-500" />
              Objective: {objective}
            </h3>
            
            <div className="mb-3 md:mb-4">
              <label className="block text-sm font-medium mb-1 md:mb-2 flex items-center">
                <CheckCircle className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Did you achieve your objective?
              </label>
              <div className="flex space-x-2 md:space-x-4">
                <button
                  onClick={() => setObjectiveAchieved(true)}
                  className={`px-3 py-1 md:px-4 md:py-2 rounded-lg flex-1 flex items-center justify-center ${objectiveAchieved ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}
                >
                  <Check className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Yes
                </button>
                <button
                  onClick={() => setObjectiveAchieved(false)}
                  className={`px-3 py-1 md:px-4 md:py-2 rounded-lg flex-1 flex items-center justify-center ${!objectiveAchieved ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'}`}
                >
                  <X className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  No
                </button>
              </div>
            </div>
            
            <div className="mb-3 md:mb-4">
              <label className="block text-sm font-medium mb-1 md:mb-2 flex items-center">
                <Edit className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Reflections
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  moodSettings.darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
                }`}
                rows="3"
                placeholder={endedEarly 
                  ? "What made you end the session early? What can you do differently next time?" 
                  : "What did you learn? Any insights?"}
              />
            </div>
            
            {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Programming'].includes(subject) && (
              <div className="mb-3 md:mb-4 p-3 md:p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-1 md:mb-2 flex items-center text-sm md:text-base">
                  <RiMentalHealthLine className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                  How are you feeling about {subject} now?
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 md:mt-3">
                  <button 
                    onClick={() => setCurrentMood('Still Tough')}
                    className={`flex flex-col items-center p-1 md:p-2 rounded-lg ${currentMood === 'Still Tough' ? 'bg-blue-200' : 'hover:bg-blue-100'}`}
                  >
                    <Frown className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
                    <span className="text-xs mt-1">Still Tough</span>
                  </button>
                  <button 
                    onClick={() => setCurrentMood('Getting There')}
                    className={`flex flex-col items-center p-1 md:p-2 rounded-lg ${currentMood === 'Getting There' ? 'bg-blue-200' : 'hover:bg-blue-100'}`}
                  >
                    <Meh className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
                    <span className="text-xs mt-1">Getting There</span>
                  </button>
                  <button 
                    onClick={() => setCurrentMood('More Confident')}
                    className={`flex flex-col items-center p-1 md:p-2 rounded-lg ${currentMood === 'More Confident' ? 'bg-blue-200' : 'hover:bg-blue-100'}`}
                  >
                    <Smile className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
                    <span className="text-xs mt-1">More Confident</span>
                  </button>
                  <button 
                    onClick={() => setCurrentMood('I Got This!')}
                    className={`flex flex-col items-center p-1 md:p-2 rounded-lg ${currentMood === 'I Got This!' ? 'bg-blue-200' : 'hover:bg-blue-100'}`}
                  >
                    <Laugh className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
                    <span className="text-xs mt-1">I Got This!</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row justify-between gap-2">
            <button
              onClick={resetSession}
              className={`px-3 py-1 md:px-4 md:py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center ${
                moodSettings.darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100'
              }`}
            >
              <Trash2 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Discard
            </button>
            
            <button
              onClick={saveSession}
              className="px-3 py-1 md:px-6 md:py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
            >
              <Save className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Save Session
            </button>
          </div>
        </div>
      )}
      
      {/* Mood Settings Modal */}
      {showMoodSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] p-4 md:p-6 animate-fade-in overflow-y-auto ${
            moodSettings.darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-bold flex items-center">
                <Palette className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Customize Your Environment
              </h2>
              <button
                onClick={() => setShowMoodSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
            
            <div className="space-y-6 md:space-y-8">
              <div>
                <h3 className="text-sm font-medium mb-2 md:mb-3 flex items-center">
                  <Sun className="w-4 h-4 mr-2" />
                  Visual Theme
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                  {[
                    {name: 'Serene', value: 'serene', icon: <Sparkles className="w-5 h-5 md:w-6 md:h-6" />},
                    {name: 'Nature', value: 'nature', icon: <FaLeaf className="w-5 h-5 md:w-6 md:h-6 text-green-500" />},
                    {name: 'Ocean', value: 'ocean', icon: <FaWater className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />},
                    {name: 'Fire', value: 'fire', icon: <FaFire className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />},
                    {name: 'Cosmic', value: 'cosmic', icon: <Moon className="w-5 h-5 md:w-6 md:h-6 text-indigo-500" />},
                    {name: 'Sunrise', value: 'sunrise', icon: <Sunrise className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />},
                    {name: 'Sunset', value: 'sunset', icon: <Sunset className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />},
                    {name: 'Princess', value: 'princess', icon: <Flower className="w-5 h-5 md:w-6 md:h-6 text-pink-500" />},
                    {name: 'Galaxy', value: 'galaxy', icon: <Star className="w-5 h-5 md:w-6 md:h-6 text-purple-500" />},
                    {name: 'Forest', value: 'forest', icon: <GiSpotedFlower className="w-5 h-5 md:w-6 md:h-6 text-green-600" />},
                    {name: 'Winter', value: 'winter', icon: <FaRegSnowflake className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />},
                    {name: 'Rainbow', value: 'rainbow', icon: <RiRainbowLine className="w-5 h-5 md:w-6 md:h-6" />},
                    {name: 'Space', value: 'space', icon: <Moon className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />},
                    {name: 'Autumn', value: 'autumn', icon: <Leaf className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />},
                    {name: 'Summer', value: 'summer', icon: <Sun className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />},
                    {name: 'Spring', value: 'spring', icon: <Flower className="w-5 h-5 md:w-6 md:h-6 text-pink-400" />},
                    {name: 'Underwater', value: 'underwater', icon: <GiSpermWhale className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />},
                    {name: 'Candy', value: 'candy', icon: <Heart className="w-5 h-5 md:w-6 md:h-6 text-pink-400" />},
                    {name: 'Dinosaur', value: 'dinosaur', icon: <Shapes className="w-5 h-5 md:w-6 md:h-6 text-green-500" />},
                    {name: 'Unicorn', value: 'unicorn', icon: <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />},
                    {name: 'Robot', value: 'robot', icon: <BrainCircuit className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />},
                    {name: 'Jungle', value: 'jungle', icon: <FaLeaf className="w-5 h-5 md:w-6 md:h-6 text-green-600" />},
                    {name: 'Lab', value: 'lab', icon: <FlaskConical className="w-5 h-5 md:w-6 md:h-6 text-green-500" />}
                  ].map((theme) => (
                    <button
                      key={theme.value}
                      onClick={() => setMoodSettings({...moodSettings, theme: theme.value})}
                      className={`p-2 md:p-3 rounded-lg flex flex-col items-center transition-all ${
                        moodSettings.theme === theme.value ? 'ring-2 ring-blue-500 bg-blue-50' : 
                        moodSettings.darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <div className="w-5 h-5 md:w-6 md:h-6 mb-1">
                        {theme.icon}
                      </div>
                      <span className="text-xs mt-1">{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2 md:mb-3 flex items-center">
                  <Droplets className="w-4 h-4 mr-2" />
                  Color Scheme
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {['purple', 'blue', 'green', 'pink', 'orange', 'yellow', 'red', 'indigo', 'teal', 'cyan'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setMoodSettings({...moodSettings, colorScheme: color})}
                      className={`p-2 rounded-lg flex flex-col items-center ${
                        moodSettings.colorScheme === color ? 'ring-2 ring-blue-500' : 
                        moodSettings.darkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}
                    >
                      <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br ${
                        color === 'purple' ? 'from-purple-400 to-indigo-500' :
                        color === 'blue' ? 'from-blue-400 to-cyan-500' :
                        color === 'green' ? 'from-green-400 to-teal-500' :
                        color === 'pink' ? 'from-pink-400 to-rose-500' :
                        color === 'orange' ? 'from-orange-400 to-amber-500' :
                        color === 'yellow' ? 'from-yellow-300 to-amber-400' :
                        color === 'red' ? 'from-red-400 to-pink-500' :
                        color === 'indigo' ? 'from-indigo-400 to-violet-500' :
                        color === 'teal' ? 'from-teal-400 to-emerald-500' :
                        'from-cyan-400 to-sky-500'
                      }`} />
                      <span className="text-xs mt-1 capitalize">{color}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2 md:mb-3 flex items-center">
                  <Music className="w-4 h-4 mr-2" />
                  Ambient Sound
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {[
                    {name: 'Rain', value: 'rain', icon: <FaWater className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />},
                    {name: 'Forest', value: 'forest', icon: <GiMeditation className="w-5 h-5 md:w-6 md:h-6 text-green-500" />},
                    {name: 'Coffee Shop', value: 'coffee', icon: <Coffee className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />},
                    {name: 'Fireplace', value: 'fire', icon: <GiCampfire className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />},
                    {name: 'Ocean Waves', value: 'waves', icon: <Droplets className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />},
                    {name: 'Morning Birds', value: 'birds', icon: <GiNightSleep className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />},
                    {name: 'Space', value: 'space', icon: <Moon className="w-5 h-5 md:w-6 md:h-6 text-indigo-400" />},
                    {name: 'Underwater', value: 'underwater', icon: <GiSpermWhale className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />},
                    {name: 'Silence', value: 'silence', icon: <VolumeX className="w-5 h-5 md:w-6 md:h-6 text-gray-500" />}
                  ].map((sound) => (
                    <button
                      key={sound.value}
                      onClick={() => setMoodSettings({...moodSettings, sound: sound.value})}
                      className={`p-2 md:p-3 rounded-lg flex flex-col items-center ${
                        moodSettings.sound === sound.value ? 'ring-2 ring-blue-500 bg-blue-50' : 
                        moodSettings.darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <div className="w-5 h-5 md:w-6 md:h-6 mb-1">
                        {sound.icon}
                      </div>
                      <span className="text-xs mt-1 text-center">{sound.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2 md:mb-3 flex items-center">
                  <Volume2 className="w-4 h-4 mr-2" />
                  Sound Volume
                </h3>
                <div className="flex items-center space-x-2 md:space-x-4">
                  <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={moodSettings.volume}
                    onChange={(e) => setMoodSettings({...moodSettings, volume: parseFloat(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                  <span className="text-sm w-8 md:w-10 text-center">
                    {Math.round(moodSettings.volume * 100)}%
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-2 md:mb-3 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Mascot Style
                  </h3>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {[
                      {name: 'Default', value: 'default', icon: <Zap className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />},
                      {name: 'Sparkle', value: 'sparkle', icon: <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />},
                      {name: 'Heart', value: 'heart', icon: <Heart className="w-4 h-4 md:w-5 md:h-5 text-pink-500" />},
                      {name: 'Star', value: 'star', icon: <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />},
                      {name: 'Flower', value: 'flower', icon: <Flower className="w-4 h-4 md:w-5 md:h-5 text-green-500" />},
                      {name: 'Moon', value: 'moon', icon: <Moon className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" />},
                      {name: 'Calculator', value: 'calculator', icon: <Calculator className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />},
                      {name: 'Atom', value: 'atom', icon: <FaAtom className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />},
                      {name: 'Flask', value: 'flask', icon: <FaFlask className="w-4 h-4 md:w-5 md:h-5 text-green-500" />},
                      {name: 'Leaf', value: 'leaf', icon: <FaLeaf className="w-4 h-4 md:w-5 md:h-5 text-green-500" />},
                      {name: 'Rocket', value: 'rocket', icon: <Rocket className="w-4 h-4 md:w-5 md:h-5 text-red-500" />},
                      {name: 'Brain', value: 'brain', icon: <BrainCircuit className="w-4 h-4 md:w-5 md:h-5 text-indigo-500" />}
                    ].map((mascot) => (
                      <button
                        key={mascot.value}
                        onClick={() => setMoodSettings({...moodSettings, mascot: mascot.value})}
                        className={`p-2 rounded-lg flex flex-col items-center ${
                          moodSettings.mascot === mascot.value ? 'ring-2 ring-blue-500 bg-blue-50' : 
                          moodSettings.darkMode ? 'bg-gray-700' : 'bg-gray-100'
                        }`}
                      >
                        {mascot.icon}
                        <span className="text-xs mt-1">{mascot.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2 md:mb-3 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Animation Style
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {name: 'Pulse', value: 'pulse', icon: <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />},
                      {name: 'Bounce', value: 'bounce', icon: <Heart className="w-4 h-4 md:w-5 md:h-5 text-pink-500" />},
                      {name: 'Spin', value: 'spin', icon: <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />},
                      {name: 'Ping', value: 'ping', icon: <Zap className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />},
                      {name: 'Float', value: 'float', icon: <Cloud className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />}
                    ].map((anim) => (
                      <button
                        key={anim.value}
                        onClick={() => setMoodSettings({...moodSettings, animation: anim.value})}
                        className={`p-2 rounded-lg flex flex-col items-center ${
                          moodSettings.animation === anim.value ? 'ring-2 ring-blue-500 bg-blue-50' : 
                          moodSettings.darkMode ? 'bg-gray-700' : 'bg-gray-100'
                        }`}
                      >
                        <div className={`w-4 h-4 md:w-5 md:h-5 ${
                          anim.value === 'pulse' ? 'animate-pulse' : 
                          anim.value === 'bounce' ? 'animate-bounce' : 
                          anim.value === 'spin' ? 'animate-spin' : 
                          anim.value === 'ping' ? 'animate-ping' : 
                          'animate-float'
                        }`}>
                          {anim.icon}
                        </div>
                        <span className="text-xs mt-1">{anim.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2 md:mb-3 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Special Effects
                </h3>
                <div className={`flex items-center justify-between p-2 md:p-3 rounded-lg ${
                  moodSettings.darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center">
                    <Sparkles className="w-4 h-4 md:w-5 md:h-5 mr-2 text-yellow-400" />
                    <span>Floating Particles</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={moodSettings.particleEffects} 
                      onChange={() => setMoodSettings({...moodSettings, particleEffects: !moodSettings.particleEffects})}
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 md:w-11 md:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 md:after:h-5 md:after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className={`flex items-center justify-between p-2 md:p-3 rounded-lg mt-2 ${
                  moodSettings.darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center">
                    {moodSettings.darkMode ? (
                      <Sun className="w-4 h-4 md:w-5 md:h-5 mr-2 text-yellow-400" />
                    ) : (
                      <Moon className="w-4 h-4 md:w-5 md:h-5 mr-2 text-indigo-400" />
                    )}
                    <span>Dark Mode</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={moodSettings.darkMode} 
                      onChange={() => setMoodSettings({...moodSettings, darkMode: !moodSettings.darkMode})}
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 md:w-11 md:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 md:after:h-5 md:after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mt-6 md:mt-8 flex justify-end">
              <button
                onClick={() => setShowMoodSettings(false)}
                className="px-4 py-2 md:px-6 md:py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                Apply Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyReflection;