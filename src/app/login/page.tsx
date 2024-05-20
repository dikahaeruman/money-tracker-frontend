'use client'
import { ChangeEvent, useState } from 'react';
import { AccountCircle, LockRounded } from '@mui/icons-material';
import { Button, Container, FormControl, Grid, InputAdornment, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import styles from './styles.module.css';
import Image from 'next/image';

interface Credentials {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const [credentials, setCredentials] = useState<Credentials>({ email: '', password: '' });
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCredentials(prevCredentials => ({
            ...prevCredentials,
            [name]: value,
        }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Credentials:', credentials);
    };

    return (
        <Container className={styles.container}>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item xs={12} md={6} lg={4}>
                    <div className={styles.loginForm}>
                        <Typography variant="h4" align="center" gutterBottom>
                            Welcome Back👋
                        </Typography>
                        <Typography variant="body1" align="center" paragraph>
                            Today is a new day. It's your day. You shape it. Sign in to start tracking your expenses.
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="email-input"
                                    label="Email"
                                    name="email"
                                    value={credentials.email}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AccountCircle />
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant="outlined"
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="password-input"
                                    label="Password"
                                    name="password"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockRounded />
                                            </InputAdornment>
                                        ),
                                    }}
                                    type="password"
                                    variant="outlined"
                                />
                            </FormControl>
                            <Typography variant="body2" align="right" gutterBottom>
                                <a href="#forgotpassword" className={styles.forgotPassword}>Forgot Password?</a>
                            </Typography>
                            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
                                Sign in
                            </Button>
                        </form>
                    </div>
                </Grid>
                {!isSmallScreen && (
                    <Grid item xs={12} md={6} lg={8} className={styles.loginImageContainer}>
                        <div className={styles.loginRight}>
                            <Image
                                src="/assets/images/login.jpg"
                                alt="Money Management"
                                width={800}
                                height={850}
                                className={styles.loginImage}
                            />
                        </div>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default Login;
