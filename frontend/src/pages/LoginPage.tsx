import React, { useEffect } from 'react';
import type { FormProps } from 'antd';
import { Alert, Button, Checkbox, Flex, Form, Input, notification } from 'antd';
import '../styles/loginPage.style.css';
import Title from 'antd/es/typography/Title';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { loginUser } from '../redux/auth/login.slice';
type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
};

export default function LoginPage() {
    const dispatch = useAppDispatch();
    const { error, loading, success } = useAppSelector(
        (state: any) => state.login,
    );
    useEffect(() => {
        if (success) {
            notification.success({
                message: 'Login Successful',
                description: 'Welcome back!',
            });
        } else if (error) {
            notification.error({
                message: 'Login Failed',
                description: error,
            });
        }
    }, [error, success]);
    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values);

        dispatch(
            loginUser({
                username: values?.username || '',
                password: values?.password || '',
            }),
        );
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

                    {error && (
                        <Form.Item>
                            <Alert type='error' message={error} />
                        </Form.Item>
                    )}

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
                            loading={loading}
                        >
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Flex>
        </div>
    );
}
