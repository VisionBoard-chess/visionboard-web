import {useParams, useNavigate} from "react-router-dom";
import {useState, useEffect, useCallback} from "react";
import {useTournaments} from "../context/TournamentContext";
import Layout from "./Layout";
import Sidebar from "./Sidebar";
import "./GameDetail.css";

import {Chess} from "chess.js";
import {Chessboard} from "react-chessboard";

const ChessViewer = ({gameId, initialPgn, isOwner}) =>{
    const [history, setHistory] = useState([]);
    const [fenHistory, setFenHistory] = useState([]);
    const [currentMove, setCurrentMove] = useState(0);

    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState(null);
    const [parsed, setParsed] = useState(false);

    useEffect(() => {
        if (!initialPgn?.trim()) return;
        try {
            const game = new Chess();
            game.loadPgn(initialPgn);
            const hist = game.history({ verbose: true });

            const replayGame = new Chess();
            const fens = [replayGame.fen()];
            for (const move of hist) {
                replayGame.move(move.san);
                fens.push(replayGame.fen());
            }

            console.log("hist length:", hist.length, "fens length:", fens.length);

            setHistory(hist);
            setFenHistory(fens);
            setCurrentMove(hist.length);
            setError(null);
        } catch (e) {
            setError('Invalid PGN: ' + e.message);
        } finally {
            setParsed(true);
        }
    }, [initialPgn]);

    useEffect(() => {

        const handleKey = (e) => {
            if (e.key === "ArrowLeft") setCurrentMove(m => Math.max(0, m-1));
            if (e.key === "ArrowRight") setCurrentMove(m => Math.min(history.length, m+1));
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [history.length]);

    const onPieceDrop = useCallback((sourceSquare, targetSquare, piece) => {
        if (!editMode) return;

        const game = new Chess();
        try { game.loadPgn(initialPgn); } catch { return false; }
        const movesToUndo = history.length - currentMove;
        for (let i = 0; i < movesToUndo; i++) game.undo();

        let move;
        try{
            move = game.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: piece?.[1]?.toLowerCase() ?? 'q',
            });
        } catch{
            return false;
        }
        if (!move) return false;

        const isEdit = currentMove < history.length;

        if (isEdit) {
            fetch(`http://localhost:8080/games/${gameId}/move/edit`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ moveIndex: currentMove + 1/* Puede que tenga que ser un +2 en vez de +1*/, moveSan: move.san })
            }).catch(e => console.error("Error enviando edit:", e));
        } else {
            fetch(`http://localhost:8080/games/${gameId}/move/add`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ moveSan: move.san })
            }).catch(e => console.error("Error enviando add:", e));
        }


        const newHistory = [...history.slice(0,currentMove), move];

        const newFenHistory = [...fenHistory.slice(0, currentMove + 1), game.fen()];

        setHistory(newHistory);
        setFenHistory(newFenHistory);
        setCurrentMove(currentMove+1);
        setEditMode(false);
        return true;
    }, [editMode, history, currentMove, fenHistory, initialPgn]);


    if (!parsed) return <p> Loading...</p>
    if (error) return <p className="error-message">{error}</p>
    if (!initialPgn) return <p>No pgn cargado</p>;

    const currentFen = fenHistory.length > 0 && fenHistory[currentMove]
        ? fenHistory[currentMove]
        : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    console.log("fenHistory length:", fenHistory.length);
    console.log("currentMove:", currentMove);
    console.log("currentFen:", currentFen);
    console.log("Renderizando tablero con FEN:", currentFen, "move:", currentMove);

    return(
        <div className="chess-viewer">
            <div className="chess-board-wrap">
                {isOwner && (
                    <div className="chess-toolbar">
                        <button
                            className={`btn-edit-mode ${editMode ? "active" : ""}`}
                            onClick={() => setEditMode(e => !e)}
                        >
                            {editMode ? "Editando" : "Editar"}
                        </button>
                    </div>
                )}
                <Chessboard
                    position={currentFen}
                    arePiecesDraggable={editMode}
                    onPieceDrop={onPieceDrop}
                    boardWidth={400}
                    animationDuration={200}
                />
                <div className="chess-controls">
                    <button onClick={() => setCurrentMove(0)} >⏮</button>
                    <button onClick={() => setCurrentMove(m => Math.max(0, m-1))} >◀</button>
                    <span>{currentMove}/{history.length}</span>
                    <button onClick={() => setCurrentMove(m => Math.min(history.length, m+1))} >▶</button>
                    <button onClick={() => setCurrentMove(history.length)} >⏭</button>
                </div>
            </div>
            <div className="chess-moves">
                <h3>Movimientos de la partida</h3>
                {history.length === 0 ?(
                    <p>No hay movimientos aun</p>
                ):(
                    Array.from({length: Math.ceil(history.length/2)},(_,i) =>{
                        const wi = i * 2 ;
                        const bi = i * 2 + 1;

                        const whiteMoveNum = wi + 1;
                        const blackMoveNum = bi + 1;

                        return (
                            <div key={i} className="move-row">
                                <span className="move-num">{i+1}.</span>
                                <button
                                    className={`move-btn ${currentMove === whiteMoveNum ? "current" : ""}`}
                                    onClick={() => setCurrentMove(whiteMoveNum)}
                                >
                                    {history[wi]?.san}
                                </button>
                                {history[bi] && (
                                    <button
                                        className={`move-btn ${currentMove === blackMoveNum ? "current" : ""}`}
                                        onClick={() => setCurrentMove(blackMoveNum)}
                                    >
                                        {history[bi]?.san}
                                    </button>
                                )}
                            </div>
                        );
                    })
                )}
                {/* Botón para descargar pgn? */}
            </div>
        </div>
    );
};

const GameDetail = () => {
    const { tournamentId, roundId, gameId } = useParams();
    const navigate = useNavigate();
    const { userTournaments } = useTournaments();

    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [livePgn, setLivePgn] = useState(null);

    const isOwner = userTournaments.some(t => t.tournamentId === tournamentId);

    useEffect(() => {
        fetch(`http://localhost:8080/games/${gameId}`)
            .then(res => res.json())
            .then(data => {
                setGame(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [gameId]);

    useEffect(() => {
        const se = new EventSource(`http://localhost:8080/games/${gameId}/sse`);

        se.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.type === "pgn_update") {
                setLivePgn(data.newPgn);
            } else if (data.type === "initial_pgn"){
                setLivePgn(data.pgn);
            }
        };

        se.onerror = (e) => {
            console.error("SSE error:", e);
            se.close();
        };

        return () => se.close();
    }, [gameId]);

    if (loading) return (
        <Layout>
            <Sidebar />
            <main className="main-content">
                <p>Loading...</p>
            </main>
        </Layout>
    );

    if (!game) return (
        <Layout>
            <Sidebar />
            <main className="main-content">
                <p>Game not found</p>
            </main>
        </Layout>
    );

    return (
        <Layout>
            <Sidebar />
            <main className="main-content">
                <button onClick={() => navigate(`/tournament/${tournamentId}/round/${roundId}`)} className="btn-cancel">
                    ← Back
                </button>
                <h2>Game {game.numberTable}</h2>
                <p><strong>White:</strong> {game.white}</p>
                <p><strong>Black:</strong> {game.black}</p>
                <p><strong>Result:</strong>{game.result}</p>
                <ChessViewer
                    gameId={game.id}
                    initialPgn={livePgn || game.pgn}
                    isOwner={isOwner}
                />
            </main>
        </Layout>
    );
};

export default GameDetail;