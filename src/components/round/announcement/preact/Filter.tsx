import type { TargetedEvent } from 'preact'
import { z } from 'astro/zod'
import { announcementCategoryMap, querySchema, listItemSchema } from '@/services/dbAnnouncements'
import { currentPage, isDataLoading, hasMore } from '@/stores/pagination'
import { items } from '@/stores/announcement'
import { useStore } from '@nanostores/preact'
import { filter, isString, pickBy } from 'lodash-es'
import { useEffect, useState } from 'preact/hooks'
import { categoryDisplayName } from '@/utils/announcement'

type Props = {
  storeKey: string
  data: z.infer<typeof listItemSchema>[]
  pageSize: number
}

export default function Filter({ storeKey, data, pageSize }: Props) {
  const $currentPage = useStore(currentPage)
  const $isDataLoading = useStore(isDataLoading)
  const [currentCategory, setCurrentCategory] = useState<keyof typeof announcementCategoryMap | ''>(
    '',
  )
  const [isInitialized, setIsInitialized] = useState(false)

  const categoryList = Object.keys(announcementCategoryMap)

  useEffect(() => {
    if (isInitialized) return

    const searchParams = new URLSearchParams(location.search)
    const { data } = querySchema.safeParse(Object.fromEntries(searchParams.entries()))

    if (data) {
      const { category } = data

      if (category) setCurrentCategory(category)
    }

    setIsInitialized(true)
  }, [])

  function getQuery() {
    return pickBy(
      {
        category: currentCategory,
      },
      (value) => {
        return isString(value) && value.length > 0
      },
    )
  }

  function updateURL() {
    const query = getQuery()

    const url = new URL(window.location.href)
    url.search = new URLSearchParams(query).toString()
    window.history.replaceState(null, '', url.toString())
  }

  useEffect(() => {
    if (!isInitialized) return

    updateURL()
    search(true)
  }, [currentCategory, isInitialized])

  useEffect(() => {
    if (!isInitialized) return
    if ($isDataLoading[storeKey]) return
    if ($currentPage[storeKey] === 1) return

    search()
  }, [$currentPage[storeKey]])

  function onCategoryChange(event: TargetedEvent<HTMLSelectElement>) {
    const value = event.currentTarget.value
    // @ts-expect-error: value is valid
    setCurrentCategory(value)
  }

  async function search(reset: boolean = false) {
    if ($isDataLoading[storeKey]) return
    isDataLoading.setKey(storeKey, true)

    let newList = data

    const { category } = getQuery()
    if (category) {
      newList = filter(newList, (item) => item.category === category)
    }

    const totalAmount = newList.length

    if (reset) {
      newList = newList.slice(0, pageSize)
      currentPage.setKey(storeKey, 1)
    } else {
      newList = newList.slice(0, pageSize * $currentPage[storeKey])
    }

    items.set(newList)
    hasMore.setKey(storeKey, newList.length < totalAmount)
    isDataLoading.setKey(storeKey, false)
  }

  return (
    <div class="flex flex-wrap gap-2">
      <label class="select w-56 select-sm">
        <span class="label">顯示分類</span>
        <select onChange={onCategoryChange}>
          <option value="">全部分類</option>
          {categoryList.map((category) => (
            <option value={category} selected={currentCategory === category}>
              {categoryDisplayName(category)}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
