import type { z } from 'astro/zod'
import { test, expect } from '@playwright/test'
import { rounds, siteList } from '@/configs/sites'
import { getRuleAgendaUrl } from '@/libs/routes'
import { getAllBasicRuleAgendas, schema } from '@/services/dbRuleAgendas'
import { getConnection } from '@/tests/_utils/database'

type Agenda = Pick<z.infer<typeof schema>, '_id' | 'title'>

for (const round of rounds) {
  test.describe(`[${round}] rule discussion`, () => {
    let agendas: Agenda[] = []

    test.beforeAll(async () => {
      const connection = getConnection(round)
      agendas = (await getAllBasicRuleAgendas(connection)) ?? []
    })

    test('pages', async ({ context }) => {
      test.setTimeout(1000 * 60 * 5)

      const page = await context.newPage()

      for (const agenda of agendas) {
        await page.goto(getRuleAgendaUrl(round, agenda._id))

        await test.step('has title', async () => {
          const websiteName = siteList[round as keyof typeof siteList]?.name
          const title = `${agenda.title} - 議程資訊 - ${websiteName}`

          await expect(page).toHaveTitle(title)
        })

        await test.step('has content', async () => {
          const element = await page.locator('.round-block-title')

          await expect(element).toHaveText(agenda.title)
          await expect(element).toBeVisible()
        })
      }
    })
  })
}
