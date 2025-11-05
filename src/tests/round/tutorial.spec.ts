import { test, expect } from '@playwright/test'
import { rounds, siteList } from '@/configs/sites'
import { getTutorialUrl } from '@/libs/routes'

for (const round of rounds) {
  test.describe(`[${round}] tutorial`, () => {
    test('suites', async ({ context }) => {
      const page = await context.newPage()

      await page.goto(getTutorialUrl(round))

      await test.step('has title', async () => {
        const websiteName = siteList[round as keyof typeof siteList]?.name
        const title = `遊戲規則 - ${websiteName}`

        await expect(page).toHaveTitle(title)
      })

      await test.step('has content', async () => {
        const element = page.getByText('ACGN 股票交易市場說明手冊')

        await expect(element).toHaveRole('link')
        await expect(element).toBeVisible()
      })
    })
  })
}
