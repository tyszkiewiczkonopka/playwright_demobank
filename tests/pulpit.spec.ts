import { test, expect } from '@playwright/test';

test.describe('Pulpit tests', () => {
  test.beforeEach(async ({ page }) => {
    //const url = 'https://demo-bank.vercel.app/';
    const userName = 'testerka';
    const userPassword = '12345678';

    // login
    await page.goto('/');
    await page.getByTestId('login-input').fill(userName);
    await page.getByTestId('password-input').fill(userPassword);
    await page.getByTestId('login-button').click();

    // wait for page to fully load
    await page.waitForLoadState('domcontentloaded');
  });

  test('quick payment with correct data', async ({ page }) => {
    // Arrange
    const receiverId = '2';
    const transferAmount = '150';
    const transferTitle = 'zwrot';
    const expectedTransferReceiver = 'Chuck Demobankowy';

    // Act
    await page.locator('#widget_1_transfer_receiver').selectOption(receiverId);
    await page.locator('#widget_1_transfer_amount').fill(transferAmount);
    await page.locator('#widget_1_transfer_title').fill(transferTitle);

    await page.locator('#execute_btn').click();
    await page.getByTestId('close-button').click();

    // Assert
    await expect(page.locator('#show_messages')).toHaveText(
      `Przelew wykonany! ${expectedTransferReceiver} - ${transferAmount},00PLN - ${transferTitle}`,
    );
  });

  test('successful mobile top-up', async ({ page }) => {
    // Arrange
    const topupReceiver500 = '500 xxx xxx';
    const topupAmount = '40';
    const successfulTopUpMessage = `Doładowanie wykonane! ${topupAmount},00PLN na numer ${topupReceiver500}`;

    // Act
    await page
      .locator('#widget_1_topup_receiver')
      .selectOption(topupReceiver500);
    await page.locator('#widget_1_topup_amount').fill(topupAmount);
    await page.locator('#uniform-widget_1_topup_agreement span').click();
    await page.locator('#execute_phone_btn').click();
    await page.getByTestId('close-button').click();

    // Assert
    await expect(page.getByTestId('message-text')).toHaveText(
      successfulTopUpMessage,
    );
  });
});
