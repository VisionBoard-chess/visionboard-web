import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './Layout';
import Sidebar from './Sidebar';
import {getGamesByRoundId, getRoundById, updateRoundStatus} from "../services/roundService.js";
import {useTournaments} from "../context/TournamentContext.jsx";

 /**
  * Component to display the details of a specific round within a tournament.
  *
  * Retrieves and displays information about the round and a list of all the
  * chess games associated with it. Allows navigation to individual games.
  *
  * Parameters
  * ----------
  * None
  *
  * Returns
  * -------
  * JSX.Element
  *   The rendered component for the round details.
  */
const RoundDetail = () => {
    const {tournamentId, roundId} = useParams();
    const navigate = useNavigate();
    const { userTournaments } = useTournaments();

    const [round, setRound] = useState(null);
    const [games, setGames] = useState(true);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const isOwner = userTournaments.some(t => t.tournamentId === tournamentId);

    useEffect(() => {
        Promise.all([
            getRoundById(tournamentId, roundId),
            getGamesByRoundId(roundId),
        ])
            .then(([roundData, gamesData]) => {
                setRound(roundData);
                setGames(gamesData);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [tournamentId, roundId]);

     const handleStatusTransition = async () => {
         if (!round) return;

         let nextStatus = '';
         if (round.status === 'NOT_STARTED') nextStatus = 'ACTIVE';
         if (round.status === 'ACTIVE') nextStatus = 'FINISHED';

         if (!nextStatus) return;

         setIsUpdating(true);
         try {
             await updateRoundStatus(tournamentId, roundId, nextStatus);

             setRound(prev => ({ ...prev, status: nextStatus }));
         } catch (error) {
             console.error("Error al cambiar el estado de la ronda:", error);
             alert("Could not update round status.");
         } finally {
             setIsUpdating(false);
         }
     };

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
                {isOwner && round.status !== 'FINISHED' && (
                    <button
                        onClick={handleStatusTransition}
                        disabled={isUpdating}
                        style={{ marginLeft: '15px' }}
                        className={`btn-action ${round.status === 'NOT_STARTED' ? 'btn-success' : 'btn-danger'}`}
                    >
                        {isUpdating ? 'Updating...' : (round.status === 'NOT_STARTED' ? 'Start Round' : 'Finish Round')}
                    </button>
                )}
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
                                <h3>{game.white} vs {game.black}</h3>
                                <p>Table {game.tableNumber}</p>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </Layout>
    );
};

export default RoundDetail;