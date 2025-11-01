import { test, expect } from '@playwright/test'
import { rounds, siteList } from '@/configs/sites'

test('has title', async ({ context }) => {
  const tasks = rounds.map(async (round) => {
    const title = siteList[round as keyof typeof siteList]?.name

    const page = await context.newPage()
    await page.goto(`/${round}/`)
    await expect(page).toHaveTitle(title)
  })

  await Promise.all(tasks)
})
