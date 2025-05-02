import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, Calendar, Plus, Edit2, Trash2, Copy, Printer, Settings, Palette, 
  LayoutGrid, List, ChevronLeft, ChevronRight, Sun, Moon, Droplet, Image, 
  BookOpen, Book, GraduationCap, Dumbbell, Music, Utensils, Heart, Coffee,
  Laptop, Phone, Tv, ShoppingCart, Bus, Bike, Bed, Brush, AlarmClock, Bell, Briefcase
} from 'lucide-react';
import { FaRegCircle, FaShower, FaCheck, FaCircle, FaRegStar, FaStar, FaRegHeart, FaHeart } from 'react-icons/fa';
import { FiRepeat } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const PersonalTimetable = () => {
  // State for timetable view
  const [viewMode, setViewMode] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  
  // State for timetable blocks
  const [blocks, setBlocks] = useState([
    {
      id: 1,
      title: 'Morning Yoga',
      startTime: '07:00',
      endTime: '07:30',
      day: 1, // Monday
      color: '#FEE2E2',
      textColor: '#B91C1C',
      icon: 'heart',
      repeat: 'weekly'
    },
    {
      id: 2,
      title: 'Study Session',
      startTime: '09:00',
      endTime: '11:00',
      day: 1,
      color: '#DBEAFE',
      textColor: '#1D4ED8',
      icon: 'book',
      repeat: 'none'
    }
  ]);
  
  // State for customization
  const [theme, setTheme] = useState('default');
  const [colorPalette, setColorPalette] = useState('soft');
  const [background, setBackground] = useState('plain');
  const [iconStyle, setIconStyle] = useState('filled');
  const [density, setDensity] = useState('normal');
  
  // Modal states
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const [newBlock, setNewBlock] = useState({
    title: '',
    startTime: '09:00',
    endTime: '10:00',
    day: selectedDay,
    color: '#EFF6FF',
    textColor: '#1E40AF',
    icon: 'book',
    repeat: 'none'
  });

  // Days of week
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Calculate duration in hours and minutes
  const calculateDuration = (startTime, endTime) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    let totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  };
  
  // Format time to AM/PM
  const formatTime = (time) => {
    const [hour, minute] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };
  
  // Handle adding/editing blocks
  const handleSaveBlock = () => {
    if (editingBlock) {
      setBlocks(blocks.map(block => block.id === editingBlock.id ? newBlock : block));
    } else {
      setBlocks([...blocks, { ...newBlock, id: Date.now() }]);
    }
    setShowBlockModal(false);
    setEditingBlock(null);
  };
  
  // Handle deleting a block
  const handleDeleteBlock = (id) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };
  
  // Handle day navigation
  const navigateDays = (direction) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };
  
  // Get current week days
  const getWeekDays = () => {
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    return Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(startDate);
      day.setDate(day.getDate() + i);
      return day;
    });
  };
  
  // Get blocks for a specific day
  const getBlocksForDay = (dayIndex) => {
    return blocks.filter(block => block.day === dayIndex);
  };

  // Calculate block position and height
  const calculateBlockStyle = (block) => {
    const [startHour, startMinute] = block.startTime.split(':').map(Number);
    const [endHour, endMinute] = block.endTime.split(':').map(Number);
    
    const startPosition = (startHour - 6) * 2 + (startMinute / 30);
    const duration = (endHour - startHour) * 2 + (endMinute - startMinute) / 30;
    
    return {
      top: `${startPosition * 40}px`,
      height: `${duration * 40}px`
    };
  };

  // Get current theme styles
  const currentTheme = {
    bg: 'bg-white',
    text: 'text-gray-800',
    border: 'border-gray-200',
    modalBg: 'bg-white',
    modalText: 'text-gray-800',
    inputBorder: 'border-gray-300',
    inputFocus: 'ring-blue-500 border-blue-500'
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="p-4 md:p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <h1 className="text-xl md:text-2xl font-bold flex items-center">
              <Clock className="mr-2" size={24} />
              My Personal Timetable
            </h1>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setViewMode('day')} 
                className={`px-3 py-1 rounded-lg flex items-center transition-colors ${
                  viewMode === 'day' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Calendar className="mr-1" size={16} />
                Day
              </button>
              <button 
                onClick={() => setViewMode('week')} 
                className={`px-3 py-1 rounded-lg flex items-center transition-colors ${
                  viewMode === 'week' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <LayoutGrid className="mr-1" size={16} />
                Week
              </button>
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto justify-between md:justify-normal">
            <button 
              onClick={() => setShowCustomizeModal(true)}
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
              title="Customize"
            >
              <Palette size={20} />
            </button>
            
            <button 
              onClick={() => {
                setNewBlock({
                  title: '',
                  startTime: '09:00',
                  endTime: '10:00',
                  day: viewMode === 'week' ? 0 : selectedDay,
                  color: '#EFF6FF',
                  textColor: '#1E40AF',
                  icon: 'book',
                  repeat: 'none'
                });
                setShowBlockModal(true);
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus size={18} className="mr-1" />
              <span className="hidden md:inline">Add Block</span>
            </button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 gap-3">
          <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto overflow-x-auto pb-2">
            <button 
              onClick={() => navigateDays('prev')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
            >
              <ChevronLeft size={20} />
            </button>
            
            <h2 className="text-lg md:text-xl font-semibold whitespace-nowrap">
              {viewMode === 'week' ? 
                `${getWeekDays()[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
                 ${getWeekDays()[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` :
                currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </h2>
            
            <button 
              onClick={() => navigateDays('next')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
            >
              <ChevronRight size={20} />
            </button>
            
            <button 
              onClick={() => {
                setCurrentDate(new Date());
                setSelectedDay(new Date().getDay());
              }}
              className="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex-shrink-0 text-sm"
            >
              Today
            </button>
          </div>
          
          <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" title="Print">
              <Printer size={18} />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" title="Settings">
              <Settings size={18} />
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="p-4 md:p-6">
        {viewMode === 'week' ? (
          <div className="overflow-x-auto pb-4">
            <div className="grid grid-cols-8 gap-4 min-w-[1000px]">
              {/* Time column */}
              <div className="col-span-1">
                <div className="h-12"></div>
                {Array.from({ length: 36 }).map((_, i) => (
                  <div key={i} className="h-10 flex items-end justify-end pr-2 text-sm text-gray-500">
                    {i % 2 === 0 ? `${6 + Math.floor(i/2)}:00` : ''}
                  </div>
                ))}
              </div>
              
              {/* Day columns */}
              {getWeekDays().map((day, dayIndex) => (
                <div 
                  key={dayIndex} 
                  className={`relative col-span-1 border rounded-lg ${
                    dayIndex === new Date().getDay() && currentDate.getDay() === new Date().getDay() ? 
                    'border-blue-400 bg-blue-50 bg-opacity-30' : 'border-gray-200'
                  }`}
                >
                  <div className="h-12 flex flex-col items-center justify-center font-medium border-b p-1">
                    <div className="text-sm md:text-base">{days[dayIndex].substring(0, 3)}</div>
                    <div className={`text-xs md:text-sm ${
                      day.getDate() === new Date().getDate() && day.getMonth() === new Date().getMonth() ? 
                      'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''
                    }`}>
                      {day.getDate()}
                    </div>
                  </div>
                  
                  <div 
                    className="relative min-h-[720px] cursor-pointer"
                    onClick={() => {
                      setSelectedDay(dayIndex);
                      setNewBlock({
                        title: '',
                        startTime: '09:00',
                        endTime: '10:00',
                        day: dayIndex,
                        color: '#EFF6FF',
                        textColor: '#1E40AF',
                        icon: 'book',
                        repeat: 'none'
                      });
                    }}
                  >
                    {/* Time slot indicators */}
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div key={i} className="h-10 border-b border-gray-100 border-dashed"></div>
                    ))}
                    
                    {/* Blocks for this day */}
                    {getBlocksForDay(dayIndex).map(block => (
                      <motion.div
                        key={block.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute left-1 right-1 rounded-lg p-2 shadow-sm cursor-pointer`}
                        style={{ 
                          ...calculateBlockStyle(block),
                          backgroundColor: block.color,
                          color: block.textColor
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingBlock(block);
                          setNewBlock(block);
                          setShowBlockModal(true);
                        }}
                      >
                        <div className="flex items-start">
                          <div className="mr-2">
                            {iconStyle === 'filled' ? 
                              React.cloneElement(
                                <Book size={18} />, 
                                { fill: block.textColor }
                              ) : 
                              <Book size={18} />
                            }
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm md:text-base">{block.title}</div>
                            <div className="text-xs">
                              {formatTime(block.startTime)} - {formatTime(block.endTime)}
                              <span className="ml-2">({calculateDuration(block.startTime, block.endTime)})</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-6 gap-4">
            {/* Time column */}
            <div className="col-span-1">
              <div className="h-12"></div>
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="h-10 flex items-end justify-end pr-2 text-sm text-gray-500">
                  {i % 2 === 0 ? `${6 + Math.floor(i/2)}:00` : ''}
                </div>
              ))}
            </div>
            
            {/* Day column */}
            <div className="relative col-span-5 border rounded-lg border-gray-200">
              <div className="h-12 flex items-center justify-center font-medium border-b border-gray-200">
                {days[selectedDay]}, {currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </div>
              
              <div 
                className="relative min-h-[720px] cursor-pointer"
                onClick={() => {
                  setNewBlock({
                    title: '',
                    startTime: '09:00',
                    endTime: '10:00',
                    day: selectedDay,
                    color: '#EFF6FF',
                    textColor: '#1E40AF',
                    icon: 'book',
                    repeat: 'none'
                  });
                  setShowBlockModal(true);
                }}
              >
                {/* Time slot indicators */}
                {Array.from({ length: 36 }).map((_, i) => (
                  <div key={i} className="h-10 border-b border-gray-100 border-dashed"></div>
                ))}
                
                {/* Blocks for this day */}
                {getBlocksForDay(selectedDay).map(block => (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute left-1 right-1 rounded-lg p-2 shadow-sm cursor-pointer`}
                    style={{ 
                      ...calculateBlockStyle(block),
                      backgroundColor: block.color,
                      color: block.textColor
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingBlock(block);
                      setNewBlock(block);
                      setShowBlockModal(true);
                    }}
                  >
                    <div className="flex items-start">
                      <div className="mr-2">
                        {iconStyle === 'filled' ? 
                          React.cloneElement(
                            <Book size={18} />, 
                            { fill: block.textColor }
                          ) : 
                          <Book size={18} />
                        }
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{block.title}</div>
                        <div className="text-xs">
                          {formatTime(block.startTime)} - {formatTime(block.endTime)}
                          <span className="ml-2">({calculateDuration(block.startTime, block.endTime)})</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {blocks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Calendar className="text-gray-300 mb-4" size={48} />
            <h3 className="text-xl font-medium text-gray-500 mb-2">Your timetable is empty</h3>
            <p className="text-gray-400 mb-6">Start by adding your first time block</p>
            <button 
              onClick={() => setShowBlockModal(true)}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus size={20} className="mr-2" />
              Add Your First Block
            </button>
          </div>
        )}
      </main>
      
      {/* Add/Edit Block Modal */}
      <AnimatePresence>
        {showBlockModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => {
              setShowBlockModal(false);
              setEditingBlock(null);
            }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                  {editingBlock ? 'Edit Time Block' : 'Add New Time Block'}
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Title</label>
                    <input
                      type="text"
                      value={newBlock.title}
                      onChange={(e) => setNewBlock({...newBlock, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="e.g., Morning Routine, Study Session"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Start Time</label>
                      <input
                        type="time"
                        value={newBlock.startTime}
                        onChange={(e) => setNewBlock({...newBlock, startTime: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">End Time</label>
                      <input
                        type="time"
                        value={newBlock.endTime}
                        onChange={(e) => setNewBlock({...newBlock, endTime: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Day</label>
                    <select
                      value={newBlock.day}
                      onChange={(e) => setNewBlock({...newBlock, day: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    >
                      {days.map((day, i) => (
                        <option key={i} value={i}>{day}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Color</label>
                    <div className="grid grid-cols-7 gap-2">
                      {['#FEE2E2', '#FEF3C7', '#D1FAE5', '#DBEAFE', '#E0E7FF', '#EDE9FE', '#FCE7F3'].map((color, i) => (
                        <button
                          key={i}
                          className="w-8 h-8 rounded-full border border-gray-200 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ backgroundColor: color }}
                          onClick={() => setNewBlock({...newBlock, color})}
                        >
                          {newBlock.color === color && (
                            <div className="w-full h-full flex items-center justify-center text-gray-700">
                              <FaCheck size={14} />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Repeat</label>
                    <div className="flex flex-wrap gap-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="repeat"
                          value="none"
                          checked={newBlock.repeat === 'none'}
                          onChange={() => setNewBlock({...newBlock, repeat: 'none'})}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">None</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="repeat"
                          value="weekly"
                          checked={newBlock.repeat === 'weekly'}
                          onChange={() => setNewBlock({...newBlock, repeat: 'weekly'})}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Weekly</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  {editingBlock && (
                    <button
                      onClick={() => {
                        handleDeleteBlock(editingBlock.id);
                        setShowBlockModal(false);
                        setEditingBlock(null);
                      }}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    >
                      Delete
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowBlockModal(false);
                      setEditingBlock(null);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveBlock}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    {editingBlock ? 'Update' : 'Add'} Block
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PersonalTimetable;