import { test, expect } from '@playwright/test'
import { rounds, siteList } from '@/configs/sites'
import { getFSCStockUrl } from '@/libs/routes'

for (const round of rounds) {
  test.describe(`[${round}] fsc stock`, () => {
    test('suites', async ({ context }) => {
      const page = await context.newPage()

      await page.goto(getFSCStockUrl(round))

      await test.step('has title', async () => {
        const websiteName = siteList[round as keyof typeof siteList]?.name
        const title = `金管會持股 - ${websiteName}`

        await expect(page).toHaveTitle(title)
      })

      await test.step('has content', async () => {
        const element = page.locator('.round-block-title')

        await expect(element).toHaveText('金管會持股')
        await expect(element).toBeVisible()
      })
    })
  })
}
