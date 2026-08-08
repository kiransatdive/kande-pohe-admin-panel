import React, { useState } from 'react';
import { Eye, Edit, Trash2, Search } from 'lucide-react';

const CityListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const items = [
    { id: 1, title: 'Ahmednagar', desc: 'We have hundreds of 96Kuli...', metaTitle: 'Ahmednagar 96Kuli Marathi...', metaDesc: 'We have hundreds of 96 Kuli...', metaKeyword: 'Ahmednagar 96K Matrimony...' },
    { id: 2, title: 'Akluj', desc: 'We have hundreds of matrimo...', metaTitle: 'Akluj Matrimony - Kande...', metaDesc: 'Find best 96Kuli Maratha...', metaKeyword: 'Akluj 96Kuli Matrimony...' },
    { id: 3, title: 'Akola', desc: 'We have hundreds of matrimo...', metaTitle: 'Akola 96K Maratha Matrimony...', metaDesc: 'Find 96K Maratha bride and...', metaKeyword: 'Akola 96K Maratha Matrimony...' },
    { id: 4, title: 'Alibag', desc: 'We have hundreds of matrimo...', metaTitle: 'Alibag 96Kuli Maratha...', metaDesc: 'Find 96Kuli Maratha bride...', metaKeyword: 'Alibag 96Kuli Maratha...' },
    { id: 5, title: 'Amravati', desc: 'We have hundreds of matrimo...', metaTitle: 'Amravati 96Kuli Maratha...', metaDesc: 'Find 96Kuli Maratha bride...', metaKeyword: 'Amravati 96Kuli Maratha...' },
    { id: 6, title: 'Aurangabad', desc: 'We have hundreds of matrimo...', metaTitle: 'Aurangabad 96Kuli Maratha...', metaDesc: 'Find 96Kuli Maratha bride...', metaKeyword: 'Aurangabad 96Kuli Maratha...' },
    { id: 7, title: 'Baramati', desc: 'We have hundreds of matrimo...', metaTitle: 'Baramati Marathi Matrimony...', metaDesc: 'Find best bride and groom...', metaKeyword: 'Baramati Matrimony, Baramat...' },
    { id: 8, title: 'Barshi', desc: 'We have hundreds of matrimo...', metaTitle: 'Barshi Marathi Matrimony...', metaDesc: 'Find best bride and groom...', metaKeyword: 'Barshi Matrimony, Barshi...' },
    { id: 9, title: 'Beed', desc: 'We have hundreds of matrimo...', metaTitle: 'Beed Marathi Matrimony...', metaDesc: 'Find best bride and groom...', metaKeyword: 'Beed Matrimony, Beed Brides...' },
    { id: 10, title: 'Bhandara', desc: 'We have hundreds of matrimo...', metaTitle: 'Bhandara Marathi Matrimony...', metaDesc: 'Find best bride and groom...', metaKeyword: 'Bhandara Matrimony, Bhandar...' },
    { id: 11, title: 'Buldhana', desc: 'We have hundreds of matrimo...', metaTitle: 'Buldhana Marathi Matrimony...', metaDesc: 'Find best bride and groom...', metaKeyword: 'Buldhana Matrimony, Buldhan...' },
    { id: 12, title: 'Chandrapur', desc: 'We have hundreds of matrimo...', metaTitle: 'Chandrapur Marathi Matrimon...', metaDesc: 'Find best bride and groom...', metaKeyword: 'Chandrapur Matrimony, Chand...' },
    { id: 13, title: 'Dhule', desc: 'We have hundreds of matrimo...', metaTitle: 'Dhule Marathi Matrimony...', metaDesc: 'Find best bride and groom...', metaKeyword: 'Dhule Matrimony, Dhule...' },
    { id: 14, title: 'Gondia', desc: 'We have hundreds of matrimo...', metaTitle: 'Gondia Marathi Matrimony...', metaDesc: 'Find best bride and groom...', metaKeyword: 'Gondia Matrimony, Gondia...' },
    { id: 15, title: 'Hingoli', desc: 'We have hundreds of matrimo...', metaTitle: 'Hingoli Marathi Matrimony...', metaDesc: 'Find best bride and groom...', metaKeyword: 'Hingoli Matrimony, Hingoli...' },
    { id: 16, title: 'Jalgaon', desc: 'We have hundreds of matrimo...', metaTitle: 'Jalgaon Marathi Matrimony...', metaDesc: 'Find best bride and groom...', metaKeyword: 'Jalgaon Matrimony, Jalgaon...' },
    { id: 17, title: 'Jalna', desc: 'We have hundreds of matrimo...', metaTitle: 'Jalna Marathi Matrimony...', metaDesc: 'Find best bride and groom...', metaKeyword: 'Jalna Matrimony, Jalna...' },
    { id: 18, title: 'Karad', desc: 'We have hundreds of matrimo...', metaTitle: 'Karad Marathi Matrimony...', metaDesc: 'Find best bride and groom...', metaKeyword: 'Karad Matrimony, Karad...' },
  ];

  return (
    <div className="flex flex-col text-sm w-full relative">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-[15px] font-medium text-gray-800">City List</h2>
            <div className="text-xs text-gray-500">
              Showing 1-18 of <span className="font-semibold text-gray-800">38</span> items.
            </div>
          </div>
          <div className="flex items-center gap-4">
            </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left text-xs border border-gray-100 table-fixed">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-12">#</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-40">Title</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af]">Description</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-56">Meta Title</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-56">Meta Description</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-56">Meta Keyword</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] text-right w-28"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                  <td className="px-4 py-3 text-gray-500 align-top">{item.id}</td>
                  <td className="px-4 py-3 text-gray-700 align-top font-medium">{item.title}</td>
                  <td className="px-4 py-3 text-[#3b82f6] align-top">{item.desc}</td>
                  <td className="px-4 py-3 text-gray-600 align-top">{item.metaTitle}</td>
                  <td className="px-4 py-3 text-gray-600 align-top">{item.metaDesc}</td>
                  <td className="px-4 py-3 text-gray-600 align-top">{item.metaKeyword}</td>
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

export default CityListPage;
