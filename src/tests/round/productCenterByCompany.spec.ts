import type { z } from 'astro/zod'
import { test, expect } from '@playwright/test'
import { rounds, siteList } from '@/configs/sites'
import { getProductCenterByCompanyUrl } from '@/libs/routes'
import { getConnection } from '@/tests/_utils/database'
import { getAllBasicCompanies, schema } from '@/services/dbCompanies'
import { shuffle } from 'lodash-es'
import { MINIMUM_TEST_TIMEOUT } from '@/configs/general'

const MAX_ITEM_PERCENTAGE = 10
const RUN_ALL_TEST = process.env.RUN_ALL_TEST === 'true'

type Company = Pick<z.infer<typeof schema>, '_id' | 'companyName'>

for (const round of rounds) {
  test.describe(`[${round}] product center by company`, () => {
    let companies: Company[] = []

    test.beforeAll(async () => {
      const connection = getConnection(round)
      const results = (await getAllBasicCompanies(connection)) ?? []
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
      test.setTimeout(Math.max(2000 * companies.length, MINIMUM_TEST_TIMEOUT))

      const page = await context.newPage()

      for (const company of companies) {
        // FIXME: this is a workaround to clear browser cache
        await page.route('*', async (route) => route.continue())

        const companyJsonPromise = page.waitForResponse(
          (response) =>
            response.url().includes('company.json') &&
            response.request().method() === 'GET' &&
            response.status() === 200,
        )

        // company json 會需要比較多的載入時間
        await page.goto(getProductCenterByCompanyUrl(round, company._id), {
          waitUntil: 'commit',
          timeout: 2000,
        })

        await test.step('has title', async () => {
          const websiteName = siteList[round as keyof typeof siteList]?.name
          const title = `${company.companyName} - 產品中心 - ${websiteName}`

          await expect(page).toHaveTitle(title)
        })

        await test.step('has content', async () => {
          // h1 heading
          {
            const element = page.locator('.round-block-title')

            await expect(element).toHaveText('產品中心')
            await expect(element).toBeVisible()
          }

          // h2 heading
          {
            // 等待 island component 載入
            await companyJsonPromise

            const element = page.locator('h2')
            await expect(element).toContainText(company.companyName)
          }
        })
      }
    })
  })
}
