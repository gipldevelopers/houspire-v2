// src/services/email.service.js
import api from '@/lib/axios';

export const emailService = {
  // Send invoice email
  sendInvoiceEmail: async (paymentData, customerData) => {
    try {
      const response = await api.post('/emails/send-invoice', {
        paymentData,
        customerData,
        templateType: 'invoice'
      });
      return response.data;
    } catch (error) {
      console.error('Error sending invoice email:', error);
      throw error;
    }
  },

  // Send BOQ email
  sendBoqEmail: async (boqData, customerData) => {
    try {
      const response = await api.post('/emails/send-boq', {
        boqData,
        customerData,
        templateType: 'boq'
      });
      return response.data;
    } catch (error) {
      console.error('Error sending BOQ email:', error);
      throw error;
    }
  },

  // Get email templates
  getEmailTemplates: async () => {
    try {
      const response = await api.get('/emails/templates');
      return response.data;
    } catch (error) {
      console.error('Error fetching email templates:', error);
      throw error;
    }
  },

  // Update email template
  updateEmailTemplate: async (templateType, templateData) => {
    try {
      const response = await api.put(`/emails/templates/${templateType}`, templateData);
      return response.data;
    } catch (error) {
      console.error('Error updating email template:', error);
      throw error;
    }
  }
};