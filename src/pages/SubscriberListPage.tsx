import React, { useState, useEffect } from 'react';
import { Search, Loader2, Eye } from 'lucide-react';
import Pagination from '../components/common/Pagination';
import SubscriberDetailsModal from '../components/common/SubscriberDetailsModal';
import apiClient from '../services/apiClient';
import { getSubscriptionPlans } from '../services/subscriptionService';

interface Subscriber {
  usd_id?: number;
  usd_user_id?: number;
  usd_payment_type?: string;
  usd_transaction_id?: string | null;
  usd_payment_status?: string;
  usd_order_id?: string;
  usd_order_status?: string;
  usd_payment_mode?: string;
  usd_currency?: string;
  usd_subscription_start_date?: string | null;
  usd_subscription_end_date?: string | null;
  usd_status?: string;
  usd_subscription_name?: string;
  usd_subscriptions_price?: number;
  usd_validity_of_package?: number;
  First_Name?: string | null;
  Last_Name?: string | null;
  Mobile?: string;
  Email?: string | null;
  Gender?: string;
  status?: number;
  
  // Legacy fields
  id?: number;
  email?: string | null;
  plan_name?: string | null;
  buy_date?: number | string | null;
  expiry_date?: number | string | null;
  [key: string]: any;
}

const mockSubscribers: Subscriber[] = [
  {
    id: 1,
    First_Name: 'Raj',
    Last_Name: 'Patil',
    email: 'raj.patil@example.com',
    plan_name: 'Premium',
    buy_date: Date.now() - 30 * 24 * 60 * 60 * 1000,
    expiry_date: Date.now() + 335 * 24 * 60 * 60 * 1000,
    status: 1
  },
  {
    id: 2,
    First_Name: 'Priya',
    Last_Name: 'Deshmukh',
    email: 'priya.deshmukh@example.com',
    plan_name: 'Basic',
    buy_date: Date.now() - 15 * 24 * 60 * 60 * 1000,
    expiry_date: Date.now() + 350 * 24 * 60 * 60 * 1000,
    status: 1
  },
  {
    id: 3,
    First_Name: 'Amit',
    Last_Name: 'Joshi',
    email: 'amit.joshi@example.com',
    plan_name: 'Premium',
    buy_date: Date.now() - 400 * 24 * 60 * 60 * 1000,
    expiry_date: Date.now() - 35 * 24 * 60 * 60 * 1000,
    status: 0
  },
  {
    id: 4,
    First_Name: 'Sneha',
    Last_Name: 'Kulkarni',
    email: 'sneha.kulkarni@example.com',
    plan_name: 'Pro',
    buy_date: Date.now() - 5 * 24 * 60 * 60 * 1000,
    expiry_date: Date.now() + 175 * 24 * 60 * 60 * 1000,
    status: 1
  },
  {
    id: 5,
    First_Name: 'Rahul',
    Last_Name: 'Pawar',
    email: 'rahul.pawar@example.com',
    plan_name: 'Basic',
    buy_date: Date.now() - 365 * 24 * 60 * 60 * 1000,
    expiry_date: Date.now() - 1 * 24 * 60 * 60 * 1000,
    status: 0
  },
  {
    id: 6,
    First_Name: 'Anjali',
    Last_Name: 'Sharma',
    email: 'anjali.sharma@example.com',
    plan_name: 'Premium',
    buy_date: Date.now() - 60 * 24 * 60 * 60 * 1000,
    expiry_date: Date.now() + 305 * 24 * 60 * 60 * 1000,
    status: 1
  },
  {
    id: 7,
    First_Name: 'Vikram',
    Last_Name: 'Singh',
    email: 'vikram.singh@example.com',
    plan_name: 'Pro',
    buy_date: Date.now() - 120 * 24 * 60 * 60 * 1000,
    expiry_date: Date.now() + 60 * 24 * 60 * 60 * 1000,
    status: 1
  },
  {
    id: 8,
    First_Name: 'Kavita',
    Last_Name: 'Nair',
    email: 'kavita.nair@example.com',
    plan_name: 'Basic',
    buy_date: Date.now() - 400 * 24 * 60 * 60 * 1000,
    expiry_date: Date.now() - 35 * 24 * 60 * 60 * 1000,
    status: 0
  },
  {
    id: 9,
    First_Name: 'Rohit',
    Last_Name: 'Bhatt',
    email: 'rohit.bhatt@example.com',
    plan_name: 'Premium',
    buy_date: Date.now() - 10 * 24 * 60 * 60 * 1000,
    expiry_date: Date.now() + 355 * 24 * 60 * 60 * 1000,
    status: 1
  },
  {
    id: 10,
    First_Name: 'Neha',
    Last_Name: 'Gupta',
    email: 'neha.gupta@example.com',
    plan_name: 'Pro',
    buy_date: Date.now() - 200 * 24 * 60 * 60 * 1000,
    expiry_date: Date.now() - 20 * 24 * 60 * 60 * 1000,
    status: 0
  }
];

const SubscriberListPage: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [availablePlans, setAvailablePlans] = useState<string[]>([]);

  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSubscribers = async (page: number, currentSearch = searchQuery, currentStatusFilter = statusFilter, currentPlanFilter = planFilter) => {
    setIsLoading(true);
    setError('');
    const isSearching = currentSearch.trim().length > 0 || currentStatusFilter !== 'all' || currentPlanFilter !== 'all';
    try {
      const response = await apiClient.get('v1/admin/subscriptions/users', {
        params: {
          page: isSearching ? 1 : page,
          limit: isSearching ? 10000 : 10,
          search: currentSearch
        },
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      });

      if (response.data.success || response.data) {
        // Handle different possible response structures
        const data = response.data?.data?.users || response.data?.data || response.data || [];
        setSubscribers(Array.isArray(data) ? data : []);
        
        if (!isSearching && response.data?.data?.pagination) {
          setTotalPages(response.data.data.pagination.totalPages || 1);
          setTotalItems(response.data.data.pagination.total || 0);
        } else if (!isSearching && response.data.meta) {
          setTotalPages(response.data.meta.totalPages || 1);
          setTotalItems(response.data.meta.total || 0);
        } else if (!isSearching) {
          setTotalItems(Array.isArray(data) ? data.length : 0);
          setTotalPages(1);
        }
      } else {
        setError('Failed to fetch subscribers');
      }
    } catch (err: any) {
      console.error('Error fetching subscribers:', err);
      // Fallback for UI demonstration if backend endpoint doesn't exist yet
      console.log('API failed, loading demo users');
      setSubscribers(mockSubscribers);
      setTotalPages(1);
      setTotalItems(mockSubscribers.length);

    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch plans for the dropdown
    getSubscriptionPlans().then(res => {
      if (res.success && res.data) {
        const planNames = Array.from(new Set(res.data.map(p => p.subscriptions_name).filter(Boolean)));
        setAvailablePlans(planNames);
      }
    }).catch(err => console.error("Error fetching plans:", err));
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSubscribers(searchQuery || statusFilter !== 'all' || planFilter !== 'all' ? 1 : currentPage, searchQuery, statusFilter, planFilter);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, statusFilter, planFilter, searchQuery || statusFilter !== 'all' || planFilter !== 'all' ? 1 : currentPage]);

  const formatDate = (dateValue?: number | string | null) => {
    if (!dateValue) return 'N/A';
    
    if (typeof dateValue === 'number' || (typeof dateValue === 'string' && /^\d+$/.test(dateValue))) {
      let timestamp = Number(dateValue);
      if (timestamp < 10000000000) {
        timestamp *= 1000;
      }
      return new Date(timestamp).toLocaleDateString('en-GB');
    }

    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return 'N/A';
    
    return d.toLocaleDateString('en-GB');
  };

  const filteredSubscribers = subscribers.filter(sub => {
    const query = searchQuery.toLowerCase();
    
    const fullName = `${sub.First_Name || ''} ${sub.Last_Name || ''}`.toLowerCase();
    const formattedBuyDate = formatDate(sub.usd_subscription_start_date || sub.buy_date).toLowerCase();
    const formattedExpiryDate = formatDate(sub.usd_subscription_end_date || sub.expiry_date).toLowerCase();
    
    let statusStr = 'unknown';
    if (sub.usd_status) statusStr = sub.usd_status.toLowerCase();
    else if (String(sub.status) === '1' || String(sub.status).toLowerCase() === 'active') statusStr = 'active';
    else if (String(sub.status) === '0' || String(sub.status).toLowerCase() === 'expired') statusStr = 'expired';
    else if (sub.status) statusStr = String(sub.status).toLowerCase();

    if (statusFilter !== 'all') {
      const isMatch = statusStr.includes(statusFilter) || statusStr === statusFilter;
      if (!isMatch) return false;
    }

    if (planFilter !== 'all') {
      const subPlanStr = (sub.usd_subscription_name || sub.plan_name || '').toLowerCase();
      if (!subPlanStr.includes(planFilter.toLowerCase())) return false;
    }

    if (!searchQuery) return true;

    let searchStatusStr = statusStr;
    if (statusStr === 'active' || statusStr === 'activated') searchStatusStr = 'active activated';
    if (statusStr === 'expired' || statusStr === 'expire') searchStatusStr = 'expired expire';
    if (statusStr === 'block' || statusStr === 'blocked') searchStatusStr = 'block blocked';
    if (statusStr === 'deactive' || statusStr === 'deactivated' || statusStr === 'inactive') searchStatusStr = 'deactive deactivated inactive';

    return (
      (sub.usd_id?.toString() || sub.id?.toString() || '').includes(query) ||
      (sub.usd_user_id?.toString() || '').includes(query) ||
      fullName.includes(query) ||
      (sub.Email || sub.email || '').toLowerCase().includes(query) ||
      (sub.Mobile || '').toLowerCase().includes(query) ||
      formattedBuyDate.includes(query) ||
      formattedExpiryDate.includes(query) ||
      searchStatusStr.includes(query) ||
      (sub.usd_subscription_name || '').toLowerCase().includes(query) ||
      (sub.usd_payment_type || '').toLowerCase().includes(query) ||
      (sub.usd_order_id || '').toLowerCase().includes(query) ||
      (sub.usd_transaction_id || '').toLowerCase().includes(query) ||
      (sub.usd_payment_mode || '').toLowerCase().includes(query) ||
      (sub.usd_payment_status || '').toLowerCase().includes(query) ||
      (sub.usd_order_status || '').toLowerCase().includes(query) ||
      (sub.usd_currency || '').toLowerCase().includes(query)
    );
  });

  const handlePageChange = (page: number) => {
    const isSearching = !!searchQuery || statusFilter !== 'all' || planFilter !== 'all';
    const maxPage = isSearching ? Math.ceil(filteredSubscribers.length / 10) || 1 : totalPages;
    if (page >= 1 && page <= maxPage) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex flex-col text-sm">
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-[15px] font-medium text-gray-800">Subscriber List</h2>
            <div className="text-xs text-gray-500">
              Showing {(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, (!!searchQuery || statusFilter !== 'all' || planFilter !== 'all') ? filteredSubscribers.length : totalItems)} of <span className="font-semibold text-gray-800">{(!!searchQuery || statusFilter !== 'all' || planFilter !== 'all') ? filteredSubscribers.length : totalItems}</span> items.
            </div>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <select
              value={planFilter}
              onChange={(e) => {
                setPlanFilter(e.target.value);
                if (currentPage !== 1) setCurrentPage(1);
              }}
              className="bg-slate-50 border border-gray-200 text-gray-700 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors cursor-pointer max-w-[150px] truncate"
            >
              <option value="all">All Plans</option>
              {availablePlans.map(plan => (
                <option key={plan} value={plan}>{plan}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                if (currentPage !== 1) setCurrentPage(1);
              }}
              className="bg-slate-50 border border-gray-200 text-gray-700 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="activated">Activated</option>
              <option value="block">Block</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
           
            </select>
            <div className="relative flex-1 sm:flex-none">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search subscribers..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentPage !== 1) setCurrentPage(1);
                }}
                className="w-full sm:w-64 bg-slate-50 border border-gray-200 text-gray-700 text-base rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto p-4">
          <table className="w-full text-left text-xs border border-gray-100">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 font-semibold text-gray-500 w-12">#</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Name</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Contact</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Plan</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Buy Date</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Expiry Date</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Status</th>
                <th className="px-4 py-3 font-semibold text-gray-500 text-center w-16">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-500 mb-2" />
                      Loading subscribers...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-red-500 bg-red-50/50">
                    {error}
                  </td>
                </tr>
              ) : filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No subscribers found.
                  </td>
                </tr>
              ) : (
                ((!!searchQuery || statusFilter !== 'all') ? filteredSubscribers.slice((currentPage - 1) * 10, currentPage * 10) : filteredSubscribers).map((sub, index) => (
                  <tr key={sub.usd_id || sub.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3 text-gray-500">{(currentPage - 1) * 10 + index + 1}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {sub.First_Name || ''} {sub.Last_Name || ''}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[#3b82f6] hover:underline cursor-pointer">{sub.Email || sub.email || '-'}</div>
                      <div className="text-gray-500 text-xs">{sub.Mobile || '-'}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{sub.usd_subscription_name || sub.plan_name || '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(sub.usd_subscription_start_date || sub.buy_date)}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(sub.usd_subscription_end_date || sub.expiry_date)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1.5 rounded inline-block min-w-[80px] text-center text-xs font-medium text-white ${
                        sub.usd_status?.toLowerCase() === 'activated' || String(sub.status) === '1' || String(sub.status).toLowerCase() === 'active' 
                          ? 'bg-[#00b562]' 
                          : sub.usd_status?.toLowerCase() === 'pending'
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                      }`}>
                        {sub.usd_status || (String(sub.status) === '1' || String(sub.status).toLowerCase() === 'active' 
                          ? 'Active' 
                          : String(sub.status) === '0' || String(sub.status).toLowerCase() === 'expired'
                            ? 'Expired'
                            : sub.status || 'Unknown')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        onClick={() => {
                          setSelectedSubscriber(sub);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {((!!searchQuery || statusFilter !== 'all') ? filteredSubscribers.length > 0 : subscribers.length > 0) && (
          <Pagination 
            currentPage={currentPage}
            totalPages={(!!searchQuery || statusFilter !== 'all') ? Math.ceil(filteredSubscribers.length / 10) || 1 : totalPages}
            onPageChange={handlePageChange}
            infoText={`Showing ${(currentPage - 1) * 10 + 1} to ${Math.min(currentPage * 10, (!!searchQuery || statusFilter !== 'all') ? filteredSubscribers.length : totalItems)} of ${(!!searchQuery || statusFilter !== 'all') ? filteredSubscribers.length : totalItems} entries`}
          />
        )}
      </div>
      <SubscriberDetailsModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSubscriber(null);
        }}
        subscriber={selectedSubscriber}
      />
    </div>
  );
};

export default SubscriberListPage;
