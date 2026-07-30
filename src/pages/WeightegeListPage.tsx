import React, { useState } from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';

const WeightegeListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const items = [
    { id: 1, name: 'Mandatory', percent: 15 },
    { id: 2, name: 'Basic Detail', percent: 15 },
    { id: 3, name: 'Education & Occupation', percent: 15 },
    { id: 4, name: 'Family Detail', percent: 10 },
    { id: 5, name: 'Lifestyle', percent: 5 },
    { id: 6, name: 'About YourSelf', percent: 5 },
    { id: 7, name: 'My Photos', percent: 15 },
    { id: 8, name: 'Phone Verification', percent: 5 },
    { id: 9, name: 'Email Verification', percent: 5 },
    { id: 10, name: 'User Approved', percent: 5 },
    { id: 11, name: 'Facebook User', percent: 5 },
    { id: 12, name: 'Subscription Selected', percent: 0 },
  ];

  return (
    <div className="flex flex-col text-sm w-full relative">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-[15px] font-medium text-gray-800">User Weightege List</h2>
            <div className="text-xs text-gray-500">
              Showing 1-12 of <span className="font-semibold text-gray-800">12</span> items.
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#00b562] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#009650] transition-colors whitespace-nowrap"
            >
              Create Wightege
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left text-xs border border-gray-100">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-12">#</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af]">Step Name</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af]">Wightege In Percent</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] text-right w-24"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                  <td className="px-4 py-3 text-gray-500">{item.id}</td>
                  <td className="px-4 py-3 text-gray-700">{item.name}</td>
                  <td className="px-4 py-3 text-gray-700">{item.percent}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5 text-gray-400">
                      <button className="text-[#3b82f6] rounded p-1 hover:bg-blue-50 transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 rounded p-1 hover:bg-gray-100 transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 rounded p-1 hover:bg-gray-100 transition-colors" title="Delete">
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

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-[15px] font-medium text-gray-800">Create Wightege</h2>
            </div>
            <div className="p-6">
              <form>
                <div className="mb-6">
                  <label htmlFor="stepName" className="block text-sm font-bold text-slate-700 mb-2">
                    Step Name
                  </label>
                  <input
                    type="text"
                    id="stepName"
                    className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div className="mb-8">
                  <label htmlFor="wightegePercent" className="block text-sm font-bold text-slate-700 mb-2">
                    Wightege In Percent
                  </label>
                  <input
                    type="text"
                    id="wightegePercent"
                    className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-[#00b562] text-white px-6 py-2.5 rounded font-medium hover:bg-[#009650] transition-colors"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeightegeListPage;
