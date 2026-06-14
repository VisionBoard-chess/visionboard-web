import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from './firebase/config';
import Login from './components/Login';
import Home from './components/Home';
import CreateTournament from './components/CreateTournament';
import CreateRound from './components/CreateRound';
import TournamentDetail from './components/TournamentDetail';
import RoundDetail from './components/RoundDetail';
import GameDetail from './components/GameDetail';
import Register from "./components/Register";
import ForgotPassword from './components/ForgotPassword';
import VerifyEmail from './components/VerifyEmail';
import Tournaments from './components/Tournaments';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser?.emailVerified) {
                setUser(firebaseUser);
                setLoading(false);
            } else {
                setUser(null);
                setLoading(false);
            }
        });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <BrowserRouter basename="/visualboard">
            <Routes>
                <Route path="/" element={user ? <Navigate to="/home" /> : <Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
                <Route path="/create-tournament" element={user ? <CreateTournament /> : <Navigate to="/" />} />
                <Route path="/create-round" element={user ? <CreateRound /> : <Navigate to="/" />} />
                <Route path="/tournament/:id" element={user? <TournamentDetail /> : <Navigate to="/" />} />
                <Route path="/tournament/:tournamentId/round/:roundId" element={user? <RoundDetail /> : <Navigate to="/" />} />
                <Route path="/tournament/:tournamentId/round/:roundId/game/:gameId" element={user? <GameDetail /> : <Navigate to="/" />} />
                <Route path="/tournaments" element={user ? <Tournaments /> : <Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;