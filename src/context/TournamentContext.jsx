import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { getTournamentsByCreator, getTournaments } from '../services/tournamentService';
import { getUserByFirebaseUid } from '../services/userService';

const TournamentContext = createContext(null);

export const TournamentProvider = ({ children }) => {
    const [allTournaments, setAllTournaments] = useState([]);
    const [userTournaments, setUserTournaments] = useState([]);

    const refreshTournaments = async (userId) => {
        if (userId) {
            const data = await getTournamentsByCreator(userId);
            setUserTournaments(data);
        }
        const allData = await getTournaments();
        setAllTournaments(allData);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const backendUser = await getUserByFirebaseUid(user.uid);
                refreshTournaments(backendUser.id);
            } else {
                setAllTournaments([]);
                setUserTournaments([]);
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <TournamentContext.Provider value={{
            allTournaments, setAllTournaments,
            userTournaments, setUserTournaments,
            refreshTournaments
        }}>
            {children}
        </TournamentContext.Provider>
    );
};

export const useTournaments = () => useContext(TournamentContext);