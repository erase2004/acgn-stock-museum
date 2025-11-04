import { test, expect } from '@playwright/test'
import { rounds, siteList } from '@/configs/sites'
import { getCompanyListUrl } from '@/libs/routes'

for (const round of rounds) {
  test.describe(`[${round}] company list`, () => {
    test('suites', async ({ context }) => {
      const page = await context.newPage()

      await page.goto(getCompanyListUrl(round))

      await test.step('has title', async () => {
        const websiteName = siteList[round as keyof typeof siteList]?.name
        const title = `股市總覽 - ${websiteName}`

        await expect(page).toHaveTitle(title)
      })

      await test.step('has content', async () => {
        const element = await page.locator('.round-block-title')

        await expect(element).toHaveText('股市總覽')
        await expect(element).toBeVisible()
      })
    })
  })
}
