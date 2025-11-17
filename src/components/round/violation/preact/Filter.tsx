import type { SyntheticEvent } from 'react'
import { z } from 'astro/zod'
import { categoryMap, stateMap, listItemSchema } from '@/services/dbViolationCases'
import { isArray, isString, some } from 'lodash-es'
import { useEffect, useRef, useState } from 'react'
import { stateDisplayName, categoryDisplayName } from '@/utils/violation'
import { useFilter } from '@/utils/hooks'
import { itemId } from '@/services/schema'
import { setItems } from '@/stores/violation'

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
    data,
    {
      schema: listItemSchema
        .pick({ category: true, state: true })
        .extend({ violators: itemId })
        .partial(),
      filterFn(item, filters) {
        {
          // category
          const key = 'category'
          const target = filters[key]
          const value = item[key]

          if (isArray(target)) return false
          if (isString(target) && value !== target) return false
        }

        {
          // state
          const key = 'state'
          const target = filters[key]
          const value = item[key]

          if (isArray(target)) return false
          if (isString(target) && value !== target) return false
        }

        {
          // violator
          const key = 'violators'
          const target = filters[key]
          const value = item[key]

          if (isArray(target)) return false

          if (isString(target)) {
            return some(
              value,
              (violator) => violator.violatorType === 'user' && violator.violatorId === target,
            )
          }
        }

        return true
      },
    },
    true,
  )

  useEffect(() => {
    setItems(filteredItems)
  }, [filteredItems])

  const categoryList = Object.keys(categoryMap)
  const stateList = Object.keys(stateMap)

  function onCategoryChange(event: SyntheticEvent<HTMLSelectElement>) {
    const value = event.currentTarget.value
    setFilterValue('category', value)
  }

  function onStateChange(event: SyntheticEvent<HTMLSelectElement>) {
    const value = event.currentTarget.value
    setFilterValue('state', value)
  }

  function updateShowClear(value: string) {
    if (value !== '') setShowClear(true)
    else setShowClear(false)
  }

  function onInputChange(e: SyntheticEvent<HTMLInputElement>) {
    const value = e.currentTarget.value
    updateShowClear(value)
  }

  function onSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setFilterValue('violators', inputRef.current?.value ?? '')
  }

  function clear() {
    updateShowClear('')
    if (inputRef.current) inputRef.current.value = ''
    setFilterValue('violators', '')
  }

  useEffect(() => {
    const value = filterObject['violators']

    if (value) {
      if (inputRef.current) inputRef.current.value = value
      updateShowClear(value)
    }
  }, [filterObject['violators']])

  return (
    <div className="sticky-control flex flex-wrap items-center gap-2 py-4">
      <label className="select w-44 select-sm">
        <span className="label">案件分類</span>
        <select onChange={onCategoryChange} value={filterObject['category'] || ''}>
          <option value="">全部分類</option>
          {categoryList.map((category) => (
            <option key={category} value={category}>
              {categoryDisplayName(category)}
            </option>
          ))}
        </select>
      </label>
      <label className="select w-44 select-sm">
        <span className="label">案件狀態</span>
        <select onChange={onStateChange} value={filterObject['state'] || ''}>
          <option value="">全部狀態</option>
          {stateList.map((state) => (
            <option key={state} value={state}>
              {stateDisplayName(state)}
            </option>
          ))}
        </select>
      </label>
      <form className="join" onSubmit={onSubmit}>
        <label className="input input-sm join-item">
          <span className="label">違規使用者</span>
          <input
            type="text"
            placeholder="輸入使用者識別碼"
            ref={inputRef}
            onChange={onInputChange}
          />
        </label>
        {showClear && (
          <button type="reset" className="btn join-item btn-sm" aria-label="清除" onClick={clear}>
            <i className="fa fa-times"></i>
          </button>
        )}
        <button type="submit" className="btn join-item btn-sm btn-primary" aria-label="搜尋">
          <i className="fa fa-search"></i>
        </button>
      </form>
      <p className="w-full">總共{filteredItems.length}筆</p>
    </div>
  )
}
