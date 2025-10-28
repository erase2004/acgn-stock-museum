import type { z } from 'astro/zod'
import type { listItemSchema } from '@/services/dbCompanies'
import { atom } from 'nanostores'
import { computed } from 'nanostores'
import { items as baseItems } from './pagination'
import { dataStoreKey } from '@/configs/general'

export type ListMode = 'card' | 'table'

export const listViewMode = atom<ListMode>('card')

export type ListItem = z.infer<typeof listItemSchema> & { employeeCount: number; eps: string }

export const LIST_STORE_KEY = dataStoreKey.companies

export const items = computed(baseItems, (item) => {
  return (item[LIST_STORE_KEY] ?? []) as ListItem[]
})

export function setItems(data: ListItem[]) {
  baseItems.setKey(LIST_STORE_KEY, data)
}
