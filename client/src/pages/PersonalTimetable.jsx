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
      notes: '15 min meditation after',
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
      notes: 'Math chapter 5',
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
    notes: '',
    repeat: 'none'
  });
  
  // Available icons
  const icons = [
    { name: 'book', component: <Book size={18} /> },
    { name: 'study', component: <BookOpen size={18} /> },
    { name: 'school', component: <GraduationCap size={18} /> },
    { name: 'exercise', component: <Dumbbell size={18} /> },
    { name: 'music', component: <Music size={18} /> },
    { name: 'meal', component: <Utensils size={18} /> },
    { name: 'heart', component: <Heart size={18} /> },
    { name: 'coffee', component: <Coffee size={18} /> },
    { name: 'computer', component: <Laptop size={18} /> },
    { name: 'phone', component: <Phone size={18} /> },
    { name: 'tv', component: <Tv size={18} /> },
    { name: 'shopping', component: <ShoppingCart size={18} /> },
    { name: 'transport', component: <Bus size={18} /> },
    { name: 'bike', component: <Bike size={18} /> },
    { name: 'shower', component: <FaShower size={18} /> },
    { name: 'sleep', component: <Bed size={18} /> },
    { name: 'beauty', component: <Brush size={18} /> },
    { name: 'alarm', component: <AlarmClock size={18} /> },
    { name: 'reminder', component: <Bell size={18} /> },
    { name: 'work', component: <Briefcase size={18} /> }
  ];
  
  // Color palettes
  const palettes = {
    soft: ['#FEE2E2', '#FEF3C7', '#D1FAE5', '#DBEAFE', '#E0E7FF', '#EDE9FE', '#FCE7F3'],
    vibrant: ['#FECACA', '#FDE68A', '#A7F3D0', '#BFDBFE', '#C7D2FE', '#DDD6FE', '#FBCFE8'],
    pastel: ['#FFDFDF', '#FFF4C9', '#C8F5DC', '#D4E6FF', '#D9D9FF', '#E8D9FF', '#FFD9EC'],
    jewel: ['#FCA5A5', '#FCD34D', '#6EE7B7', '#93C5FD', '#A5B4FC', '#C4B5FD', '#F9A8D4'],
    earth: ['#FED7AA', '#FDE68A', '#A7F3D0', '#BAE6FD', '#C7D2FE', '#DDD6FE', '#F5D0FE'],
    ocean: ['#BFDBFE', '#A5F3FC', '#99F6E4', '#A7F3D0', '#D9F99D', '#FDE68A', '#FECACA'],
    sunset: ['#FECACA', '#FDE68A', '#FEF08A', '#FED7AA', '#FDBA74', '#FCA5A5', '#F9A8D4']
  };
  
  // Themes
  const themes = [
    { 
      name: 'default', 
      bg: 'bg-white', 
      text: 'text-gray-800', 
      border: 'border-gray-200',
      modalBg: 'bg-white',
      modalText: 'text-gray-800'
    },
    { 
      name: 'light', 
      bg: 'bg-gray-50', 
      text: 'text-gray-800', 
      border: 'border-gray-300',
      modalBg: 'bg-white',
      modalText: 'text-gray-800'
    },
    { 
      name: 'dark', 
      bg: 'bg-gray-900', 
      text: 'text-gray-100', 
      border: 'border-gray-700',
      modalBg: 'bg-gray-800',
      modalText: 'text-gray-100'
    },
    { 
      name: 'feminine', 
      bg: 'bg-rose-50', 
      text: 'text-rose-900', 
      border: 'border-rose-200',
      modalBg: 'bg-rose-50',
      modalText: 'text-rose-900'
    },
    { 
      name: 'professional', 
      bg: 'bg-slate-50', 
      text: 'text-slate-800', 
      border: 'border-slate-300',
      modalBg: 'bg-slate-50',
      modalText: 'text-slate-800'
    },
    { 
      name: 'cozy', 
      bg: 'bg-amber-50', 
      text: 'text-amber-900', 
      border: 'border-amber-200',
      modalBg: 'bg-amber-50',
      modalText: 'text-amber-900'
    },
    { 
      name: 'nature', 
      bg: 'bg-emerald-50', 
      text: 'text-emerald-900', 
      border: 'border-emerald-200',
      modalBg: 'bg-emerald-50',
      modalText: 'text-emerald-900'
    }
  ];
  
  // Background options
  const backgrounds = [
    { name: 'plain', label: 'Plain', icon: <Droplet size={18} /> },
    { name: 'gradient', label: 'Gradient', icon: <Droplet size={18} /> },
    { name: 'texture', label: 'Texture', icon: <Image size={18} /> },
    { name: 'pattern', label: 'Pattern', icon: <LayoutGrid size={18} /> }
  ];
  
  // Days of week
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Time slots - now from 6am to 11pm
  const timeSlots = [];
  for (let i = 6; i < 24; i++) {
    timeSlots.push(`${i}:00`);
    if (i < 23) {
      timeSlots.push(`${i}:30`);
    }
  }
  
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
      // If editing and repeat is weekly, update all blocks with the same title in the week
      if (newBlock.repeat === 'weekly') {
        const updatedBlocks = blocks.map(block => {
          if (block.title === editingBlock.title && block.day >= 0 && block.day <= 6) {
            return {
              ...newBlock,
              id: block.id,
              day: block.day // Keep the original day
            };
          }
          return block;
        });
        setBlocks(updatedBlocks);
      } else {
        // Just update the single block
        setBlocks(blocks.map(block => block.id === editingBlock.id ? newBlock : block));
      }
    } else {
      // If new block and repeat is weekly, create blocks for each day
      if (newBlock.repeat === 'weekly') {
        const weeklyBlocks = [];
        for (let i = 0; i < 7; i++) {
          weeklyBlocks.push({
            ...newBlock,
            id: Date.now() + i,
            day: i
          });
        }
        setBlocks([...blocks, ...weeklyBlocks]);
      } else {
        // Just add the single block
        setBlocks([...blocks, { ...newBlock, id: Date.now() }]);
      }
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
  
  // Get icon component by name
  const getIconComponent = (name) => {
    const icon = icons.find(i => i.name === name);
    return icon ? icon.component : <Book size={18} />;
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
  const currentTheme = themes.find(t => t.name === theme) || themes[0];

  return (
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} transition-colors duration-300`}>
      {/* Header */}
      <header className="p-4 md:p-6 border-b border-opacity-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <h1 className="text-xl md:text-2xl font-bold flex items-center">
              <Clock className="mr-2" size={24} />
              My Personal Timetable
            </h1>
            
            <div className="flex space-x-2">
              <button 
                onClick={() => setViewMode('day')} 
                className={`px-3 py-1 rounded-lg flex items-center ${viewMode === 'day' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}
              >
                <Calendar className="mr-1" size={16} />
                Day
              </button>
              <button 
                onClick={() => setViewMode('week')} 
                className={`px-3 py-1 rounded-lg flex items-center ${viewMode === 'week' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}
              >
                <LayoutGrid className="mr-1" size={16} />
                Week
              </button>
            </div>
          </div>
          
          <div className="flex space-x-3 w-full md:w-auto justify-between md:justify-normal">
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
                  ...newBlock,
                  day: viewMode === 'week' ? 0 : selectedDay,
                  startTime: '09:00',
                  endTime: '10:00'
                });
                setShowBlockModal(true);
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} className="mr-1" />
              <span className="hidden md:inline">Add Block</span>
            </button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 space-y-3 md:space-y-0">
          <div className="flex items-center space-x-2 md:space-x-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <button 
              onClick={() => navigateDays('prev')}
              className="p-2 rounded-full hover:bg-gray-200 hover:bg-opacity-50 transition-colors flex-shrink-0"
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
              className="p-2 rounded-full hover:bg-gray-200 hover:bg-opacity-50 transition-colors flex-shrink-0"
            >
              <ChevronRight size={20} />
            </button>
            
            <button 
              onClick={() => {
                setCurrentDate(new Date());
                setSelectedDay(new Date().getDay());
              }}
              className="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex-shrink-0"
            >
              Today
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-200 hover:bg-opacity-50 transition-colors" title="Print">
              <Printer size={18} />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-200 hover:bg-opacity-50 transition-colors" title="Settings">
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
                {timeSlots.map((time, i) => (
                  <div key={i} className="h-10 flex items-end justify-end pr-2 text-sm text-gray-500">
                    {time.includes(':30') ? '' : formatTime(time)}
                  </div>
                ))}
              </div>
              
              {/* Day columns */}
              {getWeekDays().map((day, dayIndex) => (
                <div 
                  key={dayIndex} 
                  className={`relative col-span-1 border rounded-lg ${dayIndex === new Date().getDay() && currentDate.getDay() === new Date().getDay() ? 'border-blue-400 bg-blue-50 bg-opacity-30' : 'border-gray-200'}`}
                >
                  <div className="h-12 flex flex-col items-center justify-center font-medium border-b p-1">
                    <div className="text-sm md:text-base">{days[dayIndex].substring(0, 3)}</div>
                    <div className={`text-xs md:text-sm ${day.getDate() === new Date().getDate() && day.getMonth() === new Date().getMonth() ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>
                      {day.getDate()}
                    </div>
                  </div>
                  
                  <div 
                    className="relative min-h-[720px] cursor-pointer"
                    onClick={() => {
                      setSelectedDay(dayIndex);
                      setNewBlock({
                        ...newBlock,
                        day: dayIndex,
                        startTime: '09:00',
                        endTime: '10:00'
                      });
                    }}
                  >
                    {/* Time slot indicators */}
                    {timeSlots.map((_, i) => (
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
                              React.cloneElement(getIconComponent(block.icon), { fill: block.textColor }) : 
                              getIconComponent(block.icon)}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm md:text-base">{block.title}</div>
                            <div className="text-xs">
                              {formatTime(block.startTime)} - {formatTime(block.endTime)}
                              <span className="ml-2">({calculateDuration(block.startTime, block.endTime)})</span>
                            </div>
                            {block.notes && (
                              <div className="text-xs mt-1 opacity-80">{block.notes}</div>
                            )}
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
              {timeSlots.map((time, i) => (
                <div key={i} className="h-10 flex items-end justify-end pr-2 text-sm text-gray-500">
                  {time.includes(':30') ? '' : formatTime(time)}
                </div>
              ))}
            </div>
            
            {/* Day column */}
            <div className="relative col-span-5 border rounded-lg">
              <div className="h-12 flex items-center justify-center font-medium border-b">
                {days[selectedDay]}, {currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </div>
              
              <div 
                className="relative min-h-[720px] cursor-pointer"
                onClick={() => {
                  setNewBlock({
                    ...newBlock,
                    day: selectedDay,
                    startTime: '09:00',
                    endTime: '10:00'
                  });
                  setShowBlockModal(true);
                }}
              >
                {/* Time slot indicators */}
                {timeSlots.map((_, i) => (
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
                          React.cloneElement(getIconComponent(block.icon), { fill: block.textColor }) : 
                          getIconComponent(block.icon)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{block.title}</div>
                        <div className="text-xs">
                          {formatTime(block.startTime)} - {formatTime(block.endTime)}
                          <span className="ml-2">({calculateDuration(block.startTime, block.endTime)})</span>
                        </div>
                        {block.notes && (
                          <div className="text-xs mt-1 opacity-80">{block.notes}</div>
                        )}
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
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
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
              className={`${currentTheme.modalBg} rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className={`text-xl font-bold mb-4 flex items-center ${currentTheme.modalText}`}>
                  {editingBlock ? 'Edit Time Block' : 'Add New Time Block'}
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${currentTheme.modalText}`}>Title</label>
                    <input
                      type="text"
                      value={newBlock.title}
                      onChange={(e) => setNewBlock({...newBlock, title: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${currentTheme.modalText} ${currentTheme.modalBg === 'bg-white' || currentTheme.modalBg === 'bg-gray-50' ? 'border-gray-300' : 'border-gray-600'}`}
                      placeholder="e.g., Morning Routine, Study Session"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${currentTheme.modalText}`}>Start Time</label>
                      <input
                        type="time"
                        value={newBlock.startTime}
                        onChange={(e) => setNewBlock({...newBlock, startTime: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${currentTheme.modalText} ${currentTheme.modalBg === 'bg-white' || currentTheme.modalBg === 'bg-gray-50' ? 'border-gray-300' : 'border-gray-600'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${currentTheme.modalText}`}>End Time</label>
                      <input
                        type="time"
                        value={newBlock.endTime}
                        onChange={(e) => setNewBlock({...newBlock, endTime: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${currentTheme.modalText} ${currentTheme.modalBg === 'bg-white' || currentTheme.modalBg === 'bg-gray-50' ? 'border-gray-300' : 'border-gray-600'}`}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${currentTheme.modalText}`}>Day</label>
                    <select
                      value={newBlock.day}
                      onChange={(e) => setNewBlock({...newBlock, day: parseInt(e.target.value)})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${currentTheme.modalText} ${currentTheme.modalBg === 'bg-white' || currentTheme.modalBg === 'bg-gray-50' ? 'border-gray-300' : 'border-gray-600'}`}
                    >
                      {days.map((day, i) => (
                        <option key={i} value={i}>{day}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${currentTheme.modalText}`}>Icon</label>
                    <div className="grid grid-cols-6 gap-2">
                      {icons.map((icon, i) => (
                        <button
                          key={i}
                          className={`p-2 rounded-lg border ${newBlock.icon === icon.name ? 'bg-blue-100 border-blue-400' : currentTheme.modalBg === 'bg-white' || currentTheme.modalBg === 'bg-gray-50' ? 'bg-gray-100 border-gray-200' : 'bg-gray-700 border-gray-600'}`}
                          onClick={() => setNewBlock({...newBlock, icon: icon.name})}
                        >
                          {icon.component}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${currentTheme.modalText}`}>Color</label>
                    <div className="grid grid-cols-7 gap-2">
                      {palettes[colorPalette].map((color, i) => (
                        <button
                          key={i}
                          className="w-8 h-8 rounded-full border border-gray-200"
                          style={{ backgroundColor: color }}
                          onClick={() => setNewBlock({...newBlock, color})}
                        >
                          {newBlock.color === color && (
                            <div className="w-full h-full flex items-center justify-center text-white">
                              <FaCheck size={14} />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${currentTheme.modalText}`}>Notes</label>
                    <textarea
                      value={newBlock.notes}
                      onChange={(e) => setNewBlock({...newBlock, notes: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${currentTheme.modalText} ${currentTheme.modalBg === 'bg-white' || currentTheme.modalBg === 'bg-gray-50' ? 'border-gray-300' : 'border-gray-600'}`}
                      rows="2"
                      placeholder="Optional notes or details..."
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${currentTheme.modalText}`}>Repeat</label>
                    <div className="flex flex-wrap gap-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="repeat"
                          value="none"
                          checked={newBlock.repeat === 'none'}
                          onChange={() => setNewBlock({...newBlock, repeat: 'none'})}
                          className="text-blue-500 focus:ring-blue-500"
                        />
                        <span className={`ml-2 ${currentTheme.modalText}`}>None</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="repeat"
                          value="daily"
                          checked={newBlock.repeat === 'daily'}
                          onChange={() => setNewBlock({...newBlock, repeat: 'daily'})}
                          className="text-blue-500 focus:ring-blue-500"
                        />
                        <span className={`ml-2 ${currentTheme.modalText}`}>Daily</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="repeat"
                          value="weekly"
                          checked={newBlock.repeat === 'weekly'}
                          onChange={() => setNewBlock({...newBlock, repeat: 'weekly'})}
                          className="text-blue-500 focus:ring-blue-500"
                        />
                        <span className={`ml-2 ${currentTheme.modalText}`}>Weekly</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  {editingBlock && (
                    <button
                      onClick={() => {
                        if (newBlock.repeat === 'weekly') {
                          // Delete all blocks with this title in the week
                          setBlocks(blocks.filter(block => !(block.title === editingBlock.title && block.day >= 0 && block.day <= 6)));
                        } else {
                          handleDeleteBlock(editingBlock.id);
                        }
                        setShowBlockModal(false);
                        setEditingBlock(null);
                      }}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowBlockModal(false);
                      setEditingBlock(null);
                    }}
                    className={`px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors ${currentTheme.modalBg === 'bg-white' || currentTheme.modalBg === 'bg-gray-50' ? 'border-gray-300 text-gray-700' : 'border-gray-600 text-gray-200'}`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveBlock}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingBlock ? 'Update' : 'Add'} Block
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Customize Modal */}
      <AnimatePresence>
        {showCustomizeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowCustomizeModal(false)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className={`${currentTheme.modalBg} rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className={`text-xl font-bold mb-6 flex items-center ${currentTheme.modalText}`}>
                  <Palette className="mr-2" size={20} />
                  Customize Your Timetable
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Theme Selection */}
                  <div>
                    <h3 className={`text-lg font-medium mb-4 ${currentTheme.modalText}`}>Theme</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {themes.map((t, i) => (
                        <button
                          key={i}
                          className={`p-4 rounded-lg border-2 ${t.border} ${theme === t.name ? 'ring-2 ring-blue-500' : ''}`}
                          onClick={() => setTheme(t.name)}
                        >
                          <div className={`w-full h-20 rounded ${t.bg} flex items-center justify-center`}>
                            <span className={`${t.text} font-medium`}>Aa</span>
                          </div>
                          <div className={`mt-2 text-sm capitalize ${currentTheme.modalText}`}>{t.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Color Palette */}
                  <div>
                    <h3 className={`text-lg font-medium mb-4 ${currentTheme.modalText}`}>Color Palette</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.keys(palettes).map((palette, i) => (
                        <button
                          key={i}
                          className={`p-3 rounded-lg border ${colorPalette === palette ? 'ring-2 ring-blue-500 border-blue-500' : currentTheme.modalBg === 'bg-white' || currentTheme.modalBg === 'bg-gray-50' ? 'border-gray-200' : 'border-gray-600'}`}
                          onClick={() => setColorPalette(palette)}
                        >
                          <div className="flex">
                            {palettes[palette].slice(0, 5).map((color, j) => (
                              <div 
                                key={j} 
                                className="h-8 flex-1" 
                                style={{ backgroundColor: color }}
                              ></div>
                            ))}
                          </div>
                          <div className={`mt-2 text-sm capitalize ${currentTheme.modalText}`}>{palette}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Background */}
                  <div>
                    <h3 className={`text-lg font-medium mb-4 ${currentTheme.modalText}`}>Background</h3>
                    <div className="grid grid-cols-4 gap-3">
                      {backgrounds.map((bg, i) => (
                        <button
                          key={i}
                          className={`p-3 rounded-lg border flex flex-col items-center ${background === bg.name ? 'ring-2 ring-blue-500 border-blue-500' : currentTheme.modalBg === 'bg-white' || currentTheme.modalBg === 'bg-gray-50' ? 'border-gray-200' : 'border-gray-600'}`}
                          onClick={() => setBackground(bg.name)}
                        >
                          <div className={`p-2 rounded-full mb-2 ${currentTheme.modalBg === 'bg-white' || currentTheme.modalBg === 'bg-gray-50' ? 'bg-gray-100' : 'bg-gray-700'}`}>
                            {bg.icon}
                          </div>
                          <div className={`text-sm ${currentTheme.modalText}`}>{bg.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Icon Style */}
                  <div>
                    <h3 className={`text-lg font-medium mb-4 ${currentTheme.modalText}`}>Icon Style</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        className={`p-4 rounded-lg border flex flex-col items-center ${iconStyle === 'filled' ? 'ring-2 ring-blue-500 border-blue-500' : currentTheme.modalBg === 'bg-white' || currentTheme.modalBg === 'bg-gray-50' ? 'border-gray-200' : 'border-gray-600'}`}
                        onClick={() => setIconStyle('filled')}
                      >
                        <div className="flex space-x-2 mb-2">
                          <FaCircle size={16} className="text-blue-500" />
                          <FaHeart size={16} className="text-rose-500" />
                          <FaStar size={16} className="text-amber-400" />
                        </div>
                        <div className={`text-sm ${currentTheme.modalText}`}>Filled</div>
                      </button>
                      <button
                        className={`p-4 rounded-lg border flex flex-col items-center ${iconStyle === 'outline' ? 'ring-2 ring-blue-500 border-blue-500' : currentTheme.modalBg === 'bg-white' || currentTheme.modalBg === 'bg-gray-50' ? 'border-gray-200' : 'border-gray-600'}`}
                        onClick={() => setIconStyle('outline')}
                      >
                        <div className="flex space-x-2 mb-2">
                          <FaRegCircle size={16} className="text-blue-500" />
                          <FaRegHeart size={16} className="text-rose-500" />
                          <FaRegStar size={16} className="text-amber-400" />
                        </div>
                        <div className={`text-sm ${currentTheme.modalText}`}>Outline</div>
                      </button>
                    </div>
                  </div>
                  
                  {/* Density */}
                  <div className="md:col-span-2">
                    <h3 className={`text-lg font-medium mb-4 ${currentTheme.modalText}`}>Layout Density</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        className={`p-3 rounded-lg border flex flex-col items-center ${density === 'compact' ? 'ring-2 ring-blue-500 border-blue-500' : currentTheme.modalBg === 'bg-white' || currentTheme.modalBg === 'bg-gray-50' ? 'border-gray-200' : 'border-gray-600'}`}
                        onClick={() => setDensity('compact')}
                      >
                        <div className="w-full h-12 mb-2 flex flex-col justify-between">
                          <div className={`h-3 rounded w-full ${currentTheme.modalBg === 'bg-white' || currentTheme.modalBg === 'bg-gray-50' ? 'bg-gray-200' : 'bg-gray-600'}`}></div>
                          <div className={`h-3 rounded w-full ${currentTheme.modalBg === 'bg-white' || currentTheme.modalBg === 'bg-gray-50' ? 'bg-gray-200' : 'bg-gray-600'}`}></div>
                          <div className={`h-3 rounded w-full ${currentTheme.modalBg === 'bg-white' || currentTheme.modalBg === 'bg-gray-50' ? 'bg-gray-200' : 'bg-gray-600'}`}></div>
                        </div>
                        <div className={`text-sm ${currentTheme.modalText}`}>Compact</div>
                      </button>
                      <button
                        className={`p-3 rounded-lg border flex flex-col items-center ${density === 'normal' ? 'ring-2 ring-blue-500 border-blue-500' : currentTheme.modalBg === 'bg-white' || currentTheme.modalBg === 'bg-gray-50' ? 'border-gray-200' : 'border-gray-600'}`}
                        onClick={() => setDensity('normal')}
                      >
                        <div className="w-full h-12 mb-2 flex flex-col justify-between">
                          <div className={`h-4 rounded w-full ${currentTheme.modalBg === 'bg-white' || currentTheme.modalBg === 'bg-gray-50' ? 'bg-gray-200' : 'bg-gray-600'}`}></div>
                          <div className={`h-4 rounded w-full ${currentTheme.modalBg === 'bg-white' || currentTheme.modalBg === 'bg-gray-50' ? 'bg-gray-200' : 'bg-gray-600'}`}></div>
                        </div>
                        <div className={`text-sm ${currentTheme.modalText}`}>Normal</div>
                      </button>
                      <button
                        className={`p-3 rounded-lg border flex flex-col items-center ${density === 'spacious' ? 'ring-2 ring-blue-500 border-blue-500' : currentTheme.modalBg === 'bg-white' || currentTheme.modalBg === 'bg-gray-50' ? 'border-gray-200' : 'border-gray-600'}`}
                        onClick={() => setDensity('spacious')}
                      >
                        <div className="w-full h-12 mb-2 flex flex-col justify-between">
                          <div className={`h-5 rounded w-full ${currentTheme.modalBg === 'bg-white' || currentTheme.modalBg === 'bg-gray-50' ? 'bg-gray-200' : 'bg-gray-600'}`}></div>
                          <div className={`h-5 rounded w-3/4 ${currentTheme.modalBg === 'bg-white' || currentTheme.modalBg === 'bg-gray-50' ? 'bg-gray-200' : 'bg-gray-600'}`}></div>
                        </div>
                        <div className={`text-sm ${currentTheme.modalText}`}>Spacious</div>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-8">
                  <button
                    onClick={() => setShowCustomizeModal(false)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply Customization
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