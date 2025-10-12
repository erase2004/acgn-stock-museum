import { defineMiddleware } from 'astro:middleware'
import { checkIsValidRound, getCurrentRound, getPageUrl, PAGE } from '@/libs/routes'

export const onRequest = defineMiddleware((context, next) => {
  const round = getCurrentRound(context)

  // redirect to homepage while round exists in path but not valid
  if (round !== null && checkIsValidRound(round) === false) {
    const homepage = getPageUrl({
      pageName: PAGE.MAIN,
    })
    return context.redirect(homepage)
  }

  return next()
})
