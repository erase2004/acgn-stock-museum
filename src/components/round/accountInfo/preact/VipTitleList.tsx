import type { schema as schemaVip } from '@/services/dbVips'
import type { z } from 'astro/zod'
import CompanyTitle from './CompanyTitle'
import { Virtuoso } from 'react-virtuoso'
import { useState } from 'react'

type VIP = z.infer<typeof schemaVip>

type Props = {
  round: string
  data: Pick<VIP, 'companyId' | 'level'>[]
}

export default function VipTitleList({ round, data }: Props) {
  const [height, setHeight] = useState(0)

  return (
    <>
      <Virtuoso
        className="min-h-8"
        style={{ height }}
        totalListHeightChanged={(h) => setHeight(h)}
        data={data}
        components={{
          EmptyPlaceholder() {
            return '查無資料！'
          },
        }}
        itemContent={(_, item) => (
          <CompanyTitle
            key={item.companyId}
            round={round}
            companyId={item.companyId}
            title={`Level ${item.level} VIP`}
          />
        )}
      />
    </>
  )
}
