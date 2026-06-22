import { test, expect, vi, beforeEach, afterEach } from 'vitest';
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateTournament from '../../components/CreateTournament';

const mockNavigate = vi.fn();
const mockRefreshTournaments = vi.fn();
const mockCreateTournament = vi.fn();

vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}))

vi.mock('../../context/UserContext', () => ({
    useUser: () => ({ currentUser: {id: 1}})
}))

vi.mock('../../context/TournamentContext', () => ({
    useTournaments: () => ({ refreshTournaments: mockRefreshTournaments }),
}))

vi.mock('../../services/tournamentService', () => ({
    createTournament: () => mockCreateTournament()
}))

vi.mock('../../services/userService', () => ({
    logoutWithFirebase: vi.fn()
}))

beforeEach(() => {
    vi.clearAllMocks()
    mockCreateTournament.mockResolvedValue({success: true, data: {}})
})

afterEach(() => {
    cleanup();
})

const fillForm = async () =>{
    await userEvent.type(screen.getByLabelText('Name of the Tournament'), 'Torneo')
    await userEvent.type(screen.getByLabelText('Description'), 'Descripcion torneo')
    await userEvent.type(screen.getByLabelText('Start Date'), '2026-01-01T10:00')
}

test('createTournament_navigates_to_home_on_success', async () => {
    render(<CreateTournament/>);
    await fillForm();
    await userEvent.click(screen.getByRole('button', { name: 'Create'}))
    await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/home');
    })
})

test('createTournament_calls_refreshTournaments_on_success', async () => {
    render(<CreateTournament/>);
    await fillForm();
    await userEvent.click(screen.getByRole('button', { name: 'Create'}))
    await waitFor(() => {
        expect(mockRefreshTournaments).toHaveBeenCalledTimes(1);
    })
})

test('createTournament_shows_error_if_success_fails', async () => {
    mockCreateTournament.mockResolvedValue({success: false});
    render(<CreateTournament/>);
    await fillForm();
    await userEvent.click(screen.getByRole('button', { name: 'Create'}))
    await waitFor(() => {
        expect(screen.getByText('Error creating Tournament')).toBeInTheDocument()
    })
})

test('createTournament_show_error_if_service_throws', async () => {
    mockCreateTournament.mockRejectedValue(new Error('Connection error'));
    render(<CreateTournament/>);
    await fillForm();
    await userEvent.click(screen.getByRole('button', { name: 'Create'}))
    await waitFor(() => {
        expect(screen.getByText('Connection error: Connection error')).toBeInTheDocument()
    })
})

test('createTournament_navigates_to_home_on_cancel', async () => {
    render(<CreateTournament/>);
    await userEvent.click(screen.getByRole('button', { name: 'Cancel'}))
    await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
    })
})