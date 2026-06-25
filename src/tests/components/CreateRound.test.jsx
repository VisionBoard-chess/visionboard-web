import {test, expect, vi, beforeEach, afterEach} from "vitest";
import {render, screen, waitFor, cleanup} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateRound from '../../components/CreateRound.jsx';
import * as roundService from '../../services/roundService.js';

vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useSearchParams: () => [new URLSearchParams('tournamentId=t1')],
}))

vi.mock('../../context/UserContext', () => ({
    useUser: () => ({ clearUser: vi.fn() })
}))

vi.mock('../../services/userService', () => ({
    logoutFromFirebase: vi.fn()
}))

vi.mock('../../services/roundService', () => ({
    getNextRoundNumber: vi.fn(),
    createRound: vi.fn()
}))

vi.mock('exceljs',() => ({ default: { Workbook: vi.fn() } }))

const mockNavigate = vi.fn();

beforeEach(() => {
    vi.clearAllMocks()
    roundService.getNextRoundNumber.mockResolvedValue({nextRoundNumber: 2})
})

afterEach(() => {
    cleanup();
});

test('createRound_loads_nextRoundNumber', async () => {
    render(<CreateRound />)
    await waitFor(() => {
        expect(screen.getByDisplayValue('2')).toBeInTheDocument()
    })
})

test('createRound_shows_error_if_createRound_fails', async () => {
    roundService.createRound.mockRejectedValue(new Error('fail'))
    render(<CreateRound />)

    await waitFor(() => screen.getByDisplayValue('2'))

    await userEvent.type(screen.getByLabelText('Name'), 'Ronda 1')
    await userEvent.click(screen.getByRole('button', { name: 'Create Round' }));

    await waitFor(() => {
        expect(screen.getByText('Connection error')).toBeInTheDocument()
    })
})

test('createRound_navigates_to_tournament_on_success', async () => {
    roundService.createRound.mockResolvedValue({})
    render(<CreateRound />)

    await waitFor(() => screen.getByDisplayValue('2'))

    await userEvent.type(screen.getByLabelText('Name'), 'Ronda 1')
    await userEvent.click(screen.getByRole('button', { name: 'Create Round' }));

    await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/tournament/t1')
    })
})