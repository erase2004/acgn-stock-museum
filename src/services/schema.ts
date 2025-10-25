import { z, type ZodTypeAny } from 'astro/zod'

export const objectId = z.coerce.string()

export const itemId = z.string()

export const integer = z.number().int()

export const datetime = z.coerce.date()

export function withCountSchema<T extends ZodTypeAny>(dataSchema: T) {
  return z
    .object({
      total: z
        .object({
          total: integer,
        })
        .array()
        .max(1),
      data: z.array(dataSchema),
    })
    .array()
}
