import { range } from 'lodash-es'

export const defaultWebsiteName = 'ACGN 股票歷史博物館'

export const siteUrl = 'https://museum.acgn-stock.com'

type RoundKey = `round${number}`

type Round = {
  name: string
  disabled: boolean
  dbname?: string
}

export const siteList = {
  round32: {
    name: `(Θ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-32',
  },
  round31: {
    name: `(Η) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-31',
  },
  round30: {
    name: `(Ζ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-30',
  },
  round29: {
    name: `(Ε) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-29',
  },
  round28: {
    name: `(Δ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-28',
  },
  round27: {
    name: `(Γ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-27',
  },
  round26: {
    name: `(Β) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-26',
  },
  round25: {
    name: `(Α) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-25',
  },
  round24: {
    name: `(ω) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-24',
  },
  round23: {
    name: `(ψ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-23',
  },
  round22: {
    name: `(χ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-22',
  },
  round21: {
    name: `(φ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-21',
  },
  round20: {
    name: `(υ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-20',
  },
  round19: {
    name: `(τ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-19',
  },
  round18: {
    name: `(σ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-18',
  },
  round17: {
    name: `(ρ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-17',
  },
  round16: {
    name: `(π) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-16',
  },
  round15: {
    name: `(ο) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-15',
  },
  round14: {
    name: `(ξ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-14',
  },
  round13: {
    name: `(ν) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-13',
  },
  round12: {
    name: `(μ) ${defaultWebsiteName}`,
    disabled: true,
  },
  round11: {
    name: `(λ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-11',
  },
  round10: {
    name: `(κ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-10',
  },
  round9: {
    name: `(ι) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-9',
  },
  round8: {
    name: `(θ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-8',
  },
  round7: {
    name: `(η) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-7',
  },
  round6: {
    name: `(ζ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-6',
  },
  round5: {
    name: `(ε) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-5',
  },
  round4: {
    name: `(δ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-4',
  },
  round3: {
    name: `(γ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-3',
  },
  round2: {
    name: `(β) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-2',
  },
  round1: {
    name: `(α) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-1',
  },
} satisfies Record<RoundKey, Round>

export const rounds = range(6, Object.keys(siteList).length + 1)
  .map<RoundKey>((n) => `round${n}`)
  .filter((key) => key in siteList && siteList[key as keyof typeof siteList].disabled !== true)

export const roundDefaultDescription = '｜ 尋找你的老婆！ \n｜ 喜歡嗎？那麼就入股吧！'
