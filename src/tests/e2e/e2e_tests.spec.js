import{ test, expect } from '@playwright/test';

test('login_navigates_to_home', async({page}) => {
    await page.goto('http://localhost:5173/visionboard/');
    await page.fill('input[placeholder="Email"]', 'correo de cuenta verificada');
    await page.fill('input[placeholder="Contraseña"]', 'contraseña de la cuenta verificada');
    await page.click('button:has-text("Login")');
    await expect(page.getByText('Welcome to VisionBoard iksaba15!')).toBeVisible();
    await page.click('text=Tournaments');
    await expect(page.getByText('Explore Global Tournaments')).toBeVisible();
    await page.click('text=Home');
    await expect(page.getByText('Welcome to VisionBoard iksaba15!')).toBeVisible();
})

test('createTournament_success_navigates_home', async({page}) =>{
    await page.goto('http://localhost:5173/visionboard/');
    await page.fill('input[placeholder="Email"]', 'correo de cuenta verificada');
    await page.fill('input[placeholder="Contraseña"]', 'contraseña de la cuenta verificada');
    await page.click('button:has-text("Login")');
    await page.click('button:has-text("Create Tournament")');
    await page.fill('input[name="name"]', 'Test Tournament');
    await page.fill('textarea[name="description"]', 'This is a test tournament');
    await page.selectOption('select[name="type"]', 'closed');
    await page.fill('input[name="startDate"]', '2026-12-12T00:00');
    await page.click('button:has-text("Create")');
    await page.waitForSelector('.tournament-card');
    await expect(page).toHaveURL('http://localhost:5173/visionboard/home');
})

test('createRound_success_navigates_tournament', async({page}) =>{
    await page.goto('http://localhost:5173/visionboard/');
    await page.fill('input[placeholder="Email"]', 'correo de cuenta verificada');
    await page.fill('input[placeholder="Contraseña"]', 'contraseña de la cuenta verificada');
    await page.click('button:has-text("Login")');
    await page.click('.tournament-card:has-text("Test Tournament")');
    await page.click('button:has-text("Add Round")');
    await page.fill('input[name="name"]', 'Test Round');
    await page.fill('input[name="roundNumber"]', '1');
    await page.setInputFiles('input[type="file"]', 'src/tests/e2e/fixtures/prueba_e2e.xlsx');
    await page.click('button:has-text("Create")');
    await page.waitForSelector('.tournament-card');
    await expect(page).toHaveURL(/.*\/tournament\/.*/);
})
test('viewRound_success_navigates_to_round', async({page}) =>{
    await page.goto('http://localhost:5173/visionboard/');
    await page.fill('input[placeholder="Email"]', 'correo de cuenta verificada');
    await page.fill('input[placeholder="Contraseña"]', 'contraseña de la cuenta verificada');
    await page.click('button:has-text("Login")');
    await page.click('.tournament-card:has-text("Test Tournament")');
    await page.click('.tournament-card:has-text("Test Round")');
    await expect(page.getByText('Round 1')).toBeVisible();
    await expect(page.getByText('No games in this round')).toBeVisible();
    await expect(page).toHaveURL(/.*\/tournament\/.*/);
})
