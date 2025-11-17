import type { schema } from '@/services/dbProducts'
import type { z } from 'astro/zod'
import ProductLink from '@/components/common/preact/ProductLink'
import LoadMore from '@/components/common/preact/LoadMore'
import { dataNumberPerPage, dataStoreKey } from '@/configs/general'
import { useDisplayItems } from '@/utils/hooks'
import { isRestrictedRating } from '@/utils/product'

const PAGE_SIZE = dataNumberPerPage.company.product
const STORE_KEY = dataStoreKey.company.product

type Product = z.infer<typeof schema>
type Props = {
  data: Product[]
}

export default function ProductListForFirstRound({ data }: Props) {
  const displayItems = useDisplayItems(data, STORE_KEY, PAGE_SIZE)

  return (
    <>
      {displayItems.length ? (
        displayItems.map((item) => <ProductCard key={item._id} item={item} />)
      ) : (
        <em className="col-span-full">哦不！本季沒有推出任何產品！</em>
      )}
      <div className="col-span-full">
        <LoadMore storeKey={STORE_KEY} />
      </div>
    </>
  )
}

type CardProps = {
  item: Product
}

function ProductCard({ item: { _id, rating, type, description, voteCount } }: CardProps) {
  return (
    <div className="card-border card col-span-full overflow-hidden border-base-content/25 lg:col-span-1">
      <div className="card-title flex justify-between bg-base-200 px-4 py-2 text-base font-normal">
        <small>識別碼：{_id}</small>
        <span className="badge items-baseline badge-soft badge-info">
          {voteCount}
          <i className="fa fa-money" aria-hidden="true"></i>
        </span>
      </div>
      <div className="card-body p-4">
        <div className="flex gap-1 text-xl text-nowrap *:last:truncate">
          <span className="badge badge-neutral">{type}</span>
          {isRestrictedRating(rating) && <span className="badge badge-error">{rating}</span>}
          <ProductLink productId={_id} />
        </div>
        <p>{description}</p>
      </div>
    </div>
  )
}
