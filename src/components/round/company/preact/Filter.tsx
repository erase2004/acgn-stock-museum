import type { TargetedEvent } from 'preact'
import {
  type ListMode,
  type ListItem,
  listViewMode,
  LIST_STORE_KEY,
  setItems,
} from '@/stores/company'
import { useStore } from '@nanostores/preact'
import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
import { ownStocks } from '@/stores/account'
import { useFilter, useUser, type FilterConfig } from '@/utils/hooks'
import { buildSearchRegExp } from '@/utils/helpers'
import { isArray, orderBy } from 'lodash-es'
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
  const [sortOption, setSortOption] = useState<SortOption>('lastPrice')
  const [searchMode, setSearchMode] = useState<SeachMode>('exact')

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
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        const unreachable: never = sortOption
        return data
      }
    }
  }, [data, sortOption])

  const { filteredItems, setFilterValue } = useFilter(
    LIST_STORE_KEY,
    PAGE_SIZE,
    sortedItems,
    {
      // @ts-expect-error: it should be ok
      _id: {
        isEqualFn: function (field, target) {
          if (isArray(target)) return target.includes(field)

          return field === target
        },
      } satisfies FilterConfig<ListItem, '_id'>,
      // @ts-expect-error: it should be ok
      companyName: {
        isEqualFn: function (field, target, item) {
          if (isArray(target)) return true

          const regex = buildSearchRegExp(target, searchMode)
          return regex.test(field) || item['tags'].some(regex.test)
        },
      } satisfies FilterConfig<ListItem, 'companyName'>,
    },
    false,
  )

  useEffect(() => {
    setItems(filteredItems)
  }, [filteredItems])

  useEffect(() => {
    if (!user) {
      if (listOptionRef.current) listOptionRef.current.value = ''

      setFilterValue('_id', [])
    }
  }, [user])

  function changeListOption(e: TargetedEvent<HTMLSelectElement>) {
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
        setFilterValue('_id', [])
        break
      }
      default: {
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        const unreachable: never = option
      }
    }
  }

  function changeSortOption(e: TargetedEvent<HTMLSelectElement>) {
    const option = e.currentTarget.value as SortOption
    setSortOption(option)
  }

  function changeSearchMode(e: TargetedEvent<HTMLSelectElement>) {
    const mode = e.currentTarget.value as SeachMode
    setSearchMode(mode)
  }

  return (
    <div class="flex flex-wrap gap-1">
      <button
        class="btn-default btn"
        onClick={() => toggleViewMode($listViewMode)}
        aria-label="選擇資料呈現模式"
      >
        <i class={`fa ${$listViewMode === 'card' ? 'fa-th' : 'fa-th-list'}`} aria-hidden="true"></i>
      </button>
      <select class="select w-30" ref={listOptionRef} onChange={changeListOption}>
        <option value="">全部顯示</option>
        {user && (
          <>
            <option value="favorite">只顯示最愛</option>
            <option value="own">只顯示持有</option>
          </>
        )}
      </select>
      <select class="select w-40" value={sortOption} onChange={changeSortOption}>
        <option value="lastPrice">依股價排序</option>
        <option value="totalValue">依總市值排序</option>
        <option value="capital">依資本額排序</option>
        <option value="createdAt">依上市日期排序</option>
      </select>
      <div class="join-vertical join w-full grow sm:join-horizontal md:w-auto">
        <input class="input join-item w-full sm:w-60" type="text" placeholder="請輸入關鍵字" />
        <select
          class="select join-item w-full sm:w-30"
          value={searchMode}
          onChange={changeSearchMode}
        >
          <option value="exact" selected>
            完全比對
          </option>
          <option value="fuzzy">模糊比對</option>
        </select>
        <button class="btn join-item btn-primary">
          <i class="fa fa-search" aria-hidden="true"></i> 搜索
        </button>
      </div>
    </div>
  )
}
