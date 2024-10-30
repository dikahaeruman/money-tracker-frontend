'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Typography, Button, Divider, Form, Alert } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import styles from './styles.module.css';
import unsplash from '@/utils/unsplash';
import Image from 'next/image';
import { login } from '../../services/authServices'; // Adjusted import path

const { Title, Paragraph, Text, Link } = Typography;

const Login: React.FC = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const history = useRouter();

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
        console.log('token : ', response.data.token);
        setIsLoading(false);
        history.push('/dashboard');
      } else {
        console.log('Login failed');
        setIsLoading(false);
      }
    } catch (error: any) {
      console.log('Error logging in:', error);
      setErrorMessage(error.response?.data?.error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    unsplash.photos.getRandom({ query: 'nature' }).then((result: any) => {
      if (result.errors) {
        console.log('Error fetching image:', result.errors[0]);
      } else {
        setImageUrl(result.response.urls.regular);
      }
    });
  }, []);

  return (
    <div className={styles.container}>

      <Form className={styles.formContainer} onFinish={handleSubmit}>
        {/* TODO Contohnya gini alfan */}
      <Image src="/assets/images/login.jpg" width={100} height={100} alt="Login Image" className={styles.image} />
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
          <img src={imageUrl} alt="Image" className={styles.image} />
        )}
      </div>
    </div>
  );
};

export default Login;
