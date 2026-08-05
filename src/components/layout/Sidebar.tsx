import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Users, ChevronDown, ChevronRight,
  List, CheckCircle, LayoutList, FileCode, LayoutDashboard,
  Settings, Hourglass, Bookmark, BookmarkMinus, Utensils, Flame, Heart, MoreVertical, Link2, Landmark,
  Star, Activity, Asterisk, Folder, Mail, RefreshCw, UserCog
} from 'lucide-react';
import logo from '../../assets/logo.png';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const isAdminActive = location.pathname === '/admin' && openDropdown === null;
  const isDashboardActive = location.pathname === '/' && openDropdown === null;

  const adminDataString = localStorage.getItem('adminData');
  const adminData = adminDataString ? JSON.parse(adminDataString) : null;
  const adminEmail = adminData?.email || adminData?.vEmail || '';

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <aside className={`${isOpen ? 'w-[320px]' : 'w-[72px]'} flex-shrink-0 bg-slate-900 text-slate-400 flex flex-col h-screen overflow-y-auto overflow-x-hidden no-scrollbar font-sans transition-all duration-300 ease-in-out`}>
      {/* Logo Area */}
      <div className={`h-16 flex items-center justify-center pt-4 pb-2 ${isOpen ? 'px-6' : 'px-2'}`}>
        <img src={logo} alt="Logo" className={`w-auto object-contain transition-all duration-300 ${isOpen ? 'h-12' : 'h-8'}`} />
      </div>



      <nav className="flex-1 px-4 py-4 space-y-1">
        {/* Section: Pages */}
        {isOpen && (
          <div className="px-2 pt-2 pb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Main Menu
          </div>
        )}

        {adminEmail === 'superAdmin@example.com' && (
          <div> 
            <NavLink 
              to="/admin" 
              onClick={() => setOpenDropdown(null)}
              className={`w-full flex items-center px-2 py-2.5 text-sm text-slate-200 hover:bg-slate-800 rounded relative group transition-colors ${!isOpen && 'justify-center'} ${isAdminActive ? 'bg-slate-800' : ''}`}
            >
              {isAdminActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l"></div>}
              <div className={`flex items-center gap-3 ${isOpen ? 'ml-2' : ''}`}>
                <UserCog className={`w-5 h-5 flex-shrink-0 ${isAdminActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-200'}`} />
                {isOpen && <span className="font-semibold whitespace-nowrap">admin</span>}
              </div>
            </NavLink>
          </div>
        )}

        <div> 
          <NavLink 
            to="/" 
            onClick={() => setOpenDropdown(null)}
            className={`w-full flex items-center px-2 py-2.5 text-sm text-slate-200 hover:bg-slate-800 rounded relative group transition-colors ${!isOpen && 'justify-center'} ${isDashboardActive ? 'bg-slate-800' : ''}`}
          >
            {isDashboardActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l"></div>}
            <div className={`flex items-center gap-3 ${isOpen ? 'ml-2' : ''}`}>
              <LayoutDashboard className={`w-5 h-5 flex-shrink-0 ${isDashboardActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-200'}`} />
              {isOpen && <span className="font-semibold whitespace-nowrap">Dashboard</span>}
            </div>
          </NavLink>
        </div>

        {/* Dashboards Dropdown */}
        
        <div>
          <button   
            onClick={() => toggleDropdown('user-manage')}
            className={`w-full flex items-center ${isOpen ? 'justify-between' : 'justify-center'} px-2 py-2.5 text-sm text-slate-200 rounded relative group transition-colors ${openDropdown === 'user-manage' ? 'bg-slate-800' : 'hover:bg-slate-800'}`}
          >
            {openDropdown === 'user-manage' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l"></div>}
            <div className={`flex items-center gap-3 ${isOpen ? 'ml-2' : ''}`}>
              <Users className="w-5 h-5 flex-shrink-0 text-blue-500" />
              {isOpen && <span className="whitespace-nowrap font-semibold">User Manage</span>}
            </div>
            {isOpen && (openDropdown === 'user-manage' ? <ChevronDown className="w-4 h-4 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 flex-shrink-0" />)}
          </button>
          
          {isOpen && openDropdown === 'user-manage' && (
            <div className="mt-1 space-y-1">
              <NavLink 
                to="/user-list" 
                className={({ isActive }) => `flex items-center px-2 py-2.5 text-sm rounded relative group transition-colors ${isActive ? 'bg-slate-800 text-white' : 'text-slate-200 hover:bg-slate-800 hover:text-white'}`}
              >
                {({ isActive }) => (
                  <>
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l"></div>}
                    <div className="flex items-center gap-3 pl-7">
                      <List className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span className={`whitespace-nowrap ${isActive ? 'font-semibold' : ''}`}>User List(All)</span>
                    </div>
                  </>
                )}
              </NavLink>
              <NavLink 
                to="/user-list-approved" 
                className={({ isActive }) => `flex items-center px-2 py-2.5 text-sm rounded relative group transition-colors ${isActive ? 'bg-slate-800 text-white' : 'text-slate-200 hover:bg-slate-800 hover:text-white'}`}
              >
                {({ isActive }) => (
                  <>
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l"></div>}
                    <div className="flex items-center gap-3 pl-7">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span className={`whitespace-nowrap ${isActive ? 'font-semibold' : ''}`}>User List(Approved)</span>
                    </div>
                  </>
                )}
              </NavLink>
              <NavLink 
                to="/user-list-pending-approval" 
                className={({ isActive }) => `flex items-center px-2 py-2.5 text-sm rounded relative group transition-colors ${isActive ? 'bg-slate-800 text-white' : 'text-slate-200 hover:bg-slate-800 hover:text-white'}`}
              >
                {({ isActive }) => (
                  <>
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l"></div>}
                    <div className="flex items-center gap-3 pl-7">
                      <LayoutList className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span className={`whitespace-nowrap ${isActive ? 'font-semibold' : ''}`}>User List(in Pending Approval)</span>
                    </div>
                  </>
                )}
              </NavLink>
              <NavLink 
                to="/user-list-newly-registered" 
                className={({ isActive }) => `flex items-center px-2 py-2.5 text-sm rounded relative group transition-colors ${isActive ? 'bg-slate-800 text-white' : 'text-slate-200 hover:bg-slate-800 hover:text-white'}`}
              >
                {({ isActive }) => (
                  <>
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l"></div>}
                    <div className="flex items-center gap-3 pl-7">
                      <LayoutList className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span className={`whitespace-nowrap ${isActive ? 'font-semibold' : ''}`}>User List(Newly Register)</span>
                    </div>
                  </>
                )}
              </NavLink>
              <NavLink 
                to="/user-list-bio" 
                className={({ isActive }) => `flex items-center px-2 py-2.5 text-sm rounded relative group transition-colors ${isActive ? 'bg-slate-800 text-white' : 'text-slate-200 hover:bg-slate-800 hover:text-white'}`}
              >
                {({ isActive }) => (
                  <>
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l"></div>}
                    <div className="flex items-center gap-3 pl-7">
                      <FileCode className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span className={`whitespace-nowrap ${isActive ? 'font-semibold' : ''}`}>User List(in Bio)</span>
                    </div>
                  </>
                )}
              </NavLink>
              <NavLink 
                to="/user-list-photo-album" 
                className={({ isActive }) => `flex items-center px-2 py-2.5 text-sm rounded relative group transition-colors ${isActive ? 'bg-slate-800 text-white' : 'text-slate-200 hover:bg-slate-800 hover:text-white'}`}
              >
                {({ isActive }) => (
                  <>
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l"></div>}
                    <div className="flex items-center gap-3 pl-7">
                      <FileCode className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span className={`whitespace-nowrap ${isActive ? 'font-semibold' : ''}`}>User List(Photo Album)</span>
                    </div>
                  </>
                )}
              </NavLink>
            </div>
          )}
        </div>

        {/* Site Manage One Dropdown */}
        <div>
          <button   
            onClick={() => toggleDropdown('site-manage-one')}
            className={`w-full flex items-center ${isOpen ? 'justify-between' : 'justify-center'} px-2 py-2.5 text-sm text-slate-200 rounded relative group transition-colors mt-2 ${openDropdown === 'site-manage-one' ? 'bg-slate-800' : 'hover:bg-slate-800'}`}
          >
            {openDropdown === 'site-manage-one' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l"></div>}
            <div className={`flex items-center gap-3 ${isOpen ? 'ml-2' : ''}`}>
              <Settings className="w-5 h-5 flex-shrink-0 text-slate-200" />
              {isOpen && <span className="font-semibold whitespace-nowrap">Site Manage One</span>}
            </div>
            {isOpen && (openDropdown === 'site-manage-one' ? <ChevronDown className="w-4 h-4 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 flex-shrink-0" />)}
          </button>
          
          {isOpen && openDropdown === 'site-manage-one' && (
            <div className="mt-1 space-y-1">
              {[
                { name: 'Wightege', icon: Hourglass },
                { name: 'Community', icon: Bookmark },
                { name: 'Sub-Community', icon: BookmarkMinus },
                { name: 'Diet', icon: Utensils },
                { name: 'Gotra', icon: Flame },
                { name: 'Marital-Status', icon: Heart },
                { name: 'Height', icon: MoreVertical },
                { name: 'Father-Mother Status', icon: Link2 },
                { name: 'Education Name', icon: Link2 },
                { name: 'Education Level', icon: Link2 },
                { name: 'Religion', icon: Landmark },
              ].map((item) => (
                <NavLink 
                  key={item.name} 
                  to={`/admin/site-manage/${item.name.toLowerCase().replace(/ /g, '-')}`} 
                  className={({ isActive }) => `flex items-center px-2 py-2.5 text-sm rounded relative group transition-colors ${isActive ? 'bg-slate-800 text-white' : 'text-slate-200 hover:bg-slate-800 hover:text-white'}`}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l"></div>}
                      <div className="flex items-center gap-3 pl-7">
                        <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-200'}`} />
                        <span className={`whitespace-nowrap ${isActive ? 'font-semibold' : ''}`}>{item.name}</span>
                      </div>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          )}
        </div>  

        {/* Site Manage Two Dropdown */}
        <div>
          <button   
            onClick={() => toggleDropdown('site-manage-two')}
            className={`w-full flex items-center ${isOpen ? 'justify-between' : 'justify-center'} px-2 py-2.5 text-sm text-slate-200 rounded relative group transition-colors mt-2 ${openDropdown === 'site-manage-two' ? 'bg-slate-800' : 'hover:bg-slate-800'}`}
          >
            {openDropdown === 'site-manage-two' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l"></div>}
            <div className={`flex items-center gap-3 ${isOpen ? 'ml-2' : ''}`}>
              <Settings className="w-5 h-5 flex-shrink-0 text-slate-200" />
              {isOpen && <span className="font-semibold whitespace-nowrap">Site Manage Two</span>}
            </div>
            {isOpen && (openDropdown === 'site-manage-two' ? <ChevronDown className="w-4 h-4 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 flex-shrink-0" />)}
          </button>
          
          {isOpen && openDropdown === 'site-manage-two' && (
            <div className="mt-1 space-y-1">
              {[
                { name: 'Blood Group', icon: Activity },
                { name: 'Body Type', icon: Asterisk },
                { name: 'Charan', icon: Star },
                { name: 'Cultural Background', icon: Star },
                { name: 'Family Affluence Level', icon: Star },
                { name: 'Family Wealth Details', icon: Star },
                { name: 'Favourite Cousines', icon: Star },
                { name: 'Favourite Music', icon: Star },
                { name: 'Favourite Reads', icon: Star },
                { name: 'Gan', icon: Star },
                { name: 'Hobbies', icon: Star },
                { name: 'Interests', icon: Star },
                { name: 'Mother Tongue', icon: Hourglass },
                { name: 'Nadi', icon: Hourglass },
                { name: 'Nakshtra', icon: Hourglass },
                { name: 'Membership Type', icon: Hourglass },
                { name: 'Preferred Dress Style', icon: Hourglass },
                { name: 'Preferred Movies', icon: Hourglass },
                { name: 'Property Details', icon: Hourglass },
                { name: 'Raashi', icon: Hourglass },
                { name: 'Skin Tone', icon: Hourglass },
                { name: 'Sports Fitness Activities', icon: Hourglass },
                { name: 'Tags', icon: Hourglass },
                { name: 'Working With', icon: Hourglass },
                { name: 'Working As', icon: Hourglass },
              ].map((item) => (
                <NavLink 
                  key={item.name} 
                  to={`/admin/site-manage-two/${item.name.toLowerCase().replace(/ /g, '-')}`} 
                  className={({ isActive }) => `flex items-center px-2 py-2.5 text-sm rounded relative group transition-colors ${isActive ? 'bg-slate-800 text-white' : 'text-slate-200 hover:bg-slate-800 hover:text-white'}`}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l"></div>}
                      <div className="flex items-center gap-3 pl-7">
                        <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-200'}`} />
                        <span className={`whitespace-nowrap ${isActive ? 'font-semibold' : ''}`}>{item.name}</span>
                      </div>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          )}
        </div>
        {/* CMS Dropdown */}
        <div>
          <button   
            onClick={() => toggleDropdown('cms')}
            className={`w-full flex items-center ${isOpen ? 'justify-between' : 'justify-center'} px-2 py-2.5 text-sm text-slate-200 rounded relative group transition-colors mt-2 ${openDropdown === 'cms' ? 'bg-slate-800' : 'hover:bg-slate-800'}`}
          >
            {openDropdown === 'cms' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l"></div>}
            <div className={`flex items-center gap-3 ${isOpen ? 'ml-2' : ''}`}>
              <Folder className="w-5 h-5 flex-shrink-0 text-slate-200" />
              {isOpen && <span className="font-semibold whitespace-nowrap">CMS</span>}
            </div>
            {isOpen && (openDropdown === 'cms' ? <ChevronDown className="w-4 h-4 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 flex-shrink-0" />)}
          </button>
          
          {isOpen && openDropdown === 'cms' && (
            <div className="mt-1 space-y-1">
              {[
                { name: 'Email Template', icon: Mail },
                { name: 'SMS Template', icon: Mail },
                { name: 'Site Message', icon: Mail },
                { name: 'City', icon: Mail },
                { name: 'Caste', icon: Mail },
                { name: 'Education', icon: Mail },
                { name: 'Occupation', icon: Mail },
                { name: 'Physical Status', icon: Mail },
                { name: 'Marital Status', icon: Mail },
                { name: 'Other Meta Management', icon: Mail },
              ].map((item) => (
                <NavLink 
                  key={item.name} 
                  to={`/admin/cms/${item.name.toLowerCase().replace(/ /g, '-')}`} 
                  className={({ isActive }) => `flex items-center px-2 py-2.5 text-sm rounded relative group transition-colors ${isActive ? 'bg-slate-800 text-white' : 'text-slate-200 hover:bg-slate-800 hover:text-white'}`}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l"></div>}
                      <div className="flex items-center gap-3 pl-7">
                        <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-200'}`} />
                        <span className={`whitespace-nowrap ${isActive ? 'font-semibold' : ''}`}>{item.name}</span>
                      </div>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        {/* Single Links */}
        <NavLink to="/admin/site-cms" className={`w-full flex items-center px-2 py-2.5 text-sm text-slate-200 hover:bg-slate-800 rounded group transition-colors mt-2 ${!isOpen && 'justify-center'}`}>
          <div className={`flex items-center gap-3 ${isOpen ? 'ml-2' : ''}`}>
            <Settings className="w-5 h-5 flex-shrink-0 text-slate-200" />
            {isOpen && <span className="font-semibold whitespace-nowrap">Site CMS</span>}
          </div>
        </NavLink>
        
        <NavLink to="/admin/subscription-management" className={`w-full flex items-center px-2 py-2.5 text-sm text-slate-200 hover:bg-slate-800 rounded group transition-colors mt-2 ${!isOpen && 'justify-center'}`}>
          <div className={`flex items-center gap-3 ${isOpen ? 'ml-2' : ''}`}>
            <RefreshCw className="w-5 h-5 flex-shrink-0 text-slate-200" />
            {isOpen && <span className="font-semibold whitespace-nowrap">Subscription Management</span>}
          </div>
        </NavLink>

      </nav>
    </aside>
  );
};

export default Sidebar;
