import type { schema as schemaCompany } from '@/services/dbCompanies'
import type { z } from 'astro/zod'
import CompanyLink from '@/components/common/preact/CompanyLink'
import { Virtuoso } from 'react-virtuoso'
import { useState } from 'react'

type Company = z.infer<typeof schemaCompany>

type Props = {
  round: string
  data: Pick<Company, '_id' | 'chairmanTitle'>[]
}

export default function ChairmanTitleList({ round, data }: Props) {
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
          <div className="flex flex-nowrap text-primary" key={item._id}>
            <span className="text-nowrap">是「</span>
            <span className="inline-block max-w-[calc(100%-11rem)] truncate">
              <CompanyLink round={round} companyId={item._id} />
            </span>
            <span className="text-nowrap">」公司的「</span>
            <span className="inline-block max-w-[calc(100%-11rem)] truncate">
              {item.chairmanTitle}
            </span>
            <span className="text-nowrap">」</span>
          </div>
        )}
      />
    </>
  )
}
