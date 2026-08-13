import React, { useState, useEffect } from 'react';
import { Eye, FileText, Image as ImageIcon, CheckCircle2, Check, Loader2, AlertCircle } from 'lucide-react';
import Pagination from '../components/common/Pagination';
import UserViewModal from '../components/common/UserViewModal';
import UserPhotosModal from '../components/common/UserPhotosModal';
import UserBioModal from '../components/common/UserBioModal';
import CallNotesModal from '../components/common/CallNotesModal';
import apiClient from '../services/apiClient';

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

interface EducationLevel {
  iEducationLevelID: number;
  vEducationLevelName: string;
  status: string;
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
}

interface SkinTone {
  ID: number;
  Name: string;
}

interface WorkingAs {
  iWorkingAsID: number;
  vWorkingAsName: string;
  eStatus: string;
}

interface AnnualIncome {
  iAnnualIncomeID: number;
  vAnnualIncome: string;
  vStatus: string;
}

interface User {
  id: number;
  First_Name: string | null;
  Last_Name: string | null;
  email: string | null;
  Mobile: string | null;
  Age: number | null;
  iHeightID: { id: number; name: string | null } | null;
  eEmailVerifiedStatus: string;
  ePhoneVerifiedStatus: string;
  LastLoginTime: string | null;
  created_at: string | null;
  status: number | string | null;
  Gender?: string | null;
  iCommunity_ID?: any;
  iEducationLevelID?: any;
  iMaritalStatusID?: any;
  iDietID?: any;
  iBodyTypeID?: any;
  iSkinToneID?: any;
  iWorkingAsID?: any;
  iAnnualIncomeID?: any;
}

const UserListPendingApprovalPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [filters, setFilters] = useState({
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
    isSubscription: '',
  });

  const [appliedFilters, setAppliedFilters] = useState({
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
    isSubscription: '',
  });

  const [communities, setCommunities] = useState<Community[]>([]);
  const [heights, setHeights] = useState<Height[]>([]);
  const [educationLevels, setEducationLevels] = useState<EducationLevel[]>([]);
  const [maritalStatuses, setMaritalStatuses] = useState<MaritalStatus[]>([]);
  const [diets, setDiets] = useState<Diet[]>([]);
  const [bodyTypes, setBodyTypes] = useState<BodyType[]>([]);
  const [skinTones, setSkinTones] = useState<SkinTone[]>([]);
  const [workingAsList, setWorkingAsList] = useState<WorkingAs[]>([]);
  const [annualIncomes, setAnnualIncomes] = useState<AnnualIncome[]>([]);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [userToApprove, setUserToApprove] = useState<number | null>(null);
  const [isApproving, setIsApproving] = useState(false);

  const [isPhotosModalOpen, setIsPhotosModalOpen] = useState(false);
  const [selectedUserForPhotosId, setSelectedUserForPhotosId] = useState<number | null>(null);

  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [selectedBioUserId, setSelectedBioUserId] = useState<number | null>(null);

  const [isCallNotesModalOpen, setIsCallNotesModalOpen] = useState(false);
  const [selectedCallNoteUserId, setSelectedCallNoteUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchCommunities();
    fetchHeights();
    fetchEducationLevels();
    fetchMaritalStatuses();
    fetchDiets();
    fetchBodyTypes();
    fetchSkinTones();
    fetchWorkingAsList();
    fetchAnnualIncomes();
  }, []);

  useEffect(() => {
    // If we have active filters, we already fetched up to 100 items. 
    // We only refetch if appliedFilters changed, or if we don't have filters and currentPage changed.
    const hasActiveFilters = Object.values(appliedFilters).some(v => v !== '');
    fetchUsers(hasActiveFilters ? 1 : currentPage, appliedFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedFilters, Object.values(appliedFilters).some(v => v !== '') ? 1 : currentPage]);

  const fetchAnnualIncomes = async () => {
    try {
      const response = await apiClient.get('v1/admin/master/annual-income', {
        params: { limit: 1000 },
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data.success) {
        setAnnualIncomes(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching annual incomes:', err);
    }
  };

  const fetchWorkingAsList = async () => {
    try {
      const response = await apiClient.get('v1/admin/master/working-as', {
        params: { limit: 10000 },
        headers: { 'bypass-tunnel-reminder': 'true' }
      });
      if (response.data.success) {
        setWorkingAsList(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching working as list:', err);
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
    } catch (err) {
      console.error('Error fetching skin tones:', err);
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
    } catch (err) {
      console.error('Error fetching body types:', err);
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
    } catch (err) {
      console.error('Error fetching diets:', err);
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
    } catch (err) {
      console.error('Error fetching marital statuses:', err);
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
    } catch (err) {
      console.error('Error fetching education levels:', err);
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
    } catch (err) {
      console.error('Error fetching heights:', err);
    }
  };

  const fetchCommunities = async () => {
    try {
      const response = await apiClient.get('v1/admin/master/master-community', {
        params: { limit: 1000 },
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      });
      if (response.data.success) {
        setCommunities(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching communities:', err);
    }
  };

  const fetchUsers = async (page: number = 1, currentFilters = appliedFilters) => {
    setIsLoading(true);
    setError('');

    const validFilters = Object.fromEntries(
      Object.entries(currentFilters).filter(([_, v]) => v !== '')
    );
    const hasActiveFilters = Object.keys(validFilters).length > 0;

    try {
      const response = await apiClient.get('v1/admin/users/in-approval', {
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
          const count = response.data.data ? response.data.data.length : 0;
          setTotalPages(Math.ceil(count / itemsPerPage) || 1);
          setTotalItems(count);
        }
      } else {
        setError(response.data.message || 'Failed to load users');
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while fetching users');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  const handleSearch = () => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  };

  const handleClear = () => {
    const emptyFilters = {
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
      isSubscription: '',
    };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setCurrentPage(1);
  };

  const handleApproveClick = (id: number) => {
    setUserToApprove(id);
    setIsApproveModalOpen(true);
  };

  const handleApproveConfirm = async () => {
    if (!userToApprove) return;
    setIsApproving(true);
    try {
      const response = await apiClient.patch(`v1/admin/users/${userToApprove}/status`, {
        action: 'approve'
      });
      if (response.data.success) {
        setUsers(users.filter(u => u.id !== userToApprove));
        setIsApproveModalOpen(false);
        setUserToApprove(null);
      } else {
        alert(response.data?.message || 'Failed to approve user');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Failed to approve user');
    } finally {
      setIsApproving(false);
    }
  };

  const filteredUsers = users.filter(user => {
    if (appliedFilters.firstName && !user.First_Name?.toLowerCase().includes(appliedFilters.firstName.toLowerCase())) return false;
    if (appliedFilters.lastName && !user.Last_Name?.toLowerCase().includes(appliedFilters.lastName.toLowerCase())) return false;
    if (appliedFilters.email && !user.email?.toLowerCase().includes(appliedFilters.email.toLowerCase())) return false;
    if (appliedFilters.contactNo && !user.Mobile?.includes(appliedFilters.contactNo)) return false;
    if (appliedFilters.gender && user.Gender?.toUpperCase() !== appliedFilters.gender.toUpperCase()) return false;
    
    const userCommunity = typeof user.iCommunity_ID === 'object' ? (user.iCommunity_ID as any)?.id || (user.iCommunity_ID as any)?.iCommunity_ID : (user.iCommunity_ID || (user as any).community_id || (user as any).communityId);
    if (appliedFilters.community && Number(userCommunity) !== Number(appliedFilters.community)) return false;
    
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
        if (appliedFilters.heightFrom && hId !== Number(appliedFilters.heightFrom)) return false;
      }
    }
    
    if (appliedFilters.ageFrom && user.Age && user.Age < Number(appliedFilters.ageFrom)) return false;
    if (appliedFilters.ageTo && user.Age && user.Age > Number(appliedFilters.ageTo)) return false;
    
    if (appliedFilters.city && !((user as any).city?.name || (user as any).city || (user as any).City || (user as any).vCity || '').toString().toLowerCase().includes(appliedFilters.city.toLowerCase())) return false;
    
    const userEdu = typeof user.iEducationLevelID === 'object' ? (user.iEducationLevelID as any)?.id || (user.iEducationLevelID as any)?.iEducationLevelID : (user.iEducationLevelID || (user as any).educationLevel || (user as any).vEducationLevel);
    const selectedEdu = educationLevels.find(e => e.iEducationLevelID === Number(appliedFilters.educationLevel));
    if (appliedFilters.educationLevel && userEdu !== undefined && userEdu !== null && Number(userEdu) !== Number(appliedFilters.educationLevel) && (!selectedEdu || String(userEdu).toLowerCase() !== String(selectedEdu.vEducationLevelName).toLowerCase())) return false;
    
    const userMarital = typeof user.iMaritalStatusID === 'object' ? (user.iMaritalStatusID as any)?.id : (user.iMaritalStatusID || (user as any).maritalStatus || (user as any).Marital_Status);
    const selectedMarital = maritalStatuses.find(m => m.iMaritalStatusID === Number(appliedFilters.maritalStatus));
    if (appliedFilters.maritalStatus && userMarital !== undefined && userMarital !== null && Number(userMarital) !== Number(appliedFilters.maritalStatus) && (!selectedMarital || String(userMarital).toLowerCase() !== String(selectedMarital.vName).toLowerCase())) return false;
    
    const userDisability = (user as any).disability || (user as any).vDisability;
    if (appliedFilters.disability && userDisability !== undefined && userDisability !== null && userDisability !== appliedFilters.disability) return false;
    
    const userDrink = (user as any).drink || (user as any).vDrink;
    if (appliedFilters.drink && userDrink !== undefined && userDrink !== null && String(userDrink).toLowerCase() !== appliedFilters.drink.toLowerCase()) return false;
    
    const userSmoke = (user as any).smoke || (user as any).vSmoke;
    if (appliedFilters.smoke && userSmoke !== undefined && userSmoke !== null && String(userSmoke).toLowerCase() !== appliedFilters.smoke.toLowerCase()) return false;
    
    const userDietId = typeof user.iDietID === 'object' ? (user.iDietID as any)?.id : (user.iDietID || (user as any).diet || (user as any).vDiet);
    const selectedDiet = diets.find(d => d.iDietID === Number(appliedFilters.diet));
    if (appliedFilters.diet && userDietId !== undefined && userDietId !== null && Number(userDietId) !== Number(appliedFilters.diet) && (!selectedDiet || String(userDietId).toLowerCase() !== String(selectedDiet.vName).toLowerCase())) return false;
    
    const userBodyType = typeof user.iBodyTypeID === 'object' ? (user.iBodyTypeID as any)?.id : (user.iBodyTypeID || (user as any).bodyType || (user as any).vBodyType || (user as any).Body_Type);
    const selectedBodyType = bodyTypes.find(b => b.ID === Number(appliedFilters.bodyType));
    if (appliedFilters.bodyType && userBodyType !== undefined && userBodyType !== null && Number(userBodyType) !== Number(appliedFilters.bodyType) && (!selectedBodyType || String(userBodyType).toLowerCase() !== String(selectedBodyType.Name).toLowerCase())) return false;
    
    const userSkinTone = typeof user.iSkinToneID === 'object' ? (user.iSkinToneID as any)?.id : (user.iSkinToneID || (user as any).skinTone || (user as any).vSkinTone || (user as any).Skin_Tone);
    const selectedSkinTone = skinTones.find(s => s.ID === Number(appliedFilters.skinTone));
    if (appliedFilters.skinTone && userSkinTone !== undefined && userSkinTone !== null && Number(userSkinTone) !== Number(appliedFilters.skinTone) && (!selectedSkinTone || String(userSkinTone).toLowerCase() !== String(selectedSkinTone.Name).toLowerCase())) return false;
    
    const userWorkingAs = typeof user.iWorkingAsID === 'object' ? (user.iWorkingAsID as any)?.id : (user.iWorkingAsID || (user as any).workingAs || (user as any).vWorkingAs);
    const selectedWorkingAs = workingAsList.find(w => w.iWorkingAsID === Number(appliedFilters.workingAs));
    if (appliedFilters.workingAs && userWorkingAs !== undefined && userWorkingAs !== null && Number(userWorkingAs) !== Number(appliedFilters.workingAs) && (!selectedWorkingAs || String(userWorkingAs).toLowerCase() !== String(selectedWorkingAs.vWorkingAsName).toLowerCase())) return false;
    
    const userAnnualIncome = typeof user.iAnnualIncomeID === 'object' ? (user.iAnnualIncomeID as any)?.id : (user.iAnnualIncomeID || (user as any).annualIncome || (user as any).vAnnualIncome);
    const selectedAnnualIncome = annualIncomes.find(a => a.iAnnualIncomeID === Number(appliedFilters.annualIncome));
    if (appliedFilters.annualIncome && userAnnualIncome !== undefined && userAnnualIncome !== null && Number(userAnnualIncome) !== Number(appliedFilters.annualIncome) && (!selectedAnnualIncome || String(userAnnualIncome).toLowerCase() !== String(selectedAnnualIncome.vAnnualIncome).toLowerCase())) return false;
    
    const userSubscription = (user as any).isSubscription || (user as any).Subscription || (user as any).eSubscriptionStatus || (user as any).subscriptionStatus;
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
  
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <input type="text" value={filters.firstName} onChange={(e) => setFilters({ ...filters, firstName: e.target.value })} placeholder="First Name" className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full" />
            <input type="text" value={filters.lastName} onChange={(e) => setFilters({ ...filters, lastName: e.target.value })} placeholder="Last Name" className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full" />
            <input type="text" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} placeholder="Email" className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full" />
            <input type="text" value={filters.contactNo} onChange={(e) => setFilters({ ...filters, contactNo: e.target.value })} placeholder="Contact No" className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full" />
            <select value={filters.gender} onChange={(e) => setFilters({ ...filters, gender: e.target.value })} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Select a Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
            <select value={filters.community} onChange={(e) => setFilters({ ...filters, community: e.target.value })} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Select a Community</option>
              {communities.map((community) => (
                <option key={community.iCommunity_ID} value={community.iCommunity_ID}>
                  {community.vName}
                </option>
              ))}
            </select>

            <select value={filters.heightFrom} onChange={(e) => setFilters({ ...filters, heightFrom: e.target.value })} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Height From</option>
              {heights.map((height) => (
                <option key={height.iHeightID} value={height.iHeightID}>
                  {height.vName}
                </option>
              ))}
            </select>
            <select value={filters.heightTo} onChange={(e) => setFilters({ ...filters, heightTo: e.target.value })} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Height To</option>
              {heights.map((height) => (
                <option key={height.iHeightID} value={height.iHeightID}>
                  {height.vName}
                </option>
              ))}
            </select>
            <select value={filters.ageFrom} onChange={(e) => setFilters({ ...filters, ageFrom: e.target.value })} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Age From</option>
              {Array.from({ length: 83 }, (_, i) => i + 18).map(age => (
                <option key={`from-${age}`} value={age}>{age}</option>
              ))}
            </select>
            <select value={filters.ageTo} onChange={(e) => setFilters({ ...filters, ageTo: e.target.value })} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Age To</option>
              {Array.from({ length: 83 }, (_, i) => i + 18).map(age => (
                <option key={`to-${age}`} value={age}>{age}</option>
              ))}
            </select>
            <input type="text" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} placeholder="City" className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full" />
            <select value={filters.educationLevel} onChange={(e) => setFilters({ ...filters, educationLevel: e.target.value })} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Education Level</option>
              {educationLevels.map((edu) => (
                <option key={edu.iEducationLevelID} value={edu.iEducationLevelID}>
                  {edu.vEducationLevelName}
                </option>
              ))}
            </select>

            <select value={filters.maritalStatus} onChange={(e) => setFilters({ ...filters, maritalStatus: e.target.value })} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Marital Status</option>
              {maritalStatuses.map((m) => (
                <option key={m.iMaritalStatusID} value={m.iMaritalStatusID}>
                  {m.vName}
                </option>
              ))}
            </select>
            <select value={filters.disability} onChange={(e) => setFilters({ ...filters, disability: e.target.value })} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Disability</option>
              <option value="None">None</option>
              <option value="Physical Disability">Physical Disability</option>
            </select>
            <select value={filters.drink} onChange={(e) => setFilters({ ...filters, drink: e.target.value })} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Drink</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Occasionally">Occasionally</option>
            </select>
            <select value={filters.smoke} onChange={(e) => setFilters({ ...filters, smoke: e.target.value })} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Smoke</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Occasionally">Occasionally</option>
            </select>
            <select value={filters.diet} onChange={(e) => setFilters({ ...filters, diet: e.target.value })} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Diet</option>
              {diets.map((d) => (
                <option key={d.iDietID} value={d.iDietID}>
                  {d.vName}
                </option>
              ))}
            </select>
            <select value={filters.bodyType} onChange={(e) => setFilters({ ...filters, bodyType: e.target.value })} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Body Type</option>
              {bodyTypes.map((b) => (
                <option key={b.ID} value={b.ID}>
                  {b.Name}
                </option>
              ))}
            </select>

            <select value={filters.skinTone} onChange={(e) => setFilters({ ...filters, skinTone: e.target.value })} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Skin Tone</option>
              {skinTones.map((s) => (
                <option key={s.ID} value={s.ID}>
                  {s.Name}
                </option>
              ))}
            </select>
            <select value={filters.workingAs} onChange={(e) => setFilters({ ...filters, workingAs: e.target.value })} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Working as</option>
              {workingAsList.map((w) => (
                <option key={w.iWorkingAsID} value={w.iWorkingAsID}>
                  {w.vWorkingAsName}
                </option>
              ))}
            </select>
            <select value={filters.annualIncome} onChange={(e) => setFilters({ ...filters, annualIncome: e.target.value })} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Annual Income</option>
              {annualIncomes.map((a) => (
                <option key={a.iAnnualIncomeID} value={a.iAnnualIncomeID}>
                  {a.vAnnualIncome}
                </option>
              ))}
            </select>
            <select value={filters.isSubscription} onChange={(e) => setFilters({ ...filters, isSubscription: e.target.value })} className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option value="">Is Subscription?</option>
              <option value="FREE">FREE</option>
              <option value="PAID">PAID</option>
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={handleClear} className="px-4 py-2 border border-gray-200 text-gray-600 rounded text-sm hover:bg-gray-50 transition-colors">
              Clear All
            </button>
            <button onClick={handleSearch} className="px-6 py-2 bg-[#3b82f6] text-white rounded text-sm font-medium hover:bg-blue-600 transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 mb-4">
        Showing 1-{filteredUsers.length} of <span className="font-semibold text-gray-800">{users.length}</span> items.
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden border border-gray-100">
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
                <th className="px-3 py-4 font-semibold text-[#1e40af] align-top text-center">
                  No. Int<br/>Rec
                </th>
                <th className="px-3 py-4 font-semibold text-[#1e40af] align-top text-center">
                  No. Int Sent
                </th>
                <th className="px-3 py-4 font-semibold text-[#1e40af] align-top text-center">Call Notes</th>
                <th className="px-3 py-4 font-semibold text-[#1e40af] align-top">Subscription</th>
                <th className="px-3 py-4 font-semibold text-[#1e40af] align-top">Last Login Date</th>
                <th className="px-3 py-4 font-semibold text-[#1e40af] align-top">Date of registration</th>
                <th className="px-3 py-4 font-semibold text-[#1e40af] align-top">Status</th>
                <th className="px-3 py-4 font-semibold text-[#1e40af] align-top"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={15} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-500">Loading pending users...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={15} className="px-6 py-12 text-center">
                    <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
                    <p className="text-red-500 mb-4">{error}</p>
                    <button 
                      onClick={() => fetchUsers()} 
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                    >
                      Try Again
                    </button>
                  </td>
                </tr>
              ) : displayUsers.length === 0 ? (
                <tr>
                  <td colSpan={15} className="px-6 py-12 text-center text-gray-500">
                    No pending approval users found
                  </td>
                </tr>
              ) : (
                displayUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-4 text-gray-500 text-center">{user.id}</td>
                    <td className="px-3 py-4 text-gray-700">{user.First_Name || 'N/A'}</td>
                    <td className="px-3 py-4 text-gray-700">{user.Last_Name || 'N/A'}</td>
                    <td className="px-3 py-4">
                      <div className="text-[#3b82f6] hover:underline cursor-pointer">{user.email || 'N/A'}</div>
                      {user.eEmailVerifiedStatus === 'Yes' && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-1" />}
                    </td>
                    <td className="px-3 py-4">
                      <div className="text-[#3b82f6] hover:underline cursor-pointer">{user.Mobile || 'N/A'}</div>
                      {user.ePhoneVerifiedStatus === 'Yes' && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-1" />}
                    </td>
                    <td className="px-3 py-4 text-gray-600">{user.iHeightID?.name || 'N/A'}</td>
                    <td className="px-3 py-4 text-gray-600">{user.Age || 'N/A'}</td>
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
                      <div className="p-2 w-24 h-11 flex flex-col justify-center bg-transparent text-gray-700">
                        N/A
                      </div>
                    </td>
                    <td className="px-3 py-4 text-gray-600">{formatDate(user.LastLoginTime)}</td>
                    <td className="px-3 py-4 text-gray-600">{formatDate(user.created_at)}</td>
                    <td className="px-3 py-4">
                      <span className="bg-amber-500 text-white text-[10px] font-medium px-2.5 py-1.5 rounded">
                        Pending
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-1.5 text-blue-500">
                        <button 
                          onClick={() => {
                            setSelectedUserId(user.id);
                            setIsViewModalOpen(true);
                          }}
                          className="rounded p-1 hover:bg-blue-50 transition-colors" 
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleApproveClick(user.id)}
                          className="rounded p-1 hover:bg-green-50 text-[#00b562] transition-colors" 
                          title="Approve"
                        >
                          <Check className="w-5 h-5" strokeWidth={3} />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedUserForPhotosId(user.id);
                            setIsPhotosModalOpen(true);
                          }}
                          className="rounded p-1 hover:bg-blue-50 transition-colors" 
                          title="Image"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedBioUserId(user.id);
                            setIsBioModalOpen(true);
                          }}
                          className="rounded p-1 hover:bg-blue-50 transition-colors" 
                          title="Details"
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
            currentPage={currentPage}
            totalPages={displayTotalPages}
            onPageChange={setCurrentPage}
            infoText={`Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, displayTotalItems)} of ${displayTotalItems} entries`}
          />
        )}
      </div>

      <UserViewModal 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        userId={selectedUserId || 0}
      />

      <UserPhotosModal
        isOpen={isPhotosModalOpen}
        onClose={() => setIsPhotosModalOpen(false)}
        userId={selectedUserForPhotosId || 0}
      />

      <UserBioModal
        isOpen={isBioModalOpen}
        onClose={() => setIsBioModalOpen(false)}
        userId={selectedBioUserId || 0}
      />

      <CallNotesModal
        isOpen={isCallNotesModalOpen}
        onClose={() => setIsCallNotesModalOpen(false)}
        userId={selectedCallNoteUserId || 0}
      />

      {/* Approve Confirmation Modal */}
      {isApproveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
                <Check className="w-6 h-6 text-green-600" strokeWidth={3} />
              </div>
              <h3 className="text-lg font-medium text-center text-gray-900 mb-2">Approve User</h3>
              <p className="text-sm text-center text-gray-500">
                Are you sure you want to approve this user? Their profile will become visible to others.
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
                className="px-4 py-2 text-sm font-medium text-white bg-[#00b562] rounded-lg hover:bg-[#009b54] focus:outline-none disabled:opacity-50 flex items-center gap-2"
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
    </div>
  );
};

export default UserListPendingApprovalPage;
