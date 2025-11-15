// 公司相關設定

/** 季度結束前多久開放設定薪資，單位為毫秒 */
export const announceSalaryTime = 259200000

/** 公司預設員工每日薪資 */
export const defaultCompanySalaryPerDay = 1000

/** 公司營利的分配設定 */
export const companyProfitDistribution = {
  /** 分配設定調整的封關時間 (ms) */
  lockTime: 86400000,
  /** 公司所得稅佔比 (%) */
  incomeTaxRatePercent: 10,
  /** 經理人分紅 (%) */
  managerBonusRatePercent: {
    min: 1,
    max: 5,
    default: 5,
  },
  /** 員工分紅 (%) */
  employeeBonusRatePercent: {
    min: 1,
    max: 5,
    default: 5,
  },
  /** 員工投票獎金 (%) */
  employeeProductVotingRewardRatePercent: 1,
  /** 資本額增加量 (%) */
  capitalIncreaseRatePercent: {
    min: 1,
    /** 經理人分紅、員工分紅、資本額增加三者的加總上限 */
    limit: 15,
    default: 3,
  },
}

/** 公司營利的分配設定（適用第一季） */
export const companyProfitDistributionForFirstRound = {
  /** 分配設定調整的封關時間 (ms) */
  lockTime: 86400000,
  /** 公司所得稅佔比 (%) */
  incomeTaxRatePercent: 15,
  /** 經理人分紅 (%) */
  managerBonusRatePercent: 5,
}

/** 挖礦機的運作時間 (ms) */
export const miningMachineOperationTime = 86400000

/** 產品消費券的數量 */
export const productVoucherAmount = 7000

// 廣告相關設定

/** 廣告持續時間，單位為毫秒 */
export const advertisingExpireTime = 259200000
/** 同時最多顯示的廣告筆數 */
export const displayAdvertisingNumber = 5

// 最萌亂鬥大賽相關相關設定

/** 最萌亂鬥大賽的參賽所需最小總投資金額 */
export const arenaMinInvestedAmount = 10000

/** 最萌亂鬥大賽的最大回合數 */
export const arenaMaximumRound = 1000

// 其他設定

/** 分頁時每個分頁有多少資料 */
export const dataNumberPerPage = {
  account: {
    founder: 10,
    chariman: 10,
    manager: 10,
    vip: 10,
    employee: 10,
    stock: 20,
    product: 20,
    stone: 10,
    tax: 10,
    violation: 10,
    log: 60,
  },
  productCenter: {
    company: 30,
    season: 30,
  },
  arena: {
    fighter: 40,
    log: 60,
  },
  company: {
    log: 60,
    product: 10,
    director: 40,
    manager: 10,
    vip: 20,
    employee: {
      current: 20,
      next: 20,
    },
    violation: 10,
  },
  companies: 24,
  fscLogs: 60,
  fscStock: 40,
  violations: 20,
  violationRelatedLog: 30,
  announcements: 40,
} as const

/** 作為存取 nanostore 使用 */
export const dataStoreKey = {
  account: {
    founder: 'founder-title',
    chairman: 'chairman-title',
    manager: 'manager-title',
    vip: 'vip-title',
    employee: 'employee-title',
    stock: 'user-stock',
    product: 'user-product',
    stone: 'user-stone',
    tax: 'user-tax',
    violation: 'user-violation',
    log: 'user-log',
  },
  productCenter: {
    company: 'product-company',
    season: 'product-season',
  },
  arena: {
    fighter: 'arena-fighter',
    log: 'arena-log',
  },
  company: {
    log: 'company-log',
    product: 'company-product',
    director: 'company-director',
    manager: 'company-manager',
    vip: 'company-vip',
    employee: {
      current: 'company-current-employee',
      next: 'company-next-employee',
    },
    violation: 'company-violation',
  },
  companies: 'company-list',
  fscLogs: 'fsc-logs',
  fscStock: 'fsc-stock',
  violations: 'violations',
  violationRelatedLog: 'violation-log',
  announcements: 'announcements',
} as const

export const fallbackImageUrl =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png'

/** e2e test 的最低 timeout 值 */
export const MINIMUM_TEST_TIMEOUT = 1000 * 30
