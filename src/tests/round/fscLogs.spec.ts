import { test, expect } from '@playwright/test'
import { legacyRounds, rounds, siteList } from '@/configs/sites'
import { getFSCLogUrl } from '@/libs/routes'

for (const round of rounds) {
  test.describe(`[${round}] fsc log`, () => {
    test('suites', async ({ context }) => {
      const isLegacyRound = legacyRounds.includes(round)

      const page = await context.newPage()

      await page.goto(getFSCLogUrl(round), { waitUntil: 'commit' })

      await test.step('has title', async () => {
        const websiteName = siteList[round as keyof typeof siteList]?.name
        const title = `${isLegacyRound ? '舉報違規紀錄' : '金管會執行紀錄'} - ${websiteName}`

        await expect(page).toHaveTitle(title)
      })

      await test.step('has content', async () => {
        const element = page.locator('.round-block-title')

        if (isLegacyRound) {
          await expect(element).toHaveText('舉報違規與金管會處理紀錄')
        } else {
          await expect(element).toHaveText('金管會執行紀錄')
        }

        await expect(element).toBeVisible()

        const reminder = page.getByText('最新賽季會顯示所有資料，其他賽季僅會顯示該賽季資料')
        await expect(reminder).toBeVisible()
      })
    })
  })
}
