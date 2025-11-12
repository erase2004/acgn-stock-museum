import type { z } from 'astro/zod'
import { test, expect } from '@playwright/test'
import { rounds, siteList } from '@/configs/sites'
import { getCompanyUrl } from '@/libs/routes'
import { getConnection } from '@/tests/_utils/database'
import { getAllBasicCompanies, schema } from '@/services/dbCompanies'
import { shuffle } from 'lodash-es'
import { MINIMUM_TEST_TIMEOUT } from '@/configs/general'

const MAX_ITEM_PERCENTAGE = 10
const RUN_ALL_TEST = process.env.RUN_ALL_TEST === 'true'

type Company = Pick<z.infer<typeof schema>, '_id' | 'companyName' | 'isSeal'>

for (const round of rounds) {
  test.describe(`[${round}] company detail page`, () => {
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
        await page.goto(getCompanyUrl(round, company._id), {
          waitUntil: 'commit',
        })

        await test.step('has title', async () => {
          const websiteName = siteList[round as keyof typeof siteList]?.name
          const title = `${company.companyName} - 公司資訊 - ${websiteName}`

          await expect(page).toHaveTitle(title)
        })

        await test.step('has content', async () => {
          {
            if (company.isSeal) {
              // 被查封的公司
              const element = page.getByText('該公司已被金融管理委員會查封！')

              await expect(element).toBeVisible()
            } else {
              // h1 heading
              const element = page.locator('.round-block-title')
              await expect(element).toContainText(company.companyName)
              await expect(element).toBeVisible()
            }
          }
        })
      }
    })
  })
}
