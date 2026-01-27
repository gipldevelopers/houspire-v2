import api from "@/lib/axios";

export const paymentService = {
  // Get all payments with filters
  async getPayments(filters = {}) {
    try {
      const response = await api.get("/user-payments", { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch payments"
      );
    }
  },

  // Get payment by ID
  async getPayment(paymentId) {
    try {
      const response = await api.get(`/user-payments/${paymentId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch payment details"
      );
    }
  },

  // Get payment statistics
  async getPaymentStats() {
    try {
      const response = await api.get("/user-payments/stats");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch payment statistics"
      );
    }
  },

  // Get invoice data
  async getInvoiceData(paymentId) {
    try {
      const response = await api.get(`/user-payments/${paymentId}/invoice`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch invoice data"
      );
    }
  },

  // Create new payment
  async createPayment(paymentData) {
    try {
      const response = await api.post("/user-payments", paymentData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create payment"
      );
    }
  },
};
