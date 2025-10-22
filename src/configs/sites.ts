export const defaultWebsiteName = 'ACGN 股票歷史博物館'

type RoundKey = `round${number}`

type RoundConfig = {
  /** 廣告持續時間，單位為毫秒 */
  advertisingExpireTime: number
  /** 同時最多顯示的廣告筆數 */
  displayAdvertisingNumber: number
  /** 季度結束前多久開放設定薪資，單位為毫秒 */
  announceSalaryTime: number
  /** 公司營利的分配設定 */
  companyProfitDistribution: {
    /** 分配設定調整的封關時間 (ms) */
    lockTime: number
  }
  /** 分頁時每個分頁有多少資料 */
  dataNumberPerPage: {
    fscLogs: number
    fscStock: number
    violation: number
    violationRelatedLog: number
    announcements: number
    productCenter: number
  }
}

const BaseRoundConfig: RoundConfig = {
  advertisingExpireTime: 259200000,
  displayAdvertisingNumber: 5,
  announceSalaryTime: 259200000,
  companyProfitDistribution: {
    lockTime: 86400000,
  },
  dataNumberPerPage: {
    fscLogs: 30,
    fscStock: 20,
    violation: 10,
    violationRelatedLog: 30,
    announcements: 20,
    productCenter: 30,
  },
}

type Round = {
  name: string
  disabled: boolean
  dbname?: string
  config: RoundConfig
}

export const siteList = {
  round32: {
    name: `(Θ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-32',
    config: BaseRoundConfig,
  },
  round31: {
    name: `(Η) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-31',
    config: BaseRoundConfig,
  },
  round30: {
    name: `(Ζ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-30',
    config: BaseRoundConfig,
  },
  round29: {
    name: `(Ε) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-29',
    config: BaseRoundConfig,
  },
  round28: {
    name: `(Δ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-28',
    config: BaseRoundConfig,
  },
  round27: {
    name: `(Γ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-27',
    config: BaseRoundConfig,
  },
  round26: {
    name: `(Β) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-26',
    config: BaseRoundConfig,
  },
  round25: {
    name: `(Α) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-25',
    config: BaseRoundConfig,
  },
  round24: {
    name: `(ω) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-24',
    config: BaseRoundConfig,
  },
  round23: {
    name: `(ψ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-23',
    config: BaseRoundConfig,
  },
  round22: {
    name: `(χ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-22',
    config: BaseRoundConfig,
  },
  round21: {
    name: `(φ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-21',
    config: BaseRoundConfig,
  },
  round20: {
    name: `(υ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-20',
    config: BaseRoundConfig,
  },
  round19: {
    name: `(τ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-19',
    config: BaseRoundConfig,
  },
  round18: {
    name: `(σ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-18',
    config: BaseRoundConfig,
  },
  round17: {
    name: `(ρ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-17',
    config: BaseRoundConfig,
  },
  round16: {
    name: `(π) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-16',
    config: BaseRoundConfig,
  },
  round15: {
    name: `(ο) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-15',
    config: BaseRoundConfig,
  },
  round14: {
    name: `(ξ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-14',
    config: BaseRoundConfig,
  },
  round13: {
    name: `(ν) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-13',
    config: BaseRoundConfig,
  },
  round12: {
    name: `(μ) ${defaultWebsiteName}`,
    disabled: true,
    config: BaseRoundConfig,
  },
  round11: {
    name: `(λ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-11',
    config: BaseRoundConfig,
  },
  round10: {
    name: `(κ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-10',
    config: BaseRoundConfig,
  },
  round9: {
    name: `(ι) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-9',
    config: BaseRoundConfig,
  },
  round8: {
    name: `(θ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-8',
    config: BaseRoundConfig,
  },
  round7: {
    name: `(η) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-7',
    config: BaseRoundConfig,
  },
  round6: {
    name: `(ζ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-6',
    config: BaseRoundConfig,
  },
  round5: {
    name: `(ε) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-5',
    config: BaseRoundConfig,
  },
  round4: {
    name: `(δ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-4',
    config: BaseRoundConfig,
  },
  round3: {
    name: `(γ) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-3',
    config: BaseRoundConfig,
  },
  round2: {
    name: `(β) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-2',
    config: BaseRoundConfig,
  },
  round1: {
    name: `(α) ${defaultWebsiteName}`,
    disabled: false,
    dbname: 'museum-1',
    config: BaseRoundConfig,
  },
} satisfies Record<RoundKey, Round>
