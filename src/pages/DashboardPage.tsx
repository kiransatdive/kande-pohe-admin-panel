import React from 'react';
import { ShoppingCart, CreditCard, BarChart2, Users, MoreHorizontal } from 'lucide-react';

const DashboardPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 text-sm">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white rounded-xl shadow-sm border-l-4 border-[#3bc0f9] p-5 flex justify-between items-center">
          <div>
            <div className="text-gray-500 font-medium mb-1">All Users</div>
            <div className="text-2xl font-bold text-[#3bc0f9] mb-1">4805</div>
            <div className="text-xs text-gray-400">+2.5% from last week</div>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#3bc0f9] to-[#046df1] text-white shadow-[0_4px_10px_rgba(59,192,249,0.3)]">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl shadow-sm border-l-4 border-[#ff4a73] p-5 flex justify-between items-center">
          <div>
            <div className="text-gray-500 font-medium mb-1">Approved Users</div>
            <div className="text-2xl font-bold text-[#ff4a73] mb-1">$84,245</div>
            <div className="text-xs text-gray-400">+5.4% from last week</div>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#ff4a73] to-[#d6214b] text-white shadow-[0_4px_10px_rgba(255,74,115,0.3)]">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl shadow-sm border-l-4 border-[#2ed573] p-5 flex justify-between items-center">
          <div>
            <div className="text-gray-500 font-medium mb-1">Pending Approval Users</div>
            <div className="text-2xl font-bold text-[#2ed573] mb-1">34.6%</div>
            <div className="text-xs text-gray-400">-4.5% from last week</div>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#2ed573] to-[#09a04a] text-white shadow-[0_4px_10px_rgba(46,213,115,0.3)]">
            <BarChart2 className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-xl shadow-sm border-l-4 border-[#ffa502] p-5 flex justify-between items-center">
          <div>
            <div className="text-gray-500 font-medium mb-1">Newly Register Users</div>
            <div className="text-2xl font-bold text-[#ffa502] mb-1">8.4K</div>
            <div className="text-xs text-gray-400">+8.4% from last week</div>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#ffa502] to-[#df8300] text-white shadow-[0_4px_10px_rgba(255,165,2,0.3)]">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-3 gap-6">
        
        {/* Sales Overview Card */}
        <div className="col-span-2 bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden flex flex-col">
          <div className="p-6 pb-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-semibold text-gray-800">Sales Overview</h2>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-1.5 px-3 py-1 border border-gray-200 rounded text-xs text-gray-500">
                <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]"></div>
                Sales
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 border border-gray-200 rounded text-xs text-gray-500">
                <div className="w-2.5 h-2.5 rounded-full bg-[#fbbf24]"></div>
                Visits
              </div>
            </div>

            {/* CSS Bar Chart Placeholder */}
            <div className="relative h-64 w-full border-l border-b border-gray-200 mb-6">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {[90, 80, 70, 60, 50, 40, 30, 20, 10].map((val) => (
                  <div key={val} className="w-full border-t border-gray-100 flex items-center relative">
                    <span className="absolute -left-7 text-xs text-gray-400">{val}</span>
                  </div>
                ))}
              </div>
              
              {/* Bars */}
              <div className="absolute inset-0 flex justify-around items-end px-4">
                {[
                  { label: 'Jan', sales: '70%', visits: '30%' },
                  { label: 'Feb', sales: '65%', visits: '55%' },
                  { label: 'Mar', sales: '90%', visits: '45%' },
                  { label: 'Apr', sales: '90%', visits: '20%' },
                  { label: 'May', sales: '70%', visits: '30%' },
                  { label: 'Jun', sales: '65%', visits: '55%' },
                  { label: 'Jul', sales: '90%', visits: '45%' },
                  { label: 'Aug', sales: '90%', visits: '20%' },
                  { label: 'Sep', sales: '65%', visits: '45%' },
                  { label: 'Oct', sales: '90%', visits: '20%' },
                  { label: 'Nov', sales: '90%', visits: '30%' },
                  { label: 'Dec', sales: '70%', visits: '55%' },
                ].map((month) => (
                  <div key={month.label} className="flex gap-1.5 h-full items-end relative group">
                    <div className="w-3 bg-gradient-to-t from-[#2563eb] to-[#3b82f6] rounded-t-sm transition-all duration-300 group-hover:opacity-80" style={{ height: month.sales }}></div>
                    <div className="w-3 bg-gradient-to-t from-[#f59e0b] to-[#fbbf24] rounded-t-sm transition-all duration-300 group-hover:opacity-80" style={{ height: month.visits }}></div>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">{month.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100">
              <div className="flex flex-col items-center justify-center py-5">
                <div className="text-xl font-semibold text-gray-800 mb-0.5">24.15M</div>
                <div className="text-xs text-gray-500">Overall Visitor <span className="text-gray-400">↑</span> 2.43%</div>
              </div>
              <div className="flex flex-col items-center justify-center py-5">
                <div className="text-xl font-semibold text-gray-800 mb-0.5">12:38</div>
                <div className="text-xs text-gray-500">Visitor Duration <span className="text-gray-400">↑</span> 12.65%</div>
              </div>
              <div className="flex flex-col items-center justify-center py-5">
                <div className="text-xl font-semibold text-gray-800 mb-0.5">639.82</div>
                <div className="text-xs text-gray-500">Pages/Visit <span className="text-gray-400">↑</span> 5.62%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trending Products Card */}
        <div className="col-span-1 bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-semibold text-gray-800">Trending Products</h2>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* CSS Donut Chart */}
          <div className="relative w-48 h-48 mx-auto my-12 flex items-center justify-center rounded-full shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)]"
               style={{ background: 'conic-gradient(#2ed573 0% 20%, white 20% 22%, #ff4757 22% 40%, white 40% 42%, #5352ed 42% 98%, white 98% 100%)' }}>
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            </div>
          </div>

          <div className="mt-8 flex flex-col space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-600">Jeans</span>
              <span className="bg-[#2ed573] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">25</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-600">T-Shirts</span>
              <span className="bg-[#ff4757] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">10</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-600">Shoes</span>
              <span className="bg-[#5352ed] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">65</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-600">Lingerie</span>
              <span className="bg-[#fbbf24] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">14</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
