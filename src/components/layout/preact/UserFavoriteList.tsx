import CompanyLink from '@/components/common/preact/CompanyLink'
import { useUser } from '@/utils/hooks'

type Props = {
  round: string
}

export default function UserFavoriteList({ round }: Props) {
  const { user } = useUser()
  if (!user) return <></>

  const { favorite } = user
  if (!favorite.length) return <></>

  return (
    <div>
      <li className="dropdown dropdown-start">
        <div className="menu-dropdown-toggle whitespace-nowrap" tabIndex={0} role="button">
          我的最愛
        </div>
        <ul className="dropdown-content menu ml-0 max-h-[50dvh] flex-nowrap overflow-y-auto bg-base-300 text-base">
          {favorite.map((companyId) => (
            <li key={companyId} className="*:text-nowrap">
              <CompanyLink round={round} companyId={companyId} />
            </li>
          ))}
        </ul>
      </li>
    </div>
  )
}
