import React from 'react';
import { TrendingUp, TrendingDown, ChevronRight, BarChart2 } from 'lucide-react';

export interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  colorHex: string;
  icon: React.ElementType;
  trendValue?: number | string;
  trendLabel?: string;
  trendStatus?: 'up' | 'down' | 'neutral';
  dailyValue?: string | number;
  weeklyValue?: string | number;
  monthlyValue?: string | number;
  footerTitle?: string;
  footerSubtitle?: string;
  viewMode?: 'total' | 'daily' | 'weekly' | 'monthly';
  onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  colorHex,
  icon: Icon,
  trendValue,
  trendLabel = 'from last 30 days',
  trendStatus = 'up',
  dailyValue,
  weeklyValue,
  monthlyValue,
  footerSubtitle,
  viewMode = 'total',
  onClick
}) => {
  // Determine trend styling
  let trendBgClass = 'bg-green-100';
  let trendTextClass = 'text-green-600';
  let TrendIcon = TrendingUp;

  if (trendStatus === 'down') {
    trendBgClass = 'bg-red-100';
    trendTextClass = 'text-red-600';
    TrendIcon = TrendingDown;
  } else if (trendStatus === 'neutral') {
    trendBgClass = 'bg-gray-100';
    trendTextClass = 'text-gray-600';
    TrendIcon = TrendingUp; // Or a minus icon
  }

  // Convert hex color to RGB for shadows
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 149, 255';
  };
  
  const rgbColor = hexToRgb(colorHex);

  const displayValue = () => {
    if (viewMode === 'daily' && dailyValue !== undefined) return dailyValue;
    if (viewMode === 'weekly' && weeklyValue !== undefined) return weeklyValue;
    if (viewMode === 'monthly' && monthlyValue !== undefined) return monthlyValue;
    return value;
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col relative overflow-hidden cursor-pointer hover:shadow-lg transition-all group min-h-[120px]"
    >
      {/* Dynamic Left Border */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-2 z-20"
        style={{ backgroundColor: colorHex }}
      ></div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 flex justify-between relative z-10 pl-5">
        
        {/* Left Section: Texts & Trend */}
        <div className="flex flex-col items-start z-10 w-full max-w-[70%]">
          <h3 className="text-sm font-bold text-slate-800 mb-0.5">{title}</h3>
          
          <div 
            className="text-3xl font-extrabold tracking-tight leading-none"
            style={{ color: colorHex }}
          >
            {displayValue()}
          </div>
          
          <p className="text-[10px] text-slate-500 mt-1 mb-2">{subtitle}</p>
          
          {trendValue !== undefined ? (
            <div className="flex items-center gap-1.5 mt-auto">
              <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full ${trendBgClass} ${trendTextClass} font-bold text-[10px]`}>
                <div className="w-3 h-3 rounded-full bg-white/40 flex items-center justify-center shrink-0">
                   <TrendIcon className="w-2 h-2" strokeWidth={3} />
                </div>
                {trendValue}
              </div>
              <span className="text-[9px] text-slate-400 font-medium">{trendLabel}</span>
            </div>
          ) : null}
        </div>

        {/* Right Section: Icon & Watermark */}
        <div className="relative flex flex-col items-end justify-between flex-1">
          {/* Main Icon with concentric shadows */}
          <div className="relative w-12 h-12 flex items-center justify-center z-20 group-hover:scale-105 transition-transform duration-300 mt-auto">
             {/* Concentric rings */}
             <div className="absolute inset-0 rounded-full opacity-[0.03] scale-[1.6]" style={{ backgroundColor: colorHex }}></div>
             <div className="absolute inset-0 rounded-full opacity-[0.06] scale-[1.3]" style={{ backgroundColor: colorHex }}></div>
             
             {/* Core Icon Button */}
             <div 
               className="relative w-full h-full rounded-full flex items-center justify-center text-white shadow-xl"
               style={{ 
                 background: `linear-gradient(135deg, ${colorHex}, rgba(${rgbColor}, 0.8))`,
                 boxShadow: `0 6px 15px -4px rgba(${rgbColor}, 0.5)`
               }}
             >
               <Icon className="w-5 h-5" strokeWidth={1.5} />
             </div>
          </div>
          

        </div>
      </div>

      {/* Footer Block */}
      {footerSubtitle ? (
        <div className="bg-slate-50 border-t border-slate-100 p-2.5 px-4 flex items-center justify-between z-10 pl-5">
           <div className="flex items-center gap-2">
             <div className="w-5 h-5 rounded-md bg-blue-100/50 flex items-center justify-center text-blue-600">
               <BarChart2 className="w-3 h-3" strokeWidth={2} />
             </div>
             <span className="text-[11px] font-medium text-slate-600">{footerSubtitle}</span>
           </div>
           <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
        </div>
      ) : (
        <div className="h-[41px] w-full invisible"></div>
      )}

    </div>
  );
};

export default DashboardCard;
