import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RoiCharts from './RoiCharts';

const RoiCalculator = () => {
  const [formData, setFormData] = useState({
    annualRevenue: '0',
    customerCount: '0',
    averageTicketSize: '0',
    churnRate: '0',
    customerServiceCost: '0'
  });

  const [results, setResults] = useState({
    additionalRevenue: '0.00',
    churnSavings: '0.00',
    costSavings: '0.00',
    totalBenefit: '0.00',
    roi: '0.00'
  });

  const calculateROI = () => {
    const revenue = parseFloat(formData.annualRevenue) || 0;
    const customers = parseFloat(formData.customerCount) || 0;
    const ticketSize = parseFloat(formData.averageTicketSize) || 0;
    const churnRate = parseFloat(formData.churnRate) || 0;
    const serviceCost = parseFloat(formData.customerServiceCost) || 0;

    const improvedRevenue = revenue * 1.15;
    const reducedChurn = churnRate * 0.7;
    const serviceCostSavings = serviceCost * 0.25;

    const additionalRevenue = improvedRevenue - revenue;
    const churnSavings = (customers * ticketSize * (churnRate - reducedChurn)) / 100; 
    const costSavings = serviceCostSavings;

    const totalBenefit = additionalRevenue + churnSavings + costSavings;
    const investment = 10000;
    const roi = ((totalBenefit - investment) / investment) * 100;

    setResults({
      additionalRevenue: additionalRevenue.toFixed(2),
      churnSavings: churnSavings.toFixed(2),
      costSavings: costSavings.toFixed(2),
      totalBenefit: totalBenefit.toFixed(2),
      roi: roi.toFixed(2)
    });
  };

  useEffect(() => {
    calculateROI();
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <motion.div 
      className="max-w-[1200px] mx-auto md:p-8 font-inter pb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="md:text-4xl text-lg text-center mb-2 bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Customer Experience ROI Calculator
      </motion.h1>
      <motion.p 
        className="text-center text-gray-500 mb-12 md:text-lg text-sm"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        See your ROI update in real-time as you input your numbers
      </motion.p>

      <div className="grid md:grid-cols-2 grid-cols-1 gap-8 bg-white rounded-xl shadow-lg md:p-8 p-1">
        <motion.div 
          className="md:p-4"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl text-gray-800 mb-6 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-[60px] after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-indigo-500 after:rounded-full">Business Metrics</h2>
          
          {Object.entries(formData).map(([key, value], index) => (
            <motion.div 
              key={key}
              className="mb-6 hover:translate-x-1 transition-transform duration-300"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            >
              <label className="block mb-2 text-gray-700 font-medium text-lg capitalize">{key.split(/(?=[A-Z])/).join(' ')}</label>
              <input
                type="number"
                name={key}
                value={value}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                className="w-full p-3 border-2 border-gray-200 rounded-lg text-lg transition-all duration-300 bg-gray-50 text-gray-800 focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(66,153,225,0.1)]"
              />
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence>
          <motion.div 
            className="p-6 bg-gray-50 rounded-xl"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl text-gray-800 mb-6 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-[60px] after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-indigo-500 after:rounded-full">Your Potential ROI</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              {Object.entries(results).map(([key, value], index) => (
                <motion.div
                  key={key}
                  className={`bg-white p-6 rounded-xl shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative overflow-hidden ${key === 'roi' ? 'col-span-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white' : ''}`}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h3 className={`text-lg ${key === 'roi' ? 'text-white' : 'text-gray-700'} capitalize`}>{key.split(/(?=[A-Z])/).join(' ')}</h3>
                  <p className={`text-3xl font-bold my-2 ${key === 'roi' ? 'text-white' : 'bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent'}`}>
                    {key === 'roi' ? `${value}%` : `$${Number(value).toLocaleString()}`}
                  </p>
                  <p className={`text-sm ${key === 'roi' ? 'text-white/90' : 'text-gray-500'}`}>
                    {key === 'roi' 
                      ? 'Expected return on investment'
                      : key === 'totalBenefit'
                      ? 'Total financial impact'
                      : `Projected ${key.split(/(?=[A-Z])/).join(' ').toLowerCase()}`}
                  </p>
                </motion.div>
              ))}
            </div>

            <RoiCharts results={results} />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default RoiCalculator;
