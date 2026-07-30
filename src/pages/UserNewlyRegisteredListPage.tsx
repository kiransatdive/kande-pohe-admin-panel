import React from 'react';
import { Eye, Search } from 'lucide-react';
import Pagination from '../components/common/Pagination';

const UserNewlyRegisteredListPage: React.FC = () => {
  const users = [
    { id: 1, firstName: 'Kiran', lastName: 'BugB', email: 'maheshsuthardmr@gmail.com', mobile: '8767455876', lastLogin: '10-07-2026', registered: '10-07-2026', status: 'Actived' },
    { id: 2, firstName: 'Mahee', lastName: 'Sutar', email: '', mobile: '9876543234', lastLogin: '30-06-2026', registered: '30-06-2026', status: 'Actived' },
    { id: 3, firstName: 'Srinivas', lastName: 'Patki', email: 'hasabnisrd@gmail.com', mobile: '9423395178', lastLogin: '07-06-2026', registered: '07-06-2026', status: 'Actived' },
    { id: 4, firstName: 'Siddhesh', lastName: 'Palav', email: 'sid.palav1213@gmail.com', mobile: '8433972372', lastLogin: '07-05-2026', registered: '07-05-2026', status: 'Actived' },
    { id: 5, firstName: 'Karuna', lastName: 'Ghode', email: '', mobile: '9765737424', lastLogin: '22-03-2026', registered: '22-03-2026', status: 'Actived' },
    { id: 6, firstName: 'Deepak', lastName: 'Bodakhe', email: '', mobile: '9975291051', lastLogin: '16-03-2026', registered: '16-03-2026', status: 'Actived' },
    { id: 7, firstName: 'Arnav', lastName: 'Karhad', email: 'bdkarhad.ca@rediffmail.com', mobile: '9371063482', lastLogin: '15-03-2026', registered: '15-03-2026', status: 'Actived' },
    { id: 8, firstName: 'Arvind', lastName: 'Tathe', email: 'tatheavinash2025@gmail.com', mobile: '9762189970', lastLogin: '27-02-2026', registered: '27-02-2026', status: 'Actived' },
    { id: 9, firstName: 'Krishna', lastName: 'Chavan', email: '', mobile: '7900004133', lastLogin: '29-01-2026', registered: '29-01-2026', status: 'Actived' },
    { id: 10, firstName: 'Rajesh', lastName: 'Sapkal', email: 'rajesh63in@yahoo.com', mobile: '7304263097', lastLogin: '30-12-2025', registered: '29-12-2025', status: 'Actived' },
    { id: 11, firstName: 'Anjali', lastName: 'Patil', email: 'anjali79p@gmail.com', mobile: '7415624970', lastLogin: '21-12-2025', registered: '30-05-2025', status: 'Actived' },
    { id: 12, firstName: 'Omkar', lastName: 'Chavan', email: 'Ranjanachavan1966@gmail.com', mobile: '7021809985', lastLogin: '24-11-2025', registered: '24-11-2025', status: 'Actived' },
    { id: 13, firstName: 'Jagadande', lastName: 'Mounika', email: 'mjagadande@gmail.com', mobile: '7993541441', lastLogin: '22-11-2025', registered: '22-11-2025', status: 'Actived' },
  ];

  return (
    <div className="flex flex-col text-sm w-full">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-[15px] font-medium text-gray-800">User Newly Registered List</h2>
            <div className="text-xs text-gray-500">
              Showing 1-20 of <span className="font-semibold text-gray-800">89</span> items.
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
                <th className="px-4 py-3 font-semibold text-gray-500">Mobile</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Last Login Date</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Date of registration</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Status</th>
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
                  <td className="px-4 py-3 text-gray-600">{user.mobile}</td>
                  <td className="px-4 py-3 text-gray-600">{user.lastLogin}</td>
                  <td className="px-4 py-3 text-gray-600">{user.registered}</td>
                  <td className="px-4 py-3">
                    <span className="bg-[#00b562] text-white text-[11px] font-medium px-3 py-1.5 rounded">
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

export default UserNewlyRegisteredListPage;
