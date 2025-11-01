import type { UserArchive } from '@/stores/common'
import { userArchiveDict } from '@/stores/common'

type Props = {
  userArchiveData: Record<string, UserArchive>
}

export default function DataStoreInitialization({ userArchiveData }: Props) {
  userArchiveDict.set(userArchiveData)

  return <></>
}
