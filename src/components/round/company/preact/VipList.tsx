import type { z } from 'astro/zod'
import type { SyntheticEvent } from 'react'
import UserLink from '@/components/common/preact/UserLink'
import { Fragment, useState } from 'react'
import { TableVirtuoso } from 'react-virtuoso'
import { levelConfig, type schema } from '@/services/dbVips'
import { useFilter, useUser } from '@/utils/hooks'
import { dataStoreKey } from '@/configs/general'
import { isArray, isString } from 'lodash-es'

const displayVipLevelOptions = levelConfig
  .slice(1)
  .map(({ level }) => ({
    value: `${level}`,
    text: getLevelText(level),
  }))
  .reverse()
displayVipLevelOptions.unshift({ value: '', text: '全部' })

const STORE_KEY = dataStoreKey.company.vip

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

  const [height, setHeight] = useState(0)

  const { filteredItems, filterObject, setFilterValue } = useFilter(
    STORE_KEY,
    data,
    {
      filterFn(item, filters) {
        {
          // level
          const key = 'level'
          const target = filters[key]
          const value = item[key].toString()

          if (isArray(target)) return target.includes(value)
          if (isString(target)) return target === value

          return true
        }
      },
    },
    false,
  )

  function changeLevel(e: SyntheticEvent<HTMLSelectElement>) {
    const level = e.currentTarget.value
    setFilterValue('level', level)
  }

  return (
    <div className="grid grid-cols-12 gap-y-4">
      <div className="col-span-12 md:col-span-8 lg:col-span-9">
        <label className="select mb-2 w-40 select-sm">
          <span className="label">顯示等級</span>
          <select onChange={changeLevel}>
            {displayVipLevelOptions.map(({ value, text }) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </label>
        <p className="sm:ml-4 sm:inline-block">
          總共{filteredItems.length}位
          {filterObject['level'] && ` ${getLevelText(filterObject['level'])}`}
        </p>
        <TableVirtuoso
          className="company-panel-table max-h-72 min-h-8 md:min-h-16"
          style={{ height }}
          totalListHeightChanged={(h) => setHeight(h)}
          data={filteredItems}
          components={{
            Table({ children, ...props }) {
              return <div {...props}>{children}</div>
            },
            TableHead({ children, ...props }) {
              return (
                <div {...props} className="head">
                  {children}
                </div>
              )
            },
            TableBody({ children, ...props }) {
              return <div {...props}>{children}</div>
            },
            TableRow({ children, item, ...props }) {
              return (
                <div {...props} className={`row ${item.level === 5 ? 'vip-level-5' : ''}`}>
                  {children}
                </div>
              )
            },
            FillerRow({ height }) {
              return <div style={{ height }}></div>
            },
            EmptyPlaceholder() {
              return <em className="block text-center">查無資料！</em>
            },
          }}
          fixedHeaderContent={() => (
            <>
              <div className="col-span-6">使用者帳號</div>
              <div className="col-span-3">VIP 等級</div>
              <div className="col-span-3">分數</div>
            </>
          )}
          itemContent={(_, item) => (
            <Fragment key={item.userId}>
              <p className="col-span-5 md:hidden">使用者帳號</p>
              <div className="col-span-7 truncate md:col-span-6">
                <UserLink round={round} userId={item.userId} />
              </div>
              <p className="col-span-5 md:hidden">VIP 等級</p>
              <div className="col-span-7 text-left md:col-span-3 md:text-center">
                {getLevelText(item.level)}
              </div>
              <p className="col-span-5 md:hidden">分數</p>
              <div className="col-span-7 text-left md:col-span-3 md:text-center">{item.score}</div>
            </Fragment>
          )}
        />
      </div>
      <div className="col-span-12 md:col-span-4 md:ml-8 lg:col-span-3">
        <p className="mb-1 text-center text-lg">分級門檻一覽</p>
        <div className="bg-base-content/25">
          <table className="table border-separate border-spacing-[1px] table-sm text-center **:border-none **:text-base **:[th,td]:bg-base-100 **:[th,td]:p-1">
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
        <div className="divider my-1"></div>
        <p className="mb-1 text-lg">我的 VIP 資訊</p>
        {typeof userVipInfo !== 'undefined' ? (
          <div className="flec-col flex">
            <p>
              VIP 等級：
              <span className="text-nowrap text-info">{getLevelText(userVipInfo.level)}</span>
            </p>
            <div className="divider mx-1 divider-horizontal"></div>
            <p>
              分數：
              <span className={`text-nowrap ${getVipScoreClass(thresholds, userVipInfo)}`}>
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
