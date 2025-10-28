import CompanyLink from '@/components/common/preact/CompanyLink'
import UserLink from '@/components/common/preact/UserLink'
import { formatDateTimeText } from '@/libs/timeFormat'
import type { BasicUser } from '@/services/dbUsers'
import { ownStocks } from '@/stores/account'
import { listViewMode, items, type ListItem } from '@/stores/company'
import { currencyFormat } from '@/utils/helpers'
import { useUser } from '@/utils/hooks'
import { useStore } from '@nanostores/preact'

type Props = {
  round: string
}

export default function ListContainer({ round }: Props) {
  const { user } = useUser()
  const $listViewMode = useStore(listViewMode)
  const $items = useStore(items)
  const $ownStocks = useStore(ownStocks)

  if ($listViewMode === 'card') {
    return (
      <div class="flex flex-wrap justify-around gap-y-6">
        {$items.map((item) => (
          <Card key={item._id} round={round} item={item} user={user} ownStocks={$ownStocks} />
        ))}
      </div>
    )
  }

  return (
    <div class="flex flex-col gap-y-6">
      {$items.map((item) => (
        <Row key={item._id} round={round} item={item} user={user} ownStocks={$ownStocks} />
      ))}
    </div>
  )
}

type User = BasicUser | null

const FALLBACK_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png'

type CardProps = {
  round: string
  item: ListItem
  user: User
  ownStocks: Record<string, number>
}

function Card({ round, item, user, ownStocks }: CardProps) {
  return (
    <div class="w-full max-w-80 px-4 sm:w-1/2 md:w-1/3 lg:w-1/4 2xl:w-1/6">
      <div
        class={`company-card card border border-base-content/25 shadow-lg/50 ${cardDisplayClass(item, user, ownStocks)}`}
      >
        <div class="flex items-center justify-between border-b border-inherit px-4">
          <small>{formatDateTimeText(item.createdAt)} 創立</small>
          {user && (
            <>
              {isFavorite(item._id, user) ? (
                <i class="fa fa-heart text-secondary" aria-hidden="true"></i>
              ) : (
                <i class="fa fa-heart-o text-secondary" aria-hidden="true"></i>
              )}
            </>
          )}
        </div>
        {item.illegalReason && (
          <div class="truncate border-b border-inherit text-center text-error">
            <i class="fa fa-warning"></i>
            {item.illegalReason}
          </div>
        )}
        <div class="flex justify-around py-1">
          <div class="flex flex-col self-center">
            <img
              class="size-40 object-cover"
              src={item.pictureSmall || FALLBACK_IMAGE}
              alt={`${item.companyName}公司的小圖`}
            />
          </div>
        </div>
        <div class="title truncate text-center text-2xl text-neutral-content *:mx-1.5 *:text-inherit">
          <CompanyLink round={round} companyId={item._id} />
        </div>
        <div class="flex flex-col border-b border-inherit px-4">
          <div>
            <p>{item.chairmanTitle}</p>
            <p class="truncate text-right text-2xl">
              <UserLink round={round} userId={item.chairman} />
            </p>
          </div>
          <div>
            <p>經理人</p>
            <p class="truncate text-right text-2xl">
              <UserLink round={round} userId={item.manager} />
            </p>
          </div>
        </div>
        <div class="flex flex-col gap-y-0.5 px-4 py-2 *:flex *:flex-wrap *:justify-between *:gap-x-1 *:text-nowrap">
          <div>
            <p>股票價格</p>
            <p class={priceDisplayClass(item)}>
              $ {currencyFormat(item.lastPrice)}({currencyFormat(item.listPrice)})
            </p>
          </div>
          <div>
            <p>資本額</p>
            <p>$ {currencyFormat(item.capital)}</p>
          </div>
          <div>
            <p>總市值</p>
            <p>$ {currencyFormat(item.totalValue)}</p>
          </div>
          <div>
            <p>總釋股量</p>
            <p>{item.totalRelease}</p>
          </div>
          <div>
            <p>每股盈餘</p>
            <p>{currencyFormat(item.eps)}</p>
          </div>
          {user && (
            <div>
              <p>持有股份</p>
              <p>
                {getStockAmount(item, ownStocks)} (
                {getStockPercentage(item, getStockAmount(item, ownStocks))}%)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function cardDisplayClass(company: ListItem, user: User, ownStocks: Record<string, number>) {
  if (!user) return 'company-card-default'

  const userId = user._id

  if (company.chairman === userId) return 'company-card-chairman'

  if (company.manager === userId) return 'company-card-manager'

  if (company.founder === userId) return 'company-card-founder'

  if (company._id in ownStocks) return 'company-card-holder'

  return 'company-card-default'
}

function isFavorite(companyId: string, user: User) {
  if (!user || !user.favorite) return false

  return user.favorite.includes(companyId)
}

function priceDisplayClass(item: ListItem) {
  const { lastPrice, listPrice } = item

  if (lastPrice > listPrice) return 'text-error'

  if (listPrice > lastPrice) return 'text-success'

  return ''
}

function getStockAmount(item: ListItem, ownStocks: Record<string, number>) {
  return ownStocks[item._id] || 0
}

function getStockPercentage(item: ListItem, stocks: number = 0) {
  return Math.round((stocks / item.totalRelease) * 10000) / 100
}

type RowProps = {
  round: string
  item: ListItem
  user: User
  ownStocks: Record<string, number>
}
function Row({ round, item, user, ownStocks }: RowProps) {
  return (
    <div class="flex flex-col md:flex-row">
      <img
        class="size-28 shrink-0 object-cover"
        src={item.pictureSmall || FALLBACK_IMAGE}
        alt={`${item.companyName}公司的小圖`}
      />

      <div class="company-row grid grow grid-cols-3 border border-base-content/25 lg:grid-cols-4">
        {item.illegalReason && (
          <p class="col-span-full truncate text-center text-error">
            <i class="fa fa-warning"></i>
            本公司已被標記為違規！原因：{item.illegalReason}
          </p>
        )}
        <p class="title">角色名稱</p>
        <div class="content text-left lg:col-span-3">
          <CompanyLink round={round} companyId={item._id} />
        </div>

        <p class="title">創立日期</p>
        <div class="content">{formatDateTimeText(item.createdAt)}</div>

        <p class="title">{item.chairmanTitle}</p>
        <div class="content text-left">
          <UserLink round={round} userId={item.chairman} />
        </div>

        <p class="title">經理人</p>
        <div class="content text-left">
          <UserLink round={round} userId={item.manager} />
        </div>

        <p class="title">股票價格</p>
        <div class="content">
          <span class={priceDisplayClass(item)}>
            $ {currencyFormat(item.lastPrice)}({currencyFormat(item.listPrice)})
          </span>
        </div>

        <p class="title">資本額</p>
        <div class="content">$ {currencyFormat(item.capital)}</div>

        <p class="title">總市值</p>
        <div class="content">$ {currencyFormat(item.totalValue)}</div>

        <p class="title">總釋股量</p>
        <div class="content">{item.totalRelease}</div>

        <p class="title">每股盈餘</p>
        <div class="content">{currencyFormat(item.eps)}</div>

        {user && (
          <div class="col-span-full">
            <p>
              {isFavorite(item._id, user) ? '您已將此公司加入最愛。' : '您未將此公司加入最愛。'}
            </p>
            <p>
              您在該公司持有{getStockAmount(item, ownStocks)}數量的股份，股權比例為
              {getStockPercentage(item, getStockAmount(item, ownStocks))}%。
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
