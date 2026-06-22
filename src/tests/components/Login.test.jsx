import {test, expect, vi, beforeEach, afterEach} from "vitest";
import {render, screen, waitFor, cleanup} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../../components/Login.jsx'

const mockNavigate = vi.fn()
const mockSetCurrentUser = vi.fn()
const mockSetAllTournaments = vi.fn()
const mockSetUserTournaments = vi.fn()
const mockLoginWithFirebase = vi.fn()
const mockGetUserByFirebaseUid = vi.fn();
const mockGetTournaments = vi.fn();
const mockGetTournamentsByCreator = vi.fn();

vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    Link: ({children, to}) => <a href={to}>{children}</a>,
}))

vi.mock('../../context/UserContext', () => ({
    useUser: () => ({ setCurrentUser: mockSetCurrentUser }),
}));

vi.mock('../../context/TournamentContext', () => ({
    useTournaments: () => ({
        setAllTournaments: mockSetAllTournaments,
        setUserTournaments: mockSetUserTournaments,
    }),
}));

vi.mock('../../services/userService', () => ({
    loginWithFirebase:() => mockLoginWithFirebase(),
    getUserByFirebaseUid: () => mockGetUserByFirebaseUid(),
}));

vi.mock('../../services/tournamentService', () => ({
    getTournaments: () => mockGetTournaments(),
    getTournamentsByCreator: () => mockGetTournamentsByCreator(),
}));

beforeEach(() => {
    vi.clearAllMocks();
    mockGetTournaments.mockResolvedValue([]);
    mockGetTournamentsByCreator.mockResolvedValue([]);
    mockGetUserByFirebaseUid.mockResolvedValue({ id: 1, nickname: 'nick' });
});

afterEach(() => {
    cleanup();
});

test('login_with_error_if_email_not_verified', async () => {
    mockLoginWithFirebase.mockResolvedValue({emailVerified: false, uid:'uid'});
    render(<Login />);
    await userEvent.type(screen.getByPlaceholderText('Email'), 'i@i.com');
    await userEvent.type(screen.getByPlaceholderText('Contraseña'), 'cont');
    await userEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
        expect(screen.getByText('Por favor, verifica tu correo antes de iniciar sesión.')).toBeInTheDocument();
    })
})

test('login_navigates_on_success', async () => {
    mockLoginWithFirebase.mockResolvedValue({emailVerified: true, uid:'uid'});
    render(<Login />);
    await userEvent.type(screen.getByPlaceholderText('Email'), 'i@i.com');
    await userEvent.type(screen.getByPlaceholderText('Contraseña'), 'cont');
    await userEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/home');
    })
})

test('login_with_error_if_firebase_fails', async () => {
    mockLoginWithFirebase.mockRejectedValue(new Error('Wrong email or password'));
    render(<Login />);
    await userEvent.type(screen.getByPlaceholderText('Email'), 'i@i.com');
    await userEvent.type(screen.getByPlaceholderText('Contraseña'), 'cont');
    await userEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
        expect(screen.getByText('Wrong email or password')).toBeInTheDocument();
    })
})

test('login_sets_current_user_on_success', async () => {
    mockLoginWithFirebase.mockResolvedValue({emailVerified: true, uid:'uid'});
    render(<Login />);
    await userEvent.type(screen.getByPlaceholderText('Email'), 'i@i.com');
    await userEvent.type(screen.getByPlaceholderText('Contraseña'), 'cont');
    await userEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
        expect(mockSetCurrentUser).toHaveBeenCalledWith({id: 1, nickname: 'nick'});
    })
})
