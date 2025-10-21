import type { TargetedEvent } from 'preact'
import { z } from 'astro/zod'
import { categoryMap, stateMap, querySchema, listItemSchema } from '@/services/dbViolationCases'
import { currentPage, isDataLoading, hasMore } from '@/stores/pagination'
import { items } from '@/stores/violation'
import { useStore } from '@nanostores/preact'
import { filter, isString, pickBy, some } from 'lodash-es'
import { useEffect, useState } from 'preact/hooks'
import { stateDisplayName, categoryDisplayName } from '@/utils/violation'

type Props = {
  pageSize: number
  data: z.infer<typeof listItemSchema>[]
}

export default function Filter({ pageSize, data }: Props) {
  const $currentPage = useStore(currentPage)
  const $isDataLoading = useStore(isDataLoading)
  const $items = useStore(items)
  const [currentCategory, setCurrentCategory] = useState<keyof typeof categoryMap | ''>('')
  const [currentState, setCurrentState] = useState<keyof typeof stateMap | ''>('')
  const [violatorUserId, setViolatorUserId] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)

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
      if (_userId) setViolatorUserId(_userId)
    }

    setIsInitialized(true)
  }, [])

  function getQuery() {
    return pickBy(
      {
        category: currentCategory,
        state: currentState,
        violatorUserId: violatorUserId,
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
    if (violatorUserId) return

    updateURL()
    search(true)
  }, [violatorUserId, isInitialized])

  useEffect(() => {
    if (!isInitialized) return

    updateURL()
    search(true)
  }, [currentCategory, currentState])

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

  function onStateChange(event: TargetedEvent<HTMLSelectElement>) {
    const value = event.currentTarget.value
    // @ts-expect-error: value is valid
    setCurrentState(value)
  }

  function onInputChange(event: TargetedEvent<HTMLInputElement>) {
    const value = event.currentTarget.value
    setViolatorUserId(value)
  }

  function onSubmit(e: TargetedEvent<HTMLFormElement>) {
    e.preventDefault()

    updateURL()
    search(true)
  }

  function clear() {
    setViolatorUserId('')
  }

  function search(reset: boolean = false) {
    if ($isDataLoading) return
    isDataLoading.set(true)

    const { category, state, violatorUserId } = getQuery()

    let newList = data
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

    if (reset) {
      newList = newList.slice(0, pageSize)
      currentPage.set(1)
      hasMore.set(newList.length >= pageSize)
    } else {
      newList = newList.slice(0, pageSize * $currentPage)
      hasMore.set(newList.length > $items.length)
    }

    items.set(newList)
    isDataLoading.set(false)
  }

  return (
    <div class="flex flex-wrap gap-2">
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
            onChange={onInputChange}
            value={violatorUserId}
          />
        </label>
        {violatorUserId && (
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
