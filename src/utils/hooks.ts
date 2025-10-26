import type { ZodTypeAny } from 'astro/zod'
import { z } from 'astro/zod'
import { useStore } from '@nanostores/preact'
import { currentPage, hasMore, isDataLoading } from '@/stores/pagination'
import { useEffect, useState } from 'preact/hooks'
import { filter, isArray, isEqual, isString, pickBy, transform } from 'lodash-es'

type FilterConfig<T> = {
  isEqualFn: (item: T, target: string | string[]) => boolean
  schema?: ZodTypeAny
}

export function useFilter<T extends Record<string, any>, U extends Record<string, FilterConfig<T>>>(
  storeKey: string,
  pageSize: number,
  data: T[],
  filterConfig: U,
  shouldSyncUrl?: boolean,
) {
  const $currentPage = useStore(currentPage)
  const $isDataLoading = useStore(isDataLoading)
  const [filteredItems, setFilteredItems] = useState(data)
  const [isInitialized, setIsInitialized] = useState(false)
  const [filterObject, setFilterObject] = useState<Record<string, string | string[]>>({})

  const filterSchema = z.object(
    transform(
      filterConfig,
      function (result: { [W in keyof U]: ZodTypeAny }, value: FilterConfig<T>, key: keyof U) {
        const schema = value?.schema
        if (typeof schema !== 'undefined') {
          result[key] = schema
        }
      },
    ),
    {},
  )

  function getQuery() {
    return pickBy(filterObject, (value) => {
      return isString(value) ? value.length > 0 : isArray(value) && value.every(isString)
    })
  }

  function updateURL() {
    const query = transform(
      getQuery(),
      function (result, value, key) {
        if (isArray(value)) {
          result[key] = value.join(',')
        } else {
          result[key] = value ?? ''
        }
      },
      {} as Record<string, string>,
    )

    const url = new URL(window.location.href)
    url.search = new URLSearchParams(query).toString()
    window.history.replaceState(null, '', url.toString())
  }

  function search(reset: boolean = false) {
    if ($isDataLoading[storeKey]) return
    isDataLoading.setKey(storeKey, true)

    let newList = data

    const filters = getQuery()

    newList = Object.entries(filters).reduce(function (
      list: T[],
      [key, target]: [string, string | string[]],
    ) {
      const isEqualFn = filterConfig[key]?.isEqualFn ?? isEqual

      return filter(list, (item) => isEqualFn(item, target))
    }, newList)

    const totalAmount = newList.length

    if (reset) {
      newList = newList.slice(0, pageSize)
      currentPage.setKey(storeKey, 1)
    } else {
      newList = newList.slice(0, pageSize * $currentPage[storeKey])
    }

    hasMore.setKey(storeKey, newList.length < totalAmount)
    isDataLoading.setKey(storeKey, false)
    setFilteredItems(newList)
  }

  useEffect(() => {
    if (isInitialized) return

    if (shouldSyncUrl) {
      const searchParams = new URLSearchParams(location.search)
      const { data } = filterSchema.safeParse(Object.fromEntries(searchParams.entries()))

      if (data) {
        setFilterObject(data)
      }
    }

    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (!isInitialized) return

    if (shouldSyncUrl) updateURL()
    search(true)
  }, [filterObject, isInitialized])

  useEffect(() => {
    if (!isInitialized) return
    if ($isDataLoading[storeKey]) return
    if ($currentPage[storeKey] === 1) return

    search()
  }, [$currentPage[storeKey]])

  function setFilterValue(key: keyof T, value: string | string[]) {
    setFilterObject({ ...filterObject, [key]: value })
  }

  return {
    setFilterValue,
    filterObject,
    filteredItems,
  }
}
