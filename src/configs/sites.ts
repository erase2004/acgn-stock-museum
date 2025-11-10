import { range } from 'lodash-es'

export const defaultWebsiteName = 'ACGN 股市歷史博物館'

const museumBaseDomain = 'museum.acgn-stock.com'

export const siteUrl = `https://${museumBaseDomain}`

export const gtmId = 'GTM-5672XXTG'

type RoundKey = `round${number}`

export type Round = {
  year: number
  title: string
  name: string
  disabled: boolean
  dbname?: `museum-${number}`
  externalUrl?: string
}

// TODO: add new entry when round is over
export const siteList = {
  round32: {
    year: 2025,
    title: '(Θ) 2025/06/29 ~ 2025/09/28',
    name: `(Θ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-32',
  },
  round31: {
    year: 2025,
    title: '(Η) 2025/03/30 ~ 2025/06/29',
    name: `(Η) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-31',
  },
  round30: {
    year: 2025,
    title: '(Ζ) 2024/12/29 ~ 2025/03/30',
    name: `(Ζ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-30',
  },
  round29: {
    year: 2024,
    title: '(Ε) 2024/09/29 ~ 2024/12/29',
    name: `(Ε) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-29',
  },
  round28: {
    year: 2024,
    title: '(Δ) 2024/06/30 ~ 2024/09/29',
    name: `(Δ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-28',
  },
  round27: {
    year: 2024,
    title: '(Γ) 2024/03/31 ~ 2024/06/30',
    name: `(Γ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-27',
  },
  round26: {
    year: 2024,
    title: '(Β) 2023/12/31 ~ 2024/03/31',
    name: `(Β) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-26',
  },
  round25: {
    year: 2023,
    title: '(Α) 2023/10/01 ~ 2023/12/31',
    name: `(Α) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-25',
  },
  round24: {
    year: 2023,
    title: '(ω) 2023/07/02 ~ 2023/10/01',
    name: `(ω) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-24',
  },
  round23: {
    year: 2023,
    title: '(ψ) 2023/04/02 ~ 2023/07/02',
    name: `(ψ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-23',
  },
  round22: {
    year: 2023,
    title: '(χ) 2023/01/01 ~ 2023/04/02',
    name: `(χ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-22',
  },
  round21: {
    year: 2022,
    title: '(φ) 2022/10/02 ~ 2023/01/01',
    name: `(φ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-21',
  },
  round20: {
    year: 2022,
    title: '(υ) 2022/07/03 ~ 2022/10/02',
    name: `(υ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-20',
  },
  round19: {
    year: 2022,
    title: '(τ) 2022/04/03 ~ 2022/07/03',
    name: `(τ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-19',
  },
  round18: {
    year: 2022,
    title: '(σ) 2022/01/02 ~ 2022/04/03',
    name: `(σ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-18',
  },
  round17: {
    year: 2021,
    title: '(ρ) 2021/10/03 ~ 2022/01/02',
    name: `(ρ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-17',
  },
  round16: {
    year: 2021,
    title: '(π) 2021/07/04 ~ 2021/10/03',
    name: `(π) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-16',
  },
  round15: {
    year: 2021,
    title: '(ο) 2021/04/04 ~ 2021/07/04',
    name: `(ο) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-15',
  },
  round14: {
    year: 2021,
    title: '(ξ) 2021/01/03 ~ 2021/04/04',
    name: `(ξ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-14',
  },
  round13: {
    year: 2020,
    title: '(ν) 2020/10/04 ~ 2021/01/03',
    name: `(ν) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-13',
  },
  round12: {
    year: 2020,
    title: '(μ) 2020/07/05 ~ 2020/10/04 (資料遺失)',
    name: `(μ) ${defaultWebsiteName}`,
    disabled: true,
  },
  round11: {
    year: 2020,
    title: '(λ) 2020/04/05 ~ 2020/07/05',
    name: `(λ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-11',
  },
  round10: {
    year: 2020,
    title: '(κ) 2020/01/05 ~ 2020/04/05',
    name: `(κ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-10',
  },
  round9: {
    year: 2019,
    title: '(ι) 2019/10/06 ~ 2020/01/05',
    name: `(ι) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-9',
  },
  round8: {
    year: 2019,
    title: '(θ) 2019/07/07 ~ 2019/10/06',
    name: `(θ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-8',
  },
  round7: {
    year: 2019,
    title: '(η) 2019/04/07 ~ 2019/07/07',
    name: `(η) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-7',
  },
  round6: {
    year: 2019,
    title: '(ζ) 2019/01/06 ~ 2019/04/07',
    name: `(ζ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-6',
  },
  round5: {
    year: 2018,
    title: '(ε) 2018/10/07 ~ 2019/01/06',
    name: `(ε) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-5',
  },
  round4: {
    year: 2018,
    title: '(δ) 2018/07/08 ~ 2018/10/07',
    name: `(δ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-4',
    externalUrl: `https://r4-${museumBaseDomain}`,
  },
  round3: {
    year: 2018,
    title: '(γ) 2018/04/08 ~ 2018/07/08',
    name: `(γ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-3',
    externalUrl: `https://r3-${museumBaseDomain}`,
  },
  round2: {
    year: 2018,
    title: '(β) 2018/01/07 ~ 2018/04/08',
    name: `(β) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-2',
    externalUrl: `https://r2-${museumBaseDomain}`,
  },
  round1: {
    year: 2017,
    title: '(α) 2017/09/15 ~ 2017/12/31',
    name: `(α) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-1',
    externalUrl: `https://r1-${museumBaseDomain}`,
  },
} satisfies Record<RoundKey, Round>

export const rounds = range(5, Object.keys(siteList).length + 1)
  .map<RoundKey>((n) => `round${n}`)
  .filter((key) => key in siteList && siteList[key as keyof typeof siteList].disabled !== true)

export const roundDefaultDescription = '｜ 尋找你的老婆！ \n｜ 喜歡嗎？那麼就入股吧！'

export const mediaBasePath = '/src/assets/media'

export const feedbackUrl = 'https://github.com/erase2004/acgn-stock-museum/issues'

// 公司 ID 與名稱沒有綁定，需要特殊處理的賽季
export const inconsistentCompanyIdRounds: string[] = [
  'round1',
  'round2',
  'round3',
  'round4',
  'round5',
  'round6',
] satisfies RoundKey[]
