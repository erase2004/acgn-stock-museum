import type { z } from 'astro/zod'
import { test, expect } from '@playwright/test'
import { rounds, siteList } from '@/configs/sites'
import { getProductCenterByCompanyUrl } from '@/libs/routes'
import { getConnection } from '@/tests/_utils/database'
import { getAllArchivedCompanies, schema } from '@/services/dbCompanyArchive'
import { shuffle } from 'lodash-es'

const MAX_ITEM_PERCENTAGE = 10
const RUN_ALL_TEST = process.env.RUN_ALL_TEST === 'true'

type Company = Pick<z.infer<typeof schema>, '_id' | 'companyName'>

for (const round of rounds) {
  test.describe(`[${round}] product center by company`, () => {
    let companies: Company[] = []

    test.beforeAll(async () => {
      const connection = getConnection(round)
      const results = (await getAllArchivedCompanies(connection)) ?? []
      if (RUN_ALL_TEST) {
        companies = results
      } else {
        const amount = Math.max(
          Math.floor((results.length * MAX_ITEM_PERCENTAGE) / 100),
          MAX_ITEM_PERCENTAGE,
        )
        companies = shuffle(results).slice(0, amount)
      }
    })

    test('pages', async ({ context }) => {
      test.setTimeout(1500 * companies.length)

      const page = await context.newPage()

      for (const company of companies) {
        const h2ResponsePromise = page.waitForResponse(
          (response) =>
            response.url().includes('CompanyLink') &&
            response.request().method() === 'GET' &&
            response.status() === 200,
        )

        await page.goto(getProductCenterByCompanyUrl(round, company._id))

        await test.step('has title', async () => {
          const websiteName = siteList[round as keyof typeof siteList]?.name
          const title = `${company.companyName} - 產品中心 - ${websiteName}`

          await expect(page).toHaveTitle(title)
        })

        await test.step('has content', async () => {
          // h1 heading
          {
            const element = await page.locator('.round-block-title')

            await expect(element).toHaveText('產品中心')
            await expect(element).toBeVisible()
          }

          // h2 heading
          {
            // 等待 island component 載入
            await h2ResponsePromise

            const element = await page.locator('h2')
            await expect(element).toContainText(company.companyName)
          }
        })
      }
    })
  })
}
