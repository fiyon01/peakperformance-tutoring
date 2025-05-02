import { useState, useEffect } from 'react';
import {
  Home, Calendar, Target, BookOpen, BarChart2, Mail, MapPin,
  HelpCircle, User, ChevronRight, Clock, CheckCircle2, XCircle,
  ChevronDown, ChevronUp, ArrowRight, Bookmark, Award, Bell,
  MessageSquare, ClipboardList, Search, Settings, Plus
} from 'lucide-react';

const DashboardHome = ({ isEnrolled = true, justLoggedIn = false }) => {
  const [showWelcome, setShowWelcome] = useState(false);
  const activePrograms = [
    { id: 1, name: "Summer Intensive Maths", date: "Jul 10 - Aug 5", icon: <Bookmark className="w-5 h-5" /> },
    { id: 2, name: "Advanced Science Prep", date: "Aug 15 - Sep 10", icon: <Award className="w-5 h-5" /> }
  ];

  const upcomingSessions = [
    { id: 1, subject: "Algebra II", time: "Mon 9:00 AM", tutor: "Dr. Smith", status: "upcoming" },
    { id: 2, subject: "Chemistry Lab", time: "Tue 11:00 AM", tutor: "Prof. Johnson", status: "upcoming" }
  ];

  const weeklyAttendance = [
    { day: "Mon", attended: true },
    { day: "Tue", attended: true },
    { day: "Wed", attended: false },
    { day: "Thu", attended: true },
    { day: "Fri", attended: true }
  ];

  useEffect(() => {
    if (justLoggedIn) {
      setShowWelcome(true);

      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 4000); // Hide after 4 seconds

      return () => clearTimeout(timer);
    }
  }, [justLoggedIn]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 overflow-auto">
      {showWelcome && (
        <div className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl flex justify-between items-center">
          <h1 className="text-2xl font-bold">Welcome, Student!</h1>
          <XCircle className="w-6 h-6 cursor-pointer" onClick={() => setShowWelcome(false)} />
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm flex items-center space-x-4">
          <Bookmark className="w-6 h-6 text-blue-600" />
          <div>
            <h4 className="text-lg font-semibold">{activePrograms.length}</h4>
            <p className="text-sm text-gray-500">My Programmes</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm flex items-center space-x-4">
          <Target className="w-6 h-6 text-purple-600" />
          <div>
            <h4 className="text-lg font-semibold">2</h4>
            <p className="text-sm text-gray-500">Goals Set</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm flex items-center space-x-4">
          <Clock className="w-6 h-6 text-green-600" />
          <div>
            <h4 className="text-lg font-semibold">{upcomingSessions.length}</h4>
            <p className="text-sm text-gray-500">Upcoming Sessions</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm flex items-center space-x-4">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          <div>
            <h4 className="text-lg font-semibold">80%</h4>
            <p className="text-sm text-gray-500">Attendance Rate</p>
          </div>
        </div>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Programmes */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <BookOpen className="w-5 h-5 text-blue-500 mr-2" />
              {isEnrolled ? "My Programmes" : "Upcoming Programmes"}
            </h3>
            <button className="text-blue-600 text-sm flex items-center">View all <ChevronRight className="ml-1 w-4 h-4" /></button>
          </div>
          <div className="space-y-4">
            {isEnrolled ? activePrograms.map(p => (
              <div key={p.id} className=" p-4 rounded-lg flex items-start space-x-4 hover:bg-gray-50">
                <div className="p-2 bg-blue-50 rounded-lg">{p.icon}</div>
                <div className="flex-1">
                  <h4 className="font-medium">{p.name}</h4>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" /> {p.date}
                  </p>
                </div>
              </div>
            )) : (
              <div className="p-6 text-center text-gray-500">No active programmes</div>
            )}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Clock className="w-5 h-5 text-blue-500 mr-2" />
              Upcoming Sessions
            </h3>
            <button className="text-blue-600 text-sm flex items-center">View all <ChevronRight className="ml-1 w-4 h-4" /></button>
          </div>
          <div className="space-y-3">
            {upcomingSessions.map(s => (
              <div key={s.id} className=" p-3 rounded-lg flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg"><Clock className="w-5 h-5 text-blue-500" /></div>
                <div className="flex-1">
                  <h4 className="font-medium">{s.subject}</h4>
                  <p className="text-sm text-gray-500">{s.time} • {s.tutor}</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">{s.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Attendance */}
        {isEnrolled && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <CheckCircle2 className="w-5 h-5 text-blue-500 mr-2" />
                Weekly Attendance
              </h3>
              <button className="text-blue-600 text-sm flex items-center">View details <ChevronRight className="ml-1 w-4 h-4" /></button>
            </div>
            <div className="flex justify-between mb-3">
              {weeklyAttendance.map((day, idx) => (
                <div key={idx} className="text-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1 ${day.attended ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {day.attended ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  </div>
                  <span className="text-sm text-gray-500">{day.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full rounded-full" style={{ width: '80%' }}></div>
            </div>
            <p className="text-right text-sm text-gray-500 mt-1">4 of 5 days attended (80%)</p>
          </div>
        )}

        {/* Goals */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Target className="w-5 h-5 text-blue-500 mr-2" />
              My Goals
            </h3>
            <button className="text-blue-600 text-sm flex items-center">View all <ChevronRight className="ml-1 w-4 h-4" /></button>
          </div>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Achieve A* in Maths</h4>
              <div className="flex justify-between items-center">
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-blue-600 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <span className="text-sm ml-2 font-medium">65%</span>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Improve Chemistry by 2 grades</h4>
              <div className="flex justify-between items-center">
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-purple-600 rounded-full" style={{ width: '40%' }}></div>
                </div>
                <span className="text-sm ml-2 font-medium">40%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;