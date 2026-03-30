import { createTournament } from '../services/tournamentService';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import Sidebar from './Sidebar';
import {auth} from '../firebase/config';
import {useTournaments} from '../context/TournamentContext';
import './CreateTournament.css';

const CreateTournament = () => {
    const navigate = useNavigate();
    const {refreshTournaments} = useTournaments();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'open',
        maxPlayers: '',
        startDate: '',
        creatorId: auth.currentUser?.uid || ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const result = await createTournament(
                formData.name,
                formData.description,
                formData.type,
                formData.startDate,
                formData.creatorId
            );
            if (result.success) {
                await refreshTournaments();
                console.log('Successfully created');
                navigate('/home');
            } else{
                console.error('Error creating Tournament');
            }
        } catch (error) {
            console.error('Error creating Tournament:', error);
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <Layout>
            <Sidebar />
            <main className="main-content">
                <div className="create-tournament-container">
                    <h2>Create Tournament</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Name of the Tournament</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="type">Type of Tournament</label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                            >
                                <option value="OPEN">Open</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="startDate">Start Date</label>
                            <input
                                type="datetime-local"
                                id="startDate"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-actions">
                            <button type="button" onClick={handleCancel} className="btn-cancel">
                                Cancel
                            </button>
                            <button type="submit" className="btn-submit">
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </Layout>
    );
};

export default CreateTournament;
