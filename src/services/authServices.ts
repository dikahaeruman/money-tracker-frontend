const url = `${process.env.NEXT_PUBLIC_BASE_URL}`;

export const login = async (email: string, password: string) => {
    try {
        const response = await fetch(`${url}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include',
        });

        return response.json();
        
    } catch (error) {
        console.log('Error logging in services:', error);
        return error;
    }
};

export const fetchUserData = async (email: string) => {
    try {
        const response = await fetch(`${url}/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
            credentials: 'include',
        });

        return response.json();
    } catch (error) {
        console.log('Error fetching user data:', error);
        return error;
    }
};
