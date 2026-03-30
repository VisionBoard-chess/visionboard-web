import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ExcelJS from 'exceljs';
import Layout from './Layout';
import Sidebar from './Sidebar';
import './CreateRound.css';

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
        fetch(`http://localhost:8080/tournaments/${tournamentId}/rounds/next-round-number`)
            .then(res => res.json())
            .then(data => {
                setForm(prev => ({ ...prev, roundNumber: data.nextRoundNumber }));
            })
            .catch(() => {});
    }, [tournamentId]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

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
                `http://localhost:8080/tournaments/${tournamentId}/rounds`,
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
