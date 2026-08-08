import React, { useState } from 'react';
import { Eye, Edit, Trash2, Search } from 'lucide-react';

const CasteListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const items = [
    { id: 1, title: '96K Maratha', desc: 'There are hundreds of...', metaTitle: '96K Maratha Matrimony for...', metaDesc: 'There are hundreds of 96K...', metaKeyword: '96K Maratha Matrimony, 96...' },
    { id: 2, title: 'Bari Samaj', desc: 'There are hundreds of...', metaTitle: 'Bari Samaj Matrimony for...', metaDesc: 'Search from thousands of...', metaKeyword: 'Bari Samaj Matrimony, Bari...' },
    { id: 3, title: 'Bhandari Matrimony', desc: 'There are many Bhandari...', metaTitle: 'Bhandari Matrimony', metaDesc: 'Find Bhandari brides and...', metaKeyword: 'Bhandari Matrimony, Bhandar...' },
    { id: 4, title: 'Bhavsar Matrimony', desc: 'There are hundreds of...', metaTitle: 'Bhavsar Matrimony', metaDesc: 'There are hundreds of...', metaKeyword: 'Bhavsar Matrimony, Bhavsar...' },
    { id: 5, title: 'Bhovi Matrimony', desc: 'There are several Bhovi...', metaTitle: 'Bhovi Matrimony', metaDesc: 'Find several Bhovi brides...', metaKeyword: 'Bhovi Matrimony, Bhovi...' },
    { id: 6, title: 'Billava Matrimony', desc: 'We have several Billava...', metaTitle: 'Billava Marathi Matrim...', metaDesc: 'We have several Billava...', metaKeyword: 'Billava Marathi Matrimony...' },
    { id: 7, title: 'Boya/Nayak/Naik', desc: 'Matrimony', metaTitle: 'Matrimony', metaDesc: 'Matrimony', metaKeyword: 'Matrimony' },
    { id: 8, title: 'Brahmin - Deshastha Matrimony', desc: 'There are hundreds of...', metaTitle: 'Brahmin_Deshastha Matrim...', metaDesc: 'Find hundreds of Brahmin-De...', metaKeyword: 'Brahmin Matrimony, Brahmin-...' },
    { id: 9, title: 'Brahmin - Goswami', desc: 'Matrimony', metaTitle: 'Matrimony', metaDesc: 'Matrimony', metaKeyword: 'Matrimony' },
    { id: 10, title: 'Brahmin - Gowd Saraswat', desc: 'Matrimony', metaTitle: 'Matrimony', metaDesc: 'Matrimony', metaKeyword: 'Matrimony' },
    { id: 11, title: 'Brahmin - Kokanastha', desc: 'Matrimony', metaTitle: 'Matrimony', metaDesc: 'Matrimony', metaKeyword: 'Matrimony' },
    { id: 12, title: 'Brahmin - Other', desc: 'Matrimony', metaTitle: 'Matrimony', metaDesc: 'Matrimony', metaKeyword: 'Matrimony' },
    { id: 13, title: 'Brahmin - Saraswat', desc: 'Matrimony', metaTitle: 'Matrimony', metaDesc: 'Matrimony', metaKeyword: 'Matrimony' },
    { id: 14, title: 'Chambhar', desc: 'Matrimony', metaTitle: 'Matrimony', metaDesc: 'Matrimony', metaKeyword: 'Matrimony' },
    { id: 15, title: 'Chaudary', desc: 'Matrimony', metaTitle: 'Matrimony', metaDesc: 'Matrimony', metaKeyword: 'Matrimony' },
    { id: 16, title: 'CKP', desc: 'Matrimony', metaTitle: 'Matrimony', metaDesc: 'Matrimony', metaKeyword: 'Matrimony' },
    { id: 17, title: 'Dhangar', desc: 'Matrimony', metaTitle: 'Matrimony', metaDesc: 'Matrimony', metaKeyword: 'Matrimony' },
    { id: 18, title: 'Dhiman', desc: 'Matrimony', metaTitle: 'Matrimony', metaDesc: 'Matrimony', metaKeyword: 'Matrimony' },
  ];

  return (
    <div className="flex flex-col text-sm w-full relative">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-[15px] font-medium text-gray-800">Caste List</h2>
            <div className="text-xs text-gray-500">
              Showing 1-18 of <span className="font-semibold text-gray-800">61</span> items.
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
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-56">Title</th>
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

export default CasteListPage;
