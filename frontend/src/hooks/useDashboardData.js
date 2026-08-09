import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useDashboardData = (userInfo, setUserInfo, triggerToast) => {
  const [dashboard, setDashboard] = useState(null);
  const [activities, setActivities] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [weeklyChart, setWeeklyChart] = useState([]);
  const [monthlyChart, setMonthlyChart] = useState([]);
  const [comparison, setComparison] = useState({ daily: 0, weekly: 0, monthly: 0 });
  const [userCount, setUserCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(false);

  const fetchActivities = useCallback(async () => {
    try {
      const response = await api.get('/activities');
      setActivities(response.data);
    } catch (error) {
      console.error('Fetch activities error:', error);
    }
  }, []);

  const fetchDashboard = useCallback(async () => {
    try {
      const response = await api.get('/dashboard');
      setDashboard(response.data);
    } catch (error) {
      console.error('Fetch dashboard error:', error);
    }
  }, []);

  const fetchWeeklyChart = useCallback(async () => {
    try {
      const response = await api.get('/dashboard/weekly');
      setWeeklyChart(response.data);
    } catch (error) {
      console.error('Fetch weekly chart error:', error);
    }
  }, []);

  const fetchMonthlyChart = useCallback(async () => {
    try {
      const response = await api.get('/dashboard/monthly');
      setMonthlyChart(response.data);
    } catch (error) {
      console.error('Fetch monthly chart error:', error);
    }
  }, []);

  const fetchComparison = useCallback(async () => {
    try {
      const response = await api.get('/comparison');
      setComparison(response.data);
    } catch (error) {
      console.error('Fetch comparison error:', error);
    }
  }, []);

  const fetchUserCount = useCallback(async () => {
    try {
      const response = await api.get('/users/count');
      setUserCount(response.data.count);
    } catch (error) {
      console.error('Fetch user count error:', error);
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await api.get('/users/profile');
      localStorage.setItem('id', response.data.id);
      localStorage.setItem('fullName', response.data.fullName);
      localStorage.setItem('email', response.data.email);
      setUserInfo(prev => ({
        ...prev,
        id: response.data.id,
        fullName: response.data.fullName,
        email: response.data.email,
      }));
    } catch (error) {
      console.error('Fetch profile error:', error);
    }
  }, [setUserInfo]);

  const fetchLeaderboard = useCallback(async () => {
    setIsLeaderboardLoading(true);
    try {
      const response = await api.get('/leaderboard');
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Fetch leaderboard error:', error);
    } finally {
      setIsLeaderboardLoading(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([
      fetchActivities(),
      fetchDashboard(),
      fetchUserCount(),
      fetchWeeklyChart(),
      fetchMonthlyChart(),
      fetchComparison(),
      fetchProfile(),
      fetchLeaderboard(),
    ]);
    setIsLoading(false);
  }, [
    fetchActivities,
    fetchDashboard,
    fetchUserCount,
    fetchWeeklyChart,
    fetchMonthlyChart,
    fetchComparison,
    fetchProfile,
    fetchLeaderboard,
  ]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const deleteActivity = async (id) => {
    try {
      await api.delete(`/activities/${id}`);
      triggerToast('Activity deleted successfully');
      await Promise.all([fetchActivities(), fetchDashboard(), fetchLeaderboard()]);
    } catch (error) {
      console.error('Delete activity error:', error);
      triggerToast('Failed to delete activity');
    }
  };

  return {
    dashboard,
    activities,
    leaderboard,
    weeklyChart,
    monthlyChart,
    comparison,
    userCount,
    isLoading,
    isLeaderboardLoading,
    refreshAll,
    deleteActivity,
    fetchActivities,
    fetchDashboard,
    fetchLeaderboard
  };
};
