import { test, expect } from '@playwright/test'
import { rounds, siteList } from '@/configs/sites'
import { getAccountUrl } from '@/libs/routes'
import { getConnection } from '@/tests/_utils/database'
import { getAllBasicUsers } from '@/services/dbUsers'
import { shuffle } from 'lodash-es'
import { MINIMUM_TEST_TIMEOUT } from '@/configs/general'

const MAX_ITEM_PERCENTAGE = 10
const RUN_ALL_TEST = process.env.RUN_ALL_TEST === 'true'

type User = NonNullable<Awaited<ReturnType<typeof getAllBasicUsers>>>[number]

for (const round of rounds) {
  test.describe(`[${round}] account info`, () => {
    let users: User[] = []

    test.beforeAll(async () => {
      const connection = getConnection(round)
      const results = (await getAllBasicUsers(connection)) ?? []
      if (RUN_ALL_TEST) {
        users = results
      } else {
        const amount = Math.max(
          Math.floor((results.length * MAX_ITEM_PERCENTAGE) / 100),
          MAX_ITEM_PERCENTAGE,
        )
        users = shuffle(results).slice(0, amount)
      }
    })

    test('pages', async ({ context }) => {
      test.setTimeout(Math.max(1000 * users.length, MINIMUM_TEST_TIMEOUT))

      const page = await context.newPage()

      for (const user of users) {
        await page.goto(getAccountUrl(round, user._id))

        await test.step('has title', async () => {
          const websiteName = siteList[round as keyof typeof siteList]?.name
          const title = `${user.profile.name} - 帳號資訊 - ${websiteName}`

          await expect(page).toHaveTitle(title)
        })

        await test.step('has content', async () => {
          // h1 heading
          {
            const element = await page.locator('.round-block-title')

            await expect(element).toContainText(user.profile.name)
            await expect(element).toBeVisible()
          }
          // user ID info
          {
            const element = await page.getByText(`使用者識別碼：${user._id}`)
            await expect(element).toBeVisible()
          }
        })
      }
    })
  })
}
