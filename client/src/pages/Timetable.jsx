import React, { useState, useEffect } from "react";
import { Calendar, Clock, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import isEqual from 'lodash.isequal';
import { jwtDecode } from "jwt-decode";

// Types
const ViewMode = {
  WEEKLY: "weekly",
  DAILY: "daily"
};

// Utils
const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

// Components
const SubjectCard = ({ subject }) => {
  return (
    <div className="bg-violet-50 rounded-md p-3 border border-violet-100">
      <h3 className="font-medium text-violet-800">{subject?.name || 'No Subject'}</h3>
      {subject?.teacher && (
        <p className="text-sm text-gray-600 mt-1">Teacher: {subject.teacher}</p>
      )}
    </div>
  );
};

const ProgramDetails = ({ program }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{program?.name || 'Program Name'}</h2>
          <p className="text-gray-600">
            {program?.term || 'Term'} {program?.year || 'Year'} • {program?.duration || 'Duration'}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">Start Date</p>
            <p className="font-medium">{program?.startDate || 'N/A'}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">End Date</p>
            <p className="font-medium">{program?.endDate || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TimeTable = ({ program, loading }) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [viewMode, setViewMode] = useState(ViewMode.WEEKLY);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (isMobile) {
      setViewMode(ViewMode.DAILY);
    }
  }, [isMobile]);

  const getTimeSlotsForDay = (day) => {
    // Safely handle missing or invalid timeSlots
    if (!program?.timeSlots || !Array.isArray(program.timeSlots)) return [];
    
    return program.timeSlots
      .filter(slot => slot?.day === day)
      .sort((a, b) => {
        const aHour = parseInt(a?.startTime?.split(':')[0] || 0);
        const bHour = parseInt(b?.startTime?.split(':')[0] || 0);
        return aHour - bHour;
      });
  };
  
  const renderDailyView = () => {
    const daySlots = getTimeSlotsForDay(selectedDay);
    
    return (
      <div className="space-y-3 animate-fade-in">
        <div className="flex overflow-x-auto pb-2 gap-1 no-scrollbar">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap ${
                selectedDay === day
                  ? "bg-violet-500 text-white"
                  : "bg-white hover:bg-violet-100"
              }`}
            >
              {day.substring(0, 3)}
            </button>
          ))}
        </div>
        
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-md animate-pulse"></div>
            ))}
          </div>
        ) : daySlots.length > 0 ? (
          <div className="space-y-3">
            {daySlots.map((slot) => (
              <div key={slot?.id || Math.random()} className="bg-white rounded-lg shadow-sm border border-gray-100 p-2">
                <div className="flex items-center gap-3 mb-2">
                  <Clock size={18} className="text-violet-500" />
                  <span className="text-gray-700 font-medium">
                    {slot?.startTime ? formatTime(slot.startTime) : '--:--'} - {slot?.endTime ? formatTime(slot.endTime) : '--:--'}
                  </span>
                </div>
                <SubjectCard subject={slot?.subject || {}} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            No classes scheduled for {selectedDay}
          </div>
        )}
      </div>
    );
  };

  const renderWeeklyView = () => {
    return (
      <div className="relative">
        <div className="hidden md:flex items-center justify-between absolute top-1/2 -translate-y-1/2 left-0 right-0 z-10 pointer-events-none">
          <button 
            onClick={() => document.querySelector('.timetable-container')?.scrollBy({ left: -300, behavior: 'smooth' })}
            className="pointer-events-auto p-2 bg-white rounded-full shadow-md hover:bg-gray-50 ml-2"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button 
            onClick={() => document.querySelector('.timetable-container')?.scrollBy({ left: 300, behavior: 'smooth' })}
            className="pointer-events-auto p-2 bg-white rounded-full shadow-md hover:bg-gray-50 mr-2"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="timetable-container overflow-x-auto pb-2 no-scrollbar">
          <div className="min-w-[768px]">
            <div className="grid grid-cols-[auto_repeat(5,1fr)] bg-white rounded-lg shadow-md">
              <div className="timetable-header border-b-2 border-violet-100"></div>
              {days.map((day) => (
                <div key={day} className="timetable-header border-b-2 border-violet-100 flex items-center justify-center p-2">
                  <Calendar size={18} className="text-violet-500 mr-2" />
                  <span>{day.substring(0, 3)}</span>
                </div>
              ))}

              {days.map((day, dayIndex) => {
                const daySlots = getTimeSlotsForDay(day);
                
                return (
                  <React.Fragment key={`day-row-${day}`}>
                    {dayIndex === 0 && (
                      <div className="time-column border-r-2 border-violet-100 font-semibold text-gray-700 flex items-center justify-center p-2">
                        Schedule
                      </div>
                    )}
                    
                    <div className="timetable-day-column border-r border-gray-100 last:border-r-0">
                      {loading ? (
                        <div className="h-full w-full p-2">
                          <div className="h-full bg-gray-100 rounded-md animate-pulse"></div>
                        </div>
                      ) : daySlots.length > 0 ? (
                        <div className="p-2 space-y-2">
                          {daySlots.map((slot) => (
                            <div key={slot?.id || Math.random()} className="mb-2">
                              <div className="text-xs text-gray-500 mb-1">
                                {slot?.startTime ? formatTime(slot.startTime) : '--:--'} - {slot?.endTime ? formatTime(slot.endTime) : '--:--'}
                              </div>
                              <SubjectCard subject={slot?.subject || {}} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="h-20 flex items-center justify-center text-gray-400 text-sm">
                          No classes
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-2">
        <div className="flex bg-white rounded-lg shadow-sm overflow-hidden">
          <button
            onClick={() => setViewMode(ViewMode.WEEKLY)}
            className={`py-2 px-4 ${
              viewMode === ViewMode.WEEKLY
                ? "bg-violet-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            } transition-colors font-medium`}
            disabled={isMobile}
          >
            Weekly
          </button>
          <button
            onClick={() => setViewMode(ViewMode.DAILY)}
            className={`py-2 px-4 ${
              viewMode === ViewMode.DAILY
                ? "bg-violet-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            } transition-colors font-medium`}
          >
            Daily
          </button>
        </div>
      </div>

      {viewMode === ViewMode.DAILY ? renderDailyView() : renderWeeklyView()}
    </div>
  );
};

const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  return isMobile;
};

const TimetablePage = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch programs on component mount
  useEffect(() => {
    const fetchPrograms = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth/students-login");
        return;
      }
  
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          localStorage.removeItem("token");
          navigate("/auth/students-login");
          return;
        }
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
        navigate("/auth/students-login");
        return;
      }
  
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3500/api/programs', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        if (response.status === 200) {
          const newData = response.data?.programs || [];
          if (!isEqual(newData, programs)) {
            setPrograms(newData);
            if (newData.length > 0 && !selectedProgramId) {
              setSelectedProgramId(newData[0].id);
            }
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPrograms();
  
    const interval = setInterval(fetchPrograms, 120000);
    return () => clearInterval(interval);
  }, [programs, selectedProgramId, navigate]);

  // Fetch time slots when selected program changes
  useEffect(() => {
    if (selectedProgramId) {
      const fetchTimeSlots = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem('token');
          
          if (!token) {
            navigate("/auth/students-login");
            return;
          }

          const response = await axios.get(
            `http://localhost:3500/api/programs/${selectedProgramId}/timetable`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          setTimeSlots(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
          setError(err.message);
          setTimeSlots([]);
        } finally {
          setLoading(false);
        }
      };
  
      fetchTimeSlots();
    }
  }, [selectedProgramId, navigate]);

  const selectedProgram = programs.find(p => p.id === selectedProgramId) || {};

  if (loading && programs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Data</h2>
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-violet-500 text-white rounded hover:bg-violet-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-gray-50 rounded-lg max-w-md">
          <h2 className="text-xl font-bold text-gray-700 mb-2">No Programs Available</h2>
          <p className="text-gray-600">There are currently no active programs to display.</p>
        </div>
      </div>
    );
  }

  // Combine program data with time slots
  const programWithSlots = {
    ...selectedProgram,
    timeSlots: timeSlots
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-violet-900 mb-2 tracking-tight">
            Class Schedule
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            View your timetable for current and past programs
          </p>
        </header>

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-white text-gray-700 font-medium py-2 px-4 rounded-lg shadow-sm border border-gray-200 flex items-center w-64 justify-between hover:bg-gray-50 transition-colors"
            >
              <span>{selectedProgram?.name || 'Select Program'}</span>
              {dropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {dropdownOpen && (
              <div className="absolute mt-2 w-64 bg-white rounded-lg shadow-lg z-10 animate-fade-in border border-gray-200">
                <ul>
                  {programs.map((program) => (
                    <li key={program.id}>
                      <button
                        onClick={() => {
                          setSelectedProgramId(program.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-violet-50 transition-colors flex justify-between items-center ${
                          program.id === selectedProgramId ? "bg-violet-50 text-violet-700" : ""
                        }`}
                      >
                        <div>
                          <span className="font-medium">{program.name}</span>
                          <div className="text-xs text-gray-500">{program.year} · {program.term}</div>
                        </div>
                        {program.isActive && (
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <ProgramDetails program={selectedProgram} />

        <div className="bg-white p-6 rounded-lg shadow-md overflow-hidden">
          <TimeTable program={programWithSlots} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default TimetablePage;