import type { SyntheticEvent } from 'react'
import {
  type ListMode,
  type ListItem,
  listViewMode,
  LIST_STORE_KEY,
  setItems,
} from '@/stores/company'
import { useStore } from '@nanostores/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ownStocks } from '@/stores/account'
import { useFilter, useUser } from '@/utils/hooks'
import { buildSearchRegExp } from '@/utils/helpers'
import { isArray, isString, orderBy } from 'lodash-es'
import { dataNumberPerPage } from '@/configs/general'

type Props = {
  data: ListItem[]
}

type ListOption = '' | 'favorite' | 'own'
type SortOption = 'lastPrice' | 'totalValue' | 'capital' | 'createdAt'
type SeachMode = 'exact' | 'fuzzy'

const PAGE_SIZE = dataNumberPerPage.companies

function toggleViewMode(mode: ListMode) {
  if (mode === 'card') listViewMode.set('table')
  else listViewMode.set('card')
}

export default function Filter({ data }: Props) {
  const $listViewMode = useStore(listViewMode)
  const $ownStocks = useStore(ownStocks)
  const { user } = useUser()
  const listOptionRef = useRef<HTMLSelectElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const [sortOption, setSortOption] = useState<SortOption>('lastPrice')
  const [searchMode, setSearchMode] = useState<SeachMode>('exact')
  const [showClear, setShowClear] = useState(false)

  const ownStockCompanyIds = Object.keys($ownStocks)

  const sortedItems = useMemo(() => {
    switch (sortOption) {
      case 'lastPrice':
        return data
      case 'capital':
      case 'totalValue':
      case 'createdAt':
        return orderBy(data, [sortOption], ['desc'])
      default: {
        const _unreachable: never = sortOption
        return data
      }
    }
  }, [data, sortOption])

  const { filteredItems, setFilterValue } = useFilter(
    LIST_STORE_KEY,
    PAGE_SIZE,
    sortedItems,
    {
      filterFn(item, filters) {
        {
          // _id
          const key = '_id'
          const target = filters[key]
          const value = item[key]

          if (isArray(target) && !target.includes(value)) return false
          if (isString(target) && value !== target) return false
        }

        {
          // companyName
          const key = 'companyName'
          const target = filters[key]
          const value = item[key]

          if (isString(target)) {
            const regex = buildSearchRegExp(target, searchMode)
            return regex.test(value) || item['tags'].some((tag) => regex.test(tag))
          }
        }

        return true
      },
    },
    false,
  )

  useEffect(() => {
    setItems(filteredItems)
  }, [filteredItems])

  useEffect(() => {
    if (!user) {
      if (listOptionRef.current) listOptionRef.current.value = ''

      setFilterValue('_id', undefined)
    }
  }, [user])

  function changeListOption(e: SyntheticEvent<HTMLSelectElement>) {
    const option = e.currentTarget.value as ListOption

    switch (option) {
      case 'favorite': {
        setFilterValue('_id', user?.favorite ?? [])
        break
      }
      case 'own': {
        setFilterValue('_id', ownStockCompanyIds)
        break
      }
      case '': {
        setFilterValue('_id', undefined)
        break
      }
      default: {
        const _unreachable: never = option
      }
    }
  }

  function changeSortOption(e: SyntheticEvent<HTMLSelectElement>) {
    const option = e.currentTarget.value as SortOption
    setSortOption(option)
  }

  function changeSearchMode(e: SyntheticEvent<HTMLSelectElement>) {
    const mode = e.currentTarget.value as SeachMode
    setSearchMode(mode)
  }

  function updateShowClear(value: string) {
    if (value !== '') setShowClear(true)
    else setShowClear(false)
  }

  function handleInputChange(e: SyntheticEvent<HTMLInputElement>) {
    const value = e.currentTarget.value
    updateShowClear(value)
  }

  function search(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!searchRef.current) return
    const target = searchRef.current.value

    setFilterValue('companyName', target)
  }

  function clear() {
    updateShowClear('')
    if (searchRef.current) searchRef.current.value = ''
    setFilterValue('companyName', undefined)
  }

  return (
    <div className="flex flex-wrap gap-1">
      <button
        className="btn-default btn"
        onClick={() => toggleViewMode($listViewMode)}
        aria-label="選擇資料呈現模式"
      >
        <i
          className={`fa ${$listViewMode === 'card' ? 'fa-th' : 'fa-th-list'}`}
          aria-hidden="true"
        ></i>
      </button>
      <select className="select w-30" ref={listOptionRef} onChange={changeListOption}>
        <option value="">全部顯示</option>
        {user && (
          <>
            <option value="favorite">只顯示最愛</option>
            <option value="own">只顯示持有</option>
          </>
        )}
      </select>
      <select className="select w-40" value={sortOption} onChange={changeSortOption}>
        <option value="lastPrice">依股價排序</option>
        <option value="totalValue">依總市值排序</option>
        <option value="capital">依資本額排序</option>
        <option value="createdAt">依上市日期排序</option>
      </select>
      <form
        className="join-vertical join w-full grow sm:join-horizontal md:w-auto"
        onSubmit={search}
      >
        <input
          className="input join-item w-full sm:w-60"
          type="text"
          placeholder="請輸入關鍵字"
          ref={searchRef}
          onChange={handleInputChange}
        />
        <select
          className="select join-item w-full sm:w-30"
          value={searchMode}
          onChange={changeSearchMode}
        >
          <option value="exact" selected>
            完全比對
          </option>
          <option value="fuzzy">模糊比對</option>
        </select>
        {showClear && (
          <button type="reset" className="btn join-item" aria-label="清除" onClick={clear}>
            <i className="fa fa-times"></i>
          </button>
        )}
        <button className="btn join-item btn-primary" type="submit">
          <i className="fa fa-search" aria-hidden="true"></i> 搜索
        </button>
      </form>
    </div>
  )
}
