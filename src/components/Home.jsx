import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import Sidebar from './Sidebar';
import {useTournaments} from '../context/TournamentContext';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const { userTournaments } = useTournaments();

    const handleCreateTournament = () => {
        navigate('/create-tournament');
    };

    return (
        <Layout>
            <Sidebar />
            <main className="main-content">
                <h2>Welcome to LiveChess!</h2>
                <p>This is your dashboard. Here you can find the latest chess news, upcoming tournaments, and your profile stats.</p>
                <div className="content-header">
                    <h3>Your Active Tournaments</h3>
                    <button onClick={handleCreateTournament} className="create-tournament-button">
                        Create Tournament
                    </button>
                </div>
                {userTournaments.length === 0 ? (
                    <div className="empty-state">
                        <p>No Tournaments created yet</p>
                        <p className="empty-subtitle">Create your first Tournament</p>
                    </div>
                ) : (
                    <div className="tournaments-grid">
                        {userTournaments.map((tournament) => (
                            <div key={tournament.tournamentId}
                                 className="tournament-card"
                                 onClick={() => navigate(`/tournament/${tournament.tournamentId}`)}
                                 style={{cursor: 'pointer'}}
                            >
                                <h3>{tournament.name}</h3>
                                <p>{tournament.description}</p>
                                <span className={`badge ${tournament.typeOf?.toLowerCase()}`}>
                                    {tournament.typeOf}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </Layout>
    );
};

export default Home;
