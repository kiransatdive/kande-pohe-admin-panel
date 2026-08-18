import React, { useState } from 'react';
import { Users, UserCheck, Clock, UserPlus, IndianRupee, Star, FileText, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import DateRangeDropdown from '../components/common/DateRangeDropdown';
import { getDashboardData } from '../services/dashboardService';
import DashboardCard from '../components/dashboard/DashboardCard';

import type { ViewMode } from '../components/dashboard/CardViewDropdown';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [userAnalyticsRange, setUserAnalyticsRange] = useState('28');
  const [revenueRange, setRevenueRange] = useState('28');
  const [globalRange, setGlobalRange] = useState('lifetime');
  const globalViewMode = (globalRange === '7' ? 'weekly' : globalRange === 'lifetime' ? 'total' : 'monthly') as ViewMode;

  const { data: uaData, isLoading: isLoadingUA, error: errorUA } = useQuery({
    queryKey: ['dashboardData', userAnalyticsRange],
    queryFn: () => getDashboardData(userAnalyticsRange)
  });

  const { data: revData, isLoading: isLoadingRev, error: errorRev } = useQuery({
    queryKey: ['dashboardData', revenueRange],
    queryFn: () => getDashboardData(revenueRange)
  });

  const dashboard = uaData?.data;
  const dashboardRev = revData?.data;


  if (isLoadingUA || isLoadingRev) {
    return <div className="flex justify-center items-center h-full text-gray-500 font-medium">Loading dashboard data...</div>;
  }

  if (errorUA || !dashboard || errorRev || !dashboardRev) {
    console.error("Dashboard error:", errorUA || errorRev);
    return (
      <div className="flex flex-col justify-center items-center h-full gap-2">
        <div className="text-red-500 font-medium">Error loading dashboard data.</div>
        <div className="text-sm text-gray-500 max-w-lg text-center">
          {errorUA instanceof Error ? errorUA.message : errorRev instanceof Error ? errorRev.message : JSON.stringify(errorUA || errorRev)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 gap-4 text-sm h-full max-h-full overflow-hidden pb-2">
      <div className="flex justify-end relative z-20">
        <DateRangeDropdown value={globalRange} onChange={setGlobalRange} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard 
          title="All Users" 
          value={dashboard.users?.total?.toLocaleString() || 0} 
          subtitle="Total registered users" 
          colorHex="#0095ff" 
          icon={Users} 
          trendValue={dashboard.users?.monthly?.toLocaleString() || 0} 
          footerSubtitle="Click to view all users"
          viewMode={globalViewMode}
          onClick={() => navigate('/user-list')} 
        />
        <DashboardCard 
          title="Approved Users" 
          value={dashboard.approvedUsers?.total?.toLocaleString() || 0} 
          subtitle="Total approved accounts" 
          colorHex="#ff4a73" 
          icon={UserCheck} 
          dailyValue={dashboard.approvedUsers?.daily?.toLocaleString() || 0}
          weeklyValue={dashboard.approvedUsers?.weekly?.toLocaleString() || 0}
          monthlyValue={dashboard.approvedUsers?.monthly?.toLocaleString() || 0}
          footerSubtitle="Click to view approved users"
          viewMode={globalViewMode}
          onClick={() => navigate('/user-list-approved')} 
        />
        <DashboardCard 
          title="Pending Approval" 
          value={dashboard.pendingApprovalUsers?.total?.toLocaleString() || 0} 
          subtitle="Awaiting manual approval" 
          colorHex="#2ed573" 
          icon={Clock} 
          dailyValue={dashboard.pendingApprovalUsers?.daily?.toLocaleString() || 0}
          weeklyValue={dashboard.pendingApprovalUsers?.weekly?.toLocaleString() || 0}
          monthlyValue={dashboard.pendingApprovalUsers?.monthly?.toLocaleString() || 0}
          footerSubtitle="Click to view pending approvals"
          viewMode={globalViewMode}
          onClick={() => navigate('/user-list-pending-approval')} 
        />
        <DashboardCard 
          title="Newly Registered" 
          value={dashboard.newUsers?.total?.toLocaleString() || 0} 
          subtitle="Recent registrations" 
          colorHex="#ffa502" 
          icon={UserPlus} 
          dailyValue={dashboard.newUsers?.daily?.toLocaleString() || 0}
          weeklyValue={dashboard.newUsers?.weekly?.toLocaleString() || 0}
          monthlyValue={dashboard.newUsers?.monthly?.toLocaleString() || 0}
          footerSubtitle="Click to view newly registered"
          viewMode={globalViewMode}
          onClick={() => navigate('/user-list-newly-registered')} 
        />
        <DashboardCard 
          title="User Bio" 
          value={dashboard.bioUsers?.total?.toLocaleString() || 0} 
          subtitle="Users with bios added" 
          colorHex="#00cec9" 
          icon={FileText} 
          trendValue={dashboard.bioUsers?.monthly?.toLocaleString() || 0} 
          footerSubtitle="Click to view users with bio"
          viewMode={globalViewMode}
          onClick={() => navigate('/user-list-bio')} 
        />
        <DashboardCard 
          title="Photo Album" 
          value={dashboard.photoAlbumUsers?.total?.toLocaleString() || 0} 
          subtitle="Users with photo albums" 
          colorHex="#fd79a8" 
          icon={Camera} 
          trendValue={dashboard.photoAlbumUsers?.monthly?.toLocaleString() || 0} 
          footerSubtitle="Click to view photo albums"
          viewMode={globalViewMode}
          onClick={() => navigate('/user-list-photo-album')} 
        />
        <DashboardCard 
          title="Subscribers" 
          value={dashboard.subscribers?.total?.toLocaleString() || 0} 
          subtitle="Premium membership users" 
          colorHex="#a55eea" 
          icon={Star} 
          dailyValue={dashboard.subscribers?.daily?.toLocaleString() || 0}
          weeklyValue={dashboard.subscribers?.weekly?.toLocaleString() || 0}
          monthlyValue={dashboard.subscribers?.monthly?.toLocaleString() || 0}
          footerSubtitle="Click to view subscribers"
          viewMode={globalViewMode}
          onClick={() => navigate('/admin/subscribers')} 
        />
        <DashboardCard 
          title="Revenue" 
          value={`₹ ${dashboardRev.subscriptionRevenue?.total?.toLocaleString() || 0}`} 
          subtitle="Total subscription revenue" 
          colorHex="#4b7bec" 
          icon={IndianRupee} 
          dailyValue={`₹ ${dashboardRev.subscriptionRevenue?.daily?.toLocaleString() || 0}`}
          weeklyValue={`₹ ${dashboardRev.subscriptionRevenue?.weekly?.toLocaleString() || 0}`}
          monthlyValue={`₹ ${dashboardRev.subscriptionRevenue?.monthly?.toLocaleString() || 0}`}
          trendValue={`₹ ${dashboardRev.subscriptionRevenue?.monthly?.toLocaleString() || 0}`} 
          viewMode={globalViewMode}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        
        {/* User Analytics Card */}
        <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-4 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-[15px] font-bold text-gray-800 mb-0.5">User Analytics</h2>
              <div className="text-[11px] text-gray-400">Overview of new vs active users</div>
            </div>
            <div className="flex items-center gap-3">
              <DateRangeDropdown value={userAnalyticsRange} onChange={setUserAnalyticsRange} />
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
              <div className="w-2 h-2 rounded-full bg-[#ff7f3f]"></div>
              New Users
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
              <div className="w-2 h-2 rounded-full bg-[#3b82f6]"></div>
              Active Users
            </div>
          </div>

          <div className="relative w-full flex-1 min-h-0">
             {!dashboard.userAnalytics || dashboard.userAnalytics.length === 0 ? (
               <div className="absolute inset-0 flex flex-col justify-center items-center text-gray-400">
                 <Users className="w-8 h-8 mb-2 opacity-20" />
                 <span className="text-sm font-medium">No user analytics data available</span>
               </div>
             ) : (
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart
                   data={dashboard.userAnalytics}
                   margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                 >
                   <defs>
                     <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#ff7f3f" stopOpacity={0.2} />
                       <stop offset="95%" stopColor="#ff7f3f" stopOpacity={0} />
                     </linearGradient>
                     <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                       <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#9ca3af' }}
                      tickFormatter={(val) => {
                        if(!val) return '';
                        const d = new Date(val);
                        return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`;
                      }}
                   />
                   <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#9ca3af' }} 
                   />
                   <Tooltip 
                     contentStyle={{ borderRadius: '8px', border: '1px solid #f1f5f9', fontSize: '12px' }}
                   />
                   <Area 
                     type="monotone" 
                     dataKey="newUsers" 
                     stroke="#ff7f3f" 
                     fillOpacity={1} 
                     fill="url(#colorNew)" 
                     strokeWidth={2}
                   />
                   <Area 
                     type="monotone" 
                     dataKey="activeUsers" 
                     stroke="#3b82f6" 
                     fillOpacity={1} 
                     fill="url(#colorActive)" 
                     strokeWidth={2}
                   />
                 </AreaChart>
               </ResponsiveContainer>
             )}
          </div>
        </div>

        {/* Subscription Revenue Card */}
        <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-4 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-[15px] font-bold text-gray-800 mb-0.5">Subscription Revenue</h2>
              <div className="text-[11px] text-gray-400">Revenue trend over time</div>
            </div>
            <div className="flex items-center gap-3">
              <DateRangeDropdown value={revenueRange} onChange={setRevenueRange} />
            </div>
          </div>

          <div className="relative w-full flex-1 min-h-0 mt-auto">
             {!dashboardRev.subscriptionRevenueAnalytics || dashboardRev.subscriptionRevenueAnalytics.length === 0 ? (
               <div className="absolute inset-0 flex flex-col justify-center items-center text-gray-400">
                 <IndianRupee className="w-8 h-8 mb-2 opacity-20" />
                 <span className="text-sm font-medium">No revenue data available</span>
               </div>
             ) : (
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart
                   data={dashboardRev.subscriptionRevenueAnalytics}
                   margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                 >
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#9ca3af' }}
                      tickFormatter={(val) => {
                        if(!val) return '';
                        const d = new Date(val);
                        return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`;
                      }}
                   />
                   <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#9ca3af' }} 
                      tickFormatter={(val) => `₹ ${val >= 1000 ? (val / 1000) + 'k' : val}`}
                   />
                   <Tooltip 
                     contentStyle={{ borderRadius: '8px', border: '1px solid #f1f5f9', fontSize: '12px' }}
                     cursor={{ fill: '#f1f5f9' }}
                   />
                   <Bar dataKey="revenue" fill="#7a9bf8" radius={[2, 2, 0, 0]} barSize={12} />
                 </BarChart>
               </ResponsiveContainer>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
