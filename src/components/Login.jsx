import {useState} from 'react';
import {signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../firebase/config';
import {useNavigate} from 'react-router-dom';
import {getTournaments, getTournamentsByCreator} from '../services/tournamentService';
import {useTournaments} from '../context/TournamentContext';
import './Login.css';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const {setAllTournaments, setUserTournaments} = useTournaments();


    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;
            const [all, userOwned] = await Promise.all([
                getTournaments(),
                getTournamentsByCreator(uid)
            ]);

            setAllTournaments(all);
            setUserTournaments(userOwned);

            navigate('/home');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div className="login-container">
            <form className="login-box">
                <img src = "/src/assets/livechess_logo_dark.png" alt="Logo" className="login-logo"/>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className="error-message">{error}</p>}
                <button onClick={handleLogin}>Login</button>
                <button onClick={handleRegister}>Registrarse</button>
            </form>
        </div>
    );
};

export default Login;