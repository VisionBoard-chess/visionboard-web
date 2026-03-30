import { useParams, useNavigate } from 'react-router-dom';
import { useTournaments } from '../context/TournamentContext';
import {useState, useEffect} from 'react';
import Layout from './Layout';
import Sidebar from './Sidebar';

const TournamentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userTournaments } = useTournaments();

    const [rounds, setRounds] = useState([]);
    const [loadingRounds, setLoadingRounds] = useState(true);

    const tournament = userTournaments.find(t => t.tournamentId === id);

    useEffect(() => {
        if (!id) return;
        fetch (`http://localhost:8080/tournaments/${id}/rounds`)
            .then(res => res.json())
            .then(data => {
                const sorted = [...data].sort((a, b) => a.roundNumber - b.roundNumber);
                setRounds(sorted);
                setLoadingRounds(false);
            })
            .catch(() => setLoadingRounds(false));
    }, [id])

    if (!tournament) {
        return (
            <Layout>
                <Sidebar />
                <main className="main-content">
                    <p>Tournament not found</p>
                </main>
            </Layout>
        );
    }

    return (
        <Layout>
            <Sidebar />
            <main className="main-content">
                <button onClick={() => navigate('/home')} className="btn-cancel">
                    ← Back
                </button>
                <h2>{tournament.name}</h2>
                <p>{tournament.description}</p>
                <p><strong>Type:</strong> {tournament.typeOf}</p>
                <p><strong>Start Date:</strong> {tournament.startDate}</p>
                {tournament.accessCode && (
                <p><strong>Access Code:</strong> {tournament.accessCode}</p>
                )}
                <div className="content-header">
                    <h3>Rounds</h3>
                    <button
                        onClick={() => navigate(`/create-round?tournamentId=${tournament.tournamentId}`)}
                        className="create-tournament-button"
                    >
                        Add Round
                    </button>
                </div>
                {loadingRounds ? (
                    <p>Loading rounds...</p>
                ) : rounds.length === 0 ? (
                    <div className="empty-state">
                        <p>No Rounds created yet</p>
                        <p className="empty-subtitle">Create your first Round</p>
                    </div>
                ) : (
                    <div className="tournaments-grid">
                        {rounds.map((round) => (
                            <div key={round.roundId}
                                 className="tournament-card"
                                 onClick={() => navigate(`/tournament/${id}/round/${round.roundId}`)}
                                 style={{cursor: 'pointer'}}
                            >
                                <h3>Round {round.roundNumber} - {round.name}</h3>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </Layout>
    );
};

export default TournamentDetail;
