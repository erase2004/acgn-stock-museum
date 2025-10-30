import type { z } from 'astro/zod'
import CompanyLink from '@/components/common/preact/CompanyLink'
import UserLink from '@/components/common/preact/UserLink'
import LoadMore from '@/components/common/preact/LoadMore'
import {
  schema as schemaFighter,
  arenaFighterSortableFields,
  getAttributeNumber,
} from '@/services/dbArenaFighters'
import { useMemo, useState } from 'preact/hooks'
import { orderBy } from 'lodash-es'
import { currencyFormat } from '@/utils/helpers'
import { dataNumberPerPage, dataStoreKey } from '@/configs/general'
import { useDisplayItems } from '@/utils/hooks'

type OrderKey = (typeof arenaFighterSortableFields)[number]
type SortOrder<T = 1 | 0> = Partial<Record<OrderKey, T>>

const fieldNameMap: Record<OrderKey, string> = {
  hp: 'HP',
  sp: 'SP',
  atk: 'ATK',
  def: 'DEF',
  agi: 'AGI',
  rank: '名次',
  totalInvestedAmount: '總投資額',
}

const PAGE_SIZE = dataNumberPerPage.arena.fighter
const STORE_KEY = dataStoreKey.arena.fighter

type Props = {
  round: string
  isArenaEnded: boolean
  minInvestment: number
  data: z.infer<typeof schemaFighter>[]
}

export default function FighterList({ round, isArenaEnded, minInvestment, data }: Props) {
  const [sortOrder, setSortOrder] = useState<SortOrder>(isArenaEnded ? { rank: 1 } : { agi: 0 })

  const sortedItems = useMemo(() => {
    let key: keyof SortOrder = 'agi'
    let order: 'asc' | 'desc' = 'desc'

    arenaFighterSortableFields.forEach((field) => {
      if (typeof sortOrder[field] === 'number') {
        key = field
        order = sortOrder[field] ? 'asc' : 'desc'
      }
    })

    return key === 'agi'
      ? orderBy(data, [key, 'createdAt'], [order, order === 'desc' ? 'asc' : 'desc'])
      : orderBy(data, [key], [order])
  }, [data, sortOrder])

  const displayItems = useDisplayItems(sortedItems, STORE_KEY, PAGE_SIZE)

  function handleSortChange(key: keyof SortOrder) {
    if (typeof sortOrder[key] === 'number') {
      setSortOrder({
        [key]: sortOrder[key] ? 0 : 1,
      })
    } else {
      setSortOrder({
        [key]: 0,
      })
    }
  }

  function getSortIcon(key: keyof SortOrder) {
    if (typeof sortOrder[key] === 'number') {
      if (sortOrder[key]) {
        return <i class="fa fa-sort-amount-asc ml-1" aria-hidden="true"></i>
      } else {
        return <i class="fa fa-sort-amount-desc ml-1" aria-hidden="true"></i>
      }
    }
    return <></>
  }

  function getSortButtonClass(key: keyof SortOrder) {
    return typeof sortOrder[key] === 'number' ? 'btn-active' : ''
  }

  function totalInvestedAmountClass(amount: number) {
    return amount >= minInvestment ? 'text-success' : 'text-error'
  }

  return (
    <div class="max-h-dvh overflow-y-auto">
      <div class="sticky-control mb-2 flex flex-wrap gap-2 py-4 md:hidden">
        {arenaFighterSortableFields.map((field) => (
          <button
            key={field}
            class={`btn-default btn btn-outline btn-sm ${getSortButtonClass(field)}`}
            onClick={() => {
              handleSortChange(field)
            }}
          >
            {fieldNameMap[field]}
            {getSortIcon(field)}
          </button>
        ))}
      </div>
      <table class="table-base custom-responsive-table-md table-pin-rows table">
        <thead>
          <tr class="*:px-1 *:last:w-1/8">
            <th class="w-1/4 truncate text-center">參賽選手</th>
            <th class="w-1/4 truncate text-center">決策者</th>
            {arenaFighterSortableFields.map((field) => (
              <th
                key={field}
                class="cursor-pointer truncate text-center"
                title={fieldNameMap[field]}
                onClick={() => handleSortChange(field)}
              >
                {fieldNameMap[field]}
                {getSortIcon(field)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayItems.length > 0 ? (
            displayItems.map((item) => (
              <tr key={item.companyId} class="*:px-0">
                <td class="truncate text-left" data-title="參賽選手">
                  <CompanyLink round={round} companyId={item.companyId} />
                </td>
                <td class="truncate text-left text-nowrap" data-title="決策者">
                  <UserLink round={round} userId={item.manager} />
                </td>
                {(['hp', 'sp', 'atk', 'def', 'agi'] as const).map((field) => (
                  <td key={field} class="truncate text-center" data-title={fieldNameMap[field]}>
                    {getAttributeNumber(field, item[field])}
                  </td>
                ))}
                <td class="truncate text-center" data-title="名次">
                  {item.rank}
                </td>
                <td data-title="總投資額">
                  <div
                    class={`truncate text-right ${totalInvestedAmountClass(item.totalInvestedAmount)}`}
                  >
                    {currencyFormat(item.totalInvestedAmount)}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr class="default-content">
              <td class="truncate" colspan={9}>
                <em>沒有任何報名者！</em>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <LoadMore storeKey={STORE_KEY} />
    </div>
  )
}
