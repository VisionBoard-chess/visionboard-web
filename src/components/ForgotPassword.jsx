import { useState } from 'react';
import { Link } from 'react-router-dom';
import { resetPassword } from '../services/userService';
import logoDark from '../assets/visionboard_logo_dark.png';
import './Login.css';

const ForgotPassword = () => {
    const [email, setEmail]     = useState('');
    const [error, setError]     = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await resetPassword(email);
            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-box" onSubmit={handleReset}>
                <img src={logoDark} alt="Logo" className="login-logo" />

                {success ? (
                    <>
                        <p className="success-message">
                            Te hemos enviado un email para restablecer tu contraseña.
                        </p>
                        <p className="auth-switch">
                            <Link to="/">Volver al login</Link>
                        </p>
                    </>
                ) : (
                    <>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {error && <p className="error-message">{error}</p>}
                        <button type="submit" disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar email'}
                        </button>
                        <p className="auth-switch">
                            <Link to="/">Volver al login</Link>
                        </p>
                    </>
                )}
            </form>
        </div>
    );
};

export default ForgotPassword;