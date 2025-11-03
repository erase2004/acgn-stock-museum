import type { z } from 'astro/zod'
import { test, expect } from '@playwright/test'
import { rounds, siteList } from '@/configs/sites'
import { getViolationCaseUrl } from '@/libs/routes'
import { getConnection } from '@/tests/_utils/database'
import { getAllBasicViolationCase, schema } from '@/services/dbViolationCases'
import { shuffle } from 'lodash-es'

const MAX_ITEM_PERCENTAGE = 10
const RUN_ALL_TEST = process.env.RUN_ALL_TEST === 'true'

type Violation = Pick<z.infer<typeof schema>, '_id'>

for (const round of rounds) {
  test.describe(`[${round}] violation case`, () => {
    let violationCases: Violation[] = []

    test.beforeAll(async () => {
      const connection = getConnection(round)
      const results = (await getAllBasicViolationCase(connection)) ?? []
      if (RUN_ALL_TEST) {
        violationCases = results
      } else {
        violationCases = shuffle(results).slice(
          0,
          Math.floor((results.length * MAX_ITEM_PERCENTAGE) / 100),
        )
      }
    })

    test('pages', async ({ context }) => {
      test.setTimeout(500 * violationCases.length)

      const page = await context.newPage()

      for (const violationCase of violationCases) {
        const response = await page.goto(getViolationCaseUrl(round, violationCase._id))

        await test.step('has cache control header', async () => {
          const headers = response?.headers()
          const cacheControlHeader = headers?.['cache-control']

          expect(headers).toHaveProperty('cache-control')
          expect(cacheControlHeader).toContain('public')
          expect(cacheControlHeader).toContain(`max-age`)
        })

        await test.step('has title', async () => {
          const websiteName = siteList[round as keyof typeof siteList]?.name
          const title = `違規案件內容 - ${websiteName}`

          await expect(page).toHaveTitle(title)
        })

        await test.step('has content', async () => {
          // h1 heading
          {
            const element = await page.locator('.round-block-title')

            await expect(element).toContainText('違規案件內容')
            await expect(element).toBeVisible()
          }
          // case ID info
          {
            const element = await page.locator('div[data-case-id]')

            await expect(element).toContainText(new RegExp(`案件識別碼：.*${violationCase._id}`))
            await expect(element).toBeVisible()
          }
        })
      }
    })
  })
}
