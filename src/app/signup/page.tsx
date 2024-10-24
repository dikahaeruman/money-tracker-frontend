'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Typography, Button, Divider, Form, Alert, Card, Space } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import styles from './styles.module.css';
import unsplash from '@/utils/unsplash';
import { useQuery } from '@tanstack/react-query';

const { Title, Paragraph, Text, Link } = Typography;

const fetchRandomImage = async () => {
  const result = await unsplash.photos.getRandom({ query: 'nature' });
  if (result.errors) {
    throw new Error(result.errors[0]);
  }
  if ('response' in result && 'urls' in result.response) {
    return result.response.urls.regular;
  }
  throw new Error('Unexpected response structure from Unsplash API');
};

const SignUp: React.FC = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const onFinish = async (values: any) => {
    setIsLoading(true);
    try {
      // Implement your registration logic here
      console.log('Received values of form: ', values);
      // If registration is successful, you might want to redirect to login or dashboard
      // router.push('/login');
    } catch (error: any) {
      console.log('Error signing up:', error);
      setErrorMessage(error.response?.data?.error || 'An error occurred during sign up.');
    } finally {
      setIsLoading(false);
    }
  };

  const { data: imageUrl, error: imageError } = useQuery({
    queryKey: ['randomImage'],
    queryFn: fetchRandomImage,
    staleTime: Infinity,
  });

  if (!mounted) {
    return null; // or a loading spinner
  }

  return (
    <div className={styles.container}>
      <Card className={styles.formCard}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Typography>
            <Title className={styles.title}>Money Tracker</Title>
            <Paragraph>
              Join Money Tracker today and start managing your finances effortlessly!
            </Paragraph>
          </Typography>

          {errorMessage && (
            <Alert message={errorMessage} type="error" showIcon />
          )}

          <Form form={form} onFinish={onFinish} layout="vertical" size="large">
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
            <Form.Item
              name="confirm"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm Password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isLoading} block>
                Sign Up
              </Button>
            </Form.Item>
          </Form>

          <Divider plain>Or</Divider>

          <Button icon={<img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" className={styles.googleLogo} />} block>
            Sign up with Google
          </Button>

          <Paragraph className={styles.loginText}>
            Already have an account? <Link href="/login">Login</Link>
          </Paragraph>
        </Space>
      </Card>

      <div className={styles.imageContainer}>
        {imageUrl && (
          <img src={imageUrl} alt="Random nature" className={styles.image} />
        )}
        {imageError && (
          <Text type="danger">Error loading image: {(imageError as Error).message}</Text>
        )}
      </div>
    </div>
  );
};

export default SignUp;
