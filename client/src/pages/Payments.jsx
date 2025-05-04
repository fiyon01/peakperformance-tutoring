import { useState, useEffect } from 'react';
import { 
  CreditCard, Smartphone, Wallet, Calendar, Clock, CheckCircle2, XCircle, Clock4,
  ChevronDown,User, Filter, ArrowUpDown, Download, Plus, Loader2, ArrowRight
} from 'lucide-react';

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
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');

  // Mock data
  useEffect(() => {
    const mockTransactions = [
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
    setTransactions(mockTransactions);
  }, []);

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      // Reset after showing success
      setTimeout(() => {
        setPaymentSuccess(null);
        setActiveTab('history');
      }, 3000);
    }, 2000);
  };

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(txn => txn.status === filter);

  const totalPaid = transactions.reduce((sum, txn) => sum + txn.amount, 0);
  const remainingBalance = 100000 - totalPaid;
  const weeklyAmount = 25000;
  const weeksRemaining = Math.ceil(remainingBalance / weeklyAmount);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Wallet className="mr-3 text-indigo-600" size={28} />
              Payments Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Manage your Peak Performance program payments</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="mr-4">
                <p className="text-sm text-gray-500">Total Paid</p>
                <p className="text-2xl font-semibold text-gray-900">
                  KES {totalPaid.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-px bg-gray-200"></div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Remaining Balance</p>
                <p className="text-2xl font-semibold text-indigo-600">
                  KES {remainingBalance.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('make-payment')}
            className={`px-4 py-3 font-medium flex items-center ${activeTab === 'make-payment' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Plus className="mr-2" size={18} />
            Make Payment
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-3 font-medium flex items-center ${activeTab === 'history' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Calendar className="mr-2" size={18} />
            Payment History
          </button>
        </div>

        {/* Make Payment Section */}
        {activeTab === 'make-payment' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300">
            {paymentSuccess === true ? (
              <div className="p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Successful!</h3>
                <p className="text-gray-600 mb-6">Your payment of KES 25,000 has been processed successfully.</p>
                <button
                  onClick={() => {
                    setActiveTab('history');
                    setPaymentSuccess(null);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View Payment History <ArrowRight className="ml-2" size={16} />
                </button>
              </div>
            ) : paymentSuccess === false ? (
              <div className="p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                  <XCircle className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Failed</h3>
                <p className="text-gray-600 mb-6">There was an issue processing your payment. Please try again.</p>
                <button
                  onClick={() => setPaymentSuccess(null)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Try Again <ArrowRight className="ml-2" size={16} />
                </button>
              </div>
            ) : isProcessing ? (
              <div className="p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4 animate-spin">
                  <Loader2 className="h-10 w-10 text-indigo-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Payment</h3>
                <p className="text-gray-600">Please wait while we process your payment...</p>
              </div>
            ) : (
              <form onSubmit={handlePayment}>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <CreditCard className="mr-3 text-indigo-600" size={24} />
                    Make a Payment
                  </h2>

                  {/* Program Selection */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Program
                    </label>
                    <div className="relative">
                      <select
                        value={selectedProgram}
                        onChange={(e) => setSelectedProgram(e.target.value)}
                        className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg bg-gray-50 border"
                      >
                        <option value="peak-performance-combined">Peak Performance Combined Program</option>
                      </select>
                    </div>
                  </div>

                  {/* Payment Frequency */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Payment Frequency
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setPaymentFrequency('weekly')}
                        className={`p-4 border rounded-lg transition-all duration-200 ${paymentFrequency === 'weekly' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
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
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentFrequency('full')}
                        className={`p-4 border rounded-lg transition-all duration-200 ${paymentFrequency === 'full' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
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
                      </button>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-4 border rounded-lg transition-all duration-200 ${paymentMethod === 'card' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
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
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('mpesa')}
                        className={`p-4 border rounded-lg transition-all duration-200 ${paymentMethod === 'mpesa' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
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
                      </button>
                    </div>
                  </div>

                  {/* Payment Details */}
                  {paymentMethod === 'card' ? (
                    <div className="mb-8">
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
                              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              value={cardDetails.number}
                              onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-500 mb-1">Expiry Date</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="text"
                                placeholder="MM/YY"
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                value={cardDetails.expiry}
                                onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm text-gray-500 mb-1">CVV</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <CreditCard className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="text"
                                placeholder="123"
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                value={cardDetails.cvv}
                                onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">Cardholder Name</label>
                          <input
                            type="text"
                            placeholder="Name on card"
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value={cardDetails.name}
                            onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-8">
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
                              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              value={mpesaPhone}
                              onChange={(e) => setMpesaPhone(e.target.value)}
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
                              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              required
                            />
                          </div>
                          <p className="mt-1 text-xs text-gray-500">Required for payment verification</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                          <p className="text-sm text-blue-800">
                            You'll receive an M-Pesa STK Push prompt on your phone to complete the payment.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-8">
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
                  </div>

                  {/* Security and Submit */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 mr-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="text-xs text-gray-500">Secure SSL encrypted payment</p>
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                      Pay KES {paymentFrequency === 'weekly' ? '25,000' : remainingBalance.toLocaleString()}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Payment History Section */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Calendar className="mr-3 text-indigo-600" size={24} />
                  Payment History
                </h2>
                <div className="flex space-x-3">
                  <div className="relative">
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
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
                  <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm flex items-center bg-gray-50 hover:bg-gray-100">
                    <ArrowUpDown className="mr-2" size={14} />
                    Sort
                  </button>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reference
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              KES {transaction.amount.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {transaction.reference}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {transaction.status === 'success' ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                <CheckCircle2 className="mr-1" size={14} />
                                Successful
                              </span>
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
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900 flex items-center">
                              <Download className="mr-1" size={14} />
                              Receipt
                            </button>
                          </td>
                        </tr>
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsDashboard;