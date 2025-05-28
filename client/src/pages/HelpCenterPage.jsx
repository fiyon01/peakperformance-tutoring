import { useState, useEffect } from 'react';
import { 
  HelpCircle, Search, BookOpen, CreditCard, Settings, 
  MessageSquare, Phone, Mail, ChevronDown, ChevronUp,
  FileText, Lightbulb, User, Laptop, Calendar, CheckCircle,
  X, Send, AlertCircle, Loader2, Smile, Frown
} from 'lucide-react';

const HelpCenterPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [expandedArticle, setExpandedArticle] = useState(null);
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('idle'); // 'idle', 'submitting', 'success', 'error'
  const [chatAvailable, setChatAvailable] = useState(true);

  const categories = [
    { id: 'getting-started', name: 'Getting Started', icon: <CheckCircle className="w-5 h-5" /> },
    { id: 'programs', name: 'Programme Support', icon: <Calendar className="w-5 h-5" /> },
    { id: 'account', name: 'Account & Billing', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'technical', name: 'Technical Help', icon: <Laptop className="w-5 h-5" /> },
    { id: 'resources', name: 'Learning Resources', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'faqs', name: 'FAQs', icon: <HelpCircle className="w-5 h-5" /> }
  ];

  const articles = [
    { 
      id: 1,
      title: 'How to access your academic reports',
      category: 'programs',
      content: 'You can access your academic reports by navigating to the "Academic Reports" section in your dashboard. All available reports will be listed there with download options. If you cannot see a report you expect, please allow 48 hours after the programme completion for processing.',
      popular: true
    },
    { 
      id: 2,
      title: 'Updating your payment method',
      category: 'account',
      content: 'To update your payment method: 1) Go to Account Settings, 2) Select "Payment Methods", 3) Click "Add Payment Method", 4) Enter your new card details, 5) Click "Save". Your new payment method will be available for future transactions.',
      popular: true
    },
    { 
      id: 3,
      title: 'System requirements for virtual sessions',
      category: 'technical',
      content: 'For optimal experience, we recommend: - Windows 10/macOS 10.15 or later - Chrome/Firefox/Safari (latest versions) - Minimum 10 Mbps internet connection - Webcam and microphone - Headphones recommended. Mobile devices are supported but desktop is preferred for full functionality.',
      popular: false
    },
    { 
      id: 4,
      title: 'Changing your account password',
      category: 'account',
      content: 'To change your password: 1) Go to Account Settings, 2) Select "Security", 3) Click "Change Password", 4) Enter your current password, 5) Enter and confirm your new password, 6) Click "Update Password". You will receive a confirmation email once completed.',
      popular: true
    },
    { 
      id: 5,
      title: 'Attendance tracking in programmes',
      category: 'programs',
      content: 'Attendance is automatically tracked when you join live sessions. For in-person programmes, your tutor will mark attendance. You can view your attendance record in the "Programme Details" section for each enrolled programme. Please contact support if you believe there is an error in your attendance record.',
      popular: false
    },
    { 
      id: 6,
      title: 'Recommended study materials',
      category: 'resources',
      content: 'Each programme has recommended study materials listed in the "Resources" section. These may include: - Required textbooks - Supplementary readings - Practice problems - Video resources. Some materials are provided digitally, others you may need to purchase separately.',
      popular: false
    }
  ];

  const faqs = [
    {
      id: 1,
      question: 'When will I receive my programme schedule?',
      answer: 'Programme schedules are typically released 2 weeks before the start date. You will receive an email notification and can find it in your dashboard under "My Programmes".'
    },
    {
      id: 2,
      question: 'Can I switch to a different programme after registering?',
      answer: 'Programme switches are possible up to 7 days before the start date, subject to availability. Please contact our support team to discuss options.'
    },
    {
      id: 3,
      question: 'What is your refund policy?',
      answer: 'We offer full refunds up to 14 days before programme start. After that, partial refunds may be available depending on circumstances. See our full policy in Terms & Conditions.'
    }
  ];

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const results = articles.filter(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  }, [searchQuery]);

  const filteredArticles = activeCategory 
    ? articles.filter(article => article.category === activeCategory)
    : articles.filter(article => article.popular);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitSupportRequest = (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Simulate API call
    setTimeout(() => {
      // Randomly simulate success or error for demo
      const isSuccess = Math.random() > 0.2;
      setFormStatus(isSuccess ? 'success' : 'error');
      
      if (isSuccess) {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      }
    }, 2000);
  };

  const handleFeedbackClick = (e, articleId, isHelpful) => {
    e.stopPropagation();
    // Handle feedback logic here
    console.log(`Feedback for article ${articleId}: ${isHelpful ? 'helpful' : 'not helpful'}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="bg-indigo-100 p-3 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Help Center</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            How can we help you today? Find answers, guides, or contact our support team.
          </p>
        </div>
        
        {/* Search Area */}
        <div className="relative mb-10 max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search help articles..."
            className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-500" />
            </button>
          )}
        </div>
        
        {/* Search Results */}
        {searchQuery && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Search className="w-5 h-5 text-indigo-600 mr-2" />
              Search Results for "{searchQuery}"
            </h2>
            
            {searchResults.length > 0 ? (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {searchResults.map(article => (
                    <li key={article.id} className="hover:bg-gray-50 transition-colors">
                      <div className="w-full text-left p-5">
                        <div
                          className="cursor-pointer"
                          onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium text-gray-800 mb-1">{article.title}</h3>
                              <p className="text-sm text-gray-500">
                                {categories.find(c => c.id === article.category)?.name}
                              </p>
                            </div>
                            {expandedArticle === article.id ? (
                              <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                        
                        {expandedArticle === article.id && (
                          <div className="mt-3 text-gray-700">
                            <p>{article.content}</p>
                            <div className="mt-3 flex items-center space-x-2">
                              <span className="text-gray-600">Was this helpful?</span>
                              <button
                                onClick={(e) => handleFeedbackClick(e, article.id, true)}
                                className="p-1 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-50"
                                aria-label="Mark as helpful"
                              >
                                <Smile className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => handleFeedbackClick(e, article.id, false)}
                                className="p-1 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-50"
                                aria-label="Mark as not helpful"
                              >
                                <Frown className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 text-center">
                <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No results found</h3>
                <p className="text-gray-500 mb-4">
                  We couldn't find any articles matching "{searchQuery}". Try different keywords or browse our categories below.
                </p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Main Content (when not searching) */}
        {!searchQuery && (
          <>
            {/* Browse Categories */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <BookOpen className="w-5 h-5 text-indigo-600 mr-2" />
                Browse Help Topics
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                    className={`p-5 rounded-xl border transition-all duration-200 flex items-start ${activeCategory === category.id 
                      ? 'border-indigo-300 bg-indigo-50 shadow-sm' 
                      : 'border-gray-200 bg-white hover:border-indigo-200 hover:shadow-sm'}`}
                  >
                    <div className="bg-indigo-100 p-2 rounded-lg mr-4 text-indigo-600">
                      {category.icon}
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-800">{category.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {articles.filter(a => a.category === category.id).length} articles
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Articles List */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FileText className="w-5 h-5 text-indigo-600 mr-2" />
                {activeCategory 
                  ? `${categories.find(c => c.id === activeCategory)?.name} Articles`
                  : 'Popular Articles'}
              </h2>
              
              {filteredArticles.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    {filteredArticles.map(article => (
                      <li key={article.id} className="hover:bg-gray-50 transition-colors">
                        <div className="w-full text-left p-5">
                          <div
                            className="cursor-pointer"
                            onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-1">{article.title}</h3>
                                <p className="text-sm text-gray-500">
                                  {categories.find(c => c.id === article.category)?.name}
                                </p>
                              </div>
                              {expandedArticle === article.id ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                          </div>
                          
                          {expandedArticle === article.id && (
                            <div className="mt-3 text-gray-700">
                              <p>{article.content}</p>
                              <div className="mt-3 flex items-center space-x-2">
                                <span className="text-gray-600">Was this helpful?</span>
                                <button
                                  onClick={(e) => handleFeedbackClick(e, article.id, true)}
                                  className="p-1 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-50"
                                  aria-label="Mark as helpful"
                                >
                                  <Smile className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => handleFeedbackClick(e, article.id, false)}
                                  className="p-1 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-50"
                                  aria-label="Mark as not helpful"
                                >
                                  <Frown className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 text-center">
                  <Lightbulb className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No articles in this category</h3>
                  <p className="text-gray-500">
                    We couldn't find any articles for this category. Try another category or contact our support team.
                  </p>
                </div>
              )}
            </div>
            
            {/* FAQs */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <HelpCircle className="w-5 h-5 text-indigo-600 mr-2" />
                Frequently Asked Questions
              </h2>
              
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {faqs.map(faq => (
                    <li key={faq.id} className="hover:bg-gray-50 transition-colors">
                      <div className="w-full text-left p-5">
                        <div
                          className="cursor-pointer"
                          onClick={() => setExpandedArticle(expandedArticle === `faq-${faq.id}` ? null : `faq-${faq.id}`)}
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-medium text-gray-800">{faq.question}</h3>
                            {expandedArticle === `faq-${faq.id}` ? (
                              <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                        
                        {expandedArticle === `faq-${faq.id}` && (
                          <div className="mt-3 text-gray-700">
                            <p>{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
        
        {/* Support Options */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <MessageSquare className="w-5 h-5 text-indigo-600 mr-2" />
            Still need help? Contact our support team
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Support Form */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 p-2 rounded-lg mr-3 text-indigo-600">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="font-medium text-gray-800">Send us a message</h3>
              </div>
              
              {!showSupportForm ? (
                <button
                  onClick={() => setShowSupportForm(true)}
                  className="w-full py-3 px-4 border border-gray-300 rounded-lg text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="text-gray-500">Click here to open support form</div>
                </button>
              ) : (
                <form onSubmit={handleSubmitSupportRequest} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  {formStatus === 'success' && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-700">
                      Your support request has been submitted successfully. We'll get back to you within 24 hours.
                    </div>
                  )}
                  
                  {formStatus === 'error' && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
                      There was an error submitting your request. Please try again or contact us directly.
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={formStatus === 'submitting'}
                      className={`flex items-center justify-center px-4 py-2 rounded-md ${formStatus === 'submitting'
                        ? 'bg-indigo-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'} text-white`}
                    >
                      {formStatus === 'submitting' ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
            
            {/* Other Contact Methods */}
            <div className="space-y-6">
              {/* Live Chat */}
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3 text-indigo-600">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Live Chat</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <div className={`w-2 h-2 rounded-full mr-2 ${chatAvailable ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      {chatAvailable ? 'Available now' : 'Offline'}
                    </div>
                  </div>
                </div>
                
                <button
                  className={`w-full py-2 px-4 rounded-lg text-center ${chatAvailable
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-100 text-gray-500 cursor-not-allowed'}`}
                  disabled={!chatAvailable}
                >
                  {chatAvailable ? 'Start Chat' : 'Chat Unavailable'}
                </button>
              </div>
              
              {/* Phone Support */}
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3 text-indigo-600">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Phone Support</h3>
                    <div className="text-sm text-gray-500">Mon-Fri, 9am-5pm EST</div>
                  </div>
                </div>
                
                <a
                  href="tel:+254798971625"
                  className="block w-full py-2 px-4 border border-gray-300 rounded-lg text-center hover:bg-gray-50 transition-colors"
                >
                  +254798971625
                </a>
              </div>
              
              {/* Email Support */}
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3 text-indigo-600">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Email Support</h3>
                    <div className="text-sm text-gray-500">24/7 response within 24 hours</div>
                  </div>
                </div>
                
                <a
                  href="mailto:support@peakperformance.edu"
                  className="block w-full py-2 px-4 border border-gray-300 rounded-lg text-center hover:bg-gray-50 transition-colors"
                >
                  support@peakperformance.edu
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;