import { useState, useEffect } from 'react';
import {
  Calendar, Clock, BookOpen, User, MapPin, ChevronLeft, ChevronRight,
  LayoutGrid, List, ChevronDown, ChevronUp, History, PlusCircle,
  Printer, Download, AlertCircle, CheckCircle2, Clock4, MoreVertical,
  ArrowRightCircle, X, ClipboardList, Award
} from 'lucide-react';

const TimetablePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('weekly');
  const [showProgramsDropdown, setShowProgramsDropdown] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      // Mock data
      const mockPrograms = [
        {
          id: 1,
          name: 'Summer Intensive 2023',
          startDate: '2023-07-10',
          endDate: '2023-08-18',
          current: true,
          color: 'bg-blue-100 text-blue-800'
        },
        {
          id: 2,
          name: 'Spring Revision 2023',
          startDate: '2023-04-03',
          endDate: '2023-04-14',
          current: false,
          color: 'bg-purple-100 text-purple-800'
        },
        {
          id: 3,
          name: 'Winter Masterclass 2022',
          startDate: '2022-12-12',
          endDate: '2022-12-23',
          current: false,
          color: 'bg-amber-100 text-amber-800'
        }
      ];

      setPrograms(mockPrograms);
      setSelectedProgram(mockPrograms[0]);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Generate mock timetable data for the current week
  const generateTimetable = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timetable = {};
    
    days.forEach(day => {
      timetable[day] = [
        {
          id: 1,
          time: '09:00 - 10:30',
          subject: 'Mathematics',
          tutor: 'Dr. Smith',
          location: 'Room 101',
          type: 'lecture',
          status: 'completed',
          color: 'bg-red-50 border-red-200'
        },
        {
          id: 2,
          time: '10:45 - 12:15',
          subject: 'English Literature',
          tutor: 'Ms. Johnson',
          location: 'Room 205',
          type: 'tutorial',
          status: 'upcoming',
          color: 'bg-blue-50 border-blue-200'
        },
        {
          id: 3,
          time: '12:15 - 13:15',
          subject: 'Lunch Break',
          tutor: '',
          location: 'Cafeteria',
          type: 'break',
          status: 'upcoming',
          color: 'bg-gray-50 border-gray-200'
        },
        {
          id: 4,
          time: '13:15 - 14:45',
          subject: 'Physics',
          tutor: 'Dr. Lee',
          location: 'Lab 3',
          type: 'practical',
          status: 'upcoming',
          color: 'bg-green-50 border-green-200'
        },
        {
          id: 5,
          time: '15:00 - 16:30',
          subject: 'History',
          tutor: 'Mr. Brown',
          location: 'Room 102',
          type: 'lecture',
          status: 'upcoming',
          color: 'bg-purple-50 border-purple-200'
        }
      ];
    });

    // Mark current session (for demo purposes)
    const now = new Date();
    const currentHour = now.getHours();
    if (currentHour >= 10 && currentHour < 12) {
      timetable['Tuesday'][1].status = 'current';
    }

    return timetable;
  };

  const timetableData = generateTimetable();
  const days = Object.keys(timetableData);

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'current':
        return <ArrowRightCircle className="w-4 h-4 text-blue-600 animate-pulse" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'upcoming':
        return <Clock4 className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'lecture':
        return <BookOpen className="w-4 h-4 text-red-500" />;
      case 'tutorial':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'practical':
        return <ClipboardList className="w-4 h-4 text-green-500" />;
      case 'break':
        return <Clock className="w-4 h-4 text-gray-500" />;
      default:
        return <BookOpen className="w-4 h-4 text-gray-500" />;
    }
  };

  const openSessionDetails = (session) => {
    setSelectedSession(session);
    setShowSessionModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      {/* Page Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <Calendar className="w-10 h-10 text-blue-600" strokeWidth={1.5} />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Programme Timetable</h1>
            <p className="text-gray-600">Jonathan Smith - Summer Intensive 2023</p>
          </div>
        </div>
      </header>

      {/* Programme Selection & Navigation */}
      <div className="mb-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative">
            <button
              onClick={() => setShowProgramsDropdown(!showProgramsDropdown)}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className={`w-3 h-3 rounded-full ${selectedProgram.current ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <div className="text-left">
                <h2 className="font-semibold text-gray-800">{selectedProgram.name}</h2>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(selectedProgram.startDate).toLocaleDateString()} - {new Date(selectedProgram.endDate).toLocaleDateString()}
                </p>
              </div>
              {showProgramsDropdown ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>

            {showProgramsDropdown && (
              <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 animate-fade-in">
                {programs.map(program => (
                  <div
                    key={program.id}
                    onClick={() => {
                      setSelectedProgram(program);
                      setShowProgramsDropdown(false);
                    }}
                    className={`p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors ${program.id === selectedProgram.id ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${program.current ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <div>
                        <h3 className="font-medium text-gray-800">{program.name}</h3>
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(program.startDate).toLocaleDateString()} - {new Date(program.endDate).toLocaleDateString()}
                          {!program.current && <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 rounded-full">Past Programme</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateWeek('prev')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            
            <div className="text-center">
              <p className="font-medium text-gray-800">
                {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
              </p>
              <p className="text-sm text-gray-600">
                Week {Math.ceil(currentDate.getDate() / 7)} of {selectedProgram.weeks || 4}
              </p>
            </div>
            
            <button
              onClick={() => navigateWeek('next')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="mb-6 flex justify-end">
        <div className="inline-flex rounded-lg border border-gray-200 bg-white overflow-hidden">
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-4 py-2 flex items-center gap-2 ${viewMode === 'weekly' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Weekly</span>
          </button>
          <button
            onClick={() => setViewMode('daily')}
            className={`px-4 py-2 flex items-center gap-2 ${viewMode === 'daily' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            <List className="w-4 h-4" />
            <span>Daily</span>
          </button>
        </div>
      </div>

      {/* Timetable Content */}
      {viewMode === 'weekly' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Weekday Headers */}
          <div className="grid grid-cols-5 border-b border-gray-100">
            {days.map(day => (
              <div key={day} className="p-3 text-center font-medium text-gray-800">
                {day}
              </div>
            ))}
          </div>
          
          {/* Timetable Grid */}
          <div className="grid grid-cols-5 divide-x divide-gray-100">
            {days.map(day => (
              <div key={day} className="min-h-[500px]">
                {timetableData[day].map(session => (
                  <div
                    key={session.id}
                    onClick={() => openSessionDetails(session)}
                    className={`m-2 p-3 rounded-lg border ${session.color} cursor-pointer hover:shadow-md transition-all ${
                      session.status === 'current' ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(session.type)}
                        <span className="font-medium text-gray-800">{session.subject}</span>
                      </div>
                      {getStatusIcon(session.status)}
                    </div>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                      <Clock className="w-3 h-3" />
                      {session.time}
                    </p>
                    {session.tutor && (
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {session.tutor}
                      </p>
                    )}
                    {session.location && (
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {session.location}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Daily View */}
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">
              {currentDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h2>
          </div>
          
          <div className="divide-y divide-gray-100">
            {timetableData['Monday'].map(session => (
              <div
                key={session.id}
                onClick={() => openSessionDetails(session)}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  session.status === 'current' ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${session.color.replace('bg-', 'bg-opacity-20 ')}`}>
                    {getTypeIcon(session.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-800">{session.subject}</h3>
                      {getStatusIcon(session.status)}
                    </div>
                    <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3" />
                      {session.time}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                      {session.tutor && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {session.tutor}
                        </p>
                      )}
                      {session.location && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {session.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Session Details Modal */}
      {showSessionModal && selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl w-full max-w-md shadow-lg">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{selectedSession.subject}</h2>
                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                    {getTypeIcon(selectedSession.type)}
                    <span className="capitalize">{selectedSession.type}</span>
                  </p>
                </div>
                <button
                  onClick={() => setShowSessionModal(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      {selectedSession.time}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-medium flex items-center gap-2">
                      {getStatusIcon(selectedSession.status)}
                      <span className="capitalize">{selectedSession.status}</span>
                    </p>
                  </div>
                </div>
                
                {selectedSession.tutor && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Tutor</p>
                    <p className="font-medium flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-500" />
                      {selectedSession.tutor}
                    </p>
                  </div>
                )}
                
                {selectedSession.location && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      {selectedSession.location}
                    </p>
                  </div>
                )}
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Learning Objectives</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                      <span>Understand key concepts in {selectedSession.subject.toLowerCase()}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                      <span>Apply theoretical knowledge to practical problems</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                      <span>Develop critical thinking skills</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <PlusCircle className="w-5 h-5" />
                  Add to Calendar
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <Printer className="w-5 h-5" />
                  Print Details
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <Download className="w-5 h-5" />
                  Export as PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Footer */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-200 shadow-sm transition-colors">
          <Printer className="w-5 h-5" />
          Print Timetable
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-200 shadow-sm transition-colors">
          <Download className="w-5 h-5" />
          Export Timetable
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-200 shadow-sm transition-colors">
          <History className="w-5 h-5" />
          View Past Programmes
        </button>
      </div>
    </div>
  );
};

export default TimetablePage;