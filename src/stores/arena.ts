import { schema } from '@/services/dbArenaFighters'
import type { z } from 'astro/zod'
import { atom } from 'nanostores'

type Fighter = z.infer<typeof schema>

export const fighters = atom<Fighter[]>([])
