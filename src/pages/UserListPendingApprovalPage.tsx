import React from 'react';
import { Eye, FileText, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

const UserListPendingApprovalPage: React.FC = () => {
  const users = [
    { id: 1, firstName: 'Virajeet', lastName: 'Surve', email: '', emailVerified: false, mobile: '9967232376', mobileVerified: true, height: "5'6\"", age: 47, intRec: 0, intSent: 0, subType: 'SILVER', subDate: '25-10-2026', subRed: false, lastLogin: '28-07-2026', registered: '28-07-2026', status: 'Actived' },
    { id: 2, firstName: 'Sandeep', lastName: 'Barabkar', email: '', emailVerified: false, mobile: '8411842593', mobileVerified: false, height: "5'4\"", age: 38, intRec: 0, intSent: 0, subType: '', subDate: '01-01-1970', subRed: true, lastLogin: '27-07-2026', registered: '27-07-2026', status: 'Actived' },
    { id: 3, firstName: 'soddy', lastName: 'richard', email: 'seyokew696@buloan.com', emailVerified: false, mobile: '9359371180', mobileVerified: true, height: "5'5\"", age: 26, intRec: 0, intSent: 0, subType: 'FREE', subDate: '20-08-2026', subRed: false, lastLogin: '22-07-2026', registered: '14-07-2026', status: 'Actived' },
    { id: 4, firstName: 'Anil', lastName: 'Thorat', email: '', emailVerified: false, mobile: '9699900366', mobileVerified: false, height: "5'3\"", age: 29, intRec: 0, intSent: 0, subType: '', subDate: '01-01-1970', subRed: true, lastLogin: '20-07-2026', registered: '20-07-2026', status: 'Actived' },
    { id: 5, firstName: 'Jay', lastName: 'Kara', email: 'maheshsuthardm@gmail.com', emailVerified: true, mobile: '9867546538', mobileVerified: false, height: "(not set)", age: 21, intRec: 0, intSent: 0, subType: '', subDate: '01-01-1970', subRed: true, lastLogin: '20-07-2026', registered: '20-07-2026', status: 'Actived' },
    { id: 6, firstName: 'Jeevan', lastName: 'Patil', email: 'dhairyashilpatil1989@rediffmail.com', emailVerified: true, mobile: '9545550605', mobileVerified: true, height: "5'7\"", age: 35, intRec: 0, intSent: 0, subType: 'FREE', subDate: '16-08-2026', subRed: false, lastLogin: '18-07-2026', registered: '18-07-2026', status: 'Actived' },
    { id: 7, firstName: 'Vijay', lastName: 'Narwade', email: 'vnarwade536@gmail.com', emailVerified: false, mobile: '8087861946', mobileVerified: false, height: "5'3\"", age: 45, intRec: 0, intSent: 0, subType: 'FREE', subDate: '18-07-2026', subRed: false, lastLogin: '18-07-2026', registered: '18-07-2026', status: 'Actived' },
  ];

  return (
    <div className="flex flex-col text-sm w-full">
      {/* Search Filters Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-[15px] font-medium text-gray-800">Search Filters</h2>
          <div className="text-gray-400 text-xs">User In Approval</div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <input type="text" placeholder="First Name" className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full" />
            <input type="text" placeholder="Last Name" className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full" />
            <input type="text" placeholder="Email" className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full" />
            <input type="text" placeholder="Contact No" className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full" />
            <select className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option>Select a Gender</option>
            </select>
            <select className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option>Select a Community</option>
            </select>

            <select className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option>Height From</option>
            </select>
            <select className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option>Height To</option>
            </select>
            <select className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option>Age From</option>
            </select>
            <select className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option>Age To</option>
            </select>
            <input type="text" placeholder="City" className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full" />
            <input type="text" placeholder="Education Level" className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full" />

            <select className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option>Marital Status</option>
            </select>
            <select className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option>Disability</option>
            </select>
            <select className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option>Drink</option>
            </select>
            <select className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option>Smoke</option>
            </select>
            <select className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option>Diet</option>
            </select>
            <select className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option>Body Type</option>
            </select>

            <select className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option>Skin Tone</option>
            </select>
            <input type="text" placeholder="Working as" className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full" />
            <select className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option>Annual Income</option>
            </select>
            <select className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full text-gray-500">
              <option>Is Subscription?</option>
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded text-sm hover:bg-gray-50 transition-colors">
              Clear All
            </button>
            <button className="px-6 py-2 bg-[#3b82f6] text-white rounded text-sm font-medium hover:bg-blue-600 transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 mb-4">
        Showing 1-20 of <span className="font-semibold text-gray-800">520</span> items.
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
              {users.map((user, idx) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-4 text-gray-500 text-center">{user.id}</td>
                  <td className="px-3 py-4 text-gray-700">{user.firstName}</td>
                  <td className="px-3 py-4 text-gray-700">{user.lastName}</td>
                  <td className="px-3 py-4">
                    <div className="text-[#3b82f6] hover:underline cursor-pointer">{user.email}</div>
                    {user.emailVerified && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-1" />}
                  </td>
                  <td className="px-3 py-4">
                    <div className="text-[#3b82f6] hover:underline cursor-pointer">{user.mobile}</div>
                    {user.mobileVerified && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-1" />}
                  </td>
                  <td className="px-3 py-4 text-gray-600">{user.height}</td>
                  <td className="px-3 py-4 text-gray-600">{user.age}</td>
                  <td className="px-3 py-4 text-gray-600 text-center">{user.intRec}</td>
                  <td className="px-3 py-4 text-gray-600 text-center">{user.intSent}</td>
                  <td className="px-3 py-4 text-center">
                    <button className="bg-gray-100 border border-gray-200 text-gray-600 px-3 py-1 rounded text-[10px] hover:bg-gray-200">
                      Notes
                    </button>
                  </td>
                  <td className="px-3 py-3">
                    <div className={`p-2 w-24 h-11 flex flex-col justify-center ${user.subRed ? 'bg-[#ff4757] text-white' : 'bg-transparent text-gray-700'}`}>
                      {user.subType && <div className={user.subRed ? 'text-white' : 'text-gray-700'}>{user.subType}</div>}
                      <div className={user.subRed ? 'text-white' : 'text-gray-600'}>{user.subDate}</div>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-gray-600">{user.lastLogin}</td>
                  <td className="px-3 py-4 text-gray-600">{user.registered}</td>
                  <td className="px-3 py-4">
                    <span className="bg-[#00b562] text-white text-[10px] font-medium px-2.5 py-1.5 rounded">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-1.5 text-blue-500">
                      <button className="rounded p-1 hover:bg-blue-50 transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="rounded p-1 hover:bg-blue-50 transition-colors" title="Check">
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button className="rounded p-1 hover:bg-blue-50 transition-colors" title="Image">
                        <ImageIcon className="w-4 h-4" />
                      </button>
                      <button className="rounded p-1 hover:bg-blue-50 transition-colors" title="Details">
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserListPendingApprovalPage;
