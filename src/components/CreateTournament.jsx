import { createTournament } from '../services/tournamentService';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import Sidebar from './Sidebar';
import {useTournaments} from '../context/TournamentContext';
import {useUser} from '../context/UserContext';
import './CreateTournament.css';

/**
 * Component for creating a new tournament.
 *
 * Provides a form interface for the user to input tournament details such as
 * name, description, type, and start date. It handles form submission by calling
 * the tournament creation service and redirecting on success.
 *
 * Parameters
 * ----------
 * None
 *
 * Returns
 * -------
 * JSX.Element
 *   The rendered component for creating a tournament.
 */
const CreateTournament = () => {
    const navigate = useNavigate();
    const {refreshTournaments} = useTournaments();
    const {currentUser} = useUser();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'open',
        maxPlayers: '',
        startDate: '',
        creatorId: currentUser.id
    });
    const [error, setError] = useState('');

    /**
     * Updates the form state whenever an input field value changes.
     *
     * Parameters
     * ----------
     *
     * e: Event
     *   The event triggered by the change in the input field.
     *
     * Returns
     * -------
     *
     * void
     */

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /**
     * Submits the tournament details to the backend.
     *
     * Prevents default form behavior, calls the 'createTournament' API service,
     * refreshes the tournament context upon success, and navigates to the home view.
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
                navigate('/home');
            } else{
                setError('Error creating Tournament');
            }
        } catch (error) {
            setError('Connection error: ' + error.message);
        }
    };

    /**
     * Aborts the tournament creation process and navigates back to the root page.
     *
     * Parameters
     * ----------
     * None
     *
     * Returns
     * -------
     * void
     */
    const handleCancel = () => {
        navigate('/');
    };

    return (
        <Layout>
            <Sidebar />
            <main className="main-content">
                <div className="create-tournament-container">
                    <h2>Create Tournament</h2>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
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
