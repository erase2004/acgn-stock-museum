import type { z } from 'astro/zod'
import type { schema as schemaFighter } from '@/services/dbArenaFighters'
import type { schema as schemaLog } from '@/services/dbArenaLog'
import type { Dictionary } from 'lodash'
import type { TargetedEvent } from 'preact'
import CompanyLink from '@/components/common/preact/CompanyLink'
import LoadMore from '@/components/common/preact/LoadMore'
import { useMemo, useRef, useState } from 'preact/hooks'
import { isArray, map, zipObject } from 'lodash-es'
import { currencyFormat } from '@/utils/helpers'
import { useFilter } from '@/utils/hooks'

type Fighter = z.infer<typeof schemaFighter>
type FighterDict = Dictionary<Fighter>
type Log = z.infer<typeof schemaLog>

type Props = {
  storeKey: string
  round: string
  pageSize: number
  fighters: Fighter[]
  logs: Log[]
}

function getAttacker(log: Log) {
  return log.companyId[0]
}

function getDefender(log: Log) {
  return log.companyId[1]
}

function displaySp(log: Log, fighterDict: FighterDict) {
  if (log.attackManner > 0) {
    return `(SP:${log.attackerSp})`
  }

  const attackerId = getAttacker(log)
  const attacker = fighterDict[attackerId]

  return (
    <>
      (SP:{log.attackerSp}
      <span class="text-error">-{attacker.spCost}</span>)
    </>
  )
}

function displayAttackManaer(log: Log, fighterDict: FighterDict) {
  let result = ''

  const attackerId = getAttacker(log)
  const attacker = fighterDict[attackerId]

  if (attacker) {
    if (log.attackManner > 0) {
      result += '普通攻擊'
      const mannerName = attacker.normalManner[log.attackManner - 1]
      if (mannerName) {
        result += '「' + mannerName + '」'
      }
    } else {
      result += '特殊攻擊'
      const mannerName = attacker.specialManner[log.attackManner * -1 - 1]
      if (mannerName) {
        result += '「' + mannerName + '」'
      }
    }

    return result
  }

  return '???'
}

export default function LogList({ storeKey, round, pageSize, fighters, logs }: Props) {
  const fighterDict = useMemo(() => {
    return zipObject(map(fighters, 'companyId'), fighters)
  }, [fighters])

  const { setFilterValue, filteredItems } = useFilter(
    storeKey,
    pageSize,
    logs,
    {
      companyId: {
        isEqualFn: (item, target) => {
          if (isArray(target)) return false

          return item['companyId'].includes(target)
        },
      },
    },
    false,
  )

  const inputRef = useRef<HTMLInputElement>(null)
  const [showClear, setShowClear] = useState(false)

  function updateShowClear(value: string) {
    if (value !== '') setShowClear(true)
    else setShowClear(false)
  }

  function handleInputChange(e: TargetedEvent<HTMLInputElement>) {
    const value = e.currentTarget.value
    updateShowClear(value)
  }

  function onSubmit(e: TargetedEvent<HTMLFormElement>) {
    e.preventDefault()
    setFilterValue('companyId', inputRef.current?.value ?? '')
  }

  function clear() {
    updateShowClear('')
    if (inputRef.current) inputRef.current.value = ''
    setFilterValue('companyId', '')
  }

  function formatLog(log: Log) {
    const attacker = <CompanyLink round={round} companyId={getAttacker(log)} />
    const defender = <CompanyLink round={round} companyId={getDefender(log)} />

    return (
      <div key={log._id} class="break-all">
        【回合{log.round}】{attacker}
        {displaySp(log, fighterDict)}的{displayAttackManaer(log, fighterDict)}
        {log.damage ? (
          <>
            對{defender}造成了{log.damage}傷害
          </>
        ) : (
          <>被{defender}靈巧的閃避了</>
        )}
        {log.profit ? (
          <>
            ，{defender}無力再戰，{attacker}因此獲得了 ${currencyFormat(log.profit)}的競賽獎金！
          </>
        ) : (
          <>(殘餘HP{log.defenderHp})。</>
        )}
      </div>
    )
  }

  return (
    <div>
      <form class="sticky-control join py-4" onSubmit={onSubmit}>
        <label class="input input-sm join-item">
          <span class="label">篩選參賽者</span>
          <input type="text" placeholder="全部參賽者" ref={inputRef} onChange={handleInputChange} />
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
      <div>{filteredItems.map(formatLog)}</div>
      <LoadMore storeKey={storeKey} />
    </div>
  )
}
