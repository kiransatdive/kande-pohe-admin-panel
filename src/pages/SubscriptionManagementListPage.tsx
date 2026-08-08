import React, { useState } from 'react';
import { Edit, Trash2, Plus, Check, Star, Megaphone } from 'lucide-react';

const SubscriptionManagementListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const items = [
    { 
      id: 1, 
      name: 'Free', 
      price: '₹0', 
      profileDuration: '365 Days', 
      validity: '30 Days',
      theme: 'dark',
      features: [
        'Profile Duration: 365 Days',
        'Validity: 30 Days',
        'Basic Contacts access',
        'Standard Privacy settings',
      ]
    },
    { 
      id: 2, 
      name: 'Silver', 
      price: '₹1,200', 
      profileDuration: '365 Days', 
      validity: '90 Days',
      theme: 'light-yellow',
      features: [
        'Profile Duration: 365 Days',
        'Validity: 90 Days',
        'Extended Contacts access',
        'Enhanced Privacy features',
        'Email Support included'
      ]
    },
    { 
      id: 3, 
      name: 'Gold', 
      price: '₹1,800', 
      profileDuration: '365 Days', 
      validity: '180 Days',
      theme: 'blue',
      isPopular: true,
      features: [
        'Profile Duration: 365 Days',
        'Validity: 180 Days',
        'Premium Contacts access',
        'Advanced Privacy settings',
        '24/7 Priority Support',
        'Personalized Messaging'
      ]
    },
    { 
      id: 4, 
      name: 'Platinum', 
      price: '₹2,400', 
      profileDuration: '365 Days', 
      validity: '365 Days',
      theme: 'light-red',
      features: [
        'Profile Duration: 365 Days',
        'Validity: 365 Days',
        'Unlimited Contacts',
        'Maximum Privacy controls',
        'Dedicated RM assigned',
        'Unlimited Messaging'
      ]
    },
  ];

  const getThemeClasses = (theme: string) => {
    switch(theme) {
      case 'dark':
        return {
          cardBg: 'bg-[#333f51]',
          title: 'text-white',
          subtitle: 'text-gray-300',
          price: 'text-white',
          buttonBg: 'bg-white',
          buttonText: 'text-[#3b82f6]',
          buttonHover: 'hover:bg-gray-100',
          checkIcon: 'text-[#3b82f6]',
          listItem: 'text-gray-300'
        };
      case 'blue':
        return {
          cardBg: 'bg-[#3b82f6]',
          title: 'text-white',
          subtitle: 'text-blue-100',
          price: 'text-white',
          buttonBg: 'bg-white',
          buttonText: 'text-[#3b82f6]',
          buttonHover: 'hover:bg-gray-100',
          checkIcon: 'text-white',
          listItem: 'text-blue-100'
        };
      case 'light-yellow':
        return {
          cardBg: 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100',
          title: 'text-[#fbbf24]',
          subtitle: 'text-gray-500',
          price: 'text-gray-800',
          buttonBg: 'bg-white border border-gray-300',
          buttonText: 'text-gray-800',
          buttonHover: 'hover:bg-gray-50',
          checkIcon: 'text-[#3b82f6]',
          listItem: 'text-gray-500'
        };
      case 'light-red':
      default:
        return {
          cardBg: 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100',
          title: 'text-[#ef4444]',
          subtitle: 'text-gray-500',
          price: 'text-gray-800',
          buttonBg: 'bg-white border border-gray-300',
          buttonText: 'text-gray-800',
          buttonHover: 'hover:bg-gray-50',
          checkIcon: 'text-[#3b82f6]',
          listItem: 'text-gray-500'
        };
    }
  };

  return (
    <div className="flex flex-col text-sm w-full relative">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Subscription Plans</h2>
          <p className="text-gray-500 mt-1">Manage and view your pricing tiers</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#00b562] hover:bg-[#009b54] text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Create Subscription
        </button>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-center px-2 py-4">
        {items.map((item) => {
          const styles = getThemeClasses(item.theme);
          return (
            <div 
              key={item.id} 
              className={`relative rounded-[2rem] ${styles.cardBg} flex flex-col p-8 transition-transform hover:-translate-y-2 duration-300 ${item.isPopular ? 'py-12 shadow-2xl z-10 scale-105' : ''}`}
            >
              {item.isPopular && (
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#fbbf24] rounded-xl flex items-center justify-center transform rotate-12 shadow-lg z-20">
                  <Star className="w-7 h-7 text-white fill-white" />
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className={`text-2xl font-bold mb-2 ${styles.title}`}>{item.name}</h3>
                
                {item.theme === 'dark' ? (
                  <div className="flex flex-col items-center justify-center mt-4">
                    <Megaphone className="w-10 h-10 text-white mb-2" />
                    <div className={`text-sm ${styles.subtitle}`}>for individuals</div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center mt-4">
                    <span className={`text-4xl font-bold ${styles.price}`}>{item.price}</span>
                    <div className={`text-sm mt-1 ${styles.subtitle}`}>per user / month</div>
                  </div>
                )}
              </div>

              <button className={`w-full py-3.5 rounded-xl font-bold text-[15px] mb-8 transition-colors ${styles.buttonBg} ${styles.buttonText} ${styles.buttonHover}`}>
                Get started
              </button>

              <div className="flex-1">
                <ul className="flex flex-col gap-4">
                  {item.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 shrink-0 ${styles.checkIcon}`} strokeWidth={3} />
                      <span className={`text-[13px] leading-tight ${styles.listItem}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Admin Actions */}
              <div className="mt-8 pt-5 border-t border-gray-200/20 flex items-center justify-center gap-3">
                 <button className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-colors border ${item.theme === 'light-yellow' || item.theme === 'light-red' ? 'border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600' : 'border-white/20 text-white/80 hover:bg-white/10 hover:border-white/40 hover:text-white'}`}>
                   <Edit className="w-3.5 h-3.5" />
                   Update
                 </button>
                 <button className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-colors border ${item.theme === 'light-yellow' || item.theme === 'light-red' ? 'border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600' : 'border-white/20 text-white/80 hover:bg-white/10 hover:border-white/40 hover:text-red-200'}`}>
                   <Trash2 className="w-3.5 h-3.5" />
                   Delete
                 </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Popup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Create Subscriptions</h2>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-800">Subscriptions Name</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-800">Subscriptions Price</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-800">Price Without Discount</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-800">Discount [In Percentage]</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-800">Profile Duration</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-800">No Of Contacts</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-800">No Of Personalized Messaging</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-800">Privacy Settings</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-800">Validity Of Package</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-800">Customer Care Support</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <button 
                    type="button" 
                    className="bg-[#00b562] hover:bg-[#009b54] text-white px-6 py-2 rounded text-sm font-medium transition-colors"
                  >
                    Create
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagementListPage;
