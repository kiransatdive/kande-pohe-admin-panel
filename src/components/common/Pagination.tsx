import React from 'react';

interface PaginationProps {
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  infoText?: React.ReactNode;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages = 10, currentPage = 1, onPageChange, infoText }) => {
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
    <div className="flex justify-between items-center p-4 border-t border-gray-100 bg-white w-full">
      <div className="text-xs text-gray-500">
        {infoText}
      </div>
      <div className="flex items-center -space-x-px shadow-sm rounded-md overflow-hidden">
        <button 
          type="button"
          onClick={() => onPageChange && onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 focus:outline-none focus:z-10 focus:ring-1 focus:ring-[#337ab7] focus:border-[#337ab7] m-0 rounded-none"
        >
          &laquo;
        </button>
        
        {visiblePages.map(num => (
          <button 
            key={num} 
            type="button"
            onClick={() => onPageChange && onPageChange(num)}
            className={`px-3 py-1.5 text-sm font-medium border transition-colors focus:outline-none focus:z-10 focus:ring-1 focus:ring-[#337ab7] focus:border-[#337ab7] m-0 rounded-none ${
              num === currentPage 
                ? 'z-10 bg-[#337ab7] text-white border-[#337ab7]' 
                : 'text-[#337ab7] bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            {num}
          </button>
        ))}

        <button 
          type="button"
          onClick={() => onPageChange && onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 focus:outline-none focus:z-10 focus:ring-1 focus:ring-[#337ab7] focus:border-[#337ab7] m-0 rounded-none"
        >
          &raquo;
        </button>
      </div>
    </div>
  );
};

export default Pagination;
