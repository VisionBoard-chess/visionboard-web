import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { TournamentProvider } from './context/TournamentContext';
import {UserProvider} from "./context/UserContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <UserProvider>
          <TournamentProvider>
              <App />
          </TournamentProvider>
      </UserProvider>
  </StrictMode>,
)
