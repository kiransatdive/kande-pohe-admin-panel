import { createBrowserRouter } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import AdminPage from '../pages/AdminPage';
import DashboardPage from '../pages/DashboardPage';
import UserListPage from '../pages/UserListPage';
import UserListApprovedPage from '../pages/UserListApprovedPage';
import UserListPendingApprovalPage from '../pages/UserListPendingApprovalPage';
import UserNewlyRegisteredListPage from '../pages/UserNewlyRegisteredListPage';
import UserListBioPage from '../pages/UserListBioPage';
import UserListPhotoAlbumPage from '../pages/UserListPhotoAlbumPage';
import WeightegeListPage from '../pages/WeightegeListPage';
import CommunityListPage from '../pages/CommunityListPage';
import SubCommunityListPage from '../pages/SubCommunityListPage';
import DietListPage from '../pages/DietListPage';
import DistrictListPage from '../pages/DistrictListPage';
import GotraListPage from '../pages/GotraListPage';
import MaritalStatusListPage from '../pages/MaritalStatusListPage';
import HeightListPage from '../pages/HeightListPage';
import TalukaListPage from '../pages/TalukaListPage';
import FatherMotherStatusListPage from '../pages/FatherMotherStatusListPage';
import EducationNameListPage from '../pages/EducationNameListPage';
import EducationLevelListPage from '../pages/EducationLevelListPage';
import ReligionListPage from '../pages/ReligionListPage';
import BloodGroupListPage from '../pages/BloodGroupListPage';
import BodyTypeListPage from '../pages/BodyTypeListPage';
import CharanListPage from '../pages/CharanListPage';
import CulturalBackgroundListPage from '../pages/CulturalBackgroundListPage';
import FamilyAffluenceLevelListPage from '../pages/FamilyAffluenceLevelListPage';
import FamilyWealthDetailsListPage from '../pages/FamilyWealthDetailsListPage';
import FavouriteCousinesListPage from '../pages/FavouriteCousinesListPage';
import FavouriteMusicListPage from '../pages/FavouriteMusicListPage';
import FavouriteReadsListPage from '../pages/FavouriteReadsListPage';
import GanListPage from '../pages/GanListPage';
import HobbiesListPage from '../pages/HobbiesListPage';
import InterestsListPage from '../pages/InterestsListPage';
import MotherTongueListPage from '../pages/MotherTongueListPage';
import NadiListPage from '../pages/NadiListPage';
import NakshtraListPage from '../pages/NakshtraListPage';
import MembershipTypeListPage from '../pages/MembershipTypeListPage';
import PreferredDressStyleListPage from '../pages/PreferredDressStyleListPage';
import PreferredMoviesListPage from '../pages/PreferredMoviesListPage';
import PropertyDetailsListPage from '../pages/PropertyDetailsListPage';
import RaashiListPage from '../pages/RaashiListPage';
import SkinToneListPage from '../pages/SkinToneListPage';
import SportsFitnessActivitiesListPage from '../pages/SportsFitnessActivitiesListPage';
import TagsListPage from '../pages/TagsListPage';
import WorkingAsListPage from '../pages/WorkingAsListPage';
import WorkingWithListPage from '../pages/WorkingWithListPage';
import EmailTemplateListPage from '../pages/EmailTemplateListPage';
import SmsTemplateListPage from '../pages/SmsTemplateListPage';
import SiteMessageListPage from '../pages/SiteMessageListPage';
import CityListPage from '../pages/CityListPage';
import CasteListPage from '../pages/CasteListPage';
import EducationListPage from '../pages/EducationListPage';
import OccupationListPage from '../pages/OccupationListPage';
import PhysicalStatusListPage from '../pages/PhysicalStatusListPage';
import OtherMetaManagementListPage from '../pages/OtherMetaManagementListPage';
import SiteCmsListPage from '../pages/SiteCmsListPage';
import SubscriptionManagementListPage from '../pages/SubscriptionManagementListPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {
        path: 'user-list',
        element: <UserListPage />
      },
      {
        path: 'user-list-newly-registered',
        element: <UserNewlyRegisteredListPage />
      },
      {
        path: 'user-list-bio',
        element: <UserListBioPage />
      },
      {
        path: 'user-list-photo-album',
        element: <UserListPhotoAlbumPage />
      },
      {
        path: 'user-list-approved',
        element: <UserListApprovedPage />
      },
      {
        path: 'user-list-pending-approval',
        element: <UserListPendingApprovalPage />
      },
      {
        path: 'admin/site-manage/wightege',
        element: <WeightegeListPage />
      },
      {
        path: 'admin/site-manage/community',
        element: <CommunityListPage />
      },
      {
        path: 'admin/site-manage/sub-community',
        element: <SubCommunityListPage />
      },
      {
        path: 'admin/site-manage/diet',
        element: <DietListPage />
      },
      {
        path: 'admin/site-manage/district',
        element: <DistrictListPage />
      },
      {
        path: 'admin/site-manage/marital-status',
        element: <MaritalStatusListPage />
      },
      {
        path: 'admin/site-manage/height',
        element: <HeightListPage />
      },
      {
        path: 'admin/site-manage/taluka',
        element: <TalukaListPage />
      },
      {
        path: 'admin/site-manage/father-mother-status',
        element: <FatherMotherStatusListPage />
      },
      {
        path: 'admin/site-manage/education-name',
        element: <EducationNameListPage />
      },
      {
        path: 'admin/site-manage/education-level',
        element: <EducationLevelListPage />
      },
      {
        path: 'admin/site-manage/religion',
        element: <ReligionListPage />
      },
      {
        path: 'admin/site-manage-two/blood-group',
        element: <BloodGroupListPage />
      },
      {
        path: 'admin/site-manage-two/body-type',
        element: <BodyTypeListPage />
      },
      {
        path: 'admin/site-manage-two/charan',
        element: <CharanListPage />
      },
      {
        path: 'admin/site-manage-two/cultural-background',
        element: <CulturalBackgroundListPage />
      },
      {
        path: 'admin/site-manage-two/family-affluence-level',
        element: <FamilyAffluenceLevelListPage />
      },
      {
        path: 'admin/site-manage-two/family-wealth-details',
        element: <FamilyWealthDetailsListPage />
      },
      {
        path: 'admin/site-manage-two/favourite-cousines',
        element: <FavouriteCousinesListPage />
      },
      {
        path: 'admin/site-manage-two/favourite-music',
        element: <FavouriteMusicListPage />
      },
      {
        path: 'admin/site-manage-two/favourite-reads',
        element: <FavouriteReadsListPage />
      },
      {
        path: 'admin/site-manage-two/gan',
        element: <GanListPage />
      },
      {
        path: 'admin/site-manage-two/hobbies',
        element: <HobbiesListPage />
      },
      {
        path: 'admin/site-manage-two/interests',
        element: <InterestsListPage />
      },
      {
        path: 'admin/site-manage-two/mother-tongue',
        element: <MotherTongueListPage />
      },
      {
        path: 'admin/site-manage-two/nadi',
        element: <NadiListPage />
      },
      {
        path: 'admin/site-manage-two/nakshtra',
        element: <NakshtraListPage />
      },
      {
        path: 'admin/site-manage-two/membership-type',
        element: <MembershipTypeListPage />
      },
      {
        path: 'admin/site-manage-two/preferred-dress-style',
        element: <PreferredDressStyleListPage />
      },
      {
        path: 'admin/site-manage-two/preferred-movies',
        element: <PreferredMoviesListPage />
      },
      {
        path: 'admin/site-manage-two/property-details',
        element: <PropertyDetailsListPage />
      },
      {
        path: 'admin/site-manage-two/raashi',
        element: <RaashiListPage />
      },
      {
        path: 'admin/site-manage-two/skin-tone',
        element: <SkinToneListPage />
      },
      {
        path: 'admin/site-manage-two/sports-fitness-activities',
        element: <SportsFitnessActivitiesListPage />
      },
      {
        path: 'admin/site-manage-two/tags',
        element: <TagsListPage />
      },
      {
        path: 'admin/site-manage-two/working-as',
        element: <WorkingAsListPage />
      },
      {
        path: 'admin/site-manage-two/working-with',
        element: <WorkingWithListPage />
      },
      {
        path: 'admin/cms/email-template',
        element: <EmailTemplateListPage />
      },
      {
        path: 'admin/cms/sms-template',
        element: <SmsTemplateListPage />
      },
      {
        path: 'admin/cms/site-message',
        element: <SiteMessageListPage />
      },
      {
        path: 'admin/cms/city',
        element: <CityListPage />
      },
      {
        path: 'admin/cms/caste',
        element: <CasteListPage />
      },
      {
        path: 'admin/cms/education',
        element: <EducationListPage />
      },
      {
        path: 'admin/cms/occupation',
        element: <OccupationListPage />
      },
      {
        path: 'admin/cms/physical-status',
        element: <PhysicalStatusListPage />
      },
      {
        path: 'admin/cms/other-meta-management',
        element: <OtherMetaManagementListPage />
      },
      {
        path: 'admin/site-manage/gotra',
        element: <GotraListPage />
      },
      {
        path: 'admin/site-cms',
        element: <SiteCmsListPage />
      },
      {
        path: 'admin/subscription-management',
        element: <SubscriptionManagementListPage />
      },
      {
        path: 'admin/site-manage-two/gotra',
        element: <GotraListPage />
      },
      {
        path: 'admin/cms/marital-status',
        element: <MaritalStatusListPage />
      },
      {
        path: 'admin',
        element: <AdminPage />
      }
    ]
  },
]);

export default router;
