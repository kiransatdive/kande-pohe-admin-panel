import React from 'react';


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
  dailyValue,
  weeklyValue,
  monthlyValue,
  footerSubtitle,
  viewMode = 'total',
  onClick
}) => {
  // rgbColor and hexToRgb are no longer needed since we use solid background colors

  const displayValue = () => {
    if (viewMode === 'daily' && dailyValue !== undefined) return dailyValue;
    if (viewMode === 'weekly' && weeklyValue !== undefined) return weeklyValue;
    if (viewMode === 'monthly' && monthlyValue !== undefined) return monthlyValue;
    return value;
  };

  // Determine what to show in the bottom right corner (the "+32 New" equivalent)
  const displayTrend = () => {
    if (trendValue !== undefined) return trendValue;
    if (viewMode === 'monthly' && monthlyValue !== undefined) return monthlyValue;
    if (viewMode === 'weekly' && weeklyValue !== undefined) return weeklyValue;
    if (viewMode === 'daily' && dailyValue !== undefined) return dailyValue;
    return null;
  };

  const trend = displayTrend();

  return (
    <div 
      onClick={onClick}
      title={footerSubtitle}
      className="rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-4 flex flex-col justify-between relative overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.2)] transition-all duration-300 min-h-[110px]"
      style={{ 
        backgroundImage: `linear-gradient(135deg, ${colorHex} 0%, color-mix(in srgb, ${colorHex}, black 25%) 100%)`, 
        color: 'white' 
      }}
    >
      {/* Top Line: Title */}
      <div className="text-[13px] font-semibold text-white/90 leading-tight mb-2">
        {title}
      </div>

      {/* Middle Line: Icon and Value */}
      <div className="flex justify-between items-center mb-2 flex-1">
        {/* Icon */}
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-white/20">
          <Icon className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        
        {/* Value */}
        <div className="text-[28px] font-bold text-white leading-none tracking-tight">
          {displayValue()}
        </div>
      </div>

      {/* Bottom Line: Subtitle and Trend */}
      <div className="flex justify-between items-end mt-auto">
        <div className="text-[11px] text-white/70 leading-snug truncate pr-2 hidden sm:block">
          {subtitle}
        </div>
        
        {trend !== null && trend !== 0 && trend !== "0" && trend !== "₹ 0" && (
          <div className="text-[12px] font-bold tracking-wide text-white shrink-0">
            +{trend} New
          </div>
        )}
      </div>
      
      {/* Footer Block - Click to View */}
      {footerSubtitle && (
        <div className="mt-3 pt-2 border-t border-white/20 flex items-center justify-between text-[11px] font-medium text-white/70 group-hover:text-white transition-colors">
          <span className="truncate pr-2">{footerSubtitle}</span>
          <svg className="w-3.5 h-3.5 text-white/50 group-hover:text-white transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
