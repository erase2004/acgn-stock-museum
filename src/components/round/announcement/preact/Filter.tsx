import type { SyntheticEvent } from 'react'
import { z } from 'astro/zod'
import { announcementCategoryMap, listItemSchema } from '@/services/dbAnnouncements'
import { setItems, type Item } from '@/stores/announcement'
import { useEffect } from 'react'
import { categoryDisplayName } from '@/utils/announcement'
import { useFilter, useUser } from '@/utils/hooks'
import { isArray, isString } from 'lodash-es'

type Props = {
  storeKey: string
  data: Item[]
}

export default function Filter({ storeKey, data }: Props) {
  const { user } = useUser()

  const categoryList = Object.keys(announcementCategoryMap)
  const { setFilterValue, filterObject, filteredItems } = useFilter(
    storeKey,
    data,
    {
      schema: listItemSchema
        .pick({ category: true })
        .extend({ voided: z.coerce.boolean() })
        .partial(),
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
          // voided
          const key = 'voided'
          const target = filters[key]
          const value = item[key]

          if (isArray(target)) return false
          if (target !== true && value === true) return false
        }

        return true
      },
    },
    true,
  )

  function onCategoryChange(event: SyntheticEvent<HTMLSelectElement>) {
    const value = event.currentTarget.value
    setFilterValue('category', value)
  }

  useEffect(() => {
    setItems(filteredItems)
  }, [filteredItems])

  useEffect(() => {
    if (!user) {
      // 使用者登出時，不再顯示 voided 的資訊
      setFilterValue('voided', false)
    }
  }, [user])

  return (
    <div className="sticky-control flex flex-wrap gap-2 py-4">
      <label className="select w-56 select-sm">
        <span className="label">顯示分類</span>
        <select onChange={onCategoryChange} value={filterObject['category'] || ''}>
          <option value="">全部分類</option>
          {categoryList.map((category) => (
            <option key={category} value={category}>
              {categoryDisplayName(category)}
            </option>
          ))}
        </select>
      </label>
      {user && (
        <label className="btn px-2 btn-outline btn-sm btn-primary">
          <input
            type="checkbox"
            className="checkbox checkbox-sm checkbox-primary"
            checked={filterObject['voided']}
            onChange={(e) => {
              const checked = e.currentTarget.checked
              setFilterValue('voided', checked)
            }}
          />
          顯示已作廢
        </label>
      )}
    </div>
  )
}
