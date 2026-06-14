import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import {authenticatedFetch} from "./apiClient.js";


export const resetPassword = async(email) => {
    await sendPasswordResetEmail(auth, email);
}

export const verifyEmail = async(user) => {
    await sendEmailVerification(user);
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
    return authenticatedFetch('/user/register', {
        method: 'POST',
        body: JSON.stringify({ firebaseUid, nickname }),
    });
};

export const getUserByFirebaseUid = async (firebaseUid) => {
    return authenticatedFetch(`/user/${firebaseUid}`);
};

export const checkNickname = async(nickname) => {
    return authenticatedFetch(`/user/check-nickname?nickname=${nickname}`);
}