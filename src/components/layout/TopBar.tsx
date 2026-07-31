import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, Bell, MessageSquare, FileText, PiggyBank, Coins, TrendingUp, Paperclip, Star, CalendarDays
} from 'lucide-react';

const notifications = [
  {
    id: 1,
    icon: <FileText className="w-4 h-4 text-white" />,
    iconBg: 'bg-[#3b82f6]',
    title: 'Wrapped Bitcoin is now listen on Unity Exchange',
    desc: "With our newest listing, we're welcoming Wrapped Bitcoin (wBTC) to our DeFi Innovation Zone! You can now deposit...",
    time: '24m ago',
    unread: true,
    bgActive: true
  },
  {
    id: 2,
    icon: <PiggyBank className="w-4 h-4 text-white" />,
    iconBg: 'bg-[#facc15]',
    title: 'Airdrop BCHA - 0.25118470 Your airdrop for Nov 15, 2020.',
    desc: "With our newest listing, we're welcoming Wrapped Bitcoin (wBTC) to our DeFi Innovation Zone! You can now deposit...",
    time: '24m ago',
    unread: true
  },
  {
    id: 3,
    icon: <FileText className="w-4 h-4 text-white" />,
    iconBg: 'bg-[#0ea5e9]',
    title: 'CyberVeinToken is Now Available on Unity Exchange',
    desc: "With our newest listing, we're welcoming Wrapped Bitcoin (wBTC) to our DeFi Innovation Zone! You can now deposit...",
    time: '21m ago',
    unread: true
  },
  {
    id: 4,
    icon: <FileText className="w-4 h-4 text-white" />,
    iconBg: 'bg-[#d1d5db]',
    title: 'Inflation STR Amount 2.44273762',
    desc: "Your Stellar inflation reward for the week of Oct 1, 2019. Inflation STR - Oct 1st, 2019 07:05:16 - HRZJSYA3563",
    time: '24m ago',
    unread: false,
    textGray: true
  },
  {
    id: 5,
    icon: <Coins className="w-4 h-4 text-white" />,
    iconBg: 'bg-[#a855f7]',
    title: 'Unification is Now Available on Unity Exchange',
    desc: "With our newest listing, we're welcoming Wrapped Bitcoin (wBTC) to our DeFi Innovation Zone! You can now deposit...",
    time: '34m ago',
    unread: true
  },
  {
    id: 6,
    icon: <TrendingUp className="w-4 h-4 text-white" />,
    iconBg: 'bg-[#f59e0b]',
    title: 'Inflation STR Amount 2.44273762',
    desc: "With our newest listing, we're welcoming Wrapped Bitcoin (wBTC) to our DeFi Innovation Zone! You can now deposit...",
    time: '54m ago',
    unread: true
  },
  {
    id: 7,
    icon: <FileText className="w-4 h-4 text-white" />,
    iconBg: 'bg-[#ef4444]',
    title: 'Inflation BTC Amount 0.14427376254676',
    desc: "With our newest listing, we're welcoming Wrapped Bitcoin (wBTC) to our DeFi Innovation Zone! You can now deposit...",
    time: '44m ago',
    unread: true
  }
];

const messagesData = [
  {
    id: 1,
    avatar: 'https://i.pravatar.cc/150?img=12',
    name: 'Elena Mateo',
    title: 'I heard you recently traveled. Tell me all ...',
    desc: 'Passionate frontend developer with a love for creating beautiful and responsive user...',
    date: '24 feb 2024, 2:25 pm',
    hasAttachment: true,
    hasStar: false,
    active: true,
  },
  {
    id: 2,
    avatar: 'https://i.pravatar.cc/150?img=32',
    name: 'Valentine Maton',
    title: 'Just finished a great book and wanted to...',
    desc: 'Dedicated affiliate marketer specializing in driving online sales and revenue. Enjoys...',
    date: '25 feb 2024, 3:15 pm',
    hasAttachment: true,
    hasStar: true,
  },
  {
    id: 3,
    avatar: 'https://i.pravatar.cc/150?img=68',
    name: 'Laura Foreman',
    title: "Long time no talk. Let's plan a catch-up ...",
    desc: 'Fullstack developer with a passion for building end-to-end web applications. Enjoys working...',
    date: '26 feb 2024, 4:30 pm',
    hasAttachment: false,
    hasStar: false,
  },
  {
    id: 4,
    avatar: 'https://i.pravatar.cc/150?img=47',
    name: 'Erna Serpa',
    title: 'I stumbled upon an interesting article to...',
    desc: 'Devoted Angular developer with expertise in building scalable and feature-rich web...',
    date: '24 feb 2024, 2:25 pm',
    hasAttachment: true,
    hasStar: false,
  },
  {
    id: 5,
    avatar: 'https://i.pravatar.cc/150?img=52',
    name: 'Timothy Boyd',
    title: 'Are you free for a quick chat later?',
    desc: 'Passionate Vue.js developer with a knack for building modular and maintainable front-end...',
    date: '25 feb 2024, 3:15 pm',
    hasAttachment: false,
    hasStar: true,
  }
];

interface TopBarProps {
  onToggleSidebar?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get admin data from localStorage
  const adminDataString = localStorage.getItem('adminData');
  const adminData = adminDataString ? JSON.parse(adminDataString) : null;
  const adminName = adminData ? `${adminData.firstName} ${adminData.lastName}` : 'Admin User';
  const adminRole = adminData?.role || 'Administrator';

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('adminData');
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
        setIsMessageOpen(false);
        setIsProfilePopupOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getPageTitle = (pathname: string) => {
    if (pathname === '/') return 'Dashboard';
    if (pathname === '/admin') return 'Admin';
    
    // User Manage mappings
    if (pathname === '/user-list') return 'User Manage > User List (All)';
    if (pathname === '/user-list-approved') return 'User Manage > User List (Approved)';
    if (pathname === '/user-list-pending-approval') return 'User Manage > User List (in Pending Approval)';
    if (pathname === '/user-list-newly-registered') return 'User Manage > User List (Newly Register)';
    if (pathname === '/user-list-bio') return 'User Manage > User List (in Bio)';
    if (pathname === '/user-list-photo-album') return 'User Manage > User List (Photo Album)';
    
    const segments = pathname.split('/').filter(Boolean);
    
    // Nested admin routes (e.g., /admin/site-manage/diet)
    if (segments[0] === 'admin' && segments.length >= 3) {
      const parent = segments[1].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      const child = segments[2].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      return `${parent} > ${child}`;
    }

    const lastSegment = segments[segments.length - 1] || 'Dashboard';
    
    return lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const pageTitle = getPageTitle(location.pathname);

  useEffect(() => {
    document.title = `${pageTitle} - Kande Pohe`;
  }, [pageTitle]);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0 font-sans">
      <div className="flex items-center gap-4">
        {/* Hamburger Menu */}
        <button 
          onClick={onToggleSidebar}
          className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-[17px] font-semibold text-gray-800 ml-1 hidden md:block">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-3 md:gap-5 text-gray-500" ref={dropdownRef}>
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => {
              setIsNotificationOpen(!isNotificationOpen);
              setIsMessageOpen(false);
              setIsProfilePopupOpen(false);
            }}
            className="relative p-1 hover:text-gray-700 transition-colors focus:outline-none"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
              4
            </span>
          </button>

          {isNotificationOpen && (
            <div className="absolute right-0 md:-right-16 top-12 w-[420px] bg-white border border-gray-100 rounded-xl shadow-2xl z-50 text-left overflow-hidden">
              <div className="max-h-[500px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="flex flex-col p-2 gap-1 border-t border-gray-50">
                  <h3 className="text-[13px] font-semibold text-gray-800 px-3 pt-2 pb-1">Today</h3>
                  {notifications.map((notif, index) => (
                    <React.Fragment key={notif.id}>
                      {index === 3 && (
                        <h3 className="text-[13px] font-semibold text-gray-800 px-3 pt-4 pb-1">Yesterday</h3>
                      )}
                      <div className={`flex gap-3 p-3 rounded-lg border border-transparent cursor-pointer transition-colors ${notif.bgActive ? 'bg-[#f8faff]' : 'hover:bg-gray-50 border-b-gray-50 last:border-b-transparent'}`}>
                        <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${notif.iconBg}`}>
                          {notif.icon}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h4 className={`text-[13px] font-semibold leading-tight pr-2 truncate ${notif.textGray ? 'text-gray-500' : 'text-gray-800'}`}>
                            {notif.title}
                          </h4>
                          <p className={`text-[11px] leading-snug mt-1 pr-4 line-clamp-2 ${notif.textGray ? 'text-gray-400' : 'text-gray-500'}`}>
                            {notif.desc}
                          </p>
                        </div>
                        <div className="flex flex-col items-end justify-between flex-shrink-0 w-12 py-0.5">
                          <span className="text-[10px] text-gray-500 font-medium">{notif.time}</span>
                          <div className={`w-1.5 h-1.5 rounded-full mb-1 ${notif.unread ? 'bg-[#3b82f6]' : 'bg-gray-300'}`}></div>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="relative">
          <button 
            onClick={() => {
              setIsMessageOpen(!isMessageOpen);
              setIsNotificationOpen(false);
              setIsProfilePopupOpen(false);
            }}
            className="relative p-1 hover:text-gray-700 transition-colors focus:outline-none"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          {isMessageOpen && (
            <div className="absolute right-0 md:-right-8 top-12 w-[380px] bg-white border border-gray-100 rounded-xl shadow-2xl z-50 text-left overflow-hidden">
              {/* Search Bar */}
              <div className="p-3 border-b border-gray-50/50">
                <input 
                  type="text" 
                  placeholder="Search...." 
                  className="w-full bg-gray-50/80 border border-gray-100/50 text-sm text-gray-700 placeholder-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-200"
                />
              </div>

              {/* Message List */}
              <div className="max-h-[460px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="flex flex-col">
                  {messagesData.map((msg, index) => (
                    <React.Fragment key={msg.id}>
                      {index === 0 && (
                        <h3 className="text-[13px] font-semibold text-gray-800 px-5 pt-3 pb-1 border-b border-gray-50/50">Today</h3>
                      )}
                      {index === 2 && (
                        <h3 className="text-[13px] font-semibold text-gray-800 px-5 pt-4 pb-1 border-b border-gray-50/50">Yesterday</h3>
                      )}
                      <div className={`flex gap-3 px-5 py-4 cursor-pointer transition-colors border-b border-gray-50 last:border-0 ${msg.active ? 'bg-gray-50/80' : 'hover:bg-gray-50/50'}`}>
                        <img src={msg.avatar} alt={msg.name} className="w-9 h-9 rounded-full border border-gray-200 object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-0.5">
                            <span className="text-[13px] font-medium text-gray-700">{msg.name}</span>
                            <div className="flex gap-2 text-gray-400">
                              {msg.hasAttachment && <Paperclip className="w-3.5 h-3.5" />}
                              {msg.hasStar && <Star className="w-3.5 h-3.5 text-yellow-400" />}
                            </div>
                          </div>
                          <h4 className="text-[13px] font-semibold text-gray-800 leading-snug truncate mb-1">
                            {msg.title}
                          </h4>
                          <p className="text-[12px] text-gray-500 leading-snug line-clamp-2 mb-3">
                            {msg.desc}
                          </p>
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <CalendarDays className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-medium">{msg.date}</span>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

       

        {/* Profile Popover (Right Side) */}
        <div className="relative">
          <button 
            onClick={() => {
              setIsProfilePopupOpen(!isProfilePopupOpen);
              setIsNotificationOpen(false);
              setIsMessageOpen(false);
            }}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
          >
            <div className="relative">
              <img 
                src="https://i.pravatar.cc/150?img=11" 
                alt={adminName}
                className="w-9 h-9 rounded-full border border-gray-200 object-cover"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <span className="text-[13px] text-gray-700 font-semibold tracking-wide hidden sm:inline-block">{adminName}</span>
          </button>

          {isProfilePopupOpen && (
            <div className="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded-lg shadow-xl py-4 px-4 z-50 text-left">
              <div className="flex flex-col">
                <span className="text-sm text-gray-900 font-medium">{adminName}</span>
                <span className="text-xs text-gray-500 mt-0.5">{adminRole}</span>
                
                <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2.5">
                  <button onClick={handleLogout} className="text-left text-xs text-red-500 hover:text-red-600 transition-colors">Sign Out</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
