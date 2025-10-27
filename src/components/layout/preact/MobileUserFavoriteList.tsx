import CompanyLink from '@/components/common/preact/CompanyLink'
import { useUser } from '@/utils/hooks'

type Props = {
  round: string
}

export default function MobileUserFavoriteList({ round }: Props) {
  const { user } = useUser()
  if (!user) return <></>

  const { favorite } = user
  if (!favorite.length) return <></>

  return (
    <div class="collapse-arrow collapse">
      <input type="checkbox" name="drawer-collpase" />
      <div class="collapse-title px-[calc(0.25rem*3)] py-[calc(0.25rem*1.5)]">我的最愛</div>
      <ul class="menu collapse-content ml-0 max-w-[75vw] flex-nowrap overflow-x-hidden bg-base-300">
        {favorite.map((companyId) => (
          <li key={companyId} class="*:inline-block *:w-full *:truncate *:text-nowrap">
            <CompanyLink round={round} companyId={companyId} />
          </li>
        ))}
      </ul>
    </div>
  )
}
