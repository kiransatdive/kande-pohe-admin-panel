import React, { useState } from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';

const EmailTemplateListPage: React.FC = () => {
  
  const items = [
    { 
      id: 1, 
      title: 'Register Verification Email', 
      type: 'VERIFY_ACCOUNT', 
      subject: 'Registration Link - Kande-Pohe Marathi Matrimony',
      desc: "Dear #NAME#, You've entered #EMAIL_TO# as an email address for your registration at Kande-Pohe Marathi Matrimony. Use below link to continue with your registration if you leave registration incomplete. Copy and paste the below URL in a new browser window and hit enter. #ACTIVATION_LINK# Thank You ! Regards, Team Kande-Pohe Marathi Matrimony"
    },
    { 
      id: 2, 
      title: 'Email Verification PIN', 
      type: 'EMAIL_VERIFICATION_PIN', 
      subject: 'Email PIN for Account Verification - Kande-Pohe Marathi Matrimony',
      desc: "Dear #NAME#, Please use below 4 digit email PIN to verify your registration at Kande-Pohe Marathi Matrimony. PIN is valid for #MINUTES# minutes and usable only once. PIN : #PIN# Expires in: #MINUTES# minutes. Regards, Team Kande-Pohe Marathi Matrimony"
    },
    { 
      id: 3, 
      title: 'In Own Words Approve', 
      type: 'IN_OWN_WORDS_APPROVE', 
      subject: "Kande-Pohe Marathi Matrimony - Description for 'About Yourself' section is approved",
      desc: "Dear #NAME#, We have approved description for 'About Yourself' section. Now it is visible to all other verified users. #COMMENT# Thank You ! Regards, Team Kande-Pohe Marathi Matrimony"
    },
    { 
      id: 4, 
      title: 'Profile Photo Approve', 
      type: 'PROFILE_PHOTO_APPROVE', 
      subject: 'Your profile picture approved on Kande-Pohe Marathi Matrimony',
      desc: "Dear #NAME#, We have approved your profile picture. Now it is visible to all other verified users. #COMMENT# PHOTO : #PHOTO# You can login and change the profile pic anytime you want or upload new. Regards, Team Kande-Pohe Marathi Matrimony"
    },
    { 
      id: 5, 
      title: 'In Own Words DisApprove', 
      type: 'IN_OWN_WORDS_DISAPPROVE', 
      subject: "Dis-approved 'About Yourself' on Kande-Pohe.com",
      desc: "Dear #NAME#, We could not approve the description you provided for section 'About Yourself' as it is not matching with our content policies. Please correct it and re-submit. Generally, we do not approve content if there is abusive language used, contact details mentioned in it or hate speech mentioned about any individual/religion/country. Your Description: #CONTENT# Reason for dis-approval: #COMMENT# Thank You! Regards, Team Kande-Pohe Marathi..."
    },
    { 
      id: 6, 
      title: 'Profile Photo DisApprove', 
      type: 'PROFILE_PHOTO_DISAPPROVE', 
      subject: 'Regarding your profile picture on Kande-pohe.com',
      desc: "Dear #NAME#, We could not approve your below picture because it is not appropriate as per our policies. Please upload new appropriate picture. Reason : #COMMENT# Photo : #PHOTO# Thank You ! Team Kande-Pohe Marathi Matrimony"
    },
    { 
      id: 7, 
      title: 'Forgot Password', 
      type: 'FORGOT_PASSWORD', 
      subject: '#NAME#, here is your link to reset password',
      desc: "Dear #NAME#, To reset your password, please click on below link or copy and paste below URL in browser's address bar. #LINK# Thank You! Regards, Team Kande Pohe Marathi Matrimony"
    },
    { 
      id: 8, 
      title: 'User Deleted their profile on Kande Pohe', 
      type: 'ADMIN_DELETE_ACCOUNT_USER', 
      subject: 'User Deleted Their Profile.',
      desc: "Dear Administrator, #NAME# deleted their profile on Kande-pohe.com. Here is their email id #EMAIL_TO#. Click on below URL for showing #NAME# profile. #LINK# Thank You ! Kande Pohe"
    },
  ];

  return (
    <div className="flex flex-col text-sm w-full relative">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-[15px] font-medium text-gray-800">Email Format List</h2>
            <div className="text-xs text-gray-500">
              Showing 1-8 of <span className="font-semibold text-gray-800">26</span> items.
            </div>
          </div>
          <div className="flex items-center gap-4">
            </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left text-xs border border-gray-100 table-fixed">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-12">#</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-48">Email Format Title</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-48">Email Format Type</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] w-64">Email Format Subject</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af]">Email Format Desc</th>
                <th className="px-4 py-3 font-semibold text-[#1e40af] text-right w-28"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                  <td className="px-4 py-3 text-gray-500 align-top">{item.id}</td>
                  <td className="px-4 py-3 text-[#3b82f6] align-top">{item.title}</td>
                  <td className="px-4 py-3 text-gray-700 align-top">{item.type}</td>
                  <td className="px-4 py-3 text-[#3b82f6] align-top">{item.subject}</td>
                  <td className="px-4 py-3 text-gray-600 align-top leading-relaxed">{item.desc}</td>
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

export default EmailTemplateListPage;
