import { test, expect } from '@playwright/test'
import { rounds, siteList } from '@/configs/sites'
import { getRuleAgendaListUrl } from '@/libs/routes'

test('has title', async ({ context }) => {
  const tasks = rounds.map(async (round) => {
    const websiteName = siteList[round as keyof typeof siteList]?.name
    const title = `規則討論 - ${websiteName}`

    const page = await context.newPage()
    await page.goto(getRuleAgendaListUrl(round))
    await expect(page).toHaveTitle(title)
  })

  await Promise.all(tasks)
})

test('has content', async ({ context }) => {
  const tasks = rounds.map(async (round) => {
    const page = await context.newPage()
    await page.goto(getRuleAgendaListUrl(round))

    const element = await page.locator('h1', {
      hasText: '規則討論',
    })
    await expect(element).toBeVisible()
  })

  await Promise.all(tasks)
})
