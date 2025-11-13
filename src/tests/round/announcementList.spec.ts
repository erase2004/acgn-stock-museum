import { test, expect } from '@playwright/test'
import { legacyRounds, rounds, siteList } from '@/configs/sites'
import { getAnnouncementListUrl } from '@/libs/routes'

for (const round of rounds) {
  test.describe(`[${round}] announcement list`, () => {
    test('suites', async ({ context }) => {
      const isLegacyRound = legacyRounds.includes(round)

      const page = await context.newPage()

      await page.goto(getAnnouncementListUrl(round), { waitUntil: 'commit' })

      if (isLegacyRound) {
        await test.step('has redirect meta', async () => {
          const meta = page.locator('[http-equiv="refresh"]')

          await expect(meta).toHaveCount(1)
        })
      } else {
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
      }
    })
  })
}
