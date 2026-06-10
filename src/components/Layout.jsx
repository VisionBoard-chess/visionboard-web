import { useNavigate } from 'react-router-dom';
import './Layout.css';
import logoDark from '../assets/visionboard_logo_dark.png'
import {useUser} from "../context/UserContext.jsx";
import {logoutFromFirebase} from "../services/userService.js";

const Layout = ({ children }) => {
    const navigate = useNavigate();

    const { clearUser } = useUser();

    const handleLogout = async () => {
        await logoutFromFirebase();
        clearUser();
        navigate('/');
    };

    const goToHome = () => {
        navigate('/home');
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <div className="header-logo" onClick={goToHome}>
                    <img src={logoDark} alt="VisionBoard Logo" className="logo-image" />
                    <h1>VisionBoard</h1>
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
