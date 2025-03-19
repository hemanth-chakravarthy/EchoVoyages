import React from 'react';
import { motion } from 'framer-motion';

const PaymentGateway = () => {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto bg-black-gradient rounded-xl shadow-xl p-8"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Payment Details</h2>
        
        <form className="space-y-6">
          <div>
            <label className="block text-dimWhite mb-2">Card Number</label>
            <input 
              type="text" 
              placeholder="1234 5678 9012 3456"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-dimWhite mb-2">Expiry Date</label>
              <input 
                type="text" 
                placeholder="MM/YY"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-dimWhite mb-2">CVV</label>
              <input 
                type="text" 
                placeholder="123"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-dimWhite mb-2">Card Holder Name</label>
            <input 
              type="text" 
              placeholder="John Doe"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-dimWhite mb-2">Amount</label>
            <div className="text-2xl font-bold text-white mb-4">₹299.99</div>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-gradient text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            Pay Now
          </button>
        </form>

        <div className="mt-6 text-center text-dimWhite text-sm">
          Secured by EchoVoyage Payment Gateway
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentGateway;