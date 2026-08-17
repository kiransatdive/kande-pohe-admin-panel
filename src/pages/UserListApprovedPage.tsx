import React, { useState, useEffect } from 'react';
import { Eye, Image as ImageIcon, CheckCircle2, Loader2, XCircle, FileText, AlertTriangle, Check } from 'lucide-react';
import Pagination from '../components/common/Pagination';
import UserViewModal from '../components/common/UserViewModal';
import UserPhotosModal from '../components/common/UserPhotosModal';
import UserBioModal from '../components/common/UserBioModal';
import CallNotesModal from '../components/common/CallNotesModal';
import apiClient from '../services/apiClient';

interface User {
  id: number;
  First_Name: string;
  Last_Name: string;
  email: string;
  eEmailVerifiedStatus: string;
  Mobile: string;
  ePhoneVerifiedStatus: string;
  iHeightID: number;
  Age: number;
  LastLoginTime: string | null;
  created_at: number;
  status: number;
  [key: string]: any;
}

interface Community {
  iCommunity_ID: number;
  vName: string;
  eStatus: string;
}

interface Height {
  iHeightID: number;
  vName: string;
  Centimeters: number;
  eStatus: string;
}

interface MaritalStatus {
  iMaritalStatusID: number;
  vName: string;
  eStatus: string;
}

interface Diet {
  iDietID: number;
  vName: string;
  eStatus: string;
}

interface BodyType {
  ID: number;
  Name: string;
  created_on: string | null;
  modified_on: string | null;
}

interface SkinTone {
  ID: number;
  Name: string;
  created_on: string | null;
  modified_on: string | null;
}

interface EducationLevel {
  iEducationLevelID: number;
  vEducationLevelName: string;
  status: string;
}

interface WorkingAs {
  iWorkingAsID: number;
  vWorkingAsName: string;
  eStatus: string;
}

const UserListApprovedPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [isDisapproveModalOpen, setIsDisapproveModalOpen] = useState(false);
  const [userToDisapprove, setUserToDisapprove] = useState<number | null>(null);
  const [isDisapproving, setIsDisapproving] = useState(false);

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [userToApprove, setUserToApprove] = useState<number | null>(null);
  const [isApproving, setIsApproving] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const [isPhotosModalOpen, setIsPhotosModalOpen] = useState(false);
  const [selectedUserForPhotosId, setSelectedUserForPhotosId] = useState<number | null>(null);

  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [selectedBioUserId, setSelectedBioUserId] = useState<number | null>(null);

  const [isCallNotesModalOpen, setIsCallNotesModalOpen] = useState(false);
  const [selectedCallNoteUserId, setSelectedCallNoteUserId] = useState<number | null>(null);

  const [communities, setCommunities] = useState<Community[]>([]);
  const [heights, setHeights] = useState<Height[]>([]);
  const [maritalStatuses, setMaritalStatuses] = useState<MaritalStatus[]>([]);
  const [diets, setDiets] = useState<Diet[]>([]);
  const [bodyTypes, setBodyTypes] = useState<BodyType[]>([]);
  const [skinTones, setSkinTones] = useState<SkinTone[]>([]);
  const [educationLevels, setEducationLevels] = useState<EducationLevel[]>([]);
  const [workingAsList, setWorkingAsList] = useState<WorkingAs[]>([]);

  
  const initialFilters = {
    firstName: '',
    lastName: '',
    email: '',
    contactNo: '',
    gender: '',
    community: '',
    heightFrom: '',
    heightTo: '',
    ageFrom: '',
    ageTo: '',
    city: '',
    educationLevel: '',
    maritalStatus: '',
    disability: '',
    drink: '',
    smoke: '',
    diet: '',
    bodyType: '',
    skinTone: '',
    workingAs: '',
    annualIncome: '',
    isSubscription: ''
  };

  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  const fetchUsers = async (page: number, currentFilters = appliedFilters) => {
    setIsLoading(true);
    setError('');

    const validFilters = Object.fromEntries(
      Object.entries(currentFilters).filter(([_, v]) => v !== '')
    );
    const hasActiveFilters = Object.keys(validFilters).length > 0;

    try {
      const response = await apiClient.get(`v1/admin/users/approved`, {
        params: {
          page: hasActiveFilters ? 1 : page,
          limit: hasActiveFilters ? 100 : itemsPerPage,
          ...validFilters
        },
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      });
      if (response.data.success) {
        setUsers(response.data.data || []);
        if (!hasActiveFilters && response.data.meta) {
          setTotalPages(response.data.meta.totalPages || 1);
          setTotalItems(response.data.meta.total || 0);
        } else if (!hasActiveFilters) {
          // Fallback if meta is not present
          const count = response.data.data ? response.data.data.length : 0;
          setTotalPages(Math.ceil(count / itemsPerPage) || 1);
          setTotalItems(count);
        }
      } else {
        setError(response.data.message || 'Failed to fetch users');
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
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
        fetchUsers(currentPage, appliedFilters); // Refresh the list
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
        fetchUsers(currentPage, appliedFilters); // Refresh the list
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

  const fetchCommunities = async () => {
    try {
      const response = await apiClient.get('v1/admin/master/master-community', {
        params: { limit: 1000 },
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data.success) {
        setCommunities(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
    }
  };

  const fetchHeights = async () => {
    try {
      const response = await apiClient.get('v1/admin/master/master-heights', {
        params: { limit: 1000 },
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data.success) {
        setHeights(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching heights:', error);
    }
  };

  const fetchMaritalStatuses = async () => {
    try {
      const response = await apiClient.get('v1/admin/master/marital-status', {
        params: { limit: 1000 },
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data.success) {
        setMaritalStatuses(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching marital statuses:', error);
    }
  };

  const fetchDiets = async () => {
    try {
      const response = await apiClient.get('v1/admin/master/master-diet', {
        params: { limit: 1000 },
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data.success) {
        setDiets(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching diets:', error);
    }
  };

  const fetchBodyTypes = async () => {
    try {
      const response = await apiClient.get('v1/admin/master/body-type', {
        params: { limit: 1000 },
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data.success) {
        setBodyTypes(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching body types:', error);
    }
  };

  const fetchSkinTones = async () => {
    try {
      const response = await apiClient.get('v1/admin/master/skin-tone', {
        params: { limit: 1000 },
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data.success) {
        setSkinTones(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching skin tones:', error);
    }
  };

  const fetchEducationLevels = async () => {
    try {
      const response = await apiClient.get('v1/admin/master/education-level', {
        params: { limit: 1000 },
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data.success) {
        setEducationLevels(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching education levels:', error);
    }
  };

  const fetchWorkingAs = async () => {
    try {
      const response = await apiClient.get('v1/admin/master/working-as', {
        params: { limit: 1000 },
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data.success) {
        setWorkingAsList(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching working as:', error);
    }
  };

  useEffect(() => {
    // If we have active filters, we already fetched up to 100 items. 
    // We only refetch if appliedFilters changed, or if we don't have filters and currentPage changed.
    const hasActiveFilters = Object.values(appliedFilters).some(v => v !== '');
    fetchUsers(hasActiveFilters ? 1 : currentPage, appliedFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedFilters, Object.values(appliedFilters).some(v => v !== '') ? 1 : currentPage]);

  useEffect(() => {
    fetchCommunities();
    fetchHeights();
    fetchMaritalStatuses();
    fetchDiets();
    fetchBodyTypes();
    fetchSkinTones();
    fetchEducationLevels();
    fetchWorkingAs();
  }, []);

  const formatDate = (unixTimestamp: any) => {
    if (!unixTimestamp) return '-';
    
    if (typeof unixTimestamp === 'string' && !/^\d+$/.test(unixTimestamp)) {
      const d = new Date(unixTimestamp);
      if (isNaN(d.getTime())) return '-';
      return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
    }

    let timestamp = Number(unixTimestamp);
    if (timestamp < 10000000000) timestamp *= 1000;
    
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '-';
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
  };

  const formatIsoDate = (isoString: any) => {
    return formatDate(isoString);
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
    return 'bg-[#00b562]'; // Default approved-like
  }

  const filteredUsers = users.filter(user => {
    if (appliedFilters.firstName && !(user.First_Name || '').toLowerCase().includes(appliedFilters.firstName.toLowerCase())) return false;
    if (appliedFilters.lastName && !(user.Last_Name || '').toLowerCase().includes(appliedFilters.lastName.toLowerCase())) return false;
    if (appliedFilters.email && !(user.email || '').toLowerCase().includes(appliedFilters.email.toLowerCase())) return false;
    if (appliedFilters.contactNo && !(user.Mobile || '').includes(appliedFilters.contactNo)) return false;
    
    const userGender = typeof user.Gender === 'object' ? user.Gender?.name || user.Gender?.id : (user.Gender || user.gender || user.eGender);
    if (appliedFilters.gender && userGender !== appliedFilters.gender) return false;
    
    const userCommunity = typeof user.iCommunity_ID === 'object' ? (user.iCommunity_ID as any)?.id || (user.iCommunity_ID as any)?.iCommunity_ID : (user.iCommunity_ID || user.community_id || user.communityId);
    if (appliedFilters.community && Number(userCommunity) !== Number(appliedFilters.community)) return false;
    
    // Height range filtering based on Centimeters if available, else fallback to exact match logic
    if (appliedFilters.heightFrom || appliedFilters.heightTo) {
      const hId = typeof user.iHeightID === 'object' ? (user.iHeightID as any)?.id || (user.iHeightID as any)?.iHeightID : user.iHeightID;
      const userHeight = heights.find(h => h.iHeightID === Number(hId));
      
      if (userHeight) {
        if (appliedFilters.heightFrom) {
          const fromH = heights.find(h => h.iHeightID === Number(appliedFilters.heightFrom));
          if (fromH && userHeight.Centimeters < fromH.Centimeters) return false;
        }
        if (appliedFilters.heightTo) {
          const toH = heights.find(h => h.iHeightID === Number(appliedFilters.heightTo));
          if (toH && userHeight.Centimeters > toH.Centimeters) return false;
        }
      } else {
        // Fallback if height data not found
        if (appliedFilters.heightFrom && hId !== Number(appliedFilters.heightFrom)) return false;
      }
    }

    if (appliedFilters.ageFrom && user.Age < Number(appliedFilters.ageFrom)) return false;
    if (appliedFilters.ageTo && user.Age > Number(appliedFilters.ageTo)) return false;

    if (appliedFilters.city && !(user.city as any)?.name?.toLowerCase().includes(appliedFilters.city.toLowerCase()) && !(user.city || user.City || user.vCity || '').toString().toLowerCase().includes(appliedFilters.city.toLowerCase())) return false;
    
    const userEdu = typeof user.iEducationLevelID === 'object' ? (user.iEducationLevelID as any)?.id || (user.iEducationLevelID as any)?.iEducationLevelID : (user.iEducationLevelID || user.educationLevel || user.vEducationLevel);
    const selectedEdu = educationLevels.find(e => e.iEducationLevelID === Number(appliedFilters.educationLevel));
    if (appliedFilters.educationLevel && userEdu !== undefined && userEdu !== null && Number(userEdu) !== Number(appliedFilters.educationLevel) && (!selectedEdu || String(userEdu).toLowerCase() !== String(selectedEdu.vEducationLevelName).toLowerCase())) return false;
    
    const userMarital = typeof user.iMaritalStatusID === 'object' ? (user.iMaritalStatusID as any)?.id : (user.maritalStatus || user.iMaritalStatusID || user.Marital_Status);
    const selectedMarital = maritalStatuses.find(m => m.iMaritalStatusID === Number(appliedFilters.maritalStatus));
    if (appliedFilters.maritalStatus && userMarital !== undefined && userMarital !== null && Number(userMarital) !== Number(appliedFilters.maritalStatus) && (!selectedMarital || String(userMarital).toLowerCase() !== String(selectedMarital.vName).toLowerCase())) return false;
    
    const userDisability = user.disability || user.vDisability;
    if (appliedFilters.disability && userDisability !== undefined && userDisability !== null && userDisability !== appliedFilters.disability) return false;
    
    const userDrink = user.drink || user.vDrink;
    if (appliedFilters.drink && userDrink !== undefined && userDrink !== null && userDrink !== appliedFilters.drink) return false;
    
    const userSmoke = user.smoke || user.vSmoke;
    if (appliedFilters.smoke && userSmoke !== undefined && userSmoke !== null && userSmoke !== appliedFilters.smoke) return false;
    
    const userDiet = typeof user.iDietID === 'object' ? (user.iDietID as any)?.id : (user.iDietID || user.diet || user.vDiet);
    const selectedDiet = diets.find(d => d.iDietID === Number(appliedFilters.diet));
    if (appliedFilters.diet && userDiet !== undefined && userDiet !== null && Number(userDiet) !== Number(appliedFilters.diet) && (!selectedDiet || String(userDiet).toLowerCase() !== String(selectedDiet.vName).toLowerCase())) return false;
    
    const userBodyType = typeof user.iBodyTypeID === 'object' ? (user.iBodyTypeID as any)?.id : (user.iBodyTypeID || user.bodyType || user.vBodyType);
    const selectedBodyType = bodyTypes.find(b => b.ID === Number(appliedFilters.bodyType));
    if (appliedFilters.bodyType && userBodyType !== undefined && userBodyType !== null && Number(userBodyType) !== Number(appliedFilters.bodyType) && (!selectedBodyType || String(userBodyType).toLowerCase() !== String(selectedBodyType.Name).toLowerCase())) return false;
    
    const userSkinTone = typeof user.iSkinToneID === 'object' ? (user.iSkinToneID as any)?.id : (user.iSkinToneID || user.skinTone || user.vSkinTone);
    const selectedSkinTone = skinTones.find(s => s.ID === Number(appliedFilters.skinTone));
    if (appliedFilters.skinTone && userSkinTone !== undefined && userSkinTone !== null && Number(userSkinTone) !== Number(appliedFilters.skinTone) && (!selectedSkinTone || String(userSkinTone).toLowerCase() !== String(selectedSkinTone.Name).toLowerCase())) return false;
    
    const userWorkingAs = typeof user.iWorkingAsID === 'object' ? (user.iWorkingAsID as any)?.id : (user.iWorkingAsID || user.workingAs || user.vWorkingAs);
    const selectedWorkingAs = workingAsList.find(w => w.iWorkingAsID === Number(appliedFilters.workingAs));
    if (appliedFilters.workingAs && userWorkingAs !== undefined && userWorkingAs !== null && Number(userWorkingAs) !== Number(appliedFilters.workingAs) && (!selectedWorkingAs || String(userWorkingAs).toLowerCase() !== String(selectedWorkingAs.vWorkingAsName).toLowerCase())) return false;
    
    const userIncome = typeof user.iAnnualIncomeID === 'object' ? (user.iAnnualIncomeID as any)?.name : (user.annualIncome || user.iAnnualIncomeID || user.vAnnualIncome);
    if (appliedFilters.annualIncome && userIncome !== undefined && userIncome !== null && String(userIncome).toLowerCase() !== String(appliedFilters.annualIncome).toLowerCase()) return false;
    
    const userSubscription = user.isSubscription || user.Subscription || user.eSubscriptionStatus || user.subscriptionStatus;
    if (appliedFilters.isSubscription && userSubscription !== undefined && userSubscription !== null && String(userSubscription).toUpperCase() !== String(appliedFilters.isSubscription).toUpperCase()) return false;

    return true;
  });

  const hasActiveFilters = Object.values(appliedFilters).some(v => v !== '');
  const displayUsers = hasActiveFilters ? filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : filteredUsers;
  const displayTotalPages = hasActiveFilters ? Math.ceil(filteredUsers.length / itemsPerPage) || 1 : totalPages;
  const displayTotalItems = hasActiveFilters ? filteredUsers.length : totalItems;

  return (
    <div className="flex flex-col text-sm w-full">
      {/* Search Filters Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-[15px] font-medium text-gray-800">Search Filters</h2>
          <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-base font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all whitespace-nowrap">
            Frontend Admin login
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <input value={filters.firstName} onChange={e => setFilters({...filters, firstName: e.target.value})} type="text" placeholder="First Name" className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full" />
            <input value={filters.lastName} onChange={e => setFilters({...filters, lastName: e.target.value})} type="text" placeholder="Last Name" className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full" />
            <input value={filters.email} onChange={e => setFilters({...filters, email: e.target.value})} type="text" placeholder="Email" className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full" />
            <input value={filters.contactNo} onChange={e => setFilters({...filters, contactNo: e.target.value})} type="text" placeholder="Contact No" className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full" />
            <select value={filters.gender} onChange={e => setFilters({...filters, gender: e.target.value})} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Select a Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
            <select value={filters.community} onChange={e => setFilters({...filters, community: e.target.value})} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Select a Community</option>
              {communities.map((community) => (
                <option key={community.iCommunity_ID} value={community.iCommunity_ID}>
                  {community.vName}
                </option>
              ))}
            </select>

            <select value={filters.heightFrom} onChange={e => setFilters({...filters, heightFrom: e.target.value})} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Height From</option>
              {heights.map((h) => (
                <option key={h.iHeightID} value={h.iHeightID}>
                  {h.vName} / {Math.round(h.Centimeters)} cm
                </option>
              ))}
            </select>
            <select value={filters.heightTo} onChange={e => setFilters({...filters, heightTo: e.target.value})} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Height To</option>
              {heights.map((h) => (
                <option key={h.iHeightID} value={h.iHeightID}>
                  {h.vName} / {Math.round(h.Centimeters)} cm
                </option>
              ))}
            </select>
            <select value={filters.ageFrom} onChange={e => setFilters({...filters, ageFrom: e.target.value})} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Age From</option>
              {Array.from({ length: 82 }, (_, i) => i + 18).map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </select>
            <select value={filters.ageTo} onChange={e => setFilters({...filters, ageTo: e.target.value})} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Age To</option>
              {Array.from({ length: 82 }, (_, i) => i + 18).map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </select>
            <input value={filters.city} onChange={e => setFilters({...filters, city: e.target.value})} type="text" placeholder="City" className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full" />
            
            <select value={filters.educationLevel} onChange={e => setFilters({...filters, educationLevel: e.target.value})} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Education Level</option>
              {educationLevels.map((level) => (
                <option key={level.iEducationLevelID} value={level.iEducationLevelID}>
                  {level.vEducationLevelName}
                </option>
              ))}
            </select>

            <select value={filters.maritalStatus} onChange={e => setFilters({...filters, maritalStatus: e.target.value})} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Marital Status</option>
              {maritalStatuses.map((status) => (
                <option key={status.iMaritalStatusID} value={status.iMaritalStatusID}>
                  {status.vName}
                </option>
              ))}
            </select>
            <select value={filters.disability} onChange={e => setFilters({...filters, disability: e.target.value})} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Disability</option>
              <option value="None">None</option>
              <option value="Physical Disability">Physical Disability</option>
            </select>
            <select value={filters.drink} onChange={e => setFilters({...filters, drink: e.target.value})} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Drink</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Occasionally">Occasionally</option>
            </select>
            <select value={filters.smoke} onChange={e => setFilters({...filters, smoke: e.target.value})} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Smoke</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Occasionally">Occasionally</option>
            </select>
            <select value={filters.diet} onChange={e => setFilters({...filters, diet: e.target.value})} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Diet</option>
              {diets.map((diet) => (
                <option key={diet.iDietID} value={diet.iDietID}>
                  {diet.vName}
                </option>
              ))}
            </select>
            <select value={filters.bodyType} onChange={e => setFilters({...filters, bodyType: e.target.value})} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Body Type</option>
              {bodyTypes.map((type) => (
                <option key={type.ID} value={type.ID}>
                  {type.Name}
                </option>
              ))}
            </select>

            <select value={filters.skinTone} onChange={e => setFilters({...filters, skinTone: e.target.value})} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Skin Tone</option>
              {skinTones.map((tone) => (
                <option key={tone.ID} value={tone.ID}>
                  {tone.Name}
                </option>
              ))}
            </select>

            <select value={filters.workingAs} onChange={e => setFilters({...filters, workingAs: e.target.value})} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Working As</option>
              {workingAsList.map((job) => (
                <option key={job.iWorkingAsID} value={job.iWorkingAsID}>
                  {job.vWorkingAsName}
                </option>
              ))}
            </select>

            <select value={filters.annualIncome} onChange={e => setFilters({...filters, annualIncome: e.target.value})} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Annual Income</option>
              <option value="Upto INR 1 Lakh">Upto INR 1 Lakh</option>
              <option value="INR 1 Lakh to 2 Lakh">INR 1 Lakh to 2 Lakh</option>
              <option value="INR 2 Lakh to 4 Lakh">INR 2 Lakh to 4 Lakh</option>
              <option value="INR 4 Lakh to 7 Lakh">INR 4 Lakh to 7 Lakh</option>
              <option value="INR 7 Lakh to 10 Lakh">INR 7 Lakh to 10 Lakh</option>
              <option value="INR 10 Lakh to 15 Lakh">INR 10 Lakh to 15 Lakh</option>
              <option value="INR 15 Lakh to 20 Lakh">INR 15 Lakh to 20 Lakh</option>
              <option value="INR 20 Lakh to 30 Lakh">INR 20 Lakh to 30 Lakh</option>
              <option value="INR 30 Lakh to 50 Lakh">INR 30 Lakh to 50 Lakh</option>
              <option value="INR 50 Lakh to 75 Lakh">INR 50 Lakh to 75 Lakh</option>
              <option value="INR 75 Lakh to 1 Crore">INR 75 Lakh to 1 Crore</option>
              <option value="INR 1 Crore & above">INR 1 Crore & above</option>
              <option value="Not applicable">Not applicable</option>
              <option value="Dont want to specify">Dont want to specify</option>
            </select>
            <select value={filters.isSubscription} onChange={e => setFilters({...filters, isSubscription: e.target.value})} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Is Subscription?</option>
              <option value="FREE">FREE</option>
              <option value="PAID">PAID</option>
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button 
              onClick={() => {
                setFilters(initialFilters);
                setAppliedFilters(initialFilters);
                setCurrentPage(1);
                fetchUsers(1, initialFilters);
              }}
              className="px-4 py-2 border border-gray-200 text-gray-600 rounded text-sm hover:bg-gray-50 transition-colors">
              Clear All
            </button>
            <button 
              onClick={() => {
                setAppliedFilters(filters);
                setCurrentPage(1);
                fetchUsers(1, filters);
              }}
              className="px-6 py-2 bg-[#3b82f6] text-white rounded text-sm font-medium hover:bg-blue-600 transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden border border-gray-100">
        {!isLoading && !error && displayTotalItems > 0 && (
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, displayTotalItems)} of <span className="font-semibold text-gray-800">{displayTotalItems.toLocaleString()}</span> items.
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] min-w-max">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-3 py-4 font-semibold text-[#1e40af] align-top w-10 text-center">#</th>
                <th className="px-3 py-4 font-semibold text-[#1e40af] align-top">First Name</th>
                <th className="px-3 py-4 font-semibold text-[#1e40af] align-top">Last Name</th>
                <th className="px-3 py-4 font-semibold text-[#1e40af] align-top">Email</th>
                <th className="px-3 py-4 font-semibold text-[#1e40af] align-top">Mobile</th>
                <th className="px-3 py-4 font-semibold text-[#1e40af] align-top">Height</th>
                <th className="px-3 py-4 font-semibold text-[#1e40af] align-top">Age</th>
                <th className="px-3 py-4 font-semibold text-[#1e40af] align-top">
                  Frontend<br/>Profile
                </th>
                <th className="px-3 py-4 font-semibold text-[#1e40af] align-top text-center">
                  No. Int<br/>Rec
                </th>
                <th className="px-3 py-4 font-semibold text-[#1e40af] align-top text-center">
                  No. Int Sent
                </th>
                <th className="px-3 py-4 font-semibold text-[#1e40af] align-top text-center">Call Notes</th>
                <th className="px-3 py-4 font-semibold text-[#1e40af] align-top">Subscription</th>
                <th className="px-3 py-4 font-semibold text-[#1e40af] align-top">Last Login<br/>Date</th>
                <th className="px-3 py-4 font-semibold text-[#1e40af] align-top">Date of<br/>registration</th>
                <th className="px-3 py-4 font-semibold text-[#1e40af] align-top">Status</th>
                <th className="px-3 py-4 font-semibold text-[#1e40af] align-top"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={16} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-500 mb-2" />
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={16} className="px-4 py-8 text-center text-red-500 bg-red-50/50">
                    {typeof error === 'object' ? JSON.stringify(error) : String(error)}
                  </td>
                </tr>
              ) : displayUsers.length === 0 ? (
                <tr>
                  <td colSpan={16} className="px-4 py-8 text-center text-gray-500 font-medium">
                    No approved users found matching filters.
                  </td>
                </tr>
              ) : (
                displayUsers.map((user, index) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-4 text-gray-500 text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-3 py-4 text-gray-700">{user.First_Name || '-'}</td>
                    <td className="px-3 py-4 text-gray-700">{user.Last_Name || '-'}</td>
                    <td className="px-3 py-4">
                      <div className="text-[#3b82f6] hover:underline cursor-pointer">{user.email || '-'}</div>
                      {user.eEmailVerifiedStatus === 'Yes' && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-1" />}
                    </td>
                    <td className="px-3 py-4">
                      <div className="text-[#3b82f6] hover:underline cursor-pointer">{user.Mobile || '-'}</div>
                      {user.ePhoneVerifiedStatus === 'Yes' && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-1" />}
                    </td>
                    <td className="px-3 py-4 text-gray-600">
                      {typeof user.iHeightID === 'object' && user.iHeightID !== null 
                        ? ((user.iHeightID as any).name || (user.iHeightID as any).vName || '-')
                        : (user.iHeightID || '-')}
                    </td>
                    <td className="px-3 py-4 text-gray-600">{user.Age || '-'}</td>
                    <td className="px-3 py-4 text-center">
                      <div className="text-blue-400 hover:underline cursor-pointer text-[10px]">Visit</div>
                      <div className="text-gray-400 text-[10px] my-0.5">OR</div>
                      <div className="text-blue-400 hover:underline cursor-pointer text-[10px]">Copy</div>
                    </td>
                    <td className="px-3 py-4 text-gray-600 text-center">0</td>
                    <td className="px-3 py-4 text-gray-600 text-center">0</td>
                    <td className="px-3 py-4 text-center">
                      <button 
                        onClick={() => {
                          setSelectedCallNoteUserId(user.id);
                          setIsCallNotesModalOpen(true);
                        }}
                        className="bg-gray-100 border border-gray-200 text-gray-600 px-3 py-1 rounded text-[10px] hover:bg-gray-200"
                      >
                        Notes
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      <div className={`p-2 w-28 h-12 flex flex-col justify-center bg-transparent text-gray-700`}>
                        <div className="text-gray-600">-</div>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-gray-600">{formatIsoDate(user.LastLoginTime)}</td>
                    <td className="px-3 py-4 text-gray-600">{formatDate(user.created_at)}</td>
                    <td className="px-3 py-4">
                      <span className={`text-white text-xs font-medium px-3 py-1.5 rounded inline-block min-w-[100px] text-center ${getStatusColor(user.status)}`}>
                        {formatStatus(user.status) === 'Active' || formatStatus(user.status) === 'Approved' ? 'Approved' : formatStatus(user.status)}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => {
                            setSelectedUserId(user.id);
                            setIsViewModalOpen(true);
                          }}
                          className="text-blue-500 rounded p-1 hover:bg-blue-50" 
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {formatStatus(user.status) === 'Disapproved' || formatStatus(user.status) === 'Blocked' || formatStatus(user.status) === 'Deleted' ? (
                          <button 
                            onClick={() => handleApproveClick(user.id)}
                            className="text-green-500 rounded p-1 hover:bg-green-50" 
                            title="Approve"
                          >
                            <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleDisapproveClick(user.id)}
                            className="text-red-500 rounded p-1 hover:bg-red-50" 
                            title="Disapprove"
                          >
                            <XCircle className="w-4 h-4" strokeWidth={2.5} />
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            setSelectedUserForPhotosId(user.id);
                            setIsPhotosModalOpen(true);
                          }}
                          className="text-amber-500 rounded p-1 hover:bg-amber-50" 
                          title="Image"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedBioUserId(user.id);
                            setIsBioModalOpen(true);
                          }}
                          className="text-blue-400 rounded p-1 hover:bg-blue-50" 
                          title="About User"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!isLoading && !error && displayUsers.length > 0 && (
          <Pagination 
            totalPages={displayTotalPages}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>

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
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-center text-gray-900 mb-2">Disapprove User</h3>
              <p className="text-sm text-center text-gray-500">
                Are you sure you want to disapprove this user? Their profile will no longer be visible to others.
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

      {/* View User Modal */}
      <UserViewModal 
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedUserId(null);
        }}
        userId={selectedUserId || 0}
      />

      {/* User Photos Modal */}
      <UserPhotosModal
        isOpen={isPhotosModalOpen}
        onClose={() => {
          setIsPhotosModalOpen(false);
          setSelectedUserForPhotosId(null);
        }}
        userId={selectedUserForPhotosId || 0}
        hideApprovalButtons={true}
      />

      {/* User Bio Modal */}
      <UserBioModal 
        isOpen={isBioModalOpen}
        onClose={() => {
          setIsBioModalOpen(false);
          setSelectedBioUserId(null);
        }}
        userId={selectedBioUserId || 0}
        hideApprovalButtons={true}
      />

      {/* Call Notes Modal */}
      <CallNotesModal
        isOpen={isCallNotesModalOpen}
        onClose={() => {
          setIsCallNotesModalOpen(false);
          setSelectedCallNoteUserId(null);
        }}
        userId={selectedCallNoteUserId || 0}
      />
    </div>
  );
};

export default UserListApprovedPage;
