import type { TargetedEvent } from 'preact'
import { z } from 'astro/zod'
import { categoryMap, stateMap, listItemSchema } from '@/services/dbViolationCases'
import { isArray, some } from 'lodash-es'
import { useEffect, useRef, useState } from 'preact/hooks'
import { stateDisplayName, categoryDisplayName } from '@/utils/violation'
import { useFilter, type FilterConfig } from '@/utils/hooks'
import { typedObjectKeys } from '@/utils/helpers'
import { itemId } from '@/services/schema'
import { setItems } from '@/stores/violation'
import { dataNumberPerPage } from '@/configs/general'

const PAGE_SIZE = dataNumberPerPage.violations

type Data = z.infer<typeof listItemSchema>

type Props = {
  storeKey: string
  data: Data[]
}

export default function Filter({ storeKey, data }: Props) {
  const [showClear, setShowClear] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const { setFilterValue, filteredItems, filterObject } = useFilter(
    storeKey,
    PAGE_SIZE,
    data,
    {
      // @ts-expect-error: it should be ok
      category: {
        schema: z.enum(typedObjectKeys(categoryMap)).optional(),
        isEqualFn: (field, target) => {
          if (isArray(target)) return false

          return field === target
        },
      } satisfies FilterConfig<Data, 'category'>,
      // @ts-expect-error: it should be ok
      state: {
        schema: z.enum(typedObjectKeys(stateMap)).optional(),
        isEqualFn: (field, target) => {
          if (isArray(target)) return false

          return field === target
        },
      } satisfies FilterConfig<Data, 'state'>,
      // @ts-expect-error: it should be ok
      violators: {
        schema: itemId.optional(),
        isEqualFn: (field, target) => {
          if (isArray(target)) return false

          return some(
            field,
            (violator) => violator.violatorType === 'user' && violator.violatorId === target,
          )
        },
      } satisfies FilterConfig<Data, 'violators'>,
    },
    true,
  )

  useEffect(() => {
    setItems(filteredItems)
  }, [filteredItems])

  const categoryList = Object.keys(categoryMap)
  const stateList = Object.keys(stateMap)

  function onCategoryChange(event: TargetedEvent<HTMLSelectElement>) {
    const value = event.currentTarget.value
    setFilterValue('category', value)
  }

  function onStateChange(event: TargetedEvent<HTMLSelectElement>) {
    const value = event.currentTarget.value
    setFilterValue('state', value)
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
    setFilterValue('violators', inputRef.current?.value ?? '')
  }

  function clear() {
    updateShowClear('')
    if (inputRef.current) inputRef.current.value = ''
    setFilterValue('violators', '')
  }

  return (
    <div class="sticky-control flex flex-wrap gap-2 py-4">
      <label class="select w-44 select-sm">
        <span class="label">案件分類</span>
        <select onChange={onCategoryChange}>
          <option value="">全部分類</option>
          {categoryList.map((category) => (
            <option value={category} selected={filterObject['category'] === category}>
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
            <option value={state} selected={filterObject['state'] === state}>
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
