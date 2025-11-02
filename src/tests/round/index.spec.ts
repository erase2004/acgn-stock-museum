import { test, expect } from '@playwright/test'
import { rounds, siteList } from '@/configs/sites'
import { getRoundMainPageUrl } from '@/libs/routes'
import { getConnection } from '@/tests/_utils/database'
import { formatDateTimeText } from '@/libs/timeFormat'
import { getCurrentRound } from '@/services/dbRound'

for (const round of rounds) {
  test.describe(`[${round}] homepage`, () => {
    test('suites', async ({ context }) => {
      const page = await context.newPage()

      await page.goto(getRoundMainPageUrl(round))

      await test.step('has title', async () => {
        const title = siteList[round as keyof typeof siteList]?.name

        await expect(page).toHaveTitle(title)
      })

      await test.step('has round info', async () => {
        const connection = getConnection(round)
        const roundData = await getCurrentRound(connection)

        const element = await page.getByText('當前賽季起訖時間')
        await expect(element).toHaveCount(1)

        const sibling = element.locator('//following-sibling::*')
        await expect(sibling).toContainText(formatDateTimeText(roundData?.beginDate))
        await expect(sibling).toContainText(formatDateTimeText(roundData?.endDate))
      })
    })
  })
}
