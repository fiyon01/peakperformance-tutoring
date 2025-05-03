import { useState, useEffect } from 'react';
import {
  Book, FileText, Video, Link, Download, Share2, Search, Filter,
  Calendar, Clock, ChevronDown, ChevronRight, X, File, FileInput,
  FileSpreadsheet, FileImage, FileAudio, FileVideo, FileArchive,
  Folder, BookOpen, Bookmark, GraduationCap, Library, List
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LearningResources = () => {
  // Sample resource data
  const allResources = [
    {
      id: 1,
      title: "Algebra II Chapter Notes",
      subject: "Mathematics",
      programme: "Summer Intensive Maths",
      type: "notes",
      format: "pdf",
      dateAdded: "2023-06-15",
      description: "Comprehensive notes covering all concepts from Chapter 3",
      downloads: 42
    },
    {
      id: 2,
      title: "2022 Chemistry Past Paper",
      subject: "Chemistry",
      programme: "Advanced Science Prep",
      type: "past-paper",
      format: "pdf",
      dateAdded: "2023-06-10",
      description: "Official exam paper with marking scheme",
      downloads: 87
    },
    {
      id: 3,
      title: "French Grammar Video",
      subject: "French",
      programme: "Language Mastery",
      type: "video",
      format: "mp4",
      dateAdded: "2023-06-05",
      description: "30-minute tutorial on advanced grammar concepts",
      downloads: 23
    },
    {
      id: 4,
      title: "Recommended Physics Website",
      subject: "Physics",
      programme: "Advanced Science Prep",
      type: "link",
      format: "url",
      dateAdded: "2023-05-28",
      description: "Interactive simulations for physics concepts",
      downloads: 56
    },
    {
      id: 5,
      title: "Biology Lab Worksheet",
      subject: "Biology",
      programme: "Advanced Science Prep",
      type: "worksheet",
      format: "docx",
      dateAdded: "2023-05-20",
      description: "Practice questions for next week's lab",
      downloads: 34
    },
    {
      id: 6,
      title: "Literature Reading List",
      subject: "English",
      programme: "Humanities Focus",
      type: "reading-list",
      format: "pdf",
      dateAdded: "2023-05-15",
      description: "Summer reading recommendations with analysis guides",
      downloads: 29
    }
  ];

  const [resources, setResources] = useState(allResources);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgramme, setSelectedProgramme] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  // Filter and sort resources
  useEffect(() => {
    let filtered = [...allResources];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(resource => 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply programme filter
    if (selectedProgramme !== "all") {
      filtered = filtered.filter(resource => resource.programme === selectedProgramme);
    }
    
    // Apply subject filter
    if (selectedSubject !== "all") {
      filtered = filtered.filter(resource => resource.subject === selectedSubject);
    }
    
    // Apply type filter
    if (selectedType !== "all") {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "date-desc") {
        return new Date(b.dateAdded) - new Date(a.dateAdded);
      } else if (sortBy === "date-asc") {
        return new Date(a.dateAdded) - new Date(b.dateAdded);
      } else if (sortBy === "title-asc") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "title-desc") {
        return b.title.localeCompare(a.title);
      } else if (sortBy === "downloads-desc") {
        return b.downloads - a.downloads;
      }
      return 0;
    });
    
    setResources(filtered);
  }, [searchTerm, selectedProgramme, selectedSubject, selectedType, sortBy]);

  // Check for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get unique programmes, subjects, and types for filters
  const programmes = [...new Set(allResources.map(resource => resource.programme))];
  const subjects = [...new Set(allResources.map(resource => resource.subject))];
  const types = [...new Set(allResources.map(resource => resource.type))];

  // Get icon for resource type
  const getTypeIcon = (type, format) => {
    switch (type) {
      case "notes": return <FileText className="w-5 h-5 text-blue-600" />;
      case "past-paper": return <FileSpreadsheet className="w-5 h-5 text-red-600" />;
      case "video": return <Video className="w-5 h-5 text-purple-600" />;
      case "link": return <Link className="w-5 h-5 text-green-600" />;
      case "worksheet": return <FileInput className="w-5 h-5 text-orange-600" />;
      case "reading-list": return <Bookmark className="w-5 h-5 text-indigo-600" />;
      default:
        switch (format) {
          case "pdf": return <FileText className="w-5 h-5 text-blue-600" />;
          case "docx": return <File className="w-5 h-5 text-blue-500" />;
          case "mp4": return <FileVideo className="w-5 h-5 text-purple-600" />;
          case "url": return <Link className="w-5 h-5 text-green-600" />;
          default: return <File className="w-5 h-5 text-gray-600" />;
        }
    }
  };

  // Handle download simulation
  const handleDownload = (id) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center">
          <BookOpen className="w-8 h-8 text-indigo-600 mr-3" />
          Learning Resources
        </h1>
        <p className="text-gray-600 mt-2">
          Access supplementary materials to support your learning across all programmes
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search resources..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Button (Mobile) */}
          {isMobile && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
              <ChevronDown className={`w-5 h-5 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          )}

          {/* Sort Dropdown */}
          <div className="w-full md:w-auto">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="downloads-desc">Most Downloads</option>
            </select>
          </div>
        </div>

        {/* Filters Panel */}
        {(showFilters || !isMobile) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Programme Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Programme
                </label>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
                  value={selectedProgramme}
                  onChange={(e) => setSelectedProgramme(e.target.value)}
                >
                  <option value="all">All Programmes</option>
                  {programmes.map(programme => (
                    <option key={programme} value={programme}>{programme}</option>
                  ))}
                </select>
              </div>

              {/* Subject Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Book className="w-4 h-4 mr-2" />
                  Subject
                </label>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  <option value="all">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <File className="w-4 h-4 mr-2" />
                  Resource Type
                </label>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  {types.map(type => (
                    <option key={type} value={type}>
                      {type === "notes" ? "Notes" : 
                       type === "past-paper" ? "Past Papers" : 
                       type === "video" ? "Videos" : 
                       type === "link" ? "Links" : 
                       type === "worksheet" ? "Worksheets" : 
                       type === "reading-list" ? "Reading Lists" : type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {isMobile && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  Close filters <X className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Resources Grid */}
      {resources.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {resources.map(resource => (
            <motion.div
              key={resource.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-start">
                  <div className="mr-4">
                    {getTypeIcon(resource.type, resource.format)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold truncate">{resource.title}</h3>
                    <div className="flex flex-wrap items-center text-sm text-gray-500 mt-1">
                      <span className="flex items-center mr-3">
                        <GraduationCap className="w-4 h-4 mr-1" /> {resource.programme}
                      </span>
                      <span className="flex items-center">
                        <Book className="w-4 h-4 mr-1" /> {resource.subject}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{resource.description}</p>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(resource.dateAdded).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleDownload(resource.id)}
                      className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors relative"
                      title="Download"
                    >
                      {downloadingId === resource.id ? (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 1.5 }}
                          className="absolute bottom-0 left-0 h-1 bg-indigo-600 rounded-full"
                        />
                      ) : null}
                      <Download className="w-5 h-5" />
                    </button>
                    <button 
                      className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors"
                      title="Share"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Library className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No resources found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 
              "Try adjusting your search or filters" : 
              "No resources match your current filters"}
          </p>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedProgramme("all");
                setSelectedSubject("all");
                setSelectedType("all");
              }}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default LearningResources;