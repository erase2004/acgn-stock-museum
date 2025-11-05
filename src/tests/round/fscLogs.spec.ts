import { test, expect } from '@playwright/test'
import { rounds, siteList } from '@/configs/sites'
import { getFSCLogUrl } from '@/libs/routes'

for (const round of rounds) {
  test.describe(`[${round}] fsc log`, () => {
    test('suites', async ({ context }) => {
      const page = await context.newPage()

      await page.goto(getFSCLogUrl(round))

      await test.step('has title', async () => {
        const websiteName = siteList[round as keyof typeof siteList]?.name
        const title = `金管會執行紀錄 - ${websiteName}`

        await expect(page).toHaveTitle(title)
      })

      await test.step('has content', async () => {
        const element = page.locator('.round-block-title')

        await expect(element).toHaveText('金管會執行紀錄')
        await expect(element).toBeVisible()
      })
    })
  })
}
