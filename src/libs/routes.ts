import type { AstroGlobal } from 'astro'
import { defaultWebsiteName, siteList } from '@/configs/sites'

const KEY_MAIN_PAGE = 'mainPage'

const pageNameHash: Record<string, string> = {
  [KEY_MAIN_PAGE]: '首頁',
  announcementList: '系統公告',
  announcementDetail: '系統公告',
  tutorial: '遊戲規則',
  companyList: '股市總覽',
  companyDetail: '公司資訊',
  advertising: '廣告宣傳',
  productCenterBySeason: '產品中心',
  productCenterByCompany: '產品中心',
  arenaInfo: '最萌亂鬥大賽',
  seasonalReport: '季度報告',
  accountInfo: '帳號資訊',
  ruleAgendaList: '規則討論',
  ruleAgendaDetail: '議程資訊',
  violationCaseList: '違規案件列表',
  violationCaseDetail: '違規案件內容',
  fscLogs: '金管會執行紀錄',
  fscStock: '金管會持股',
}

export function getCurrentPage(astro: AstroGlobal) {
  const paths = astro.url.pathname.split('/')

  const currentPage = paths[paths.length - 1]

  if (currentPage === '') return KEY_MAIN_PAGE
  else return currentPage
}

export function getCurrentRound(astro: AstroGlobal) {
  const paths = /^\/(round\d+)\//.exec(astro.url.pathname)

  if (paths === null) return null
  else return paths[1]
}

export function getWebsiteName(astro: AstroGlobal) {
  const round = getCurrentRound(astro)

  if (typeof round === 'string') {
    if (round in siteList) {
      return siteList[round as keyof typeof siteList].name
    }
  }

  return defaultWebsiteName
}

export function getPageTitle(pageName: string) {
  return pageNameHash[pageName]
}

export function getCurrentPageTitle(astro: AstroGlobal) {
  return getPageTitle(getCurrentPage(astro))
}

export function getCurrentPageFullTitle(astro: AstroGlobal, detailName?: string) {
  const websiteName = getWebsiteName(astro)

  if (getCurrentPage(astro) === KEY_MAIN_PAGE) {
    return websiteName
  }

  let title = `${getCurrentPageTitle(astro)} - ${websiteName}`
  if (detailName) {
    title = `${detailName} - ${title}`
  }

  return title
}
