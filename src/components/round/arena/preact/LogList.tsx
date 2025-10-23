import type { z } from 'astro/zod'
import type { schema as schemaFighter } from '@/services/dbArenaFighters'
import type { schema as schemaLog } from '@/services/dbArenaLog'
import type { Dictionary } from 'lodash'
import type { TargetedEvent } from 'preact'
import CompanyLink from '@/components/common/preact/CompanyLink'
import LoadMore from '@/components/common/preact/LoadMore'
import { currentPage, hasMore, isDataLoading } from '@/stores/pagination'
import { useStore } from '@nanostores/preact'
import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
import { filter, map, zipObject } from 'lodash-es'
import { currencyFormat } from '@/utils/helpers'

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
  const $isDataLoading = useStore(isDataLoading)
  const $currentPage = useStore(currentPage)
  const inputRef = useRef<HTMLInputElement>(null)
  const [showClear, setShowClear] = useState(false)
  const [displayLogs, setDisplayLogs] = useState(logs.slice(0, pageSize))

  const fighterDict = useMemo(() => {
    return zipObject(map(fighters, 'companyId'), fighters)
  }, [fighters])

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

  useEffect(() => {
    if ($isDataLoading[storeKey]) return
    if ($currentPage[storeKey] === 1) return

    search()
  }, [$currentPage[storeKey]])

  function search(reset: boolean = false) {
    if ($isDataLoading[storeKey]) return
    isDataLoading.setKey(storeKey, true)

    let newList = logs

    const companyId = inputRef.current?.value ?? ''
    if (companyId) {
      newList = filter(newList, (log) => log.companyId.includes(companyId))
    }

    const totalAmount = newList.length

    if (reset) {
      newList = newList.slice(0, pageSize)
      currentPage.setKey(storeKey, 1)
    } else {
      newList = newList.slice(0, pageSize * $currentPage[storeKey])
    }

    setDisplayLogs(newList)
    hasMore.setKey(storeKey, newList.length < totalAmount)
    isDataLoading.setKey(storeKey, false)
  }

  function onSubmit(e: TargetedEvent<HTMLFormElement>) {
    e.preventDefault()
    search(true)
  }

  function updateShowClear(value: string) {
    if (value !== '') setShowClear(true)
    else setShowClear(false)
  }

  function handleInputChange(e: TargetedEvent<HTMLInputElement>) {
    const value = e.currentTarget.value
    updateShowClear(value)
  }

  function clear() {
    updateShowClear('')
    if (inputRef.current) inputRef.current.value = ''
    search(true)
  }

  return (
    <div>
      <form class="sticky top-0 join bg-base-100 py-4 pr-4" onSubmit={onSubmit}>
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
      <div>{displayLogs.map(formatLog)}</div>
      <LoadMore storeKey={storeKey} />
    </div>
  )
}
