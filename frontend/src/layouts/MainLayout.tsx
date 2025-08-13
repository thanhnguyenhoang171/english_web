import { message } from 'antd';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { useEffect } from 'react';
import { setRefreshTokenAction } from '../redux/auth/account.slice';

interface IProps {
    children: React.ReactNode;
}

export function MainLayout(props: IProps) {
    const isRefreshToken = useAppSelector(
        (state) => state.account.isRefreshToken,
    );
    const errorRefreshToken = useAppSelector(
        (state) => state.account.errorRefreshToken,
    );
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    //handle refresh token error
    useEffect(() => {
        if (isRefreshToken === true) {
            localStorage.removeItem('access_token');
            message.error(errorRefreshToken);
            dispatch(setRefreshTokenAction({ status: false, message: '' }));
            navigate('/login');
        }
    }, [isRefreshToken]);

    return <>{props.children}</>;
}
