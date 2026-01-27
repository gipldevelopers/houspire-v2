// src\services\razorpayService.js
import api from '@/lib/axios';

export const razorpayService = {
  // Create order on backend
  createOrder: async (amount, receipt, currency = 'INR', projectId, packageData, addons, couponCode, gstAmount, couponDiscount, gstNumber) => {
    try {
      const response = await api.post('/payments/orders', { // CHANGE: /payments/orders NOT /razorpay/orders
        amount,
        receipt,
        currency,
        projectId,
        packageData,
        addons,
        couponCode,
        gstAmount,
        couponDiscount,
        gstNumber
      });
      return response.data;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  },

  // Verify payment on backend
  verifyPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments/verify', paymentData); // CHANGE: /payments/verify NOT /razorpay/verify
      return response.data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }
};