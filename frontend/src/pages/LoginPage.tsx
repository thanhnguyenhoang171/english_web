import { useEffect, useState } from 'react';
import type { FormProps } from 'antd';
import {
   
    Button,
    Checkbox,
    Flex,
    Form,
    Input,

    notification,
} from 'antd';
import '../styles/loginPage.style.css';
import Title from 'antd/es/typography/Title';
import { useAppDispatch, useAppSelector } from '../redux/hook';

import { useLocation} from 'react-router-dom';
import { callLogin } from '../api/accountApi';
import { setUserLoginInfo } from '../redux/auth/account.slice';

type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
};

export default function LoginPage() {
    const dispatch = useAppDispatch();
    const [isSubmit, setIsSubmit] = useState(false);
    // const navigate = useNavigate();
    const isAuthenticated = useAppSelector(
        (state) => state.account.isAuthenticated,
    );
    // const isLoading = useAppSelector((state) => state.account.isLoading);

    let location = useLocation();
    let param = new URLSearchParams(location.search);
    let callback = param?.get('callback');
    useEffect(() => {
        if (isAuthenticated) {
            window.location.href = '/';
        }
    });
    const onFinish: FormProps<FieldType>['onFinish'] = async (values: any) => {
        const { username, password } = values;
        setIsSubmit(true);
        try {
            const res = await callLogin(username, password);
            setIsSubmit(false);
            if (res?.data?.data) {
                localStorage.setItem(
                    'access_token',
                    res.data.data.access_token,
                );

                dispatch(setUserLoginInfo(res.data.data?.user));
                alert("Đăng nhập thành công")
                window.location.href = callback ? callback : '/';
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description:
                        res.data.message && Array.isArray(res.data.message)
                            ? res.data.message[0]
                            : res.data.message,
                    duration: 5,
                });
            }
        } catch (error: any) {
            setIsSubmit(false);
            notification.error({
                message: 'Có lỗi xảy ra',
                description:
                    error.response?.data?.message || 'Đăng nhập thất bại!',
                duration: 5,
            });
        }
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
        errorInfo,
    ) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div className='login-container'>
            <Flex justify='center' align='center' style={{ height: '100vh' }}>
                <Form
                    name='basic'
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete='off'
                >
                    <Title
                        level={2}
                        style={{ textAlign: 'center', marginBottom: '24px' }}
                    >
                        Ready to Continue? Log In Below
                    </Title>

                    <Form.Item<FieldType>
                        name='username'
                        label='E-mail'
                        rules={[
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                            {
                                required: true,
                                message: 'Please input your E-mail!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label='Password'
                        name='password'
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item<FieldType>
                        name='remember'
                        valuePropName='checked'
                        label={null}
                        style={{ marginBottom: '0px', marginTop: '0px' }}
                    >
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item name='noAccount' label={null}>
                        <p>
                            Don't have an account?{' '}
                            <a href='/register'>Sign up</a>
                        </p>
                    </Form.Item>

                    <Form.Item label={null}>
                        <Button
                            type='primary'
                            htmlType='submit'
                            loading={isSubmit}
                        >
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Flex>
        </div>
    );
}
