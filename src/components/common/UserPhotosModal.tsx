import React, { useState, useEffect } from 'react';
import { X, Loader2, Camera, ImageIcon, User as UserIcon, CheckCircle2, XCircle, Star, Activity, UserPlus, Mail, Phone } from 'lucide-react';
import apiClient from '../../services/apiClient';

interface UserPhotosModalProps {
  userId: number;
  isOpen: boolean;
  onClose: () => void;
  hideApprovalButtons?: boolean;
  statusFilter?: string;
}

const UserPhotosModal: React.FC<UserPhotosModalProps> = ({ userId, isOpen, onClose, hideApprovalButtons = false, statusFilter }) => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    photoId: number | null;
    status: string;
  }>({ isOpen: false, photoId: null, status: '' });
  const [commentAdmin, setCommentAdmin] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserPhotos();
    }
  }, [isOpen, userId]);

  const fetchUserPhotos = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await apiClient.get(`v1/admin/users/${userId}`, {
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      });

      if (response.data.success) {
        setPhotos(response.data.data.photos || []);
        setUserData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load user photos');
      }
    } catch (err: any) {
      console.error('Error fetching user photos:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while fetching photos');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoStatusUpdate = async () => {
    const { photoId, status } = actionModal;
    if (!photoId) return;

    setIsUpdating(true);
    try {
      const actionPath = status === 'Approved' ? 'approve' : 'disapprove';
      const response = await apiClient.patch(`v1/admin/profile-photos/${photoId}/${actionPath}`, {
        commentAdmin
      }, {
        headers: { 'bypass-tunnel-reminder': 'true' }
      });

      if (response.data?.success || response.status === 200 || response.status === 204) {
        setPhotos(prevPhotos => prevPhotos.map(p => 
          p.iPhoto_ID === photoId ? { ...p, eStatus: status } : p
        ));
        setActionModal({ isOpen: false, photoId: null, status: '' });
        setCommentAdmin('');
      } else {
        alert(response.data?.message || 'Failed to update photo status');
      }
    } catch (err: any) {
      console.error('Error updating photo status:', err);
      alert(err.response?.data?.message || err.message || 'Failed to update photo status');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const InfoRow = ({ label, value }: { label: string, value: any }) => {
    let displayValue = 'N/A';
    
    if (value !== null && value !== undefined && value !== '') {
      if (typeof value === 'object' && !Array.isArray(value)) {
        const nameStr = value.Name || value.vName || value.display_name || value.name || value.title;
        if (nameStr !== null && nameStr !== undefined && nameStr !== '') {
          displayValue = String(nameStr);
        } else {
           displayValue = 'N/A';
        }
      } else {  
        displayValue = String(value);
      }
    }
    
    return (
      <div className="flex flex-col mb-3">
        <span className="text-[11px] text-gray-500 mb-1 font-bold uppercase tracking-wider">{label}</span>
        <span className="text-sm text-gray-800 font-medium bg-gray-50 p-2 rounded border border-gray-100 break-words">
          {displayValue}
        </span>
      </div>
    );
  };

  const formatStatus = (status: number | string | null) => {
    switch(status) {
      case 0: return 'Deleted';
      case 1: return 'Active';
      case 2: return 'Inactive';
      case 3: return 'Pending';
      case 4: return 'Disapproved';
      case 5: return 'Approved';
      case 6: return 'Blocked';
      case 10: return 'Pending';
      default: return String(status ?? 'Unknown');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50 rounded-t-xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-lg">
              <Camera className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">User Photos</h2>
              <p className="text-xs text-gray-500">User ID: {userId}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-sm">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-4" />
              <p className="text-sm text-gray-500 font-medium">Loading photos...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm flex flex-col items-center justify-center h-64 border border-red-100 shadow-sm">
              <p className="font-semibold mb-2 text-lg">Error Loading Photos</p>
              <p>{error}</p>
            </div>
          ) : photos.length === 0 && !userData ? (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <ImageIcon className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium text-lg">No data found</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Basic Info Section */}
              {userData && (
                <div className="flex flex-col gap-6">
                  {/* Profile Header */}
                  <div className="flex flex-col md:flex-row gap-6 items-start bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="relative shrink-0 bg-gray-50 rounded-2xl border-4 border-white shadow-md w-32 h-32 flex items-center justify-center overflow-hidden">
                      <img 
                        src={userData.propic || 'https://ui-avatars.com/api/?name=' + (userData.First_Name || 'U') + '+' + (userData.Last_Name || 'S') + '&background=e0e7ff&color=4f46e5&size=150'} 
                        alt="Profile" 
                        className="w-full h-full object-contain drop-shadow-sm"
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-2">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800">
                            {userData.First_Name} {userData.Last_Name}
                          </h3>
                          <p className="text-blue-600 font-medium text-sm">
                            Registration No: {userData.Registration_Number || 'N/A'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold border border-yellow-400 shadow-sm flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" /> Profile {userData.profile_completion}% Complete
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-xs font-semibold border border-blue-200 shadow-sm flex items-center gap-1">
                          <Activity className="w-3 h-3" /> Status: {formatStatus(userData.status)}
                        </span>
                        <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-md text-xs font-semibold border border-purple-200 shadow-sm flex items-center gap-1">
                          <UserPlus className="w-3 h-3" /> Profile For: {userData.Profile_created_for || 'Self'}
                        </span>
                        <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md text-xs font-semibold border border-indigo-200 shadow-sm flex items-center gap-1">
                          <UserIcon className="w-3 h-3" /> Gender: {userData.Gender || 'N/A'}
                        </span>
                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-md text-xs font-semibold border border-emerald-200 shadow-sm flex items-center gap-1">
                          <Mail className="w-3 h-3" /> Email Verified: {userData.eEmailVerifiedStatus}
                        </span>
                        <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-md text-xs font-semibold border border-teal-200 shadow-sm flex items-center gap-1">
                          <Phone className="w-3 h-3" /> Phone Verified: {userData.ePhoneVerifiedStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                    <div className="flex items-center gap-2 mb-4 text-blue-600 font-semibold border-b border-gray-100 pb-2">
                      <UserIcon className="w-4 h-4" /> Basic Information
                    </div>
                    <div className="grid grid-cols-2 gap-4 flex-1">
                      <InfoRow label="Email" value={userData.email} />
                      <InfoRow label="Mobile" value={userData.Mobile} />
                      <InfoRow label="Date of Birth" value={formatDate(userData.DOB)} />
                      <InfoRow label="Time of Birth" value={userData.Time_of_Birth} />
                      <InfoRow label="Age" value={userData.Age} />
                      <InfoRow label="Marital Status" value={userData.iMaritalStatusID || userData.Marital_Status} />
                      <InfoRow label="Blood Group" value={userData.iBloodGroup_ID} />
                      <InfoRow label="Mother Tongue" value={userData.mother_tongue} />
                    </div>
                  </div>
                </div>
              )}

              {/* Photos Grid */}
              {photos.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-gray-500 font-medium">This user hasn't uploaded any photos yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {(() => {
                const filteredPhotos = statusFilter 
                  ? photos.filter((p: any) => p.eStatus?.toLowerCase() === statusFilter.toLowerCase())
                  : photos;

                const latestProfilePhotoId = filteredPhotos.length > 0 
                  ? Math.max(0, ...filteredPhotos.filter((p: any) => p.Is_Profile_Photo === 'YES').map((p: any) => p.iPhoto_ID || 0)) 
                  : 0;

                return filteredPhotos.map((photo: any) => (
                <div key={photo.iPhoto_ID} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-80 bg-gray-100/50 flex items-center justify-center overflow-hidden">
                    <img 
                      src={
                        (() => {
                          let url = photo.File_Name;
                          if (!url || url === 'null' || url === 'undefined') return 'https://placehold.co/400x400/f3f4f6/a1a1aa?text=No+Photo';
                          return typeof url === 'string' ? url.replace(/%22/g, '').replace(/"/g, '') : url;
                        })()
                      } 
                      alt="User upload" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/f3f4f6/a1a1aa?text=Image+Error';
                      }}
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm ${
                        photo.eStatus === 'Approved' ? 'bg-emerald-500/90 text-white' : 
                        photo.eStatus === 'Pending' ? 'bg-amber-500/90 text-white' : 
                        'bg-red-500/90 text-white'
                      }`}>
                        {photo.eStatus}
                      </span>
                    </div>

                    {/* Profile Photo Badge */}
                    {photo.iPhoto_ID === latestProfilePhotoId && (
                      <div className="absolute top-3 left-3">
                        <span className="text-xs font-bold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm bg-blue-500/90 text-white flex items-center gap-1">
                          <UserIcon className="w-3 h-3" /> Profile
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 bg-white">
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                      <span>ID: {photo.iPhoto_ID}</span>
                      <span>Uploaded: {new Date(photo.dtCreated).toLocaleDateString()}</span>
                    </div>
                    
                    {!hideApprovalButtons && photo.eStatus === 'Pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setActionModal({ isOpen: true, photoId: photo.iPhoto_ID, status: 'Approved' });
                            setCommentAdmin('');
                          }}
                          className="flex-1 bg-emerald-500 text-white py-1.5 rounded text-xs font-medium hover:bg-emerald-600 transition-colors flex justify-center items-center gap-1"
                          title="Approve Photo"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => {
                            setActionModal({ isOpen: true, photoId: photo.iPhoto_ID, status: 'Rejected' });
                            setCommentAdmin('');
                          }}
                          className="flex-1 bg-red-500 text-white py-1.5 rounded text-xs font-medium hover:bg-red-600 transition-colors flex justify-center items-center gap-1"
                          title="Disapprove Photo"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Disapprove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                ))
              })()}
            </div>
          )}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white rounded-b-xl flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="px-8 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>

      {/* Action Comment Modal */}
      {actionModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className={`p-4 text-white font-semibold flex justify-between items-center ${actionModal.status === 'Approved' ? 'bg-emerald-500' : 'bg-red-500'}`}>
              <span>{actionModal.status === 'Approved' ? 'Approve Photo' : 'Disapprove Photo'}</span>
              <button onClick={() => setActionModal({ isOpen: false, photoId: null, status: '' })} className="text-white hover:text-white/80 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin Comment (Optional)</label>
              <textarea
                value={commentAdmin}
                onChange={(e) => setCommentAdmin(e.target.value)}
                placeholder={actionModal.status === 'Approved' ? "e.g. Looks good" : "e.g. Photo is blurry or inappropriate"}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
              />
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => setActionModal({ isOpen: false, photoId: null, status: '' })}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button 
                onClick={handlePhotoStatusUpdate}
                disabled={isUpdating}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors flex items-center gap-2 ${actionModal.status === 'Approved' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'} disabled:opacity-50`}
              >
                {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirm {actionModal.status === 'Rejected' ? 'Disapprove' : 'Approve'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPhotosModal;
