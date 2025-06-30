import React,{ useState, useEffect } from 'react';
import { 
  Search, Filter, X, Calendar, Clock, MapPin, DollarSign, 
  BookOpen, User, Mail, Phone, CreditCard, ChevronRight,
  Check, Loader2, AlertCircle
} from 'lucide-react';

const ProgrammesPage = () => {
  const [programmes, setProgrammes] = useState([]);
  const [filteredProgrammes, setFilteredProgrammes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedProgramme, setSelectedProgramme] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    subject: [],
    dateRange: null,
    duration: [],
    location: []
  });

  // Sample data - in a real app this would come from an API
  useEffect(() => {
    const fetchProgrammes = async () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setProgrammes(sampleProgrammes);
        setFilteredProgrammes(sampleProgrammes);
        setIsLoading(false);
      }, 800);
    };
    
    fetchProgrammes();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let results = [...programmes];
    
    // Apply search
    if (searchTerm) {
      results = results.filter(programme => 
        programme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        programme.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply filters
    if (activeFilters.subject.length > 0) {
      results = results.filter(programme => 
        activeFilters.subject.includes(programme.subject)
      );
    }
    
    if (activeFilters.duration.length > 0) {
      results = results.filter(programme => 
        activeFilters.duration.includes(programme.duration)
      );
    }
    
    if (activeFilters.location.length > 0) {
      results = results.filter(programme => 
        activeFilters.location.includes(programme.locationType)
      );
    }
    
    // Date range filter would be more complex in a real implementation
    
    setFilteredProgrammes(results);
  }, [searchTerm, activeFilters, programmes]);

  const handleFilterChange = (filterType, value) => {
    setActiveFilters(prev => {
      if (filterType === 'dateRange') {
        return { ...prev, dateRange: value };
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
      dateRange: null,
      duration: [],
      location: []
    });
    setSearchTerm('');
  };

  const openRegistrationModal = (programme) => {
    setSelectedProgramme(programme);
    setIsModalOpen(true);
    setRegistrationStep(1);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedProgramme(null);
    }, 300); // Wait for animation to complete
  };

  const nextRegistrationStep = () => {
    setRegistrationStep(prev => prev + 1);
  };

  const prevRegistrationStep = () => {
    setRegistrationStep(prev => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-6 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center">
              <BookOpen className="mr-3 text-indigo-600" size={32} />
              Explore Programmes
            </h1>
            <p className="text-gray-600 mt-2">
              Discover our premium holiday combined programmes designed for peak performance
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
                placeholder="Search programmes..."
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
              <h2 className="text-xl font-semibold text-gray-900">Filter Programmes</h2>
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
                  {['Mathematics', 'Science', 'English', 'Coding'].map(subject => (
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
              
              {/* Duration Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Clock className="mr-2" size={16} />
                  Duration
                </h3>
                <div className="space-y-2">
                  {['1 Week', '2 Weeks', '3 Weeks', '4 Weeks'].map(duration => (
                    <label key={duration} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={activeFilters.duration.includes(duration)}
                        onChange={() => handleFilterChange('duration', duration)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{duration}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Location Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MapPin className="mr-2" size={16} />
                  Location
                </h3>
                <div className="space-y-2">
                  {['On-site', 'Online'].map(location => (
                    <label key={location} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={activeFilters.location.includes(location)}
                        onChange={() => handleFilterChange('location', location)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{location}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Date Range Filter - Simplified for this example */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Calendar className="mr-2" size={16} />
                  Date Range
                </h3>
                <div className="space-y-2">
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={activeFilters.dateRange || ''}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value || null)}
                  >
                    <option value="">Any time</option>
                    <option value="december">December Holidays</option>
                    <option value="june">June Holidays</option>
                    <option value="march">March Holidays</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Programme Listings */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-indigo-600" size={48} />
          </div>
        ) : filteredProgrammes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProgrammes.map(programme => (
              <div 
                key={programme.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                  {programme.image ? (
                    <img 
                      src={programme.image} 
                      alt={programme.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="text-white opacity-80" size={64} />
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{programme.name}</h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {programme.subject}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{programme.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="mr-2 text-indigo-500" size={18} />
                      <span>{programme.date}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock className="mr-2 text-indigo-500" size={18} />
                      <span>{programme.time}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock className="mr-2 text-indigo-500" size={18} />
                      <span>{programme.duration}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <MapPin className="mr-2 text-indigo-500" size={18} />
                      <span>{programme.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-gray-900 flex items-center">
                      <DollarSign className="text-indigo-600 mr-1" size={20} />
                      {programme.price}
                    </div>
                    <button
                      onClick={() => openRegistrationModal(programme)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
                    >
                      Register
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <AlertCircle className="mx-auto text-gray-400" size={48} />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No programmes found</h3>
            <p className="mt-2 text-gray-600">
              We couldn't find any programmes matching your search and filters.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
      
      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity" 
              aria-hidden="true"
              onClick={closeModal}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            {/* Modal content */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl leading-6 font-bold text-gray-900">
                        Register for {selectedProgramme?.name}
                      </h3>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={closeModal}
                      >
                        <X size={24} />
                      </button>
                    </div>
                    
                    {/* Progress indicator */}
                    <div className="mt-6 mb-8">
                      <div className="flex items-center">
                        {[1, 2, 3].map((step) => (
                          <React.Fragment key={step}>
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${registrationStep >= step ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                              {step}
                            </div>
                            {step < 3 && (
                              <div className={`flex-1 h-1 mx-2 ${registrationStep > step ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      <div className="flex justify-between mt-2 text-sm text-gray-600">
                        <span className={registrationStep >= 1 ? 'text-indigo-600 font-medium' : ''}>Student Details</span>
                        <span className={registrationStep >= 2 ? 'text-indigo-600 font-medium' : ''}>Parent Details</span>
                        <span className={registrationStep >= 3 ? 'text-indigo-600 font-medium' : ''}>Confirmation</span>
                      </div>
                    </div>
                    
                    {/* Form content based on step */}
                    {registrationStep === 1 && (
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium text-gray-900 flex items-center">
                          <User className="mr-2 text-indigo-600" size={20} />
                          Student Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                              First Name
                            </label>
                            <input
                              type="text"
                              id="firstName"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                          <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                              Last Name
                            </label>
                            <input
                              type="text"
                              id="lastName"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                            Current Grade/Year
                          </label>
                          <select
                            id="grade"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option>Select grade/year</option>
                            <option>Primary 1</option>
                            <option>Primary 2</option>
                            <option>Primary 3</option>
                            <option>Primary 4</option>
                            <option>Primary 5</option>
                            <option>Primary 6</option>
                            <option>Secondary 1</option>
                            <option>Secondary 2</option>
                            <option>Secondary 3</option>
                            <option>Secondary 4</option>
                          </select>
                        </div>
                      </div>
                    )}
                    
                    {registrationStep === 2 && (
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium text-gray-900 flex items-center">
                          <User className="mr-2 text-indigo-600" size={20} />
                          Parent/Guardian Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="parentFirstName" className="block text-sm font-medium text-gray-700">
                              First Name
                            </label>
                            <input
                              type="text"
                              id="parentFirstName"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                          <div>
                            <label htmlFor="parentLastName" className="block text-sm font-medium text-gray-700">
                              Last Name
                            </label>
                            <input
                              type="text"
                              id="parentLastName"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="parentEmail" className="block text-sm font-medium text-gray-700">
                              Email
                            </label>
                            <input
                              type="email"
                              id="parentEmail"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                          <div>
                            <label htmlFor="parentPhone" className="block text-sm font-medium text-gray-700">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              id="parentPhone"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="relationship" className="block text-sm font-medium text-gray-700">
                            Relationship to Student
                          </label>
                          <select
                            id="relationship"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option>Select relationship</option>
                            <option>Parent</option>
                            <option>Guardian</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>
                    )}
                    
                    {registrationStep === 3 && (
                      <div className="space-y-6">
                        <div className="bg-indigo-50 p-4 rounded-lg">
                          <h4 className="text-lg font-medium text-indigo-800 mb-2">Programme Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center">
                              <Calendar className="mr-2 text-indigo-600" size={18} />
                              <span>{selectedProgramme?.date}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="mr-2 text-indigo-600" size={18} />
                              <span>{selectedProgramme?.time}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="mr-2 text-indigo-600" size={18} />
                              <span>{selectedProgramme?.location}</span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="mr-2 text-indigo-600" size={18} />
                              <span className="font-bold">{selectedProgramme?.price}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="flex items-start">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              I agree to the Terms and Conditions and Privacy Policy
                            </span>
                          </label>
                        </div>
                        
                        <div>
                          <label className="flex items-start">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              I would like to receive updates about future programmes
                            </span>
                          </label>
                        </div>
                        
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                          <h4 className="text-lg font-medium text-yellow-800 mb-2 flex items-center">
                            <AlertCircle className="mr-2" size={20} />
                            Payment Information
                          </h4>
                          <p className="text-sm text-yellow-700">
                            After submitting this form, you will be redirected to our secure payment portal to complete your registration.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {registrationStep < 3 ? (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200 transform hover:scale-105"
                    onClick={nextRegistrationStep}
                  >
                    Next
                    <ChevronRight className="ml-2" size={18} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200 transform hover:scale-105"
                  >
                    Submit Registration
                    <Check className="ml-2" size={18} />
                  </button>
                )}
                
                {registrationStep > 1 ? (
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={prevRegistrationStep}
                  >
                    Back
                  </button>
                ) : (
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sample data
const sampleProgrammes = [
  {
    id: 1,
    name: "Math Mastery Intensive",
    subject: "Mathematics",
    description: "A comprehensive programme covering advanced mathematical concepts and problem-solving techniques.",
    date: "Dec 5-9, 2023",
    time: "9:00 AM - 12:00 PM",
    duration: "1 Week",
    location: "Main Campus",
    locationType: "On-site",
    price: "$299",
    image: null
  },
  {
    id: 2,
    name: "Science Explorers",
    subject: "Science",
    description: "Hands-on experiments and interactive learning for young scientists.",
    date: "Dec 12-16, 2023",
    time: "1:00 PM - 4:00 PM",
    duration: "1 Week",
    location: "Online",
    locationType: "Online",
    price: "$249",
    image: null
  },
  {
    id: 3,
    name: "English Excellence",
    subject: "English",
    description: "Improve reading comprehension, writing skills, and vocabulary development.",
    date: "Dec 5-16, 2023",
    time: "10:00 AM - 1:00 PM",
    duration: "2 Weeks",
    location: "North Campus",
    locationType: "On-site",
    price: "$399",
    image: null
  },
  {
    id: 4,
    name: "Coding Bootcamp",
    subject: "Coding",
    description: "Introduction to programming concepts using Python and JavaScript.",
    date: "Dec 19-23, 2023",
    time: "9:00 AM - 3:00 PM",
    duration: "1 Week",
    location: "Tech Hub",
    locationType: "On-site",
    price: "$349",
    image: null
  }
];

export default ProgrammesPage;