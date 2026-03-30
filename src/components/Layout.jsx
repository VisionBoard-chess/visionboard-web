import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };

    const goToHome = () => {
        navigate('/home');
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <div className="header-logo" onClick={goToHome}>
                    <img src="/src/assets/livechess_logo_dark.png" alt="LiveChess Logo" className="logo-image" />
                    <h1>LiveChess</h1>
                </div>
                <button onClick={handleLogout} className="logout-button">Log-Out</button>
            </header>
            <div className="app-content">
                {children}
            </div>
        </div>
    );
};

export default Layout;
