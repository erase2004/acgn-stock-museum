import type { TargetedEvent } from 'preact'
import { z } from 'astro/zod'
import { getAnnouncements } from '@/libs/request'
import {
  announcementCategoryMap,
  querySchema,
  casesWithCountSchema,
} from '@/services/dbAnnouncements'
import { currentPage, isDataLoading, totalAmount } from '@/stores/pagination'
import { items } from '@/stores/announcement'
import { useStore } from '@nanostores/preact'
import { isString, pickBy } from 'lodash-es'
import { useEffect, useState } from 'preact/hooks'
import { categoryDisplayName } from '@/utils/announcement'

type Props = {
  round: string
  pageSize: number
}

export default function Filter({ round, pageSize }: Props) {
  const $currentPage = useStore(currentPage)
  const $isDataLoading = useStore(isDataLoading)
  const [currentCategory, setCurrentCategory] = useState<keyof typeof announcementCategoryMap | ''>(
    '',
  )
  const [isInitialized, setIsInitialized] = useState(false)
  const $items = useStore(items)

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
    if ($isDataLoading) return
    if ($currentPage === 1) return

    search()
  }, [$currentPage])

  function onCategoryChange(event: TargetedEvent<HTMLSelectElement>) {
    const value = event.currentTarget.value
    // @ts-expect-error: value is valid
    setCurrentCategory(value)
  }

  async function search(reset: boolean = false) {
    if ($isDataLoading) return
    isDataLoading.set(true)

    if (reset) currentPage.set(1)

    const query = getQuery()
    const response = await getAnnouncements(
      round,
      query,
      pageSize,
      reset === true ? 1 : $currentPage,
    )

    try {
      const data = await z.promise(casesWithCountSchema).parse(response.json())

      if (data) {
        let newItems = data[0]?.data ?? []

        if (reset !== true) {
          newItems = $items.concat(...newItems)
        }

        items.set(newItems)
        totalAmount.set(data[0]?.total[0]?.total ?? 0)
      }
    } finally {
      isDataLoading.set(false)
    }
  }

  return (
    <div class="flex flex-wrap gap-2">
      <label class="select w-44 select-sm">
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
