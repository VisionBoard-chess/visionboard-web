import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyEmail } from '../services/userService';
import { auth } from '../firebase/config';
import logoDark from '../assets/visionboard_logo_dark.png';
import './Login.css';

const VerifyEmail = () => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleResend = async () => {
        setLoading(true);
        try {
            await verifyEmail(auth.currentUser);
            setMessage('Email reenviado correctamente.');
        } catch (err) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <img src={logoDark} alt="Logo" className="login-logo" />
                <p style={{ color: '#fff', marginBottom: '15px' }}>
                    Te hemos enviado un email de verificación. Revisa tu bandeja de entrada y confirma tu cuenta.
                </p>
                {message && <p className="success-message">{message}</p>}
                <button onClick={handleResend} disabled={loading}>
                    {loading ? 'Enviando...' : 'Reenviar email'}
                </button>
                <p className="auth-switch">
                    Ya verifiqué mi cuenta —{' '}
                    <span style={{ cursor: 'pointer', color: '#fff', fontWeight: 600 }} onClick={() => navigate('/')}>
                        Ir al login
                    </span>
                </p>
            </div>
        </div>
    );
};

export default VerifyEmail;