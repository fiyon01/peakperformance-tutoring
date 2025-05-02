import { useState, useEffect } from 'react';
import {
  Calendar, Clock, CheckCircle2, XCircle, Clock4, AlertCircle,
  ChevronLeft, ChevronRight, BookOpen, User, ChevronDown, ChevronUp,
  History, BarChart2, Loader2, Info, ClipboardList, Award
} from 'lucide-react';

const AttendancePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [showPastPrograms, setShowPastPrograms] = useState(false);
  const [attendanceData, setAttendanceData] = useState({});

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
          weeks: 6
        },
        {
          id: 2,
          name: 'Spring Revision 2023',
          startDate: '2023-04-03',
          endDate: '2023-04-14',
          current: false,
          weeks: 2
        },
        {
          id: 3,
          name: 'Winter Masterclass 2022',
          startDate: '2022-12-12',
          endDate: '2022-12-23',
          current: false,
          weeks: 2
        }
      ];

      const mockAttendance = {
        1: {
          1: [
            { date: '2023-07-10', time: '09:00-11:00', subject: 'Mathematics', tutor: 'Dr. Smith', status: 'present' },
            { date: '2023-07-11', time: '09:00-11:00', subject: 'English', tutor: 'Ms. Johnson', status: 'present' },
            { date: '2023-07-12', time: '09:00-11:00', subject: 'Science', tutor: 'Dr. Lee', status: 'late' },
            { date: '2023-07-13', time: '09:00-11:00', subject: 'Mathematics', tutor: 'Dr. Smith', status: 'absent' },
            { date: '2023-07-14', time: '09:00-11:00', subject: 'History', tutor: 'Mr. Brown', status: 'present' }
          ],
          2: [
            // Week 2 data...
          ]
        },
        2: {
          1: [
            // Spring Revision data...
          ]
        }
      };

      setPrograms(mockPrograms);
      setSelectedProgram(mockPrograms[0]);
      setAttendanceData(mockAttendance);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const calculateWeekStats = (weekSessions) => {
    if (!weekSessions) return { present: 0, absent: 0, late: 0, total: 0 };
    
    const stats = {
      present: weekSessions.filter(s => s.status === 'present').length,
      absent: weekSessions.filter(s => s.status === 'absent').length,
      late: weekSessions.filter(s => s.status === 'late').length,
      total: weekSessions.length
    };
    
    stats.percentage = Math.round((stats.present / stats.total) * 100);
    return stats;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'absent':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'late':
        return <Clock4 className="w-5 h-5 text-yellow-500" />;
      case 'excused':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleWeekChange = (direction) => {
    if (direction === 'prev' && currentWeek > 1) {
      setCurrentWeek(currentWeek - 1);
    } else if (direction === 'next' && currentWeek < selectedProgram.weeks) {
      setCurrentWeek(currentWeek + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  const currentWeekSessions = attendanceData[selectedProgram.id]?.[currentWeek] || [];
  const weekStats = calculateWeekStats(currentWeekSessions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      {/* Page Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-10 h-10 text-blue-600" strokeWidth={1.5} />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Attendance Record</h1>
            <p className="text-gray-600">Jonathan Smith - Summer Intensive 2023</p>
          </div>
        </div>
      </header>

      {/* Program Selection */}
      <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-blue-500" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{selectedProgram.name}</h2>
              <p className="text-gray-600 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {new Date(selectedProgram.startDate).toLocaleDateString()} - {new Date(selectedProgram.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowPastPrograms(!showPastPrograms)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <History className="w-5 h-5" />
            {showPastPrograms ? 'Hide Past Programs' : 'View Past Programs'}
            {showPastPrograms ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Past Programs Dropdown */}
        {showPastPrograms && (
          <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Select a past program:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {programs.filter(p => !p.current).map(program => (
                <div
                  key={program.id}
                  onClick={() => {
                    setSelectedProgram(program);
                    setCurrentWeek(1);
                    setShowPastPrograms(false);
                  }}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-colors"
                >
                  <h4 className="font-medium text-gray-800">{program.name}</h4>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(program.startDate).toLocaleDateString()} - {new Date(program.endDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Current Week Navigation */}
      <div className="mb-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Week {currentWeek} Attendance
            </h2>
            <p className="text-gray-600 text-sm">
              {currentWeekSessions[0]?.date ? new Date(currentWeekSessions[0].date).toLocaleDateString() : ''} - 
              {currentWeekSessions[currentWeekSessions.length - 1]?.date ? new Date(currentWeekSessions[currentWeekSessions.length - 1].date).toLocaleDateString() : ''}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleWeekChange('prev')}
              disabled={currentWeek === 1}
              className={`p-2 rounded-full ${currentWeek === 1 ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-50'}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="text-gray-700">Week {currentWeek} of {selectedProgram.weeks}</span>
            
            <button
              onClick={() => handleWeekChange('next')}
              disabled={currentWeek === selectedProgram.weeks}
              className={`p-2 rounded-full ${currentWeek === selectedProgram.weeks ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-50'}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Week Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Sessions Attended</h3>
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">{weekStats.present} <span className="text-sm font-normal text-gray-500">/ {weekStats.total}</span></p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Absences</h3>
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">{weekStats.absent} <span className="text-sm font-normal text-gray-500">/ {weekStats.total}</span></p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Late Arrivals</h3>
            <Clock4 className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">{weekStats.late} <span className="text-sm font-normal text-gray-500">/ {weekStats.total}</span></p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Attendance Rate</h3>
            <BarChart2 className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className="relative w-12 h-12">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeDasharray={`${weekStats.percentage}, 100`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-800">
                {weekStats.percentage}%
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500">Weekly average</p>
              <p className="text-sm font-medium text-gray-800">
                {weekStats.present} of {weekStats.total} sessions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Sessions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            Session Details
          </h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {currentWeekSessions.length > 0 ? (
            currentWeekSessions.map((session, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(session.status)}
                    <div>
                      <p className="font-medium text-gray-800">
                        {new Date(session.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {session.time}
                      </p>
                    </div>
                  </div>
                  
                  <div className="md:ml-8">
                    <p className="font-medium text-gray-800">{session.subject}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {session.tutor}
                    </p>
                  </div>
                  
                  <div className="md:ml-auto">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      session.status === 'present' ? 'bg-green-100 text-green-800' :
                      session.status === 'absent' ? 'bg-red-100 text-red-800' :
                      session.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                {session.notes && (
                  <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <p className="flex items-start gap-1">
                      <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      {session.notes}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No attendance records available for this week
            </div>
          )}
        </div>
      </div>

      {/* Status Legend */}
      <div className="mt-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-500" />
          Attendance Status Key
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-700">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            <span className="text-sm text-gray-700">Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock4 className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-gray-700">Late</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-700">Excused</span>
          </div>
        </div>
      </div>

      {/* Overall Summary */}
      <div className="mt-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Award className="w-6 h-6" />
              Overall Attendance
            </h2>
            <p className="text-blue-100">Across all Peak Performance programs</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeDasharray="85, 100"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                85%
              </div>
            </div>
            
            <div>
              <p className="text-sm text-blue-200">Total attended</p>
              <p className="font-medium">153 of 180 sessions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;