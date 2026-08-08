import React, { useState } from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';

const InterestsListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const items = [
    { id: 1, name: 'Bikes' },
    { id: 2, name: 'Cars' },
    { id: 3, name: 'Alternative healing' },
    { id: 4, name: 'Clubbing' },
    { id: 5, name: 'Learning new languages' },
  ];

  return (
    <div className="flex flex-col text-sm w-full relative">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-[15px] font-medium text-gray-800">Interests List</h2>
            <div className="text-xs text-gray-500">
              Showing 1-5 of <span className="font-semibold text-gray-800">5</span> items.
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-base font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all whitespace-nowrap"
            >
              Create Interests
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left text-xs border border-gray-100">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-12">#</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af]">Interests</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] text-right w-24"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                  <td className="px-4 py-3 text-gray-500">{item.id}</td>
                  <td className="px-4 py-3 text-gray-700">{item.name}</td>
                  <td className="px-4 py-3">
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

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-[15px] font-medium text-gray-800">Create Interests</h2>
            </div>
            <div className="p-6">
              <form>
                <div className="mb-8">
                  <label htmlFor="interestName" className="block text-sm font-bold text-slate-700 mb-2">
                    Interests Name
                  </label>
                  <input
                    type="text"
                    id="interestName"
                    className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded font-medium hover:bg-blue-700 transition-colors"
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

export default InterestsListPage;
