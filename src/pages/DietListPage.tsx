import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, Search, Loader2, AlertTriangle } from 'lucide-react';
import apiClient from '../services/apiClient';
import Pagination from '../components/common/Pagination';

interface Diet {
  iDietID: number;
  vName: string;
  eStatus: string;
}

const DietListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [diets, setDiets] = useState<Diet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalItems, setTotalItems] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [newDietName, setNewDietName] = useState('');
  const [newDietStatus, setNewDietStatus] = useState('Active');
  const [isCreating, setIsCreating] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [dietToDelete, setDietToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDietId, setEditingDietId] = useState<number | null>(null);
  const [editDietName, setEditDietName] = useState('');
  const [editDietStatus, setEditDietStatus] = useState('Active');
  const [isUpdating, setIsUpdating] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingDiet, setViewingDiet] = useState<Diet | null>(null);

  const fetchDiets = async (page: number) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await apiClient.get(`v1/admin/master/master-diet?page=${page}&limit=${limit}`, {
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      });
      if (response.data.success) {
        setDiets(response.data.data);
        setTotalItems(response.data.meta?.total || response.data.data.length);
        setTotalPages(response.data.meta?.totalPages || 1);
        setCurrentPage(response.data.meta?.page || page);
      } else {
        setError(response.data.message || 'Failed to fetch diets');
      }
    } catch (err: any) {
      console.error('Error fetching diets:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while fetching diets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDiets(currentPage);
  }, [currentPage]);

  const handleDeleteClick = (id: number) => {
    setDietToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleViewClick = (diet: Diet) => {
    setViewingDiet(diet);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (diet: Diet) => {
    setEditingDietId(diet.iDietID);
    setEditDietName(diet.vName || '');
    setEditDietStatus(diet.eStatus || 'Active');
    setIsEditModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!dietToDelete) return;
    
    try {
      setIsDeleting(true);
      const response = await apiClient.delete(`v1/admin/master/master-diet/${dietToDelete}`, {
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      });
      
      if (response.data.success) {
        setIsDeleteModalOpen(false);
        setDietToDelete(null);
        fetchDiets(currentPage); // Refresh the list
      } else {
        alert(response.data.message || 'Failed to delete diet');
      }
    } catch (err: any) {
      console.error('Error deleting diet:', err);
      alert(err.response?.data?.message || err.message || 'Failed to delete diet');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateDiet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDietName.trim()) {
      alert('Please enter a diet name');
      return;
    }

    try {
      setIsCreating(true);
      const response = await apiClient.post('v1/admin/master/master-diet', 
        {
          vName: newDietName,
          eStatus: newDietStatus
        },
        {
          headers: {
            'bypass-tunnel-reminder': 'true'
          }
        }
      );

      if (response.data.success) {
        setIsModalOpen(false);
        setNewDietName('');
        setNewDietStatus('Active');
        fetchDiets(1); // Refresh list to first page
      } else {
        alert(response.data.message || 'Failed to create diet');
      }
    } catch (err: any) {
      console.error('Error creating diet:', err);
      alert(err.response?.data?.message || err.message || 'Failed to create diet');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateDiet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDietName.trim() || !editingDietId) {
      alert('Please enter a diet name');
      return;
    }

    try {
      setIsUpdating(true);
      const response = await apiClient.put(`v1/admin/master/master-diet/${editingDietId}`, 
        {
          vName: editDietName,
          eStatus: editDietStatus
        },
        {
          headers: {
            'bypass-tunnel-reminder': 'true'
          }
        }
      );

      if (response.data.success) {
        setIsEditModalOpen(false);
        setEditingDietId(null);
        setEditDietName('');
        setEditDietStatus('Active');
        fetchDiets(currentPage); // Refresh the list
      } else {
        alert(response.data.message || 'Failed to update diet');
      }
    } catch (err: any) {
      console.error('Error updating diet:', err);
      alert(err.response?.data?.message || err.message || 'Failed to update diet');
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredDiets = diets.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      (item.vName && item.vName.toLowerCase().includes(query)) ||
      (item.eStatus && item.eStatus.toLowerCase().includes(query)) ||
      (item.iDietID && item.iDietID.toString().includes(query))
    );
  });



  return (
    <div className="flex flex-col text-sm w-full relative">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-[15px] font-medium text-gray-800">Diet List</h2>
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
              Create Diet
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left text-xs border border-gray-100">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-12">#</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af]">Diet</th>
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
                      Loading diet data...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-red-500 bg-red-50/50">
                    {error}
                  </td>
                </tr>
              ) : filteredDiets.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500 font-medium">
                    {searchQuery ? 'No diets match your search.' : 'No diet data found.'}
                  </td>
                </tr>
              ) : (
                filteredDiets.map((item) => (
                  <tr key={item.iDietID} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3 text-gray-500">{item.iDietID}</td>
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
                          onClick={() => handleDeleteClick(item.iDietID)}
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
              <h2 className="text-[15px] font-medium text-gray-800">Create Diet</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreateDiet}>
                <div className="mb-6">
                  <label htmlFor="dietName" className="block text-sm font-bold text-slate-700 mb-2">
                    Diet Name
                  </label>
                  <input
                    type="text"
                    id="dietName"
                    value={newDietName}
                    onChange={(e) => setNewDietName(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div className="mb-8">
                  <label htmlFor="dietStatus" className="block text-sm font-bold text-slate-700 mb-2">
                    Status
                  </label>
                  <select
                    id="dietStatus"
                    value={newDietStatus}
                    onChange={(e) => setNewDietStatus(e.target.value)}
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
              <h3 className="text-lg font-medium text-center text-gray-900 mb-2">Delete Diet</h3>
              <p className="text-sm text-center text-gray-500">
                Are you sure you want to delete this diet? This action cannot be undone.
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

      {/* Edit Modal Popup */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-[15px] font-medium text-gray-800">Edit Diet</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleUpdateDiet}>
                <div className="mb-6">
                  <label htmlFor="editDietName" className="block text-sm font-bold text-slate-700 mb-2">
                    Diet Name
                  </label>
                  <input
                    type="text"
                    id="editDietName"
                    value={editDietName}
                    onChange={(e) => setEditDietName(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div className="mb-8">
                  <label htmlFor="editDietStatus" className="block text-sm font-bold text-slate-700 mb-2">
                    Status
                  </label>
                  <select
                    id="editDietStatus"
                    value={editDietStatus}
                    onChange={(e) => setEditDietStatus(e.target.value)}
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

      {/* View Details Modal */}
      {isViewModalOpen && viewingDiet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-[15px] font-medium text-gray-800">Diet Details</h2>
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
                  <div className="col-span-2 text-sm text-gray-900 font-medium">#{viewingDiet.iDietID}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 border-b border-gray-50 pb-4">
                  <div className="text-sm font-medium text-gray-500">Diet Name</div>
                  <div className="col-span-2 text-sm text-gray-900">{viewingDiet.vName}</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-sm font-medium text-gray-500">Status</div>
                  <div className="col-span-2">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      viewingDiet.eStatus === 'Active' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {viewingDiet.eStatus}
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
    </div>
  );
};

export default DietListPage;
