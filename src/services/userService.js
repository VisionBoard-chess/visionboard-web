import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const resetPassword = async(email) => {
    await sendPasswordResetEmail(auth, email);
}

export const verifyEmail = async(email) => {
    await sendEmailVerification(email);
}

export const loginWithFirebase = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

export const registerWithFirebase = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

export const logoutFromFirebase = async () => {
    await signOut(auth);
};


export const createUserInBackend = async ({ firebaseUid, nickname }) => {
    const response = await fetch(`${API_BASE_URL}/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 'Authorization': `Bearer ${token}`
        body: JSON.stringify({ firebaseUid, nickname }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al crear el usuario en el backend');
    }

    return response.json();
};

export const getUserByFirebaseUid = async (firebaseUid) => {
    const response = await fetch(`${API_BASE_URL}/user/${firebaseUid}`);
    if (!response.ok) throw new Error('Error al obtener el usuario');
    return response.json();
};