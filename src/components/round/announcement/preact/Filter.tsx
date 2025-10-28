import type { TargetedEvent } from 'preact'
import { z } from 'astro/zod'
import { announcementCategoryMap, listItemSchema } from '@/services/dbAnnouncements'
import { setItems } from '@/stores/announcement'
import { useEffect } from 'preact/hooks'
import { categoryDisplayName } from '@/utils/announcement'
import { useFilter, type FilterConfig } from '@/utils/hooks'
import { typedObjectKeys } from '@/utils/helpers'
import { isArray } from 'lodash-es'
import { dataNumberPerPage } from '@/configs/general'

const PAGE_SIZE = dataNumberPerPage.announcements

type Data = z.infer<typeof listItemSchema>

type Props = {
  storeKey: string
  data: Data[]
}

export default function Filter({ storeKey, data }: Props) {
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
      } satisfies FilterConfig<Data, 'category'>,
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
    </div>
  )
}
