import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {getUserByFirebaseUid, loginWithFirebase} from '../services/userService';
import { getTournaments, getTournamentsByCreator } from '../services/tournamentService';
import { useTournaments } from '../context/TournamentContext';
import { useUser } from '../context/UserContext';
import logoDark from '../assets/visionboard_logo_dark.png';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { setAllTournaments, setUserTournaments } = useTournaments();

    const { setCurrentUser } = useUser();
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await loginWithFirebase(email, password);
            if (!user.emailVerified) {
                setError('Por favor, verifica tu correo antes de iniciar sesión.');
                setLoading(false);
                return;
            }
            const backendUser = await getUserByFirebaseUid(user.uid);
            setCurrentUser({
                id: backendUser.id,
                nickname: backendUser.nickname
            });
            localStorage.setItem('currentUser', JSON.stringify({
                id: backendUser.id,
                nickname: backendUser.nickname
            }));
            const [all, userOwned] = await Promise.all([
                getTournaments(),
                getTournamentsByCreator(backendUser.id),
            ]);
            setAllTournaments(all);
            setUserTournaments(userOwned);
            navigate('/home');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-box" onSubmit={handleLogin}>
                <img src={logoDark} alt="Logo" className="login-logo" />
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
                {error && <p className="error-message">{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Entrando...' : 'Login'}
                </button>
                <p className="auth-switch">
                    ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
                </p>
                <p className="auth-switch">
                    <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;