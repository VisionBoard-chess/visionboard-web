import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { getTournamentsByCreator, getTournaments } from '../services/tournamentService';

const TournamentContext = createContext(null);

export const TournamentProvider = ({ children }) => {
    const [allTournaments, setAllTournaments] = useState([]);
    const [userTournaments, setUserTournaments] = useState([]);

    const refreshTournaments = async (uid) => {
        const currentUid = uid ||auth.currentUser?.uid;
        if (currentUid){
            const data = await getTournamentsByCreator(currentUid);
            setUserTournaments(data);
        }
        const allData = await getTournaments();
        setAllTournaments(allData);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                refreshTournaments(user.uid);
            }
            else{
                setAllTournaments([]);
                setUserTournaments([]);
            }
        });
        return () => unsubscribe();
    }, []);
    return (
        <TournamentContext.Provider value ={{
            allTournaments, setAllTournaments,
            userTournaments, setUserTournaments,
            refreshTournaments
        }}>
            {children}
        </TournamentContext.Provider>
    );
};

export const useTournaments = () => useContext(TournamentContext);