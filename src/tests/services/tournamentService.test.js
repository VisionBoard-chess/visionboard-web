import { test, expect, vi, beforeEach } from 'vitest';
import { createTournament, getTournaments, getTournamentById, deleteTournament, getTournamentsByCreator} from "../../services/tournamentService.js";
import * as apiClient from '../../services/apiClient.js';

beforeEach(() => {
    vi.spyOn(apiClient, 'authenticatedFetch').mockResolvedValue({id:123});
});

test('getTournaments_calls_correctly', async () => {
    await getTournaments()
    expect(apiClient.authenticatedFetch).toHaveBeenCalledWith('/tournaments');
})

test('getTournamentById_calls_correctly', async () => {
    await getTournamentById("t1")
    expect(apiClient.authenticatedFetch).toHaveBeenCalledWith('/tournaments/t1')
})

test('deleteTournament_calls_correctly', async () => {
    await deleteTournament("t1")
    expect(apiClient.authenticatedFetch).toHaveBeenCalledWith('/tournaments/t1', { method: 'DELETE' })
})

test('getTournamentsByCreator_calls_correctly', async () => {
    await getTournamentsByCreator(1)
    expect(apiClient.authenticatedFetch).toHaveBeenCalledWith('/tournaments/creator/1')
})

test('createTournament_calls_correctly', async () => {
    await createTournament("t1", "descrip", "closed", "2026-01-01", 1)
    expect(apiClient.authenticatedFetch).toHaveBeenCalledWith('/tournaments',{
        method: 'POST',
        body: JSON.stringify({
            name: "t1",
            description: "descrip",
            typeOf: "closed",
            startDate: "2026-01-01:00",
            creatorId: 1
        })
    })
})