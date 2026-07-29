import React from 'react';
import { Eye, Edit, Image as ImageIcon, Check, Trash2, Search } from 'lucide-react';

const UserListPage: React.FC = () => {
  const users = [
    { id: 1, firstName: 'Virajmeet', lastName: 'Surve', email: '', mobile: '9967232376', lastLogin: '28-07-2026', registered: '28-07-2026', status: 'Actived' },
    { id: 2, firstName: 'Sandeep', lastName: 'Barabkar', email: '', mobile: '8411842593', lastLogin: '27-07-2026', registered: '27-07-2026', status: 'Actived' },
    { id: 3, firstName: 'Prasad', lastName: 'Deore', email: 'prase.deore@gmail.com', mobile: '8793930133', lastLogin: '26-07-2026', registered: '28-12-2024', status: 'Approved' },
    { id: 4, firstName: 'Swapnil', lastName: 'Nimda', email: 'frontend.admin@admin.com', mobile: '(not set)', lastLogin: '24-07-2026', registered: '01-01-1970', status: 'Approved' },
    { id: 5, firstName: 'kavita', lastName: 'Ghag', email: '', mobile: '9168319332', lastLogin: '24-07-2026', registered: '11-11-2025', status: 'Approved' },
    { id: 6, firstName: 'Mandar', lastName: 'Kulkarni', email: 'mandarkulkarni716@gmail.com', mobile: '9860455009', lastLogin: '23-07-2026', registered: '06-03-2026', status: 'Approved' },
    { id: 7, firstName: 'Jay', lastName: 'Mirase', email: '', mobile: '7770070745', lastLogin: '22-07-2026', registered: '01-07-2026', status: 'Approved' },
    { id: 8, firstName: 'soddy', lastName: 'richard', email: 'seyokew696@buloan.com', mobile: '9359371180', lastLogin: '22-07-2026', registered: '14-07-2026', status: 'Actived' },
  ];

  return (
    <div className="flex flex-col text-sm">
      {/* User List Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-[15px] font-medium text-gray-800">User List</h2>
            <div className="text-xs text-gray-500">
              Showing 1-20 of <span className="font-semibold text-gray-800">4,828</span> items.
            </div>
          </div>
          <div className="relative hidden sm:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Type to search..." 
              className="w-64 bg-slate-50 border border-gray-200 text-gray-600 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
            />
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
                <th className="px-4 py-3 font-semibold text-gray-500 w-28">Status</th>
                <th className="px-4 py-3 font-semibold text-gray-500 text-right w-24"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                  <td className="px-4 py-3 text-gray-500">{user.id}</td>
                  <td className="px-4 py-3 text-gray-700">{user.firstName}</td>
                  <td className="px-4 py-3 text-gray-700">{user.lastName}</td>
                  <td className="px-4 py-3 text-[#3b82f6] hover:underline cursor-pointer">{user.email}</td>
                  <td className="px-4 py-3 text-gray-600">{user.mobile}</td>
                  <td className="px-4 py-3 text-gray-600">{user.lastLogin}</td>
                  <td className="px-4 py-3 text-gray-600">{user.registered}</td>
                  <td className="px-4 py-3">
                    <span className="bg-[#00b562] text-white text-[10px] font-medium px-2.5 py-1 rounded">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5 text-gray-400">
                      <button className="rounded p-1 hover:bg-blue-50 transition-colors text-blue-500" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="rounded p-1 hover:bg-blue-50 transition-colors text-blue-400" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="rounded p-1 hover:bg-amber-50 transition-colors text-amber-500" title="Image">
                        <ImageIcon className="w-4 h-4" />
                      </button>
                      <button className="rounded p-1 hover:bg-emerald-50 transition-colors text-emerald-500" title="Approve">
                        <Check className="w-4 h-4" strokeWidth={3} />
                      </button>
                      <button className="rounded p-1 hover:bg-red-50 transition-colors text-orange-400" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserListPage;
