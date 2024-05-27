import axios from 'axios';

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      '/api/auth/login',
      {
        email,
        password,
      },
      {
        withCredentials: true,
      },
    );
    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};
