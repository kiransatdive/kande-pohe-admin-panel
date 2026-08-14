import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Check, Star, Megaphone } from 'lucide-react';
import { getSubscriptionPlans, createSubscriptionPlan, updateSubscriptionPlan, deleteSubscriptionPlan, type SubscriptionPlan, type CreateSubscriptionPlanPayload } from '../services/subscriptionService';
const formatDays = (days: number) => {
  if (days >= 365 && days % 365 === 0) {
    const years = days / 365;
    return `${years} Year${years > 1 ? 's' : ''}`;
  }
  if (days >= 30 && days % 30 === 0) {
    const months = days / 30;
    return `${months} Month${months > 1 ? 's' : ''}`;
  }
  return `${days} Day${days !== 1 ? 's' : ''}`;
};

const SubscriptionManagementListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateSubscriptionPlanPayload>({
    subscriptions_name: '',
    short_name: '',
    subscriptions_price: 0,
    profile_duration: 0,
    no_of_contacts: 0,
    no_of_pm: 0,
    privacy_settings: 'yes',
    validity_of_package: 0,
    customer_care_support: 'yes',
    subscriptions_price_without_discount: 0,
    subscriptions_discount: 0,
    is_active: true
  });

  const fetchPlans = async () => {
    try {
      const response = await getSubscriptionPlans();
      if (response.success) {
        setPlans(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch subscription plans', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'is_active') {
      setFormData(prev => ({ ...prev, [name]: value === 'true' }));
      return;
    }

    const numberFields = ['subscriptions_price', 'profile_duration', 'no_of_contacts', 'no_of_pm', 'validity_of_package', 'subscriptions_price_without_discount', 'subscriptions_discount'];
    
    setFormData(prev => ({
      ...prev,
      [name]: numberFields.includes(name) ? Number(value) : value
    }));
  };

  const handleEditClick = (plan: SubscriptionPlan) => {
    setEditId(plan.subscriptions_id);
    setFormData({
      subscriptions_name: plan.subscriptions_name,
      short_name: plan.short_name,
      subscriptions_price: plan.subscriptions_price,
      profile_duration: plan.profile_duration,
      no_of_contacts: plan.no_of_contacts,
      no_of_pm: plan.no_of_pm,
      privacy_settings: plan.privacy_settings.toLowerCase() === 'no' ? 'no' : 'yes',
      validity_of_package: plan.validity_of_package,
      customer_care_support: plan.customer_care_support.toLowerCase() === 'no' ? 'no' : 'yes',
      subscriptions_price_without_discount: Number(plan.subscriptions_price_without_discount) || 0,
      subscriptions_discount: plan.subscriptions_discount,
      is_active: plan.is_active === 1
    });
    setIsModalOpen(true);
  };

  const handleCreateNewClick = () => {
    setEditId(null);
    setFormData({
      subscriptions_name: '',
      short_name: '',
      subscriptions_price: 0,
      profile_duration: 0,
      no_of_contacts: 0,
      no_of_pm: 0,
      privacy_settings: 'yes',
      validity_of_package: 0,
      customer_care_support: 'yes',
      subscriptions_price_without_discount: 0,
      subscriptions_discount: 0,
      is_active: true
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editId) {
        const res = await updateSubscriptionPlan(editId, formData);
        if (res.success) {
          setIsModalOpen(false);
          fetchPlans();
        } else {
          alert(res.message || 'Failed to update plan');
        }
      } else {
        const res = await createSubscriptionPlan(formData);
        if (res.success) {
          setIsModalOpen(false);
          fetchPlans();
        } else {
          alert(res.message || 'Failed to create plan');
        }
      }
    } catch (error) {
      console.error(error);
      alert('Error saving subscription plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubscription = async (id: number) => {
    try {
      const res = await deleteSubscriptionPlan(id);
      if (res.success) {
        fetchPlans();
      } else {
        alert(res.message || 'Failed to delete plan');
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting subscription plan');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const getThemeByIndex = (index: number) => {
    const themes = ['dark', 'light-yellow', 'blue', 'light-red'];
    return themes[index % themes.length];
  };

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
          onClick={handleCreateNewClick}
          className="bg-[#3b82f6] hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center shadow-sm"
        >
          Create Subscription
        </button>
      </div>

      {/* Pricing Cards Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-center px-2 py-4">
          {plans.map((item, index) => {
            const theme = getThemeByIndex(index);
            const styles = getThemeClasses(theme);
            const isPopular = item.short_name === 'PACKAGE_GOLD' || item.short_name === 'GOLD_01';
            
            const features = [
              `Profile Duration: ${item.profile_duration} Days`,
              `Contacts: ${item.no_of_contacts}`,
              `Personalized Messages: ${item.no_of_pm}`,
              `Privacy Settings: ${item.privacy_settings}`,
              `Customer Support: ${item.customer_care_support}`
            ];

            return (
              <div 
                key={item.subscriptions_id} 
                className={`relative rounded-[2rem] ${styles.cardBg} flex flex-col p-8 transition-transform hover:-translate-y-2 duration-300 ${isPopular ? 'py-12 shadow-2xl z-10 scale-105' : ''}`}
              >
                <div className="absolute top-6 left-6 z-20">
                  <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {item.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {isPopular && (
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#fbbf24] rounded-xl flex items-center justify-center transform rotate-12 shadow-lg z-20">
                    <Star className="w-7 h-7 text-white fill-white" />
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className={`text-2xl font-bold mb-2 ${styles.title}`}>{item.subscriptions_name}</h3>
                  
                  {theme === 'dark' ? (
                    <div className="flex flex-col items-center justify-center mt-4">
                      <Megaphone className="w-10 h-10 text-white mb-2" />
                      <div className={`text-sm ${styles.subtitle}`}>for {formatDays(item.validity_of_package)}</div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center mt-4">
                      {item.subscriptions_discount > 0 && Number(item.subscriptions_price_without_discount) > 0 && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-gray-400 line-through font-medium">₹{Number(item.subscriptions_price_without_discount).toLocaleString('en-IN')}</span>
                          <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">{item.subscriptions_discount}% OFF</span>
                        </div>
                      )}
                      <span className={`text-4xl font-bold ${styles.price}`}>₹{item.subscriptions_price.toLocaleString('en-IN')}</span>
                      <div className={`text-sm mt-1 ${styles.subtitle}`}>for {formatDays(item.validity_of_package)}</div>
                    </div>
                  )}
                </div>

                <button className={`w-full py-3.5 rounded-xl font-bold text-[15px] mb-8 transition-colors ${styles.buttonBg} ${styles.buttonText} ${styles.buttonHover}`}>
                  Get started
                </button>

                <div className="flex-1">
                  <ul className="flex flex-col gap-4">
                    {features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 shrink-0 ${styles.checkIcon}`} strokeWidth={3} />
                        <span className={`text-[13px] leading-tight ${styles.listItem}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Admin Actions */}
                <div className="mt-8 pt-5 border-t border-gray-200/20 flex items-center justify-center gap-3">
                   <button 
                     onClick={() => handleEditClick(item)}
                     className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-colors border ${theme === 'light-yellow' || theme === 'light-red' ? 'border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600' : 'border-white/20 text-white/80 hover:bg-white/10 hover:border-white/40 hover:text-white'}`}
                   >
                     <Edit className="w-3.5 h-3.5" />
                     Update
                   </button>
                   <button 
                     onClick={() => setDeleteConfirmId(item.subscriptions_id)}
                     className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-colors border ${theme === 'light-yellow' || theme === 'light-red' ? 'border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600' : 'border-white/20 text-white/80 hover:bg-white/10 hover:border-white/40 hover:text-red-200'}`}
                   >
                     <Trash2 className="w-3.5 h-3.5" />
                     Delete
                   </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Popup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-[15px] font-medium text-gray-800">
                {editId ? 'Edit Subscription' : 'Create Subscription'}
              </h2>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Subscriptions Name</label>
                  <input 
                    type="text" 
                    name="subscriptions_name"
                    value={formData.subscriptions_name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Short Name</label>
                  <input 
                    type="text" 
                    name="short_name"
                    value={formData.short_name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Subscriptions Price</label>
                  <input 
                    type="number" 
                    name="subscriptions_price"
                    value={formData.subscriptions_price}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Price Without Discount</label>
                  <input 
                    type="number" 
                    name="subscriptions_price_without_discount"
                    value={formData.subscriptions_price_without_discount}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Discount [In Percentage]</label>
                  <input 
                    type="number" 
                    name="subscriptions_discount"
                    value={formData.subscriptions_discount}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Profile Duration (Days)</label>
                  <input 
                    type="number" 
                    name="profile_duration"
                    value={formData.profile_duration}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-bold text-slate-700 mb-2">No Of Contacts</label>
                  <input 
                    type="number" 
                    name="no_of_contacts"
                    value={formData.no_of_contacts}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-bold text-slate-700 mb-2">No Of Personalized Messaging</label>
                  <input 
                    type="number" 
                    name="no_of_pm"
                    value={formData.no_of_pm}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Privacy Settings</label>
                  <select
                    name="privacy_settings"
                    value={formData.privacy_settings}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Validity Of Package (Days)</label>
                  <input 
                    type="number" 
                    name="validity_of_package"
                    value={formData.validity_of_package}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Customer Care Support</label>
                  <select
                    name="customer_care_support"
                    value={formData.customer_care_support}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                  <select
                    name="is_active"
                    value={formData.is_active ? 'true' : 'false'}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {editId ? (isSubmitting ? 'Updating...' : 'Update') : (isSubmitting ? 'Creating...' : 'Create')}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Plan</h3>
            <p className="text-gray-500 text-sm mb-6">Are you sure you want to delete this subscription plan? This action cannot be undone.</p>
            <div className="flex justify-center gap-3 w-full">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDeleteSubscription(deleteConfirmId)}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagementListPage;
