import { test, expect, vi, beforeEach, afterEach } from 'vitest';
import {cleanup, render, screen, waitFor, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from '../../components/Register.jsx';

const mockNavigate = vi.fn();
const mockRegisterWithFirebase = vi.fn();
const mockCreateUserInBackend = vi.fn();
const mockVerifyEmail = vi.fn();
const mockCheckNickname = vi.fn();

vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

vi.mock('../../services/userService.js', () => ({
    registerWithFirebase: () => mockRegisterWithFirebase(),
    createUserInBackend: () => mockCreateUserInBackend(),
    verifyEmail: () => mockVerifyEmail(),
    checkNickname: () => mockCheckNickname(),
}));

beforeEach(() => {
    vi.clearAllMocks();
    mockRegisterWithFirebase.mockResolvedValue({ uid: 'uid', email: 'i@i.com' });
    mockCreateUserInBackend.mockResolvedValue({});
    mockVerifyEmail.mockResolvedValue({});
    mockCheckNickname.mockResolvedValue({});
});

afterEach(() => {
    cleanup();
})

const fillForm = async (nickname = 'nick', email = 'i@i.com', password = 'Password1!', confirm = 'Password1!') => {
    await userEvent.type(screen.getByPlaceholderText('Nickname'), nickname);
    await userEvent.type(screen.getByPlaceholderText('Email'), email);
    await userEvent.type(screen.getByPlaceholderText('Contraseña'), password);
    await userEvent.type(screen.getByPlaceholderText('Confirmar contraseña'), confirm);
};

test('register_shows_error_if_nickname_empty', async () => {
    render(<Register />);
    await userEvent.type(screen.getByPlaceholderText('Email'), 'i@i.com');
    await userEvent.type(screen.getByPlaceholderText('Contraseña'), 'Password1!');
    await userEvent.type(screen.getByPlaceholderText('Confirmar contraseña'), 'Password1!');
    await userEvent.click(screen.getByRole('button', { name: 'Registrarse' }));
    fireEvent.submit(screen.getByRole('form', { name: 'register-form' }));

    expect(screen.getByText('El usuario no puede estar vacío')).toBeInTheDocument();
});

test('register_shows_error_if_email_invalid', async () => {
    render(<Register />);
    await userEvent.type(screen.getByPlaceholderText('Nickname'), 'nick');
    await userEvent.type(screen.getByPlaceholderText('Email'), 'notanemail');
    await userEvent.type(screen.getByPlaceholderText('Contraseña'), 'Password1!');
    await userEvent.type(screen.getByPlaceholderText('Confirmar contraseña'), 'Password1!');
    await userEvent.click(screen.getByRole('button', { name: 'Registrarse' }));
    fireEvent.submit(screen.getByRole('form', { name: 'register-form' }));

    expect(screen.getByText('El correo no es válido')).toBeInTheDocument();
});

test('register_shows_error_if_password_too_short', async () => {
    render(<Register />);
    await userEvent.type(screen.getByPlaceholderText('Nickname'), 'nick');
    await userEvent.type(screen.getByPlaceholderText('Email'), 'i@i.com');
    await userEvent.type(screen.getByPlaceholderText('Contraseña'), 'abc');
    await userEvent.type(screen.getByPlaceholderText('Confirmar contraseña'), 'abc');
    await userEvent.click(screen.getByRole('button', { name: 'Registrarse' }));

    expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument();
});

test('register_shows_error_if_passwords_dont_match', async () => {
    render(<Register />);
    await fillForm('nick', 'i@i.com', 'Password1!', 'Password2!');
    await userEvent.click(screen.getByRole('button', { name: 'Registrarse' }));

    expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
});

test('register_shows_error_if_password_invalid_format', async () => {
    render(<Register />);
    await fillForm('nick', 'i@i.com', 'password', 'password');
    await userEvent.click(screen.getByRole('button', { name: 'Registrarse' }));

    expect(screen.getByText('La contraseña debe tener al menos 6 caracteres, una mayuscula, un número y un símbolo (!@#$%^&*...)')).toBeInTheDocument();
});

test('register_navigates_to_verify_email_on_success', async () => {
    render(<Register />);
    await fillForm();
    await userEvent.click(screen.getByRole('button', { name: 'Registrarse' }));

    await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/verify-email');
    });
});

test('register_shows_error_if_firebase_fails', async () => {
    mockRegisterWithFirebase.mockRejectedValue(new Error('Email already in use'));
    render(<Register />);
    await fillForm();
    await userEvent.click(screen.getByRole('button', { name: 'Registrarse' }));

    await waitFor(() => {
        expect(screen.getByText('Email already in use')).toBeInTheDocument();
    });
});