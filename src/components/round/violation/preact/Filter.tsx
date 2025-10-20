import type { TargetedEvent } from 'preact'
import { z } from 'astro/zod'
import { getViolationCases } from '@/libs/request'
import {
  categoryMap,
  stateMap,
  querySchema,
  casesWithCountSchema,
} from '@/services/dbViolationCases'
import { currentPage, isDataLoading, totalAmount } from '@/stores/pagination'
import { items } from '@/stores/violation'
import { useStore } from '@nanostores/preact'
import { isString, pickBy } from 'lodash-es'
import { useEffect, useState } from 'preact/hooks'
import { stateDisplayName, categoryDisplayName } from '@/utils/violation'

type Props = {
  round: string
  pageSize: number
}

export default function Filter({ round, pageSize }: Props) {
  const $currentPage = useStore(currentPage)
  const $isDataLoading = useStore(isDataLoading)
  const [currentCategory, setCurrentCategory] = useState<keyof typeof categoryMap | ''>('')
  const [currentState, setCurrentState] = useState<keyof typeof stateMap | ''>('')
  const [violatorUserId, setViolatorUserId] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)
  const $items = useStore(items)

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

  async function search(reset: boolean = false) {
    if ($isDataLoading) return
    isDataLoading.set(true)

    if (reset) currentPage.set(1)

    const query = getQuery()
    const response = await getViolationCases(
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
