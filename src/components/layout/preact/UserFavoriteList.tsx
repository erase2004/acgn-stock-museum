import SimpleCompanyLink from '@/components/common/preact/SimpleCompanyLink'
import { useUser } from '@/utils/hooks'

type Props = {
  round: string
}

export default function UserFavoriteList({ round }: Props) {
  const { user } = useUser()
  if (!user) return <></>

  const { favoriteV2 } = user
  if (!favoriteV2.length) return <></>

  return (
    <div>
      <li className="dropdown dropdown-start">
        <div className="menu-dropdown-toggle whitespace-nowrap" tabIndex={0} role="button">
          我的最愛
        </div>
        <ul className="dropdown-content menu ml-0 max-h-[50dvh] flex-nowrap overflow-y-auto bg-base-300 text-base">
          {favoriteV2.map((company) => (
            <li key={company._id} className="*:text-nowrap">
              <SimpleCompanyLink {...company} round={round} companyId={company._id} />
            </li>
          ))}
        </ul>
      </li>
    </div>
  )
}
