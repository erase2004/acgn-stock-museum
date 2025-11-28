import DisplayLog from '@/components/common/preact/DisplayLog'
import { Virtuoso } from 'react-virtuoso'
import { z } from 'astro/zod'
import { useFilter } from '@/utils/hooks'
import { logTypeGroupMap, schema } from '@/services/dbLog'
import { flatten, isArray, without } from 'lodash-es'
import { useEffect, useState } from 'react'
import { dataStoreKey } from '@/configs/general'
import { getAccountLogJsonUrl } from '@/libs/json-data'

const STORE_KEY = dataStoreKey.account.log

type Data = z.infer<typeof schema>

type Props = {
  round: string
  userId: string
}

function isSelected(key: string, filter: Record<string, string | string[]>) {
  return isArray(filter['logType']) ? filter['logType'].includes(key) : true
}

export default function LogList({ round, userId }: Props) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [data, setData] = useState<Data[]>([])
  const [height, setHeight] = useState(0)

  const { setFilterValue, filterObject, filteredItems } = useFilter(
    STORE_KEY,
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
    if (isInitialized) return

    selectAll()

    const jsonUrl = getAccountLogJsonUrl(round, userId)
    import(/* @vite-ignore */ jsonUrl)
      .then((module) => {
        const result = schema.array().parse(module.data)
        setData(result)
      })
      .finally(() => {
        setIsInitialized(true)
      })
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

  if (!isInitialized) {
    return <span className="loading loading-xl loading-spinner"></span>
  }

  return (
    <>
      <div className="flex flex-col gap-y-1">
        <div className="flex items-center gap-1">
          顯示分類：
          <button className="btn btn-outline btn-sm" onClick={selectAll}>
            全部選擇
          </button>
          <button className="btn btn-outline btn-sm" onClick={unselectAll}>
            全部清除
          </button>
        </div>
        <div className="flex flex-wrap gap-1">
          {Object.entries(logTypeGroupMap).map(([key, config]) =>
            isSelected(key, filterObject) ? (
              <button
                key={key}
                className="btn btn-xs btn-info md:btn-sm"
                onClick={() => onOptionUnselected(key as keyof typeof logTypeGroupMap)}
              >
                <i className="fa fa-check-square-o"></i>
                {config.displayName}
              </button>
            ) : (
              <button
                key={key}
                className="btn btn-outline btn-sm btn-info"
                onClick={() => onOptionSelected(key as keyof typeof logTypeGroupMap)}
              >
                <i className="fa fa-square-o"></i>
                {config.displayName}
              </button>
            ),
          )}
        </div>
      </div>
      <p>總共{filteredItems.length}筆紀錄</p>
      <Virtuoso
        className="min-h-8"
        style={{ height }}
        totalListHeightChanged={(h) => setHeight(h)}
        data={filteredItems}
        itemContent={(_, item) => (
          <p key={item._id}>
            <DisplayLog {...item} key={item._id} round={round} />
          </p>
        )}
      />
    </>
  )
}
