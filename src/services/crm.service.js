import api from "@/lib/axios";

export const crmService = {
  // CRM Sales & Orders list (admin-wide)
  async getOrders(filters = {}) {
    const response = await api.get("/crm/orders", { params: filters });
    return response.data;
  },

  // CRM Sales & Orders summary stats
  async getOrdersSummary() {
    const response = await api.get("/crm/orders/summary");
    return response.data;
  },

  // CRM Customers list
  async getCustomers(filters = {}) {
    const response = await api.get("/crm/customers", { params: filters });
    return response.data;
  },

  // Single CRM customer detail
  async getCustomer(publicId) {
    const response = await api.get(`/crm/customers/${publicId}`);
    return response.data;
  },

  // CRM Projects list
  async getProjects(filters = {}) {
    const response = await api.get('/crm/projects', { params: filters });
    return response.data;
  },
};

