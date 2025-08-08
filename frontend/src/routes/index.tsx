import type { RouteObject } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/LoginPage';

const routes: RouteObject[] = [
    {
        path: '/',
        element: <MainLayout />, // layout chung
        children: [
            // { index: true, element: <Home /> },
            // { path: 'login', element: <Login /> },
            // { path: 'register', element: <RegisterPage /> },
            // {
            //     path: 'dashboard',
            //     children: [
            //         { index: true, element: <DashboardHome /> },
            //         { path: 'profile', element: <Profile /> },
            //     ],
            // },
        ],
    },
    {
        path: '/register',
        element: <RegisterPage />, // đăng ký
    },
    {
        path: '/login',
        element: <LoginPage />, // đăng ký
    },
];

export default routes;
