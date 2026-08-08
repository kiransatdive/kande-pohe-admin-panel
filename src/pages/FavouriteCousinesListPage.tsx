import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, Search, Loader2, AlertTriangle } from 'lucide-react';
import apiClient from '../services/apiClient';
import Pagination from '../components/common/Pagination';

interface FavouriteCousine {
  ID: number;
  Name: string;
}

const FavouriteCousinesListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [fieldToEdit, setFieldToEdit] = useState<FavouriteCousine | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [fieldToView, setFieldToView] = useState<FavouriteCousine | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const [fields, setFields] = useState<FavouriteCousine[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

    const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalItems, setTotalItems] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchFields = async (page: number) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await apiClient.get(`v1/admin/master/favourite-cousines?page=${page}&limit=${searchQuery ? 1000 : limit}`);
      if (response.data.success) {
        setFields(response.data.data);
        setTotalItems(response.data.meta?.total || response.data.data.length);
        setTotalPages(response.data.meta?.totalPages || 1);
        setCurrentPage(response.data.meta?.page || page);
      } else {
        setError(response.data.message || 'Failed to fetch favourite cousines data');
      }
    } catch (err: any) {
      console.error('Error fetching favourite cousines data:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchFields(searchQuery ? 1 : currentPage);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, searchQuery ? 1 : currentPage]);

  const filteredFields = fields.filter((item) => {
    const term = searchQuery.toLowerCase();
    const id = item.ID ? item.ID.toString() : '';
    const name = item.Name ? item.Name.toLowerCase() : '';
    return id.includes(term) || name.includes(term);
  });

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setCreateError('Name is required');
      return;
    }
    
    setIsCreating(true);
    setCreateError('');
    try {
      let response;
      if (fieldToEdit) {
        response = await apiClient.put(`v1/admin/master/favourite-cousines/${fieldToEdit.ID}`, {
          Name: newName.trim()
        });
      } else {
        response = await apiClient.post('v1/admin/master/favourite-cousines', {
          Name: newName.trim()
        });
      }
      
      if (response.data.success) {
        setIsModalOpen(false);
        setNewName('');
        setFieldToEdit(null);
        fetchFields(currentPage); // Refresh list
      } else {
        setCreateError(response.data.message || `Failed to ${fieldToEdit ? 'update' : 'create'}`);
      }
    } catch (err: any) {
      console.error(`Error ${fieldToEdit ? 'updating' : 'creating'}:`, err);
      setCreateError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setIsCreating(false);
    }
  };

  const openEditModal = (field: FavouriteCousine) => {
    setFieldToEdit(field);
    setNewName(field.Name);
    setCreateError('');
    setIsModalOpen(true);
  };

  const openDeleteModal = (id: number) => {
    setFieldToDelete(id);
    setDeleteError('');
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (fieldToDelete === null) return;
    
    setIsDeleting(true);
    setDeleteError('');
    
    try {
      const response = await apiClient.delete(`v1/admin/master/favourite-cousines/${fieldToDelete}`);
      if (response.data.success) {
        setIsDeleteModalOpen(false);
        setFieldToDelete(null);
        fetchFields(currentPage);
      } else {
        setDeleteError(response.data.message || 'Failed to delete');
      }
    } catch (err: any) {
      console.error('Error deleting:', err);
      setDeleteError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  const openViewModal = (field: FavouriteCousine) => {
    setFieldToView(field);
    setIsViewModalOpen(true);
  };
  

  return (
    <div className="flex flex-col text-sm w-full relative">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-[15px] font-medium text-gray-800">Favourite Cousines List</h2>
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
                setFieldToEdit(null);
                setNewName('');
                setCreateError('');
                setIsModalOpen(true);
              }}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-base font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all whitespace-nowrap"
            >
              Create Favourite Cousine
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left text-xs border border-gray-100">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-12">#</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af]">Name</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] text-right w-24"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-500 mb-2" />
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-red-500 bg-red-50/50">
                    {error}
                  </td>
                </tr>
              ) : filteredFields.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-500 font-medium">
                    No items found.
                  </td>
                </tr>
              ) : (
                (searchQuery ? filteredFields.slice((currentPage - 1) * 10, currentPage * 10) : filteredFields).map((item) => (
                  <tr key={item.ID} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3 text-gray-500">{item.ID}</td>
                    <td className="px-4 py-3 text-gray-700">{item.Name}</td>
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
                          className="text-[#3b82f6] rounded p-1 hover:bg-blue-50 transition-colors" 
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(item.ID)}
                          className="text-red-400 rounded p-1 hover:bg-red-50 transition-colors" 
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
        {!isLoading && !error && (searchQuery ? Math.ceil(filteredFields.length / 10) || 1 : totalPages) > 1 && (
          <div className="px-4 pb-4">
            <Pagination 
              totalPages={searchQuery ? Math.ceil(filteredFields.length / 10) || 1 : totalPages} 
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
                {fieldToEdit ? 'Edit Favourite Cousine' : 'Create Favourite Cousine'}
              </h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreateGroup}>
                {createError && (
                  <div className="mb-4 text-red-500 text-sm">{createError}</div>
                )}
                <div className="mb-8">
                  <label htmlFor="cousineName" className="block text-sm font-bold text-slate-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="cousineName"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                  >
                    {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {isCreating ? (fieldToEdit ? 'Saving...' : 'Creating...') : (fieldToEdit ? 'Save Changes' : 'Create')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setCreateError('');
                      setNewName('');
                      setFieldToEdit(null);
                    }}
                    className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded font-medium hover:bg-gray-200 transition-colors"
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
              <h2 className="text-xl font-bold text-slate-800 mb-3">Delete Record</h2>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Are you sure you want to delete this record? This action cannot be undone.
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
      {isViewModalOpen && fieldToView && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-[15px] font-semibold text-gray-800 flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-500" />
                View Favourite Cousine
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-3 border-b border-gray-50 pb-3">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider col-span-1">ID</div>
                  <div className="text-sm text-gray-800 font-medium col-span-2">{fieldToView.ID}</div>
                </div>
                <div className="grid grid-cols-3 pb-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider col-span-1">Name</div>
                  <div className="text-sm text-gray-800 font-medium col-span-2">{fieldToView.Name}</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="bg-white border border-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
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

export default FavouriteCousinesListPage;
