import React, { useState } from 'react';
import { Eye, Edit, Trash2, Search } from 'lucide-react';

const EducationListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const items = [
    { id: 1, title: 'Arts/Science/Commerce/Education', desc: 'We at Kande-Pohe Marathi...', metaTitle: 'Marathi brides and grooms...', metaDesc: 'We have hundreds of Marathi...', metaKeyword: 'Maratha Matrimony, Pune...' },
    { id: 2, title: 'Computer/IT engineering', desc: 'We at Kande-Pohe Marathi...', metaTitle: 'Marathi brides and grooms...', metaDesc: 'We have hundreds of Marathi...', metaKeyword: 'Maratha Matrimony, Pune...' },
    { id: 3, title: 'Engineering/ Technology', desc: 'We have hundreds of Marathi...', metaTitle: 'Marathi brides and grooms...', metaDesc: 'We have hundreds of Marathi...', metaKeyword: 'Maratha Matrimony, Pune...' },
    { id: 4, title: 'Fashion/ Fine Arts/ Home Science', desc: 'Many times having your life...', metaTitle: 'Marathi brides and grooms...', metaDesc: 'Profiles from same educatio...', metaKeyword: 'Maratha Matrimony, Pune...' },
    { id: 5, title: 'Finance/Accounting', desc: 'We at Kande-Pohe Marathi...', metaTitle: 'Marathi brides and grooms...', metaDesc: 'We have hundreds of Marathi...', metaKeyword: 'Maratha Matrimony, Pune...' },
    { id: 6, title: 'Law', desc: 'We at Kande-Pohe Marathi...', metaTitle: 'Marathi brides and grooms...', metaDesc: 'We at Kande-Pohe Marathi...', metaKeyword: 'Maratha Matrimony, Pune...' },
    { id: 7, title: 'Management', desc: 'We at Kande-Pohe Marathi...', metaTitle: 'Marathi brides and grooms...', metaDesc: 'We have hundreds of Marathi...', metaKeyword: 'Maratha Matrimony, Pune...' },
    { id: 8, title: 'Medicine/Pharmacy', desc: 'We at Kande-Pohe Marathi...', metaTitle: 'Marathi brides and grooms...', metaDesc: 'Register today and find...', metaKeyword: 'Maratha Matrimony, Pune...' },
  ];

  return (
    <div className="flex flex-col text-sm w-full relative">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-[15px] font-medium text-gray-800">Education List</h2>
            <div className="text-xs text-gray-500">
              Showing 1-8 of <span className="font-semibold text-gray-800">8</span> items.
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

export default EducationListPage;
