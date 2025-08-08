import { Button, Flex, Form, Input, InputNumber, message, Select } from 'antd';
import '../styles/RegisterPage.style.css';
import Title from 'antd/es/typography/Title';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { registerUser } from '../redux/auth/register.slice';

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
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state: any) => state.register);

    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        const userData = {
            email: values.email,
            password: values.password,
            name: values.name,
            age: values.age,
            address: values.address,
            gender: values.gender,
            confirmPassword: values.confirmPassword,
        };
        const result = await dispatch(registerUser(userData));
        if (registerUser.fulfilled.match(result)) {
            message.success('Register successful!');
            form.resetFields();
        } else {
            message.error(
                typeof result.payload === 'string'
                    ? result.payload
                    : 'Failed to register',
            );
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
                            loading={loading}
                        >
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </Flex>
        </div>
    );
}
