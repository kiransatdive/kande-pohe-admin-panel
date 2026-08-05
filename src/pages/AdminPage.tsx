import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, Search } from 'lucide-react';
import apiClient from '../services/apiClient';

interface Admin {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
}

const AdminPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createAdminData, setCreateAdminData] = useState({
    vFirstName: '',
    vLastName: '',
    vEmail: '',
    vPassword: '',
    eStatus: 'Active'
  });
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewAdminData, setViewAdminData] = useState<Admin | null>(null);
  const [isViewing, setIsViewing] = useState(false);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editAdminData, setEditAdminData] = useState<any>({
    id: 0,
    vFirstName: '',
    vLastName: '',
    vEmail: '',
    vPassword: '',
    eStatus: 'Active'
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState('');
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const adminDataString = localStorage.getItem('adminData');
  const adminData = adminDataString ? JSON.parse(adminDataString) : null;
  const adminEmail = adminData?.email || adminData?.vEmail || '';

  useEffect(() => {
    if (adminEmail === 'superAdmin@example.com') {
      fetchAdmins();
    }
  }, []);

  if (adminEmail !== 'superAdmin@example.com') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-sm">You do not have permission to view this page.</p>
      </div>
    );
  }

  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await apiClient.get('v1/admin/admins', {
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      });
      
      if (response.data.success) {
        const transformedData = response.data.data.map((item: any) => ({
          id: item.iAdminId,
          firstName: item.vFirstName,
          lastName: item.vLastName,
          email: item.vEmail,
          status: item.eStatus,
        }));
        setAdmins(transformedData);
      } else {
        setError('Failed to fetch admin list.');
      }
    } catch (err: any) {
      console.error('Error fetching admins:', err);
      setError(err.response?.data?.message || err.message || 'Could not connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAdmin = async (id: number) => {
    try {
      setIsViewing(true);
      setIsViewModalOpen(true);
      const response = await apiClient.get(`v1/admin/admins/${id}`, {
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      });
      
      if (response.data.success) {
        const item = response.data.data;
        setViewAdminData({
          id: item.iAdminId,
          firstName: item.vFirstName,
          lastName: item.vLastName,
          email: item.vEmail,
          status: item.eStatus,
        });
      }
    } catch (err) {
      console.error('Error fetching admin details:', err);
    } finally {
      setIsViewing(false);
    }
  };

  const handleOpenCreateModal = () => {
    setCreateAdminData({
      vFirstName: '',
      vLastName: '',
      vEmail: '',
      vPassword: '',
      eStatus: 'Active'
    });
    setCreateError('');
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async () => {
    try {
      setIsCreating(true);
      setCreateError('');
      const response = await apiClient.post('v1/admin/admins', createAdminData, {
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      });
      
      if (response.data.success) {
        setIsCreateModalOpen(false);
        fetchAdmins(); // Refresh the list
      } else {
        setCreateError(response.data.message || 'Failed to create admin');
      }
    } catch (err: any) {
      console.error('Error creating admin:', err);
      setCreateError(err.response?.data?.message || err.message || 'Failed to create admin');
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditClick = (admin: Admin) => {
    setEditAdminData({
      id: admin.id,
      vFirstName: admin.firstName,
      vLastName: admin.lastName,
      vEmail: admin.email,
      vPassword: '', // Don't pre-fill password; only send it if user types a new one
      eStatus: admin.status
    });
    setEditError('');
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      setIsUpdating(true);
      setEditError('');
      const payload: any = {
        vFirstName: editAdminData.vFirstName,
        vLastName: editAdminData.vLastName,
        vEmail: editAdminData.vEmail,
        eStatus: editAdminData.eStatus
      };
      
      // Only include password in request if the user typed something
      if (editAdminData.vPassword && editAdminData.vPassword.trim() !== '') {
        payload.vPassword = editAdminData.vPassword;
      }
      
      const response = await apiClient.put(`v1/admin/admins/${editAdminData.id}`, payload, {
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      });
      
      if (response.data.success) {
        setIsEditModalOpen(false);
        fetchAdmins(); // Refresh the list with updated data
      } else {
        setEditError(response.data.message || 'Failed to update admin');
      }
    } catch (err: any) {
      console.error('Error updating admin:', err);
      setEditError(err.response?.data?.message || err.message || 'Failed to update admin');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setAdminToDelete(id);
    setDeleteError('');
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!adminToDelete) return;
    
    try {
      setIsDeleting(true);
      setDeleteError('');
      const response = await apiClient.delete(`v1/admin/admins/${adminToDelete}`, {
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      });
      
      if (response.data.success) {
        setIsDeleteModalOpen(false);
        setAdminToDelete(null);
        fetchAdmins(); // Refresh the list after successful deletion
      } else {
        setDeleteError(response.data.message || 'Failed to delete admin');
      }
    } catch (err: any) {
      console.error('Error deleting admin:', err);
      setDeleteError(err.response?.data?.message || err.message || 'Failed to delete admin');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredAdmins = admins.filter(admin => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (admin.id?.toString() || '').includes(searchLower) ||
      (admin.firstName || '').toLowerCase().includes(searchLower) ||
      (admin.lastName || '').toLowerCase().includes(searchLower) ||
      (admin.email || '').toLowerCase().includes(searchLower) ||
      (admin.status || '').toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="flex flex-col text-sm">

      {/* Admin Table Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h2 className="text-[15px] font-medium text-gray-800">Admin Table List</h2>
          <div className="flex items-center gap-4">
            {/* Unified Search Box */}
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
              onClick={handleOpenCreateModal}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Create Admin
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-3 font-medium text-gray-500 w-12">#</th>
                <th className="px-6 py-3 font-medium text-gray-500">First Name</th>
                <th className="px-6 py-3 font-medium text-gray-500">Last Name</th>
                <th className="px-6 py-3 font-medium text-gray-500">Email</th>
                <th className="px-6 py-3 font-medium text-gray-500 w-32">Status</th>
                <th className="px-6 py-3 font-medium text-gray-500 text-right w-24"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="animate-spin h-6 w-6 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading admins...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-red-500 bg-red-50/50">
                    {error}
                  </td>
                </tr>
              ) : filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    {admins.length === 0 ? "No admins found." : "No matching admins found."}
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin, index) => (
                  <tr key={admin.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                    <td className="px-6 py-4 text-gray-700">{admin.firstName}</td>
                    <td className="px-6 py-4 text-gray-700">{admin.lastName}</td>
                    <td className="px-6 py-4 text-gray-700">{admin.email}</td>
                    <td className="px-6 py-4">
                      <span className={`text-white text-[11px] font-medium px-2.5 py-1 rounded ${admin.status.toLowerCase() === 'active' ? 'bg-[#00b562]' : 'bg-red-500'}`}>
                        {admin.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 text-gray-400">
                        <button onClick={() => handleViewAdmin(admin.id)} className="hover:text-blue-500 transition-colors" title="View"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => handleEditClick(admin)} className="hover:text-emerald-500 transition-colors" title="Edit"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteClick(admin.id)} className="hover:text-red-500 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Admin Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl border-t-[3px] border-blue-400 overflow-hidden">
            <div className="flex justify-end p-2">
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
              
              </button>
            </div>
            
            <div className="px-6 pb-6">
              <div className="space-y-4">
                {createError && (
                  <div className="text-red-500 text-sm">{createError}</div>
                )}
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">First Name</label>
                  <input 
                    type="text" 
                    value={createAdminData.vFirstName}
                    onChange={(e) => setCreateAdminData({...createAdminData, vFirstName: e.target.value})}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400" 
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Last Name</label>
                  <input 
                    type="text" 
                    value={createAdminData.vLastName}
                    onChange={(e) => setCreateAdminData({...createAdminData, vLastName: e.target.value})}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400" 
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Email</label>
                  <input 
                    type="email" 
                    value={createAdminData.vEmail}
                    onChange={(e) => setCreateAdminData({...createAdminData, vEmail: e.target.value})}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400" 
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Password</label>
                  <input 
                    type="password" 
                    value={createAdminData.vPassword}
                    onChange={(e) => setCreateAdminData({...createAdminData, vPassword: e.target.value})}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400" 
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Status</label>
                  <select 
                    value={createAdminData.eStatus}
                    onChange={(e) => setCreateAdminData({...createAdminData, eStatus: e.target.value})}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-400"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                
                <div className="pt-3 flex gap-3">
                  <button 
                    onClick={handleCreateSubmit}
                    disabled={isCreating}
                    className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-6 py-2 rounded text-sm font-medium transition-colors"
                  >
                    {isCreating ? 'Creating...' : 'Create'}
                  </button>
                  <button onClick={() => setIsCreateModalOpen(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded text-sm font-medium transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Admin Modal */}
      {isViewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md border-t-[3px] border-blue-400 overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">Admin Details</h3>
              <button onClick={() => setIsViewModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="p-6">
              {isViewing ? (
                <div className="flex justify-center items-center py-10">
                  <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : viewAdminData ? (
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-gray-50 pb-3">
                    <span className="text-gray-500 font-medium">Database ID</span>
                    <span className="text-gray-800 font-semibold">{viewAdminData.id}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-3">
                    <span className="text-gray-500 font-medium">First Name</span>
                    <span className="text-gray-800 font-semibold">{viewAdminData.firstName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-3">
                    <span className="text-gray-500 font-medium">Last Name</span>
                    <span className="text-gray-800 font-semibold">{viewAdminData.lastName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-3">
                    <span className="text-gray-500 font-medium">Email Address</span>
                    <span className="text-gray-800 font-semibold">{viewAdminData.email}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-gray-500 font-medium">Account Status</span>
                    <span className={`text-white text-[11px] font-medium px-2.5 py-1 rounded ${viewAdminData.status.toLowerCase() === 'active' ? 'bg-[#00b562]' : 'bg-red-500'}`}>
                      {viewAdminData.status}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-red-500">Failed to load admin details.</div>
              )}
              
              <div className="mt-8 flex justify-end">
                <button onClick={() => setIsViewModalOpen(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded text-sm font-medium transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Admin Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl border-t-[3px] border-emerald-400 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">Edit Admin</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="px-6 pb-6 pt-4">
              <div className="space-y-4">
                {editError && (
                  <div className="text-red-500 text-sm">{editError}</div>
                )}
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">First Name</label>
                  <input 
                    type="text" 
                    value={editAdminData.vFirstName}
                    onChange={(e) => setEditAdminData({...editAdminData, vFirstName: e.target.value})}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-400" 
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Last Name</label>
                  <input 
                    type="text" 
                    value={editAdminData.vLastName}
                    onChange={(e) => setEditAdminData({...editAdminData, vLastName: e.target.value})}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-400" 
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Email</label>
                  <input 
                    type="email" 
                    value={editAdminData.vEmail}
                    onChange={(e) => setEditAdminData({...editAdminData, vEmail: e.target.value})}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-400" 
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Password <span className="text-gray-400 font-normal">(Leave blank to keep unchanged)</span></label>
                  <input 
                    type="password" 
                    placeholder="Enter new password"
                    value={editAdminData.vPassword}
                    onChange={(e) => setEditAdminData({...editAdminData, vPassword: e.target.value})}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-400" 
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Status</label>
                  <select 
                    value={editAdminData.eStatus}
                    onChange={(e) => setEditAdminData({...editAdminData, eStatus: e.target.value})}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                
                <div className="pt-3 flex gap-3">
                  <button 
                    onClick={handleEditSubmit} 
                    disabled={isUpdating}
                    className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-6 py-2 rounded text-sm font-medium transition-colors"
                  >
                    {isUpdating ? 'Updating...' : 'Save Changes'}
                  </button>
                  <button onClick={() => setIsEditModalOpen(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded text-sm font-medium transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Admin Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm border-t-[3px] border-red-500 overflow-hidden text-center p-6">
            <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Admin</h3>
            <p className="text-gray-500 text-sm mb-6">Are you sure you want to delete this admin? This action cannot be undone.</p>
            {deleteError && (
              <div className="text-red-500 text-sm mb-4 text-center">{deleteError}</div>
            )}
            
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)} 
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded text-sm font-medium transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm} 
                className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-6 py-2 rounded text-sm font-medium transition-colors"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
