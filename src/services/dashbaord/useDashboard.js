// hooks/useDashboard.js
'use client';

import { useState, useEffect } from 'react';
import dashboardApi from './dashboard';


export const useDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    stats: null,
    revenueAnalytics: null,
    projectAnalytics: null,
    recentActivities: null,
    quickStats: null,
  });

  const [filters, setFilters] = useState({
    period: 'month',
    startDate: null,
    endDate: null,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        statsResponse,
        revenueResponse,
        projectResponse,
        activitiesResponse,
        quickStatsResponse
      ] = await Promise.all([
        dashboardApi.getStats(filters),
        dashboardApi.getRevenueAnalytics(filters),
        dashboardApi.getProjectAnalytics(filters),
        dashboardApi.getRecentActivities({ page: 1, limit: 10 }),
        dashboardApi.getQuickStats()
      ]);

      setData({
        stats: statsResponse?.data,
        revenueAnalytics: revenueResponse?.data,
        projectAnalytics: projectResponse?.data,
        recentActivities: activitiesResponse?.data,
        quickStats: quickStatsResponse?.data,
      });

    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchData();
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  return {
    data,
    loading,
    error,
    filters,
    refreshData,
    updateFilters,
  };
};

// Hook for individual dashboard sections
export const useDashboardStats = (filters = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await dashboardApi.getStats(filters);
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [JSON.stringify(filters)]);

  return { data, loading, error };
};

export const useRevenueAnalytics = (filters = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setLoading(true);
        const response = await dashboardApi.getRevenueAnalytics(filters);
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, [JSON.stringify(filters)]);

  return { data, loading, error };
};

export const useProjectAnalytics = (filters = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await dashboardApi.getProjectAnalytics(filters);
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [JSON.stringify(filters)]);

  return { data, loading, error };
};

export const useRecentActivities = (params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await dashboardApi.getRecentActivities(params);
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [JSON.stringify(params)]);

  return { data, loading, error };
};