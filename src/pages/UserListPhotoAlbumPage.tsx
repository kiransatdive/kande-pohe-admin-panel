import React, { useState, useEffect } from 'react';
import { Eye, User, Loader2 } from 'lucide-react';
import Pagination from '../components/common/Pagination';
import UserPhotosModal from '../components/common/UserPhotosModal';
import apiClient from '../services/apiClient';

interface PhotoRecord {
  iPhoto_ID: number;
  iUser_ID: number;
  File_Name: string | null;
  Is_Profile_Photo: string | null;
  eStatus: string | null;
  dtCreated: string | null;
  First_Name: string | null;
  Last_Name: string | null;
  email: string | null;
}

const UserListPhotoAlbumPage: React.FC = () => {
  const [users, setUsers] = useState<PhotoRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isPhotosModalOpen, setIsPhotosModalOpen] = useState(false);

  const fetchPhotos = async (page: number, currentSearch = searchQuery) => {
    setIsLoading(true);
    setError('');
    const isSearching = currentSearch.trim().length > 0;
    try {
      const response = await apiClient.get('v1/admin/profile-photos/pending', {
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
        setError('Failed to fetch pending profile photos');
      }
    } catch (err: any) {
      console.error('Error fetching pending photos:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while fetching photos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPhotos(searchQuery ? 1 : currentPage, searchQuery);
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
      (user.iUser_ID?.toString() || '').includes(query) ||
      (user.First_Name || '').toLowerCase().includes(query) ||
      (user.Last_Name || '').toLowerCase().includes(query) ||
      (user.email || '').toLowerCase().includes(query) ||
      (user.eStatus || '').toLowerCase().includes(query)
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
            <h2 className="text-[15px] font-medium text-gray-800">User List(Profile Photo)</h2>
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
              <p className="text-gray-500 font-medium">Loading photos...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-red-500 mb-2 font-semibold">Error</div>
              <p className="text-gray-500">{error}</p>
              <button 
                onClick={() => fetchPhotos(currentPage)}
                className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              No pending photos found matching "{searchQuery}".
            </div>
          ) : (
            <table className="w-full text-left text-xs border border-gray-100">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-4 py-3 font-semibold text-gray-500 w-12">#</th>
                  <th className="px-4 py-3 font-semibold text-gray-500">First Name</th>
                  <th className="px-4 py-3 font-semibold text-gray-500">Last Name</th>
                  <th className="px-4 py-3 font-semibold text-gray-500">Email</th>
                  <th className="px-4 py-3 font-semibold text-gray-500">Profile Pic</th>
                  <th className="px-4 py-3 font-semibold text-gray-500">Last Login Date</th>
                  <th className="px-4 py-3 font-semibold text-gray-500">Date of registration</th>
                  <th className="px-4 py-3 font-semibold text-gray-500">Status Of Profile Pic</th>
                  <th className="px-4 py-3 font-semibold text-gray-500 text-right w-12"></th>
                </tr>
              </thead>
              <tbody>
                {(searchQuery ? filteredUsers.slice((currentPage - 1) * 10, currentPage * 10) : filteredUsers).map((user, index) => (
                  <tr key={user.iPhoto_ID} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3 text-gray-500">{(currentPage - 1) * 10 + index + 1}</td>
                    <td className="px-4 py-3 text-gray-700 font-medium">{user.First_Name || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-700 font-medium">{user.Last_Name || 'N/A'}</td>
                    <td className="px-4 py-3 text-[#3b82f6] hover:underline cursor-pointer">{user.email || 'N/A'}</td>
                    <td className="px-4 py-3">
                      {user.File_Name ? (
                        <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center border-2 border-gray-200 overflow-hidden">
                          <img 
                            src={user.File_Name} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback if image fails to load
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.target as HTMLImageElement).parentElement?.classList.add('flex', 'items-center', 'justify-center');
                              const icon = document.createElement('div');
                              icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user w-8 h-8 text-gray-300"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
                              (e.target as HTMLImageElement).parentElement?.appendChild(icon.firstChild as Node);
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center border-2 border-gray-200">
                          <User className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">N/A</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(user.dtCreated)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-medium px-4 py-1.5 rounded text-white ${
                        user.eStatus?.toLowerCase() === 'approve' ? 'bg-[#00b562]' :
                        user.eStatus?.toLowerCase() === 'pending' ? 'bg-amber-500' :
                        user.eStatus?.toLowerCase() === 'reject' ? 'bg-red-500' :
                        'bg-gray-400'
                      }`}>
                        {user.eStatus || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end">
                        <button 
                          onClick={() => {
                            setSelectedUserId(user.iUser_ID);
                            setIsPhotosModalOpen(true);
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

      <UserPhotosModal
        isOpen={isPhotosModalOpen}
        onClose={() => setIsPhotosModalOpen(false)}
        userId={selectedUserId || 0}
      />
    </div>
  );
};

export default UserListPhotoAlbumPage;
