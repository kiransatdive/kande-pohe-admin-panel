import React, { useState, useEffect } from 'react';
import { X, Loader2, Save, User as UserIcon, MapPin, Heart, Users, Star, Settings } from 'lucide-react';
import apiClient from '../../services/apiClient';

interface UserEditModalProps {
  userId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ userId, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserDetails();
      setActiveTab('basic');
    }
  }, [isOpen, userId]);

  const fetchUserDetails = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await apiClient.get(`v1/admin/users/${userId}`, {
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data.success) {
        setFormData(response.data.data);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    
    try {
      const response = await apiClient.put(`v1/admin/users/${userId}`, formData, {
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      
      if (response.data.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.data.message || 'Failed to update user');
      }
    } catch (err: any) {
      console.error('Error updating user:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while updating');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' && value !== '' ? Number(value) : value
    }));
  };

  if (!isOpen) return null;

  const InputField = ({ label, name, type = 'text' }: { label: string, name: string, type?: string }) => (
    <div className="flex flex-col mb-4">
      <label className="text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name] === null || formData[name] === undefined ? '' : formData[name]}
        onChange={handleChange}
        className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
      />
    </div>
  );

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: UserIcon },
    { id: 'background', label: 'Background', icon: MapPin },
    { id: 'physical', label: 'Physical', icon: Heart },
    { id: 'family', label: 'Family', icon: Users },
    { id: 'astrology', label: 'Astrology', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-6xl flex flex-col max-h-[95vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-white shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Edit User Profile</h2>
            <p className="text-sm text-gray-500 mt-1">Editing Database ID: {userId}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-64 bg-white border-r border-gray-200 shrink-0 overflow-y-auto hidden md:block">
            <div className="p-4 space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg transition-colors ${activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Mobile Tabs */}
          <div className="flex md:hidden overflow-x-auto bg-white border-b border-gray-200 shrink-0">
             {tabs.map(tab => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 ${activeTab === tab.id ? 'border-blue-500 text-blue-700' : 'border-transparent text-gray-500'}`}
               >
                 {tab.label}
               </button>
             ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
                <p className="text-sm text-gray-500 font-medium">Loading user details...</p>
              </div>
            ) : (
              <form id="edit-user-form" onSubmit={handleSave}>
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                  </div>
                )}
                
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  
                  {/* Basic Info Tab */}
                  <div className={activeTab === 'basic' ? 'block' : 'hidden'}>
                    <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-2">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                      <InputField label="First Name" name="First_Name" />
                      <InputField label="Last Name" name="Last_Name" />
                      <InputField label="Email" name="email" />
                      <InputField label="Mobile" name="Mobile" />
                      <InputField label="Status (1=Active, 10=Pending)" name="status" type="number" />
                      <InputField label="Gender" name="Gender" />
                      <InputField label="Profile Created For" name="Profile_created_for" />
                      <InputField label="DOB" name="DOB" />
                      <InputField label="Time of Birth" name="Time_of_Birth" />
                      <InputField label="Marital Status" name="Marital_Status" type="number" />
                      <InputField label="Mother Tongue" name="mother_tongue" type="number" />
                      <InputField label="Blood Group ID" name="iBloodGroup_ID" type="number" />
                    </div>
                  </div>

                  {/* Background Tab */}
                  <div className={activeTab === 'background' ? 'block' : 'hidden'}>
                    <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-2">Background & Location</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                      <InputField label="Birth Place" name="Birth_Place" />
                      <InputField label="Religion ID" name="iReligion_ID" type="number" />
                      <InputField label="Community ID" name="iCommunity_ID" type="number" />
                      <InputField label="Sub Community ID" name="iSubCommunity_ID" />
                      <InputField label="Country ID" name="iCountryId" type="number" />
                      <InputField label="State ID" name="iStateId" type="number" />
                      <InputField label="City ID" name="iCityId" type="number" />
                      <InputField label="District ID" name="iDistrictID" type="number" />
                      <InputField label="Taluka ID" name="iTalukaID" type="number" />
                      <InputField label="Area Name" name="vAreaName" />
                      <InputField label="Country CA ID" name="iCountryCAId" type="number" />
                      <InputField label="State CA ID" name="iStateCAId" type="number" />
                      <InputField label="Native Place CA" name="vNativePlaceCA" />
                      <InputField label="Education Level ID" name="iEducationLevelID" type="number" />
                      <InputField label="Education Field ID" name="iEducationFieldID" type="number" />
                      <InputField label="Working With ID" name="iWorkingWithID" type="number" />
                      <InputField label="Working As ID" name="iWorkingAsID" type="number" />
                      <InputField label="Degree Name" name="degreeName" />
                      <InputField label="Annual Income ID" name="iAnnualIncomeID" type="number" />
                    </div>
                  </div>

                  {/* Physical Tab */}
                  <div className={activeTab === 'physical' ? 'block' : 'hidden'}>
                    <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-2">Physical & Lifestyle</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                      <InputField label="Height ID" name="iHeightID" type="number" />
                      <InputField label="Weight" name="weight" />
                      <InputField label="Skin Tone" name="vSkinTone" />
                      <InputField label="Body Type" name="vBodyType" />
                      <InputField label="Smoke" name="vSmoke" />
                      <InputField label="Drink" name="vDrink" />
                      <InputField label="Diet" name="vDiet" />
                      <InputField label="Cook" name="vCook" type="number" />
                      <InputField label="Spectacles Lens" name="vSpectaclesLens" />
                      <InputField label="Disability" name="vDisability" />
                      <InputField label="Pets" name="vPets" />
                      <InputField label="Tour Abroad" name="vTourAbroad" />
                      <InputField label="Settling Abroad" name="vSettlingAbroad" />
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-2 mb-4">
                        <label className="text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider block">About Me</label>
                        <textarea
                          name="tYourSelf"
                          rows={3}
                          value={formData.tYourSelf || ''}
                          onChange={handleChange}
                          className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Family Tab */}
                  <div className={activeTab === 'family' ? 'block' : 'hidden'}>
                    <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-2">Family Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                      <InputField label="Family Type" name="vFamilyType" />
                      <InputField label="Affluence Level" name="vFamilyAffluenceLevel" />
                      <InputField label="Father Status ID" name="iFatherStatusID" type="number" />
                      <InputField label="Mother Status ID" name="iMotherStatusID" type="number" />
                      <InputField label="Brothers (nob)" name="nob" type="number" />
                      <InputField label="Sisters (nos)" name="nos" type="number" />
                      <InputField label="Married Brothers (NobM)" name="NobM" type="number" />
                      <InputField label="Parents Residing" name="vParentsResiding" />
                      <InputField label="Family Income ID" name="iFamilyAnnualIncomeID" type="number" />
                      <InputField label="Inter-caste Parents" name="vParentInterCasteMarriage" />
                      <InputField label="Parents Living Separately" name="vParentsLivingSeparately" />
                    </div>
                  </div>

                  {/* Astrology Tab */}
                  <div className={activeTab === 'astrology' ? 'block' : 'hidden'}>
                    <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-2">Astrology Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                      <InputField label="Mangalik" name="Mangalik" />
                      <InputField label="Gotra ID" name="iGotraID" type="number" />
                      <InputField label="Raashi ID" name="RaashiId" type="number" />
                      <InputField label="Nakshtra ID" name="NakshtraId" type="number" />
                      <InputField label="Gan ID" name="GanId" type="number" />
                      <InputField label="Charan ID" name="CharanId" type="number" />
                      <InputField label="Nadi ID" name="NadiId" type="number" />
                    </div>
                  </div>

                  {/* Settings Tab */}
                  <div className={activeTab === 'settings' ? 'block' : 'hidden'}>
                    <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-2">System & Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                      <InputField label="TOC Accepted" name="toc" />
                      <InputField label="Email Verified" name="eEmailVerifiedStatus" />
                      <InputField label="Phone Verified" name="ePhoneVerifiedStatus" />
                      <InputField label="Privacy Option" name="user_privacy_option" />
                      <InputField label="Hide Profile" name="hide_profile" />
                      <InputField label="Phone Privacy" name="phone_privacy" />
                      <InputField label="Photo Privacy" name="photo_privacy" />
                      <InputField label="Visitor Setting" name="visitor_setting" />
                      <InputField label="IP Address" name="IP_Address" />
                      <InputField label="Profile Completion %" name="profile_completion" type="number" />
                      <InputField label="Completed Step" name="completed_step" />
                      <InputField label="Registration Number" name="Registration_Number" />
                    </div>
                  </div>

                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-white flex justify-end gap-3 shrink-0">
          <button 
            type="button" 
            onClick={onClose}
            disabled={isSaving}
            className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="edit-user-form"
            disabled={isSaving || isLoading}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;
