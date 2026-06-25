import { test, expect, vi, beforeEach } from 'vitest';
import { getGameId, addMove, editMove } from '../../services/gameService.js'
import * as apiClient from '../../services/apiClient.js';

beforeEach(() => {
    vi.spyOn(apiClient, 'authenticatedFetch').mockResolvedValue({id:123});
});

test('getGameId_calls_correctly', async () => {
    await getGameId('g1');
    expect(apiClient.authenticatedFetch).toHaveBeenCalledWith('/games/g1');
})

test('addMove_calls_PUT_with_move_in_body', async () => {
    await addMove('g1', 'e4');
    expect(apiClient.authenticatedFetch).toHaveBeenCalledWith('/games/g1/move/add',{
        method: 'PUT',
        body: JSON.stringify('e4')
    });
})

test('editMove_calls_PUT_with_index_and_move_in_body', async () => {
    await editMove('g1', 1,'e4');
    expect(apiClient.authenticatedFetch).toHaveBeenCalledWith('/games/g1/move/edit',{
        method: 'PUT',
        body: JSON.stringify({moveIndex: 1, moveSan: 'e4'})
    })
})