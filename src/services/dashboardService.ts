import apiClient from './apiClient';

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}

export interface DashboardData {
  users: { total: number; daily?: number; weekly?: number; monthly?: number };
  approvedUsers: { total: number; daily: number; weekly: number; monthly: number };
  pendingApprovalUsers: { total: number; daily: number; weekly: number; monthly: number };
  newUsers: { total: number; daily: number; weekly: number; monthly: number };
  bioUsers: { total: number; daily?: number; weekly?: number; monthly?: number };
  photoAlbumUsers: { total: number; daily?: number; weekly?: number; monthly?: number };
  subscribers: { total: number; daily: number; weekly: number; monthly: number };
  subscriptionRevenue: { total: number; daily?: number; weekly?: number; monthly?: number };
  userAnalytics: { date: string; newUsers: number; activeUsers: number }[];
  subscriptionRevenueAnalytics: any[];
}

export const getDashboardData = async (range: string = '28'): Promise<DashboardResponse> => {
  const response = await apiClient.get<DashboardResponse>('v1/admin/dashboard', {
    params: { range }
  });
  return response.data;
};
