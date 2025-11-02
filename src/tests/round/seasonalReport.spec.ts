import { test, expect } from '@playwright/test'
import { rounds, siteList } from '@/configs/sites'
import { getSeasonalReportUrl } from '@/libs/routes'
import { getAllSeasons } from '@/services/dbSeason'
import { getConnection } from '@/tests/_utils/database'

test('has title', async ({ context }) => {
  test.setTimeout(1000 * 60 * 2)

  const tasks = rounds.map(async (round) => {
    const connection = getConnection(round)
    const seasons = (await getAllSeasons(connection)) ?? []

    const websiteName = siteList[round as keyof typeof siteList]?.name
    const title = `季度報告 - ${websiteName}`

    return Promise.all(
      seasons.map(async (season) => {
        const page = await context.newPage()

        await page.goto(getSeasonalReportUrl(round, season._id))
        await expect(page).toHaveTitle(title)
      }),
    )
  })

  await Promise.all(tasks)
})

test('has content', async ({ context }) => {
  test.setTimeout(1000 * 60 * 2)

  const tasks = rounds.map(async (round) => {
    const connection = getConnection(round)
    const seasons = (await getAllSeasons(connection)) ?? []

    return Promise.all(
      seasons.map(async (season) => {
        const page = await context.newPage()

        await page.goto(getSeasonalReportUrl(round, season._id))
        const element = await page.locator('h1', {
          hasText: '季度報告',
        })
        await expect(element).toBeVisible()
      }),
    )
  })

  await Promise.allSettled(tasks)
})
