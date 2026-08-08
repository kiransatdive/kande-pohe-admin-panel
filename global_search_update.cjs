const fs = require('fs');
const path = require('path');

const paginatedPages = [
  'BloodGroupListPage.tsx', 'BodyTypeListPage.tsx', 'CharanListPage.tsx', 'CommunityListPage.tsx',
  'FamilyAffluenceLevelListPage.tsx', 'FamilyWealthDetailsListPage.tsx', 'FatherMotherStatusListPage.tsx',
  'FavouriteCousinesListPage.tsx', 'FavouriteMusicListPage.tsx', 'FavouriteReadsListPage.tsx',
  'GanListPage.tsx', 'GotraListPage.tsx', 'HeightListPage.tsx', 'HobbiesListPage.tsx',
  'MaritalStatusListPage.tsx', 'MotherTongueListPage.tsx', 'NadiListPage.tsx', 'NakshtraListPage.tsx',
  'PreferredDressStyleListPage.tsx', 'PreferredMoviesListPage.tsx', 'PropertyDetailsListPage.tsx',
  'RaashiListPage.tsx', 'ReligionListPage.tsx', 'SkinToneListPage.tsx',
  'SportsFitnessActivitiesListPage.tsx', 'SubCommunityListPage.tsx', 'TagsListPage.tsx',
  'WorkingAsListPage.tsx'
];

function processFile(file) {
  const filePath = path.join(__dirname, 'src', 'pages', file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('const delayDebounceFn = setTimeout')) {
    console.log(`Already processed: ${file}`);
    return;
  }
  
  // 1. Find fetch function name
  const fetchRegex = /const\s+(fetch[a-zA-Z0-9_]+)\s*=\s*async\s*\(\s*page:\s*number\s*\)\s*=>\s*\{/;
  const fetchMatch = content.match(fetchRegex);
  if (!fetchMatch) {
    console.log(`Could not find fetch function in ${file}`);
    return;
  }
  const fetchName = fetchMatch[1];
  
  // 2. Modify useEffect
  const oldUseEffectRegex = new RegExp(`useEffect\\(\\(\\)\\s*=>\\s*\\{\\s*${fetchName}\\(currentPage\\);\\s*\\},\\s*\\[currentPage\\]\\);`);
  const newUseEffect = `useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      ${fetchName}(searchQuery ? 1 : currentPage);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, searchQuery ? 1 : currentPage]);`;
  
  if (content.match(oldUseEffectRegex)) {
    content = content.replace(oldUseEffectRegex, newUseEffect);
  } else {
    // Some pages might not have exactly this format, e.g., missing dependencies array
    console.log(`Could not find standard useEffect in ${file}`);
  }

  // 3. Modify fetch limit
  content = content.replace(/limit:\s*10(\s|})/, 'limit: searchQuery ? 1000 : 10$1');
  content = content.replace(/limit=\$\{limit\}/, 'limit=${searchQuery ? 1000 : limit}');

  // 4. Update Pagination totalPages
  const filteredRegex = /const\s+(filtered[a-zA-Z0-9_]+)\s*=/;
  const filteredMatch = content.match(filteredRegex);
  if (filteredMatch) {
    const filteredArr = filteredMatch[1];
    
    // Replace map logic: filteredData.map(...) to (searchQuery ? filteredData.slice((currentPage - 1) * 10, currentPage * 10) : filteredData).map(...)
    // Note: I will use exactly `filteredArr.map(` to avoid replacing the array name inside string literals etc.
    const mapRegex = new RegExp(`${filteredArr}\\.map\\(`, 'g');
    content = content.replace(mapRegex, `(searchQuery ? ${filteredArr}.slice((currentPage - 1) * 10, currentPage * 10) : ${filteredArr}).map(`);

    // Update Pagination totalPages
    content = content.replace(/totalPages=\{totalPages\}/g, `totalPages={searchQuery ? Math.ceil(${filteredArr}.length / 10) || 1 : totalPages}`);
    content = content.replace(/totalPages=\{totalPages \?\? 1\}/g, `totalPages={searchQuery ? Math.ceil(${filteredArr}.length / 10) || 1 : (totalPages ?? 1)}`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully updated global search for ${file}`);
}

paginatedPages.forEach(file => {
  processFile(file);
});
