import React, { useState, useEffect } from 'react';
import { X, User as UserIcon, MapPin, Heart, Users, Star, Loader2, Camera, Trash2, Save } from 'lucide-react';
import apiClient from '../../services/apiClient';


interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: any;
  step?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField = React.memo(({ label, name, type = 'text', value, step, onChange }: InputFieldProps) => (
  <div className="flex flex-col mb-4">
    <label className="text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">{label}</label>
    <input
      type={type}
      name={name}
      step={step}
      value={value === null || value === undefined ? '' : value}
      onChange={onChange}
      className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
    />
  </div>
));

interface SelectFieldProps {
  label: string;
  name: string;
  value: any;
  options: { label: string; value: string | number }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => void;
}

const SelectField = React.memo(({ label, name, value, options, onChange }: SelectFieldProps) => (
  <div className="flex flex-col mb-4">
    <label className="text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">{label}</label>
    <select
      name={name}
      value={value === null || value === undefined ? '' : String(value)}
      onChange={onChange}
      className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
    >
      <option value="" disabled>Select {label}</option>
      {options.map((opt) => (
        <option key={opt.value} value={String(opt.value)}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
));

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
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [activeTab, setActiveTab] = useState('basic');
  const [masterData, setMasterData] = useState<Record<string, {label: string, value: string | number}[]>>({});
  const [profileCreatedForOptions, setProfileCreatedForOptions] = useState<{label: string, value: string | number}[]>([]);
  const [maritalStatusOptions, setMaritalStatusOptions] = useState<{label: string, value: string | number}[]>([]);
  const [motherTongueOptions, setMotherTongueOptions] = useState<{label: string, value: string | number}[]>([]);
  const [bloodGroupOptions, setBloodGroupOptions] = useState<{label: string, value: string | number}[]>([]);
  const [heightOptions, setHeightOptions] = useState<{label: string, value: string | number}[]>([]);
  const [skinToneOptions, setSkinToneOptions] = useState<{label: string, value: string | number}[]>([]);
  const [bodyTypeOptions, setBodyTypeOptions] = useState<{label: string, value: string | number}[]>([]);
  const [dietOptions, setDietOptions] = useState<{label: string, value: string | number}[]>([]);
  const [favouriteCuisinesOptions, setFavouriteCuisinesOptions] = useState<{label: string, value: string | number}[]>([]);
  const [favouriteReadsOptions, setFavouriteReadsOptions] = useState<{label: string, value: string | number}[]>([]);
  const [favouriteMusicOptions, setFavouriteMusicOptions] = useState<{label: string, value: string | number}[]>([]);
  const [sportsFitnessOptions, setSportsFitnessOptions] = useState<{label: string, value: string | number}[]>([]);
  const [preferredDressOptions, setPreferredDressOptions] = useState<{label: string, value: string | number}[]>([]);
  const [preferredMovieOptions, setPreferredMovieOptions] = useState<{label: string, value: string | number}[]>([]);
  const [familyAffluenceOptions, setFamilyAffluenceOptions] = useState<{label: string, value: string | number}[]>([]);
  const [fmStatusOptions, setFmStatusOptions] = useState<{label: string, value: string | number}[]>([]);
  const [familyPropertyOptions, setFamilyPropertyOptions] = useState<{label: string, value: string | number}[]>([]);
  const [familyAnnualIncomeOptions, setFamilyAnnualIncomeOptions] = useState<{label: string, value: string | number}[]>([]);
  const [gotraOptions, setGotraOptions] = useState<{label: string, value: string | number}[]>([]);
  const [raashiOptions, setRaashiOptions] = useState<{label: string, value: string | number}[]>([]);

  useEffect(() => {
    if (isOpen && userId) {
      setFormData({});
      fetchUserDetails();
      
      if (masterData.religion === undefined) {
        fetchProfileCreatedForOptions();
        fetchMaritalStatusOptions();
        fetchMotherTongueOptions();
        fetchBloodGroupOptions();
        fetchHeightOptions();
        fetchSkinToneOptions();
        fetchBodyTypeOptions();
        fetchDietOptions();
        fetchFavouriteCuisinesOptions();
        fetchFavouriteReadsOptions();
        fetchFavouriteMusicOptions();
        fetchSportsFitnessOptions();
        fetchPreferredDressOptions();
        fetchPreferredMovieOptions();
        fetchFamilyAffluenceOptions();
        fetchFMStatusOptions();
        fetchFamilyPropertyOptions();
        fetchFamilyAnnualIncomeOptions();
        fetchGotraOptions();
        fetchRaashiOptions();
        
        const masterEndpoints = [
          { endpoint: 'religion', key: 'religion' },
          { endpoint: 'master-community', key: 'community' },
          { endpoint: 'master-community-sub', key: 'subCommunity' },

          { endpoint: 'education-level', key: 'educationLevel' },
          { endpoint: 'education-field', key: 'educationField' },
          { endpoint: 'working-with', key: 'workingWith' },
          { endpoint: 'working-as', key: 'workingAs' },
          { endpoint: 'annual-income', key: 'annualIncome' },
          { endpoint: 'nakshtra', key: 'nakshtra' },
          { endpoint: 'gan', key: 'gan' },
          { endpoint: 'charan', key: 'charan' },
          { endpoint: 'nadi', key: 'nadi' }
        ];
        masterEndpoints.forEach(m => fetchMasterOption(m.endpoint, m.key));
      }
      setActiveTab('basic');
    }
  }, [isOpen, userId]);

  const fetchFamilyAffluenceOptions = async () => {
    try {
      const response = await apiClient.get('v1/admin/master/family-affluence-level?limit=100', {
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data && response.data.success) {
        const options = response.data.data.map((item: any) => ({
          label: item.Name,
          value: item.Name
        }));
        setFamilyAffluenceOptions(options);
      }
    } catch (err) {
      console.error('Error fetching family affluence options', err);
    }
  };

  const fetchFMStatusOptions = async () => {
    try {
      const response = await apiClient.get('v1/admin/master/master-fm-status?limit=100', {
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data && response.data.success) {
        const options = response.data.data.map((item: any) => ({
          label: item.vName,
          value: item.iFMStatusID
        }));
        setFmStatusOptions(options);
      }
    } catch (err) {
      console.error('Error fetching fm status options', err);
    }
  };

  const fetchFamilyPropertyOptions = async () => {
    try {
      const response = await apiClient.get('v1/admin/master/property-details?limit=100', {
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data && response.data.success) {
        const options = response.data.data.map((item: any) => ({
          label: item.Name,
          value: item.Name
        }));
        setFamilyPropertyOptions(options);
      }
    } catch (err) {
      console.error('Error fetching family property options', err);
    }
  };

  const fetchFamilyAnnualIncomeOptions = async () => {
    try {
      const response = await apiClient.get('v1/admin/master/annual-income?limit=100', {
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data && response.data.success) {
        const options = response.data.data.map((item: any) => ({
          label: item.vAnnualIncome,
          value: item.iAnnualIncomeID
        }));
        setFamilyAnnualIncomeOptions(options);
      }
    } catch (err) {
      console.error('Error fetching family annual income options', err);
    }
  };

  const fetchGotraOptions = async () => {
    try {
      const response = await apiClient.get('v1/admin/master/master-gotra?limit=200', {
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data && response.data.success) {
        const options = response.data.data.map((item: any) => ({
          label: item.vName,
          value: item.iGotraID
        }));
        setGotraOptions(options);
      }
    } catch (err) {
      console.error('Error fetching gotra options', err);
    }
  };

  const fetchRaashiOptions = async () => {
    try {
      const response = await apiClient.get('v1/admin/master/raashi?limit=100', {
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data && response.data.success) {
        const options = response.data.data.map((item: any) => ({
          label: item.Name,
          value: item.ID
        }));
        setRaashiOptions(options);
      }
    } catch (err) {
      console.error('Error fetching raashi options', err);
    }
  };

  const fetchBodyTypeOptions = async () => {
    try {
      const response = await apiClient.get('v1/admin/master/body-type?limit=100', {
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data && response.data.success) {
        const options = response.data.data.map((item: any) => ({
          label: item.Name,
          value: item.Name
        }));
        setBodyTypeOptions(options);
      }
    } catch (err) {
      console.error('Error fetching body type options', err);
    }
  };

  const fetchDietOptions = async () => {
    try {
      const response = await apiClient.get('v1/admin/master/master-diet?limit=100', {
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data && response.data.success) {
        const options = response.data.data.map((item: any) => ({
          label: item.vName,
          value: item.iDietID
        }));
        setDietOptions(options);
      }
    } catch (err) {
      console.error('Error fetching diet options', err);
    }
  };

  const fetchPreferredMovieOptions = async () => {
    try {
      const response = await apiClient.get('v1/admin/master/preferred-movies?limit=100', {
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data && response.data.success) {
        const options = response.data.data.map((item: any) => ({
          label: item.Name,
          value: item.ID
        }));
        setPreferredMovieOptions(options);
      }
    } catch (err) {
      console.error('Error fetching preferred movie options', err);
    }
  };

  const fetchPreferredDressOptions = async () => {
    try {
      const response = await apiClient.get('v1/admin/master/preferred-dress-style?limit=100', {
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data && response.data.success) {
        const options = response.data.data.map((item: any) => ({
          label: item.Name,
          value: item.ID
        }));
        setPreferredDressOptions(options);
      }
    } catch (err) {
      console.error('Error fetching preferred dress options', err);
    }
  };

  const fetchSportsFitnessOptions = async () => {
    try {
      const response = await apiClient.get('v1/admin/master/sports-fitn-activities?limit=100', {
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data && response.data.success) {
        const options = response.data.data.map((item: any) => ({
          label: item.Name,
          value: item.ID
        }));
        setSportsFitnessOptions(options);
      }
    } catch (err) {
      console.error('Error fetching sports fitness options', err);
    }
  };

  const fetchFavouriteMusicOptions = async () => {
    try {
      const response = await apiClient.get('v1/admin/master/favourite-music?limit=100', {
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data && response.data.success) {
        const options = response.data.data.map((item: any) => ({
          label: item.Name,
          value: item.ID
        }));
        setFavouriteMusicOptions(options);
      }
    } catch (err) {
      console.error('Error fetching favourite music options', err);
    }
  };

  const fetchFavouriteReadsOptions = async () => {
    try {
      const response = await apiClient.get('v1/admin/master/favourite-reads?limit=100', {
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data && response.data.success) {
        const options = response.data.data.map((item: any) => ({
          label: item.Name,
          value: item.ID
        }));
        setFavouriteReadsOptions(options);
      }
    } catch (err) {
      console.error('Error fetching favourite reads options', err);
    }
  };

  const fetchFavouriteCuisinesOptions = async () => {
    try {
      const response = await apiClient.get('v1/admin/master/favourite-cousines?limit=100', {
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data && response.data.success) {
        const options = response.data.data.map((item: any) => ({
          label: item.Name,
          value: item.ID
        }));
        setFavouriteCuisinesOptions(options);
      }
    } catch (err) {
      console.error('Error fetching favourite cuisines options', err);
    }
  };

  const fetchSkinToneOptions = async () => {
    try {
      const response = await apiClient.get('v1/admin/master/skin-tone?limit=100', {
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data && response.data.success) {
        const options = response.data.data.map((item: any) => ({
          label: item.Name,
          value: item.Name
        }));
        setSkinToneOptions(options);
      }
    } catch (err) {
      console.error('Error fetching skin tone options', err);
    }
  };

  const fetchHeightOptions = async () => {
    try {
      const response = await apiClient.get('v1/admin/master/master-heights?limit=1000', {
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data && response.data.success) {
        const options = response.data.data.map((item: any) => ({
          label: item.vName,
          value: item.iHeightID
        }));
        setHeightOptions(options);
      }
    } catch (err) {
      console.error('Error fetching height options', err);
    }
  };

  const fetchMasterOption = async (endpoint: string, key: string) => {
    try {
      const response = await apiClient.get(`v1/admin/master/${endpoint}`, {
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data && response.data.success) {
        const options = response.data.data.map((item: any) => {
          let label = item.Name || item.vName || item.display_name || item.name;
          let value = item.ID !== undefined ? item.ID : item.id;
          
          // Dynamic fallback for highly specific backend keys (e.g. iEducationLevelID, vEducationLevel)
          if (!label) {
            const stringKey = Object.keys(item).find(k => typeof item[k] === 'string' && (k.startsWith('v') || k.toLowerCase().includes('name')));
            if (stringKey) label = item[stringKey];
          }
          if (value === undefined) {
            const idKey = Object.keys(item).find(k => k.toLowerCase().includes('id') || k === 'ID');
            if (idKey) value = item[idKey];
          }
          
          return { label: label || 'Unknown', value: value !== undefined ? value : '' };
        });
        setMasterData(prev => ({ ...prev, [key]: options }));
      }
    } catch (err) {
      console.error(`Error fetching ${endpoint}`, err);
    }
  };

  const fetchProfileCreatedForOptions = async () => {
    try {
      const response = await apiClient.get('v1/admin/master/profile-created-for', {
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data && response.data.success) {
        const options = response.data.data.map((item: any) => ({
          label: item.Name || item.display_name || item.name,
          value: item.ID !== undefined ? item.ID : item.id
        }));
        
        // Add 'Self' if it's not in the API just for backward compatibility
        if (!options.find((o: any) => o.label === 'Self')) {
          options.push({ label: 'Self', value: 'Self' });
        }
        
        setProfileCreatedForOptions(options);
      }
    } catch (err) {
      console.error('Error fetching profile created for options', err);
    }
  };

  const fetchMaritalStatusOptions = async () => {
    try {
      const response = await apiClient.get('v1/admin/master/marital-status', {
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data && response.data.success) {
        const options = response.data.data.map((item: any) => ({
          label: item.vName || item.Name || item.display_name || item.name,
          value: item.iMaritalStatusID ?? item.iMaritalID ?? item.ID ?? item.id
        }));
        setMaritalStatusOptions(options);
      }
    } catch (err) {
      console.error('Error fetching marital status options', err);
    }
  };

  const fetchMotherTongueOptions = async () => {
    try {
      const response = await apiClient.get('v1/admin/master/mother-tongue', {
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data && response.data.success) {
        const options = response.data.data.map((item: any) => ({
          label: item.vName || item.Name || item.display_name || item.name,
          value: item.iMotherTongueID ?? item.ID ?? item.id
        }));
        setMotherTongueOptions(options);
      }
    } catch (err) {
      console.error('Error fetching mother tongue options', err);
    }
  };

  const fetchBloodGroupOptions = async () => {
    try {
      const response = await apiClient.get('v1/admin/master/blood-group', {
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data && response.data.success) {
        const options = response.data.data.map((item: any) => ({
          label: item.vName || item.Name || item.display_name || item.name,
          value: item.iBloodGroupID ?? item.ID ?? item.id
        }));
        setBloodGroupOptions(options);
      }
    } catch (err) {
      console.error('Error fetching blood group options', err);
    }
  };

  const fetchUserDetails = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await apiClient.get(`v1/admin/users/${userId}`, {
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data.success) {
        const data = response.data.data;
        const flattenedData = { ...data };
        
        Object.keys(flattenedData).forEach(key => {
          if (flattenedData[key] && typeof flattenedData[key] === 'object' && !Array.isArray(flattenedData[key]) && 'id' in flattenedData[key]) {
            const nameStr = flattenedData[key].name || flattenedData[key].display_name || flattenedData[key].vName || flattenedData[key].vCountryName || flattenedData[key].vStateName || flattenedData[key].vCityName;
            if (nameStr) {
              flattenedData[`${key}_name`] = nameStr;
            }
            flattenedData[key] = flattenedData[key].id;
          }
        });
        
        // Normalize location fields so they don't rely on fallbacks during render, which prevents editing
        flattenedData.Country = flattenedData.Country || flattenedData.vCountry || flattenedData.country_name || flattenedData.vCountryName || flattenedData.iCountryId_name || '';
        flattenedData.State = flattenedData.State || flattenedData.vState || flattenedData.state_name || flattenedData.vStateName || flattenedData.iStateId_name || '';
        flattenedData.City = flattenedData.City || flattenedData.vCity || flattenedData.city_name || flattenedData.vCityName || flattenedData.iCityId_name || '';
        flattenedData.District = flattenedData.District || flattenedData.vDistrict || flattenedData.district || flattenedData.district_name || flattenedData.vDistrictName || flattenedData.iDistrictId_name || flattenedData.iDistrictID_name || '';
        flattenedData.Taluka = flattenedData.Taluka || flattenedData.vTaluka || flattenedData.taluka || flattenedData.taluka_name || flattenedData.vTalukaName || flattenedData.iTalukaId_name || flattenedData.iTalukaID_name || '';

        setFormData(flattenedData);
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
      const payload = { ...formData };
      
      // The backend strictly expects strings for these fields. S
      // If they are null or numbers, they fail validation.
      const stringFields = [
        'county_code', 'FavouriteCousinesID', 'vDisabilityDescription', 
        'vParentsResiding', 'vDetailRelative', 'InterestID', 'FavioriteReadID', 
        'FaviouriteMusicID', 'SportsFittnessID', 'PreferredDressID', 
        'PreferredMovieID', 'cover_background_position', 'cover_photo', 
        'new_phone_no', 'new_email_id', 'new_county_code', 'latitude', 'longitude',
        'iFavCousinesID', 'vAreaName', 'vAreaNameCA', 'iSubCommunity_ID', 'vDiet', 'vThingsCannotLiveWIthout', 'propic',
        'vFirstThingNoticeAboutMe', 'tYourSelf'
      ];
      
      stringFields.forEach(field => {
        if (payload[field] === null || payload[field] === undefined) {
          payload[field] = '';
        } else if (Array.isArray(payload[field])) {
          payload[field] = payload[field].join(',');
        } else if (typeof payload[field] !== 'string') {
          payload[field] = String(payload[field]);
        }
      });

      const numberFields = [
        'status', 'iMaritalStatusID', 'iBloodGroup_ID', 'iReligion_ID', 'iCommunity_ID', 
        'iEducationLevelID', 'iEducationFieldID', 'iWorkingWithID', 'iWorkingAsID', 
        'iAnnualIncomeID', 'iHeightID', 'iFatherStatusID', 'iMotherStatusID', 
        'nob', 'nos', 'NobM', 'NosM', 'iFamilyAnnualIncomeID', 'iGotraID', 'RaashiId', 
        'NakshtraId', 'GanId', 'CharanId', 'NadiId', 'vCook', 'profile_completion', 'mother_tongue'
      ];

      numberFields.forEach(field => {
        if (payload[field] !== undefined && payload[field] !== null && payload[field] !== '') {
          const num = Number(payload[field]); 
          if (!isNaN(num)) {
            payload[field] = num;
          }
        }
      });

      if (payload['Age'] !== undefined && payload['Age'] !== null && payload['Age'] !== '') {
        payload['Age'] = Number(payload['Age']) || 0;
      } else {
        payload['Age'] = 0;
      }
      
      const response = await apiClient.put(`v1/admin/users/${userId}`, payload, {
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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately using URL.createObjectURL
    setFormData(prev => ({ ...prev, propic: URL.createObjectURL(file) }));

    try {
      setIsUploadingPhoto(true);
      setError('');
      setSuccessMessage('');
      
      const payload = new FormData();
      payload.append('profilePhoto', file);

      const response = await apiClient.post(`v1/admin/users/${userId}/upload-photos`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'bypass-tunnel-reminder': 'true'
        }
      });

      if (response.data.success) {
        // Fetch user data again just to get the reliable profile photo URL
        try {
          const userRes = await apiClient.get(`v1/admin/users/${userId}`, {
            headers: { 'bypass-tunnel-reminder': 'true' }
          });
          if (userRes.data.success && userRes.data.data && userRes.data.data.propic) {
            setFormData(prev => ({ ...prev, propic: userRes.data.data.propic }));
          }
        } catch (e) {
          console.error("Failed to refresh profile photo", e);
        }
        
        setSuccessMessage('Profile photo updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.data.message || 'Failed to upload photo');
      }
    } catch (err: any) {
      console.error('Error uploading photo:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while uploading photo');
    } finally {
      setIsUploadingPhoto(false);
      if (e.target) {
        e.target.value = '';
      }
    }
  };
  

  if (!isOpen) return null;


  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: UserIcon },
    { id: 'background', label: 'Background', icon: MapPin },
    { id: 'physical', label: 'Physical', icon: Heart },
    { id: 'family', label: 'Family', icon: Users },
    { id: 'astrology', label: 'Astrology', icon: Star },
    { id: 'photos', label: 'Photos', icon: Camera },
  ];

  const handleAdditionalPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingPhoto(true);
      setError('');
      
      const payload = new FormData();
      payload.append('additionalPhotos', file);

      const response = await apiClient.post(`v1/admin/users/${userId}/upload-photos`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'bypass-tunnel-reminder': 'true'
        }
      });

      if (response.data.success) {
        // Fetch user data again just to get the newly created full photo objects, 
        // but only update the photos array so we don't wipe out other unsaved form changes!
        try {
          const userRes = await apiClient.get(`v1/admin/users/${userId}`, {
            headers: { 'bypass-tunnel-reminder': 'true' }
          });
          if (userRes.data.success && userRes.data.data.photos) {
            setFormData(prev => ({ ...prev, photos: userRes.data.data.photos }));
          }
        } catch (e) {
          console.error("Failed to refresh photos list", e);
        }
        
        setSuccessMessage('Photo added successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.data.message || 'Failed to upload photo');
      }
    } catch (err: any) {
      console.error('Error uploading photo:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while uploading photo');
    } finally {
      setIsUploadingPhoto(false);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    try {
      setIsLoading(true);
      setError('');
      setSuccessMessage('');
      const response = await apiClient.delete(`v1/admin/users/${userId}/photos/${photoId}`, {
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      
      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          photos: (prev.photos || []).filter((p: any) => p.iPhoto_ID !== photoId)
        }));
        setSuccessMessage('Photo deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.data.message || 'Failed to delete photo');
      }
    } catch (err: any) {
      console.error('Error deleting photo:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while deleting photo');
    } finally {
      setIsLoading(false);
    }
  };


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
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded flex justify-between items-start shadow-sm">
                    <div>
                      <p className="font-bold">Error</p>
                      <p>{error}</p>
                    </div>
                    <button type="button" onClick={() => setError('')} className="text-red-400 hover:text-red-600 p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {successMessage && (
                  <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 text-sm rounded flex justify-between items-start shadow-sm">
                    <div>
                      <p className="font-bold">Success</p>
                      <p>{successMessage}</p>
                    </div>
                    <button type="button" onClick={() => setSuccessMessage('')} className="text-emerald-400 hover:text-emerald-600 p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  
                  {/* Basic Info Tab */}
                  <div className={activeTab === 'basic' ? 'block' : 'hidden'}>
                    <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-2">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                      <InputField label="First Name" name="First_Name" value={formData.First_Name} onChange={handleChange} />
                      <InputField label="Last Name" name="Last_Name" value={formData.Last_Name} onChange={handleChange} />
                      <InputField label="Email" name="email" value={formData.email} onChange={handleChange} />
                      <InputField label="Mobile" name="Mobile" value={formData.Mobile} onChange={handleChange} />
                      
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-2">
                        <label className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider block">
                          Upload Profile Picture
                        </label>
                        <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                          {formData.propic ? (
                            <img src={formData.propic} alt="Preview" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm shrink-0" />
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-gray-200 border-2 border-white shadow-sm shrink-0 flex items-center justify-center text-gray-400 text-xs">No Pic</div>
                          )}
                          <input 
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            disabled={isUploadingPhoto}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer disabled:opacity-50"
                          />
                          {isUploadingPhoto && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                        </div>
                      </div>
                      {/* <SelectField
                        label="Status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        options={[
                          { label: 'Deleted', value: 0 },
                          { label: 'Active', value: 1 },
                          { label: 'Inactive', value: 2 },
                          { label: 'Pending', value: 3 },
                          { label: 'Disapproved', value: 4 },
                          { label: 'Approved', value: 5 },
                          { label: 'Blocked', value: 6 },
                          { label: 'Pending (Alternative)', value: 10 }
                        ]}
                      /> */}
                      <SelectField
                        label="Gender"
                        name="Gender"
                        value={formData.Gender}
                        onChange={handleChange}
                        options={[
                          { label: 'Male', value: 'MALE' },
                          { label: 'Female', value: 'FEMALE' },
                        ]}
                      />
                      <SelectField
                        label="Profile Created For"
                        name="Profile_created_for"
                        value={formData.Profile_created_for}
                        onChange={handleChange}
                        options={profileCreatedForOptions.length > 0 ? profileCreatedForOptions : [
                          { label: 'Self', value: 'Self' }
                        ]}
                      />
                      <InputField 
                        label="DOB" 
                        name="DOB" 
                        type="date"
                        value={formData.DOB ? String(formData.DOB).split('T')[0] : ''} 
                        onChange={handleChange} 
                      />
                      <InputField 
                        label="Time of Birth" 
                        name="Time_of_Birth" 
                        type="time"
                        step="1"
                        value={formData.Time_of_Birth} 
                        onChange={handleChange} 
                      />
                      <InputField label="Age" name="Age" type="number" value={formData.Age} onChange={handleChange} />
                      <SelectField
                        label="Marital Status"
                        name="iMaritalStatusID"
                        value={formData.iMaritalStatusID}
                        onChange={handleChange}
                        options={maritalStatusOptions.length > 0 ? maritalStatusOptions : [
                          { label: 'Unmarried (0)', value: 0 },
                          { label: 'Married (1)', value: 1 }
                        ]}
                      />
                      <SelectField
                        label="Mother Tongue"
                        name="mother_tongue"
                        value={formData.mother_tongue}
                        onChange={handleChange}
                        options={motherTongueOptions}
                      />
                      <SelectField
                        label="Blood Group ID"
                        name="iBloodGroup_ID"
                        value={formData.iBloodGroup_ID}
                        onChange={handleChange}
                        options={bloodGroupOptions}
                      />
                    </div>
                  </div>

                  {/* Background Tab */}
                  <div className={activeTab === 'background' ? 'block' : 'hidden'}>
                    <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-2">Background & Location</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                      <InputField label="Birth Place" name="Birth_Place" value={formData.Birth_Place} onChange={handleChange} />
                      <SelectField label="Religion ID" name="iReligion_ID" value={formData.iReligion_ID} onChange={handleChange} options={masterData.religion || []} />
                      <SelectField label="Community ID" name="iCommunity_ID" value={formData.iCommunity_ID} onChange={handleChange} options={masterData.community || []} />
                      <SelectField label="Sub Community ID" name="iSubCommunity_ID" value={formData.iSubCommunity_ID} onChange={handleChange} options={masterData.subCommunity || []} />
                      <InputField label="Country" name="Country" value={formData.Country || ''} onChange={handleChange} />
                      <InputField label="State" name="State" value={formData.State || ''} onChange={handleChange} />
                      <InputField label="City" name="City" value={formData.City || ''} onChange={handleChange} />
                      <InputField label="Area Name" name="vAreaName" value={formData.vAreaName} onChange={handleChange} />
                      <SelectField label="Education Level ID" name="iEducationLevelID" value={formData.iEducationLevelID} onChange={handleChange} options={masterData.educationLevel || []} />
                      <SelectField label="Education Field ID" name="iEducationFieldID" value={formData.iEducationFieldID} onChange={handleChange} options={masterData.educationField || []} />
                      <SelectField label="Working With ID" name="iWorkingWithID" value={formData.iWorkingWithID} onChange={handleChange} options={masterData.workingWith || []} />
                      <SelectField label="Working As ID" name="iWorkingAsID" value={formData.iWorkingAsID} onChange={handleChange} options={masterData.workingAs || []} />
                      <InputField label="Degree Name" name="degreeName" value={formData.degreeName} onChange={handleChange} />
                      <SelectField label="Annual Income ID" name="iAnnualIncomeID" value={formData.iAnnualIncomeID} onChange={handleChange} options={masterData.annualIncome || []} />
                    </div>
                  </div>

                  {/* Physical Tab */}
                  <div className={activeTab === 'physical' ? 'block' : 'hidden'}>
                    <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-2">Physical & Lifestyle</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                      <SelectField label="Height ID" name="iHeightID" value={formData.iHeightID} onChange={handleChange} options={heightOptions} />
                      <InputField label="Weight" name="weight" value={formData.weight} onChange={handleChange} />
                      <SelectField label="Skin Tone" name="vSkinTone" value={formData.vSkinTone} onChange={handleChange} options={skinToneOptions} />
                      <SelectField label="Body Type" name="vBodyType" value={formData.vBodyType} onChange={handleChange} options={bodyTypeOptions} />
                      <SelectField label="Smoke" name="vSmoke" value={formData.vSmoke} onChange={handleChange} options={[
                        { label: 'Yes', value: 'Yes' },
                        { label: 'No', value: 'No' },
                        { label: 'Occasionally', value: 'Occasionally' }
                      ]} />
                      <SelectField label="Drink" name="vDrink" value={formData.vDrink} onChange={handleChange} options={[
                        { label: 'Yes', value: 'Yes' },
                        { label: 'No', value: 'No' },
                        { label: 'Occasionally', value: 'Occasionally' }
                      ]} />
                      <SelectField label="Diet" name="vDiet" value={formData.vDiet} onChange={handleChange} options={dietOptions} />
                      <SelectField label="Cook" name="vCook" value={formData.vCook} onChange={handleChange} options={[
                        { label: 'Yes', value: 1 },
                        { label: 'No', value: 0 }
                      ]} />
                      <SelectField label="Spectacles Lens" name="vSpectaclesLens" value={formData.vSpectaclesLens} onChange={handleChange} options={[
                        { label: 'Yes', value: 'Yes' },
                        { label: 'No', value: 'No' }
                      ]} />
                      <SelectField label="Disability" name="vDisability" value={formData.vDisability} onChange={handleChange} options={[
                   
                        { label: 'Yes', value: 'Yes' },
                        { label: 'No', value: 'No' }
                      ]} />
                      <SelectField label="Pets" name="vPets" value={formData.vPets} onChange={handleChange} options={[
                        { label: 'Yes', value: 'Yes' },
                        { label: 'No', value: 'No' }
                      ]} />
                      <SelectField label="Tour Abroad" name="vTourAbroad" value={formData.vTourAbroad} onChange={handleChange} options={[
                        { label: 'Yes', value: 'Yes' },
                        { label: 'No', value: 'No' }
                      ]} />
                      <SelectField label="Settling Abroad" name="vSettlingAbroad" value={formData.vSettlingAbroad} onChange={handleChange} options={[
                        { label: 'Yes', value: 'Yes' },
                        { label: 'No', value: 'No' }
                      ]} />
                      <SelectField label="Favorite Cuisines ID" name="FavouriteCousinesID" value={formData.FavouriteCousinesID} onChange={handleChange} options={favouriteCuisinesOptions} />

                      <SelectField label="Favorite Read ID" name="FavioriteReadID" value={formData.FavioriteReadID} onChange={handleChange} options={favouriteReadsOptions} />
                      <SelectField label="Favorite Music ID" name="FaviouriteMusicID" value={formData.FaviouriteMusicID} onChange={handleChange} options={favouriteMusicOptions} />

                      <SelectField label="Sports Fitness ID" name="SportsFittnessID" value={formData.SportsFittnessID} onChange={handleChange} options={sportsFitnessOptions} />
                      <SelectField label="Preferred Dress ID" name="PreferredDressID" value={formData.PreferredDressID} onChange={handleChange} options={preferredDressOptions} />
                      <SelectField label="Preferred Movie ID" name="PreferredMovieID" value={formData.PreferredMovieID} onChange={handleChange} options={preferredMovieOptions} />
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-2 mb-4">
                        <label className="text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider block">About Me</label>
                        <textarea
                          name="vFirstThingNoticeAboutMe"
                          rows={3}
                          value={formData.vFirstThingNoticeAboutMe ?? formData.tYourSelf ?? ''}
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
                      <SelectField label="Affluence Level" name="vFamilyAffluenceLevel" value={formData.vFamilyAffluenceLevel} onChange={handleChange} options={familyAffluenceOptions} />
                      <SelectField label="Father Status ID" name="iFatherStatusID" value={formData.iFatherStatusID} onChange={handleChange} options={fmStatusOptions} />
                      <SelectField label="Mother Status ID" name="iMotherStatusID" value={formData.iMotherStatusID} onChange={handleChange} options={fmStatusOptions} />
                      <InputField label="Brothers (nob)" name="nob" type="number" value={formData.nob} onChange={handleChange} />
                      <InputField label="Sisters (nos)" name="nos" type="number" value={formData.nos} onChange={handleChange} />
                      <InputField label="Married Brothers (NobM)" name="NobM" type="number" value={formData.NobM} onChange={handleChange} />
                      <InputField label="Married Sisters (NosM)" name="NosM" type="number" value={formData.NosM} onChange={handleChange} />
                      <SelectField label="Family Income ID" name="iFamilyAnnualIncomeID" value={formData.iFamilyAnnualIncomeID} onChange={handleChange} options={familyAnnualIncomeOptions} />
                      <SelectField label="Inter-caste Parents" name="vParentInterCasteMarriage" value={formData.vParentInterCasteMarriage} onChange={handleChange} options={[
                        { label: 'Yes', value: 'Yes' },
                        { label: 'No', value: 'No' }
                      ]} />
                      <SelectField label="Parents Living Separately" name="vParentsLivingSeparately" value={formData.vParentsLivingSeparately} onChange={handleChange} options={[
                        { label: 'Yes', value: 'Yes' },
                        { label: 'No', value: 'No' }
                      ]} />
                      <SelectField label="Same Address" name="eSameAddress" value={formData.eSameAddress} onChange={handleChange} options={[
                        { label: 'Yes', value: 'Yes' },
                        { label: 'No', value: 'No' }
                      ]} />
                      <SelectField label="Family Property" name="vFamilyProperty" value={formData.vFamilyProperty} onChange={handleChange} options={familyPropertyOptions} />
                    </div>
                  </div>

                  {/* Astrology Tab */}
                  <div className={activeTab === 'astrology' ? 'block' : 'hidden'}>
                    <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-2">Astrology Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                      <SelectField label="Mangalik" name="Mangalik" value={formData.Mangalik} onChange={handleChange} options={[
                        { label: 'Yes', value: 'Yes' },
                        { label: 'No', value: 'No' }
                      ]} />
                      <SelectField label="Gotra ID" name="iGotraID" value={formData.iGotraID} onChange={handleChange} options={gotraOptions} />
                      <SelectField label="Raashi ID" name="RaashiId" value={formData.RaashiId} onChange={handleChange} options={raashiOptions} />
                      <SelectField label="Nakshtra ID" name="NakshtraId" value={formData.NakshtraId} onChange={handleChange} options={masterData.nakshtra || []} />
                      <SelectField label="Gan ID" name="GanId" value={formData.GanId} onChange={handleChange} options={masterData.gan || []} />
                      <SelectField label="Charan ID" name="CharanId" value={formData.CharanId} onChange={handleChange} options={masterData.charan || []} />
                      <SelectField label="Nadi ID" name="NadiId" value={formData.NadiId} onChange={handleChange} options={masterData.nadi || []} />
                    </div>
                  </div>

                  {activeTab === 'photos' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <Camera className="w-5 h-5 text-pink-500" /> Photo Gallery
                        </h3>
                        
                        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Upload New Photo</label>
                          <div className="flex items-center gap-4">
                            <input 
                              type="file"
                              accept="image/*"
                              onChange={handleAdditionalPhotoUpload}
                              disabled={isUploadingPhoto}
                              className="block w-full max-w-sm text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 cursor-pointer disabled:opacity-50"
                            />
                            {isUploadingPhoto && <Loader2 className="w-5 h-5 animate-spin text-pink-500" />}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {(() => {
                            const rawPhotos = formData.photos || [];
                            const latestProfilePhotoId = rawPhotos.length > 0 
                              ? Math.max(0, ...rawPhotos.filter((p: any) => p.Is_Profile_Photo === 'YES').map((p: any) => p.iPhoto_ID || 0)) 
                              : 0;
                            
                            const validPhotos = rawPhotos.filter((p: any) => !failedImages[p.iPhoto_ID]);

                            return validPhotos.length > 0 ? (
                              validPhotos.map((photo: any) => (
                                <div key={photo.iPhoto_ID} className="relative group bg-gray-100 rounded-xl aspect-square flex items-center justify-center border border-gray-200 overflow-hidden shadow-sm">
                                <img 
                                  src={
                                    (() => {
                                      let url = photo.File_Name;
                                      if (!url || url === 'null' || url === 'undefined') {
                                        if (photo.Is_Profile_Photo === 'YES' && formData.propic && formData.propic !== 'null' && formData.propic !== 'undefined') {
                                          url = formData.propic;
                                        }
                                      }
                                      if (!url || url === 'null' || url === 'undefined') return 'https://placehold.co/400x400/f3f4f6/a1a1aa?text=No+Photo';
                                      return typeof url === 'string' ? url.replace(/%22/g, '').replace(/"/g, '') : url;
                                    })()
                                  } 
                                  alt="User photo" 
                                  className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                                  onError={() => {
                                    setFailedImages(prev => ({ ...prev, [photo.iPhoto_ID]: true }));
                                  }}
                                />
                                <div className="absolute top-2 left-2 flex gap-1">
                                  <span className={`text-[10px] font-bold px-2 py-1 rounded shadow-sm ${photo.eStatus === 'Pending' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}>
                                    {photo.eStatus || 'Pending'}
                                  </span>
                                  {photo.iPhoto_ID === latestProfilePhotoId && (
                                    <span className="text-[10px] font-bold px-2 py-1 rounded shadow-sm bg-blue-500 text-white">
                                      Main
                                    </span>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleDeletePhoto(photo.iPhoto_ID)}
                                  className="absolute bottom-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 focus:opacity-100"
                                  title="Delete Photo"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                              <Camera className="w-12 h-12 mx-auto mb-3 opacity-20" />
                              <p>No gallery photos found for this user.</p>
                            </div>
                          );
                          })()}
                        </div>
                      </div>
                    </div>
                  )}

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
