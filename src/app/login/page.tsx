'use client'
import React, { useEffect, useState } from 'react';
import { Input, Typography, Button, Divider, Form } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import styles from './styles.module.css';
import unsplash from '@/utils/unsplash';

const { Title, Paragraph, Text, Link } = Typography;

const Login: React.FC = () => {
    const [imageUrl, setImageUrl] = useState('');

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
            <Form className={styles.formContainer}>
                <Typography>
                    <Title className={styles.title}>Money Tracker</Title>
                    <Paragraph>
                        <Text>Track your expenses effortlessly and save more with our easy-to-use app. Sign in to get started!</Text>
                    </Paragraph>
                </Typography>
                <Input type="email" placeholder="Email" className={styles.input} required />
                <Input.Password
                    placeholder="Password"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    className={styles.input}
                    required
                />
                <Paragraph className={styles.forgotPassword}>
                    <Link href="#">Forgot Password?</Link>
                </Paragraph>
                <Button type="primary" className={styles.button} htmlType="submit">Sign In</Button>
                <Divider>Or</Divider>
                <Button className={styles.googleButton}>
                    <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" className={styles.googleLogo} />
                    Sign in with Google
                </Button>
                <Paragraph className={styles.signUpText}>
                    Don't you have an account? <Link href="/signup">Sign up</Link>
                </Paragraph>
            </Form>
            <div className={styles.imageContainer}>
                {imageUrl && <img src={imageUrl} alt="Image" className={styles.image} />}
            </div>
        </div>
    );
}

export default Login;
