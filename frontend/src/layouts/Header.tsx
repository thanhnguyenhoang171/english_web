import {
 
    Avatar,
    Dropdown,
    Menu,
    message,
    Space,
    type MenuProps,
} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from 'antd/es/layout/layout';

import {
    CommentOutlined,
  
    DeliveredProcedureOutlined,
    DropboxOutlined,
    HomeOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../redux/hook';
// import { useEffect, useState } from 'react';
// import { useLocation } from 'react-router';
import { callLogout } from '../api/accountApi';
import { setLogoutAction } from '../redux/auth/account.slice';

const items: MenuProps['items'] = [
    {
        label: <Link to={'/'}>Trang Chủ</Link>,
        key: '/',
        icon: <HomeOutlined />,
    },
    {
        label: <Link to={'/flashcard'}>Flashcard</Link>,
        key: '/flashcard',
        icon: <DeliveredProcedureOutlined />,
    },
    {
        label: <Link to={'/post'}>Post</Link>,
        key: '/post',
        icon: <DropboxOutlined />,
    },

    {
        label: <Link to={'/comment'}>Comment</Link>,
        key: '/comment',
        icon: <CommentOutlined />,
    },
];
export const HeaderApp = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const isAuthenticated = useAppSelector(
        (state) => state.account.isAuthenticated,
    );
    const user = useAppSelector((state) => state.account.user);

    // const [current, setCurrent] = useState('home');
    // const location = useLocation();
    // useEffect(() => {
    //     setCurrent(location.pathname);
    // }, [location]);
    // const onClick: MenuProps['onClick'] = (e) => {
    //     setCurrent(e.key);
    // };

    const handleLogout = async () => {
        try {
            await callLogout();
        } catch (e) {
            console.error(e);
        } finally {
            dispatch(setLogoutAction()); // reset state
            message.success('Đăng xuất thành công');
            navigate('/login', { replace: true });
        }
    };

    const itemsDropdown = [
        {
            label: (
                <label
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleLogout()}
                >
                    Logout
                </label>
            ),
            key: 'logout',
            icon: <LogoutOutlined />,
        },
    ];

    return (
        <Header style={{ display: 'flex', alignItems: 'center' }}>
            <div className='demo-logo' />
            <Menu
                theme='dark'
                mode='horizontal'
                defaultSelectedKeys={['2']}
                items={items}
                style={{ flex: 1, minWidth: 0 }}
            />
            <div>
                {isAuthenticated === false ? (
                    <Link to={'/login'}>Login</Link>
                ) : (
                    <Dropdown
                        menu={{ items: itemsDropdown }}
                        trigger={['click']}
                    >
                        <Space style={{ cursor: 'pointer' }}>
                            <span style={{ color: 'blue' }}>
                                Welcome {user?.name}
                            </span>
                            <Avatar
                                style={{
                                    border: '2px solid #000',
                                    borderRadius: '50%',
                                    backgroundColor: 'white',
                                    color: 'red',
                                }}
                            >
                                {user?.name
                                    ?.substring(0, 2)
                                    ?.toUpperCase()}{' '}
                            </Avatar>
                        </Space>
                    </Dropdown>
                )}
            </div>
        </Header>
    );
};
