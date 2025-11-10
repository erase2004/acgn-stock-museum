import type { z } from 'astro/zod'
import { test, expect } from '@playwright/test'
import { rounds, siteList } from '@/configs/sites'
import { getAnnouncementUrl } from '@/libs/routes'
import { getConnection } from '@/tests/_utils/database'
import { getAllBasicAnnouncements, schema } from '@/services/dbAnnouncements'
import { shuffle } from 'lodash-es'
import { MINIMUM_TEST_TIMEOUT } from '@/configs/general'

const MAX_ITEM_PERCENTAGE = 30
const RUN_ALL_TEST = process.env.RUN_ALL_TEST === 'true'

type Announcement = Pick<z.infer<typeof schema>, '_id' | 'subject'>

for (const round of rounds) {
  test.describe(`[${round}] announcement`, () => {
    let announcements: Announcement[] = []

    test.beforeAll(async () => {
      const connection = getConnection(round)
      const results = (await getAllBasicAnnouncements(connection)) ?? []
      if (RUN_ALL_TEST) {
        announcements = results
      } else {
        const amount = Math.max(
          Math.floor((results.length * MAX_ITEM_PERCENTAGE) / 100),
          MAX_ITEM_PERCENTAGE,
        )
        announcements = shuffle(results).slice(0, amount)
      }
    })

    test('pages', async ({ context }) => {
      test.setTimeout(Math.max(1000 * announcements.length, MINIMUM_TEST_TIMEOUT))

      const page = await context.newPage()

      for (const announcement of announcements) {
        await page.goto(getAnnouncementUrl(round, announcement._id), { waitUntil: 'commit' })

        await test.step('has title', async () => {
          const websiteName = siteList[round as keyof typeof siteList]?.name
          const title = `${announcement.subject} - 公告內容 - ${websiteName}`

          await expect(page).toHaveTitle(title)
        })

        await test.step('has content', async () => {
          // h2 heading
          {
            const element = page.locator('.round-block-title')
            const siblings = element.locator('//following-sibling::h2')

            await expect(siblings.first()).toContainText(announcement.subject)
            await expect(siblings.first()).toBeVisible()
          }
        })
      }
    })
  })
}
