'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Typography, Button, Divider, Form, Alert, Card, Space } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, MailOutlined, LockOutlined } from '@ant-design/icons';
import styles from './styles.module.css';
import unsplash from '@/utils/unsplash';
import { useQuery } from '@tanstack/react-query';
import { fetchUserData, login } from '../../services/authServices';
import { useUser } from '@/contexts/UserContext';

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

const Login: React.FC = () => {
  const { setUser } = useUser();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      const response = await login(values.email, values.password);

      if (response.statusCode === 200) {
        const userData = await fetchUserData(values.email);
        setUser(userData.data);
        router.push('/dashboard');
      } else {
        setErrorMessage('Login failed. Please check your credentials.');
      }
    } catch (error: any) {
      console.log('Error logging in:', error);
      setErrorMessage(error.response?.data?.error || 'An error occurred during login.');
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
              Track your expenses effortlessly and save more with our easy-to-use app. Sign in to get started!
            </Paragraph>
          </Typography>

          {errorMessage && (
            <Alert message={errorMessage} type="error" showIcon />
          )}

          <Form form={form} onFinish={handleSubmit} layout="vertical" size="large">
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
            <Form.Item>
              <Link className={styles.forgotPassword} href="#">
                Forgot Password?
              </Link>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isLoading} block>
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <Divider plain>Or</Divider>

          <Button icon={<img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" className={styles.googleLogo} />} block>
            Sign in with Google
          </Button>

          <Paragraph className={styles.signUpText}>
            Don't have an account? <Link href="/signup">Sign up</Link>
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

export default Login;
