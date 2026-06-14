import {getAuth, onAuthStateChanged} from 'firebase/auth';

export const BASE_URL = "http://localhost:8080";

const PUBLIC_ROUTES = ['/user/register', '/user/check-nickname'];

const waitForFirebaseToLoad = () => {
    const auth = getAuth();
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        }, (error) => {
            unsubscribe();
            reject(error);
        });
    })
};

export const authenticatedFetch = async (endpoint, options ={}) => {
    let token = null;
    const isPublicRoute = PUBLIC_ROUTES.some(route => endpoint.includes(route));
    if(!isPublicRoute) {
        try {
            const user = await waitForFirebaseToLoad();

            if (user) {
                token = await user.getIdToken();
            }
        } catch (error) {
            console.error("Error al comprobar la sesión de Firebase", error);
        }
    }

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        throw new Error(`HTTP ERROR: ${response.statusText}`);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}