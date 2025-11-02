import { test, expect } from '@playwright/test'
import { rounds, siteList } from '@/configs/sites'
import { getRoundMainPageUrl } from '@/libs/routes'

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
    const page = await context.newPage()
    await page.goto(getRoundMainPageUrl(round))

    const element = await page.getByText('當前賽季起訖時間')
    await expect(element).toHaveCount(1)

    const sibling = element.locator('//following-sibling::*')
    await expect(sibling).toContainText(/\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}/)
  })

  await Promise.all(tasks)
})
