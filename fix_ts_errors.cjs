const fs = require('fs');
const path = require('path');

const tscErrors = `
src/pages/EducationNameListPage.tsx(163,9): error TS6133: 'filteredData' is declared but its value is never read.
src/pages/EmailTemplateListPage.tsx(2,29): error TS6133: 'Search' is declared but its value is never read.
src/pages/EmailTemplateListPage.tsx(5,10): error TS6133: 'isModalOpen' is declared but its value is never read.
src/pages/EmailTemplateListPage.tsx(5,23): error TS6133: 'setIsModalOpen' is declared but its value is never read.
src/pages/FamilyAffluenceLevelListPage.tsx(29,22): error TS6133: 'setSearchTerm' is declared but its value is never read.
src/pages/FamilyAffluenceLevelListPage.tsx(157,9): error TS6133: 'filteredData' is declared but its value is never read.
src/pages/FamilyWealthDetailsListPage.tsx(29,22): error TS6133: 'setSearchTerm' is declared but its value is never read.
src/pages/FamilyWealthDetailsListPage.tsx(157,9): error TS6133: 'filteredData' is declared but its value is never read.
src/pages/FatherMotherStatusListPage.tsx(31,22): error TS6133: 'setSearchTerm' is declared but its value is never read.
src/pages/FatherMotherStatusListPage.tsx(163,9): error TS6133: 'filteredData' is declared but its value is never read.
src/pages/FavouriteCousinesListPage.tsx(30,22): error TS6133: 'setSearchTerm' is declared but its value is never read.
src/pages/FavouriteCousinesListPage.tsx(153,9): error TS6133: 'filteredData' is declared but its value is never read.
src/pages/FavouriteMusicListPage.tsx(30,22): error TS6133: 'setSearchTerm' is declared but its value is never read.
src/pages/FavouriteMusicListPage.tsx(153,9): error TS6133: 'filteredData' is declared but its value is never read.
src/pages/FavouriteReadsListPage.tsx(30,22): error TS6133: 'setSearchTerm' is declared but its value is never read.
src/pages/FavouriteReadsListPage.tsx(153,9): error TS6133: 'filteredData' is declared but its value is never read.
src/pages/GanListPage.tsx(30,22): error TS6133: 'setSearchTerm' is declared but its value is never read.
src/pages/GanListPage.tsx(153,9): error TS6133: 'filteredData' is declared but its value is never read.
src/pages/GotraListPage.tsx(32,22): error TS6133: 'setSearchTerm' is declared but its value is never read.
src/pages/GotraListPage.tsx(159,9): error TS6133: 'filteredData' is declared but its value is never read.
src/pages/HeightListPage.tsx(245,9): error TS6133: 'filteredData' is declared but its value is never read.
src/pages/HobbiesListPage.tsx(30,22): error TS6133: 'setSearchTerm' is declared but its value is never read.
src/pages/HobbiesListPage.tsx(153,9): error TS6133: 'filteredData' is declared but its value is never read.
src/pages/InterestsListPage.tsx(2,29): error TS6133: 'Search' is declared but its value is never read.
src/pages/MaritalStatusListPage.tsx(204,9): error TS6133: 'filteredData' is declared but its value is never read.
src/pages/MotherTongueListPage.tsx(30,22): error TS6133: 'setSearchTerm' is declared but its value is never read.
src/pages/MotherTongueListPage.tsx(153,9): error TS6133: 'filteredData' is declared but its value is never read.
src/pages/NadiListPage.tsx(30,22): error TS6133: 'setSearchTerm' is declared but its value is never read.
src/pages/NadiListPage.tsx(153,9): error TS6133: 'filteredData' is declared but its value is never read.
src/pages/NakshtraListPage.tsx(30,22): error TS6133: 'setSearchTerm' is declared but its value is never read.
src/pages/NakshtraListPage.tsx(153,9): error TS6133: 'filteredData' is declared but its value is never read.
src/pages/OccupationListPage.tsx(2,29): error TS6133: 'Search' is declared but its value is never read.
src/pages/OccupationListPage.tsx(5,10): error TS6133: 'isModalOpen' is declared but its value is never read.
src/pages/OccupationListPage.tsx(5,23): error TS6133: 'setIsModalOpen' is declared but its value is never read.
src/pages/OtherMetaManagementListPage.tsx(2,29): error TS6133: 'Search' is declared but its value is never read.
src/pages/OtherMetaManagementListPage.tsx(5,10): error TS6133: 'isModalOpen' is declared but its value is never read.
src/pages/OtherMetaManagementListPage.tsx(5,23): error TS6133: 'setIsModalOpen' is declared but its value is never read.
src/pages/PhysicalStatusListPage.tsx(2,29): error TS6133: 'Search' is declared but its value is never read.
src/pages/PhysicalStatusListPage.tsx(5,10): error TS6133: 'isModalOpen' is declared but its value is never read.
src/pages/PhysicalStatusListPage.tsx(5,23): error TS6133: 'setIsModalOpen' is declared but its value is never read.
src/pages/PreferredDressStyleListPage.tsx(30,22): error TS6133: 'setSearchTerm' is declared but its value is never read.
src/pages/PreferredDressStyleListPage.tsx(153,9): error TS6133: 'filteredData' is declared but its value is never read.
src/pages/PreferredMoviesListPage.tsx(30,22): error TS6133: 'setSearchTerm' is declared but its value is never read.
src/pages/PreferredMoviesListPage.tsx(153,9): error TS6133: 'filteredData' is declared but its value is never read.
src/pages/PropertyDetailsListPage.tsx(30,22): error TS6133: 'setSearchTerm' is declared but its value is never read.
src/pages/PropertyDetailsListPage.tsx(153,9): error TS6133: 'filteredData' is declared but its value is never read.
src/pages/RaashiListPage.tsx(30,22): error TS6133: 'setSearchTerm' is declared but its value is never read.
src/pages/RaashiListPage.tsx(153,9): error TS6133: 'filteredData' is declared but its value is never read.
src/pages/SiteCmsListPage.tsx(2,29): error TS6133: 'Search' is declared but its value is never read.
src/pages/SiteMessageListPage.tsx(2,29): error TS6133: 'Search' is declared but its value is never read.
src/pages/SiteMessageListPage.tsx(5,10): error TS6133: 'isModalOpen' is declared but its value is never read.
src/pages/SiteMessageListPage.tsx(5,23): error TS6133: 'setIsModalOpen' is declared but its value is never read.
src/pages/SkinToneListPage.tsx(29,22): error TS6133: 'setSearchTerm' is declared but its value is never read.
src/pages/SkinToneListPage.tsx(157,9): error TS6133: 'filteredData' is declared but its value is never read.
src/pages/SmsTemplateListPage.tsx(2,29): error TS6133: 'Search' is declared but its value is never read.
src/pages/SmsTemplateListPage.tsx(5,10): error TS6133: 'isModalOpen' is declared but its value is never read.
src/pages/SmsTemplateListPage.tsx(5,23): error TS6133: 'setIsModalOpen' is declared but its value is never read.
src/pages/SportsFitnessActivitiesListPage.tsx(30,22): error TS6133: 'setSearchTerm' is declared but its value is never read.
src/pages/SportsFitnessActivitiesListPage.tsx(153,9): error TS6133: 'filteredData' is declared but its value is never read.
src/pages/SubCommunityListPage.tsx(203,9): error TS6133: 'filteredData' is declared but its value is never read.
src/pages/TagsListPage.tsx(30,22): error TS6133: 'setSearchTerm' is declared but its value is never read.
src/pages/TagsListPage.tsx(153,9): error TS6133: 'filteredData' is declared but its value is never read.
src/pages/UserListBioPage.tsx(2,15): error TS6133: 'Search' is declared but its value is never read.
src/pages/UserListBioPage.tsx(26,23): error TS6133: 'setSearchQuery' is declared but its value is never read.
src/pages/UserListPhotoAlbumPage.tsx(2,15): error TS6133: 'Search' is declared but its value is never read.
src/pages/UserListPhotoAlbumPage.tsx(27,23): error TS6133: 'setSearchQuery' is declared but its value is never read.
src/pages/UserNewlyRegisteredListPage.tsx(2,15): error TS6133: 'Search' is declared but its value is never read.
src/pages/UserNewlyRegisteredListPage.tsx(26,23): error TS6133: 'setSearchQuery' is declared but its value is never read.
src/pages/WorkingAsListPage.tsx(32,22): error TS6133: 'setSearchTerm' is declared but its value is never read.
src/pages/WorkingAsListPage.tsx(165,9): error TS6133: 'filteredData' is declared but its value is never read.
src/pages/WorkingWithListPage.tsx(32,22): error TS6133: 'setSearchTerm' is declared but its value is never read.
src/pages/WorkingWithListPage.tsx(155,9): error TS6133: 'filteredData' is declared but its value is never read.
`;

const lines = tscErrors.split('\n').filter(l => l.trim() !== '');

const filesToUpdate = {};

lines.forEach(line => {
  const match = line.match(/(src\/pages\/[^:]+)\(\d+,\d+\): error TS6133: '([^']+)' is declared/);
  if (match) {
    const filePath = path.join(__dirname, match[1]);
    const varName = match[2];
    if (!filesToUpdate[filePath]) filesToUpdate[filePath] = [];
    filesToUpdate[filePath].push(varName);
  }
});

Object.keys(filesToUpdate).forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const vars = filesToUpdate[filePath];

    if (vars.includes('setSearchTerm')) {
      content = content.replace(/const\s+\[searchTerm,\s*setSearchTerm\]\s*=\s*useState\(['"]{0,2}\);\r?\n?/g, '');
      content = content.replace(/searchTerm/g, 'searchQuery');
    }

    if (vars.includes('filteredData')) {
      content = content.replace(/const\s+filteredData\s*=\s*[a-zA-Z0-9_]+\.filter\(\(item:\s*any\)\s*=>\s*\{[\s\S]*?return\s+Object\.values\(item\)[\s\S]*?\}\);\r?\n?/g, '');
    }

    if (vars.includes('Search')) {
      // replace Search import. Can be `Eye, Edit, Trash2, Search`
      content = content.replace(/,\s*Search\b/g, '');
      content = content.replace(/\bSearch,\s*/g, '');
    }

    if (vars.includes('isModalOpen')) {
      content = content.replace(/const\s+\[isModalOpen,\s*setIsModalOpen\]\s*=\s*useState\(false\);\r?\n?/g, '');
    }

    if (vars.includes('setSearchQuery')) {
      content = content.replace(/const\s+\[searchQuery,\s*setSearchQuery\]\s*=\s*useState\(['"]{0,2}\);\r?\n?/g, '');
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed TS errors in ${path.basename(filePath)}`);
  }
});
