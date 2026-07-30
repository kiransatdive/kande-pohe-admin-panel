import React from 'react';
import { Eye, Search, User } from 'lucide-react';
import Pagination from '../components/common/Pagination';

const UserListPhotoAlbumPage: React.FC = () => {
  const users = [
    { id: 1, firstName: 'Virajmeet', lastName: 'Surve', email: '', lastLogin: '28-07-2026', registered: '28-07-2026', status: 'Pending' },
    { id: 2, firstName: 'soddy', lastName: 'richard', email: 'seyokew696@buloan.com', lastLogin: '22-07-2026', registered: '14-07-2026', status: 'Pending' },
    { id: 3, firstName: 'Anil', lastName: 'Thorat', email: '', lastLogin: '20-07-2026', registered: '20-07-2026', status: 'Pending' },
    { id: 4, firstName: 'Jeevan', lastName: 'Patil', email: 'dhairyashilpatil1989@rediffmail.com', lastLogin: '18-07-2026', registered: '18-07-2026', status: 'Pending' },
    { id: 5, firstName: 'Vijay', lastName: 'Narwade', email: 'vnarwade536@gmail.com', lastLogin: '18-07-2026', registered: '18-07-2026', status: 'Pending' },
    { id: 6, firstName: 'Bhaarat', lastName: 'Ship', email: 'bhaaratship@gmail.com', lastLogin: '18-07-2026', registered: '17-07-2026', status: 'Pending' },
  ];

  return (
    <div className="flex flex-col text-sm w-full">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-[15px] font-medium text-gray-800">User List(Profile Photo)</h2>
            <div className="text-xs text-gray-500">
              Showing 1-20 of <span className="font-semibold text-gray-800">104</span> items.
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Type to search..." 
                className="w-64 bg-slate-50 border border-gray-200 text-gray-600 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left text-xs border border-gray-100">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 font-semibold text-gray-500 w-12">#</th>
                <th className="px-4 py-3 font-semibold text-gray-500">First Name</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Last Name</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Email</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Profile Pic</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Last Login Date</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Date of registration</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Status Of Profile Pic</th>
                <th className="px-4 py-3 font-semibold text-gray-500 text-right w-12"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                  <td className="px-4 py-3 text-gray-500">{user.id}</td>
                  <td className="px-4 py-3 text-gray-700">{user.firstName}</td>
                  <td className="px-4 py-3 text-gray-700">{user.lastName}</td>
                  <td className="px-4 py-3 text-[#3b82f6] hover:underline cursor-pointer">{user.email}</td>
                  <td className="px-4 py-3">
                    <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center border-2 border-gray-200">
                      <User className="w-8 h-8 text-gray-300" />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.lastLogin}</td>
                  <td className="px-4 py-3 text-gray-600">{user.registered}</td>
                  <td className="px-4 py-3">
                    <span className="bg-[#f59e0b] text-white text-[11px] font-medium px-4 py-1.5 rounded">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end">
                      <button className="text-[#3b82f6] rounded p-1 hover:bg-blue-50 transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination />
      </div>
    </div>
  );
};

export default UserListPhotoAlbumPage;
