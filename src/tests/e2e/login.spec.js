import{ test, expect } from '@playwright/test';

test('login_navigates_to_home', async({page}) => {
    await page.goto('http://localhost:5173/visualboard/');
    await page.fill('input[placeholder="Email"]', 'iksaba15@gmail.com');
    await page.fill('input[placeholder="Contraseña"]', 'holaQ123@');
    await page.click('button:has-text("Login")');
    await page.context().storageState({ path: 'e2e/auth.json' });
    await expect(page.getByText('Welcome to VisionBoard iksaba15!')).toBeVisible();
    await page.click('text=Tournaments');
    await expect(page.getByText('Explore Global Tournaments')).toBeVisible();
    await page.click('text=Home');
    await expect(page.getByText('Welcome to VisionBoard iksaba15!')).toBeVisible();
})

test('createTournament_success_navigates_home', async({page}) =>{
    await page.goto('http://localhost:5173/visualboard/home');
    await page.click('button:has-text("Create Tournament")');
    await page.fill('input[name="name"]', 'Test Tournament');
    await page.fill('textarea[name="description"]', 'This is a test tournament');
    await page.selectOption('select[name="type"]', 'closed');
    await page.fill('input[name="startDate"]', '2026-01-01');
    await page.click('button:has-text("Create Tournament")');
    await expect(page).toHaveURL('http://localhost:5173/visualboard/home');
})