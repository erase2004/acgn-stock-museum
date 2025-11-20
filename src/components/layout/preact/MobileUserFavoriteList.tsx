import SimpleCompanyLink from '@/components/common/preact/SimpleCompanyLink'
import { useUser } from '@/utils/hooks'

type Props = {
  round: string
}

export default function MobileUserFavoriteList({ round }: Props) {
  const { user } = useUser()
  if (!user) return <></>

  const { favoriteV2 } = user
  if (!favoriteV2.length) return <></>

  return (
    <div className="collapse-arrow collapse">
      <input type="checkbox" name="drawer-collpase" />
      <div className="collapse-title px-[calc(0.25rem*3)] py-[calc(0.25rem*1.5)]">我的最愛</div>
      <ul className="menu collapse-content ml-0 max-w-[75vw] flex-nowrap overflow-x-hidden bg-base-300">
        {favoriteV2.map((company) => (
          <li key={company._id} className="*:inline-block *:w-full *:truncate *:text-nowrap">
            <SimpleCompanyLink {...company} round={round} companyId={company._id} />
          </li>
        ))}
      </ul>
    </div>
  )
}
