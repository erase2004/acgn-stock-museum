import {
  productReplenishBaseAmountTypeDisplayName,
  productReplenishBatchSizeTypeDisplayName,
  type schema,
} from '@/services/dbProducts'
import type { z } from 'astro/zod'
import ProductLink from '@/components/common/preact/ProductLink'
import LoadMore from '@/components/common/preact/LoadMore'
import { dataNumberPerPage, dataStoreKey } from '@/configs/general'
import { useDisplayItems, useUser } from '@/utils/hooks'
import { currencyFormat } from '@/utils/helpers'
import { isRestrictedRating } from '@/utils/product'

const PAGE_SIZE = dataNumberPerPage.company.product
const STORE_KEY = dataStoreKey.company.product

type Product = z.infer<typeof schema>
type Props = {
  round: string
  manager: string
  data: Product[]
}

export default function ProductList({ round, manager, data }: Props) {
  const { user } = useUser()
  const displayItems = useDisplayItems(data, STORE_KEY, PAGE_SIZE)
  const isCompanyManager = user ? user._id === manager : false

  return (
    <>
      {displayItems.length ? (
        displayItems.map((item) => (
          <ProductCard
            key={item._id}
            item={item}
            round={round}
            isCompanyManager={isCompanyManager}
          />
        ))
      ) : (
        <em class="col-span-full">哦不！本季沒有推出任何產品！</em>
      )}
      <div class="col-span-full">
        <LoadMore storeKey={STORE_KEY} />
      </div>
    </>
  )
}

type CardProps = {
  round: string
  isCompanyManager: boolean
  item: Product
}

function ProductCard({
  item: {
    _id,
    rating,
    type,
    price,
    description,
    totalAmount,
    stockAmount,
    availableAmount,
    replenishBaseAmountType,
    replenishBatchSizeType,
  },
  round,
  isCompanyManager,
}: CardProps) {
  return (
    <div class="card-border card col-span-full overflow-hidden border-base-content/25 lg:col-span-1">
      <div class="card-title flex flex-col items-start gap-y-0 bg-base-200 px-4 py-2 text-base font-normal">
        <div class="flex gap-x-4">
          <span>價格：${currencyFormat(price)}</span>
          {stockAmount > 0 ? (
            <span class="text-warning">補貨中</span>
          ) : (
            <span class="text-error">已完售</span>
          )}
        </div>
        {isCompanyManager && (
          <div class="flex w-full flex-wrap items-baseline gap-x-4 text-info">
            <span>庫存：{stockAmount}</span>
            <span class="mr-auto">賣出：{totalAmount - stockAmount - availableAmount}</span>
            <span class="text-sm">
              方案：依{productReplenishBaseAmountTypeDisplayName(replenishBaseAmountType)}補
              {productReplenishBatchSizeTypeDisplayName(replenishBatchSizeType)}
            </span>
          </div>
        )}
      </div>
      <div class="card-body p-4">
        <div class="flex gap-1 text-xl text-nowrap *:last:truncate">
          <span class="badge badge-neutral">{type}</span>
          {isRestrictedRating(rating) && <span class="badge badge-error">{rating}</span>}
          <ProductLink round={round} productId={_id} />
        </div>
        <p>{description}</p>
        <small class="ml-auto">識別碼：{_id}</small>
      </div>
    </div>
  )
}
