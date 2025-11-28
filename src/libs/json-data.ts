import { BUILD_ID } from 'astro:env/client'

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

export function getArenaLogJsonUrl(round: string, arenaId: string) {
  return `/${round}/json/arenaInfo/${arenaId}.js?v=${BUILD_ID}`
}

export function getFSCLogJsonUrl(round: string) {
  return `/${round}/json/fsc-logs-data.js?v=${BUILD_ID}`
}

export function getCompanyListJsonUrl(round: string) {
  return `/${round}/json/company-list-data.js?v=${BUILD_ID}`
}
