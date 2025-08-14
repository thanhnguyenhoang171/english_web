import {
    Button,
    Flex,
    Form,
    Input,
    InputNumber,
    message,
    notification,
    Select,
} from 'antd';
import '@/styles/registerPage.style.css';
import Title from 'antd/es/typography/Title';
import { useNavigate } from 'react-router';
import { callRegister } from '../api/accountApi';
import { useState } from 'react';

const { Option } = Select;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};
export default function RegisterPage() {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);

    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        const { name, email, password, age, gender, address, confirmPassword } =
            values;
        setIsSubmit(true);
        const res = await callRegister(
            name,
            email,
            password as string,
            +age,
            gender,
            address,
            confirmPassword,
        );
        setIsSubmit(false);
        if (res?.data?.data) {
            message.success('Đăng ký tài khoản thành công!');
            navigate('/login');
            setIsSubmit(false);
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description:
                    res.data.message && Array.isArray(res.data.message)
                        ? res.data.message[0]
                        : res.data.message,
                duration: 5,
            });
            setIsSubmit(false);
        }
    };

    return (
        <div className='register-container'>
            <Flex justify='center' align='center' style={{ height: '100vh' }}>
                <Form
                    {...formItemLayout}
                    form={form}
                    name='register'
                    onFinish={onFinish}
                    style={{ maxWidth: 600 }}
                    scrollToFirstError
                >
                    <Title
                        level={2}
                        style={{ textAlign: 'center', marginBottom: '24px' }}
                    >
                        Start Your English Adventure Today
                    </Title>
                    <Form.Item
                        name='email'
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

                    <Form.Item
                        name='password'
                        label='Password'
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name='confirmPassword'
                        label='Confirm Password'
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue('password') === value
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error(
                                            'The new password that you entered do not match!',
                                        ),
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name='name'
                        label='Name'
                        tooltip='What do you want others to call you?'
                        rules={[
                            {
                                required: true,
                                message: 'Please input your name!',
                                whitespace: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name='gender'
                        label='Gender'
                        rules={[
                            {
                                required: true,
                                message: 'Please select gender!',
                            },
                        ]}
                    >
                        <Select placeholder='select your gender'>
                            <Option value='male'>Male</Option>
                            <Option value='female'>Female</Option>
                            <Option value='other'>Other</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name='age'
                        label='Age'
                        rules={[
                            {
                                required: true,
                                message: 'Please enter your age!',
                            },
                            {
                                type: 'number',
                                min: 0,
                                max: 120,
                                message:
                                    'Age must be a number between 0 and 120!',
                            },
                        ]}
                    >
                        <InputNumber />
                    </Form.Item>

                    <Form.Item
                        name='address'
                        label='Address'
                        rules={[
                            {
                                required: true,
                                message: 'Please input your address!',
                                whitespace: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item name='haveAccount' {...tailFormItemLayout}>
                        <p>
                            I already have an account.{' '}
                            <a href='/login'>Sign in</a>
                        </p>
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        <Button
                            type='primary'
                            htmlType='submit'
                            loading={isSubmit}
                        >
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </Flex>
        </div>
    );
}
