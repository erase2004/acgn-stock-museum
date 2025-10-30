import UserLink from '@/components/common/preact/UserLink'
import { levelConfig, type schema } from '@/services/dbVips'
import type { z } from 'astro/zod'
import { type FilterConfig, useFilter, useUser } from '@/utils/hooks'
import { dataNumberPerPage, dataStoreKey } from '@/configs/general'
import { isArray } from 'lodash-es'
import LoadMore from '@/components/common/preact/LoadMore'
import type { TargetedEvent } from 'preact'

const displayVipLevelOptions = levelConfig
  .slice(1)
  .map(({ level }) => ({
    value: `${level}`,
    text: getLevelText(level),
  }))
  .reverse()
displayVipLevelOptions.unshift({ value: '', text: '全部' })

const STORE_KEY = dataStoreKey.company.vip
const PAGE_SIZE = dataNumberPerPage.company.vip

type Threshold = {
  level: number
  score: number
}
type VIP = z.infer<typeof schema>
type Props = {
  round: string
  thresholds: Threshold[]
  data: VIP[]
}

export default function VipList({ round, thresholds, data }: Props) {
  const { user } = useUser()
  const userVipInfo = user ? data.find((i) => i.userId === user._id) : undefined

  const { filteredItems, setFilterValue } = useFilter(
    STORE_KEY,
    PAGE_SIZE,
    data,
    {
      // @ts-expect-error: it should be ok
      level: {
        isEqualFn: (field, target) => {
          const value = field.toString()

          if (isArray(target)) return target.includes(value)
          return target === value
        },
      } satisfies FilterConfig<VIP, 'level'>,
    },
    false,
  )

  function changeLevel(e: TargetedEvent<HTMLSelectElement>) {
    const level = e.currentTarget.value
    setFilterValue('level', level)
  }

  return (
    <div class="grid grid-cols-12 gap-y-4 px-4 py-2 md:gap-x-8">
      <div class="col-span-12 md:col-span-8 lg:col-span-9">
        <label class="select mb-2 w-40 select-sm">
          <span class="label">顯示等級</span>
          <select onChange={changeLevel}>
            {displayVipLevelOptions.map(({ value, text }) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </label>
        <div class="company-panel-table -mx-4 max-h-72 *:gap-x-1 *:px-4">
          <div class="sticky-control hidden grid-cols-12 text-center text-nowrap md:grid">
            <div class="col-span-6">使用者帳號</div>
            <div class="col-span-3">VIP 等級</div>
            <div class="col-span-3">分數</div>
          </div>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.userId}
                class={`grid grid-cols-12 ${item.level === 5 ? 'vip-level-5' : ''}`}
              >
                <p class="col-span-5 md:hidden">使用者帳號</p>
                <div class="col-span-7 truncate md:col-span-6">
                  <UserLink round={round} userId={item.userId} />
                </div>
                <p class="col-span-5 md:hidden">VIP 等級</p>
                <div
                  class="col-span-7 text-left md:col-span-3 md:text-center"
                  title={getLevelText(item.level)}
                >
                  {getLevelText(item.level)}
                </div>
                <p class="col-span-5 md:hidden">分數</p>
                <div
                  class="col-span-7 text-left md:col-span-3 md:text-center"
                  title={`${item.score}`}
                >
                  {item.score}
                </div>
              </div>
            ))
          ) : (
            <div class="text-center">
              <em>查無資料！</em>
            </div>
          )}
          <LoadMore storeKey={STORE_KEY} />
        </div>
      </div>
      <div class="col-span-12 md:col-span-4 lg:col-span-3">
        <p class="mb-1 text-lg">分級門檻一覽</p>
        <div class="bg-base-content/25">
          <table class="table border-separate border-spacing-[1px] table-sm text-center **:border-none **:text-base **:[th,td]:bg-base-100 **:[th,td]:p-1">
            <thead>
              <tr>
                <th>VIP 等級</th>
                <th>門檻分數</th>
              </tr>
            </thead>
            <tbody>
              {thresholds.map((ts) => (
                <tr key={ts.level}>
                  <td>{getLevelText(ts.level)}</td>
                  <td>{ts.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div class="divider my-1"></div>
        <p class="mb-1 text-lg">我的 VIP 資訊</p>
        {typeof userVipInfo !== 'undefined' ? (
          <div class="flec-col flex">
            <p>
              VIP 等級：<span class="text-nowrap text-info">{getLevelText(userVipInfo.level)}</span>
            </p>
            <div class="divider mx-1 divider-horizontal"></div>
            <p>
              分數：
              <span class={`text-nowrap ${getVipScoreClass(thresholds, userVipInfo)}`}>
                {userVipInfo.score}
              </span>
            </p>
          </div>
        ) : (
          <em>您並非此公司的 VIP！</em>
        )}
      </div>
    </div>
  )
}

function getLevelText(level: number) {
  return `Level ${level}`
}

function getVipScoreClass(thresholds: Threshold[], vip: VIP) {
  const level = thresholds.length - vip.level
  const nextLevelThreshold = thresholds[level - 1]?.score || Infinity
  const currentLevelThreshold = thresholds[level]?.score || 0

  if (vip.score >= nextLevelThreshold) {
    return 'px-1 bg-success text-white'
  }

  if (vip.score < currentLevelThreshold) {
    return 'px-1 bg-error text-white'
  }

  return 'text-info'
}
