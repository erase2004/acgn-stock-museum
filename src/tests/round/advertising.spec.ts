import { test, expect } from '@playwright/test'
import { rounds, siteList } from '@/configs/sites'
import { getAdvertisingUrl } from '@/libs/routes'

for (const round of rounds) {
  test.describe(`[${round}] advertisement`, () => {
    test('suites', async ({ context }) => {
      const page = await context.newPage()

      await page.goto(getAdvertisingUrl(round), { waitUntil: 'commit' })

      await test.step('has title', async () => {
        const websiteName = siteList[round as keyof typeof siteList]?.name
        const title = `廣告宣傳 - ${websiteName}`

        await expect(page).toHaveTitle(title)
      })

      await test.step('has content', async () => {
        const element = page.locator('.round-block-title')

        await expect(element).toHaveText('廣告中心')
        await expect(element).toBeVisible()
      })
    })
  })
}
