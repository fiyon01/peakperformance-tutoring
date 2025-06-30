import React, { useState, useEffect } from 'react';
import { 
  Download, BookOpen, FileText, Clock, Calendar, Search, Filter, X, 
  ChevronDown, ChevronUp, CheckCircle, AlertCircle, File, FileText as FileTextIcon,
  FileInput, FileOutput, FileSpreadsheet, FileImage, FileArchive, FileVideo, FileAudio,
  Star, Bookmark, Printer, Share2, Eye, Info, Book, Notebook, GraduationCap, Trash2,
  FilePlus, FileMinus, FileCheck, FileX, FileSearch, FileDigit, FileClock, FileBarChart2
} from 'lucide-react';


const AssignmentsHub = () => {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedAssignment, setExpandedAssignment] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    subject: [],
    status: [],
    dueDate: null,
    type: []
  });

  // Sample data for Kenyan tutoring agency
  useEffect(() => {
    const fetchAssignments = async () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setAssignments(kenyanSampleAssignments);
        setFilteredAssignments(kenyanSampleAssignments);
        setIsLoading(false);
      }, 800);
    };
    
    fetchAssignments();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let results = [...assignments];
    
    // Apply search
    if (searchTerm) {
      results = results.filter(assignment => 
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply filters
    if (activeFilters.subject.length > 0) {
      results = results.filter(assignment => 
        activeFilters.subject.includes(assignment.subject)
      );
    }
    
    if (activeFilters.status.length > 0) {
      results = results.filter(assignment => 
        activeFilters.status.includes(assignment.status)
      );
    }
    
    if (activeFilters.type.length > 0) {
      results = results.filter(assignment => 
        activeFilters.type.includes(assignment.type)
      );
    }
    
    // Due date filter
    if (activeFilters.dueDate) {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      results = results.filter(assignment => {
        const dueDate = new Date(assignment.dueDate);
        
        switch(activeFilters.dueDate) {
          case 'today':
            return dueDate.toDateString() === today.toDateString();
          case 'tomorrow':
            return dueDate.toDateString() === tomorrow.toDateString();
          case 'week':
            const endOfWeek = new Date();
            endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
            return dueDate >= today && dueDate <= endOfWeek;
          case 'next-week':
            const nextWeekStart = new Date();
            nextWeekStart.setDate(nextWeekStart.getDate() + (7 - nextWeekStart.getDay()));
            const nextWeekEnd = new Date(nextWeekStart);
            nextWeekEnd.setDate(nextWeekEnd.getDate() + 7);
            return dueDate >= nextWeekStart && dueDate <= nextWeekEnd;
          case 'month':
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            return dueDate >= today && dueDate <= endOfMonth;
          default:
            return true;
        }
      });
    }
    
    setFilteredAssignments(results);
  }, [searchTerm, activeFilters, assignments]);

  const handleFilterChange = (filterType, value) => {
    setActiveFilters(prev => {
      if (filterType === 'dueDate') {
        return { ...prev, dueDate: value };
      }
      
      const currentValues = prev[filterType];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return { ...prev, [filterType]: newValues };
    });
  };

  const clearFilters = () => {
    setActiveFilters({
      subject: [],
      status: [],
      dueDate: null,
      type: []
    });
    setSearchTerm('');
  };

  const toggleAssignmentExpansion = (id) => {
    setExpandedAssignment(expandedAssignment === id ? null : id);
  };

  const getFileIcon = (fileType) => {
    const type = fileType.split('/')[0];
    switch(type) {
      case 'application':
        if (fileType.includes('pdf')) return <FileTextIcon className="text-red-500" />;
        if (fileType.includes('word')) return <FileText className="text-blue-500" />;
        if (fileType.includes('excel') || fileType.includes('spreadsheet')) return <FileSpreadsheet className="text-green-600" />;
        if (fileType.includes('zip') || fileType.includes('rar')) return <FileArchive className="text-yellow-600" />;
        return <File className="text-gray-500" />;
      case 'image':
        return <FileImage className="text-purple-500" />;
      case 'video':
        return <FileVideo className="text-orange-500" />;
      case 'audio':
        return <FileAudio className="text-pink-500" />;
      default:
        return <File className="text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i]);
  };

  const handleDownload = (fileUrl, fileName) => {
    // Simulate download
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (file) => {
    setPreviewFile(file);
  };

  const closePreview = () => {
    setPreviewFile(null);
  };

  const handleDeleteAssignment = (id) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      setAssignments(prev => prev.filter(assignment => assignment.id !== id));
      setFilteredAssignments(prev => prev.filter(assignment => assignment.id !== id));
    }
  };

  const handleSaveAssignment = (id) => {
    // In a real app, this would save to favorites/bookmarks
    setAssignments(prev => prev.map(assignment => 
      assignment.id === id 
        ? { ...assignment, saved: !assignment.saved } 
        : assignment
    ));
    setFilteredAssignments(prev => prev.map(assignment => 
      assignment.id === id 
        ? { ...assignment, saved: !assignment.saved } 
        : assignment
    ));
  };

  const handleShareAssignment = (assignment) => {
    // In a real app, this would use the Web Share API or similar
    const shareData = {
      title: assignment.title,
      text: `${assignment.subject} assignment: ${assignment.description}`,
      url: window.location.href,
    };
    
    if (navigator.share) {
      navigator.share(shareData).catch(err => {
        console.log('Error sharing:', err);
        // Fallback for browsers that don't support Web Share API
        alert(`Share this assignment: ${assignment.title}\n${assignment.description}`);
      });
    } else {
      // Fallback
      alert(`Share this assignment: ${assignment.title}\n${assignment.description}`);
    }
  };

  const handlePrintAssignment = (assignment) => {
    // In a real app, this would open a print dialog with formatted content
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${assignment.title}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px; }
            .meta { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .status { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 0.8em; }
            .pending { background: #fef3c7; color: #92400e; }
            .submitted { background: #d1fae5; color: #065f46; }
            .graded { background: #dbeafe; color: #1e40af; }
            .overdue { background: #fee2e2; color: #991b1b; }
            .description { margin: 20px 0; }
            .attachments { margin-top: 30px; }
            .file { display: flex; align-items: center; margin-bottom: 10px; }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>${assignment.title}</h1>
          <div class="meta">
            <div>
              <strong>Subject:</strong> ${assignment.subject}<br>
              <strong>Type:</strong> ${assignment.type}
            </div>
            <div>
              <strong>Assigned:</strong> ${assignment.assignedDate}<br>
              <strong>Due:</strong> ${assignment.dueDate}
            </div>
          </div>
          <div class="status ${assignment.status.toLowerCase()}">${assignment.status}</div>
          ${assignment.points ? `<div><strong>Points:</strong> ${assignment.points}</div>` : ''}
          
          <div class="description">
            <h3>Description</h3>
            <p>${assignment.description}</p>
          </div>
          
          ${assignment.instructions ? `
          <div class="instructions">
            <h3>Instructions</h3>
            <p>${assignment.instructions}</p>
          </div>
          ` : ''}
          
          ${assignment.attachments.length > 0 ? `
          <div class="attachments">
            <h3>Attachments (${assignment.attachments.length})</h3>
            ${assignment.attachments.map(file => `
              <div class="file">
                <span style="margin-right: 10px;">${file.name}</span>
                <span style="font-size: 0.8em; color: #666;">(${formatFileSize(file.size)})</span>
              </div>
            `).join('')}
          </div>
          ` : ''}
          
          ${assignment.status === 'Graded' && assignment.feedback ? `
          <div class="feedback">
            <h3>Teacher Feedback</h3>
            <p>${assignment.feedback}</p>
            ${assignment.grade ? `<p><strong>Grade:</strong> ${assignment.grade}</p>` : ''}
          </div>
          ` : ''}
          
          <div class="no-print" style="margin-top: 30px; font-size: 0.8em; color: #999;">
            Printed from Kenyan Tutoring Agency Assignments Hub
          </div>
          
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 200);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-KE', options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-screen h-full flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">{previewFile.name}</h3>
              <button 
                onClick={closePreview}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {previewFile.type.includes('pdf') ? (
                <PDFViewer file={previewFile} />
              ) : previewFile.type.includes('image') ? (
                <div className="flex items-center justify-center h-full">
                  <img 
                    src={previewFile.url} 
                    alt={previewFile.name} 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <FileSearch size={48} className="mx-auto mb-4" />
                    <p>Preview not available for this file type</p>
                    <button
                      onClick={() => handleDownload(previewFile.url, previewFile.name)}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Download className="mr-2" size={16} />
                      Download File
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {formatFileSize(previewFile.size)} • {previewFile.type}
              </span>
              <button
                onClick={() => handleDownload(previewFile.url, previewFile.name)}
                className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="mr-2" size={16} />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Page Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-6 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center">
              <Book className="mr-3 text-indigo-600" size={32} />
               Assignments Hub
            </h1>
            <p className="text-gray-600 mt-2">
              Access all your assignments in one place. Track your progress and learning materials.
            </p>
          </div>
          
          {/* Search and Filter Controls */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
            >
              <Filter className="mr-2 text-gray-700" size={18} />
              Filters
              {Object.values(activeFilters).some(filter => 
                Array.isArray(filter) ? filter.length > 0 : filter !== null
              ) && (
                <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-600 text-xs text-white">
                  {
                    Object.values(activeFilters).reduce((count, filter) => 
                      count + (Array.isArray(filter) ? filter.length : filter !== null ? 1 : 0), 0
                    )
                  }
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Filters Panel */}
        {filtersOpen && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Filter Assignments</h2>
              <button 
                onClick={clearFilters}
                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
              >
                Clear all
                <X className="ml-1" size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Subject Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <BookOpen className="mr-2" size={16} />
                  Subject
                </h3>
                <div className="space-y-2">
                  {['Mathematics', 'Chemistry', 'Biology', 'Physics', 'English', 'Kiswahili', 'History', 'Geography', 'Business Studies', 'Computer Studies'].map(subject => (
                    <label key={subject} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={activeFilters.subject.includes(subject)}
                        onChange={() => handleFilterChange('subject', subject)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Status Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <CheckCircle className="mr-2" size={16} />
                  Status
                </h3>
                <div className="space-y-2">
                  {['Pending', 'Saved', 'Overdue'].map(status => (
                    <label key={status} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={activeFilters.status.includes(status)}
                        onChange={() => handleFilterChange('status', status)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Type Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FileInput className="mr-2" size={16} />
                  Type
                </h3>
                <div className="space-y-2">
                  {['Worksheet', 'Project', 'Essay', 'Quiz', 'Presentation', 'Reading', 'Practical', 'Revision'].map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={activeFilters.type.includes(type)}
                        onChange={() => handleFilterChange('type', type)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Due Date Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Calendar className="mr-2" size={16} />
                  Due Date
                </h3>
                <div className="space-y-2">
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={activeFilters.dueDate || ''}
                    onChange={(e) => handleFilterChange('dueDate', e.target.value || null)}
                  >
                    <option value="">Any time</option>
                    <option value="today">Today</option>
                    <option value="tomorrow">Tomorrow</option>
                    <option value="week">This week</option>
                    <option value="next-week">Next week</option>
                    <option value="month">This month</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Assignments List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredAssignments.length > 0 ? (
          <div className="space-y-4">
            {filteredAssignments.map(assignment => (
              <div 
                key={assignment.id}
                className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${expandedAssignment === assignment.id ? 'ring-2 ring-indigo-500' : 'hover:shadow-lg'}`}
              >
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => toggleAssignmentExpansion(assignment.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-xl font-bold text-gray-900 mr-3">{assignment.title}</h3>
                        {assignment.saved && (
                          <Star className="text-yellow-500 fill-yellow-500" size={18} />
                        )}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          assignment.status === 'Saved' ? 'bg-yellow-100 text-yellow-800' :
                          assignment.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {assignment.status}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <BookOpen className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {assignment.subject} • {assignment.type}
                      </div>
                    </div>
                    <button className="ml-4 flex-shrink-0">
                      {expandedAssignment === assignment.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <span>Assigned: {formatDate(assignment.assignedDate)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <span>Due: {formatDate(assignment.dueDate)}</span>
                      </div>
                    </div>
                    
                    {assignment.points && (
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">
                          {assignment.points} points
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Expanded content */}
                {expandedAssignment === assignment.id && (
                  <div className="border-t border-gray-200 px-6 py-4">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                      <p className="text-gray-600">{assignment.description}</p>
                    </div>
                    
                    {assignment.instructions && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Instructions</h4>
                        <p className="text-gray-600">{assignment.instructions}</p>
                      </div>
                    )}
                    
                    {/* Attachments */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <File className="mr-2" size={16} />
                        Attachments ({assignment.attachments.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {assignment.attachments.map((file, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors duration-200">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 pt-1">
                                {getFileIcon(file.type)}
                              </div>
                              <div className="ml-3 flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(file.size)} • {file.type}</p>
                              </div>
                              <div className="ml-4 flex-shrink-0 flex space-x-2">
                                <button
                                  onClick={() => handlePreview(file)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                  title="Preview"
                                >
                                  <Eye size={18} />
                                </button>
                                <button
                                  onClick={() => handleDownload(file.url, file.name)}
                                  className="text-gray-600 hover:text-gray-900"
                                  title="Download"
                                >
                                  <Download size={18} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex flex-wrap justify-between items-center mt-6">
                      <div className="flex space-x-2 mb-2 sm:mb-0">
                        <button
                          type="button"
                          onClick={() => handleSaveAssignment(assignment.id)}
                          className={`inline-flex items-center px-3 py-2 border shadow-sm text-sm leading-4 font-medium rounded-md ${
                            assignment.saved
                              ? 'bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                        >
                          {assignment.saved ? (
                            <>
                              <Star className="mr-2 fill-yellow-500 text-yellow-500" size={16} />
                              Saved
                            </>
                          ) : (
                            <>
                              <Star className="mr-2" size={16} />
                              Save
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleShareAssignment(assignment)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <Share2 className="mr-2" size={16} />
                          Share
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePrintAssignment(assignment)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <Printer className="mr-2" size={16} />
                          Print
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAssignment(assignment.id)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <Trash2 className="mr-2" size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Notebook className="mx-auto text-gray-400" size={48} />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No assignments found</h3>
            <p className="mt-2 text-gray-600">
              {searchTerm || Object.values(activeFilters).some(f => f.length > 0 || f !== null) 
                ? "We couldn't find any assignments matching your search and filters."
                : "You don't have any assignments right now. Check back later!"}
            </p>
            {(searchTerm || Object.values(activeFilters).some(f => f.length > 0 || f !== null)) && (
              <button
                onClick={clearFilters}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Sample data for Kenyan tutoring agency
const kenyanSampleAssignments = [
  {
    id: 1,
    title: "Chemistry Practical: Acids and Bases",
    subject: "Chemistry",
    type: "Practical",
    status: "Pending",
    assignedDate: "2023-11-15",
    dueDate: "2023-11-22",
    points: 30,
    description: "Conduct experiments to test the pH levels of various household substances and document your findings.",
    instructions: "Follow the lab safety guidelines. Write a detailed report with observations, results, and conclusions. Include photos if possible.",
    attachments: [
      {
        name: "Acids_Bases_Lab_Guide.pdf",
        type: "application/pdf",
        size: 2456789,
        url: "https://example.com/files/chemistry_lab_guide.pdf"
      },
      {
        name: "Lab_Report_Template.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 1876543,
        url: "https://example.com/files/lab_report_template.docx"
      }
    ]
  },
  {
    id: 2,
    title: "Biology: Cell Structure Diagrams",
    subject: "Biology",
    type: "Worksheet",
    status: "Saved",
    saved: true,
    assignedDate: "2023-11-10",
    dueDate: "2023-11-17",
    points: 15,
    description: "Label the diagrams of plant and animal cells with all organelles and describe their functions.",
    instructions: "Use colored pencils for different organelles. Write brief descriptions of each organelle's function.",
    attachments: [
      {
        name: "Cell_Diagrams.pdf",
        type: "application/pdf",
        size: 3456789,
        url: "https://example.com/files/cell_diagrams.pdf"
      },
      {
        name: "Organelle_Functions.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 876543,
        url: "https://example.com/files/organelle_functions.docx"
      }
    ]
  },
  {
    id: 3,
    title: "English: Essay on African Literature",
    subject: "English",
    type: "Essay",
    status: "Overdue",
    assignedDate: "2023-11-05",
    dueDate: "2023-11-12",
    points: 25,
    description: "Write a 1000-word essay analyzing themes in a selected African novel.",
    instructions: "Choose from 'Things Fall Apart', 'Weep Not Child', or 'The River Between'. Include citations and a bibliography.",
    attachments: [
      {
        name: "Essay_Rubric.pdf",
        type: "application/pdf",
        size: 123456,
        url: "https://example.com/files/essay_rubric.pdf"
      },
      {
        name: "Citation_Guide.pdf",
        type: "application/pdf",
        size: 456789,
        url: "https://example.com/files/citation_guide.pdf"
      }
    ]
  },
  {
    id: 4,
    title: "Mathematics: Quadratic Equations",
    subject: "Mathematics",
    type: "Worksheet",
    status: "Pending",
    assignedDate: "2023-11-18",
    dueDate: "2023-11-25",
    points: 20,
    description: "Solve 20 quadratic equations using factorization, completing the square, and quadratic formula methods.",
    instructions: "Show all working. Submit neatly written answers or typed document.",
    attachments: [
      {
        name: "Quadratic_Problems.pdf",
        type: "application/pdf",
        size: 876543,
        url: "https://example.com/files/quadratic_problems.pdf"
      },
      {
        name: "Solution_Methods.pdf",
        type: "application/pdf",
        size: 345678,
        url: "https://example.com/files/solution_methods.pdf"
      }
    ]
  },
  {
    id: 5,
    title: "Geography: Kenya's Physical Features",
    subject: "Geography",
    type: "Project",
    status: "Pending",
    assignedDate: "2023-11-20",
    dueDate: "2023-12-04",
    description: "Create a detailed map of Kenya highlighting major physical features including mountains, lakes, and rivers.",
    instructions: "Can be hand-drawn or digital. Include a key and brief descriptions of each feature.",
    attachments: [
      {
        name: "Kenya_Blank_Map.pdf",
        type: "application/pdf",
        size: 1234567,
        url: "https://example.com/files/kenya_blank_map.pdf"
      },
      {
        name: "Physical_Features_List.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 234567,
        url: "https://example.com/files/physical_features_list.docx"
      }
    ]
  },
  {
    id: 6,
    title: "Business Studies: Case Study Analysis",
    subject: "Business Studies",
    type: "Essay",
    status: "Pending",
    assignedDate: "2023-11-22",
    dueDate: "2023-11-29",
    points: 15,
    description: "Analyze the provided case study of a Kenyan business and answer the questions.",
    instructions: "Write in essay format with clear introduction, analysis, and conclusion. 500-700 words.",
    attachments: [
      {
        name: "Case_Study_Safaricom.pdf",
        type: "application/pdf",
        size: 3456789,
        url: "https://example.com/files/safaricom_case_study.pdf"
      },
      {
        name: "Analysis_Questions.pdf",
        type: "application/pdf",
        size: 123456,
        url: "https://example.com/files/analysis_questions.pdf"
      }
    ]
  },
  {
    id: 7,
    title: "Kiswahili: Insha ya Maelezo",
    subject: "Kiswahili",
    type: "Essay",
    status: "Pending",
    assignedDate: "2023-11-25",
    dueDate: "2023-12-02",
    points: 20,
    description: "Andika insha ya maelezo kuhusu 'Maisha ya Mjini'.",
    instructions: "Insha iwe na maneno 300-400. Tumia lugha sahihi na mwandiko mzuri.",
    attachments: [
      {
        name: "Mfano_Wa_Insha.pdf",
        type: "application/pdf",
        size: 987654,
        url: "https://example.com/files/mfano_wa_insha.pdf"
      }
    ]
  }
];

export default AssignmentsHub;