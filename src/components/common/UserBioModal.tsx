import React, { useState, useEffect } from 'react';
import { X, Loader2, User as UserIcon, CheckCircle2, XCircle, FileText, AlertTriangle, Star, Activity, UserPlus, Mail, Phone } from 'lucide-react';
import apiClient from '../../services/apiClient';

interface UserBioModalProps {
  userId: number;
  isOpen: boolean;
  onClose: () => void;
  hideApprovalButtons?: boolean;
}

const UserBioModal: React.FC<UserBioModalProps> = ({ userId, isOpen, onClose, hideApprovalButtons = false }) => {
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isBioHandling, setIsBioHandling] = useState(false);
  const [bioStatus, setBioStatus] = useState<string | null>(null);

  useEffect(() => {
    if (userData) {
      setBioStatus(userData.eStatusInOwnWord || 'Pending');
    }
  }, [userData]);

  const handleBioStatusUpdate = async (status: 'Approve' | 'Reject') => {
    setIsBioHandling(true);
    try {
      const actionPath = status === 'Approve' ? 'approve' : 'disapprove';
      const response = await apiClient.patch(`v1/admin/about-yourself/${userId}/${actionPath}`, {}, {
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data?.success || response.status === 200 || response.status === 204) {
        setBioStatus(status);
      } else {
        alert(response.data?.message || `Failed to ${actionPath} bio`);
      }
    } catch (err: any) {
      console.error(`Error updating bio status:`, err);
      alert(err.response?.data?.message || err.message || `Failed to update bio status`);
    } finally {
      setIsBioHandling(false);
    }
  };

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserDetails();
    }
  }, [isOpen, userId]);

  const fetchUserDetails = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await apiClient.get(`v1/admin/users/${userId}`, {
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      });

      if (response.data.success) {
        setUserData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load user details');
      }
    } catch (err: any) {
      console.error('Error fetching user details:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while fetching details');
    } finally {
      setIsLoading(false);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50 rounded-t-xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <UserIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">User Bio Details</h2>
              <p className="text-xs text-gray-500">Database ID: {userId}</p>
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
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
              <p className="text-sm text-gray-500 font-medium">Loading details...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm flex flex-col items-center justify-center h-64 border border-red-100">
              <AlertTriangle className="w-8 h-8 mb-2" />
              <p className="font-semibold mb-1 text-lg">Error</p>
              <p>{error}</p>
            </div>
          ) : userData ? (
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
              
              {/* Bio Section */}
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-4 border-b border-blue-100 pb-2">
                  <div className="flex items-center gap-2 text-blue-800 font-bold">
                    <FileText className="w-5 h-5" /> About Me (Bio)
                  </div>
                  
                  {/* Status Badge */}
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-sm ${
                    bioStatus === 'Approve' ? 'bg-emerald-500 text-white' : 
                    bioStatus === 'Pending' ? 'bg-amber-500 text-white' : 
                    'bg-red-500 text-white'
                  }`}>
                    {bioStatus}
                  </span>
                </div>
                
                <div className="text-gray-800 leading-relaxed italic bg-white p-5 rounded-lg border border-blue-50 shadow-inner">
                  "{userData.vFirstThingNoticeAboutMe || userData.tYourSelf || 'No bio provided.'}"
                </div>

                {/* Action Buttons */}
                {!hideApprovalButtons && bioStatus === 'Pending' && (
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => handleBioStatusUpdate('Approve')}
                      disabled={isBioHandling}
                      className="flex-1 bg-emerald-500 text-white py-2.5 rounded-lg font-semibold hover:bg-emerald-600 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                    >
                      {isBioHandling ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      Approve Bio
                    </button>
                    <button
                      onClick={() => handleBioStatusUpdate('Reject')}
                      disabled={isBioHandling}
                      className="flex-1 bg-red-500 text-white py-2.5 rounded-lg font-semibold hover:bg-red-600 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                    >
                      {isBioHandling ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                      Disapprove Bio
                    </button>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 font-medium">No user details found.</p>
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
    </div>
  );
};

export default UserBioModal;
