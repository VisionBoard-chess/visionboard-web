import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {useTournaments} from '../context/TournamentContext';
import Layout from './Layout';
import Sidebar from './Sidebar';

const RoundDetail = () => {
    const {tournamentId, roundId} = useParams();
    const navigate = useNavigate();
    const { userTournaments } = useTournaments();

    const [round, setRound] = useState(null);
    const [games, setGames] = useState(true);
    const [loading, setLoading] = useState(true);

    const isOwner = userTournaments.some(t => t.tournamentId === tournamentId);

    useEffect(() => {
        Promise.all([
            fetch(`http://localhost:8080/tournaments/${tournamentId}/rounds/${roundId}`).then(res => res.json()), //tal hay que revisar la info que trae de partida
            fetch(`http://localhost:8080/games/round/${roundId}`).then(res => res.json())
        ])
            .then(([roundData, gamesData]) => {
                setRound(roundData);
                setGames(gamesData);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [tournamentId, roundId]);

    if (loading) return (
        <Layout>
            <Sidebar />
            <main className="main-content">
                <p>Loading...</p>
            </main>
        </Layout>
    )
    if (!round) return (
        <Layout>
            <Sidebar />
            <main className="main-content">
                <p>Round not found</p>
            </main>
        </Layout>
    );

    return (
        <Layout>
            <Sidebar />
            <main className="main-content">
                <button onClick={() => navigate(`/tournament/${tournamentId}`)} className="btn-cancel">
                    ← Back
                </button>
                <h2>Round {round.roundNumber} - {round.name}</h2>
                {round.startDate && <p> {new Date(round.startDate).toLocaleString()}</p>}
                <span className={`badge ${round.status?.toLowerCase()}`}>{round.status}</span>

                <h3>Games</h3>
                {games.length === 0 ? (
                    <p>No games in this round</p>
                ) : (
                    <div className="tournaments-grid">
                        {games.map(game => (
                            <div
                                key={game.id}
                                className="tournament-card"
                                onClick={() => navigate(`/tournament/${tournamentId}/round/${roundId}/game/${game.id}`)}
                                style={{cursor: 'pointer'}}
                            >
                                <h3>{game.white} vs {game.black}</h3>                                <p>Table {game.tableNumber}</p>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </Layout>
    );
};

export default RoundDetail;