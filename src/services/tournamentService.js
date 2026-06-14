import {authenticatedFetch} from "./apiClient.js";

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

export async function getTournaments() {
    return authenticatedFetch('/tournaments');
}

export async function getTournamentById(id) {
    return authenticatedFetch(`/tournaments/${id}`);
}

export async function deleteTournament(id) {
    return authenticatedFetch(`/tournaments/${id}`,{
        method: 'DELETE'
    });
}

export async function getTournamentsByCreator(creatorId) {
    return authenticatedFetch(`/tournaments/creator/${creatorId}`);
}