import React, { useState, useEffect } from 'react';
import { Eye, Check, XCircle, MinusCircle, Search, Loader2, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';
import Pagination from '../components/common/Pagination';
import UserViewModal from '../components/common/UserViewModal';
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
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<number | null>(null);
  
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [userToApprove, setUserToApprove] = useState<number | null>(null);
  const [isApproving, setIsApproving] = useState(false);

  const [isDisapproveModalOpen, setIsDisapproveModalOpen] = useState(false);
  const [userToDisapprove, setUserToDisapprove] = useState<number | null>(null);
  const [isDisapproving, setIsDisapproving] = useState(false);

  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [userToBlock, setUserToBlock] = useState<number | null>(null);
  const [isBlocking, setIsBlocking] = useState(false);

  const fetchUsers = async (page: number, currentSearch = searchQuery) => {
    setIsLoading(true);
    setError('');
    const isSearching = currentSearch.trim().length > 0;
    try {
      const response = await apiClient.get('v1/admin/users/all', {
        params: {
          page: isSearching ? 1 : page,
          limit: isSearching ? 100 : 10
        },
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      });

      if (response.data.success) {
        setUsers(response.data.data || []);
        if (!isSearching && response.data.meta) {
          setTotalPages(response.data.meta.totalPages || 1);
          setTotalItems(response.data.meta.total || 0);
        } else if (!isSearching) {
          setTotalItems(response.data.data?.length || 0);
          setTotalPages(1);
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
    const delayDebounceFn = setTimeout(() => {
      // If we are searching, we already have all data (up to 100). Don't refetch on page change unless searchQuery itself changed.
      // We will only refetch if searchQuery changed, OR if we are not searching and currentPage changed.
      fetchUsers(searchQuery ? 1 : currentPage, searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, searchQuery ? 1 : currentPage]);

  const formatDate = (dateValue?: number | string | null) => {
    if (!dateValue) return 'N/A';
    
    if (typeof dateValue === 'number' || (typeof dateValue === 'string' && /^\d+$/.test(dateValue))) {
      let timestamp = Number(dateValue);
      if (timestamp < 10000000000) {
        timestamp *= 1000;
      }
      return new Date(timestamp).toLocaleDateString('en-GB');
    }

    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return 'N/A';
    
    return d.toLocaleDateString('en-GB');
  };

  const formatStatus = (status: number | string | null) => {
    if (status === 0 || status === '0') return 'Deleted';
    if (status === 1 || status === '1') return 'Active';
    if (status === 2 || status === '2') return 'Inactive';
    if (status === 3 || status === '3' || status === 10 || status === '10') return 'Pending';
    if (status === 4 || status === '4') return 'Disapproved';
    if (status === 5 || status === '5') return 'Approved';
    if (status === 6 || status === '6') return 'Blocked';
    if (!status) return 'Unknown';
    return String(status);
  };
  
  const getStatusColor = (status: number | string | null) => {
    if (status === 0 || status === '0') return 'bg-gray-600'; // Deleted
    if (status === 1 || status === '1') return 'bg-[#00b562]'; // Active
    if (status === 2 || status === '2') return 'bg-orange-500'; // Inactive
    if (status === 3 || status === '3' || status === 10 || status === '10') return 'bg-amber-500'; // Pending
    if (status === 4 || status === '4') return 'bg-red-500'; // Disapproved
    if (status === 5 || status === '5') return 'bg-[#00b562]'; // Approved
    if (status === 6 || status === '6') return 'bg-red-700'; // Blocked
    return 'bg-gray-400';
  }

  const handleApproveClick = (id: number) => {
    setUserToApprove(id);
    setIsApproveModalOpen(true);
  };

  const handleApproveConfirm = async () => {
    if (!userToApprove) return;
    
    try {
      setIsApproving(true);
      const response = await apiClient.patch(`v1/admin/users/${userToApprove}/status`, {
        action: 'approve'
      }, {
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      });
      
      if (response.data?.success || response.status === 200 || response.status === 204) {
        setIsApproveModalOpen(false);
        setUserToApprove(null);
        fetchUsers(currentPage); // Refresh the list
      } else {
        alert(response.data?.message || 'Failed to approve user');
      }
    } catch (err: any) {
      console.error('Error approving user:', err);
      alert(err.response?.data?.message || err.message || 'Failed to approve user');
    } finally {
      setIsApproving(false);
    }
  };

  const handleDisapproveClick = (id: number) => {
    setUserToDisapprove(id);
    setIsDisapproveModalOpen(true);
  };

  const handleDisapproveConfirm = async () => {
    if (!userToDisapprove) return;
    
    try {
      setIsDisapproving(true);
      const response = await apiClient.patch(`v1/admin/users/${userToDisapprove}/status`, {
        action: 'reject'
      }, {
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      });
      
      if (response.data?.success || response.status === 200 || response.status === 204) {
        setIsDisapproveModalOpen(false);
        setUserToDisapprove(null);
        fetchUsers(currentPage);
      } else {
        alert(response.data?.message || 'Failed to disapprove user');
      }
    } catch (err: any) {
      console.error('Error disapproving user:', err);
      alert(err.response?.data?.message || err.message || 'Failed to disapprove user');
    } finally {
      setIsDisapproving(false);
    }
  };

  const handleBlockClick = (id: number) => {
    setUserToBlock(id);
    setIsBlockModalOpen(true);
  };

  const handleBlockConfirm = async () => {
    if (!userToBlock) return;
    
    try {
      setIsBlocking(true);
      const response = await apiClient.patch(`v1/admin/users/${userToBlock}/status`, {
        action: 'block'
      }, {
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      });
      
      if (response.data?.success || response.status === 200 || response.status === 204) {
        setIsBlockModalOpen(false);
        setUserToBlock(null);
        fetchUsers(currentPage);
      } else {
        alert(response.data?.message || 'Failed to block user');
      }
    } catch (err: any) {
      console.error('Error blocking user:', err);
      alert(err.response?.data?.message || err.message || 'Failed to block user');
    } finally {
      setIsBlocking(false);
    }
  };

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

  const handlePageChange = (page: number) => {
    const maxPage = searchQuery ? Math.ceil(filteredUsers.length / 10) || 1 : totalPages;
    if (page >= 1 && page <= maxPage) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex flex-col text-sm">
      {/* User List Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-[15px] font-medium text-gray-800">User List (All)</h2>
            <div className="text-xs text-gray-500">
              Showing {(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, searchQuery ? filteredUsers.length : totalItems)} of <span className="font-semibold text-gray-800">{searchQuery ? filteredUsers.length : totalItems}</span> items.
            </div>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Type to search all pages..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentPage !== 1) setCurrentPage(1);
                }}
                className="w-full sm:w-64 bg-slate-50 border border-gray-200 text-gray-700 text-base rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
              />
            </div>
            <Link 
              to="/user-list-newly-registered" 
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-base font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all whitespace-nowrap"
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
                (searchQuery ? filteredUsers.slice((currentPage - 1) * 10, currentPage * 10) : filteredUsers).map((user, index) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3 text-gray-500">{(currentPage - 1) * 10 + index + 1}</td>
                    <td className="px-4 py-3 text-gray-700">{user.First_Name || '-'}</td>
                    <td className="px-4 py-3 text-gray-700">{user.Last_Name || '-'}</td>
                    <td className="px-4 py-3 text-[#3b82f6] hover:underline cursor-pointer">{user.email || '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{user.Mobile || '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(user.LastLoginTime)}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(user.created_at)}</td>
                    <td className="px-4 py-3">
                      <span className={`${getStatusColor(user.status)} text-white text-xs font-medium px-3 py-1.5 rounded inline-block min-w-[100px] text-center`}>
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
                            setUserToEdit(user.id);
                            setIsEditModalOpen(true);
                          }}
                          className="rounded p-1 hover:bg-purple-50 transition-colors text-purple-500" 
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleApproveClick(user.id)}
                          className="rounded p-1 hover:bg-emerald-50 transition-colors text-emerald-500" 
                          title="Approve"
                        >
                          <Check className="w-4 h-4" strokeWidth={3} />
                        </button>
                        <button 
                          onClick={() => handleDisapproveClick(user.id)}
                          className="rounded p-1 hover:bg-red-50 transition-colors text-red-500" 
                          title="Disapprove"
                        >
                          <XCircle className="w-4 h-4" strokeWidth={2.5} />
                        </button>
                        <button 
                          onClick={() => handleBlockClick(user.id)}
                          className="rounded p-1 hover:bg-orange-50 transition-colors text-orange-500" 
                          title="Block"
                        >
                          <MinusCircle className="w-4 h-4" strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {(searchQuery ? filteredUsers.length > 0 : users.length > 0) && (
          <Pagination 
            currentPage={currentPage}
            totalPages={searchQuery ? Math.ceil(filteredUsers.length / 10) || 1 : totalPages}
            onPageChange={handlePageChange}
            infoText={`Showing ${(currentPage - 1) * 10 + 1} to ${Math.min(currentPage * 10, searchQuery ? filteredUsers.length : totalItems)} of ${searchQuery ? filteredUsers.length : totalItems} entries`}
          />
        )}
      </div>

      <UserViewModal 
        userId={selectedUserId!}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />

      {isEditModalOpen && userToEdit && (
        <UserEditModal 
          userId={userToEdit}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setUserToEdit(null);
          }}
          onSuccess={() => {
            setIsEditModalOpen(false);
            setUserToEdit(null);
            fetchUsers(currentPage);
          }}
        />
      )}

      {/* Approve Confirmation Modal */}
      {isApproveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-center text-gray-900 mb-2">Approve User</h3>
              <p className="text-sm text-center text-gray-500">
                Are you sure you want to approve this user?
              </p>
            </div>
            <div className="flex px-6 py-4 bg-gray-50 gap-3 justify-end">
              <button
                onClick={() => setIsApproveModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none"
                disabled={isApproving}
              >
                Cancel
              </button>
              <button
                onClick={handleApproveConfirm}
                disabled={isApproving}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none disabled:opacity-50 flex items-center gap-2"
              >
                {isApproving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Approving...
                  </>
                ) : (
                  'Approve User'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disapprove Confirmation Modal */}
      {isDisapproveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-center text-gray-900 mb-2">Disapprove User</h3>
              <p className="text-sm text-center text-gray-500">
                Are you sure you want to disapprove this user?
              </p>
            </div>
            <div className="flex px-6 py-4 bg-gray-50 gap-3 justify-end">
              <button
                onClick={() => setIsDisapproveModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none"
                disabled={isDisapproving}
              >
                Cancel
              </button>
              <button
                onClick={handleDisapproveConfirm}
                disabled={isDisapproving}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none disabled:opacity-50 flex items-center gap-2"
              >
                {isDisapproving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Disapproving...
                  </>
                ) : (
                  'Disapprove User'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block Confirmation Modal */}
      {isBlockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-orange-100 rounded-full mb-4">
                <MinusCircle className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-medium text-center text-gray-900 mb-2">Block User</h3>
              <p className="text-sm text-center text-gray-500">
                Are you sure you want to block this user?
              </p>
            </div>
            <div className="flex px-6 py-4 bg-gray-50 gap-3 justify-end">
              <button
                onClick={() => setIsBlockModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none"
                disabled={isBlocking}
              >
                Cancel
              </button>
              <button
                onClick={handleBlockConfirm}
                disabled={isBlocking}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:outline-none disabled:opacity-50 flex items-center gap-2"
              >
                {isBlocking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Blocking...
                  </>
                ) : (
                  'Block User'
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
