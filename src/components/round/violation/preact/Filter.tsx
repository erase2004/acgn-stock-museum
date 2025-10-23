import type { TargetedEvent } from 'preact'
import { z } from 'astro/zod'
import { categoryMap, stateMap, querySchema, listItemSchema } from '@/services/dbViolationCases'
import { currentPage, isDataLoading, hasMore } from '@/stores/pagination'
import { items } from '@/stores/violation'
import { useStore } from '@nanostores/preact'
import { filter, isString, pickBy, some } from 'lodash-es'
import { useEffect, useRef, useState } from 'preact/hooks'
import { stateDisplayName, categoryDisplayName } from '@/utils/violation'

type Props = {
  storeKey: string
  pageSize: number
  data: z.infer<typeof listItemSchema>[]
}

export default function Filter({ storeKey, pageSize, data }: Props) {
  const $currentPage = useStore(currentPage)
  const $isDataLoading = useStore(isDataLoading)
  const [currentCategory, setCurrentCategory] = useState<keyof typeof categoryMap | ''>('')
  const [currentState, setCurrentState] = useState<keyof typeof stateMap | ''>('')
  const [isInitialized, setIsInitialized] = useState(false)
  const [showClear, setShowClear] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const categoryList = Object.keys(categoryMap)
  const stateList = Object.keys(stateMap)

  useEffect(() => {
    if (isInitialized) return

    const searchParams = new URLSearchParams(location.search)
    const { data } = querySchema.safeParse(Object.fromEntries(searchParams.entries()))

    if (data) {
      const { category, state, violatorUserId: _userId } = data

      if (category) setCurrentCategory(category)
      if (state) setCurrentState(state)
      if (_userId && inputRef.current) inputRef.current.value = _userId
    }

    setIsInitialized(true)
  }, [])

  function getQuery() {
    return pickBy(
      {
        category: currentCategory,
        state: currentState,
        violatorUserId: inputRef.current?.value ?? '',
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
    if (isInitialized) {
      search(true)
    }
  }, [isInitialized])

  useEffect(() => {
    if (!isInitialized) return

    updateURL()
    search(true)
  }, [currentCategory, currentState])

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

  function onStateChange(event: TargetedEvent<HTMLSelectElement>) {
    const value = event.currentTarget.value
    // @ts-expect-error: value is valid
    setCurrentState(value)
  }

  function updateShowClear(value: string) {
    if (value !== '') setShowClear(true)
    else setShowClear(false)
  }

  function onInputChange(e: TargetedEvent<HTMLInputElement>) {
    const value = e.currentTarget.value
    updateShowClear(value)
  }

  function onSubmit(e: TargetedEvent<HTMLFormElement>) {
    e.preventDefault()

    updateURL()
    search(true)
  }

  function clear() {
    updateShowClear('')
    if (inputRef.current) inputRef.current.value = ''
    updateURL()
    search(true)
  }

  function search(reset: boolean = false) {
    if ($isDataLoading[storeKey]) return
    isDataLoading.setKey(storeKey, true)

    let newList = data

    const { category, state, violatorUserId } = getQuery()
    if (category) {
      newList = filter(newList, (item) => item.category === category)
    }
    if (state) {
      newList = filter(newList, (item) => item.state === state)
    }
    if (violatorUserId) {
      newList = filter(newList, (item) =>
        some(
          item.violators,
          (violator) => violator.violatorType === 'user' && violator.violatorId === violatorUserId,
        ),
      )
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
    <div class="sticky-control flex flex-wrap gap-2 py-4">
      <label class="select w-44 select-sm">
        <span class="label">案件分類</span>
        <select onChange={onCategoryChange}>
          <option value="">全部分類</option>
          {categoryList.map((category) => (
            <option value={category} selected={currentCategory === category}>
              {categoryDisplayName(category)}
            </option>
          ))}
        </select>
      </label>
      <label class="select w-44 select-sm">
        <span class="label">案件狀態</span>
        <select onChange={onStateChange}>
          <option value="">全部狀態</option>
          {stateList.map((state) => (
            <option value={state} selected={currentState === state}>
              {stateDisplayName(state)}
            </option>
          ))}
        </select>
      </label>
      <form class="join" onSubmit={onSubmit}>
        <label class="input input-sm join-item">
          <span class="label">違規使用者</span>
          <input
            type="text"
            placeholder="輸入使用者識別碼"
            ref={inputRef}
            onChange={onInputChange}
          />
        </label>
        {showClear && (
          <button type="reset" class="btn join-item btn-sm" aria-label="清除" onClick={clear}>
            <i class="fa fa-times"></i>
          </button>
        )}
        <button type="submit" class="btn join-item btn-sm btn-primary" aria-label="搜尋">
          <i class="fa fa-search"></i>
        </button>
      </form>
    </div>
  )
}
