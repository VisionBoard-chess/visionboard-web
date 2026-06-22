import { test, expect, vi, beforeEach } from 'vitest';
import { getRoundById, getGamesByRoundId, getNextRoundNumber, getRoundsByTournament, updateRoundStatus, createRound } from '../../services/roundService.js'
import * as apiClient from '../../services/apiClient.js';

beforeEach(() => {
    vi.spyOn(apiClient, 'authenticatedFetch').mockResolvedValue({id:123});
});

test('getRoundsByTournament_calls_correctly', async () => {
    await getRoundsByTournament("t1");
    expect(apiClient.authenticatedFetch).toHaveBeenCalledWith('/tournaments/t1/rounds')
})

test('getRoundById_calls_correctly', async () => {
    await getRoundById("t1", "r1");
    expect(apiClient.authenticatedFetch).toHaveBeenCalledWith('/tournaments/t1/rounds/r1')
})

test('getGamesByRoundId_calls_correctly', async () => {
    await getGamesByRoundId("r1");
    expect(apiClient.authenticatedFetch).toHaveBeenCalledWith('/games/round/r1')
})

test('getNextRoundNumber_calls_correctly', async () => {
    await getNextRoundNumber("t1");
    expect(apiClient.authenticatedFetch).toHaveBeenCalledWith('/tournaments/t1/rounds/next-round-number')
})

test('createRound_calls_correctly', async () => {
    await createRound("t1", {name: "Round 1"});
    expect(apiClient.authenticatedFetch).toHaveBeenCalledWith('/tournaments/t1/rounds',{
        method: 'POST',
        body: JSON.stringify({name: "Round 1"})
    })
})

test('updateRoundStatus_calls_correctly', async () => {
    await updateRoundStatus("t1", "r1", "ACTIVE");
    expect(apiClient.authenticatedFetch).toHaveBeenCalledWith('/tournaments/t1/rounds/r1/status',{
        method: 'PUT',
        body: JSON.stringify({status: "ACTIVE"})
    })
})