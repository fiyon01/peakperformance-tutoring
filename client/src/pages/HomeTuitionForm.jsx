import { useState } from 'react';
import { Home, User, Mail, Phone, MapPin, BookOpen, Clock, Users, Send, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

const HomeTuitionForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    studentGrade: '',
    subjects: '',
    frequency: '',
    preferredDays: '',
    preferredTime: '',
    studentCount: '1'
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeField, setActiveField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        studentGrade: '',
        subjects: '',
        frequency: '',
        preferredDays: '',
        preferredTime: '',
        studentCount: '1'
      });
      setFormSubmitted(false);
    }, 3000);
  };

  // Generate grade options
  const gradeOptions = [
    { category: 'Primary School', grades: Array.from({ length: 6 }, (_, i) => `Grade ${i + 1}`) },
    { category: 'Secondary School', grades: ['Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5'] },
    { category: 'Pre-University', grades: ['Form 6 (Lower)', 'Form 6 (Upper)'] }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 bg-white rounded-xl shadow-2xl border border-gray-100 max-w-3xl mx-auto"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Home Tuition Inquiry</h3>
          <p className="text-gray-600 mt-1">Fill out the form and we'll match you with the perfect tutor</p>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {formSubmitted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 p-6 rounded-lg text-center border border-green-200 shadow-sm"
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="text-green-800 font-medium text-lg">Inquiry submitted successfully!</h4>
            <p className="text-green-700 mt-1">
              Our team will contact you within 24 hours to discuss your home tuition needs.
            </p>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-gray-700 mb-2 flex items-center gap-2 text-sm font-medium">
                <User className="w-4 h-4 text-blue-600" /> Parent/Guardian Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setActiveField('name')}
                onBlur={() => setActiveField(null)}
                className={`w-full px-4 py-3 rounded-lg border-2 ${activeField === 'name' ? 'border-blue-500 ring-4 ring-blue-100 bg-blue-50' : 'border-gray-200 hover:border-gray-300'} focus:outline-none transition-all duration-200 bg-white text-gray-800 placeholder-gray-400`}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-gray-700 mb-2 flex items-center gap-2 text-sm font-medium">
                <Mail className="w-4 h-4 text-blue-600" /> Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setActiveField('email')}
                onBlur={() => setActiveField(null)}
                className={`w-full px-4 py-3 rounded-lg border-2 ${activeField === 'email' ? 'border-blue-500 ring-4 ring-blue-100 bg-blue-50' : 'border-gray-200 hover:border-gray-300'} focus:outline-none transition-all duration-200 bg-white text-gray-800 placeholder-gray-400`}
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-gray-700 mb-2 flex items-center gap-2 text-sm font-medium">
                <Phone className="w-4 h-4 text-blue-600" /> Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onFocus={() => setActiveField('phone')}
                onBlur={() => setActiveField(null)}
                className={`w-full px-4 py-3 rounded-lg border-2 ${activeField === 'phone' ? 'border-blue-500 ring-4 ring-blue-100 bg-blue-50' : 'border-gray-200 hover:border-gray-300'} focus:outline-none transition-all duration-200 bg-white text-gray-800 placeholder-gray-400`}
                placeholder="(123) 456-7890"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-gray-700 mb-2 flex items-center gap-2 text-sm font-medium">
                <Users className="w-4 h-4 text-blue-600" /> Number of Students
              </label>
              <select
                name="studentCount"
                value={formData.studentCount}
                onChange={handleChange}
                onFocus={() => setActiveField('studentCount')}
                onBlur={() => setActiveField(null)}
                className={`w-full px-4 py-3 rounded-lg border-2 ${activeField === 'studentCount' ? 'border-blue-500 ring-4 ring-blue-100 bg-blue-50' : 'border-gray-200 hover:border-gray-300'} focus:outline-none transition-all duration-200 bg-white text-gray-800 appearance-none`}
                required
              >
                <option value="1">1 Student</option>
                <option value="2">2 Students</option>
                <option value="3">3 Students</option>
                <option value="4+">4+ Students</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-gray-700 mb-2 flex items-center gap-2 text-sm font-medium">
              <MapPin className="w-4 h-4 text-blue-600" /> Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              onFocus={() => setActiveField('address')}
              onBlur={() => setActiveField(null)}
              className={`w-full px-4 py-3 rounded-lg border-2 ${activeField === 'address' ? 'border-blue-500 ring-4 ring-blue-100 bg-blue-50' : 'border-gray-200 hover:border-gray-300'} focus:outline-none transition-all duration-200 bg-white text-gray-800 placeholder-gray-400`}
              placeholder="123 Main St, City"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-gray-700 mb-2 text-sm font-medium">Student Grade Level</label>
              <select
                name="studentGrade"
                value={formData.studentGrade}
                onChange={handleChange}
                onFocus={() => setActiveField('studentGrade')}
                onBlur={() => setActiveField(null)}
                className={`w-full px-4 py-3 rounded-lg border-2 ${activeField === 'studentGrade' ? 'border-blue-500 ring-4 ring-blue-100 bg-blue-50' : 'border-gray-200 hover:border-gray-300'} focus:outline-none transition-all duration-200 bg-white text-gray-800 appearance-none`}
                required
              >
                <option value="">Select grade level</option>
                {gradeOptions.map((group, index) => (
                  <optgroup label={group.category} key={index}>
                    {group.grades.map((grade, i) => (
                      <option value={grade} key={i}>{grade}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-gray-700 mb-2 flex items-center gap-2 text-sm font-medium">
                <BookOpen className="w-4 h-4 text-blue-600" /> Subjects Needed
              </label>
              <input
                type="text"
                name="subjects"
                value={formData.subjects}
                onChange={handleChange}
                onFocus={() => setActiveField('subjects')}
                onBlur={() => setActiveField(null)}
                className={`w-full px-4 py-3 rounded-lg border-2 ${activeField === 'subjects' ? 'border-blue-500 ring-4 ring-blue-100 bg-blue-50' : 'border-gray-200 hover:border-gray-300'} focus:outline-none transition-all duration-200 bg-white text-gray-800 placeholder-gray-400`}
                placeholder="Mathematics, Science, etc."
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="block text-gray-700 mb-2 text-sm font-medium">Frequency</label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                onFocus={() => setActiveField('frequency')}
                onBlur={() => setActiveField(null)}
                className={`w-full px-4 py-3 rounded-lg border-2 ${activeField === 'frequency' ? 'border-blue-500 ring-4 ring-blue-100 bg-blue-50' : 'border-gray-200 hover:border-gray-300'} focus:outline-none transition-all duration-200 bg-white text-gray-800 appearance-none`}
                required
              >
                <option value="">Select frequency</option>
                <option value="Once a week">Once a week</option>
                <option value="Twice a week">Twice a week</option>
                <option value="Three times a week">Three times a week</option>
                <option value="Daily">Daily</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-gray-700 mb-2 text-sm font-medium">Preferred Days</label>
              <input
                type="text"
                name="preferredDays"
                value={formData.preferredDays}
                onChange={handleChange}
                onFocus={() => setActiveField('preferredDays')}
                onBlur={() => setActiveField(null)}
                className={`w-full px-4 py-3 rounded-lg border-2 ${activeField === 'preferredDays' ? 'border-blue-500 ring-4 ring-blue-100 bg-blue-50' : 'border-gray-200 hover:border-gray-300'} focus:outline-none transition-all duration-200 bg-white text-gray-800 placeholder-gray-400`}
                placeholder="Mon, Wed, Fri"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-gray-700 mb-2 flex items-center gap-2 text-sm font-medium">
                <Clock className="w-4 h-4 text-blue-600" /> Preferred Time
              </label>
              <select
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                onFocus={() => setActiveField('preferredTime')}
                onBlur={() => setActiveField(null)}
                className={`w-full px-4 py-3 rounded-lg border-2 ${activeField === 'preferredTime' ? 'border-blue-500 ring-4 ring-blue-100 bg-blue-50' : 'border-gray-200 hover:border-gray-300'} focus:outline-none transition-all duration-200 bg-white text-gray-800 appearance-none`}
                required
              >
                <option value="">Select time</option>
                <option value="Morning (8AM-12PM)">Morning (8AM-12PM)</option>
                <option value="Afternoon (12PM-4PM)">Afternoon (12PM-4PM)</option>
                <option value="Evening (4PM-8PM)">Evening (4PM-8PM)</option>
                <option value="Custom Time">Custom Time (Specify in notes)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg hover:opacity-90 transition-all duration-200 font-medium text-lg mt-6 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            Request Home Tuition <Send className="w-5 h-5" />
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default HomeTuitionForm;