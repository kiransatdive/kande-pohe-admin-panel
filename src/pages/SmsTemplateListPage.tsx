import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, Loader2, X, Search } from 'lucide-react';
import apiClient from '../services/apiClient';
import Pagination from '../components/common/Pagination';

const SmsTemplateListPage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const limit = 10;

  const fetchSmsFormats = async (page: number = currentPage, currentSearch: string = searchQuery) => {
    setIsLoading(true);
    setError('');
    const isSearching = currentSearch.trim().length > 0;
    try {
      const response = await apiClient.get(`v1/admin/sms-formats`, {
        params: { 
          page: isSearching ? 1 : page, 
          limit: isSearching ? 10000 : limit,
          search: currentSearch 
        },
        headers: { 'bypass-tunnel-reminder': 'true' }
      });

      if (response.data.success) {
        setItems(response.data.data);
        if (!isSearching && response.data.total !== undefined) {
          setTotalItems(response.data.total);
          setTotalPages(Math.ceil(response.data.total / limit));
        } else if (!isSearching && response.data.meta) {
          setTotalItems(response.data.meta.total);
          setTotalPages(response.data.meta.totalPages);
        } else {
          setTotalItems(response.data.data.length);
          setTotalPages(1);
        }
      } else {
        setError(response.data.message || 'Failed to fetch sms formats');
      }
    } catch (err: any) {
      console.error('Error fetching sms formats:', err);
      setError(err.response?.data?.message || 'An error occurred while fetching sms formats');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSmsFormats(searchQuery ? 1 : currentPage, searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchQuery ? 1 : currentPage]);

  const stripHtml = (html: string) => {
    if (!html) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || "";
    return text.substring(0, 80) + (text.length > 80 ? "..." : "");
  };

  const handleEditSubmit = async () => {
    if (!editItem) return;
    setIsSaving(true);
    try {
      const response = await apiClient.put(`v1/admin/sms-formats/${editItem.iSmsFormatId}`, {
        vSmsFormatType: editItem.vSmsFormatType,
        vSmsInformation: editItem.vSmsInformation,
        vSmsMessage: editItem.vSmsMessage,
        vComment: editItem.vComment,
        vTemplateId: editItem.vTemplateId,
      });
      if (response.data.success) {
        setIsEditModalOpen(false);
        fetchSmsFormats(currentPage, searchQuery);
      } else {
        alert(response.data.message || 'Failed to update sms format');
      }
    } catch (err: any) {
      console.error('Error updating sms format:', err);
      alert(err.response?.data?.message || 'An error occurred while updating');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this sms format?')) return;
    try {
      const response = await apiClient.delete(`v1/admin/sms-formats/${id}`);
      if (response.data.success) {
        fetchSmsFormats(currentPage, searchQuery);
      } else {
        alert(response.data.message || 'Failed to delete sms format');
      }
    } catch (err: any) {
      console.error('Error deleting sms format:', err);
      alert(err.response?.data?.message || 'An error occurred while deleting');
    }
  };

  const filteredItems = items.filter(item => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (item.vSmsFormatType || '').toLowerCase().includes(query) ||
      (item.vSmsInformation || '').toLowerCase().includes(query) ||
      (item.vSmsMessage || '').toLowerCase().includes(query) ||
      (item.vComment || '').toLowerCase().includes(query) ||
      (item.vTemplateId || '').toLowerCase().includes(query) ||
      (item.iSmsFormatId?.toString() || '').includes(query)
    );
  });

  const handlePageChange = (page: number) => {
    if (searchQuery) {
      const maxPage = Math.ceil(filteredItems.length / limit) || 1;
      if (page >= 1 && page <= maxPage) {
        setCurrentPage(page);
      }
    } else {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex flex-col text-sm w-full relative">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-[15px] font-medium text-gray-800">Sms Format List</h2>
            <div className="text-xs text-gray-500">
              Showing {(currentPage - 1) * limit + 1}-{Math.min(currentPage * limit, searchQuery ? filteredItems.length : totalItems || 0)} of <span className="font-semibold text-gray-800">{searchQuery ? filteredItems.length : totalItems || 0}</span> items.
            </div>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search templates..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentPage !== 1) setCurrentPage(1);
                }}
                className="w-full sm:w-64 bg-slate-50 border border-gray-200 text-gray-700 text-sm rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
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
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-48">Sms Format Type</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-48">Sms Information</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af]">Sms Message</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-48">Comment</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] text-right w-28"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                      Loading sms formats...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-red-500 bg-red-50/50 font-medium">
                    {error}
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No sms formats found matching your search.
                  </td>
                </tr>
              ) : (
                (searchQuery ? filteredItems.slice((currentPage - 1) * limit, currentPage * limit) : filteredItems).map((item) => (
                  <tr key={item.iSmsFormatId} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3 text-gray-500 align-top">{item.iSmsFormatId}</td>
                    <td className="px-4 py-3 text-gray-700 align-top break-all">{item.vSmsFormatType}</td>
                    <td className="px-4 py-3 text-[#3b82f6] align-top">{item.vSmsInformation}</td>
                    <td className="px-4 py-3 text-gray-600 align-top leading-relaxed whitespace-pre-wrap">{item.vSmsMessage}</td>
                    <td className="px-4 py-3 text-gray-600 align-top leading-relaxed whitespace-pre-wrap">{item.vComment}</td>
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
                            setEditItem({ ...item });
                            setIsEditModalOpen(true);
                          }}
                          className="text-[#3b82f6] rounded p-1 hover:bg-blue-50 transition-colors" 
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.iSmsFormatId)}
                          className="text-[#ef4444] rounded p-1 hover:bg-red-50 transition-colors" 
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
        {!isLoading && (searchQuery ? filteredItems.length > 0 : items.length > 0) && (searchQuery ? Math.ceil(filteredItems.length / limit) : totalPages) > 1 && (
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
              <h2 className="text-xl font-medium text-gray-800">Sms Format Details</h2>
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
                      <th className="w-48 bg-gray-50/50 p-4 font-bold text-gray-800 border-r border-gray-200 align-top">
                        Template ID
                      </th>
                      <td className="p-4 text-gray-700">
                        {selectedItem.vTemplateId}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="w-48 bg-gray-50/50 p-4 font-bold text-gray-800 border-r border-gray-200 align-top">
                        Sms Format Type
                      </th>
                      <td className="p-4 text-gray-700 break-all">
                        {selectedItem.vSmsFormatType}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="w-48 bg-gray-50/50 p-4 font-bold text-gray-800 border-r border-gray-200 align-top">
                        Sms Information
                      </th>
                      <td className="p-4 text-gray-700">
                        {selectedItem.vSmsInformation}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="w-48 bg-gray-50/50 p-4 font-bold text-gray-800 border-r border-gray-200 align-top">
                        Sms Message
                      </th>
                      <td className="p-4 text-gray-700 whitespace-pre-wrap">
                        {selectedItem.vSmsMessage}
                      </td>
                    </tr>
                    <tr>
                      <th className="w-48 bg-gray-50/50 p-4 font-bold text-gray-800 border-r border-gray-200 align-top">
                        Comment
                      </th>
                      <td className="p-4 text-gray-700 whitespace-pre-wrap">
                        {selectedItem.vComment}
                      </td>
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

      {/* Edit Modal */}
      {isEditModalOpen && editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh]">
            <div className="relative p-5 border-b border-gray-200 bg-white rounded-t-xl shrink-0">
              <h2 className="text-xl font-medium text-gray-800">Edit Sms Format</h2>
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
                <h3 className="text-base font-semibold text-gray-800 mb-6 border-b border-gray-100 pb-3">Format Information</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Template ID</label>
                    <input 
                      type="text" 
                      value={editItem.vTemplateId || ''}
                      onChange={(e) => setEditItem({...editItem, vTemplateId: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all bg-white"
                      placeholder="Enter template ID"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Format Type</label>
                    <input 
                      type="text" 
                      value={editItem.vSmsFormatType || ''}
                      onChange={(e) => setEditItem({...editItem, vSmsFormatType: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all bg-white"
                      placeholder="Enter format type"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Sms Information</label>
                    <input 
                      type="text" 
                      value={editItem.vSmsInformation || ''}
                      onChange={(e) => setEditItem({...editItem, vSmsInformation: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all bg-white"
                      placeholder="Enter sms information"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Sms Message</label>
                    <textarea 
                      value={editItem.vSmsMessage || ''}
                      onChange={(e) => setEditItem({...editItem, vSmsMessage: e.target.value})}
                      rows={6}
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all bg-white whitespace-pre-wrap"
                      placeholder="Enter sms message"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Comment</label>
                    <textarea 
                      value={editItem.vComment || ''}
                      onChange={(e) => setEditItem({...editItem, vComment: e.target.value})}
                      rows={4}
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all bg-white whitespace-pre-wrap"
                      placeholder="Enter comment"
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
    </div>
  );
};

export default SmsTemplateListPage;
