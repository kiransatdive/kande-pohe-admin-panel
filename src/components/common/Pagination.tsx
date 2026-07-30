import React from 'react';

interface PaginationProps {
  totalPages?: number;
  currentPage?: number;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages = 10, currentPage = 1 }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-end p-4 border-t border-gray-100 bg-white">
      <div className="flex items-center -space-x-px rounded">
        <button className="px-3 py-1.5 text-sm text-gray-500 bg-white border border-gray-200 rounded-l hover:bg-gray-50 transition-colors">
          &laquo;
        </button>
        
        {pages.map(num => (
          <button 
            key={num} 
            className={`px-3 py-1.5 text-sm border transition-colors ${
              num === currentPage 
                ? 'bg-[#337ab7] text-white border-[#337ab7]' 
                : 'text-[#337ab7] bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            {num}
          </button>
        ))}

        <button className="px-3 py-1.5 text-sm text-gray-500 bg-white border border-gray-200 rounded-r hover:bg-gray-50 transition-colors">
          &raquo;
        </button>
      </div>
    </div>
  );
};

export default Pagination;
