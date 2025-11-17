import type { schema as schemaCompany } from '@/services/dbCompanies'
import type { z } from 'astro/zod'
import CompanyTitle from './CompanyTitle'
import { Virtuoso } from 'react-virtuoso'
import { useState } from 'react'

type Company = z.infer<typeof schemaCompany>

type Props = {
  round: string
  data: Pick<Company, '_id' | 'isSeal'>[]
}

export default function ManagerTitleList({ round, data }: Props) {
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
            key={item._id}
            round={round}
            companyId={item._id}
            isSeal={item.isSeal}
            title="經理人"
          />
        )}
      />
    </>
  )
}
