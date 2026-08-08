import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, Search, Loader2, AlertTriangle } from 'lucide-react';
import apiClient from '../services/apiClient';
import Pagination from '../components/common/Pagination';

interface Religion {
  iReligion_ID: number;
  vName: string;
  eStatus: string;
}

const ReligionListPage: React.FC = () => {
  const [religions, setReligions] = useState<Religion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [religionToDelete, setReligionToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Create Religion State
  const [newReligionName, setNewReligionName] = useState('');
  const [newReligionStatus, setNewReligionStatus] = useState('Active');
  const [isCreating, setIsCreating] = useState(false);

  // Edit Religion State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReligionId, setEditingReligionId] = useState<number | null>(null);
  const [editReligionName, setEditReligionName] = useState('');
  const [editReligionStatus, setEditReligionStatus] = useState('Active');
  const [isUpdating, setIsUpdating] = useState(false);

  // View Religion State
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingReligion, setViewingReligion] = useState<Religion | null>(null);

  const fetchReligions = async (page: number) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await apiClient.get('v1/admin/master/religion', {
        params: {
          page,
          limit: searchQuery ? 1000 : 10
        },
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      });
      
      if (response.data.success) {
        setReligions(response.data.data);
        if (response.data.meta) {
          setTotalPages(response.data.meta.totalPages || response.data.meta.last_page || 1);
          setTotalItems(response.data.meta.total || 0);
          setCurrentPage(response.data.meta.page || response.data.meta.current_page || 1);
        }
      } else {
        setError(response.data.message || 'Failed to fetch religions');
      }
    } catch (err: any) {
      console.error('Error fetching religions:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while fetching religions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchReligions(searchQuery ? 1 : currentPage);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, searchQuery ? 1 : currentPage]);

  const handleDeleteClick = (id: number) => {
    setReligionToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!religionToDelete) return;
    
    try {
      setIsDeleting(true);
      const response = await apiClient.delete(`v1/admin/master/religion/${religionToDelete}`, {
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      });
      
      if (response.data.success) {
        setIsDeleteModalOpen(false);
        setReligionToDelete(null);
        fetchReligions(currentPage); // Refresh the list
      } else {
        alert(response.data.message || 'Failed to delete religion');
      }
    } catch (err: any) {
      console.error('Error deleting religion:', err);
      alert(err.response?.data?.message || err.message || 'Failed to delete religion');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateReligion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReligionName.trim()) {
      alert('Please enter a religion name');
      return;
    }

    try {
      setIsCreating(true);
      const response = await apiClient.post('v1/admin/master/religion', 
        {
          vName: newReligionName,
          eStatus: newReligionStatus
        },
        {
          headers: {
            'bypass-tunnel-reminder': 'true'
          }
        }
      );

      if (response.data.success) {
        setIsModalOpen(false);
        setNewReligionName('');
        setNewReligionStatus('Active');
        fetchReligions(1); // Refresh list to first page to see the new record
      } else {
        alert(response.data.message || 'Failed to create religion');
      }
    } catch (err: any) {
      console.error('Error creating religion:', err);
      alert(err.response?.data?.message || err.message || 'Failed to create religion');
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditClick = (religion: Religion) => {
    setEditingReligionId(religion.iReligion_ID);
    setEditReligionName(religion.vName);
    setEditReligionStatus(religion.eStatus || 'Active');
    setIsEditModalOpen(true);
  };

  const handleViewClick = (religion: Religion) => {
    setViewingReligion(religion);
    setIsViewModalOpen(true);
  };

  const handleUpdateReligion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReligionId) return;
    if (!editReligionName.trim()) {
      alert('Please enter a religion name');
      return;
    }

    try {
      setIsUpdating(true);
      const response = await apiClient.put(`v1/admin/master/religion/${editingReligionId}`, 
        {
          vName: editReligionName,
          eStatus: editReligionStatus
        },
        {
          headers: {
            'bypass-tunnel-reminder': 'true'
          }
        }
      );

      if (response.data.success) {
        setIsEditModalOpen(false);
        setEditingReligionId(null);
        setEditReligionName('');
        setEditReligionStatus('Active');
        fetchReligions(currentPage); // Refresh list
      } else {
        alert(response.data.message || 'Failed to update religion');
      }
    } catch (err: any) {
      console.error('Error updating religion:', err);
      alert(err.response?.data?.message || err.message || 'Failed to update religion');
    } finally {
      setIsUpdating(false);
    }
  };

  // Client-side search filtering
  const filteredReligions = religions.filter(religion => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (religion.vName || '').toLowerCase().includes(query) ||
      (religion.eStatus || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-col text-sm w-full relative">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-[15px] font-medium text-gray-800">Religion List</h2>
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
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-base font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all whitespace-nowrap"
            >
              Create Religion
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left text-xs border border-gray-100">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-12 text-center">#</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af]">Religion</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-32">Religion Status</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-500 mb-2" />
                      Loading religions...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-red-500 bg-red-50/50">
                    {error}
                  </td>
                </tr>
              ) : filteredReligions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500 font-medium">
                    No religions found.
                  </td>
                </tr>
              ) : (
                (searchQuery ? filteredReligions.slice((currentPage - 1) * 10, currentPage * 10) : filteredReligions).map((religion, index) => (
                  <tr key={religion.iReligion_ID} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-gray-500 text-center font-medium">
                      {(currentPage - 1) * 10 + index + 1}
                    </td>
                    <td className="px-4 py-3 text-gray-700 font-medium">{religion.vName}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-medium uppercase tracking-wider ${
                        religion.eStatus?.toLowerCase() === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {religion.eStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5 text-gray-400">
                        <button 
                          onClick={() => handleViewClick(religion)}
                          className="text-[#3b82f6] rounded p-1 hover:bg-blue-50 transition-colors" 
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditClick(religion)}
                          className="text-[#3b82f6] rounded p-1 hover:bg-blue-50 transition-colors" 
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(religion.iReligion_ID)}
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
        {!isLoading && !error && (searchQuery ? Math.ceil(filteredReligions.length / 10) || 1 : totalPages) > 1 && (
          <div className="px-4 pb-4">
            <Pagination 
              totalPages={searchQuery ? Math.ceil(filteredReligions.length / 10) || 1 : totalPages} 
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
              <h2 className="text-[15px] font-medium text-gray-800">Create Religion</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreateReligion}>
                <div className="mb-6">
                  <label htmlFor="religionName" className="block text-sm font-bold text-slate-700 mb-2">
                    Religion
                  </label>
                  <input
                    type="text"
                    id="religionName"
                    value={newReligionName}
                    onChange={(e) => setNewReligionName(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div className="mb-8">
                  <label htmlFor="religionStatus" className="block text-sm font-bold text-slate-700 mb-2">
                    Religion Status
                  </label>
                  <select
                    id="religionStatus"
                    value={newReligionStatus}
                    onChange={(e) => setNewReligionStatus(e.target.value)}
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
                    className="bg-blue-600 text-white px-6 py-2.5 rounded font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
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
      {/* Edit Modal Popup */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-[15px] font-medium text-gray-800">Edit Religion</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleUpdateReligion}>
                <div className="mb-6">
                  <label htmlFor="editReligionName" className="block text-sm font-bold text-slate-700 mb-2">
                    Religion
                  </label>
                  <input
                    type="text"
                    id="editReligionName"
                    value={editReligionName}
                    onChange={(e) => setEditReligionName(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div className="mb-8">
                  <label htmlFor="editReligionStatus" className="block text-sm font-bold text-slate-700 mb-2">
                    Religion Status
                  </label>
                  <select
                    id="editReligionStatus"
                    value={editReligionStatus}
                    onChange={(e) => setEditReligionStatus(e.target.value)}
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
                    className="bg-[#3b82f6] text-white px-6 py-2.5 rounded font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Save Changes'
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
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-center text-gray-900 mb-2">Delete Religion</h3>
              <p className="text-sm text-center text-gray-500">
                Are you sure you want to delete this religion? This action cannot be undone.
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
      {/* View Modal Popup */}
      {isViewModalOpen && viewingReligion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-[15px] font-medium text-gray-800">View Religion Details</h2>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 border-b border-gray-50 pb-4">
                  <div className="col-span-1 text-sm font-medium text-gray-500">ID</div>
                  <div className="col-span-2 text-sm text-gray-900 font-medium">{viewingReligion.iReligion_ID}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 border-b border-gray-50 pb-4">
                  <div className="col-span-1 text-sm font-medium text-gray-500">Name</div>
                  <div className="col-span-2 text-sm text-gray-900">{viewingReligion.vName || '-'}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 border-b border-gray-50 pb-4">
                  <div className="col-span-1 text-sm font-medium text-gray-500">Status</div>
                  <div className="col-span-2">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-medium uppercase tracking-wider ${
                      viewingReligion.eStatus?.toLowerCase() === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {viewingReligion.eStatus || '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex px-6 py-4 bg-gray-50 justify-end">
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReligionListPage;
