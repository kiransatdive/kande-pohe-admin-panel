import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, Loader2, Search, X } from 'lucide-react';
import apiClient from '../services/apiClient';
import Pagination from '../components/common/Pagination';

interface MetaItem {
  meta_tag_id: number;
  title: string;
  page: string;
  description: string;
  meta_title: string;
  meta_description: string;
  meta_keyword: string;
}

const OtherMetaManagementListPage: React.FC = () => {
  const [items, setItems] = useState<MetaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MetaItem | null>(null);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<MetaItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MetaItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const limit = 10;

  const truncateText = (text: string, length: number = 30) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  useEffect(() => {
    const fetchMetaTags = async () => {
      setIsLoading(true);
      const isSearching = searchQuery.trim().length > 0;
      try {
        const response = await apiClient.get('/v1/admin/meta', {
          params: { page: isSearching ? 1 : currentPage, limit: isSearching ? 100 : limit }
        });
        if (response.data.success) {
          setItems(response.data.data);
          if (!isSearching && response.data.meta) {
            setTotalItems(response.data.meta.total);
            setTotalPages(response.data.meta.totalPages);
          } else if (!isSearching) {
            setTotalItems(response.data.data?.length || 0);
            setTotalPages(1);
          }
        } else {
          setError(response.data.message || 'Failed to fetch meta tags');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    const delayDebounceFn = setTimeout(() => {
      fetchMetaTags();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchQuery, refreshCount]);

  const handleEditSubmit = async () => {
    if (!editItem) return;
    setIsSaving(true);
    try {
      const response = await apiClient.put(`/v1/admin/meta/${editItem.meta_tag_id}`, {
        title: editItem.title,
        page: editItem.page,
        description: editItem.description,
        meta_title: editItem.meta_title,
        meta_description: editItem.meta_description,
        meta_keyword: editItem.meta_keyword
      });
      if (response.data?.success || response.status === 200 || response.status === 204) {
        setIsEditModalOpen(false);
        setEditItem(null);
        setRefreshCount(prev => prev + 1);
      } else {
        alert(response.data?.message || 'Failed to update meta details');
      }
    } catch (err: any) {
      console.error('Error updating meta:', err);
      alert(err.response?.data?.message || err.message || 'An error occurred while updating');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const response = await apiClient.delete(`/v1/admin/meta/${itemToDelete.meta_tag_id}`);
      if (response.data?.success || response.status === 200 || response.status === 204) {
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
        setRefreshCount(prev => prev + 1);
      } else {
        alert(response.data?.message || 'Failed to delete meta tag');
      }
    } catch (err: any) {
      console.error('Error deleting meta:', err);
      alert(err.response?.data?.message || err.message || 'An error occurred while deleting');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredItems = items.filter(item => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (item.title || '').toLowerCase().includes(query) ||
      (item.description || '').toLowerCase().includes(query) ||
      (item.meta_title || '').toLowerCase().includes(query) ||
      (item.meta_description || '').toLowerCase().includes(query) ||
      (item.meta_keyword || '').toLowerCase().includes(query)
    );
  });

  const handlePageChange = (page: number) => {
    const maxPage = searchQuery ? Math.ceil(filteredItems.length / limit) || 1 : totalPages;
    if (page >= 1 && page <= maxPage) {
      setCurrentPage(page);
    }
  };

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col text-sm w-full relative">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-[15px] font-medium text-gray-800">Other Meta Management List</h2>
            <div className="text-xs text-gray-500">
              Showing {(currentPage - 1) * limit + 1}-{Math.min(currentPage * limit, searchQuery ? filteredItems.length : totalItems)} of <span className="font-semibold text-gray-800">{searchQuery ? filteredItems.length : totalItems}</span> items.
            </div>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Type to search..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentPage !== 1) setCurrentPage(1);
                }}
                className="w-full sm:w-64 bg-slate-50 border border-gray-200 text-gray-700 text-base rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left text-xs border border-gray-100 table-fixed">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-12">#</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-48">Title</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af]">Description</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-56">Meta Title</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-56">Meta Description</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-56">Meta Keyword</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] text-right w-28"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-500 mb-2" />
                      Loading meta tags...
                    </div>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No meta tags found.
                  </td>
                </tr>
              ) : (
                (searchQuery ? filteredItems.slice((currentPage - 1) * limit, currentPage * limit) : filteredItems).map((item, index) => (
                  <tr key={item.meta_tag_id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3 text-gray-500 align-top">{(currentPage - 1) * limit + index + 1}</td>
                    <td className="px-4 py-3 text-gray-700 align-top font-medium">{item.title}</td>
                    <td className="px-4 py-3 text-[#3b82f6] align-top" title={item.description}>
                      {truncateText(item.description, 40)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 align-top" title={item.meta_title}>
                      {truncateText(item.meta_title, 40)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 align-top" title={item.meta_description}>
                      {truncateText(item.meta_description, 40)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 align-top" title={item.meta_keyword}>
                      {truncateText(item.meta_keyword, 40)}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center justify-end gap-1.5 text-gray-400">
                        <button 
                          onClick={() => {
                            setSelectedItem(item);
                            setIsViewModalOpen(true);
                          }}
                          className="text-[#3b82f6] rounded p-1 hover:bg-blue-50 transition-colors" 
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setEditItem(item);
                            setIsEditModalOpen(true);
                          }}
                          className="text-[#3b82f6] rounded p-1 hover:bg-blue-50 transition-colors" 
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setItemToDelete(item);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-[#3b82f6] rounded p-1 hover:bg-blue-50 transition-colors" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {(!isLoading && (searchQuery ? filteredItems.length > 0 : items.length > 0)) && (
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
             <Pagination 
               currentPage={currentPage}
               totalPages={searchQuery ? Math.ceil(filteredItems.length / limit) || 1 : totalPages}
               onPageChange={handlePageChange}
               infoText={`Showing ${(currentPage - 1) * limit + 1} to ${Math.min(currentPage * limit, searchQuery ? filteredItems.length : totalItems)} of ${searchQuery ? filteredItems.length : totalItems} entries`}
             />
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {isViewModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="relative p-5 border-b border-gray-200 bg-white rounded-t-xl shrink-0 text-center">
              <h2 className="text-xl font-medium text-gray-800">{selectedItem.title} Meta Details</h2>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-white p-6">
              <div className="border border-gray-200 rounded-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <th className="w-48 bg-gray-50/50 p-4 font-bold text-gray-800 border-r border-gray-200 align-top">Title</th>
                      <td className="p-4 text-gray-700">{selectedItem.title}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="w-48 bg-gray-50/50 p-4 font-bold text-gray-800 border-r border-gray-200 align-top">Description</th>
                      <td className="p-4 text-gray-700 whitespace-pre-wrap">{selectedItem.description}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="w-48 bg-gray-50/50 p-4 font-bold text-gray-800 border-r border-gray-200 align-top">Meta Title</th>
                      <td className="p-4 text-gray-700 whitespace-pre-wrap">{selectedItem.meta_title}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="w-48 bg-gray-50/50 p-4 font-bold text-gray-800 border-r border-gray-200 align-top">Meta Description</th>
                      <td className="p-4 text-gray-700 whitespace-pre-wrap">{selectedItem.meta_description}</td>
                    </tr>
                    <tr>
                      <th className="w-48 bg-gray-50/50 p-4 font-bold text-gray-800 border-r border-gray-200 align-top">Meta Keyword</th>
                      <td className="p-4 text-gray-700 whitespace-pre-wrap">{selectedItem.meta_keyword}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl flex justify-end shrink-0">
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Details Modal */}
      {isEditModalOpen && editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            <div className="relative p-5 border-b border-gray-200 bg-white rounded-t-xl shrink-0 text-center">
              <h2 className="text-xl font-medium text-gray-800">Edit Meta Details</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                disabled={isSaving}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Title</label>
                      <input 
                        type="text" 
                        value={editItem.title || ''}
                        onChange={(e) => setEditItem({...editItem, title: e.target.value})}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white"
                        placeholder="Title"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                    <textarea 
                      value={editItem.description || ''}
                      onChange={(e) => setEditItem({...editItem, description: e.target.value})}
                      rows={3}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white"
                      placeholder="Description"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Meta Title</label>
                    <input 
                      type="text" 
                      value={editItem.meta_title || ''}
                      onChange={(e) => setEditItem({...editItem, meta_title: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white"
                      placeholder="Meta Title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Meta Description</label>
                    <textarea 
                      value={editItem.meta_description || ''}
                      onChange={(e) => setEditItem({...editItem, meta_description: e.target.value})}
                      rows={3}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white"
                      placeholder="Meta Description"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Meta Keyword</label>
                    <input 
                      type="text" 
                      value={editItem.meta_keyword || ''}
                      onChange={(e) => setEditItem({...editItem, meta_keyword: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white"
                      placeholder="Meta Keyword"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button 
                onClick={handleEditSubmit}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center min-w-[120px]"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-center text-gray-900 mb-2">Delete Meta Tag</h3>
              <p className="text-sm text-center text-gray-500">
                Are you sure you want to delete "{itemToDelete.title}"? This action cannot be undone.
              </p>
            </div>
            <div className="flex px-6 py-4 bg-gray-50 gap-3 justify-end">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OtherMetaManagementListPage;
