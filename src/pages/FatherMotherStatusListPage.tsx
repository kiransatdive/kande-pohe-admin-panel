import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, Search, Loader2, AlertTriangle } from 'lucide-react';
import apiClient from '../services/apiClient';
import Pagination from '../components/common/Pagination';

interface FMStatus {
  iFMStatusID: number;
  vName: string;
  eStatus: string;
}

const FatherMotherStatusListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatusName, setNewStatusName] = useState('');
  const [newStatusValue, setNewStatusValue] = useState('Yes');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [statusToEdit, setStatusToEdit] = useState<FMStatus | null>(null);
  
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [statusToView, setStatusToView] = useState<FMStatus | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [statusToDelete, setStatusToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const [statuses, setStatuses] = useState<FMStatus[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

    const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalItems, setTotalItems] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchStatuses = async (page: number) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await apiClient.get(`v1/admin/master/master-fm-status?page=${page}&limit=${searchQuery ? 1000 : limit}`, {
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      });
      if (response.data.success) {
        setStatuses(response.data.data);
        setTotalItems(response.data.meta?.total || response.data.data.length);
        setTotalPages(response.data.meta?.totalPages || 1);
        setCurrentPage(response.data.meta?.page || page);
      } else {
        setError(response.data.message || 'Failed to fetch statuses');
      }
    } catch (err: any) {
      console.error('Error fetching statuses:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStatuses(searchQuery ? 1 : currentPage);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, searchQuery ? 1 : currentPage]);

  const filteredStatuses = statuses.filter((item) => {
    const term = searchQuery.toLowerCase();
    return (
      item.iFMStatusID.toString().includes(term) ||
      item.vName.toLowerCase().includes(term) ||
      item.eStatus.toLowerCase().includes(term)
    );
  });

  const openDeleteModal = (id: number) => {
    setStatusToDelete(id);
    setDeleteError('');
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (statusToDelete === null) return;
    
    setIsDeleting(true);
    setDeleteError('');
    try {
      const response = await apiClient.delete(`v1/admin/master/master-fm-status/${statusToDelete}`);
      if (response.data.success) {
        setIsDeleteModalOpen(false);
        setStatusToDelete(null);
        fetchStatuses(currentPage);
      } else {
        setDeleteError(response.data.message || 'Failed to delete status');
      }
    } catch (err: any) {
      console.error('Error deleting status:', err);
      setDeleteError(err.response?.data?.message || err.message || 'An error occurred while deleting');
    } finally {
      setIsDeleting(false);
    }
  };

  const openViewModal = (status: FMStatus) => {
    setStatusToView(status);
    setIsViewModalOpen(true);
  };

  const openEditModal = (status: FMStatus) => {
    setStatusToEdit(status);
    setNewStatusName(status.vName);
    setNewStatusValue(status.eStatus);
    setCreateError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatusName.trim()) {
      setCreateError('Status Name is required');
      return;
    }
    
    setIsCreating(true);
    setCreateError('');
    try {
      let response;
      if (statusToEdit) {
        response = await apiClient.put(`v1/admin/master/master-fm-status/${statusToEdit.iFMStatusID}`, {
          vName: newStatusName.trim(),
          eStatus: newStatusValue
        });
      } else {
        response = await apiClient.post('v1/admin/master/master-fm-status', {
          vName: newStatusName.trim(),
          eStatus: newStatusValue
        });
      }

      if (response.data.success) {
        setIsModalOpen(false);
        setNewStatusName('');
        setNewStatusValue('Yes');
        setStatusToEdit(null);
        fetchStatuses(currentPage); // Refresh list
      } else {
        setCreateError(response.data.message || `Failed to ${statusToEdit ? 'update' : 'create'} status`);
      }
    } catch (err: any) {
      console.error(`Error ${statusToEdit ? 'updating' : 'creating'} status:`, err);
      setCreateError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setIsCreating(false);
    }
  };
  

  return (
    <div className="flex flex-col text-sm w-full relative">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-[15px] font-medium text-gray-800">Father-Mother Statuses List</h2>
            <div className="text-xs text-gray-500">
              Showing page {currentPage} of {totalPages} <span className="font-semibold text-gray-800">({totalItems} items total)</span>.
            </div>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Type to search all pages..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 bg-slate-50 border border-gray-200 text-gray-700 text-base rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
              />
            </div>
            <button 
              onClick={() => {
                setCreateError('');
                setNewStatusName('');
                setNewStatusValue('Yes');
                setStatusToEdit(null);
                setIsModalOpen(true);
              }}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-base font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all whitespace-nowrap"
            >
              Create Father-Mother Status
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left text-xs border border-gray-100">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-12">#</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af]">Status</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af]">Status</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] text-right w-24"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-500 mb-2" />
                      Loading status data...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-red-500 bg-red-50/50">
                    {error}
                  </td>
                </tr>
              ) : filteredStatuses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500 font-medium">
                    No status data found.
                  </td>
                </tr>
              ) : (
                (searchQuery ? filteredStatuses.slice((currentPage - 1) * 10, currentPage * 10) : filteredStatuses).map((item) => (
                  <tr key={item.iFMStatusID} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3 text-gray-500">{item.iFMStatusID}</td>
                    <td className="px-4 py-3 text-gray-700">{item.vName}</td>
                    <td className="px-4 py-3 text-gray-700">{item.eStatus}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5 text-gray-400">
                        <button 
                          onClick={() => openViewModal(item)}
                          className="text-[#3b82f6] rounded p-1 hover:bg-blue-50 transition-colors" 
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openEditModal(item)}
                          className="text-gray-400 rounded p-1 hover:bg-gray-100 transition-colors" 
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(item.iFMStatusID)}
                          className="text-gray-400 rounded p-1 hover:bg-gray-100 transition-colors" 
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
        {!isLoading && !error && (searchQuery ? Math.ceil(filteredStatuses.length / 10) || 1 : totalPages) > 1 && (
          <div className="px-4 pb-4">
            <Pagination 
              totalPages={searchQuery ? Math.ceil(filteredStatuses.length / 10) || 1 : totalPages} 
              currentPage={currentPage} 
              onPageChange={setCurrentPage} 
            />
          </div>
        )}
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-[15px] font-medium text-gray-800">
                {statusToEdit ? 'Edit' : 'Create'} Father-Mother Status
              </h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                {createError && (
                  <div className="mb-4 text-red-500 text-sm">{createError}</div>
                )}
                <div className="mb-6">
                  <label htmlFor="statusName" className="block text-sm font-bold text-slate-700 mb-2">
                    Status Name
                  </label>
                  <input
                    type="text"
                    id="statusName"
                    value={newStatusName}
                    onChange={(e) => setNewStatusName(e.target.value)}
                    className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div className="mb-8">
                  <label htmlFor="statusValue" className="block text-sm font-bold text-slate-700 mb-2">
                    Status (Yes/No)
                  </label>
                  <select
                    id="statusValue"
                    value={newStatusValue}
                    onChange={(e) => setNewStatusValue(e.target.value)}
                    className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors bg-white"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                  >
                    {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {isCreating ? (statusToEdit ? 'Updating...' : 'Creating...') : (statusToEdit ? 'Update' : 'Create')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setCreateError('');
                      setNewStatusName('');
                      setNewStatusValue('Yes');
                      setStatusToEdit(null);
                    }}
                    disabled={isCreating}
                    className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-red-100/70 flex items-center justify-center mx-auto mb-5">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">Delete Status</h2>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Are you sure you want to delete this status? This action cannot be undone.
              </p>
              {deleteError && (
                <div className="mt-4 text-red-500 text-sm">{deleteError}</div>
              )}
            </div>
            <div className="bg-slate-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="bg-white border border-slate-200 text-slate-700 px-6 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* View Modal */}
      {isViewModalOpen && statusToView && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-[15px] font-medium text-gray-800">View Father-Mother Status</h2>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none mb-1"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">ID</label>
                  <div className="text-sm font-medium text-gray-900 bg-gray-50 p-2.5 rounded border border-gray-100">
                    {statusToView.iFMStatusID}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status Name</label>
                  <div className="text-sm font-medium text-gray-900 bg-gray-50 p-2.5 rounded border border-gray-100">
                    {statusToView.vName}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status (Yes/No)</label>
                  <div className="text-sm font-medium text-gray-900 bg-gray-50 p-2.5 rounded border border-gray-100">
                    {statusToView.eStatus}
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsViewModalOpen(false)}
                  className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded font-medium hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FatherMotherStatusListPage;
