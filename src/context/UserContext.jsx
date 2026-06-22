import { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        const saved = localStorage.getItem('currentUser');
        return saved ? JSON.parse(saved) : null;
    });

    const clearUser = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
    };

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);