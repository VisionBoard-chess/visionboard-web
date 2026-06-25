import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import {authenticatedFetch} from "./apiClient.js";


/**
 * Envía un correo electrónico para restablecer la contraseña del usuario.
 *
 * Parameters
 * ----------
 * email:
 *      Correo electrónico del usuario que desea restablecer su contraseña.
 *
 * Returns
 * -------
 * Promise<void>
 *      Retorna una promesa que se resuelve cuando se envía el correo electrónico de restablecimiento de contraseña.
 */
export const resetPassword = async(email) => {
    await sendPasswordResetEmail(auth, email);
}

/**
 * Envía un correo electrónico de verificación al usuario.
 *
 * Parameters
 * ----------
 * user:
 *      Objeto de usuario de Firebase que desea verificar su correo electrónico.
 *
 * Returns
 * -------
 * Promise<void>
 *      Retorna una promesa que se resuelve cuando se envía el correo electrónico de verificación.
 */
export const verifyEmail = async(user) => {
    await sendEmailVerification(user);
}

/**
 * Inicia sesión en Firebase con correo electrónico y contraseña.
 *
 * Parameters
 * ----------
 * email:
 *      Correo electrónico del usuario que desea iniciar sesión.
 * password:
 *      Contraseña del usuario que desea iniciar sesión.
 *
 * Returns
 * -------
 * Promise<User>
 *      Retorna una promesa que se resuelve con el objeto de usuario de Firebase si el inicio de sesión es exitoso.
 *      Lanza un error si el inicio de sesión falla.
 */
export const loginWithFirebase = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

/**
 * Registra un nuevo usuario en Firebase con correo electrónico y contraseña.
 *
 * Parameters
 * ----------
 * email:
 *      Correo electrónico del usuario que desea registrar.
 * password:
 *      Contraseña del usuario que desea registrar.
 *
 * Returns
 * -------
 * Promise<User>
 *      Retorna una promesa que se resuelve con el objeto de usuario de Firebase si el registro es exitoso.
 *      Lanza un error si el registro falla.
 */
export const registerWithFirebase = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

/**
 * Cierra la sesión del usuario en Firebase.
 * Returns
 * -------
 * Promise<void>
 *      Retorna una promesa que se resuelve cuando la sesión del usuario se cierra correctamente.
 */
export const logoutFromFirebase = async () => {
    await signOut(auth);
};

/**
 * Crea un nuevo usuario en el backend con el UID de Firebase y un apodo.
 *
 * Parameters
 * ----------
 * firebaseUid:
 *      UID del usuario de Firebase que se desea registrar en el backend.
 * nickname:
 *      Apodo del usuario que se desea registrar en el backend.
 *
 * Returns
 * -------
 * Promise<any>
 *      Retorna una promesa que se resuelve con la respuesta del backend si la creación del usuario es exitosa (UserResponse).
 *      Lanza un error si la creación del usuario falla.
 */
export const createUserInBackend = async ({ firebaseUid, nickname }) => {
    return authenticatedFetch('/user/register', {
        method: 'POST',
        body: JSON.stringify({ firebaseUid, nickname }),
    });
};

/**
 * Obtiene la información de un usuario en el backend dado su UID de Firebase.
 *
 * Parameters
 * ----------
 * firebaseUid:
 *      UID del usuario de Firebase que se desea obtener del backend.
 *
 * Returns
 * -------
 * Promise<any>
 *      Retorna una promesa que se resuelve con la información del usuario (UserResponse) si la obtención es exitosa.
 *      Lanza un error si la obtención del usuario falla.
 */
export const getUserByFirebaseUid = async (firebaseUid) => {
    return authenticatedFetch(`/user/${firebaseUid}`);
};

/**
 * Verifica si un apodo está disponible en el backend.
 *
 * Parameters
 * ----------
 * nickname:
 *      Apodo que se desea verificar en el backend.
 *
 * Returns
 * -------
 * Promise<any>
 *      Retorna una promesa que se resuelve con la respuesta del backend indicando si el apodo está disponible o no.
 *      Lanza un error si la verificación del apodo falla.
 */
export const checkNickname = async(nickname) => {
    return authenticatedFetch(`/user/check-nickname?nickname=${nickname}`);
}