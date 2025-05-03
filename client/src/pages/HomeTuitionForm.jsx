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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Home Tuition Inquiry</h3>
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
              Inquiry submitted! Our team will contact you within 24 hours to discuss your home tuition needs.
            </span>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" /> Parent/Guardian Name
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div>
              <label className="block text-gray-700 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" /> Number of Students
              </label>
              <select
                name="studentCount"
                value={formData.studentCount}
                onChange={handleChange}
                onFocus={() => setActiveField('studentCount')}
                onBlur={() => setActiveField(null)}
                className={`w-full px-4 py-3 rounded-lg border ${activeField === 'studentCount' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'} focus:outline-none transition`}
                required
              >
                <option value="1">1 Student</option>
                <option value="2">2 Students</option>
                <option value="3">3 Students</option>
                <option value="4+">4+ Students</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" /> Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              onFocus={() => setActiveField('address')}
              onBlur={() => setActiveField(null)}
              className={`w-full px-4 py-3 rounded-lg border ${activeField === 'address' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'} focus:outline-none transition`}
              placeholder="123 Main St, City"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Student Grade Level</label>
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

            <div>
              <label className="block text-gray-700 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" /> Subjects Needed
              </label>
              <input
                type="text"
                name="subjects"
                value={formData.subjects}
                onChange={handleChange}
                onFocus={() => setActiveField('subjects')}
                onBlur={() => setActiveField(null)}
                className={`w-full px-4 py-3 rounded-lg border ${activeField === 'subjects' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'} focus:outline-none transition`}
                placeholder="Mathematics, Science, etc."
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Frequency</label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                onFocus={() => setActiveField('frequency')}
                onBlur={() => setActiveField(null)}
                className={`w-full px-4 py-3 rounded-lg border ${activeField === 'frequency' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'} focus:outline-none transition`}
                required
              >
                <option value="">Select frequency</option>
                <option value="Once a week">Once a week</option>
                <option value="Twice a week">Twice a week</option>
                <option value="Three times a week">Three times a week</option>
                <option value="Daily">Daily</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Preferred Days</label>
              <input
                type="text"
                name="preferredDays"
                value={formData.preferredDays}
                onChange={handleChange}
                onFocus={() => setActiveField('preferredDays')}
                onBlur={() => setActiveField(null)}
                className={`w-full px-4 py-3 rounded-lg border ${activeField === 'preferredDays' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'} focus:outline-none transition`}
                placeholder="Mon, Wed, Fri"
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
                <option value="Morning (8AM-12PM)">Morning (8AM-12PM)</option>
                <option value="Afternoon (12PM-4PM)">Afternoon (12PM-4PM)</option>
                <option value="Evening (4PM-8PM)">Evening (4PM-8PM)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg hover:opacity-90 transition font-medium text-lg mt-6 flex items-center justify-center gap-2 shadow-lg"
          >
            Request Home Tuition <Send className="w-5 h-5" />
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default HomeTuitionForm;