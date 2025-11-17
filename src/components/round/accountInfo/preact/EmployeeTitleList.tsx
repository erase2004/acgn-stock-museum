import type { schema as schemaEmployee } from '@/services/dbEmployees'
import type { z } from 'astro/zod'
import CompanyTitle from './CompanyTitle'
import { Virtuoso } from 'react-virtuoso'
import { useState } from 'react'

type Employee = z.infer<typeof schemaEmployee>

type Props = {
  round: string
  data: (Pick<Employee, '_id' | 'companyId' | 'employed'> & { isSeal: boolean })[]
}

export default function EmployeeTitleList({ round, data }: Props) {
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
            companyId={item.companyId}
            isSeal={item.isSeal}
            title={item.employed ? '員工' : '儲備員工'}
          />
        )}
      />
    </>
  )
}
