import { useState, useEffect, useCallback } from 'react';
import { 
  CreditCard, Smartphone, Wallet, Calendar, Clock, CheckCircle2, XCircle, Clock4,
  ChevronDown, User, Filter, ArrowUpDown, Download, Plus, Loader2, ArrowRight, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock API function for M-Pesa payment
const processMpesaPayment = async (paymentData) => {
  // In a real app, this would be an API call to your backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        reference: `MPESA${Math.floor(Math.random() * 1000000)}`,
        timestamp: new Date().toISOString()
      });
    }, 1500);
  });
};

// Mock API function for card payment
const processCardPayment = async (paymentData) => {
  // In a real app, this would be an API call to your payment processor
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        reference: `CARD${Math.floor(Math.random() * 1000000)}`,
        timestamp: new Date().toISOString()
      });
    }, 2000);
  });
};

const PaymentsDashboard = () => {
  const [activeTab, setActiveTab] = useState('make-payment');
  const [selectedProgram, setSelectedProgram] = useState('peak-performance-combined');
  const [paymentFrequency, setPaymentFrequency] = useState('weekly');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [mpesaDetails, setMpesaDetails] = useState({
    phone: '',
    name: ''
  });
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  const slideUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
  };

  // Mock data with memoization
  const getMockTransactions = useCallback(() => {
    return [
      {
        id: 'txn_001',
        date: '2023-06-15',
        amount: 25000,
        program: 'peak-performance-combined',
        method: 'mpesa',
        status: 'success',
        reference: 'PXA789456123'
      },
      {
        id: 'txn_002',
        date: '2023-05-28',
        amount: 25000,
        program: 'peak-performance-combined',
        method: 'card',
        status: 'success',
        reference: 'PXA321654987'
      },
      {
        id: 'txn_003',
        date: '2023-05-01',
        amount: 25000,
        program: 'peak-performance-combined',
        method: 'mpesa',
        status: 'success',
        reference: 'PXA147258369'
      }
    ];
  }, []);

  // Load transactions with simulated delay
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setTransactions(getMockTransactions());
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [getMockTransactions]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const amount = paymentFrequency === 'weekly' ? 25000 : remainingBalance;
      const paymentData = {
        program: selectedProgram,
        amount,
        frequency: paymentFrequency,
        method: paymentMethod,
        timestamp: new Date().toISOString()
      };

      let result;
      
      if (paymentMethod === 'mpesa') {
        // Add M-Pesa specific data
        paymentData.phone = mpesaDetails.phone;
        paymentData.name = mpesaDetails.name;
        result = await processMpesaPayment(paymentData);
      } else {
        // Add card specific data (in a real app, you'd tokenize this)
        paymentData.cardLast4 = cardDetails.number.slice(-4);
        result = await processCardPayment(paymentData);
      }

      if (result.success) {
        // Add the new transaction to history
        const newTransaction = {
          id: `txn_${transactions.length + 1}`,
          date: result.timestamp,
          amount,
          program: selectedProgram,
          method: paymentMethod,
          status: 'success',
          reference: result.reference
        };
        
        setTransactions(prev => [newTransaction, ...prev]);
        setPaymentSuccess(true);
      } else {
        setPaymentSuccess(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentSuccess(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(txn => txn.status === filter);

  const totalPaid = transactions.reduce((sum, txn) => sum + txn.amount, 0);
  const remainingBalance = 100000 - totalPaid;
  const weeklyAmount = 25000;
  const weeksRemaining = Math.ceil(remainingBalance / weeklyAmount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
              <Wallet className="mr-3 text-indigo-600" size={28} />
              Payments Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Manage your Peak Performance program payments</p>
          </div>
          <motion.div 
            variants={slideUp}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 w-full md:w-auto"
          >
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-500">Total Paid</p>
                <p className="text-xl md:text-2xl font-semibold text-gray-900">
                  KES {totalPaid.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-px bg-gray-200 hidden sm:block"></div>
              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-500">Remaining Balance</p>
                <p className="text-xl md:text-2xl font-semibold text-indigo-600">
                  KES {remainingBalance.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="flex border-b border-gray-200 mb-6 md:mb-8"
        >
          <button
            onClick={() => setActiveTab('make-payment')}
            className={`px-3 py-2 md:px-4 md:py-3 font-medium flex items-center text-sm md:text-base ${
              activeTab === 'make-payment' 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Plus className="mr-2" size={18} />
            Make Payment
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-2 md:px-4 md:py-3 font-medium flex items-center text-sm md:text-base ${
              activeTab === 'history' 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calendar className="mr-2" size={18} />
            Payment History
          </button>
        </motion.div>

        {/* Make Payment Section */}
        <AnimatePresence mode="wait">
          {activeTab === 'make-payment' && (
            <motion.div
              key="make-payment"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {paymentSuccess === true ? (
                <div className="p-6 md:p-8 text-center">
                  <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4"
                  >
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </motion.div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Successful!</h3>
                  <p className="text-gray-600 mb-6">
                    Your payment of KES {paymentFrequency === 'weekly' ? '25,000' : remainingBalance.toLocaleString()} has been processed successfully.
                  </p>
                  <button
                    onClick={() => {
                      setActiveTab('history');
                      setPaymentSuccess(null);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    View Payment History <ArrowRight className="ml-2" size={16} />
                  </button>
                </div>
              ) : paymentSuccess === false ? (
                <div className="p-6 md:p-8 text-center">
                  <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4"
                  >
                    <XCircle className="h-10 w-10 text-red-600" />
                  </motion.div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Failed</h3>
                  <p className="text-gray-600 mb-6">There was an issue processing your payment. Please try again.</p>
                  <button
                    onClick={() => setPaymentSuccess(null)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    Try Again <ArrowRight className="ml-2" size={16} />
                  </button>
                </div>
              ) : isProcessing ? (
                <div className="p-6 md:p-8 text-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4"
                  >
                    <Loader2 className="h-10 w-10 text-indigo-600" />
                  </motion.div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Payment</h3>
                  <p className="text-gray-600">
                    {paymentMethod === 'mpesa' 
                      ? 'Check your phone for an M-Pesa prompt...' 
                      : 'Processing your card payment...'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePayment}>
                  <div className="p-4 md:p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <CreditCard className="mr-3 text-indigo-600" size={24} />
                      Make a Payment
                    </h2>

                    {/* Program Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Program
                      </label>
                      <div className="relative">
                        <select
                          value={selectedProgram}
                          onChange={(e) => setSelectedProgram(e.target.value)}
                          className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg bg-gray-50 border transition-colors duration-200"
                        >
                          <option value="peak-performance-combined">Peak Performance Combined Program</option>
                        </select>
                      </div>
                    </div>

                    {/* Payment Frequency */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Payment Frequency
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.button
                          type="button"
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setPaymentFrequency('weekly')}
                          className={`p-4 border rounded-lg transition-all duration-200 ${paymentFrequency === 'weekly' ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                        >
                          <div className="flex items-center">
                            <div className={`mr-3 flex items-center justify-center h-8 w-8 rounded-full ${paymentFrequency === 'weekly' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
                              <Calendar size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Weekly Payment</p>
                              <p className="text-xs text-gray-500">{weeksRemaining} payments remaining</p>
                            </div>
                          </div>
                          <div className="mt-3 text-right">
                            <p className="text-xl font-semibold text-gray-900">KES 25,000</p>
                          </div>
                        </motion.button>
                        <motion.button
                          type="button"
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setPaymentFrequency('full')}
                          className={`p-4 border rounded-lg transition-all duration-200 ${paymentFrequency === 'full' ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                        >
                          <div className="flex items-center">
                            <div className={`mr-3 flex items-center justify-center h-8 w-8 rounded-full ${paymentFrequency === 'full' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
                              <Wallet size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Full Payment</p>
                              <p className="text-xs text-gray-500">One-time complete payment</p>
                            </div>
                          </div>
                          <div className="mt-3 text-right">
                            <p className="text-xl font-semibold text-gray-900">KES {remainingBalance.toLocaleString()}</p>
                            <p className="text-xs text-green-600">Save 5% on total</p>
                          </div>
                        </motion.button>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Payment Method
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.button
                          type="button"
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setPaymentMethod('card')}
                          className={`p-4 border rounded-lg transition-all duration-200 ${paymentMethod === 'card' ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                        >
                          <div className="flex items-center">
                            <div className={`mr-3 flex items-center justify-center h-8 w-8 rounded-full ${paymentMethod === 'card' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
                              <CreditCard size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Credit/Debit Card</p>
                              <p className="text-xs text-gray-500">Visa, Mastercard</p>
                            </div>
                          </div>
                        </motion.button>
                        <motion.button
                          type="button"
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setPaymentMethod('mpesa')}
                          className={`p-4 border rounded-lg transition-all duration-200 ${paymentMethod === 'mpesa' ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                        >
                          <div className="flex items-center">
                            <div className={`mr-3 flex items-center justify-center h-8 w-8 rounded-full ${paymentMethod === 'mpesa' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
                              <Smartphone size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">M-Pesa</p>
                              <p className="text-xs text-gray-500">Mobile Money</p>
                            </div>
                          </div>
                        </motion.button>
                      </div>
                    </div>

                    {/* Payment Details */}
                    {paymentMethod === 'card' ? (
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">Card Details</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm text-gray-500 mb-1">Card Number</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <CreditCard className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                value={cardDetails.number}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                                  let formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                                  setCardDetails({...cardDetails, number: formatted});
                                }}
                                required
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm text-gray-500 mb-1">Expiry Date</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Calendar className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                  type="text"
                                  placeholder="MM/YY"
                                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                  value={cardDetails.expiry}
                                  onChange={(e) => {
                                    let value = e.target.value.replace(/\D/g, '');
                                    if (value.length > 2) {
                                      value = value.slice(0, 2) + '/' + value.slice(2, 4);
                                    }
                                    setCardDetails({...cardDetails, expiry: value});
                                  }}
                                  required
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm text-gray-500 mb-1">CVV</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Shield className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                  type="text"
                                  placeholder="123"
                                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                  value={cardDetails.cvv}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                                    setCardDetails({...cardDetails, cvv: value});
                                  }}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm text-gray-500 mb-1">Cardholder Name</label>
                            <input
                              type="text"
                              placeholder="Name on card"
                              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                              value={cardDetails.name}
                              onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">M-Pesa Details</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm text-gray-500 mb-1">Phone Number</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Smartphone className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="tel"
                                placeholder="07XX XXX XXX"
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                value={mpesaDetails.phone}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                  setMpesaDetails({...mpesaDetails, phone: value});
                                }}
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm text-gray-500 mb-1">Your Full Name</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="text"
                                placeholder="Enter your full name"
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                value={mpesaDetails.name}
                                onChange={(e) => setMpesaDetails({...mpesaDetails, name: e.target.value})}
                                required
                              />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Required for payment verification</p>
                          </div>
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-blue-50 p-4 rounded-lg border border-blue-100"
                          >
                            <p className="text-sm text-blue-800">
                              You'll receive an M-Pesa STK Push prompt on your phone to complete the payment.
                            </p>
                          </motion.div>
                        </div>
                      </div>
                    )}

                    {/* Payment Summary */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6"
                    >
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Payment Summary</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <p className="text-sm text-gray-600">Program</p>
                          <p className="text-sm font-medium text-gray-900">Peak Performance Combined</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm text-gray-600">Payment Frequency</p>
                          <p className="text-sm font-medium text-gray-900">
                            {paymentFrequency === 'weekly' ? 'Weekly' : 'Full Payment'}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm text-gray-600">Payment Method</p>
                          <p className="text-sm font-medium text-gray-900">
                            {paymentMethod === 'card' ? 'Credit/Debit Card' : 'M-Pesa'}
                          </p>
                        </div>
                        <div className="h-px bg-gray-200 my-2"></div>
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900">Amount to Pay</p>
                          <p className="text-lg font-bold text-indigo-600">
                            KES {paymentFrequency === 'weekly' ? '25,000' : remainingBalance.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Security and Submit */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 mr-2">
                          <Shield className="h-5 w-5 text-green-600" />
                        </div>
                        <p className="text-xs text-gray-500">Secure SSL encrypted payment</p>
                      </div>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 w-full md:w-auto"
                      >
                        Pay KES {paymentFrequency === 'weekly' ? '25,000' : remainingBalance.toLocaleString()}
                      </motion.button>
                    </div>
                  </div>
                </form>
              )}
            </motion.div>
          )}

          {/* Payment History Section */}
          {activeTab === 'history' && (
            <motion.div
              key="payment-history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Calendar className="mr-3 text-indigo-600" size={24} />
                    Payment History
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 transition-colors duration-200"
                      >
                        <option value="all">All Transactions</option>
                        <option value="success">Successful</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <Filter className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    <motion.button 
                      whileHover={{ y: -1 }}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm flex items-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <ArrowUpDown className="mr-2" size={14} />
                      Sort
                    </motion.button>
                  </div>
                </div>

                {/* Transactions Table */}
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="h-10 w-10 text-indigo-600"
                    >
                      <Loader2 className="h-full w-full" />
                    </motion.div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Method
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                            Reference
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTransactions.length > 0 ? (
                          filteredTransactions.map((transaction) => (
                            <motion.tr 
                              key={transaction.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Calendar className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" />
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {new Date(transaction.date).toLocaleDateString()}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {new Date(transaction.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="text-sm font-semibold text-gray-900">
                                  KES {transaction.amount.toLocaleString()}
                                </div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  {transaction.method === 'card' ? (
                                    <CreditCard className="flex-shrink-0 h-5 w-5 text-indigo-400 mr-2" />
                                  ) : (
                                    <Smartphone className="flex-shrink-0 h-5 w-5 text-green-400 mr-2" />
                                  )}
                                  <span className="text-sm text-gray-500 capitalize">
                                    {transaction.method}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                                <div className="text-sm text-gray-500">
                                  {transaction.reference}
                                </div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                {transaction.status === 'success' ? (
                                  <motion.span 
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                                  >
                                    <CheckCircle2 className="mr-1" size={14} />
                                    Successful
                                  </motion.span>
                                ) : transaction.status === 'pending' ? (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                    <Clock4 className="mr-1" size={14} />
                                    Pending
                                  </span>
                                ) : (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                    <XCircle className="mr-1" size={14} />
                                    Failed
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <motion.button 
                                  whileHover={{ x: 2 }}
                                  className="text-indigo-600 hover:text-indigo-900 flex items-center"
                                >
                                  <Download className="mr-1" size={14} />
                                  <span className="hidden md:inline">Receipt</span>
                                </motion.button>
                              </td>
                            </motion.tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="px-6 py-12 text-center">
                              <div className="flex flex-col items-center justify-center">
                                <Calendar className="h-12 w-12 text-gray-400 mb-3" />
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No transactions found</h3>
                                <p className="text-gray-500">Your payment history will appear here</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PaymentsDashboard;