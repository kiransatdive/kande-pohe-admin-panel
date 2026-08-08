import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevent refetching when switching tabs
      refetchOnMount: false,       // Prevent refetching when component mounts (if data exists)
      staleTime: 5 * 60 * 1000,    // Cache data for 5 minutes
    }
  }
});

const AppProviders: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Provider>
  );
};

export default AppProviders;
