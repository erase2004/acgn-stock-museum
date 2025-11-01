import type { CompanyArchive, UserArchive } from '@/stores/common'
import { userArchiveDict, companyArchiveDict } from '@/stores/common'

type Props = {
  userArchiveData: Record<string, UserArchive>
  companyArchiveData: Record<string, CompanyArchive>
}

export default function DataStoreInitialization({ userArchiveData, companyArchiveData }: Props) {
  userArchiveDict.set(userArchiveData)
  companyArchiveDict.set(companyArchiveData)

  return <></>
}
