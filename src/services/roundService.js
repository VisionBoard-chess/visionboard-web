import {authenticatedFetch} from "./apiClient.js";

/**
 * Obtiene las rondas de un torneo dado su id
 *
 * Parameters
 * ----------
 * tournamentId:
 *      id del torneo del que se quieren obtener las rondas
 *
 * Returns
 * -------
 * Promise<any>
 *      Obtiene un array con las rondas del torneo (List<RoundResponse>)
 *
 * Raises
 * ------
 * Error BadRequest si la petición no contiene tournamentId
 */
export async function getRoundsByTournament(tournamentId) {
    return authenticatedFetch(`/tournaments/${tournamentId}/rounds`);
}

/**
 * Obtiene la ronda de un torneo dado su id y el id de la ronda
 *
 * Parameters
 * ----------
 * tournamentId:
 *      id del torneo del que se quiere obtener la ronda
 * roundId:
 *      id de la ronda que se quiere obtener
 *
 * Returns
 * -------
 * Promise<any>
 *      Obtiene un objeto con la información de la ronda (RoundResponse)
 *
 * Raises
 * ------
 * Error BadRequest si la petición no contiene roundId
 * Error NotFound si la ronda con ese id no existe
 */
export async function getRoundById(tournamentId, roundId) {
    return authenticatedFetch(`/tournaments/${tournamentId}/rounds/${roundId}`);
}

/**
 * Obtiene las partidas de una ronda dado su id
 *
 * Parameters
 * ----------
 * roundId:
 *      id de la ronda de la que se quieren obtener las partidas
 *
 * Returns
 * -------
 * Promise<any>
 *      Obtiene un array con las partidas de la ronda (List<GameResponse>)
 *
 * Raises
 * ------
 * Error BadRequest si la petición no contiene roundId
 */
export async function getGamesByRoundId(roundId) {
    return authenticatedFetch(`/games/round/${roundId}`);
}

/**
 * Obtiene el número de la siguiente ronda de un torneo dado su id
 *
 * Parameters
 * ----------
 * tournamentId:
 *      id del torneo del que se quiere obtener el número de la siguiente ronda
 *
 * Returns
 * -------
 * Promise<any>
 *      Obtiene un objeto con el número de la siguiente ronda (nextRoundNumber)
 *
 * Raises
 * ------
 * Error BadRequest si la petición no contiene tournamentId
 */
export async function getNextRoundNumber(tournamentId){
    return authenticatedFetch(`/tournaments/${tournamentId}/rounds/next-round-number`);
}

/**
 * Crea una nueva ronda en un torneo dado su id
 *
 * Parameters
 * ----------
 * tournamentId:
 *      id del torneo en el que se quiere crear la ronda
 * payload:
 *      objeto con la información de la ronda a crear (RoundRequest)
 *
 * Returns
 * -------
 * Promise<any>
 *      Obtiene un objeto con la información de la ronda creada (RoundResponse)
 *
 * Raises
 * ------
 * Error BadRequest si la petición no contiene tournamentId
 * Error NotFound si el torneo con ese id no existe
 * Error Conflict si ya existe una ronda con el mismo número en el torneo
 */
export async function createRound(tournamentId, payload) {
    return authenticatedFetch(`/tournaments/${tournamentId}/rounds`,{
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

/**
 * Actualiza el estado de una ronda en un torneo dado su id
 *
 * Parameters
 * ----------
 * tournamentId:
 *    id del torneo en el que se quiere actualizar la ronda
 * roundId:
 *    id de la ronda que se quiere actualizar
 * newStatus:
 *    nuevo estado de la ronda (RoundStatus)
 *
 * Returns
 * -------
 * Promise<any>
 *    Obtiene un objeto con la confirmación de la actualización del status
 *
 * Raises
 * ------
 * Error BadRequest si la petición no contiene tournamentId o roundId
 * Error Conflict si el torneo ya tiene una partida ACTIVE
 * Error BadRequest si hay un error en la actualización del estado de la ronda
 */
export async function updateRoundStatus(tournamentId, roundId, newStatus) {
    return authenticatedFetch(`/tournaments/${tournamentId}/rounds/${roundId}/status`, {
        method: 'PUT',
        body: JSON.stringify({status: newStatus}),
    });
}