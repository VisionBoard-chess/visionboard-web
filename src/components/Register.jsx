import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {registerWithFirebase, createUserInBackend, verifyEmail} from '../services/userService';
import logoDark from '../assets/visionboard_logo_dark.png';
import './Login.css';

const Register = () => {
    const [nickname, setNickname]               = useState('');
    const [email, setEmail]                     = useState('');
    const [password, setPassword]               = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError]                     = useState('');
    const [loading, setLoading]                 = useState(false);

    const navigate = useNavigate();

    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=]).{6,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (nickname.trim().length <= 0) {
            setError('El usuario no puede estar vacío');
            return;
        }
        if (email.trim().length <= 0) {
            setError('El correo no debe ser vacío');
            return;
        }
        if (!emailRegex.test(email)) {
            setError('El correo no es válido');
            return;
        }
        if (password.trim().length <= 0) {
            setError('La contraseña no debe ser vacía');
            return;
        }
        if (password.trim().length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        if (!passwordRegex.test(password)) {
            setError('La contraseña debe tener al menos 6 caracteres, una mayuscula, un número y un símbolo (!@#$%^&*...)');
            return;
        }
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }


        setLoading(true);
        try {
            const user = await registerWithFirebase(email, password);
            await verifyEmail(user)
            await createUserInBackend({
                firebaseUid: user.uid,
                nickname: nickname.trim(),
                email: user.email,
            });
            navigate('/verify-email');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-box" onSubmit={handleRegister}>
                <img src={logoDark} alt="Logo" className="login-logo" />
                <input
                    type="text"
                    placeholder="Nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirmar contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                {error && <p className="error-message">{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Creando cuenta...' : 'Registrarse'}
                </button>
                <p className="auth-switch">
                    ¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;