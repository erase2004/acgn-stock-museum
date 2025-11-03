import { test, expect } from '@playwright/test'
import { rounds, siteList } from '@/configs/sites'
import { getRuleAgendaListUrl } from '@/libs/routes'

for (const round of rounds) {
  test.describe(`[${round}] rule discussion list`, () => {
    test('suites', async ({ context }) => {
      const page = await context.newPage()

      await page.goto(getRuleAgendaListUrl(round))

      await test.step('has title', async () => {
        const websiteName = siteList[round as keyof typeof siteList]?.name
        const title = `規則討論 - ${websiteName}`

        await expect(page).toHaveTitle(title)
      })

      await test.step('has content', async () => {
        const element = await page.locator('.round-block-title')

        await expect(element).toHaveText('規則討論')
        await expect(element).toBeVisible()
      })
    })
  })
}
