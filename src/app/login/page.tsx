'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Typography, Button, Divider, Form, Alert } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import styles from './styles.module.css';
import unsplash from '@/utils/unsplash';
import { useQuery } from '@tanstack/react-query';
import {fetchUserData, login} from '../../services/authServices';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrorMessage('');
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setIsLoading(true);
      const response = await login(email, password);

      if (response.statusCode === 200) {
        const userData = await fetchUserData(email);
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

  return (
    <div className={styles.container}>
      <Form className={styles.formContainer} onFinish={handleSubmit}>
        <Typography>
          <Title className={styles.title}>Money Tracker</Title>
          <Paragraph>
            <Text>
              {
                'Track your expenses effortlessly and save more with our easy-to-use app. Sign in to get started!'
              }
            </Text>
          </Paragraph>
        </Typography>
        {errorMessage && (
          <Alert className={styles.alert} message={errorMessage} type="error" />
        )}

        <Input
          type="email"
          placeholder="Email"
          className={styles.input}
          required
          onChange={handleChangeEmail}
        />
        <Input.Password
          placeholder="Password"
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
          className={styles.input}
          required
          onChange={handleChangePassword}
        />
        <Paragraph className={styles.forgotPassword}>
          <Link href="#">Forgot Password?</Link>
        </Paragraph>
        <Button
          type="primary"
          className={styles.button}
          htmlType="submit"
          loading={isLoading}
        >
          Sign In
        </Button>
        <Divider>Or</Divider>
        <Button className={styles.googleButton}>
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
            className={styles.googleLogo}
          />
          Sign in with Google
        </Button>
        <Paragraph className={styles.signUpText}>
          Don`t you have an account? <Link href="/signup">Sign up</Link>
        </Paragraph>
      </Form>
      <div className={styles.imageContainer}>
        {imageUrl && (
          <img src={imageUrl} alt="Random nature" className={styles.image} />
        )}
        {imageError && (
          <p>Error loading image: {(imageError as Error).message}</p>
        )}
      </div>
    </div>
  );
};

export default Login;
