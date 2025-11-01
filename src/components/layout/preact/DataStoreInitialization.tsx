import type { CompanyArchive, UserArchive, Product } from '@/stores/common'
import { userArchiveDict, companyArchiveDict, productDict } from '@/stores/common'

type Props = {
  userArchiveData: Record<string, UserArchive>
  companyArchiveData: Record<string, CompanyArchive>
  productData: Record<string, Product>
}

export default function DataStoreInitialization({
  userArchiveData,
  companyArchiveData,
  productData,
}: Props) {
  userArchiveDict.set(userArchiveData)
  companyArchiveDict.set(companyArchiveData)
  productDict.set(productData)

  return <></>
}
