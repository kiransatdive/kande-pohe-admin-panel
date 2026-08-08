import React, { useState, useEffect } from 'react';
import { Eye, Loader2 } from 'lucide-react';
import Pagination from '../components/common/Pagination';
import UserBioModal from '../components/common/UserBioModal';
import apiClient from '../services/apiClient';

interface User {
  id: number;
  First_Name: string | null;
  Last_Name: string | null;
  email: string | null;
  tYourSelf: string | null;
  LastLoginTime: number | string | null;
  created_at: number | string | null;
  eStatusInOwnWord: string | null;
}

const UserListBioPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const fetchUsers = async (page: number, currentSearch = searchQuery) => {
    setIsLoading(true);
    setError('');
    const isSearching = currentSearch.trim().length > 0;
    try {
      const response = await apiClient.get('v1/admin/about-yourself/pending', {
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

  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (user.id?.toString() || '').includes(query) ||
      (user.First_Name || '').toLowerCase().includes(query) ||
      (user.Last_Name || '').toLowerCase().includes(query) ||
      (user.email || '').toLowerCase().includes(query) ||
      (user.eStatusInOwnWord || '').toLowerCase().includes(query)
    );
  });

  const handlePageChange = (page: number) => {
    const maxPage = searchQuery ? Math.ceil(filteredUsers.length / 10) || 1 : totalPages;
    if (page >= 1 && page <= maxPage) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex flex-col text-sm w-full">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-[15px] font-medium text-gray-800">User List(In Own Word)</h2>
            <div className="text-xs text-gray-500">
              Showing {(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, searchQuery ? filteredUsers.length : totalItems)} of <span className="font-semibold text-gray-800">{searchQuery ? filteredUsers.length : totalItems}</span> items.
            </div>
          </div>
          <div className="flex items-center gap-4">
            </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
              <p className="text-gray-500 font-medium">Loading users...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-red-500 mb-2 font-semibold">Error</div>
              <p className="text-gray-500">{error}</p>
              <button 
                onClick={() => fetchUsers(currentPage)}
                className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              No users found matching "{searchQuery}".
            </div>
          ) : (
            <table className="w-full text-left text-xs border border-gray-100">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-4 py-3 font-semibold text-gray-500 w-12">#</th>
                  <th className="px-4 py-3 font-semibold text-gray-500">First Name</th>
                  <th className="px-4 py-3 font-semibold text-gray-500">Last Name</th>
                  <th className="px-4 py-3 font-semibold text-gray-500">Email</th>
                  <th className="px-4 py-3 font-semibold text-gray-500">About Yourself</th>
                  <th className="px-4 py-3 font-semibold text-gray-500">Last Login Date</th>
                  <th className="px-4 py-3 font-semibold text-gray-500">Date of registration</th>
                  <th className="px-4 py-3 font-semibold text-gray-500">Status In Own Word</th>
                  <th className="px-4 py-3 font-semibold text-gray-500 text-right w-12"></th>
                </tr>
              </thead>
              <tbody>
                {(searchQuery ? filteredUsers.slice((currentPage - 1) * 10, currentPage * 10) : filteredUsers).map((user, index) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3 text-gray-500">{(currentPage - 1) * 10 + index + 1}</td>
                    <td className="px-4 py-3 text-gray-700 font-medium">{user.First_Name || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-700 font-medium">{user.Last_Name || 'N/A'}</td>
                    <td className="px-4 py-3 text-[#3b82f6] hover:underline cursor-pointer">{user.email || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-600 truncate max-w-[150px]">{user.tYourSelf || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(user.LastLoginTime)}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(user.created_at)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-medium px-4 py-1.5 rounded text-white ${
                        user.eStatusInOwnWord?.toLowerCase() === 'approve' ? 'bg-[#00b562]' :
                        user.eStatusInOwnWord?.toLowerCase() === 'pending' ? 'bg-amber-500' :
                        user.eStatusInOwnWord?.toLowerCase() === 'reject' ? 'bg-red-500' :
                        'bg-gray-400'
                      }`}>
                        {user.eStatusInOwnWord || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end">
                        <button 
                          onClick={() => {
                            setSelectedUserId(user.id);
                            setIsViewModalOpen(true);
                          }}
                          className="text-[#3b82f6] rounded p-1 hover:bg-blue-50 transition-colors" 
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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

      <UserBioModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        userId={selectedUserId || 0}
      />
    </div>
  );
};

export default UserListBioPage;
