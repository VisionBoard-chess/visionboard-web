import {authenticatedFetch} from "./apiClient.js";

export async function getRoundsByTournament(tournamentId) {
    return authenticatedFetch(`/tournaments/${tournamentId}/rounds`);
}

export async function getRoundById(tournamentId, roundId) {
    return authenticatedFetch(`/tournaments/${tournamentId}/rounds/${roundId}`);
}

export async function getGamesByRoundId(roundId) {
    return authenticatedFetch(`/games/round/${roundId}`);
}

export async function getNextRoundNumber(tournamentId){
    return authenticatedFetch(`/tournaments/${tournamentId}/rounds/next-round-number`);
}

export async function createRound(tournamentId, payload) {
    return authenticatedFetch(`/tournaments/${tournamentId}/rounds`,{
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

export async function updateRoundStatus(tournamentId, roundId, newStatus) {
    return authenticatedFetch(`/tournaments/${tournamentId}/rounds/${roundId}/status`, {
        method: 'PUT',
        body: JSON.stringify({status: newStatus}),
    });
}