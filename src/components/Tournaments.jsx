import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import Sidebar from './Sidebar';
import { useTournaments } from '../context/TournamentContext';
import './Home.css';

/**
 * Component that renders the global tournaments archive.
 * It filters out the user's own tournaments to only show
 * tournaments created by other players (Spectator mode).
 */
const Tournaments = () => {
    const navigate = useNavigate();

    const { allTournaments, userTournaments } = useTournaments();

    const exploreTournaments = allTournaments.filter(tournament => {
        const tId = tournament.tournamentId || tournament.id;
        return !userTournaments.some(ut => (ut.tournamentId || ut.id) === tId);
    });

    return (
        <Layout>
            <Sidebar />
            <main className="main-content">
                <div className="content-header">
                    <h2>Explore Global Tournaments</h2>
                </div>
                <p className="subtitle">Discover public tournaments created by other players and watch live games.</p>

                {!exploreTournaments || exploreTournaments.length === 0 ? (
                    <div className="empty-state">
                        <p>No new public tournaments to explore right now</p>
                    </div>
                ) : (
                    <div className="tournaments-grid">
                        {exploreTournaments.map((tournament) => {
                            const tId = tournament.tournamentId || tournament.id;

                            return (
                                <div key={tId}
                                     className="tournament-card spectator-card"
                                     onClick={() => navigate(`/tournament/${tId}`)}
                                     style={{ cursor: 'pointer' }}
                                >
                                    <div className="card-header">
                                        <h3>{tournament.name}</h3>
                                    </div>

                                    <p className="tournament-desc">{tournament.description}</p>

                                    <div className="card-footer">
                                        <span className={`badge ${tournament.typeOf?.toLowerCase()}`}>
                                            {tournament.typeOf}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </Layout>
    );
};

export default Tournaments;