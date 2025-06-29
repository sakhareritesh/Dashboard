import { test, expect } from '@playwright/test';

test('should allow a user to search for content and use filters', async ({ page }) => {
  
  await page.goto('/');

 
  const searchInput = page.getByPlaceholder('Search for movies, songs, news...');
  await expect(searchInput).toBeVisible();
  await searchInput.fill('Technology');

  await page.getByRole('button', { name: 'All' }).click();

  await page.getByRole('option', { name: 'News' }).click();

  await searchInput.press('Enter');


  await expect(page).toHaveURL(/search=Technology&filter=news/);
\
  const resultsHeader = page.locator('h1');
  await expect(resultsHeader).toHaveText('Results for "Technology"');


  const firstReadMoreButton = page.getByRole('link', { name: 'Read More' }).first();
  await expect(firstReadMoreButton).toBeVisible({ timeout: 15000 }); 
  const newsBadges = page.getByText('news');
  await expect(newsBadges.first()).toBeVisible();
});
