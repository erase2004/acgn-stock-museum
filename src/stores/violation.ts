import type { z } from 'astro/zod'
import type { listItemSchema } from '@/services/dbViolationCases'
import { atom } from 'nanostores'

export const items = atom<Array<z.infer<typeof listItemSchema>>>([])
