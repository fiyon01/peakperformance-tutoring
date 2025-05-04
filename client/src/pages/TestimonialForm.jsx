import { useState, useEffect } from 'react';
import { Star, MessageSquare, Send, Check, AlertCircle, ChevronDown, User2, Users, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const TestimonialForm = () => {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [testimonialText, setTestimonialText] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [ratingError, setRatingError] = useState(false);
  const [userType, setUserType] = useState(null);
  const [showUserTypeDropdown, setShowUserTypeDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
    setRatingError(false);
    setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (rating === 0) {
      setRatingError(true);
      setSubmitError('Please select a rating');
      return;
    }
    
    if (!userType) {
      setSubmitError('Please select whether you are a parent or student');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post("http://192.168.100.2:3500/api/ratings", {
        name,
        email,
        phone,
        rating,
        testimonialText,
        userType
      });

      if (response.status === 201) {
        setFormSubmitted(true);
        // Reset form
        setName('');
        setEmail('');
        setPhone('');
        setTestimonialText('');
        setRating(0);
        setUserType(null);
        setRatingError(false);
        setSubmitError('');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitError(err.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const userTypes = [
    { id: 'parent', label: 'Parent', icon: <Users className="w-5 h-5" /> },
    { id: 'student', label: 'Student', icon: <User2 className="w-5 h-5" /> }
  ];


  // Inside the component:
useEffect(() => {
  let successTimeout;
  let errorTimeout;

  if (formSubmitted) {
    // Hide the thank-you message after 5 seconds
    successTimeout = setTimeout(() => {
      setFormSubmitted(false);
    }, 5000);
  }

  if (submitError) {
    // Auto-clear error message after 4 seconds
    errorTimeout = setTimeout(() => {
      setSubmitError('');
    }, 4000);
  }

  return () => {
    clearTimeout(successTimeout);
    clearTimeout(errorTimeout);
  };
}, [formSubmitted, submitError]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 shadow-xl border border-white/10"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <MessageSquare className="w-6 h-6" /> Share Your Experience
      </h2>
      <p className="text-blue-100 mb-8">We value your feedback to help us improve</p>

      {formSubmitted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/20 p-6 rounded-lg text-center border border-white/20"
        >
          <div className="flex items-center justify-center gap-3">
            <Check className="w-6 h-6 text-white" />
            <span className="text-white font-medium">Thank you for your testimonial!</span>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {submitError && (
            <div className="bg-red-500/20 p-3 rounded-lg flex items-center gap-2 text-red-100">
              <AlertCircle className="w-5 h-5" />
              <span>{submitError}</span>
            </div>
          )}

          {/* User Type Selector */}
          <div className="relative">
            <label className="block text-blue-100 font-medium mb-3">You are submitting as:</label>
            <button
              type="button"
              onClick={() => setShowUserTypeDropdown(!showUserTypeDropdown)}
              className={`w-full px-5 py-3 rounded-lg bg-white/10 border ${userType ? 'border-emerald-400/50' : 'border-white/30'} text-white flex items-center justify-between`}
            >
              <div className="flex items-center gap-3">
                {userType ? (
                  <>
                    {userTypes.find(type => type.id === userType)?.icon}
                    <span>{userTypes.find(type => type.id === userType)?.label}</span>
                  </>
                ) : (
                  <span className="text-blue-200">Select your role</span>
                )}
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${showUserTypeDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showUserTypeDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute z-10 mt-1 w-full bg-white/90 rounded-lg shadow-lg overflow-hidden border border-white/20"
              >
                {userTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                      setUserType(type.id);
                      setShowUserTypeDropdown(false);
                    }}
                    className="w-full px-5 py-3 text-left hover:bg-white/80 transition flex items-center gap-3 text-gray-800"
                  >
                    {type.icon}
                    {type.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Rating */}
          <div>
            <label className="block text-blue-100 font-medium mb-3">Your Rating</label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => handleRatingClick(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${star <= rating ? 'text-yellow-300 fill-yellow-300' : 'text-blue-300'}`}
                  />
                </button>
              ))}
            </div>
            {ratingError && (
              <p className="text-red-300 text-sm mt-2 flex items-center justify-center gap-1">
                <AlertCircle className="w-4 h-4" /> Please select a rating
              </p>
            )}
          </div>

          {/* Form Fields */}
          <div>
            <label htmlFor="name" className="block text-blue-100 font-medium mb-3">Your Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setActiveField('name')}
              onBlur={() => setActiveField(null)}
              className={`w-full px-5 py-3 rounded-lg bg-white/10 border-2 ${activeField === 'name' ? 'border-blue-300' : 'border-white/20'} text-white placeholder-blue-200 focus:outline-none`}
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-blue-100 font-medium mb-3">Your Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setActiveField('email')}
              onBlur={() => setActiveField(null)}
              className={`w-full px-5 py-3 rounded-lg bg-white/10 border-2 ${activeField === 'email' ? 'border-blue-300' : 'border-white/20'} text-white placeholder-blue-200 focus:outline-none`}
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-blue-100 font-medium mb-3">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onFocus={() => setActiveField('phone')}
              onBlur={() => setActiveField(null)}
              className={`w-full px-5 py-3 rounded-lg bg-white/10 border-2 ${activeField === 'phone' ? 'border-blue-300' : 'border-white/20'} text-white placeholder-blue-200 focus:outline-none`}
              placeholder="(123) 456-7890"
              required
            />
          </div>

          <div>
            <label htmlFor="testimonial" className="block text-blue-100 font-medium mb-3">Your Testimonial</label>
            <textarea
              id="testimonial"
              rows="4"
              value={testimonialText}
              onChange={(e) => setTestimonialText(e.target.value)}
              onFocus={() => setActiveField('testimonial')}
              onBlur={() => setActiveField(null)}
              className={`w-full px-5 py-3 rounded-lg bg-white/10 border-2 ${activeField === 'testimonial' ? 'border-blue-300' : 'border-white/20'} text-white placeholder-blue-200 focus:outline-none`}
              placeholder="Share your experience..."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-lg font-medium text-lg mt-6 flex items-center justify-center gap-2 shadow-lg ${isSubmitting ? 'bg-blue-500 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-gray-100'}`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Testimonial <Send className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default TestimonialForm;