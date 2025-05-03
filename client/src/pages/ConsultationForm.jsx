import { useState } from 'react';
import { User, Mail, Phone, Calendar, Clock, BookOpen, Send, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

const ConsultationForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    studentGrade: '',
    preferredDate: '',
    preferredTime: '',
    subjectInterest: ''
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
        studentGrade: '',
        preferredDate: '',
        preferredTime: '',
        subjectInterest: ''
      });
      setFormSubmitted(false);
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Book a Consultation</h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {formSubmitted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 p-6 rounded-lg text-center border border-green-100"
        >
          <div className="flex items-center justify-center gap-3">
            <Check className="w-6 h-6 text-green-600" />
            <span className="text-green-800 font-medium">
              Consultation booked successfully! We'll contact you shortly to confirm.
            </span>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" /> Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onFocus={() => setActiveField('name')}
              onBlur={() => setActiveField(null)}
              className={`w-full px-4 py-3 rounded-lg border ${activeField === 'name' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'} focus:outline-none transition`}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" /> Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setActiveField('email')}
                onBlur={() => setActiveField(null)}
                className={`w-full px-4 py-3 rounded-lg border ${activeField === 'email' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'} focus:outline-none transition`}
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-500" /> Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onFocus={() => setActiveField('phone')}
                onBlur={() => setActiveField(null)}
                className={`w-full px-4 py-3 rounded-lg border ${activeField === 'phone' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'} focus:outline-none transition`}
                placeholder="(123) 456-7890"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Student's Grade Level</label>
            <select
              name="studentGrade"
              value={formData.studentGrade}
              onChange={handleChange}
              onFocus={() => setActiveField('studentGrade')}
              onBlur={() => setActiveField(null)}
              className={`w-full px-4 py-3 rounded-lg border ${activeField === 'studentGrade' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'} focus:outline-none transition`}
              required
            >
              <option value="">Select grade level</option>
              <option value="Elementary">Elementary School</option>
              <option value="Middle">Middle School</option>
              <option value="High">High School</option>
              <option value="College">College</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" /> Preferred Date
              </label>
              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                onFocus={() => setActiveField('preferredDate')}
                onBlur={() => setActiveField(null)}
                className={`w-full px-4 py-3 rounded-lg border ${activeField === 'preferredDate' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'} focus:outline-none transition`}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" /> Preferred Time
              </label>
              <select
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                onFocus={() => setActiveField('preferredTime')}
                onBlur={() => setActiveField(null)}
                className={`w-full px-4 py-3 rounded-lg border ${activeField === 'preferredTime' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'} focus:outline-none transition`}
                required
              >
                <option value="">Select time</option>
                <option value="Morning (9AM-12PM)">Morning (9AM-12PM)</option>
                <option value="Afternoon (12PM-4PM)">Afternoon (12PM-4PM)</option>
                <option value="Evening (4PM-8PM)">Evening (4PM-8PM)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-500" /> Subject of Interest
            </label>
            <input
              type="text"
              name="subjectInterest"
              value={formData.subjectInterest}
              onChange={handleChange}
              onFocus={() => setActiveField('subjectInterest')}
              onBlur={() => setActiveField(null)}
              className={`w-full px-4 py-3 rounded-lg border ${activeField === 'subjectInterest' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'} focus:outline-none transition`}
              placeholder="Mathematics, Science, etc."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg hover:opacity-90 transition font-medium text-lg mt-6 flex items-center justify-center gap-2 shadow-lg"
          >
            Book Consultation <Send className="w-5 h-5" />
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default ConsultationForm;