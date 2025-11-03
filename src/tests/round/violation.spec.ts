import type { z } from 'astro/zod'
import { test, expect } from '@playwright/test'
import { rounds, siteList } from '@/configs/sites'
import { getViolationCaseUrl } from '@/libs/routes'
import { getConnection } from '@/tests/_utils/database'
import { getAllBasicViolationCase, schema } from '@/services/dbViolationCases'

type Violation = Pick<z.infer<typeof schema>, '_id'>

for (const round of rounds) {
  test.describe(`[${round}] violation case`, () => {
    let violationCases: Violation[] = []

    test.beforeAll(async () => {
      const connection = getConnection(round)
      violationCases = (await getAllBasicViolationCase(connection)) ?? []
    })

    test('pages', async ({ context }) => {
      test.setTimeout(300 * violationCases.length)

      const page = await context.newPage()

      for (const violationCase of violationCases) {
        await page.goto(getViolationCaseUrl(round, violationCase._id))

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
