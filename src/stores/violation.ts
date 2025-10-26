import type { z } from 'astro/zod'
import type { listItemSchema } from '@/services/dbViolationCases'
import { computed } from 'nanostores'
import { items as baseItems } from './pagination'

type Data = Array<z.infer<typeof listItemSchema>>

export const STORE_KEY = 'violation'

export const items = computed(baseItems, (item) => {
  return (item[STORE_KEY] ?? []) as Data
})

export function setItems(data: Data) {
  baseItems.setKey(STORE_KEY, data)
}
