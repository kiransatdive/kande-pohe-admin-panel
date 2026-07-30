import React from 'react';
import { Users, UserCheck, Clock, UserPlus, MoreHorizontal, IndianRupee, Star, FileText, Camera } from 'lucide-react';

const DashboardPage: React.FC = () => {
  return (
    <div className="flex flex-col flex-1 gap-6 text-sm">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white rounded-xl shadow-sm border-l-4 border-[#3bc0f9] p-5 flex justify-between items-center">
          <div>
            <div className="text-gray-500 font-medium mb-1">All Users</div>
            <div className="text-2xl font-bold text-[#3bc0f9] mb-1">4805</div>
            {/* <div className="text-xs text-gray-400">200 from last week</div> */}
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#3bc0f9] to-[#046df1] text-white shadow-[0_4px_10px_rgba(59,192,249,0.3)]">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl shadow-sm border-l-4 border-[#ff4a73] p-5 flex justify-between items-center">
          <div>
            <div className="text-gray-500 font-medium mb-1">Approved Users</div>
            <div className="text-2xl font-bold text-[#ff4a73] mb-1">84,245</div>
            {/* <div className="text-xs text-gray-400">+5.4% from last week</div> */}
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#ff4a73] to-[#d6214b] text-white shadow-[0_4px_10px_rgba(255,74,115,0.3)]">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl shadow-sm border-l-4 border-[#2ed573] p-5 flex justify-between items-center">
          <div>
            <div className="text-gray-500 font-medium mb-1">Pending Approval Users</div>
            <div className="text-2xl font-bold text-[#2ed573] mb-1">348</div>
            {/* <div className="text-xs text-gray-400">-4.5% from last week</div> */}
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#2ed573] to-[#09a04a] text-white shadow-[0_4px_10px_rgba(46,213,115,0.3)]">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-xl shadow-sm border-l-4 border-[#ffa502] p-5 flex justify-between items-center">
          <div>
            <div className="text-gray-500 font-medium mb-1">Newly Register Users</div>
            <div className="text-2xl font-bold text-[#ffa502] mb-1">800</div>
            {/* <div className="text-xs text-gray-400">+8.4% from last week</div> */}
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#ffa502] to-[#df8300] text-white shadow-[0_4px_10px_rgba(255,165,2,0.3)]">
            <UserPlus className="w-5 h-5" />
          </div>
        </div>

        {/* Card 5 */}
        <div className="bg-white rounded-xl shadow-sm border-l-4 border-[#00cec9] p-5 flex justify-between items-center">
          <div>
            <div className="text-gray-500 font-medium mb-1">User Bio Users</div>
            <div className="text-2xl font-bold text-[#00cec9] mb-1">1,436</div>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#00cec9] to-[#01a3a4] text-white shadow-[0_4px_10px_rgba(0,206,201,0.3)]">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        {/* Card 6 */}
        <div className="bg-white rounded-xl shadow-sm border-l-4 border-[#fd79a8] p-5 flex justify-between items-center">
          <div>
            <div className="text-gray-500 font-medium mb-1">Photo Album Users</div>
            <div className="text-2xl font-bold text-[#fd79a8] mb-1">104</div>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#fd79a8] to-[#e84393] text-white shadow-[0_4px_10px_rgba(253,121,168,0.3)]">
            <Camera className="w-5 h-5" />
          </div>
        </div>

        {/* Card 7 */}
        <div className="bg-white rounded-xl shadow-sm border-l-4 border-[#a55eea] p-5 flex justify-between items-center">
          <div>
            <div className="text-gray-500 font-medium mb-1">Subscriber Counts</div>
            <div className="text-2xl font-bold text-[#a55eea] mb-1">2,150</div>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#a55eea] to-[#8854d0] text-white shadow-[0_4px_10px_rgba(165,94,234,0.3)]">
            <Star className="w-5 h-5" />
          </div>
        </div>

        {/* Card 8 */}
        <div className="bg-white rounded-xl shadow-sm border-l-4 border-[#4b7bec] p-5 flex justify-between items-center">
          <div>
            <div className="text-gray-500 font-medium mb-1">Subscription Revenue</div>
            <div className="text-2xl font-bold text-[#4b7bec] mb-1">₹ 1,50,000</div>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#4b7bec] to-[#3867d6] text-white shadow-[0_4px_10px_rgba(75,123,236,0.3)]">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[300px]">
        
        {/* Sales Overview Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden flex flex-col">
          <div className="p-6 pb-2 flex flex-col flex-1">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-8">
                <h2 className="text-base font-semibold text-gray-800">User Analytics</h2>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex gap-4 mr-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
                    <div className="w-2 h-2 rounded-full bg-[#f97316]"></div>
                    New Users
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
                    <div className="w-2 h-2 rounded-full bg-[#1e40af]"></div>
                    Active Users
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative w-full mt-6 mb-4 flex-1 min-h-[250px]">
              {/* Y Axis Labels */}
              <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[10px] text-gray-400 font-medium">
                <span>30K</span>
                <span>20K</span>
                <span>10K</span>
                <span>0</span>
              </div>
              
              <div className="absolute left-10 right-4 top-2 bottom-8">
                {/* Horizontal Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between">
                  <div className="w-full border-t border-gray-100/60"></div>
                  <div className="w-full border-t border-gray-100/60"></div>
                  <div className="w-full border-t border-gray-100/60"></div>
                  <div className="w-full border-t border-gray-100"></div>
                </div>

                <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.2"/>
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0"/>
                    </linearGradient>
                    <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1e40af" stopOpacity="0.15"/>
                      <stop offset="100%" stopColor="#1e40af" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Area Fills */}
                  <path d="M 0,110 C 80,180 150,180 230,160 C 310,140 350,60 450,55 C 500,50 550,65 600,65 L 600,200 L 0,200 Z" fill="url(#blueGrad)" vectorEffect="non-scaling-stroke" />
                  <path d="M 0,170 C 50,100 150,70 230,80 C 310,90 350,170 450,160 C 520,150 550,80 600,50 L 600,200 L 0,200 Z" fill="url(#orangeGrad)" vectorEffect="non-scaling-stroke" />
                  
                  {/* Blue Line Solid */}
                  <path d="M 0,110 C 80,180 150,180 230,160 C 310,140 350,60 450,55" fill="none" stroke="#1e40af" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                  {/* Blue Line Dotted */}
                  <path d="M 450,55 C 500,50 550,65 600,65" fill="none" stroke="#1e40af" strokeWidth="2.5" strokeDasharray="4,4" vectorEffect="non-scaling-stroke" />
                  
                  {/* Orange Line */}
                  <path d="M 0,170 C 50,100 150,70 230,80 C 310,90 350,170 450,160 C 520,150 550,80 600,50" fill="none" stroke="#fb923c" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />

                  {/* Tooltip Dot */}
                  <circle cx="212" cy="164" r="3" fill="white" stroke="#1e40af" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                </svg>

                {/* Tooltip UI overlay */}
                <div className="absolute left-[35%] top-[68%] -translate-x-1/2 -translate-y-[150%]">
                  <div className="bg-[#1e40af] text-white text-[11px] font-semibold py-1 px-2.5 rounded-md shadow-md relative">
                    15,765
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1e40af] rotate-45"></div>
                  </div>
                </div>
              </div>

              {/* X Axis Labels */}
              <div className="absolute left-10 right-4 bottom-0 flex justify-between text-[10px] text-gray-400 font-medium px-4">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Revenue Card */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-semibold text-gray-800">Subscription Revenue</h2>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          <div className="relative w-full mt-2 flex-1 min-h-[250px]">
            {/* Y Axis Labels */}
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] text-gray-400 font-medium">
              <span>1,500</span>
              <span>1,000</span>
              <span>500</span>
              <span>0</span>
            </div>

            <div className="absolute left-10 right-2 top-2 bottom-6">
              {/* Horizontal Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between">
                <div className="w-full border-t border-gray-100/60"></div>
                <div className="w-full border-t border-gray-100/60"></div>
                <div className="w-full border-t border-gray-100/60"></div>
                <div className="w-full border-t border-gray-100"></div>
              </div>

              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 150" preserveAspectRatio="none">
                {/* Bars */}
                {[
                  { x: 12.5, y: 140, h: 10 },
                  { x: 37.5, y: 125, h: 25 },
                  { x: 62.5, y: 110, h: 40 },
                  { x: 87.5, y: 95, h: 55 },
                  { x: 112.5, y: 85, h: 65 },
                  { x: 137.5, y: 70, h: 80 },
                  { x: 162.5, y: 55, h: 95 },
                  { x: 187.5, y: 45, h: 105 },
                  { x: 212.5, y: 35, h: 115 },
                  { x: 237.5, y: 25, h: 125 },
                  { x: 262.5, y: 15, h: 135 },
                  { x: 287.5, y: 5, h: 145 },
                ].map((bar, i) => (
                  <rect key={i} x={bar.x - 6} y={bar.y} width="12" height={bar.h} fill="#3b82f6" rx="1" vectorEffect="non-scaling-stroke" />
                ))}

                {/* Line */}
                <path d="M 12.5,135 L 37.5,120 L 62.5,105 L 87.5,90 L 112.5,80 L 137.5,65 L 162.5,50 L 187.5,40 L 212.5,30 L 237.5,20 L 262.5,10 L 287.5,0" fill="none" stroke="#84cc16" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                
                {/* Line Dots */}
                {[
                  { x: 12.5, y: 135 },
                  { x: 37.5, y: 120 },
                  { x: 62.5, y: 105 },
                  { x: 87.5, y: 90 },
                  { x: 112.5, y: 80 },
                  { x: 137.5, y: 65 },
                  { x: 162.5, y: 50 },
                  { x: 187.5, y: 40 },
                  { x: 212.5, y: 30 },
                  { x: 237.5, y: 20 },
                  { x: 262.5, y: 10 },
                  { x: 287.5, y: 0 },
                ].map((dot, i) => (
                  <circle key={i} cx={dot.x} cy={dot.y} r="3.5" fill="#84cc16" vectorEffect="non-scaling-stroke" />
                ))}
              </svg>
            </div>

            {/* X Axis Labels */}
            <div className="absolute left-10 right-2 bottom-0 flex justify-between text-[9px] text-gray-400 font-medium">
              <span>Jan 2026</span>
              <span>Apr 2026</span>
              <span>Jul 2026</span>
              <span>Oct 2026</span>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <div className="flex justify-center items-center gap-6">
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]"></div>
                Subscribers
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                <div className="w-2.5 h-2.5 rounded-full bg-[#84cc16]"></div>
                Revenue
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
