import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!localStorage.getItem('isAuthenticated')) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans">
      {/* Sidebar Wrapper for mobile responsiveness */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:relative md:translate-x-0 transition-all duration-300 ease-in-out
      `}>
        <Sidebar isOpen={isSidebarOpen} />
      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-100">
        <TopBar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
