import type { ZodTypeAny } from 'astro/zod'
import type { BasicUser } from '@/services/dbUsers'
import { z } from 'astro/zod'
import { useStore } from '@nanostores/preact'
import { currentPage, hasMore, isDataLoading } from '@/stores/pagination'
import { useEffect, useState, useMemo } from 'preact/hooks'
import { filter, isArray, isEqual, isString, pickBy, transform } from 'lodash-es'
import { useLocalStorage } from 'usehooks-ts'

export type FilterConfig<T, S extends keyof T = keyof T> = {
  isEqualFn: (field: T[S], target: string | string[], item: T) => boolean
  /** 當 shouldSyncUrl 為 true 時，schema 會作為處理 URL 資訊使用 */
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
  const [filteredItems, setFilteredItems] = useState(data.slice(0, pageSize))
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
      return isString(value)
        ? value.length > 0
        : isArray(value) && value.length > 0 && value.every(isString)
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

      return filter(list, (item) => isEqualFn(item[key], target, item))
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
  }, [filterObject, isInitialized, data])

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

export function useDisplayItems<T>(data: T[], storeKey: string, pageSize: number) {
  const totalAmount = data.length
  const $currentPage = useStore(currentPage)

  const displayItems = useMemo(() => {
    const newList = data.slice(0, pageSize * $currentPage[storeKey])
    hasMore.setKey(storeKey, newList.length < totalAmount)
    return newList
  }, [data, $currentPage[storeKey]])

  return displayItems
}

export function useUser() {
  const [value, setValue, removeValue] = useLocalStorage<BasicUser | null>('user', null)

  return {
    user: value,
    setUser: setValue,
    resetUser: removeValue,
  }
}
