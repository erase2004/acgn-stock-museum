import { test, expect } from '@playwright/test'
import { rounds, siteList } from '@/configs/sites'
import { getTutorialUrl } from '@/libs/routes'

test('has title', async ({ context }) => {
  const tasks = rounds.map(async (round) => {
    const websiteName = siteList[round as keyof typeof siteList]?.name
    const title = `遊戲規則 - ${websiteName}`

    const page = await context.newPage()
    await page.goto(getTutorialUrl(round))
    await expect(page).toHaveTitle(title)
  })

  await Promise.all(tasks)
})
