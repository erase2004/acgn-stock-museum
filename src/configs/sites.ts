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
  round34: {
    year: 2026,
    title: '(22) 2025/12/28 ~ 2026/03/29',
    name: `(22) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-34',
  },
  round33: {
    year: 2025,
    title: '(21) 2025/09/28 ~ 2025/12/28',
    name: `(21) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-33',
  },
  round32: {
    year: 2025,
    title: '(20) 2025/06/29 ~ 2025/09/28',
    name: `(20) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-32',
  },
  round31: {
    year: 2025,
    title: '(1F) 2025/03/30 ~ 2025/06/29',
    name: `(1F) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-31',
  },
  round30: {
    year: 2025,
    title: '(1E) 2024/12/29 ~ 2025/03/30',
    name: `(1E) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-30',
  },
  round29: {
    year: 2024,
    title: '(1D) 2024/09/29 ~ 2024/12/29',
    name: `(1D) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-29',
  },
  round28: {
    year: 2024,
    title: '(1C) 2024/06/30 ~ 2024/09/29',
    name: `(1C) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-28',
  },
  round27: {
    year: 2024,
    title: '(1B) 2024/03/31 ~ 2024/06/30',
    name: `(1B) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-27',
  },
  round26: {
    year: 2024,
    title: '(1A) 2023/12/31 ~ 2024/03/31',
    name: `(1A) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-26',
  },
  round25: {
    year: 2023,
    title: '(19) 2023/10/01 ~ 2023/12/31',
    name: `(19) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-25',
  },
  round24: {
    year: 2023,
    title: '(18) 2023/07/02 ~ 2023/10/01',
    name: `(18) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-24',
  },
  round23: {
    year: 2023,
    title: '(17) 2023/04/02 ~ 2023/07/02',
    name: `(17) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-23',
  },
  round22: {
    year: 2023,
    title: '(16) 2023/01/01 ~ 2023/04/02',
    name: `(16) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-22',
  },
  round21: {
    year: 2022,
    title: '(15) 2022/10/02 ~ 2023/01/01',
    name: `(15) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-21',
  },
  round20: {
    year: 2022,
    title: '(14) 2022/07/03 ~ 2022/10/02',
    name: `(14) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-20',
  },
  round19: {
    year: 2022,
    title: '(13) 2022/04/03 ~ 2022/07/03',
    name: `(13) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-19',
  },
  round18: {
    year: 2022,
    title: '(12) 2022/01/02 ~ 2022/04/03',
    name: `(12) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-18',
  },
  round17: {
    year: 2021,
    title: '(11) 2021/10/03 ~ 2022/01/02',
    name: `(11) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-17',
  },
  round16: {
    year: 2021,
    title: '(10) 2021/07/04 ~ 2021/10/03',
    name: `(10) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-16',
  },
  round15: {
    year: 2021,
    title: '(0F) 2021/04/04 ~ 2021/07/04',
    name: `(0F) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-15',
  },
  round14: {
    year: 2021,
    title: '(0E) 2021/01/03 ~ 2021/04/04',
    name: `(0E) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-14',
  },
  round13: {
    year: 2020,
    title: '(0D) 2020/10/04 ~ 2021/01/03',
    name: `(0D) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-13',
  },
  round12: {
    year: 2020,
    title: '(0C) 2020/07/05 ~ 2020/10/04 (資料遺失)',
    name: `(0C) ${defaultWebsiteName}`,
    disabled: true,
  },
  round11: {
    year: 2020,
    title: '(0B) 2020/04/05 ~ 2020/07/05',
    name: `(0B) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-11',
  },
  round10: {
    year: 2020,
    title: '(0A) 2020/01/05 ~ 2020/04/05',
    name: `(0A) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-10',
  },
  round9: {
    year: 2019,
    title: '(09) 2019/10/06 ~ 2020/01/05',
    name: `(09) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-9',
  },
  round8: {
    year: 2019,
    title: '(08) 2019/07/07 ~ 2019/10/06',
    name: `(08) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-8',
  },
  round7: {
    year: 2019,
    title: '(07) 2019/04/07 ~ 2019/07/07',
    name: `(07) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-7',
  },
  round6: {
    year: 2019,
    title: '(06) 2019/01/06 ~ 2019/04/07',
    name: `(06) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-6',
  },
  round5: {
    year: 2018,
    title: '(05) 2018/10/07 ~ 2019/01/06',
    name: `(05) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-5',
  },
  round4: {
    year: 2018,
    title: '(04) 2018/07/08 ~ 2018/10/07',
    name: `(04) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-4',
  },
  round3: {
    year: 2018,
    title: '(03) 2018/04/08 ~ 2018/07/08',
    name: `(03) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-3',
  },
  round2: {
    year: 2018,
    title: '(02) 2018/01/07 ~ 2018/04/08',
    name: `(02) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-2',
  },
  round1: {
    year: 2017,
    title: '(01) 2017/09/15 ~ 2017/12/31',
    name: `(01) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-1',
  },
} satisfies Record<RoundKey, Round>

export const rounds = range(1, Object.keys(siteList).length + 1)
  .map<RoundKey>((n) => `round${n}`)
  .filter((key) => key in siteList && siteList[key as keyof typeof siteList].disabled !== true)

export const roundDefaultDescription = '｜ 尋找你的老婆！ \n｜ 喜歡嗎？那麼就入股吧！'

export const mediaBasePath = '/src/assets/media'

/** 問題回報連結 */
export const feedbackUrl = 'https://github.com/erase2004/acgn-stock-museum/issues'

/** 第一代股市連結 */
export const firstGenStockMarketUrl = 'https://acgn-stock.com'

/** 第二代股市連結 */
export const secondGenStockMarketUrl = 'https://acgnstock.app'

/** 第五季之前沒有產品補貨的設定 */
export const noProductReplenishRounds: string[] = [
  'round1',
  'round2',
  'round3',
  'round4',
] satisfies RoundKey[]

/** 第四季之前，財富稅還沒拆分成股票資產稅和現金資產稅 */
export const beforeTaxSeperatedRounds: string[] = [
  'round1',
  'round2',
  'round3',
] satisfies RoundKey[]

/** 第三季以前，還沒有獨立的系統公告、違規案件列表 */
export const legacyRounds: string[] = ['round1', 'round2'] satisfies RoundKey[]

export const FIRST_ROUND: string = 'round1' satisfies RoundKey
