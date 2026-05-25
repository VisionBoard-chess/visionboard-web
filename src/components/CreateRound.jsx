import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ExcelJS from 'exceljs';
import Layout from './Layout';
import Sidebar from './Sidebar';
import './CreateRound.css';

const BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Component for creating a new round in a tournament.
 *
 * Manages a form that let the user to add basic details
 * of the round and upload a file with the pairings.
 * The file can be in Excel or CSV format as in info64.com documents.
 *
 */
const CreateRound = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const tournamentId = searchParams.get('tournamentId');

    const [form, setForm] = useState({
        name: '',
        roundNumber: '',
        startDate: '',
    });

    const [games, setGames] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if(!tournamentId) return;
        fetch(`${BASE_URL}/tournaments/{tournamentId}/rounds/next-round-number`)
            .then(res => res.json())
            .then(data => {
                setForm(prev => ({ ...prev, roundNumber: data.nextRoundNumber }));
            })
            .catch(() => {});
    }, [tournamentId]);

    /**
     * Updates the state of the form when ever changes an input.
     *
     * Parameters
     * ----------
     *
     * e: Event
     *   The event triggered by the change in the input.
     *
     * Returns
     * -------
     *
     * void
     */
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    /**
     * Process the Excel or CSV file uploaded to extract the pairings
     *
     * Reads an uploaded file from the user, detects the type of file
     * and extracts the table numbers, white player and black player,
     * updating the state of the game.
     *
     * Parameters
     * ----------
     *
     * e: Event
     *   The event triggered by the file upload.
     *
     * Returns
     * -------
     *
     * void
     */
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (ev) => {
            const data = ev.target.result;
            const workbook = new ExcelJS.Workbook();

            if (file.name.endsWith('.csv')) {
                await workbook.csv.read(data);
            } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                await workbook.xlsx.load(data);
            }

            const parsedGames = [];
            workbook.worksheets[0].eachRow((row) => {
                const table = row.getCell(1).value;
                const white = row.getCell(2).value;
                const black = row.getCell(8).value;
                if (!table || isNaN(parseInt(table)) || !white || !black) return;
                parsedGames.push({
                    tableNumber: parseInt(table),
                    white: white.toString().trim(),
                    black: black.toString().trim(),
                });
            });

            setGames(parsedGames);
            console.log('Partidas cargadas:', parsedGames);
        };

        reader.readAsArrayBuffer(file);
    };


    /**
     * Sends the information of the new round to the backend.
     *
     * When the user submits the form, this function gathers all the information
     * from the form and the uploaded file, creates a payload and sends it to the backend
     * to create the new round. If the request is successful, it navigates back to the tournament page.
     * If there is an error, it updates the error state to show the message to the user.
     *
     * Parameters
     * ----------
     *
     * e: Event
     *   The event triggered by the form submission.
     *
     * Returns
     * -------
     *
     * void
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const payload = {
            name: form.name,
            roundNumber: parseInt(form.roundNumber),
            startDate: form.startDate ? form.startDate : null,
            games: games,
        };

        try {
            const response = await fetch(
                `${BASE_URL}/tournaments/${tournamentId}/rounds`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                const msg = await response.text();
                setError(`Error: ${msg}`);
                return;
            }

            navigate(`/tournament/${tournamentId}`);
        } catch {
            setError('Connection error');
        }
    };

    return (
        <Layout>
            <Sidebar />
            <main className="main-content">
                <button onClick={() => navigate(`/tournament/${tournamentId}`)} className="btn-cancel">
                    ← Back
                </button>
                <h2>Create Round</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}> {/* Modificar para que sea onLoad para que no se pueda enviar 2 veces la petición sin querer? */}
                    <div>
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Round Number</label>
                        <input
                            type="number"
                            name="roundNumber"
                            value={form.roundNumber}
                            onChange={handleChange}
                            min="1"
                            required
                        />
                    </div>
                    <div>
                        <label>Start Date (optional)</label>
                        <input
                            type="datetime-local"
                            name="startDate"
                            value={form.startDate}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Upload Pairings (Excel/CSV)</label>
                        <input
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleFileUpload}
                        />
                    </div>
                    <button type="submit" className="create-tournament-button">
                        Create Round
                    </button>
                </form>
            </main>
        </Layout>
    );
};

export default CreateRound;
