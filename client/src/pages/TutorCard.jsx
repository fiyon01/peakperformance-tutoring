import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Crown, ChevronRight, X, Mail, Phone, BookOpen, User, Check } from 'lucide-react';
import { useState } from 'react';

const TutorCard = ({ tutor, getInitials, variants }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Tutoring request submitted:', {
      tutor: tutor.name,
      ...formData
    });
    setRequestSent(true);
    setTimeout(() => {
      setIsProfileOpen(false);
      setRequestSent(false);
    }, 2000);
  };

  return (
    <>
      {/* Tutor Card */}
      <motion.div
        variants={variants}
        whileHover={{ y: -5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all relative group h-full flex flex-col"
      >
        {tutor.isFounder && (
          <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center z-10">
            <Crown className="w-3 h-3 mr-1" />
            Founder
          </div>
        )}
        
        <div className="p-6 flex-grow">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 relative">
              {tutor.image ? (
                <img 
                  src={tutor.image} 
                  alt={tutor.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : (
                <div 
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${tutor.avatarColor} flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform`}
                >
                  {getInitials(tutor.name)}
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {tutor.name}
              </h3>
              
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <GraduationCap className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="truncate">{tutor.qualification}</span>
              </div>
              
              <div className="mt-3">
                <div className="text-sm font-medium text-gray-500 mb-1">Subjects:</div>
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.map((subject, i) => (
                    <span 
                      key={i}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 group-hover:bg-indigo-200 transition-colors"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 pb-4">
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="w-full flex items-center justify-between px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            View Profile
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Tutor Profile Modal */}
      <AnimatePresence>
        {isProfileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
            onClick={() => setIsProfileOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{tutor.name}</h2>
                    {tutor.isFounder && (
                      <span className="inline-flex items-center mt-1 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-medium">
                        <Crown className="w-3 h-3 mr-1" />
                        Founder
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => setIsProfileOpen(false)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    {tutor.image ? (
                      <img 
                        src={tutor.image} 
                        alt={tutor.name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-32 h-32 rounded-full bg-gradient-to-br ${tutor.avatarColor} flex items-center justify-center text-white font-bold text-4xl ${tutor.image ? 'hidden' : ''}`}
                    >
                      {getInitials(tutor.name)}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          <GraduationCap className="w-5 h-5 mr-2 text-indigo-600" />
                          Qualifications
                        </h3>
                        <p className="mt-1 text-gray-600">{tutor.qualification}</p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
                          Subjects Taught
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {tutor.subjects.map((subject, i) => (
                            <span 
                              key={i}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <Mail className="w-5 h-5 mr-2 text-indigo-600" />
                          <span className="text-gray-600">tutor@peakperformance.com</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-5 h-5 mr-2 text-indigo-600" />
                          <span className="text-gray-600">+254 700 123456</span>
                        </div>
                      </div>

                      <div className="pt-4">
                        <h3 className="text-lg font-semibold text-gray-900">About</h3>
                        <p className="mt-2 text-gray-600">
                          {tutor.bio || `With ${Math.floor(Math.random() * 10) + 5} years of teaching experience, ${tutor.name.split(' ')[0]} specializes in making complex concepts easy to understand. Their student-centered approach has helped hundreds of students achieve academic success.`}
                        </p>
                      </div>
                    </div>

                    {/* Request Tutoring Form */}
                    <div className="mt-8 border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Tutoring</h3>
                      
                      {requestSent ? (
                        <div className="bg-green-50 text-green-800 p-4 rounded-lg flex items-center">
                          <Check className="w-5 h-5 mr-2" />
                          Request sent successfully! We'll contact you shortly.
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit}>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
                              <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                              />
                            </div>
                            <div>
                              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                              <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                              />
                            </div>
                            <div>
                              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                              <input
                                type="tel"
                                id="phone"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                              />
                            </div>
                            <div>
                              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                              <select
                                id="subject"
                                name="subject"
                                required
                                value={formData.subject}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                              >
                                <option value="">Select a subject</option>
                                {tutor.subjects.map((subject, i) => (
                                  <option key={i} value={subject}>{subject}</option>
                                ))}
                              </select>
                            </div>
                            <div className="sm:col-span-2">
                              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                              <textarea
                                id="message"
                                name="message"
                                rows={3}
                                value={formData.message}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                placeholder="Any specific topics or scheduling preferences?"
                              />
                            </div>
                          </div>
                          <div className="mt-4">
                            <button
                              type="submit"
                              className="w-full px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                              Send Request
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TutorCard;