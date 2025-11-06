import DisplayLog from '@/components/common/preact/DisplayLog'
import LoadMore from '@/components/common/preact/LoadMore'
import { z } from 'astro/zod'
import { useFilter } from '@/utils/hooks'
import { logTypeGroupMap, type schema } from '@/services/dbLog'
import { flatten, isArray, without } from 'lodash-es'
import { useEffect, useRef } from 'preact/hooks'
import { dataNumberPerPage, dataStoreKey } from '@/configs/general'

const PAGE_SIZE = dataNumberPerPage.account.log
const STORE_KEY = dataStoreKey.account.log

type Data = z.infer<typeof schema>

type Props = {
  round: string
  data: Data[]
}

function isSelected(key: string, filter: Record<string, string | string[]>) {
  return isArray(filter['logType']) ? filter['logType'].includes(key) : true
}

export default function LogList({ round, data }: Props) {
  const isInitialized = useRef(false)

  const { setFilterValue, filterObject, filteredItems } = useFilter(
    STORE_KEY,
    PAGE_SIZE,
    data,
    {
      filterFn(item, filters) {
        {
          // logType
          const key = 'logType'
          const target = filters[key]
          const value = item[key]

          if (!isArray(target)) return false

          if (target.length === 0) return false

          const logTypes = flatten(
            target.map((key) => {
              if (key in logTypeGroupMap) {
                return logTypeGroupMap[key as keyof typeof logTypeGroupMap].logTypes
              }
              return []
            }),
          )

          // @ts-expect-error: 「聊天發言」不在其中
          return logTypes.includes(value)
        }
      },
    },
    false,
  )

  useEffect(() => {
    if (isInitialized.current) return

    selectAll()
  }, [])

  function selectAll() {
    setFilterValue('logType', Object.keys(logTypeGroupMap))
  }

  function unselectAll() {
    setFilterValue('logType', [])
  }

  function onOptionSelected(key: keyof typeof logTypeGroupMap) {
    const selectedOptions = isArray(filterObject['logType']) ? filterObject['logType'] : []
    selectedOptions.push(key)
    setFilterValue('logType', selectedOptions)
  }

  function onOptionUnselected(key: keyof typeof logTypeGroupMap) {
    const selectedOptions = isArray(filterObject['logType']) ? filterObject['logType'] : []

    setFilterValue('logType', without(selectedOptions, key))
  }

  return (
    <>
      <div class="flex flex-col gap-y-1">
        <div class="flex items-center gap-1">
          顯示分類：
          <button class="btn btn-outline btn-sm" onClick={selectAll}>
            全部選擇
          </button>
          <button class="btn btn-outline btn-sm" onClick={unselectAll}>
            全部清除
          </button>
        </div>
        <div class="flex flex-wrap gap-1">
          {Object.entries(logTypeGroupMap).map(([key, config]) =>
            isSelected(key, filterObject) ? (
              <button
                key={key}
                class="btn btn-sm btn-info"
                onClick={() => onOptionUnselected(key as keyof typeof logTypeGroupMap)}
              >
                <i class="fa fa-check-square-o"></i>
                {config.displayName}
              </button>
            ) : (
              <button
                key={key}
                class="btn btn-outline btn-sm btn-info"
                onClick={() => onOptionSelected(key as keyof typeof logTypeGroupMap)}
              >
                <i class="fa fa-square-o"></i>
                {config.displayName}
              </button>
            ),
          )}
        </div>
      </div>
      <div className="overflow-y-auto">
        {filteredItems.map((item) => (
          <p>
            <DisplayLog {...item} key={item._id} round={round} />
          </p>
        ))}
        <LoadMore storeKey={STORE_KEY} />
      </div>
    </>
  )
}
