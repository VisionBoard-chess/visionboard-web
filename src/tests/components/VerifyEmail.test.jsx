import { test, expect, vi, beforeEach, afterEach } from 'vitest';
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VerifyEmail from '../../components/VerifyEmail.jsx';

const mockNavigate = vi.fn();
const mockVerifyEmail = vi.fn();

vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}))

vi.mock('../../services/userService', () => ({
    verifyEmail: () => mockVerifyEmail(),
}))

vi.mock('../../firebase/auth', () => ({
    auth: {currentUser: {uid: 'uid'}}
}))

beforeEach(() => {
    vi.clearAllMocks();
})

afterEach(() => {
    cleanup()
})

test('verifyEmail_shows_success_message_on_resend', async () => {
    mockVerifyEmail.mockResolvedValue({});
    render(<VerifyEmail />);
    await userEvent.click(screen.getByRole('button', { name: 'Reenviar email' }));
    await waitFor(() => {
        expect(screen.getByText('Email reenviado correctamente.')).toBeInTheDocument();
    });
});

test('verifyEmail_shows_error_message_if_resend_fails', async () => {
    mockVerifyEmail.mockRejectedValue(new Error('Too many requests'));
    render(<VerifyEmail />);
    await userEvent.click(screen.getByRole('button', { name: 'Reenviar email' }));
    await waitFor(() => {
        expect(screen.getByText('Too many requests')).toBeInTheDocument();
    });
});

test('verifyEmail_navigates_to_login_on_click', async () => {
    render(<VerifyEmail />);
    await userEvent.click(screen.getByText('Ir al login'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
});