import React, { useState, useEffect } from 'react';
import { X, Loader2, User as UserIcon, MapPin, Heart, Camera, GraduationCap, Users, Star, Settings, Activity, UserPlus, Mail, Phone } from 'lucide-react';
import apiClient from '../../services/apiClient';

interface UserViewModalProps {
  userId: number;
  isOpen: boolean;
  onClose: () => void;
}

const UserViewModal: React.FC<UserViewModalProps> = ({ userId, isOpen, onClose }) => {
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [subCommunities, setSubCommunities] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserDetails();
      fetchSubCommunities();
    }
  }, [isOpen, userId]);

  const fetchSubCommunities = async () => {
    try {
      const response = await apiClient.get('v1/public/master/master-community-sub', {
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data && response.data.success) {
        setSubCommunities(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching sub communities:', err);
    }
  };

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
      setError(err.response?.data?.message || err.message || 'An error occurred');
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

  const getSubCommunityName = (id: any) => {
    if (id === null || id === undefined || id === '') return 'N/A';
    if (typeof id === 'object' && !Array.isArray(id)) {
       return id.Name || id.name || id.vName || id.display_name || 'N/A';
    }
    const match = subCommunities.find(s => String(s.id ?? s.ID ?? s.iSubCommunity_ID) === String(id));
    return match ? (match.display_name || match.name || match.vName) : id;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50 rounded-t-xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <UserIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">User Details</h2>
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
              <p className="text-sm text-gray-500 font-medium">Loading full details for user {userId}...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm flex flex-col items-center justify-center h-64 border border-red-100 shadow-sm">
              <p className="font-semibold mb-2 text-lg">Error Loading Data</p>
              <p>{error}</p>
            </div>
          ) : userData ? (
            <div className="space-y-6">
              {/* Profile Header section */}
              <div className="flex flex-col md:flex-row gap-6 items-start bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="relative shrink-0 bg-gray-50 rounded-2xl border-4 border-white shadow-md w-32 h-32 flex items-center justify-center overflow-hidden">
                  <img 
                    src={userData.propic || 'https://ui-avatars.com/api/?name=' + (userData.First_Name || 'U') + '+' + (userData.Last_Name || 'S') + '&background=e0e7ff&color=4f46e5&size=150'} 
                    alt="Profile" 
                    className="w-full h-full object-contain drop-shadow-sm"
                  />
                  {/* {userData.photos?.length > 0 && (
                    <div className="absolute bottom-1 right-1 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border-2 border-white">
                      <Camera className="w-3 h-3" /> {userData.photos.length}
                    </div>
                  )} */}
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
                      {/* <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold border border-gray-200">
                        Step {userData.completed_step}
                      </span> */}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-xs font-semibold border border-blue-200 shadow-sm flex items-center gap-1">
                      <Activity className="w-3 h-3" /> Status: {userData.status === 1 ? 'Active' : userData.status === 10 ? 'Pending' : userData.status}
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
                  
                  {(userData.vFirstThingNoticeAboutMe || userData.tYourSelf) && (
                    <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100/50 mt-4">
                      <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <UserIcon className="w-3 h-3" /> About Me
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed italic">
                        "{userData.vFirstThingNoticeAboutMe || userData.tYourSelf}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Grid sections - 1 column vertically stacked */}
              <div className="flex flex-col gap-6">
                
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

                {/* Education & Career */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                  <div className="flex items-center gap-2 mb-4 text-orange-600 font-semibold border-b border-gray-100 pb-2">
                    <GraduationCap className="w-4 h-4" /> Education & Career
                  </div>
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <InfoRow label="Education Level" value={userData.iEducationLevelID} />
                    <InfoRow label="Education Field" value={userData.iEducationFieldID} />
                    <InfoRow label="Degree Name" value={userData.degreeName} />
                    <InfoRow label="Working With" value={userData.iWorkingWithID} />
                    <InfoRow label="Working As" value={userData.iWorkingAsID} />
                    <InfoRow label="Annual Income" value={userData.iAnnualIncomeID} />
                  </div>
                </div>

                {/* Family Details */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                  <div className="flex items-center gap-2 mb-4 text-indigo-600 font-semibold border-b border-gray-100 pb-2">
                    <Users className="w-4 h-4" /> Family Details
                  </div>
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <InfoRow label="Family Type" value={userData.vFamilyType} />
                    <InfoRow label="Affluence Level" value={userData.vFamilyAffluenceLevel} />
                    <InfoRow label="Father Status" value={userData.iFatherStatusID} />
                    <InfoRow label="Mother Status" value={userData.iMotherStatusID} />
                    <InfoRow label="Brothers" value={userData.nob} />
                    <InfoRow label="Sisters" value={userData.nos} />
                    {/* <InfoRow label="Parents Residing" value={userData.vParentsResiding || userData.parentLivingSeprate} /> */}
                    {/* <InfoRow label="Family Income" value={userData.iFamilyAnnualIncomeID} /> */}
                    <InfoRow label="Inter-caste Parents" value={userData.vParentInterCasteMarriage} />
                    <InfoRow label="Parents Living Separately" value={userData.vParentsLivingSeparately} />
                  </div>
                </div>

                {/* Physical & Lifestyle */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                  <div className="flex items-center gap-2 mb-4 text-emerald-600 font-semibold border-b border-gray-100 pb-2">
                    <Heart className="w-4 h-4" /> Physical & Lifestyle
                  </div>
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <InfoRow label="Height" value={userData.iHeightID} />
                    <InfoRow label="Weight" value={userData.weight ? `${userData.weight} kg` : 'N/A'} />
                    <InfoRow label="Skin Tone" value={userData.vSkinTone} />
                    <InfoRow label="Body Type" value={userData.vBodyType} />
                    <InfoRow label="Diet" value={userData.vDiet} />
                    <InfoRow label="Drink" value={userData.vDrink} />
                    <InfoRow label="Smoke" value={userData.vSmoke} />
                    <InfoRow label="Spectacles" value={userData.vSpectaclesLens} />
                    <InfoRow label="Disability" value={userData.vDisability} />
                    <InfoRow label="Pets" value={userData.vPets} />
                  </div>
                </div>

                {/* Background & Location */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                  <div className="flex items-center gap-2 mb-4 text-purple-600 font-semibold border-b border-gray-100 pb-2">
                    <MapPin className="w-4 h-4" /> Background & Location
                  </div>
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <InfoRow label="Birth Place" value={userData.Birth_Place} />
                    <InfoRow label="Religion" value={userData.iReligion_ID} />
                    <InfoRow label="Community" value={userData.iCommunity_ID} />
                    <InfoRow label="Sub Community" value={getSubCommunityName(userData.iSubCommunity_ID)} />
                    <InfoRow label="Country" value={userData.iCountryId} />
                    <InfoRow label="State" value={userData.iStateId} />
                    <InfoRow label="City" value={userData.iCityId} />
                    <InfoRow label="Area Name" value={userData.vAreaName} />
                    <InfoRow label="Native Place" value={userData.vNativePlaceCA} />
                  </div>
                </div>

                {/* Astrology Details */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                  <div className="flex items-center gap-2 mb-4 text-amber-500 font-semibold border-b border-gray-100 pb-2">
                    <Star className="w-4 h-4" /> Astrology Details
                  </div>
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <InfoRow label="Mangalik" value={userData.Mangalik} />
                    <InfoRow label="Gotra" value={userData.iGotraID} />
                    <InfoRow label="Raashi" value={userData.RaashiId} />
                    <InfoRow label="Nakshtra" value={userData.NakshtraId} />
                    <InfoRow label="Gan" value={userData.GanId} />
                    <InfoRow label="Charan" value={userData.CharanId} />
                    <InfoRow label="Nadi" value={userData.NadiId} />
                  </div>
                </div>

                {/* Interests & Favorites */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                  <div className="flex items-center gap-2 mb-4 text-pink-500 font-semibold border-b border-gray-100 pb-2">
                    <Heart className="w-4 h-4" /> Interests & Favorites
                  </div>
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <InfoRow label="Interests" value={userData.InterestID} />
                    <InfoRow label="Music" value={userData.FaviouriteMusicID} />
                    <InfoRow label="Read" value={userData.FavioriteReadID} />
                    <InfoRow label="Cousines" value={userData.FavouriteCousinesID} />
                    <InfoRow label="Sports" value={userData.SportsFittnessID} />
                    <InfoRow label="Movies" value={userData.PreferredMovieID} />
                    <InfoRow label="Dress" value={userData.PreferredDressID} />
                    <InfoRow label="Tour Abroad" value={userData.vTourAbroad} />
                    <InfoRow label="Settling Abroad" value={userData.vSettlingAbroad} />
                  </div>
                </div>

                {/* Settings & Privacy */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col lg:col-span-2">
                  <div className="flex items-center gap-2 mb-4 text-gray-600 font-semibold border-b border-gray-100 pb-2">
                    <Settings className="w-4 h-4" /> System & Privacy Settings
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                    <InfoRow label="TOC Accepted" value={userData.toc} />
                    <InfoRow label="Privacy Option" value={userData.user_privacy_option === '0' ? 'Yes' : userData.user_privacy_option === '1' ? 'No' : userData.user_privacy_option} />
                    <InfoRow label="Hide Profile" value={userData.hide_profile} />
                    <InfoRow label="Phone Privacy" value={userData.phone_privacy === '0' ? 'Yes' : userData.phone_privacy === '1' ? 'No' : userData.phone_privacy} />
                    <InfoRow label="Photo Privacy" value={userData.photo_privacy === '0' ? 'Yes' : userData.photo_privacy === '1' ? 'No' : userData.photo_privacy} />
                    <InfoRow label="Visitor Setting" value={userData.visitor_setting === '0' ? 'Yes' : userData.visitor_setting === '1' ? 'No' : userData.visitor_setting} />
                    {/* <InfoRow label="IP Address" value={userData.IP_Address} /> */}
                    <InfoRow label="Photo Modify Status" value={userData.eStatusPhotoModify} />
                    <InfoRow label="In Own Word Status" value={userData.eStatusInOwnWord} />
                    <InfoRow label="Created At" value={formatDate(userData.created_at)} />
                    <InfoRow label="Updated At" value={formatDate(userData.updated_at)} />
                    <InfoRow label="Last Login" value={formatDate(userData.LastLoginTime)} />
                  </div>
                </div>

              </div>
              
              {/* Additional Photos Section */}
              {userData.photos && userData.photos.length > 0 && (
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 text-pink-600 font-semibold border-b border-gray-100 pb-2">
                    <Camera className="w-4 h-4" /> Photo Gallery ({userData.photos.length})
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                    {userData.photos.map((photo: any) => (
                      <div key={photo.iPhoto_ID} className="relative shrink-0 group bg-gray-50 rounded-xl w-48 h-48 flex items-center justify-center border border-gray-200 overflow-hidden">
                        <img 
                          src={photo.File_Name} 
                          alt="User upload" 
                          className="w-full h-full object-contain drop-shadow-sm group-hover:opacity-90 transition-opacity p-1"
                        />
                        <div className="absolute top-2 left-2 flex gap-1">
                           <span className={`text-[10px] font-bold px-2 py-1 rounded shadow-sm ${photo.eStatus === 'Pending' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}>
                            {photo.eStatus}
                           </span>
                           {photo.Is_Profile_Photo === 'YES' && (
                             <span className="text-[10px] font-bold px-2 py-1 rounded shadow-sm bg-blue-500 text-white">
                               Main
                             </span>
                           )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="px-8 py-2.5 bg-gray-800 text-white text-sm font-semibold rounded-lg hover:bg-gray-900 transition-colors shadow-sm"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserViewModal;
