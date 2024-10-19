const url = `${process.env.NEXT_PUBLIC_BASE_URL}`
export const login = async (email, password) => {
    console.log("url", url)
    try {
        const response = await fetch(`${url}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        return response.json();
        
    } catch (error) {
        console.log('Error logging in services:', error);
        return error;
    }
};