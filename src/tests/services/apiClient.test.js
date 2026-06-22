import { test, expect, vi, beforeEach} from 'vitest';
import { authenticatedFetch} from "../../services/apiClient.js";

vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(),
    onAuthStateChanged: vi.fn((auth, callback) => {
        const unsubscribe = vi.fn()
        Promise.resolve().then(() => callback({ getIdToken: async () => 'mock-token' }));
        return unsubscribe;
    }),
}));

beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
});

test('authenticatedFetch_adds_auth_header_on_private_routes', async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({data: 'ok'})
    });
    await authenticatedFetch('/games/123');
    const headers = fetch.mock.calls[0][1].headers;
    expect(headers['Authorization']).toBe('Bearer mock-token');
})

test('authenticatedFetch_adds_auth_header_on_private_routes', async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({})
    });
    await authenticatedFetch('/user/register');
    const headers = fetch.mock.calls[0][1].headers;
    expect(headers['Authorization']).toBeUndefined();
})

test('authenticatedFetch_throws_error_if_response_not_ok', async () => {
    fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
    });
    await expect(authenticatedFetch('/games/123')).rejects.toThrow('HTTP ERROR: Unauthorized');
});

test('authenticatedFetch_returns_null_on_204', async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
    });
    const result = await authenticatedFetch('/games/123');
    expect(result).toBeNull();
});