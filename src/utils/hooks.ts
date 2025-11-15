import type { ZodTypeAny } from 'astro/zod'
import type { BasicUser } from '@/services/dbUsers'
import { useStore } from '@nanostores/preact'
import {
  currentAmount,
  currentPage,
  hasMore,
  isDataLoading,
  isInitialized,
  totalAmount,
} from '@/stores/pagination'
import { useEffect, useState, useMemo } from 'preact/hooks'
import { filter, isArray, isString, pickBy, transform } from 'lodash-es'
import { useLocalStorage } from 'usehooks-ts'

type Filterobject<T extends string | number | symbol> = Partial<Record<T, any>>

type FilterConfig<T extends Record<string, any>> = {
  filterFn: (item: T, filterObject: Filterobject<keyof T>) => boolean
  /** 當 shouldSyncUrl 為 true 時，schema 會作為處理 URL 資訊使用 */
  schema?: ZodTypeAny
}

export function useFilter<T extends Record<string, any>, U extends FilterConfig<T>>(
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
  const [filterObject, setFilterObject] = useState<Filterobject<keyof T>>({})

  const { schema: filterSchema, filterFn } = filterConfig

  function getQuery() {
    return pickBy(filterObject, (value) => {
      if (value === undefined) return false

      if (isString(value) && value.length === 0) return false

      return true
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

    const filters = getQuery() as Record<keyof T, any>

    newList = filter(newList, (item) => filterFn(item, filters))

    const _totalAmount = newList.length
    totalAmount.setKey(storeKey, _totalAmount)

    if (reset) {
      newList = newList.slice(0, pageSize)
      currentPage.setKey(storeKey, 1)
    } else {
      newList = newList.slice(0, pageSize * $currentPage[storeKey])
    }

    currentAmount.setKey(storeKey, newList.length)
    hasMore.setKey(storeKey, newList.length < _totalAmount)
    isDataLoading.setKey(storeKey, false)
    setFilteredItems(newList)
  }

  useEffect(() => {
    if (isInitialized) return

    if (shouldSyncUrl && filterSchema) {
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

  function setFilterValue(key: keyof T, value: any) {
    // 使用 callback 的形式，來處理內部與外部初始化操作的資料更新
    setFilterObject((v) => ({
      ...v,
      [key]: value,
    }))
  }

  return {
    setFilterValue,
    filterObject,
    filteredItems,
  }
}

export function useDisplayItems<T>(data: T[], storeKey: string, pageSize: number) {
  const _totalAmount = data.length
  const $currentPage = useStore(currentPage)
  const $isInitialized = useStore(isInitialized)

  if (!$isInitialized[storeKey]) {
    isInitialized.setKey(storeKey, true)
    currentPage.setKey(storeKey, 1)
    isDataLoading.setKey(storeKey, false)
    hasMore.setKey(storeKey, true)
    currentAmount.setKey(storeKey, 0)
  }
  totalAmount.setKey(storeKey, _totalAmount)

  const displayItems = useMemo(() => {
    isDataLoading.setKey(storeKey, true)
    const newList = data.slice(0, pageSize * $currentPage[storeKey])

    hasMore.setKey(storeKey, newList.length < _totalAmount)
    currentAmount.setKey(storeKey, newList.length)
    isDataLoading.setKey(storeKey, false)
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
