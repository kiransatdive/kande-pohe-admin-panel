import React from 'react';
import { X } from 'lucide-react';

interface SubscriberDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriber: any | null;
}

const SubscriberDetailsModal: React.FC<SubscriberDetailsModalProps> = ({ isOpen, onClose, subscriber }) => {
  if (!isOpen || !subscriber) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50 rounded-t-xl shrink-0">
          <h2 className="text-lg font-semibold text-gray-800">Subscriber Details</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="flex flex-col gap-6">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row gap-6 items-start bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="relative shrink-0 bg-gray-50 rounded-2xl border-4 border-white shadow-md w-32 h-32 flex items-center justify-center overflow-hidden">
                <img 
                  src={subscriber.propic || 'https://ui-avatars.com/api/?name=' + (subscriber.First_Name || 'U') + '+' + (subscriber.Last_Name || 'S') + '&background=e0e7ff&color=4f46e5&size=150'} 
                  alt="Profile" 
                  className="w-full h-full object-cover drop-shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + (subscriber.First_Name || 'U') + '+' + (subscriber.Last_Name || 'S') + '&background=e0e7ff&color=4f46e5&size=150';
                  }}
                />
              </div>
              <div className="flex-1 w-full pt-2">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                  {subscriber.First_Name || ''} {subscriber.Last_Name || ''}
                </h3>
                <p className="text-blue-600 font-medium text-sm mb-3">
                  User ID: {subscriber.usd_user_id || subscriber.id || 'N/A'}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded-md text-xs font-semibold border shadow-sm flex items-center gap-1 ${
                    String(subscriber.status) === '1' || String(subscriber.status).toLowerCase() === 'active' || subscriber.usd_status?.toLowerCase() === 'activated'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    Status: {subscriber.usd_status || (String(subscriber.status) === '1' ? 'Active' : 'Inactive')}
                  </span>
                  <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-md text-xs font-semibold border border-purple-200 shadow-sm flex items-center gap-1">
                    Plan: {subscriber.usd_subscription_name || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col">
              <div className="flex items-center gap-2 mb-4 text-blue-600 font-semibold border-b border-gray-100 pb-2">
                User Information
              </div>
              <div className="grid grid-cols-2 gap-4 flex-1 text-sm">
                <div className="flex flex-col mb-3"><span className="text-[11px] text-gray-500 mb-1 font-bold uppercase tracking-wider">First Name</span><span className="text-sm text-gray-800 font-medium bg-gray-50 p-2 rounded border border-gray-100 break-words">{subscriber.First_Name || '-'}</span></div>
                <div className="flex flex-col mb-3"><span className="text-[11px] text-gray-500 mb-1 font-bold uppercase tracking-wider">Last Name</span><span className="text-sm text-gray-800 font-medium bg-gray-50 p-2 rounded border border-gray-100 break-words">{subscriber.Last_Name || '-'}</span></div>
                <div className="flex flex-col mb-3"><span className="text-[11px] text-gray-500 mb-1 font-bold uppercase tracking-wider">Email</span><span className="text-sm text-gray-800 font-medium bg-gray-50 p-2 rounded border border-gray-100 break-words">{subscriber.Email || '-'}</span></div>
                <div className="flex flex-col mb-3"><span className="text-[11px] text-gray-500 mb-1 font-bold uppercase tracking-wider">Mobile</span><span className="text-sm text-gray-800 font-medium bg-gray-50 p-2 rounded border border-gray-100 break-words">{subscriber.Mobile || '-'}</span></div>
                <div className="flex flex-col mb-3"><span className="text-[11px] text-gray-500 mb-1 font-bold uppercase tracking-wider">Gender</span><span className="text-sm text-gray-800 font-medium bg-gray-50 p-2 rounded border border-gray-100 break-words">{subscriber.Gender || '-'}</span></div>
                <div className="flex flex-col mb-3"><span className="text-[11px] text-gray-500 mb-1 font-bold uppercase tracking-wider">User ID</span><span className="text-sm text-gray-800 font-medium bg-gray-50 p-2 rounded border border-gray-100 break-words">{subscriber.usd_user_id || '-'}</span></div>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col">
              <div className="flex items-center gap-2 mb-4 text-emerald-600 font-semibold border-b border-gray-100 pb-2">
                Subscription Details
              </div>
              <div className="grid grid-cols-2 gap-4 flex-1 text-sm">
                <div className="flex flex-col mb-3"><span className="text-[11px] text-gray-500 mb-1 font-bold uppercase tracking-wider">Plan Name</span><span className="text-sm text-gray-800 font-medium bg-gray-50 p-2 rounded border border-gray-100 break-words">{subscriber.usd_subscription_name || '-'}</span></div>
                <div className="flex flex-col mb-3"><span className="text-[11px] text-gray-500 mb-1 font-bold uppercase tracking-wider">Price</span><span className="text-sm text-gray-800 font-medium bg-gray-50 p-2 rounded border border-gray-100 break-words">{subscriber.usd_currency} {subscriber.usd_subscriptions_price ?? '-'}</span></div>
                <div className="flex flex-col mb-3"><span className="text-[11px] text-gray-500 mb-1 font-bold uppercase tracking-wider">Start Date</span><span className="text-sm text-gray-800 font-medium bg-gray-50 p-2 rounded border border-gray-100 break-words">{subscriber.usd_subscription_start_date || '-'}</span></div>
                <div className="flex flex-col mb-3"><span className="text-[11px] text-gray-500 mb-1 font-bold uppercase tracking-wider">End Date</span><span className="text-sm text-gray-800 font-medium bg-gray-50 p-2 rounded border border-gray-100 break-words">{subscriber.usd_subscription_end_date || '-'}</span></div>
                <div className="flex flex-col mb-3"><span className="text-[11px] text-gray-500 mb-1 font-bold uppercase tracking-wider">Status</span><span className="text-sm text-gray-800 font-medium bg-gray-50 p-2 rounded border border-gray-100 break-words">{subscriber.usd_status || '-'}</span></div>
                <div className="flex flex-col mb-3"><span className="text-[11px] text-gray-500 mb-1 font-bold uppercase tracking-wider">Validity (Days)</span><span className="text-sm text-gray-800 font-medium bg-gray-50 p-2 rounded border border-gray-100 break-words">{subscriber.usd_validity_of_package || '-'}</span></div>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col">
              <div className="flex items-center gap-2 mb-4 text-purple-600 font-semibold border-b border-gray-100 pb-2">
                Payment Details
              </div>
              <div className="grid grid-cols-2 gap-4 flex-1 text-sm">
                <div className="flex flex-col mb-3"><span className="text-[11px] text-gray-500 mb-1 font-bold uppercase tracking-wider">Payment Type</span><span className="text-sm text-gray-800 font-medium bg-gray-50 p-2 rounded border border-gray-100 break-words">{subscriber.usd_payment_type || '-'}</span></div>
                <div className="flex flex-col mb-3"><span className="text-[11px] text-gray-500 mb-1 font-bold uppercase tracking-wider">Payment Mode</span><span className="text-sm text-gray-800 font-medium bg-gray-50 p-2 rounded border border-gray-100 break-words">{subscriber.usd_payment_mode || '-'}</span></div>
                <div className="flex flex-col mb-3"><span className="text-[11px] text-gray-500 mb-1 font-bold uppercase tracking-wider">Payment Status</span><span className="text-sm text-gray-800 font-medium bg-gray-50 p-2 rounded border border-gray-100 break-words">{subscriber.usd_payment_status || '-'}</span></div>
                <div className="flex flex-col mb-3"><span className="text-[11px] text-gray-500 mb-1 font-bold uppercase tracking-wider">Order Status</span><span className="text-sm text-gray-800 font-medium bg-gray-50 p-2 rounded border border-gray-100 break-words">{subscriber.usd_order_status || '-'}</span></div>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col">
              <div className="flex items-center gap-2 mb-4 text-orange-600 font-semibold border-b border-gray-100 pb-2">
                Package Features
              </div>
              <div className="grid grid-cols-2 gap-4 flex-1 text-sm">
                <div className="flex flex-col mb-3"><span className="text-[11px] text-gray-500 mb-1 font-bold uppercase tracking-wider">Total Contacts</span><span className="text-sm text-gray-800 font-medium bg-gray-50 p-2 rounded border border-gray-100 break-words">{subscriber.usd_no_of_contacts ?? '-'}</span></div>
                <div className="flex flex-col mb-3"><span className="text-[11px] text-gray-500 mb-1 font-bold uppercase tracking-wider">Contacts Used</span><span className="text-sm text-gray-800 font-medium bg-gray-50 p-2 rounded border border-gray-100 break-words">{subscriber.usd_no_of_contacts_used ?? '-'}</span></div>
                <div className="flex flex-col mb-3"><span className="text-[11px] text-gray-500 mb-1 font-bold uppercase tracking-wider">Total PM</span><span className="text-sm text-gray-800 font-medium bg-gray-50 p-2 rounded border border-gray-100 break-words">{subscriber.usd_no_of_pm ?? '-'}</span></div>
                <div className="flex flex-col mb-3"><span className="text-[11px] text-gray-500 mb-1 font-bold uppercase tracking-wider">PM Used</span><span className="text-sm text-gray-800 font-medium bg-gray-50 p-2 rounded border border-gray-100 break-words">{subscriber.usd_no_of_pm_used ?? '-'}</span></div>
                <div className="flex flex-col mb-3"><span className="text-[11px] text-gray-500 mb-1 font-bold uppercase tracking-wider">Profile Duration</span><span className="text-sm text-gray-800 font-medium bg-gray-50 p-2 rounded border border-gray-100 break-words">{subscriber.usd_profile_duration ?? '-'}</span></div>
                <div className="flex flex-col mb-3"><span className="text-[11px] text-gray-500 mb-1 font-bold uppercase tracking-wider">Privacy Settings</span><span className="text-sm text-gray-800 font-medium bg-gray-50 p-2 rounded border border-gray-100 break-words">{subscriber.usd_privacy_settings || '-'}</span></div>
                <div className="flex flex-col mb-3"><span className="text-[11px] text-gray-500 mb-1 font-bold uppercase tracking-wider">Customer Support</span><span className="text-sm text-gray-800 font-medium bg-gray-50 p-2 rounded border border-gray-100 break-words">{subscriber.usd_customer_care_support || '-'}</span></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="px-8 py-2.5 bg-[#3b82f6] text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriberDetailsModal;
