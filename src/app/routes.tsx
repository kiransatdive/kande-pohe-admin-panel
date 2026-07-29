import { createBrowserRouter } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import AdminPage from '../pages/AdminPage';
import DashboardPage from '../pages/DashboardPage';
import UserListPage from '../pages/UserListPage';
import UserListApprovedPage from '../pages/UserListApprovedPage';
import UserListPendingApprovalPage from '../pages/UserListPendingApprovalPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {
        path: 'user-list',
        element: <UserListPage />
      },
      {
        path: 'user-list-approved',
        element: <UserListApprovedPage />
      },
      {
        path: 'user-list-pending-approval',
        element: <UserListPendingApprovalPage />
      },
      {
        path: 'admin',
        element: <AdminPage />
      }
    ]
  },
]);

export default router;
