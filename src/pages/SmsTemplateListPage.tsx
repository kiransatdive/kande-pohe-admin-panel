import React, { useState } from 'react';
import { Eye, Edit, Trash2, Search } from 'lucide-react';

const SmsTemplateListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const items = [
    { 
      id: 1, 
      type: 'PHONE_OTP', 
      info: 'For Phone OTP', 
      message: 'Your OTP is #OTP# for completing your registration on Kande-Pohe.com. Code is valid only for 15 minutes. Team Kande-Pohe Marathi Matrimony.',
      comment: '#OTP# is define OPT.'
    },
    { 
      id: 2, 
      type: 'INTEREST_SEND', 
      info: 'For Interest Send', 
      message: 'Hi #NAME#,\nYou have received new profile visit. To see details, please login and visit #LINK#. Regards, Team Kande-Pohe Marathi Matrimony.',
      comment: '#NAME# is Define Username. #LINK# is define user profile link.'
    },
    { 
      id: 3, 
      type: 'FORGOT_PASSWORD_OTP', 
      info: 'Forgot Password OTP', 
      message: 'Hi #NAME#,\nHere is your reset password OTP: #OTP#.\nRegards, Team Kande-Pohe Marathi Matrimony.',
      comment: '#NAME# is Define Username. #LINK# is define user profile link.'
    },
    { 
      id: 4, 
      type: 'LOGIN_PASSWORD_OTP', 
      info: 'Login OTP', 
      message: 'Hi #NAME#,\nHere is your login OTP: #OTP#.\nRegards, Team Kande-Pohe Marathi Matrimony.',
      comment: '#NAME# is Define Username. #OTP# is define login OTP'
    },
    { 
      id: 5, 
      type: 'IN_OWN_WORDS_APPROVE', 
      info: 'In Own Words Approve', 
      message: 'Hi #NAME#,\nWe have approved the information you provided on www.Kande-Pohe.com. Now you can login and search for your perfect match. Regards, Team Kande-Pohe Marathi Matrimony',
      comment: '#NAME# is Define Username.\n#COMMENT# is define comment'
    },
    { 
      id: 6, 
      type: 'IN_OWN_WORDS_DISAPPROVE', 
      info: 'In Own Words Disapprove', 
      message: 'Hi #NAME#,\nYour information of About Yourself is NOT APPROVED on www.Kande-Pohe.com. Please login and correct your information. Remember not to include your mobile number, email ID and abusive words. Regards, Team Kande-Pohe Marathi Matrimony',
      comment: '#NAME# is Define Username.\n#COMMENT# is define comment'
    },
    { 
      id: 7, 
      type: 'PROFILE_PHOTO_DISAPPROVE', 
      info: 'Profile Photo Disapprove', 
      message: 'Hi #NAME#,\nMessage from Kande-Pohe Marathi Matrimony.\nPictures you uploaded on www.Kande-Pohe.com are NOT APPROVED, as it does not comply our policy of appropriate pictures. Please login and add appropriate picture of yours. Remember, pictures with mask, in group or blur will not be approved.',
      comment: '#NAME# is Define Username.\n#COMMENT# is define comment'
    },
    { 
      id: 8, 
      type: 'PROFILE_PHOTO_APPROVE', 
      info: 'Profile Photo Approve', 
      message: 'Hi #NAME#,\nYour pictures uploaded on www.Kande-Pohe.com are approved. Thank you for registration. Regards, Team Kande-Pohe Marathi Matrimony',
      comment: '#NAME# is Define Username.\n#COMMENT# is Define comment'
    },
  ];

  return (
    <div className="flex flex-col text-sm w-full relative">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-[15px] font-medium text-gray-800">Sms Format List</h2>
            <div className="text-xs text-gray-500">
              Showing 1-8 of <span className="font-semibold text-gray-800">8</span> items.
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Type to search..." 
                className="w-64 bg-slate-50 border border-gray-200 text-gray-600 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left text-xs border border-gray-100 table-fixed">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-12">#</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-48">Sms Format Type</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-48">Sms Information</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af]">Sms Message</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-48">Comment</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] text-right w-28"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                  <td className="px-4 py-3 text-gray-500 align-top">{item.id}</td>
                  <td className="px-4 py-3 text-gray-700 align-top">{item.type}</td>
                  <td className="px-4 py-3 text-[#3b82f6] align-top">{item.info}</td>
                  <td className="px-4 py-3 text-gray-600 align-top leading-relaxed whitespace-pre-wrap">{item.message}</td>
                  <td className="px-4 py-3 text-gray-600 align-top leading-relaxed whitespace-pre-wrap">{item.comment}</td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center justify-end gap-1.5 text-gray-400">
                      <button className="text-[#3b82f6] rounded p-1 hover:bg-blue-50 transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-[#3b82f6] rounded p-1 hover:bg-blue-50 transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-[#3b82f6] rounded p-1 hover:bg-blue-50 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
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

export default SmsTemplateListPage;
