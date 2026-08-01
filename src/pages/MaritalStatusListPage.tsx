import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, Search, Loader2, AlertTriangle } from 'lucide-react';
import apiClient from '../services/apiClient';
import Pagination from '../components/common/Pagination';

interface MaritalStatus {
  iMaritalStatusID: number;
  vName: string;
  eStatus: string;
}

const MaritalStatusListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [maritalStatuses, setMaritalStatuses] = useState<MaritalStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalItems, setTotalItems] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [newMaritalStatusName, setNewMaritalStatusName] = useState('');
  const [newMaritalStatusStatus, setNewMaritalStatusStatus] = useState('Active');
  const [isCreating, setIsCreating] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [maritalStatusToDelete, setMaritalStatusToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingMaritalStatus, setViewingMaritalStatus] = useState<MaritalStatus | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMaritalStatusId, setEditingMaritalStatusId] = useState<number | null>(null);
  const [editMaritalStatusName, setEditMaritalStatusName] = useState('');
  const [editMaritalStatusStatus, setEditMaritalStatusStatus] = useState('Active');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchMaritalStatuses = async (page: number) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await apiClient.get(`v1/admin/master/marital-status?page=${page}&limit=${limit}`, {
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      });
      if (response.data.success) {
        setMaritalStatuses(response.data.data);
        setTotalItems(response.data.meta?.total || response.data.data.length);
        setTotalPages(response.data.meta?.totalPages || 1);
        setCurrentPage(response.data.meta?.page || page);
      } else {
        setError(response.data.message || 'Failed to fetch marital statuses');
      }
    } catch (err: any) {
      console.error('Error fetching marital statuses:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while fetching marital statuses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaritalStatuses(currentPage);
  }, [currentPage]);

  const handleViewClick = (maritalStatus: MaritalStatus) => {
    setViewingMaritalStatus(maritalStatus);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (maritalStatus: MaritalStatus) => {
    setEditingMaritalStatusId(maritalStatus.iMaritalStatusID);
    setEditMaritalStatusName(maritalStatus.vName || '');
    setEditMaritalStatusStatus(maritalStatus.eStatus || 'Active');
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setMaritalStatusToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!maritalStatusToDelete) return;
    
    try {
      setIsDeleting(true);
      const response = await apiClient.delete(`v1/admin/master/marital-status/${maritalStatusToDelete}`, {
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      });
      
      if (response.data.success) {
        setIsDeleteModalOpen(false);
        setMaritalStatusToDelete(null);
        fetchMaritalStatuses(currentPage); // Refresh the list
      } else {
        alert(response.data.message || 'Failed to delete marital status');
      }
    } catch (err: any) {
      console.error('Error deleting marital status:', err);
      alert(err.response?.data?.message || err.message || 'Failed to delete marital status');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateMaritalStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMaritalStatusName.trim() || !editingMaritalStatusId) {
      alert('Please enter a marital status name');
      return;
    }

    try {
      setIsUpdating(true);
      const response = await apiClient.put(`v1/admin/master/marital-status/${editingMaritalStatusId}`, 
        {
          vName: editMaritalStatusName,
          eStatus: editMaritalStatusStatus
        },
        {
          headers: {
            'bypass-tunnel-reminder': 'true'
          }
        }
      );

      if (response.data.success) {
        setIsEditModalOpen(false);
        setEditingMaritalStatusId(null);
        setEditMaritalStatusName('');
        setEditMaritalStatusStatus('Active');
        fetchMaritalStatuses(currentPage); // Refresh the list
      } else {
        alert(response.data.message || 'Failed to update marital status');
      }
    } catch (err: any) {
      console.error('Error updating marital status:', err);
      alert(err.response?.data?.message || err.message || 'Failed to update marital status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateMaritalStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaritalStatusName.trim()) {
      alert('Please enter a marital status name');
      return;
    }

    try {
      setIsCreating(true);
      const response = await apiClient.post('v1/admin/master/marital-status', 
        {
          vName: newMaritalStatusName,
          eStatus: newMaritalStatusStatus
        },
        {
          headers: {
            'bypass-tunnel-reminder': 'true'
          }
        }
      );

      if (response.data.success) {
        setIsModalOpen(false);
        setNewMaritalStatusName('');
        setNewMaritalStatusStatus('Active');
        fetchMaritalStatuses(1); // Refresh list to first page
      } else {
        alert(response.data.message || 'Failed to create marital status');
      }
    } catch (err: any) {
      console.error('Error creating marital status:', err);
      alert(err.response?.data?.message || err.message || 'Failed to create marital status');
    } finally {
      setIsCreating(false);
    }
  };

  const filteredMaritalStatuses = maritalStatuses.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      (item.vName && item.vName.toLowerCase().includes(query)) ||
      (item.eStatus && item.eStatus.toLowerCase().includes(query)) ||
      (item.iMaritalStatusID && item.iMaritalStatusID.toString().includes(query))
    );
  });

  return (
    <div className="flex flex-col text-sm w-full relative">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-[15px] font-medium text-gray-800">Marital Status List</h2>
            <div className="text-xs text-gray-500">
              Showing page {currentPage} of {totalPages} <span className="font-semibold text-gray-800">({totalItems} items total)</span>.
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Type to search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-slate-50 border border-gray-200 text-gray-600 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#00b562] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#009650] transition-colors whitespace-nowrap"
            >
              Create Marital Status
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left text-xs border border-gray-100">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-12">#</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af]">Marital Status</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af]">Marital Status Status</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] text-right w-24"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-500 mb-2" />
                      Loading marital status data...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-red-500 bg-red-50/50">
                    {error}
                  </td>
                </tr>
              ) : filteredMaritalStatuses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500 font-medium">
                    {searchQuery ? 'No marital statuses match your search.' : 'No marital status data found.'}
                  </td>
                </tr>
              ) : (
                filteredMaritalStatuses.map((item) => (
                  <tr key={item.iMaritalStatusID} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3 text-gray-500">{item.iMaritalStatusID}</td>
                    <td className="px-4 py-3 text-gray-700">{item.vName}</td>
                    <td className="px-4 py-3 text-gray-700">{item.eStatus}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5 text-gray-400">
                        <button 
                          onClick={() => handleViewClick(item)}
                          className="text-[#3b82f6] rounded p-1 hover:bg-blue-50 transition-colors" 
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditClick(item)}
                          className="text-[#3b82f6] rounded p-1 hover:bg-blue-50 transition-colors" 
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(item.iMaritalStatusID)}
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
        {!isLoading && !error && totalPages > 1 && (
          <div className="px-4 pb-4">
            <Pagination 
              totalPages={totalPages} 
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
              <h2 className="text-[15px] font-medium text-gray-800">Create Marital Status</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreateMaritalStatus}>
                <div className="mb-6">
                  <label htmlFor="maritalStatusName" className="block text-sm font-bold text-slate-700 mb-2">
                    Marital Status Name
                  </label>
                  <input
                    type="text"
                    id="maritalStatusName"
                    value={newMaritalStatusName}
                    onChange={(e) => setNewMaritalStatusName(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div className="mb-8">
                  <label htmlFor="maritalStatusStatus" className="block text-sm font-bold text-slate-700 mb-2">
                    Marital Status Status
                  </label>
                  <select
                    id="maritalStatusStatus"
                    value={newMaritalStatusStatus}
                    onChange={(e) => setNewMaritalStatusStatus(e.target.value)}
                    className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="bg-[#00b562] text-white px-6 py-2.5 rounded font-medium hover:bg-[#009650] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-center text-gray-900 mb-2">Delete Marital Status</h3>
              <p className="text-sm text-center text-gray-500">
                Are you sure you want to delete this marital status? This action cannot be undone.
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

      {/* View Details Modal */}
      {isViewModalOpen && viewingMaritalStatus && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-[15px] font-medium text-gray-800">Marital Status Details</h2>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 border-b border-gray-50 pb-4">
                  <div className="text-sm font-medium text-gray-500">ID</div>
                  <div className="col-span-2 text-sm text-gray-900 font-medium">#{viewingMaritalStatus.iMaritalStatusID}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 border-b border-gray-50 pb-4">
                  <div className="text-sm font-medium text-gray-500">Marital Status Name</div>
                  <div className="col-span-2 text-sm text-gray-900">{viewingMaritalStatus.vName}</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-sm font-medium text-gray-500">Status</div>
                  <div className="col-span-2">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      viewingMaritalStatus.eStatus === 'Active' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {viewingMaritalStatus.eStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="bg-white border border-gray-200 text-gray-700 px-6 py-2 rounded font-medium hover:bg-gray-50 transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal Popup */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-[15px] font-medium text-gray-800">Edit Marital Status</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleUpdateMaritalStatus}>
                <div className="mb-6">
                  <label htmlFor="editMaritalStatusName" className="block text-sm font-bold text-slate-700 mb-2">
                    Marital Status Name
                  </label>
                  <input
                    type="text"
                    id="editMaritalStatusName"
                    value={editMaritalStatusName}
                    onChange={(e) => setEditMaritalStatusName(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div className="mb-8">
                  <label htmlFor="editMaritalStatusStatus" className="block text-sm font-bold text-slate-700 mb-2">
                    Marital Status Status
                  </label>
                  <select
                    id="editMaritalStatusStatus"
                    value={editMaritalStatusStatus}
                    onChange={(e) => setEditMaritalStatusStatus(e.target.value)}
                    className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="bg-[#00b562] text-white px-6 py-2.5 rounded font-medium hover:bg-[#009650] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    disabled={isUpdating}
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
    </div>
  );
};

export default MaritalStatusListPage;
