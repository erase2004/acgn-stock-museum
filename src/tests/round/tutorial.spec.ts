import { test, expect } from '@playwright/test'
import { legacyRounds, rounds, siteList } from '@/configs/sites'
import { getTutorialUrl } from '@/libs/routes'

for (const round of rounds) {
  test.describe(`[${round}] tutorial`, () => {
    test('suites', async ({ context }) => {
      const isLegacyRound = legacyRounds.includes(round)

      const page = await context.newPage()

      await page.goto(getTutorialUrl(round), { waitUntil: 'commit' })

      await test.step('has title', async () => {
        const websiteName = siteList[round as keyof typeof siteList]?.name
        const title = `遊戲規則 - ${websiteName}`

        await expect(page).toHaveTitle(title)
      })

      await test.step('has content', async () => {
        const element = page.getByText('ACGN 股票交易市場說明手冊')

        if (isLegacyRound) {
          await expect(element).toHaveCount(0)
        } else {
          await expect(element).toHaveRole('link')
          await expect(element).toBeVisible()
        }
      })
    })
  })
}
