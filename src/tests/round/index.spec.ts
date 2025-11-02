import { test, expect } from '@playwright/test'
import { rounds, siteList } from '@/configs/sites'
import { getRoundMainPageUrl } from '@/libs/routes'
import { getConnection } from '@/tests/_utils/database'
import { formatDateTimeText } from '@/libs/timeFormat'
import { getCurrentRound } from '@/services/dbRound'

test('has title', async ({ context }) => {
  const tasks = rounds.map(async (round) => {
    const title = siteList[round as keyof typeof siteList]?.name

    const page = await context.newPage()
    await page.goto(getRoundMainPageUrl(round))
    await expect(page).toHaveTitle(title)
  })

  await Promise.all(tasks)
})

test('has round info', async ({ context }) => {
  const tasks = rounds.map(async (round) => {
    const connection = getConnection(round)
    const roundData = await getCurrentRound(connection)

    const page = await context.newPage()
    await page.goto(getRoundMainPageUrl(round))

    const element = await page.getByText('當前賽季起訖時間')
    await expect(element).toHaveCount(1)

    const sibling = element.locator('//following-sibling::*')
    await expect(sibling).toContainText(formatDateTimeText(roundData?.beginDate))
    await expect(sibling).toContainText(formatDateTimeText(roundData?.endDate))
  })

  await Promise.all(tasks)
})
