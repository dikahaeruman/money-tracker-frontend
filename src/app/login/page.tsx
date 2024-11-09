'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Button,
  Card,
  Divider,
  Form,
  Input,
  Space,
  Spin,
  Typography,
} from 'antd';
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { fetchRandomImage } from '@/utils/unsplash';
import styles from './page.module.css';
import { useUser } from '@/contexts/UserContext';

const { Title, Paragraph, Text, Link } = Typography;

const PasswordVisibilityIcon = (visible: boolean) =>
  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />;

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { refreshUser } = useUser();
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: imageUrl, error: imageError } = useQuery({
    queryKey: ['randomImage'],
    queryFn: () => fetchRandomImage('technology'),
    staleTime: Infinity,
    enabled: mounted,
  });

  const handleSubmit = useCallback(
    async (values: { email: string; password: string }) => {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
          credentials: 'include',
        });

        if (!loginResponse.ok) {
          setErrorMessage('Login failed. Please check your credentials.');
          return;
        }
        await refreshUser();
        router.push('/dashboard');
      } catch (error) {
        console.error('Error logging in:', error);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'An error occurred during login.',
        );
      } finally {
        setIsLoading(false);
      }
    },
    [router, refreshUser],
  );

  if (!mounted) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Random technology"
            className={styles.image}
          />
        )}
        {imageError && (
          <Text type="danger">Error loading image: {imageError.message}</Text>
        )}
      </div>

      <Card className={styles.formCard}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Typography>
            <Title className={styles.title}>Money Tracker</Title>
            <Paragraph>
              Track your expenses effortlessly and save more with our
              easy-to-use app. Sign in to get started!
            </Paragraph>
          </Typography>

          {errorMessage && (
            <Alert message={errorMessage} type="error" showIcon />
          )}

          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                iconRender={PasswordVisibilityIcon}
              />
            </Form.Item>
            <Form.Item>
              <Link className={styles.forgotPassword} href="#">
                Forgot Password?
              </Link>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <Divider plain>Or</Divider>

          <Button
            icon={
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google logo"
                className={styles.googleLogo}
              />
            }
            block
          >
            Sign in with Google
          </Button>

          <Paragraph className={styles.signUpText}>
            Don&apos;t have an account? <Link href="/signup">Sign up</Link>
          </Paragraph>
        </Space>
      </Card>
    </div>
  );
};

export default Login;