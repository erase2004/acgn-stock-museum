import { defineMiddleware } from 'astro:middleware'
import { checkIsValidRound, getCurrentRound, getMuseumMainPageUrl } from '@/libs/routes'

export const onRequest = defineMiddleware((context, next) => {
  const round = getCurrentRound(context)

  // redirect to homepage while round exists in path but not valid
  if (round !== null && checkIsValidRound(round) === false) {
    return context.redirect(getMuseumMainPageUrl())
  }

  return next()
})
