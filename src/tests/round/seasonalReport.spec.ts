import type { z } from 'astro/zod'
import { test, expect } from '@playwright/test'
import { rounds, siteList } from '@/configs/sites'
import { getSeasonalReportUrl } from '@/libs/routes'
import { getAllSeasons, schema } from '@/services/dbSeason'
import { getConnection } from '@/tests/_utils/database'
import { formatDateTimeText } from '@/libs/timeFormat'

type Season = Pick<z.infer<typeof schema>, '_id' | 'beginDate' | 'endDate'>

for (const round of rounds) {
  test.describe(`[${round}] seasonal report`, () => {
    let seasons: Season[] = []

    test.beforeAll(async () => {
      const connection = getConnection(round)
      seasons = (await getAllSeasons(connection)) ?? []
    })

    test('pages', async ({ context }) => {
      const page = await context.newPage()

      for (const season of seasons) {
        // FIXME: this is a workaround to clear browser cache
        await page.route('*', async (route) => route.continue())

        const navbarResponsePromise = page.waitForResponse(
          (response) =>
            response.url().includes('SeasonNavbar') &&
            response.request().method() === 'GET' &&
            response.status() === 200,
        )

        await page.goto(getSeasonalReportUrl(round, season._id), { waitUntil: 'commit' })

        await test.step('has title', async () => {
          const websiteName = siteList[round as keyof typeof siteList]?.name
          const title = `季度報告 - ${websiteName}`

          await expect(page).toHaveTitle(title)
        })

        await test.step('has content', async () => {
          // h1 heading
          {
            const element = page.locator('.round-block-title')

            await expect(element).toHaveText('季度報告')
            await expect(element).toBeVisible()
          }

          // duration info
          {
            // 等待 island component 載入
            await navbarResponsePromise

            const element = page.getByText(formatDateTimeText(season.beginDate))

            await expect(element).toHaveCount(1)
            await expect(element).toBeVisible()

            const sibling = element.locator('//following-sibling::*')

            await expect(sibling).toHaveText(formatDateTimeText(season.endDate))
          }
        })
      }
    })
  })
}
