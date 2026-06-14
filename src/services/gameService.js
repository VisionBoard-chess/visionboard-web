import {authenticatedFetch, BASE_URL} from "./apiClient.js";

export const getGameId = async(gameId) => {
    return authenticatedFetch(`/games/${gameId}`);
}

export const addMove = async(gameId, moveSan) => {
    return authenticatedFetch(`/games/${gameId}/move/add`, {
        method: 'PUT',
        body: JSON.stringify(moveSan),
    });
}

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
