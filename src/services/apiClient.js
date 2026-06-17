import {getAuth, onAuthStateChanged} from 'firebase/auth';

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const PUBLIC_ROUTES = ['/user/register', '/user/check-nickname'];

/**
 * Espera a que Firebase Auth cargue el estado del usuario
 *
 * Esta función devuelve una promesa que se resuelve con el usuario autenticado
 * o null si no hay un usuario autenticado. Se utiliza para asegurarse de que
 * Firebase Auth haya terminado de cargar antes de intentar obtener el token.
 *
 * Returns
 * -------
 * Promise<User|null>
 *     Retorna el usuario autenticado o null si no hay un usuario autenticado.
 *
 */
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

/**
 * Realiza una petición HTTPS autenticada o pública dependiendo de la ruta
 *
 * Esta función interpreta la petición, verifica el tipo de ruta pública o privada.
 * Si es privada, intenta obtener el token de sesión de Firebase para incluirlo en la petición.
 * Gestiona automaticamente la conversación de JSON y el manejo de errores básicos de respuesta.
 *
 * Parameters
 * ----------
 * endpoint : string
 *   La ruta del endpoint a la que se desea hacer la petición.
 * options : object
 *   Opciones adicionales para la petición fetch como:
 *      - Method: string (GET, POST, PUT, DELETE)
 *      - body: any (Cuerpo de la petición)
 *      - headers: object (Encabezados adicionales)
 *
 * Returns
 * -------
 * Promise<any>
 *     Retorna el cuerpo de la respuesta como JSON o como texto plano.
 *     Retorna null si la respuesta está vacía
 *
 * Raises
 * ------
 * Error
 * Si la respuesta del servidor no es satisfactoria (`response.ok` es false),
 * se lanza un error indicando el estado de la respuesta.
 */
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

    const text = await response.text();

    if (!text) return null;

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}