import { test, expect } from '@playwright/test'
import { rounds, siteList } from '@/configs/sites'
import { getFSCStockUrl } from '@/libs/routes'

test('has title', async ({ context }) => {
  const tasks = rounds.map(async (round) => {
    const websiteName = siteList[round as keyof typeof siteList]?.name
    const title = `金管會持股 - ${websiteName}`

    const page = await context.newPage()
    await page.goto(getFSCStockUrl(round))
    await expect(page).toHaveTitle(title)
  })

  await Promise.all(tasks)
})

test('has content', async ({ context }) => {
  const tasks = rounds.map(async (round) => {
    const page = await context.newPage()
    await page.goto(getFSCStockUrl(round))

    const element = await page.locator('h1', {
      hasText: '金管會持股',
    })
    await expect(element).toBeVisible()
  })

  await Promise.all(tasks)
})
