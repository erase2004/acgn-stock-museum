import { test, expect } from '@playwright/test'
import { rounds, siteList } from '@/configs/sites'
import { getViolationCaseListUrl } from '@/libs/routes'

for (const round of rounds) {
  test.describe(`[${round}] violation case list`, () => {
    test('suites', async ({ context }) => {
      const page = await context.newPage()

      await page.goto(getViolationCaseListUrl(round))

      await test.step('has title', async () => {
        const websiteName = siteList[round as keyof typeof siteList]?.name
        const title = `違規案件列表 - ${websiteName}`

        await expect(page).toHaveTitle(title)
      })

      await test.step('has content', async () => {
        const element = page.locator('.round-block-title')

        await expect(element).toHaveText('違規案件列表')
        await expect(element).toBeVisible()

        const reminder = page.getByText('最新賽季會顯示所有資料，其他賽季僅會顯示該賽季資料')
        await expect(reminder).toBeVisible()
      })
    })
  })
}
