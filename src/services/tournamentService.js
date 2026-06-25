import {authenticatedFetch} from "./apiClient.js";

/**
 * Crea un torneo con los parámetros dados
 *
 * Parameters
 * ----------
 * name:
 *      nombre del torneo
 * description:
 *      descripción del torneo
 * type:
 *      tipo de torneo ("open" o "closed")
 * startDate:
 *      fecha de inicio del torneo en formato "YYYY-MM-DDTHH:mm"
 * creatorId:
 *      id del usuario que crea el torneo
 *
 * Returns
 * -------
 * Promise<any>
 *      Obtiene un objeto con la información del torneo creado (TournamentResponse)
 *
 */
export const createTournament = async (name, description, type, startDate, creatorId) => {
    const data = await authenticatedFetch(`/tournaments`, {
        method: 'POST',
        body: JSON.stringify({
            name,
            description,
            typeOf: type,
            startDate: startDate + ':00',
            creatorId
        })
    });
    return {success: true, data};
}

/**
 * Obtiene todos los torneos
 *
 * Parameters
 * ----------
 * None
 *
 * Returns
 * -------
 * Promise<any>
 *      Obtiene un array con la información de todos los torneos (List<TournamentPublicResponse>)
 */
export async function getTournaments() {
    return authenticatedFetch('/tournaments');
}

/**
 * Obtiene un torneo por su id
 *
 * Parameters
 * ----------
 * id:
 *    id del torneo que se quiere obtener
 *
 * Returns
 * -------
 * Promise<any>
 *      Obtiene un objeto con la información del torneo (TournamentPublicResponse)
 *
 * Raises
 * ------
 * Error BadRequest si la petición no contiene id
 * Error NotFound si el torneo con ese id no existe
 */
export async function getTournamentById(id) {
    return authenticatedFetch(`/tournaments/${id}`);
}

/**
 * Elimina un torneo por su id
 *
 * Parameters
 * ----------
 * id:
 *    id del torneo que se quiere eliminar
 *
 * Returns
 * -------
 * Promise<any>
 *      Obtiene una respuesta (NoContent)
 *
 * Raises
 * ------
 * Error BadRequest si la petición no contiene id
 * Error NotFound si el torneo con ese id no existe
 */
export async function deleteTournament(id) {
    return authenticatedFetch(`/tournaments/${id}`,{
        method: 'DELETE'
    });
}

/**
 * Obtiene los torneos creados por un usuario dado su id
 *
 * Parameters
 * ----------
 * creatorId:
 *      id del usuario creador de los torneos
 *
 * Returns
 * -------
 * Promise<any>
 *      Obtiene un array con la información de los torneos creados por el usuario (List<TournamentResponse>)
 *
 * Raises
 * ------
 * Error BadRequest si la petición no contiene creatorId
 * Error NotFound si el usuario con ese id no existe (falta esto en la api)
 */
export async function getTournamentsByCreator(creatorId) {
    return authenticatedFetch(`/tournaments/creator/${creatorId}`);
}