import { useEffect, useRef, useState, type JSX } from 'react';
import { createBrowserRouter, useLocation } from 'react-router';
import { Alert, Layout, theme } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Outlet, RouterProvider } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { fetchAccount } from './redux/auth/account.slice';
import { useAppDispatch, useAppSelector } from './redux/hook';
import { HomePage } from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import { HeaderApp } from './layouts/Header';
import '@/styles/main.css';

import FlashcardList from './components/flashcard/flashcardList';
import PostOwnerList from './components/post/postOwnerList';
import { CommentOwner } from './components/comment/commentOwner';
import { AppFooter } from './layouts/Footer';

const LayoutClient = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (rootRef && rootRef.current) {
            rootRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [location]);

    return (
        <>
            <div className='layout-app' ref={rootRef}>
                <Layout>
                    <HeaderApp />
                    <Content style={{ padding: '48px 32px' }}>
                        <div
                            style={{
                                background: colorBgContainer,
                                minHeight: 280,
                                padding: 24,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            <Outlet context={[searchTerm, setSearchTerm]} />
                        </div>
                    </Content>
                    <AppFooter />
                </Layout>
            </div>
        </>
    );
};
interface PrivateRouteProps {
    isAuthenticated: boolean;
    children: JSX.Element;
}
export default function App() {
    const dispatch = useAppDispatch();
    // const isLoading = useAppSelector((state) => state.account.isLoading);
    const isAuthenticated = useAppSelector(
        (state) => state.account.isAuthenticated,
    );

    const PrivateRoute: React.FC<PrivateRouteProps> = ({
        isAuthenticated,
        children,
    }) => {
        if (!isAuthenticated) {
            return (
                <div style={{ padding: 24 }}>
                    <Alert
                        message='Bạn cần đăng nhập để sử dụng chức năng này'
                        type='warning'
                        showIcon
                    />
                </div>
            );
        }
        return children;
    };
    useEffect(() => {
        if (
            window.location.pathname === '/login' ||
            window.location.pathname === '/register'
        )
            return;
        dispatch(fetchAccount());
    }, []);

    const router = createBrowserRouter([
        {
            path: '/',
            element: (
                <MainLayout>
                    <LayoutClient />
                </MainLayout>
            ),

            children: [
                {
                    index: true,
                    element: <HomePage isAuthenticated={isAuthenticated} />,
                },
                {
                    path: 'flashcard',
                    element: (
                        <PrivateRoute isAuthenticated={isAuthenticated}>
                            <FlashcardList />
                        </PrivateRoute>
                    ),
                },
                {
                    path: 'post',
                    element: (
                        <PrivateRoute isAuthenticated={isAuthenticated}>
                            <PostOwnerList />
                        </PrivateRoute>
                    ),
                },
                {
                    path: 'comment',
                    element: (
                        <PrivateRoute isAuthenticated={isAuthenticated}>
                            <CommentOwner />
                        </PrivateRoute>
                    ),
                },
            ],
        },

        {
            path: '/login',
            element: <LoginPage />,
        },

        {
            path: '/register',
            element: <RegisterPage />,
        },
    ]);

    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}
