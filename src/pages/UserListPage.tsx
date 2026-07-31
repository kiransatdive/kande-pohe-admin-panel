import React, { useState, useEffect } from 'react';
import { Eye, Edit, Image as ImageIcon, Check, Trash2, Search, Loader2, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Pagination from '../components/common/Pagination';
import UserViewModal from '../components/common/UserViewModal';
import UserPhotosModal from '../components/common/UserPhotosModal';
import UserEditModal from '../components/common/UserEditModal';
import apiClient from '../services/apiClient';

interface User {
  id: number;
  First_Name: string | null;
  Last_Name: string | null;
  email: string | null;
  Mobile: string | null;
  LastLoginTime: number | string | null;
  created_at: number | null;
  status: number | string | null;
}

const UserListPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [selectedPhotoUserId, setSelectedPhotoUserId] = useState<number | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  
  const [selectedEditUserId, setSelectedEditUserId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async (page: number) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await apiClient.get('v1/admin/users/all', {
        params: {
          page,
          limit: 10
        },
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      });

      if (response.data.success) {
        setUsers(response.data.data || []);
        if (response.data.meta) {
          setTotalPages(response.data.meta.totalPages || 1);
          setTotalItems(response.data.meta.total || 0);
        }
      } else {
        setError('Failed to fetch users');
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while fetching users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const formatDate = (timestamp?: number | string | null) => {
    if (!timestamp) return 'N/A';
    // If it's a Unix timestamp in seconds
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString('en-GB');
  };

  const formatStatus = (status: number | string | null) => {
    if (status === 1) return 'Active';
    if (status === 10) return 'Pending';
    if (status === 2) return 'Inactive';
    if (!status) return 'Unknown';
    return String(status);
  };
  
  const getStatusColor = (status: number | string | null) => {
    if (status === 1) return 'bg-[#00b562]'; // Active
    if (status === 10) return 'bg-amber-500'; // Pending
    if (status === 2) return 'bg-red-500'; // Inactive
    return 'bg-gray-400';
  }

  const handleDeleteClick = (id: number) => {
    setUserToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    
    try {
      setIsDeleting(true);
      const response = await apiClient.delete(`v1/admin/users/${userToDelete}`, {
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      });
      
      if (response.data.success) {
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
        fetchUsers(currentPage); // Refresh the list
      } else {
        alert(response.data.message || 'Failed to delete user');
      }
    } catch (err: any) {
      console.error('Error deleting user:', err);
      alert(err.response?.data?.message || err.message || 'Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  // Client-side search filtering (since API search isn't explicitly defined yet)
  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (user.id?.toString() || '').includes(query) ||
      (user.First_Name || '').toLowerCase().includes(query) ||
      (user.Last_Name || '').toLowerCase().includes(query) ||
      (user.email || '').toLowerCase().includes(query) ||
      (user.Mobile || '').toLowerCase().includes(query) ||
      formatStatus(user.status).toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-col text-sm">
      {/* User List Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-[15px] font-medium text-gray-800">User List (All)</h2>
            <div className="text-xs text-gray-500">
              Showing page {currentPage} of {totalPages} <span className="font-semibold text-gray-800">({totalItems} items total)</span>.
            </div>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 bg-slate-50 border border-gray-200 text-gray-600 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
              />
            </div>
            <Link 
              to="/user-list-newly-registered" 
              className="bg-[#00b562] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#009650] transition-colors whitespace-nowrap"
            >
              Newly Register
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left text-xs border border-gray-100">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 font-semibold text-gray-500 w-12">#</th>
                <th className="px-4 py-3 font-semibold text-gray-500">First Name</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Last Name</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Email</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Mobile</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Last Login Date</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Date of registration</th>
                <th className="px-4 py-3 font-semibold text-gray-500 w-28">Status</th>
                <th className="px-4 py-3 font-semibold text-gray-500 text-right w-24"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-500 mb-2" />
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-red-500 bg-red-50/50">
                    {error}
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3 text-gray-500">{(currentPage - 1) * 10 + index + 1}</td>
                    <td className="px-4 py-3 text-gray-700">{user.First_Name || '-'}</td>
                    <td className="px-4 py-3 text-gray-700">{user.Last_Name || '-'}</td>
                    <td className="px-4 py-3 text-[#3b82f6] hover:underline cursor-pointer">{user.email || '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{user.Mobile || '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(user.LastLoginTime)}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(user.created_at)}</td>
                    <td className="px-4 py-3">
                      <span className={`${getStatusColor(user.status)} text-white text-[10px] font-medium px-2.5 py-1 rounded`}>
                        {formatStatus(user.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5 text-gray-400">
                        <button 
                          onClick={() => {
                            setSelectedUserId(user.id);
                            setIsViewModalOpen(true);
                          }}
                          className="rounded p-1 hover:bg-blue-50 transition-colors text-blue-500" 
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedEditUserId(user.id);
                            setIsEditModalOpen(true);
                          }}
                          className="rounded p-1 hover:bg-blue-50 transition-colors text-blue-400" 
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedPhotoUserId(user.id);
                            setIsPhotoModalOpen(true);
                          }}
                          className="rounded p-1 hover:bg-amber-50 transition-colors text-amber-500" 
                          title="View Photos"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </button>
                        <button className="rounded p-1 hover:bg-emerald-50 transition-colors text-emerald-500" title="Approve">
                          <Check className="w-4 h-4" strokeWidth={3} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(user.id)}
                          className="rounded p-1 hover:bg-red-50 transition-colors text-orange-400" 
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
        {!isLoading && !error && (
          <Pagination 
            totalPages={totalPages} 
            currentPage={currentPage} 
            onPageChange={setCurrentPage} 
          />
        )}
      </div>

      <UserViewModal 
        userId={selectedUserId!}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />

      <UserPhotosModal 
        userId={selectedPhotoUserId!}
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
      />

      <UserEditModal 
        userId={selectedEditUserId!}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => fetchUsers(currentPage)}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-center text-gray-900 mb-2">Delete User</h3>
              <p className="text-sm text-center text-gray-500">
                Are you sure you want to delete this user? This action cannot be undone and will permanently remove their data from the system.
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
                  'Delete User'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserListPage;
