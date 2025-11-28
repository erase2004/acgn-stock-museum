import CompanyLink from '@/components/common/preact/CompanyLink'
import UserLink from '@/components/common/preact/UserLink'
import {
  arenaFighterSortableFields,
  getAttributeNumber,
  fighterAttributes,
} from '@/services/dbArenaFighters'
import { TableVirtuoso } from 'react-virtuoso'
import { Fragment, useMemo, useState } from 'react'
import { orderBy } from 'lodash-es'
import { currencyFormat } from '@/utils/helpers'
import { FIRST_ROUND } from '@/configs/sites'
import { useStore } from '@nanostores/react'
import { fighters } from '@/stores/arena'

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

type Props = {
  round: string
  isArenaEnded: boolean
  minInvestment: number
}

export default function FighterList({ round, isArenaEnded, minInvestment }: Props) {
  const isFirstRound = round === FIRST_ROUND

  const $fighters = useStore(fighters)
  const [height, setHeight] = useState(0)

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
      ? orderBy($fighters, [key, 'createdAt'], [order, order === 'desc' ? 'asc' : 'desc'])
      : orderBy($fighters, [key], [order])
  }, [$fighters, sortOrder])

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
        return <i className="fa fa-sort-amount-asc ml-1" aria-hidden="true"></i>
      } else {
        return <i className="fa fa-sort-amount-desc ml-1" aria-hidden="true"></i>
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
    <div>
      <p>總共{$fighters.length}位參賽者</p>
      <div className="sticky-control flex flex-wrap gap-2 py-4 md:hidden">
        {arenaFighterSortableFields.map((field) => (
          <button
            key={field}
            className={`btn-default btn btn-outline btn-sm ${getSortButtonClass(field)}`}
            onClick={() => {
              handleSortChange(field)
            }}
          >
            {fieldNameMap[field]}
            {getSortIcon(field)}
          </button>
        ))}
      </div>
      <TableVirtuoso
        className="max-h max-h-dvh min-h-10 md:min-h-20"
        style={{ height }}
        totalListHeightChanged={(h) => setHeight(h)}
        data={sortedItems}
        components={{
          Table({ children, ...props }) {
            return (
              <table {...props} className="table-base custom-responsive-table-md table">
                {children}
              </table>
            )
          },
          EmptyPlaceholder() {
            return (
              <tbody>
                <tr className="default-content">
                  <td className="truncate" colSpan={9}>
                    <em>沒有任何報名者！</em>
                  </td>
                </tr>
              </tbody>
            )
          },
          TableRow(props) {
            return <tr {...props} className="*:truncate *:px-0" />
          },
        }}
        fixedHeaderContent={() => (
          <tr className="bg-base-100 *:px-1 *:last:w-1/8">
            <th className="w-1/4 text-center">參賽選手</th>
            <th className="w-1/4 text-center">決策者</th>
            {arenaFighterSortableFields.map((field) => (
              <th
                key={field}
                className="cursor-pointer text-center whitespace-normal"
                title={fieldNameMap[field]}
                onClick={() => handleSortChange(field)}
              >
                {fieldNameMap[field]}
                {getSortIcon(field)}
              </th>
            ))}
          </tr>
        )}
        itemContent={(_, item) => (
          <Fragment key={item.companyId}>
            <td className="text-left" data-title="參賽選手">
              <CompanyLink round={round} companyId={item.companyId} />
            </td>
            <td className="text-left text-nowrap" data-title="決策者">
              <UserLink round={round} userId={item.manager} />
            </td>
            {fighterAttributes.map((field) => (
              <td key={field} className="text-center" data-title={fieldNameMap[field]}>
                {getAttributeNumber(field, item[field], isFirstRound)}
              </td>
            ))}
            <td className="text-center" data-title="名次">
              {item.rank}
            </td>
            <td data-title="總投資額">
              <div className={`text-right ${totalInvestedAmountClass(item.totalInvestedAmount)}`}>
                {currencyFormat(item.totalInvestedAmount)}
              </div>
            </td>
          </Fragment>
        )}
      />
    </div>
  )
}
