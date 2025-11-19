import type { SyntheticEvent } from 'react'
import { Fragment, useState } from 'react'
import { TableVirtuoso } from 'react-virtuoso'
import { categoryMap, stateMap, simpleSchema } from '@/services/dbViolationCases'
import { z } from 'astro/zod'
import { useFilter } from '@/utils/hooks'
import { formatDateTimeText } from '@/libs/timeFormat'
import { categoryDisplayName, stateBadgeClass, stateDisplayName } from '@/utils/violation'
import { getViolationCaseUrl } from '@/libs/routes'
import { isArray, isString } from 'lodash-es'

type Case = z.infer<typeof simpleSchema>

type Props = {
  round: string
  storeKey: string
  data: Case[]
}

export default function ViolationCaseList({ round, storeKey, data }: Props) {
  const [height, setHeight] = useState(0)

  const { setFilterValue, filteredItems, filterObject } = useFilter(
    storeKey,
    data,
    {
      filterFn(item, filters) {
        {
          // category
          const key = 'category'
          const target = filters[key]
          const value = item[key]

          if (isArray(target)) return false
          if (isString(target) && value !== target) return false
        }

        {
          // state
          const key = 'state'
          const target = filters[key]
          const value = item[key]

          if (isArray(target)) return false
          if (isString(target) && value !== target) return false
        }

        return true
      },
    },
    false,
  )

  const categoryList = Object.keys(categoryMap)
  const stateList = Object.keys(stateMap)

  function onCategoryChange(event: SyntheticEvent<HTMLSelectElement>) {
    const value = event.currentTarget.value
    setFilterValue('category', value)
  }

  function onStateChange(event: SyntheticEvent<HTMLSelectElement>) {
    const value = event.currentTarget.value
    setFilterValue('state', value)
  }

  return (
    <>
      <div className="flex flex-col flex-wrap gap-2 py-2 *:w-full sm:flex-row sm:*:w-44">
        <label className="select select-sm">
          <span className="label">案件分類</span>
          <select onChange={onCategoryChange} value={filterObject['category'] || ''}>
            <option value="">全部分類</option>
            {categoryList.map((category) => (
              <option key={category} value={category}>
                {categoryDisplayName(category)}
              </option>
            ))}
          </select>
        </label>
        <label className="select select-sm">
          <span className="label">案件狀態</span>
          <select onChange={onStateChange} value={filterObject['state'] || ''}>
            <option value="">全部狀態</option>
            {stateList.map((state) => (
              <option key={state} value={state}>
                {stateDisplayName(state)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <TableVirtuoso
        className="min-h-10 md:min-h-20"
        style={{ height }}
        totalListHeightChanged={(h) => setHeight(h)}
        data={filteredItems}
        components={{
          Table({ children, ...props }) {
            return (
              <table {...props} className="table-base custom-responsive-table-md table">
                {children}
              </table>
            )
          },
          TableRow({ children, ...props }) {
            return (
              <tr {...props} className="*:px-1">
                {children}
              </tr>
            )
          },
          EmptyPlaceholder() {
            return (
              <tbody>
                <tr className="default-content">
                  <td colSpan={4}>查無資料！</td>
                </tr>
              </tbody>
            )
          },
        }}
        fixedHeaderContent={() => (
          <tr className="bg-base-100 *:px-1">
            <th className="w-50 text-center text-nowrap">舉報時間</th>
            <th className="text-center text-nowrap">案件狀態</th>
            <th className="text-center text-nowrap">違規類型</th>
            <th className="w-24 text-center text-nowrap">查看</th>
          </tr>
        )}
        itemContent={(_, item) => (
          <Fragment key={item._id}>
            <td className="text-wrap md:text-center md:text-nowrap" data-title="舉報時間">
              {formatDateTimeText(item.createdAt)}
            </td>
            <td className="text-nowrap md:text-center" data-title="案件狀態">
              <span className={`badge ${stateBadgeClass(item.state)}`}>
                {stateDisplayName(item.state)}
              </span>
            </td>
            <td className="text-nowrap md:text-center" data-title="違規類型">
              {categoryDisplayName(item.category)}
            </td>
            <td className="text-nowrap md:text-center" data-title="查看">
              <a className="btn btn-sm btn-primary" href={getViolationCaseUrl(round, item._id)}>
                查看
              </a>
            </td>
          </Fragment>
        )}
      />
    </>
  )
}
