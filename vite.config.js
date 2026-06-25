import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    base: '/visionboard/',
    plugins: [react()],
    test: {
        environment: 'jsdom',
        setupFiles: './src/tests/setup.js',
        exclude: ['**/e2e/**','**/node_modules/**'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov'],
            reportsDirectory: './coverage',
            include: [
                'src/services/**/*.{js,jsx,ts,tsx}',
                'src/components/Login.jsx',
                'src/components/Register.jsx',
                'src/components/ForgotPassword.jsx',
                'src/components/VerifyEmail.jsx',
                'src/components/CreateRound.jsx',
                'src/components/CreateTournament.jsx',
                'src/context/**',
            ],
            exclude: [
                'src/components/Home.jsx',
                'src/components/Layout.jsx',
                'src/components/Sidebar.jsx',
                'src/components/GameDetail.jsx',
                'src/components/RoundDetail.jsx',
                'src/components/TournamentDetail.jsx',
                'src/components/Tournaments.jsx',
                'src/main.jsx',
                '**/e2e/**',
                '**/*.d.ts',
            ],
        },
    }
})
