import apiClient from './apiClient';

export interface SubscriptionPlan {
  subscriptions_id: number;
  subscriptions_name: string;
  short_name: string;
  subscriptions_price: number;
  profile_duration: number;
  no_of_contacts: number;
  no_of_pm: number;
  privacy_settings: string;
  validity_of_package: number;
  customer_care_support: string;
  subscriptions_price_without_discount: string;
  subscriptions_discount: number;
  is_active: number;
}

export interface SubscriptionPlansResponse {
  success: boolean;
  message: string;
  data: SubscriptionPlan[];
}

export const getSubscriptionPlans = async (): Promise<SubscriptionPlansResponse> => {
  const response = await apiClient.get<SubscriptionPlansResponse>('v1/admin/subscriptions/plans');
  return response.data;
};

export interface CreateSubscriptionPlanPayload {
  subscriptions_name: string;
  short_name: string;
  subscriptions_price: number;
  profile_duration: number;
  no_of_contacts: number;
  no_of_pm: number;
  privacy_settings: string;
  validity_of_package: number;
  customer_care_support: string;
  subscriptions_price_without_discount: number;
  subscriptions_discount: number;
  is_active: boolean;
}

export const createSubscriptionPlan = async (payload: CreateSubscriptionPlanPayload) => {
  const response = await apiClient.post('v1/admin/subscriptions/plans', payload);
  return response.data;
};

export const updateSubscriptionPlan = async (id: number, payload: Partial<CreateSubscriptionPlanPayload>) => {
  const response = await apiClient.put(`v1/admin/subscriptions/plans/${id}`, payload);
  return response.data;
};

export const deleteSubscriptionPlan = async (id: number) => {
  const response = await apiClient.delete(`v1/admin/subscriptions/plans/${id}/hard`);
  return response.data;
};

