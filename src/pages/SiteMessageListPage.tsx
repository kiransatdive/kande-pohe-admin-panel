import React, { useState } from 'react';
import { Eye, Edit, Trash2, Search } from 'lucide-react';

const SiteMessageListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const items = [
    { id: 1, action: 'ACCEPT_INTEREST', type: 'TITLE', value: 'Accept Interest', subject: 'For Accept Interest Title' },
    { id: 2, action: 'ACCEPT_INTEREST', type: 'SUCESS', value: 'Interest request accepted successfully.', subject: 'Interest Request Accept For Success' },
    { id: 3, action: 'ACCEPT_INTEREST', type: 'SUCESS', value: 'This user may have cancelled your interest request.', subject: 'Warning' },
    { id: 4, action: 'ACCEPT_INTEREST', type: 'SUCESS', value: 'This user may have cancelled your interest request.', subject: 'Warning' },
    { id: 5, action: 'ACCEPT_INTEREST', type: 'SUCESS', value: 'Already Interest Request Accepted.', subject: 'Warning' },
    { id: 6, action: 'BLOCK_USER', type: 'TITLE', value: 'Block User', subject: 'For Block User Title' },
    { id: 7, action: 'BLOCK_USER', type: 'SUCESS', value: '#NAME# Blocked Successfully.', subject: 'Success - Block User.' },
    { id: 8, action: 'BLOCK_USER', type: 'ERROR', value: "You can't block user now. Please try again.", subject: 'Error - Block user Error.' },
    { id: 9, action: 'BLOCK_USER', type: 'SUCESS', value: '#NAME# already blocked.', subject: 'Warning' },
    { id: 10, action: 'CANCEL_INTEREST', type: 'TITLE', value: "Interest Request may be Accepted. So you can't cancel it.", subject: 'Warning' },
    { id: 11, action: 'CANCEL_INTEREST', type: 'TITLE', value: "Interest Request may be Rejected. So you can't cancel it.", subject: 'Warning' },
    { id: 12, action: 'CANCEL_INTEREST', type: 'SUCESS', value: 'Interest request already cancelled.', subject: 'Warning' },
    { id: 13, action: 'CANCEL_INTEREST', type: 'SUCESS', value: 'This user may be accept or reject or block Interest request.', subject: 'Warning' },
  ];

  const getBadgeClass = (type: string) => {
    switch (type) {
      case 'TITLE':
        return 'bg-[#007bff] text-white';
      case 'SUCESS':
        return 'bg-[#00b562] text-white';
      case 'ERROR':
        return 'bg-[#d9534f] text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="flex flex-col text-sm w-full relative">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-[15px] font-medium text-gray-800">Site Messages List</h2>
            <div className="text-xs text-gray-500">
              Showing 1-13 of <span className="font-semibold text-gray-800">126</span> items.
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
            {/* The screenshot doesn't explicitly show a Create button, but typically there is one or we just omit if not needed. Let's keep it consistent. */}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left text-xs border border-gray-100 table-fixed">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-12">#</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-48">Message Action</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-36">Message Type</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af]">Message Value</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-64">Subject</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] text-right w-28"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                  <td className="px-4 py-3 text-gray-500 align-top">{item.id}</td>
                  <td className="px-4 py-3 text-gray-700 align-top">{item.action}</td>
                  <td className="px-4 py-3 align-top">
                    <span className={`px-3 py-1 rounded text-[11px] font-semibold tracking-wider ${getBadgeClass(item.type)}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 align-top">{item.value}</td>
                  <td className="px-4 py-3 text-gray-600 align-top">{item.subject}</td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center justify-end gap-1.5 text-gray-400">
                      <button className="text-[#3b82f6] rounded p-1 hover:bg-blue-50 transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-[#3b82f6] rounded p-1 hover:bg-blue-50 transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-[#3b82f6] rounded p-1 hover:bg-blue-50 transition-colors" title="Delete">
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

export default SiteMessageListPage;
