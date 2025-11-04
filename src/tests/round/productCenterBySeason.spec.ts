import type { z } from 'astro/zod'
import { test, expect } from '@playwright/test'
import { rounds, siteList } from '@/configs/sites'
import { getProductCenterBySeasonUrl } from '@/libs/routes'
import { getConnection } from '@/tests/_utils/database'
import { getAllSeasons, schema } from '@/services/dbSeason'
import { formatDateTimeText } from '@/libs/timeFormat'

type Season = Pick<z.infer<typeof schema>, '_id' | 'beginDate' | 'endDate'>

for (const round of rounds) {
  test.describe(`[${round}] product center by season`, () => {
    let seasons: Season[] = []

    test.beforeAll(async () => {
      const connection = getConnection(round)
      seasons = (await getAllSeasons(connection)) ?? []
    })

    test('pages', async ({ context }) => {
      test.setTimeout(1000 * 60 * 5)

      const page = await context.newPage()

      for (const season of seasons) {
        const navbarResponsePromise = page.waitForResponse(
          (response) =>
            response.url().includes('SeasonNavbar') &&
            response.request().method() === 'GET' &&
            response.status() === 200,
        )

        await page.goto(getProductCenterBySeasonUrl(round, season._id))

        await test.step('has title', async () => {
          const websiteName = siteList[round as keyof typeof siteList]?.name
          const title = `產品中心 - ${websiteName}`

          await expect(page).toHaveTitle(title)
        })

        await test.step('has content', async () => {
          // h1 heading
          {
            const element = await page.locator('.round-block-title')

            await expect(element).toHaveText('產品中心')
            await expect(element).toBeVisible()
          }

          // duration info
          {
            // 等待 island component 載入
            await navbarResponsePromise

            const element = await page.getByText(formatDateTimeText(season.beginDate))

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
