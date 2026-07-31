import React, { useState, useEffect } from 'react';
import { X, Loader2, Camera, ImageIcon, User as UserIcon } from 'lucide-react';
import apiClient from '../../services/apiClient';

interface UserPhotosModalProps {
  userId: number;
  isOpen: boolean;
  onClose: () => void;
}

const UserPhotosModal: React.FC<UserPhotosModalProps> = ({ userId, isOpen, onClose }) => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  if (!isOpen) return null;

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
          ) : photos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <ImageIcon className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium text-lg">No photos found</p>
              <p className="text-sm text-gray-400">This user hasn't uploaded any photos yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {photos.map((photo) => (
                <div key={photo.iPhoto_ID} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-80 bg-gray-100/50 flex items-center justify-center overflow-hidden p-2">
                    <img 
                      src={photo.File_Name} 
                      alt="User upload" 
                      className="w-full h-full object-contain drop-shadow-sm rounded"
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
                    {photo.Is_Profile_Photo === 'YES' && (
                      <div className="absolute top-3 left-3">
                        <span className="text-xs font-bold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm bg-blue-500/90 text-white flex items-center gap-1">
                          <UserIcon className="w-3 h-3" /> Profile
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 bg-white">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>ID: {photo.iPhoto_ID}</span>
                      <span>Uploaded: {new Date(photo.dtCreated).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white rounded-b-xl flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="px-8 py-2.5 bg-gray-800 text-white text-sm font-semibold rounded-lg hover:bg-gray-900 transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPhotosModal;
