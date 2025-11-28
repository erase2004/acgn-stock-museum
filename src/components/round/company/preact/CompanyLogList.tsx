import type { z } from 'astro/zod'
import DisplayLog from '@/components/common/preact/DisplayLog'
import { schema } from '@/services/dbLog'
import { Virtuoso } from 'react-virtuoso'
import { useState, useEffect } from 'react'
import { useFilter, useUser } from '@/utils/hooks'
import { dataStoreKey } from '@/configs/general'
import { intersection, isArray, isString } from 'lodash-es'
import { getCompanyLogJsonUrl } from '@/libs/routes'

const STORE_KEY = dataStoreKey.company.log

type Log = z.infer<typeof schema>
type Props = {
  round: string
  companyId: string
}

export default function CompanyLogList({ round, companyId }: Props) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [data, setData] = useState<Log[]>([])
  const [filterOn, setFilterOn] = useState(false)
  const { user } = useUser()

  const { filteredItems, setFilterValue } = useFilter(
    STORE_KEY,
    data,
    {
      filterFn(item, filters) {
        {
          // userId
          const key = 'userId'
          const target = filters[key]
          const value = item[key]

          if (!isArray(value)) return false

          if (isArray(target)) {
            const inter = intersection(value, target)
            return inter.length > 0
          }

          if (isString(target)) return value.includes(target)

          return true
        }
      },
    },
    false,
  )

  useEffect(() => {
    if (!user) {
      setFilterValue('userId', undefined)
      setFilterOn(false)
    }
  }, [user])

  useEffect(() => {
    if (isInitialized) return

    const jsonUrl = getCompanyLogJsonUrl(round, companyId)
    import(/* @vite-ignore */ jsonUrl)
      .then((module) => {
        const result = schema.array().parse(module.data)
        setData(result)
      })
      .finally(() => setIsInitialized(true))
  }, [])

  function toggleFilter() {
    if (filterOn) {
      setFilterValue('userId', undefined)
      setFilterOn(false)
    } else {
      setFilterValue('userId', [user!._id, '!all'])
      setFilterOn(true)
    }
  }

  if (!isInitialized) {
    return <span className="loading loading-xl loading-spinner"></span>
  }

  return (
    <>
      {user && (
        <div>
          <button className="btn mb-1 btn-outline btn-sm btn-info" onClick={toggleFilter}>
            {filterOn ? '只檢視自身紀錄' : '檢視所有紀錄'}
          </button>
        </div>
      )}
      {filteredItems.length > 0 && <p>總共{filteredItems.length}筆紀錄</p>}
      <Virtuoso
        useWindowScroll
        data={filteredItems}
        className="min-h-8"
        components={{
          EmptyPlaceholder() {
            return '查無紀錄'
          },
        }}
        itemContent={(_, item) => (
          <p key={item._id}>
            <DisplayLog {...item} round={round} />
          </p>
        )}
      />
    </>
  )
}
