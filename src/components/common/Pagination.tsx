import React from 'react';

interface PaginationProps {
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages = 10, currentPage = 1, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Simple logic to show a window of pages if there are too many
  const getVisiblePages = () => {
    if (totalPages <= 5) return pages;
    if (currentPage <= 3) return pages.slice(0, 5);
    if (currentPage >= totalPages - 2) return pages.slice(totalPages - 5);
    return pages.slice(currentPage - 3, currentPage + 2);
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex justify-end p-4 border-t border-gray-100 bg-white">
      <div className="flex items-center -space-x-px rounded">
        <button 
          onClick={() => onPageChange && onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-sm text-gray-500 bg-white border border-gray-200 rounded-l hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          &laquo;
        </button>
        
        {visiblePages.map(num => (
          <button 
            key={num} 
            onClick={() => onPageChange && onPageChange(num)}
            className={`px-3 py-1.5 text-sm border transition-colors ${
              num === currentPage 
                ? 'bg-[#337ab7] text-white border-[#337ab7]' 
                : 'text-[#337ab7] bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            {num}
          </button>
        ))}

        <button 
          onClick={() => onPageChange && onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-sm text-gray-500 bg-white border border-gray-200 rounded-r hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          &raquo;
        </button>
      </div>
    </div>
  );
};

export default Pagination;
