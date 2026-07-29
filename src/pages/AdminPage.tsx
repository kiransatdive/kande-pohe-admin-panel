import React, { useState } from 'react';
import { Eye, Edit, Trash2, ChevronRight, Search } from 'lucide-react';

const AdminPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const admins = [
    { id: 1, firstName: 'Super', lastName: 'Admin', email: 'super@admin.com', status: 'Active' },
    { id: 2, firstName: 'Developer', lastName: 'Admin', email: 'developer@admin.com', status: 'Active' },
    { id: 3, firstName: 'POONAM', lastName: 'SHELAR', email: 'poonamshelar4@gmail.com', status: 'Active' },
  ];

  return (
    <div className="flex flex-col text-sm">

      {/* Admin Table Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h2 className="text-[15px] font-medium text-gray-800">Admin Table List</h2>
          <div className="flex items-center gap-4">
            {/* Unified Search Box */}
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Type to search..." 
                className="w-64 bg-slate-50 border border-gray-200 text-gray-600 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
              />
            </div>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Create Admin
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-3 font-medium text-gray-500 w-12">#</th>
                <th className="px-6 py-3 font-medium text-gray-500">First Name</th>
                <th className="px-6 py-3 font-medium text-gray-500">Last Name</th>
                <th className="px-6 py-3 font-medium text-gray-500">Email</th>
                <th className="px-6 py-3 font-medium text-gray-500 w-32">Status</th>
                <th className="px-6 py-3 font-medium text-gray-500 text-right w-24"></th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 text-gray-600">{admin.id}</td>
                  <td className="px-6 py-4 text-gray-700">{admin.firstName}</td>
                  <td className="px-6 py-4 text-gray-700">{admin.lastName}</td>
                  <td className="px-6 py-4 text-gray-700">{admin.email}</td>
                  <td className="px-6 py-4">
                    <span className="bg-[#00b562] text-white text-[11px] font-medium px-2.5 py-1 rounded">
                      {admin.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 text-gray-400">
                      <button className="hover:text-blue-500 transition-colors" title="View"><Eye className="w-4 h-4" /></button>
                      <button className="hover:text-emerald-500 transition-colors" title="Edit"><Edit className="w-4 h-4" /></button>
                      <button className="hover:text-red-500 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Admin Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl border-t-[3px] border-blue-400 overflow-hidden">
            <div className="flex justify-end p-2">
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
              
              </button>
            </div>
            
            <div className="px-6 pb-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">First Name</label>
                  <input type="text" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Last Name</label>
                  <input type="text" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Email</label>
                  <input type="email" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Password</label>
                  <input type="password" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Status</label>
                  <select className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-400">
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
                
                <div className="pt-3 flex gap-3">
                  <button onClick={() => setIsCreateModalOpen(false)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded text-sm font-medium transition-colors">
                    Create
                  </button>
                  <button onClick={() => setIsCreateModalOpen(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded text-sm font-medium transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
