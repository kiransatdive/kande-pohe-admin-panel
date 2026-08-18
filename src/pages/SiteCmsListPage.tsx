import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, Loader2, X } from 'lucide-react';
import apiClient from '../services/apiClient';
import Pagination from '../components/common/Pagination';
import { CKEditor } from 'ckeditor4-react';

const SiteCmsListPage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const limit = 10;

  useEffect(() => {
    fetchCmsPages();
  }, [currentPage]);

  const fetchCmsPages = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await apiClient.get(`v1/admin/site-cms`, {
        params: { page: currentPage, limit },
        headers: { 'bypass-tunnel-reminder': 'true' }
      });

      if (response.data.success) {
        setItems(response.data.data);
        setTotalItems(response.data.meta.total);
        setTotalPages(response.data.meta.totalPages);
      } else {
        setError(response.data.message || 'Failed to fetch CMS pages');
      }
    } catch (err: any) {
      console.error('Error fetching CMS pages:', err);
      setError(err.response?.data?.message || 'An error occurred while fetching CMS pages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!editItem) return;
    setIsSaving(true);
    try {
      const response = await apiClient.put(`v1/admin/site-cms/${editItem.id}`, {
        title: editItem.title,
        description: editItem.description,
      });
      if (response.data.success) {
        setIsEditModalOpen(false);
        fetchCmsPages();
      } else {
        alert(response.data.message || 'Failed to update CMS page');
      }
    } catch (err: any) {
      console.error('Error updating CMS page:', err);
      alert(err.response?.data?.message || 'An error occurred while updating');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this CMS page?')) return;
    try {
      const response = await apiClient.delete(`v1/admin/site-cms/${id}`);
      if (response.data.success) {
        fetchCmsPages();
      } else {
        alert(response.data.message || 'Failed to delete CMS page');
      }
    } catch (err: any) {
      console.error('Error deleting CMS page:', err);
      alert(err.response?.data?.message || 'An error occurred while deleting');
    }
  };

  // Strip HTML tags for description preview
  const stripHtml = (html: string) => {
    if (!html) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || "";
    return text.substring(0, 80) + (text.length > 80 ? "..." : "");
  };

  return (
    <div className="flex flex-col text-sm w-full relative">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-[15px] font-medium text-gray-800">Site CMS</h2>
            <div className="text-xs text-gray-500">
              Showing {(currentPage - 1) * limit + 1}-{Math.min(currentPage * limit, totalItems)} of <span className="font-semibold text-gray-800">{totalItems}</span> items.
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
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-80">Title</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af]">Description</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] text-right w-28"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                      Loading CMS pages...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-red-500 bg-red-50/50 font-medium">
                    {error}
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No CMS pages found.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3 text-gray-500 align-top">{item.id}</td>
                    <td className="px-4 py-3 text-gray-700 align-top font-medium">{item.title}</td>
                    <td className="px-4 py-3 text-[#3b82f6] align-top font-medium">
                      <div className="truncate" title={stripHtml(item.description)}>
                        {stripHtml(item.description)}
                      </div>
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
                            setEditItem({ ...item });
                            setIsEditModalOpen(true);
                          }}
                          className="text-[#3b82f6] rounded p-1 hover:bg-blue-50 transition-colors" 
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
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
        {!isLoading && items.length > 0 && totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
             <Pagination 
               currentPage={currentPage}
               totalPages={totalPages}
               onPageChange={setCurrentPage}
               infoText={`Showing ${(currentPage - 1) * limit + 1} to ${Math.min(currentPage * limit, totalItems)} of ${totalItems} entries`}
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
              <h2 className="text-xl font-medium text-gray-800">{selectedItem.title}</h2>
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
                        Title
                      </th>
                      <td className="p-4 text-gray-700">
                        {selectedItem.title}
                      </td>
                    </tr>
                    <tr>
                      <th className="w-48 bg-gray-50/50 p-4 font-bold text-gray-800 border-r border-gray-200 align-top">
                        Description
                      </th>
                      <td 
                        className="p-4 text-gray-700 prose prose-sm md:prose-base max-w-none"
                        dangerouslySetInnerHTML={{ __html: selectedItem.description }}
                      >
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
              <h2 className="text-xl font-medium text-gray-800">Edit Site CMS</h2>
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
                <h3 className="text-base font-semibold text-gray-800 mb-6 border-b border-gray-100 pb-3">CMS Information</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Title</label>
                    <input 
                      type="text" 
                      value={editItem.title}
                      onChange={(e) => setEditItem({...editItem, title: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all bg-white"
                      placeholder="Enter title"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <CKEditor
                        initData={editItem.description}
                        editorUrl="https://cdn.ckeditor.com/4.22.1/full/ckeditor.js"
                        onChange={(evt: any) => setEditItem({...editItem, description: evt.editor.getData()})}
                      />
                    </div>
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

export default SiteCmsListPage;
