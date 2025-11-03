import type { TargetedEvent } from 'preact'
import { z } from 'astro/zod'
import { announcementCategoryMap } from '@/services/dbAnnouncements'
import { setItems, type Item } from '@/stores/announcement'
import { useEffect } from 'preact/hooks'
import { categoryDisplayName } from '@/utils/announcement'
import { useFilter, useUser, type FilterConfig } from '@/utils/hooks'
import { typedObjectKeys } from '@/utils/helpers'
import { isArray } from 'lodash-es'
import { dataNumberPerPage } from '@/configs/general'

const PAGE_SIZE = dataNumberPerPage.announcements

type Props = {
  storeKey: string
  data: Item[]
}

export default function Filter({ storeKey, data }: Props) {
  const { user } = useUser()

  const categoryList = Object.keys(announcementCategoryMap)
  const { setFilterValue, filterObject, filteredItems } = useFilter(
    storeKey,
    PAGE_SIZE,
    data,
    {
      // @ts-expect-error: it should be ok
      category: {
        schema: z.enum(typedObjectKeys(announcementCategoryMap)).optional(),
        isEqualFn: (field, target) => {
          if (isArray(target)) return false

          return field === target
        },
      } satisfies FilterConfig<Item, 'category'>,
      // @ts-expect-error: it should be ok
      voided: {
        schema: z.coerce.boolean().optional(),
        isEqualFn: (field, target) => {
          if (target === true) {
            return true
          } else {
            return field === false
          }
        },
      } satisfies FilterConfig<Item, 'voided'>,
    },
    true,
  )

  function onCategoryChange(event: TargetedEvent<HTMLSelectElement>) {
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
    <div class="sticky-control flex flex-wrap gap-2 py-4">
      <label class="select w-56 select-sm">
        <span class="label">顯示分類</span>
        <select onChange={onCategoryChange}>
          <option value="">全部分類</option>
          {categoryList.map((category) => (
            <option value={category} selected={filterObject['category'] === category}>
              {categoryDisplayName(category)}
            </option>
          ))}
        </select>
      </label>
      {user && (
        <label class="btn px-2 btn-outline btn-sm btn-primary">
          <input
            type="checkbox"
            class="checkbox checkbox-sm checkbox-primary"
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
