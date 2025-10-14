import { z } from 'astro/zod'
import { checkIsValidRound } from '@/libs/routes'
import { URL } from 'node:url'

export const schemaRound = z.string().refine((val) => checkIsValidRound(val))

export const badRequest = new Response(null, {
  status: 400,
})

export const internalServerError = new Response(null, {
  status: 500,
})

export function getQuery(request: Request) {
  const url = URL.parse(request.url)

  if (url === null) return {}

  const searchParams = url.searchParams
  return Object.fromEntries(searchParams.entries())
}

export function createJSONResponse(data: any) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=604800',
    },
  })
}
