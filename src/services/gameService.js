import {authenticatedFetch, BASE_URL} from "./apiClient.js";

/**
 * Obtiene la partida con id gameId
 *
 * Parameters
 * ----------
 * gameId:
 *   id de la partida de torneo que se quiere visualizar
 *
 * Returns
 * -------
 * Promise<any>
 *     Obtiene un objeto con la información de la partida (GameResponse)
 *
 * Raises
 * ------
 * Error BadRequest si la petición no contiene gameId
 * Error NotFound si la partida con ese id no existe
 *
 */
export const getGameId = async(gameId) => {
    return authenticatedFetch(`/games/${gameId}`);
}


/**
 * Añade un movimiento a la partida con id gameId
 *
 * Parameters
 * ----------
 * gameId:
 *      id de la partida de torneo a la que se quiere añadir el movimiento
 * moveSan:
 *      movimiento en notación SAN que se quiere añadir a la partida
 *
 *  Returns
 *  -------
 *  Promise<any>
 *      Obtiene información de resultado de la operación Success true si se ha añadido correctamente.
 *
 *  Raises
 *  ------
 *  Error BadRequest si la petición no contiene gameId
 *  Error BadRequest si la petición no contiene moveSan
 *  Error BadRequest si el movimiento no es válido para la posición actual de la partida
 */
export const addMove = async(gameId, moveSan) => {
    return authenticatedFetch(`/games/${gameId}/move/add`, {
        method: 'PUT',
        body: JSON.stringify(moveSan),
    });
}

/**
 * Edita un movimiento en la partida con id gameId
 *
 * Parameters
 * ----------
 * gameId:
 *      id de la partida de torneo a la que se quiere añadir el movimiento
 * moveIndex:
 *      índice del movimiento que se quiere editar
 * moveSan:
 *      movimiento en notación SAN que se quiere añadir a la partida
 *
 *  Returns
 *  -------
 *  Promise<any>
 *      Obtiene información de resultado de la operación Success true si se ha editado correctamente.
 *
 *  Raises
 *  ------
 *  Error BadRequest si la petición no contiene gameI
 *  Error BadRequest si la petición no contiene moveIndex o es invalido
 *  Error BadRequest si la petición no contiene moveSan
 *  Error BadRequest si el movimiento no es válido para la posición actual de la partida
 */
export const editMove = async(gameId, moveIndex, moveSan) => {
    return authenticatedFetch(`/games/${gameId}/move/edit`, {
        method: 'PUT',
        body: JSON.stringify({
            moveIndex,
            moveSan
        })
    })
}
export const getGameSSEUrl = (gameId) => `${BASE_URL}/games/${gameId}/sse`;
