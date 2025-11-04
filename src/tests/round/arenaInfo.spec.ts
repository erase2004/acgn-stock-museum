import type { z } from 'astro/zod'
import { test, expect } from '@playwright/test'
import { rounds, siteList } from '@/configs/sites'
import { getArenaInfoUrl } from '@/libs/routes'
import { getConnection } from '@/tests/_utils/database'
import { getAllArenas, schema } from '@/services/dbArena'
import { formatDateTimeText } from '@/libs/timeFormat'

type Arena = Pick<z.infer<typeof schema>, '_id' | 'beginDate' | 'endDate'>

for (const round of rounds) {
  test.describe(`[${round}] arena info`, () => {
    let arenas: Arena[] = []

    test.beforeAll(async () => {
      const connection = getConnection(round)
      arenas = (await getAllArenas(connection)) ?? []
    })

    test('pages', async ({ context }) => {
      const page = await context.newPage()

      for (const arena of arenas) {
        const navbarResponsePromise = page.waitForResponse(
          (response) =>
            response.url().includes('SeasonNavbar') &&
            response.request().method() === 'GET' &&
            response.status() === 200,
        )

        await page.goto(getArenaInfoUrl(round, arena._id))

        await test.step('has title', async () => {
          const websiteName = siteList[round as keyof typeof siteList]?.name
          const title = `最萌亂鬥大賽 - ${websiteName}`

          await expect(page).toHaveTitle(title)
        })

        await test.step('has content', async () => {
          // h1 heading
          {
            const element = await page.locator('.round-block-title')

            await expect(element).toContainText('最萌亂鬥大賽')
            await expect(element).toBeVisible()
          }

          // duration info
          {
            // 等待 island component 載入
            await navbarResponsePromise

            const element = await page.getByText(formatDateTimeText(arena.beginDate))

            await expect(element).toHaveCount(1)
            await expect(element).toBeVisible()

            const sibling = element.locator('//following-sibling::*')

            await expect(sibling).toHaveText(formatDateTimeText(arena.endDate))
          }
        })
      }
    })
  })
}
