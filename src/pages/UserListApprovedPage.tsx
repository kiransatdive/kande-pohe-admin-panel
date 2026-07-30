import React from 'react';
import { Eye, Edit, Image as ImageIcon, Check, Trash2, CheckCircle2 } from 'lucide-react';
import Pagination from '../components/common/Pagination';

const UserListApprovedPage: React.FC = () => {
  const users = [
    { id: 1, firstName: 'Prasad', lastName: 'Deore', email: 'prase.deore@gmail.com', emailVerified: true, mobile: '8793930133', mobileVerified: false, height: "5'7\"", age: 29, intRec: 4, intSent: 2, subType: 'FREE', subDate: '26-01-2025', subRed: true, lastLogin: '26-07-2026', registered: '28-12-2024', status: 'Approved' },
    { id: 2, firstName: 'Swapnil', lastName: 'Nimda', email: 'frontend.admin@admin.com', emailVerified: true, mobile: '', mobileVerified: false, height: "5'10\"", age: 25, intRec: 1, intSent: 0, subType: '', subDate: '01-01-1970', subRed: true, lastLogin: '24-07-2026', registered: '01-01-1970', status: 'Approved' },
    { id: 3, firstName: 'kavita', lastName: 'Ghag', email: '', emailVerified: false, mobile: '9168319332', mobileVerified: true, height: "5'2\"", age: 41, intRec: 4, intSent: 0, subType: 'SILVER', subDate: '13-02-2026', subRed: true, lastLogin: '24-07-2026', registered: '11-11-2025', status: 'Approved' },
    { id: 4, firstName: 'Mandar', lastName: 'Kulkarni', email: 'mandarkulkarni716@gmail.com', emailVerified: true, mobile: '9860455009', mobileVerified: false, height: "5'11\"", age: 41, intRec: 3, intSent: 120, subType: 'GOLD', subDate: '07-09-2026', subRed: false, lastLogin: '23-07-2026', registered: '06-03-2026', status: 'Approved' },
    { id: 5, firstName: 'Jay', lastName: 'Mirase', email: '', emailVerified: false, mobile: '7770070745', mobileVerified: true, height: "5'5\"", age: 26, intRec: 1, intSent: 1, subType: 'FREE', subDate: '30-07-2026', subRed: false, lastLogin: '22-07-2026', registered: '01-07-2026', status: 'Approved' },
  ];

  return (
    <div className="flex flex-col text-sm w-full">
      {/* Top Header */}
      {/* <div className="flex justify-between items-center bg-white px-6 py-4 border-b border-gray-200 mb-6 rounded-lg shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800">User List</h1>
        <button className="bg-[#3b82f6] hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
          Frontend Admin login
        </button>
      </div> */}

      {/* Search Filters Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-[15px] font-medium text-gray-800">Search Filters</h2>
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
        Showing 1-20 of <span className="font-semibold text-gray-800">3,747</span> items.
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
              {users.map((user) => (
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
                  <td className="px-3 py-4 text-center">
                    <div className="text-blue-400 hover:underline cursor-pointer text-[10px]">Visit</div>
                    <div className="text-gray-400 text-[10px] my-0.5">OR</div>
                    <div className="text-blue-400 hover:underline cursor-pointer text-[10px]">Copy</div>
                  </td>
                  <td className="px-3 py-4 text-gray-600 text-center">{user.intRec}</td>
                  <td className="px-3 py-4 text-gray-600 text-center">{user.intSent}</td>
                  <td className="px-3 py-4 text-center">
                    <button className="bg-gray-100 border border-gray-200 text-gray-600 px-3 py-1 rounded text-[10px] hover:bg-gray-200">
                      Notes
                    </button>
                  </td>
                  <td className="px-3 py-3">
                    <div className={`p-2 w-28 h-12 flex flex-col justify-center ${user.subRed ? 'bg-[#ff4757] text-white' : 'bg-transparent text-gray-700'}`}>
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
                    <div className="flex items-center gap-1.5">
                      <button className="text-blue-500 rounded p-1 hover:bg-blue-50" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-blue-400 rounded p-1 hover:bg-blue-50" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-amber-500 rounded p-1 hover:bg-amber-50" title="Image">
                        <ImageIcon className="w-4 h-4" />
                      </button>
                      <button className="text-emerald-500 hover:bg-emerald-50 p-1 rounded" title="Approve">
                        <Check className="w-4 h-4" strokeWidth={3} />
                      </button>
                      <button className="text-orange-400 rounded p-1 hover:bg-orange-50" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination />
      </div>
    </div>
  );
};

export default UserListApprovedPage;
