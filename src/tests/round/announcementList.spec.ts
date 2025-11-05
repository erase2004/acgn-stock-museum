import { test, expect } from '@playwright/test'
import { rounds, siteList } from '@/configs/sites'
import { getAnnouncementListUrl } from '@/libs/routes'

for (const round of rounds) {
  test.describe(`[${round}] announcement list`, () => {
    test('suites', async ({ context }) => {
      const page = await context.newPage()

      await page.goto(getAnnouncementListUrl(round))

      await test.step('has title', async () => {
        const websiteName = siteList[round as keyof typeof siteList]?.name
        const title = `系統公告 - ${websiteName}`

        await expect(page).toHaveTitle(title)
      })

      await test.step('has content', async () => {
        const element = page.locator('.round-block-title')

        await expect(element).toHaveText('系統公告')
        await expect(element).toBeVisible()
      })
    })
  })
}
