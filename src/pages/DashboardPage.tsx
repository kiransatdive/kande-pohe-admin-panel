import React, { useState } from 'react';
import { Users, UserCheck, Clock, UserPlus, IndianRupee, Star, FileText, Camera, ArrowUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import DateRangeDropdown from '../components/common/DateRangeDropdown';
import { getDashboardData } from '../services/dashboardService';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState('28');

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardData', dateRange],
    queryFn: () => getDashboardData(dateRange)
  });

  const dashboard = data?.data;


  if (isLoading) {
    return <div className="flex justify-center items-center h-full text-gray-500 font-medium">Loading dashboard data...</div>;
  }

  if (error || !dashboard) {
    console.error("Dashboard error:", error, "data:", data);
    return (
      <div className="flex flex-col justify-center items-center h-full gap-2">
        <div className="text-red-500 font-medium">Error loading dashboard data.</div>
        <div className="text-sm text-gray-500 max-w-lg text-center">
          {error instanceof Error ? error.message : JSON.stringify(error)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 gap-6 text-sm">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div 
          onClick={() => navigate('/user-list')}
          className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border-l-[4px] border-[#0095ff] p-5 flex flex-col relative overflow-hidden min-h-[160px] cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="absolute bottom-0 right-0 left-0 h-16 opacity-30 pointer-events-none" style={{ background: 'radial-gradient(ellipse at bottom right, #0095ff20 0%, transparent 70%)' }}></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#0095ff] text-white shadow-lg shadow-[#0095ff]/40 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div className="flex flex-col items-end">
              <div className="text-[15px] font-bold text-gray-800 mb-1">All Users</div>
              <div className="text-[36px] font-bold text-[#0095ff] tracking-tight leading-none">{dashboard.users?.total?.toLocaleString() || 0}</div>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-1.5 mt-auto pt-4 relative z-10">
            <div className="flex items-center gap-1 text-[13px] font-bold text-[#10b981]">
              <div className="w-4 h-4 rounded-full bg-[#10b981]/15 flex items-center justify-center shrink-0">
                <ArrowUp className="w-3 h-3" strokeWidth={3} />
              </div>
              {dashboard.users?.monthly?.toLocaleString() || 0}
            </div>
            <span className="text-[11px] text-gray-400 font-medium ml-0.5">from last 30 days</span>
          </div>
        </div>

        {/* Card 2 */}
        <div 
          onClick={() => navigate('/user-list-approved')}
          className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border-l-[4px] border-[#ff4a73] p-5 flex flex-col relative overflow-hidden min-h-[160px] cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="absolute bottom-0 right-0 left-0 h-16 opacity-30 pointer-events-none" style={{ background: 'radial-gradient(ellipse at bottom right, #ff4a7320 0%, transparent 70%)' }}></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#ff4a73] text-white shadow-lg shadow-[#ff4a73]/40 shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div className="flex flex-col items-end">
              <div className="text-[15px] font-bold text-gray-800 mb-1">Approved Users</div>
              <div className="text-[36px] font-bold text-[#ff4a73] tracking-tight leading-none">{dashboard.approvedUsers?.total?.toLocaleString() || 0}</div>
            </div>
          </div>
          
          <div className="flex items-center justify-end mt-auto pt-4 border-t border-gray-100 relative z-10">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-medium text-gray-500 mb-1">Daily</span>
              <span className="text-[13px] font-bold text-[#ff4a73]">{dashboard.approvedUsers?.daily?.toLocaleString() || 0}</span>
            </div>
            <div className="w-px h-6 bg-gray-100 mx-2"></div>
            <div className="flex flex-col items-end pl-2">
              <span className="text-[10px] font-medium text-gray-500 mb-1">Weekly</span>
              <span className="text-[13px] font-bold text-[#ff4a73]">{dashboard.approvedUsers?.weekly?.toLocaleString() || 0}</span>
            </div>
            <div className="w-px h-6 bg-gray-100 mx-2"></div>
            <div className="flex flex-col items-end pl-2">
              <span className="text-[10px] font-medium text-gray-500 mb-1">Monthly</span>
              <span className="text-[13px] font-bold text-[#ff4a73]">{dashboard.approvedUsers?.monthly?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div 
          onClick={() => navigate('/user-list-pending-approval')}
          className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border-l-[4px] border-[#2ed573] p-5 flex flex-col relative overflow-hidden min-h-[160px] cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="absolute bottom-0 right-0 left-0 h-16 opacity-30 pointer-events-none" style={{ background: 'radial-gradient(ellipse at bottom right, #2ed57320 0%, transparent 70%)' }}></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#2ed573] text-white shadow-lg shadow-[#2ed573]/40 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div className="flex flex-col items-end">
              <div className="text-[15px] font-bold text-gray-800 mb-1">Pending Approval</div>
              <div className="text-[36px] font-bold text-[#2ed573] tracking-tight leading-none">{dashboard.pendingApprovalUsers?.total?.toLocaleString() || 0}</div>
            </div>
          </div>
          
          <div className="flex items-center justify-end mt-auto pt-4 border-t border-gray-100 relative z-10">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-medium text-gray-500 mb-1">Daily</span>
              <span className="text-[13px] font-bold text-[#2ed573]">{dashboard.pendingApprovalUsers?.daily?.toLocaleString() || 0}</span>
            </div>
            <div className="w-px h-6 bg-gray-100 mx-2"></div>
            <div className="flex flex-col items-end pl-2">
              <span className="text-[10px] font-medium text-gray-500 mb-1">Weekly</span>
              <span className="text-[13px] font-bold text-[#2ed573]">{dashboard.pendingApprovalUsers?.weekly?.toLocaleString() || 0}</span>
            </div>
            <div className="w-px h-6 bg-gray-100 mx-2"></div>
            <div className="flex flex-col items-end pl-2">
              <span className="text-[10px] font-medium text-gray-500 mb-1">Monthly</span>
              <span className="text-[13px] font-bold text-[#2ed573]">{dashboard.pendingApprovalUsers?.monthly?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div 
          onClick={() => navigate('/user-list-newly-registered')}
          className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border-l-[4px] border-[#ffa502] p-5 flex flex-col relative overflow-hidden min-h-[160px] cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="absolute bottom-0 right-0 left-0 h-16 opacity-30 pointer-events-none" style={{ background: 'radial-gradient(ellipse at bottom right, #ffa50220 0%, transparent 70%)' }}></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#ffa502] text-white shadow-lg shadow-[#ffa502]/40 shrink-0">
              <UserPlus className="w-6 h-6" />
            </div>
            <div className="flex flex-col items-end">
              <div className="text-[15px] font-bold text-gray-800 mb-1">Newly Registered</div>
              <div className="text-[36px] font-bold text-[#ffa502] tracking-tight leading-none">{dashboard.newUsers?.total?.toLocaleString() || 0}</div>
            </div>
          </div>
          
          <div className="flex items-center justify-end mt-auto pt-4 border-t border-gray-100 relative z-10">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-medium text-gray-500 mb-1">Daily</span>
              <span className="text-[13px] font-bold text-[#ffa502]">{dashboard.newUsers?.daily?.toLocaleString() || 0}</span>
            </div>
            <div className="w-px h-6 bg-gray-100 mx-2"></div>
            <div className="flex flex-col items-end pl-2">
              <span className="text-[10px] font-medium text-gray-500 mb-1">Weekly</span>
              <span className="text-[13px] font-bold text-[#ffa502]">{dashboard.newUsers?.weekly?.toLocaleString() || 0}</span>
            </div>
            <div className="w-px h-6 bg-gray-100 mx-2"></div>
            <div className="flex flex-col items-end pl-2">
              <span className="text-[10px] font-medium text-gray-500 mb-1">Monthly</span>
              <span className="text-[13px] font-bold text-[#ffa502]">{dashboard.newUsers?.monthly?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>

        {/* Card 5 */}
        <div 
          onClick={() => navigate('/user-list-bio')}
          className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border-l-[4px] border-[#00cec9] p-5 flex flex-col relative overflow-hidden min-h-[160px] cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="absolute bottom-0 right-0 left-0 h-16 opacity-30 pointer-events-none" style={{ background: 'radial-gradient(ellipse at bottom right, #00cec920 0%, transparent 70%)' }}></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#00cec9] text-white shadow-lg shadow-[#00cec9]/40 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex flex-col items-end">
              <div className="text-[15px] font-bold text-gray-800 mb-1">User Bio</div>
              <div className="text-[36px] font-bold text-[#00cec9] tracking-tight leading-none">{dashboard.bioUsers?.total?.toLocaleString() || 0}</div>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-1.5 mt-auto pt-4 relative z-10">
            <div className="flex items-center gap-1 text-[13px] font-bold text-[#10b981]">
              <div className="w-4 h-4 rounded-full bg-[#10b981]/15 flex items-center justify-center shrink-0">
                <ArrowUp className="w-3 h-3" strokeWidth={3} />
              </div>
              {dashboard.bioUsers?.monthly?.toLocaleString() || 0}
            </div>
            <span className="text-[11px] text-gray-400 font-medium ml-0.5">from last 30 days</span>
          </div>
        </div>

        {/* Card 6 */}
        <div 
          onClick={() => navigate('/user-list-photo-album')}
          className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border-l-[4px] border-[#fd79a8] p-5 flex flex-col relative overflow-hidden min-h-[160px] cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="absolute bottom-0 right-0 left-0 h-16 opacity-30 pointer-events-none" style={{ background: 'radial-gradient(ellipse at bottom right, #fd79a820 0%, transparent 70%)' }}></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#fd79a8] text-white shadow-lg shadow-[#fd79a8]/40 shrink-0">
              <Camera className="w-6 h-6" />
            </div>
            <div className="flex flex-col items-end">
              <div className="text-[15px] font-bold text-gray-800 mb-1">Photo Album</div>
              <div className="text-[36px] font-bold text-[#fd79a8] tracking-tight leading-none">{dashboard.photoAlbumUsers?.total?.toLocaleString() || 0}</div>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-1.5 mt-auto pt-4 relative z-10">
            <div className="flex items-center gap-1 text-[13px] font-bold text-[#10b981]">
              <div className="w-4 h-4 rounded-full bg-[#10b981]/15 flex items-center justify-center shrink-0">
                <ArrowUp className="w-3 h-3" strokeWidth={3} />
              </div>
              {dashboard.photoAlbumUsers?.monthly?.toLocaleString() || 0}
            </div>
            <span className="text-[11px] text-gray-400 font-medium ml-0.5">from last 30 days</span>
          </div>
        </div>

        {/* Card 7 */}
        <div 
          onClick={() => navigate('/admin/subscription-management')}
          className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border-l-[4px] border-[#a55eea] p-5 flex flex-col relative overflow-hidden min-h-[160px] cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="absolute bottom-0 right-0 left-0 h-16 opacity-30 pointer-events-none" style={{ background: 'radial-gradient(ellipse at bottom right, #a55eea20 0%, transparent 70%)' }}></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#a55eea] text-white shadow-lg shadow-[#a55eea]/40 shrink-0">
              <Star className="w-6 h-6" />
            </div>
            <div className="flex flex-col items-end">
              <div className="text-[15px] font-bold text-gray-800 mb-1">Subscribers</div>
              <div className="text-[36px] font-bold text-[#a55eea] tracking-tight leading-none">{dashboard.subscribers?.total?.toLocaleString() || 0}</div>
            </div>
          </div>
          
          <div className="flex items-center justify-end mt-auto pt-4 border-t border-gray-100 relative z-10">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-medium text-gray-500 mb-1">Daily</span>
              <span className="text-[13px] font-bold text-[#a55eea]">{dashboard.subscribers?.daily?.toLocaleString() || 0}</span>
            </div>
            <div className="w-px h-6 bg-gray-100 mx-2"></div>
            <div className="flex flex-col items-end pl-2">
              <span className="text-[10px] font-medium text-gray-500 mb-1">Weekly</span>
              <span className="text-[13px] font-bold text-[#a55eea]">{dashboard.subscribers?.weekly?.toLocaleString() || 0}</span>
            </div>
            <div className="w-px h-6 bg-gray-100 mx-2"></div>
            <div className="flex flex-col items-end pl-2">
              <span className="text-[10px] font-medium text-gray-500 mb-1">Monthly</span>
              <span className="text-[13px] font-bold text-[#a55eea]">{dashboard.subscribers?.monthly?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>

        {/* Card 8 */}
        <div 
          onClick={() => navigate('/admin/subscription-management')}
          className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border-l-[4px] border-[#4b7bec] p-5 flex flex-col relative overflow-hidden min-h-[160px] cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="absolute bottom-0 right-0 left-0 h-16 opacity-30 pointer-events-none" style={{ background: 'radial-gradient(ellipse at bottom right, #4b7bec20 0%, transparent 70%)' }}></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#4b7bec] text-white shadow-lg shadow-[#4b7bec]/40 shrink-0">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div className="flex flex-col items-end">
              <div className="text-[15px] font-bold text-gray-800 mb-1">Revenue</div>
              <div className="text-[36px] font-bold text-[#4b7bec] tracking-tight leading-none">₹ {dashboard.subscriptionRevenue?.total?.toLocaleString() || 0}</div>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-1.5 mt-auto pt-4 relative z-10">
            <div className="flex items-center gap-1 text-[13px] font-bold text-[#10b981]">
              <div className="w-4 h-4 rounded-full bg-[#10b981]/15 flex items-center justify-center shrink-0">
                <ArrowUp className="w-3 h-3" strokeWidth={3} />
              </div>
              ₹ {dashboard.subscriptionRevenue?.monthly?.toLocaleString() || 0}
            </div>
            <span className="text-[11px] text-gray-400 font-medium ml-0.5">from last 30 days</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[450px]">
        
        {/* User Analytics Card */}
        <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-5 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-[15px] font-bold text-gray-800 mb-0.5">User Analytics</h2>
              <div className="text-[11px] text-gray-400">Overview of new vs active users</div>
            </div>
            <div className="flex items-center gap-3">
              <DateRangeDropdown value={dateRange} onChange={setDateRange} />
            </div>
          </div>

          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
              <div className="w-2 h-2 rounded-full bg-[#ff7f3f]"></div>
              New Users
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
              <div className="w-2 h-2 rounded-full bg-[#3b82f6]"></div>
              Active Users
            </div>
          </div>

          <div className="relative w-full flex-1 min-h-[320px]">
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
        <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-5 flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-[15px] font-bold text-gray-800 mb-0.5">Subscription Revenue</h2>
              <div className="text-[11px] text-gray-400">Revenue trend over time</div>
            </div>
            <div className="flex items-center gap-3">
              <DateRangeDropdown value={dateRange} onChange={setDateRange} />
            </div>
          </div>

          <div className="relative w-full flex-1 min-h-[320px] mt-auto">
             {!dashboard.subscriptionRevenueAnalytics || dashboard.subscriptionRevenueAnalytics.length === 0 ? (
               <div className="absolute inset-0 flex flex-col justify-center items-center text-gray-400">
                 <IndianRupee className="w-8 h-8 mb-2 opacity-20" />
                 <span className="text-sm font-medium">No revenue data available</span>
               </div>
             ) : (
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart
                   data={dashboard.subscriptionRevenueAnalytics}
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
