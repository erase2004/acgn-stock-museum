import type { z } from 'astro/zod'
import type { schema as schemaFighter } from '@/services/dbArenaFighters'
import type { Dictionary } from 'lodash'
import type { SyntheticEvent } from 'react'
import { schema as schemaLog } from '@/services/dbArenaLog'
import CompanyLink from '@/components/common/preact/CompanyLink'
import { Virtuoso } from 'react-virtuoso'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { isArray, isString, map, zipObject } from 'lodash-es'
import { currencyFormat } from '@/utils/helpers'
import { useFilter } from '@/utils/hooks'
import { dataStoreKey } from '@/configs/general'
import { getArenaLogJsonUrl } from '@/libs/json-data'
import { useStore } from '@nanostores/react'
import { fighters } from '@/stores/arena'

const STORE_KEY = dataStoreKey.arena.log

type Fighter = z.infer<typeof schemaFighter>
type FighterDict = Dictionary<Fighter>
type Log = z.infer<typeof schemaLog>

type Props = {
  round: string
  arenaId: string
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
      <span className="text-error">-{attacker.spCost}</span>)
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

export default function LogList({ round, arenaId }: Props) {
  const $fighters = useStore(fighters)
  const [isInitialized, setIsInitialized] = useState(false)
  const [logs, setLogs] = useState<Log[]>([])

  const fighterDict = useMemo(() => {
    return zipObject(map($fighters, 'companyId'), $fighters)
  }, [$fighters])

  const { setFilterValue, filteredItems } = useFilter(
    STORE_KEY,
    logs,
    {
      filterFn(item, filters) {
        {
          // companyId
          const key = 'companyId'
          const target = filters[key]
          const value = item[key]

          if (isArray(target)) return false
          if (isString(target)) return value.includes(target)
        }

        return true
      },
    },
    false,
  )

  useEffect(() => {
    if (isInitialized) return

    const jsonUrl = getArenaLogJsonUrl(round, arenaId)
    import(/* @vite-ignore */ jsonUrl)
      .then((module) => {
        const result = schemaLog.array().parse(module.data)
        setLogs(result)
      })
      .finally(() => setIsInitialized(true))
  }, [])

  const inputRef = useRef<HTMLInputElement>(null)
  const [showClear, setShowClear] = useState(false)

  function updateShowClear(value: string) {
    if (value !== '') setShowClear(true)
    else setShowClear(false)
  }

  function handleInputChange(e: SyntheticEvent<HTMLInputElement>) {
    const value = e.currentTarget.value
    updateShowClear(value)
  }

  function onSubmit(e: SyntheticEvent<HTMLFormElement>) {
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
      <div key={log._id} className="break-all">
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

  if (!isInitialized) {
    return <span className="loading loading-xl loading-spinner"></span>
  }

  return (
    <div>
      <form className="sticky-control join py-2" onSubmit={onSubmit}>
        <label className="input input-sm join-item">
          <span className="label">篩選參賽者</span>
          <input
            type="text"
            placeholder="參賽者識別碼"
            ref={inputRef}
            onChange={handleInputChange}
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
      <p className="mb-2">總共{filteredItems.length}筆紀錄</p>
      <Virtuoso
        useWindowScroll
        className="min-h-8"
        data={filteredItems}
        itemContent={(_, item) => <Fragment key={item._id}>{formatLog(item)}</Fragment>}
      />
    </div>
  )
}
