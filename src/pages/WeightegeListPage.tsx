import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, Loader2, AlertTriangle, Search } from 'lucide-react';
import apiClient from '../services/apiClient';

interface Weightege {
  iWightege: number;
  vWightegeName: string;
  vWightegePercent: string;
}

const WeightegeListPage: React.FC = () => {
  const [weighteges, setWeighteges] = useState<Weightege[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newName, setNewName] = useState('');
  const [newPercent, setNewPercent] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [weightegeToDelete, setWeightegeToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingWeightege, setViewingWeightege] = useState<Weightege | null>(null);
  const [isViewingLoading, setIsViewingLoading] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingWeightegeId, setEditingWeightegeId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editPercent, setEditPercent] = useState('');
  const [isEditingLoading, setIsEditingLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchWeighteges = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await apiClient.get('v1/admin/master/wightege', {
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      });
      
      if (response.data.success) {
        setWeighteges(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch weightege data');
      }
    } catch (err: any) {
      console.error('Error fetching weightege:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while fetching weightege data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeighteges();
  }, []);

  const handleCreateWeightege = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPercent.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setIsCreating(true);
      const response = await apiClient.post('v1/admin/master/wightege', 
        {
          vWightegeName: newName,
          vWightegePercent: newPercent
        },
        {
          headers: {
            'bypass-tunnel-reminder': 'true'
          }
        }
      );

      if (response.data.success) {
        setIsModalOpen(false);
        setNewName('');
        setNewPercent('');
        fetchWeighteges(); // Refresh the list
      } else {
        alert(response.data.message || 'Failed to create weightege');
      }
    } catch (err: any) {
      console.error('Error creating weightege:', err);
      alert(err.response?.data?.message || err.message || 'Failed to create weightege');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setWeightegeToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = async (id: number) => {
    setIsEditModalOpen(true);
    setIsEditingLoading(true);
    setEditingWeightegeId(id);
    setEditName('');
    setEditPercent('');
    try {
      const response = await apiClient.get(`v1/admin/master/wightege/${id}`, {
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      });
      if (response.data.success) {
        const itemData = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
        setEditName(itemData.vWightegeName || '');
        setEditPercent(itemData.vWightegePercent?.toString() || '');
      } else {
        alert(response.data.message || 'Failed to fetch weightege details');
        setIsEditModalOpen(false);
      }
    } catch (err: any) {
      console.error('Error fetching weightege details:', err);
      alert(err.response?.data?.message || err.message || 'Failed to fetch details');
      setIsEditModalOpen(false);
    } finally {
      setIsEditingLoading(false);
    }
  };

  const handleUpdateWeightege = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editPercent.toString().trim() || !editingWeightegeId) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setIsUpdating(true);
      const response = await apiClient.put(`v1/admin/master/wightege/${editingWeightegeId}`, 
        {
          vWightegeName: editName,
          vWightegePercent: editPercent
        },
        {
          headers: {
            'bypass-tunnel-reminder': 'true'
          }
        }
      );

      if (response.data.success) {
        setIsEditModalOpen(false);
        setEditingWeightegeId(null);
        setEditName('');
        setEditPercent('');
        fetchWeighteges(); // Refresh the list
      } else {
        alert(response.data.message || 'Failed to update weightege');
      }
    } catch (err: any) {
      console.error('Error updating weightege:', err);
      alert(err.response?.data?.message || err.message || 'Failed to update weightege');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleViewClick = async (id: number) => {
    setIsViewModalOpen(true);
    setIsViewingLoading(true);
    setViewingWeightege(null);
    try {
      const response = await apiClient.get(`v1/admin/master/wightege/${id}`, {
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      });
      if (response.data.success) {
        // The API returns the data directly or as an array. Handle both just in case.
        const itemData = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
        setViewingWeightege(itemData);
      } else {
        alert(response.data.message || 'Failed to fetch weightege details');
        setIsViewModalOpen(false);
      }
    } catch (err: any) {
      console.error('Error fetching weightege details:', err);
      alert(err.response?.data?.message || err.message || 'Failed to fetch details');
      setIsViewModalOpen(false);
    } finally {
      setIsViewingLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!weightegeToDelete) return;
    
    try {
      setIsDeleting(true);
      const response = await apiClient.delete(`v1/admin/master/wightege/${weightegeToDelete}`, {
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      });
      
      if (response.data.success) {
        setIsDeleteModalOpen(false);
        setWeightegeToDelete(null);
        fetchWeighteges(); // Refresh the list
      } else {
        alert(response.data.message || 'Failed to delete weightege');
      }
    } catch (err: any) {
      console.error('Error deleting weightege:', err);
      alert(err.response?.data?.message || err.message || 'Failed to delete weightege');
    } finally {
      setIsDeleting(false);
    }
  };
  const filteredData = weighteges.filter((item: any) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return Object.values(item).some(val => 
      val !== null && val !== undefined && val.toString().toLowerCase().includes(query)
    );
  });


  return (
    <div className="flex flex-col text-sm w-full relative">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-[15px] font-medium text-gray-800">User Weightege List</h2>
            <div className="text-xs text-gray-500">
              Showing <span className="font-semibold text-gray-800">{filteredData.length}</span> items.
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
              Create Wightege
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left text-xs border border-gray-100">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-16 text-center">ID</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af]">Step Name</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af]">Weightege In Percent</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-500 mb-2" />
                      Loading weightege data...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-red-500 bg-red-50/50">
                    {error}
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500 font-medium">
                    No weightege data found.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.iWightege} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3 text-gray-500 text-center">{item.iWightege}</td>
                    <td className="px-4 py-3 text-gray-700 font-medium">{item.vWightegeName}</td>
                    <td className="px-4 py-3 text-gray-700">{item.vWightegePercent}%</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5 text-gray-400">
                        <button 
                          onClick={() => handleViewClick(item.iWightege)}
                          className="text-[#3b82f6] rounded p-1 hover:bg-blue-50 transition-colors" 
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditClick(item.iWightege)}
                          className="text-[#3b82f6] rounded p-1 hover:bg-blue-50 transition-colors" 
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(item.iWightege)}
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
      </div>

      {/* Modal Popup (Placeholder for Create) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-[15px] font-medium text-gray-800">Create Wightege</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreateWeightege}>
                <div className="mb-6">
                  <label htmlFor="stepName" className="block text-sm font-bold text-slate-700 mb-2">
                    Step Name
                  </label>
                  <input
                    type="text"
                    id="stepName"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div className="mb-8">
                  <label htmlFor="wightegePercent" className="block text-sm font-bold text-slate-700 mb-2">
                    Wightege In Percent
                  </label>
                  <input
                    type="number"
                    id="wightegePercent"
                    value={newPercent}
                    onChange={(e) => setNewPercent(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
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
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-center text-gray-900 mb-2">Delete Weightege</h3>
              <p className="text-sm text-center text-gray-500">
                Are you sure you want to delete this weightege? This action cannot be undone.
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-[15px] font-medium text-gray-800">Edit Weightege</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              {isEditingLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
                  <p className="text-sm text-gray-500">Loading details...</p>
                </div>
              ) : (
                <form onSubmit={handleUpdateWeightege}>
                  <div className="mb-6">
                    <label htmlFor="editStepName" className="block text-sm font-bold text-slate-700 mb-2">
                      Step Name
                    </label>
                    <input
                      type="text"
                      id="editStepName"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                  <div className="mb-8">
                    <label htmlFor="editWightegePercent" className="block text-sm font-bold text-slate-700 mb-2">
                      Wightege In Percent
                    </label>
                    <input
                      type="number"
                      id="editWightegePercent"
                      value={editPercent}
                      onChange={(e) => setEditPercent(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                  <div className="flex items-center gap-3 justify-end border-t border-gray-50 pt-4 mt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      disabled={isUpdating}
                      className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
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
                        'Update'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View Modal Popup */}
      {isViewModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-[15px] font-medium text-gray-800">View Weightege Details</h2>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              {isViewingLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
                  <p className="text-sm text-gray-500">Loading details...</p>
                </div>
              ) : viewingWeightege ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 border-b border-gray-50 pb-4">
                    <div className="col-span-1 text-sm font-medium text-gray-500">ID</div>
                    <div className="col-span-2 text-sm text-gray-900 font-medium">{viewingWeightege.iWightege}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-b border-gray-50 pb-4">
                    <div className="col-span-1 text-sm font-medium text-gray-500">Step Name</div>
                    <div className="col-span-2 text-sm text-gray-900">{viewingWeightege.vWightegeName || '-'}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-b border-gray-50 pb-4">
                    <div className="col-span-1 text-sm font-medium text-gray-500">Weightege</div>
                    <div className="col-span-2 text-sm text-gray-900">{viewingWeightege.vWightegePercent}%</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Failed to load data.
                </div>
              )}
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

export default WeightegeListPage;
