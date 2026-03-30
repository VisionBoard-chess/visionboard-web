const BASE_URL = 'http://localhost:8080';

export const createTournament = async (name, description, type, startDate, creatorId) => {
    try {
        const response = await fetch('http://localhost:8080/tournaments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                description,
                typeOf: type,
                startDate: startDate + ':00',
                creatorId
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        throw new Error(error.message);
    }
};


export async function getTournaments() {
    const response = await fetch(`${BASE_URL}/tournaments`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.json();
}

export async function getTournamentById(id) {
    const response = await fetch(`${BASE_URL}/tournaments/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.json();
}

export async function deleteTournament(id) {
    const response = await fetch(`${BASE_URL}/tournaments/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response.status === 204 ? null : await response.json();
}

export async function getTournamentsByCreator(creatorId) {
    const response = await fetch(`${BASE_URL}/tournaments/creator/${creatorId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.json();
}