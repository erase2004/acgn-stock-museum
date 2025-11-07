import type { TargetedEvent } from 'preact'
import LoadMore from '@/components/common/preact/LoadMore'
import { categoryMap, stateMap, simpleSchema } from '@/services/dbViolationCases'
import { z } from 'astro/zod'
import { useFilter } from '@/utils/hooks'
import { formatDateTimeText } from '@/libs/timeFormat'
import { categoryDisplayName, stateBadgeClass, stateDisplayName } from '@/utils/violation'
import { getViolationCaseUrl } from '@/libs/routes'
import { isArray, isString } from 'lodash-es'
import Reminder from '../Reminder.astro'

type Case = z.infer<typeof simpleSchema>

type Props = {
  round: string
  storeKey: string
  pageSize: number
  data: Case[]
}

export default function ViolationCaseList({ round, storeKey, pageSize, data }: Props) {
  const { setFilterValue, filteredItems, filterObject } = useFilter(
    storeKey,
    pageSize,
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

  function onCategoryChange(event: TargetedEvent<HTMLSelectElement>) {
    const value = event.currentTarget.value
    setFilterValue('category', value)
  }

  function onStateChange(event: TargetedEvent<HTMLSelectElement>) {
    const value = event.currentTarget.value
    setFilterValue('state', value)
  }

  return (
    <>
      <Reminder />
      <div class="flex flex-col flex-wrap gap-2 py-2 *:w-full md:flex-row md:*:w-44">
        <label class="select select-sm">
          <span class="label">案件分類</span>
          <select onChange={onCategoryChange}>
            <option value="">全部分類</option>
            {categoryList.map((category) => (
              <option value={category} selected={filterObject['category'] === category}>
                {categoryDisplayName(category)}
              </option>
            ))}
          </select>
        </label>
        <label class="select select-sm">
          <span class="label">案件狀態</span>
          <select onChange={onStateChange}>
            <option value="">全部狀態</option>
            {stateList.map((state) => (
              <option value={state} selected={filterObject['state'] === state}>
                {stateDisplayName(state)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div class="overflow-y-auto">
        <table class="table-base custom-responsive-table-md table-pin-rows table">
          <thead>
            <tr class="*:px-1">
              <th class="w-50 text-center text-nowrap">舉報時間</th>
              <th class="text-center text-nowrap">案件狀態</th>
              <th class="text-center text-nowrap">違規類型</th>
              <th class="w-24 text-center text-nowrap">查看</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr class="*:px-1" key={item._id}>
                  <td class="text-nowrap md:text-center" data-title="舉報時間">
                    {formatDateTimeText(item.createdAt)}
                  </td>
                  <td class="text-nowrap md:text-center" data-title="案件狀態">
                    <span class={`badge ${stateBadgeClass(item.state)}`}>
                      {stateDisplayName(item.state)}
                    </span>
                  </td>
                  <td class="text-nowrap md:text-center" data-title="違規類型">
                    {categoryDisplayName(item.category)}
                  </td>
                  <td class="text-nowrap md:text-center" data-title="查看">
                    <a class="btn btn-sm btn-primary" href={getViolationCaseUrl(round, item._id)}>
                      查看
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr class="default-content">
                <td class="truncate" colspan={4}>
                  查無資料！
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <LoadMore storeKey={storeKey} />
      </div>
    </>
  )
}
