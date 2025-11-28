import type { APIContext } from 'astro'
import { defaultWebsiteName, legacyRounds, siteList } from '@/configs/sites'
import { BUILD_ID } from 'astro:env/client'

export const PAGE = {
  MAIN: 'mainPage',
  ANNOUNCEMENT_LIST: 'announcement',
  ANNOUNCEMENT_DETAIL: 'announcement/view',
  ANNOUNCEMENT_REJECTION: 'announcement/reject',
  TUTORIAL: 'tutorial',
  COMPANY_LIST: 'company',
  COMPANY_DETAIL: 'company/detail',
  ADVERTISING: 'advertising',
  PRODUCT_CENTER_BY_SEASON: 'productCenter/season',
  PRODUCT_CENTER_BY_COMPANY: 'productCenter/company',
  ARENA_INFO: 'arenaInfo',
  SEASONAL_REPORT: 'seasonalReport',
  ACCOUNT_INFO: 'accountInfo',
  RULE_AGENDA_LIST: 'ruleDiscuss',
  RULE_AGENDA_DETAIL: 'ruleDiscuss/view',
  VIOLATION_CASE_LIST: 'violation',
  VIOLATION_CASE_DETAIL: 'violation/view',
  FSC_LOG: 'fscLogs',
  FSC_STOCK: 'fscStock',
} as const

const pageNameHash = {
  [PAGE.MAIN]: '首頁',
  [PAGE.ANNOUNCEMENT_LIST]: '系統公告',
  [PAGE.ANNOUNCEMENT_DETAIL]: '公告內容',
  [PAGE.ANNOUNCEMENT_REJECTION]: '公告否決',
  [PAGE.TUTORIAL]: '遊戲規則',
  [PAGE.COMPANY_LIST]: '股市總覽',
  [PAGE.COMPANY_DETAIL]: '公司資訊',
  [PAGE.ADVERTISING]: '廣告宣傳',
  [PAGE.PRODUCT_CENTER_BY_SEASON]: '產品中心',
  [PAGE.PRODUCT_CENTER_BY_COMPANY]: '產品中心',
  [PAGE.ARENA_INFO]: '最萌亂鬥大賽',
  [PAGE.SEASONAL_REPORT]: '季度報告',
  [PAGE.ACCOUNT_INFO]: '帳號資訊',
  [PAGE.RULE_AGENDA_LIST]: '規則討論',
  [PAGE.RULE_AGENDA_DETAIL]: '議程資訊',
  [PAGE.VIOLATION_CASE_LIST]: '違規案件列表',
  [PAGE.VIOLATION_CASE_DETAIL]: '違規案件內容',
  [PAGE.FSC_LOG]: '金管會執行紀錄',
  [PAGE.FSC_STOCK]: '金管會持股',
  // for external URL
  other: undefined,
}

const routesWithView = {
  [PAGE.RULE_AGENDA_LIST]: PAGE.RULE_AGENDA_DETAIL,
  [PAGE.VIOLATION_CASE_LIST]: PAGE.VIOLATION_CASE_DETAIL,
}

export function getCurrentPage(astro: APIContext) {
  const pathname = astro.url.pathname
  const paths = pathname.split('/').filter((ele) => ele !== '')
  const pageValues: string[] = Object.values(PAGE)

  let path =
    paths.findLast((p): p is (typeof PAGE)[keyof typeof PAGE] => pageValues.includes(p)) ??
    PAGE.MAIN

  if (path in routesWithView) {
    path = new RegExp(`/${path}/view/`).test(pathname)
      ? routesWithView[path as keyof typeof routesWithView]
      : path
  }

  if (path === PAGE.ANNOUNCEMENT_LIST) {
    path = new RegExp(`/${PAGE.ANNOUNCEMENT_LIST}/reject/`).test(pathname)
      ? PAGE.ANNOUNCEMENT_REJECTION
      : new RegExp(`/${PAGE.ANNOUNCEMENT_LIST}/view/`).test(pathname)
        ? PAGE.ANNOUNCEMENT_DETAIL
        : PAGE.ANNOUNCEMENT_LIST
  }

  if (path === PAGE.COMPANY_LIST) {
    path = new RegExp(`/${PAGE.COMPANY_LIST}/detail/`).test(pathname)
      ? PAGE.COMPANY_DETAIL
      : PAGE.COMPANY_LIST
  }

  if (new RegExp('/productCenter/season/').test(pathname)) {
    path = PAGE.PRODUCT_CENTER_BY_SEASON
  }

  if (new RegExp('/productCenter/company/').test(pathname)) {
    path = PAGE.PRODUCT_CENTER_BY_COMPANY
  }

  return path
}

export function getCurrentRound(astro: APIContext) {
  const round = astro.params['round']
  if (round) return round

  const paths = /^\/(round\d+)\/?/.exec(astro.url.pathname)

  if (paths === null) return null
  else return paths[1]
}

export function getRoundData(round: string) {
  if (checkIsValidRound(round)) {
    return siteList[round]
  }

  return null
}

export function getWebsiteName(astro: APIContext) {
  const round = getCurrentRound(astro)

  if (checkIsValidRound(round)) {
    return siteList[round].name
  }

  return defaultWebsiteName
}

export function getWebsiteTitle(astro: APIContext) {
  const round = getCurrentRound(astro)

  if (checkIsValidRound(round)) {
    return siteList[round].title
  }

  return ''
}

export function getPageTitle(pageName: string, round?: string | null) {
  if (pageName === PAGE.FSC_LOG && legacyRounds.includes(round ?? '')) {
    return '舉報違規紀錄'
  }

  return pageNameHash[pageName as keyof typeof pageNameHash]
}

export function getPageUrl({
  pageName,
  round,
  params,
}: {
  pageName: keyof typeof pageNameHash
  round?: string
  params?: string | number
}) {
  const paths: Array<string | number> = ['']

  if (checkIsValidRound(round)) paths.push(round)

  if (pageName !== PAGE.MAIN) paths.push(pageName)

  if (typeof params !== 'undefined') paths.push(params)

  paths.push('')

  return paths.join('/')
}

export function getCurrentPageFullTitle(astro: APIContext, detailName?: string) {
  const websiteName = getWebsiteName(astro)

  const page = getCurrentPage(astro)
  if (page === PAGE.MAIN) {
    return websiteName
  }

  let title = `${getPageTitle(page, getCurrentRound(astro))} - ${websiteName}`
  if (detailName) {
    title = `${detailName} - ${title}`
  }

  return title
}

export function checkIsValidRound(
  round: string | null | undefined,
): round is keyof typeof siteList {
  if (typeof round === 'string') {
    if (round in siteList) {
      return true
    }
  }

  return false
}

export function getMuseumMainPageUrl() {
  return getPageUrl({
    pageName: PAGE.MAIN,
  })
}

export function getRoundMainPageUrl(round: string) {
  return getPageUrl({
    round,
    pageName: PAGE.MAIN,
  })
}

export function getViolationCaseUrl(round: string, caseId: string) {
  return getPageUrl({
    round,
    pageName: PAGE.VIOLATION_CASE_DETAIL,
    params: caseId,
  })
}

export function getViolationCaseListUrl(round: string) {
  return getPageUrl({
    round,
    pageName: PAGE.VIOLATION_CASE_LIST,
  })
}

export function getCompanyUrl(round: string, companyId: string) {
  return getPageUrl({
    round,
    pageName: PAGE.COMPANY_DETAIL,
    params: companyId,
  })
}

export function getCompanyListUrl(round: string) {
  return getPageUrl({
    round,
    pageName: PAGE.COMPANY_LIST,
  })
}

export function getAccountUrl(round: string, userId: string) {
  return getPageUrl({
    round,
    pageName: PAGE.ACCOUNT_INFO,
    params: userId,
  })
}

export function getRuleAgendaUrl(round: string, agendaId: string) {
  return getPageUrl({
    round,
    pageName: PAGE.RULE_AGENDA_DETAIL,
    params: agendaId,
  })
}

export function getRuleAgendaListUrl(round: string) {
  return getPageUrl({
    round,
    pageName: PAGE.RULE_AGENDA_LIST,
  })
}

export function getSeasonalReportUrl(round: string, seasonId: string) {
  return getPageUrl({
    round,
    pageName: PAGE.SEASONAL_REPORT,
    params: seasonId,
  })
}

export function getAnnouncementListUrl(round: string) {
  return getPageUrl({
    round,
    pageName: PAGE.ANNOUNCEMENT_LIST,
  })
}

export function getAnnouncementUrl(round: string, announcementId: string) {
  return getPageUrl({
    round,
    pageName: PAGE.ANNOUNCEMENT_DETAIL,
    params: announcementId,
  })
}

export function getAnnouncementRejectionUrl(round: string, announcementId: string) {
  return getPageUrl({
    round,
    pageName: PAGE.ANNOUNCEMENT_REJECTION,
    params: announcementId,
  })
}

export function getProductCenterBySeasonUrl(round: string, seasonId: string) {
  return getPageUrl({
    round,
    pageName: PAGE.PRODUCT_CENTER_BY_SEASON,
    params: seasonId,
  })
}

export function getProductCenterByCompanyUrl(round: string, companyId: string) {
  return getPageUrl({
    round,
    pageName: PAGE.PRODUCT_CENTER_BY_COMPANY,
    params: companyId,
  })
}

export function getArenaInfoUrl(round: string, arenaId: string) {
  return getPageUrl({
    round,
    pageName: PAGE.ARENA_INFO,
    params: arenaId,
  })
}

export function getTutorialUrl(round: string) {
  return getPageUrl({
    round,
    pageName: PAGE.TUTORIAL,
  })
}

export function getFSCLogUrl(round: string) {
  return getPageUrl({
    round,
    pageName: PAGE.FSC_LOG,
  })
}

export function getFSCStockUrl(round: string) {
  return getPageUrl({
    round,
    pageName: PAGE.FSC_STOCK,
  })
}

export function getAdvertisingUrl(round: string) {
  return getPageUrl({
    round,
    pageName: PAGE.ADVERTISING,
  })
}

export function getUserJsonUrl(round: string) {
  return `/${round}/json/user-data.js?v=${BUILD_ID}`
}

export function getCompanyJsonUrl(round: string) {
  return `/${round}/json/company-data.js?v=${BUILD_ID}`
}

export function getProductJsonUrl(round: string) {
  return `/${round}/json/product-data.js?v=${BUILD_ID}`
}

export function getAccountLogJsonUrl(round: string, userId: string) {
  return `/${round}/json/accountInfo/${userId}.js?v=${BUILD_ID}`
}

export function getCompanyLogJsonUrl(round: string, companyId: string) {
  return `/${round}/json/company/${companyId}.js?v=${BUILD_ID}`
}
