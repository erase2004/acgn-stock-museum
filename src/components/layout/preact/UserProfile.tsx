import type { SyntheticEvent } from 'react'
import { basicSchema, type ValidateType } from '@/services/dbUsers'
import { z } from 'astro/zod'
import { useEffect, useRef, useState } from 'react'
import { useUser } from '@/utils/hooks'
import { currencyFormat, styledValidateTypeMarkHtml } from '@/utils/helpers'
import { getStoneIcon, stoneDisplayName } from '@/utils/stone'
import {
  getAccountUrl,
  getOwnStockJsonUrl,
  getOwnProductValueJsonUrl,
  getPageTitle,
  PAGE,
} from '@/libs/routes'
import { stoneTypeList } from '@/services/dbCompanyStones'
import { schema as schemaDirector } from '@/services/dbDirectors'
import { ownStocks, companyProductTotal } from '@/stores/account'
import { map, zipObject } from 'lodash-es'
import { firestore } from '@/libs/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { FIRST_ROUND } from '@/configs/sites'

type Props = {
  round: string
}

async function updateUserStock(round: string, userId: string) {
  const schema = z.preprocess(
    (value) => {
      // @ts-expect-error: treat value as any
      return { companyId: value.c, stocks: value.s }
    },
    schemaDirector.pick({
      companyId: true,
      stocks: true,
    }),
  )

  const jsonUrl = getOwnStockJsonUrl(round)
  return await fetch(jsonUrl)
    .then(async (response) => {
      const dict = await z.promise(z.record(z.string(), schema.array())).parse(response.json())

      if (userId in dict) {
        const data = dict[userId]
        ownStocks.set(zipObject(map(data, 'companyId'), map(data, 'stocks')))
      }
    })
    .catch(() => {
      ownStocks.set({})
    })
}

async function updateUserCompanyProductTotal(round: string, userId: string) {
  const schema = z.record(z.string(), z.record(z.string(), z.number()))

  const jsonUrl = getOwnProductValueJsonUrl(round)
  return await fetch(jsonUrl)
    .then(async (response) => {
      const dict = await z.promise(schema).parse(response.json())

      if (userId in dict) {
        const data = dict[userId]
        companyProductTotal.set(data)
      }
    })
    .catch(() => {
      companyProductTotal.set({})
    })
}

export default function UserProfile({ round }: Props) {
  const { user, setUser, resetUser } = useUser()
  const [isInitialized, setIsInitialized] = useState(false)
  const [validateMethod, setValidateMethod] = useState<ValidateType | ''>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [shouldShowError, setShouldShowError] = useState(false)
  const dropdownRef = useRef<HTMLDetailsElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const isFirstRound = round === FIRST_ROUND

  const collectionRef = collection(firestore, round)

  function resetForm() {
    setValidateMethod('')
    setShouldShowError(false)
    setIsProcessing(false)
  }

  function changeValidateMethod(method: ValidateType | '') {
    resetForm()
    setValidateMethod(method)
  }

  async function tryLogin(
    name: string,
    validateType: string,
  ): Promise<[true, z.infer<typeof basicSchema>] | [false, undefined]> {
    const q = query(
      collectionRef,
      where('profile.name', '==', name),
      where('profile.validateType', '==', validateType),
    )

    try {
      const snapshot = await getDocs(q)

      if (snapshot.size !== 1) return [false, undefined]

      let raw
      snapshot.forEach((doc) => {
        raw = doc.data()
      })

      const { success, data } = basicSchema.safeParse(raw)

      if (success) return [success, data]
      else return [success, data]
    } catch (err) {
      console.error(err)

      return [false, undefined]
    }
  }

  async function login(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!validateMethod) return
    if (isProcessing) return

    setIsProcessing(true)

    const [success, data] = await tryLogin(inputRef.current?.value ?? '', validateMethod)

    setIsProcessing(false)

    if (!success) {
      setShouldShowError(true)
      resetUser()
      return
    }
    setUser(data)
    dropdownRef.current?.removeAttribute('open')
    updateUserStock(round, data._id)
    updateUserCompanyProductTotal(round, data._id)
  }

  async function logout() {
    resetForm()
    resetUser()
    dropdownRef.current?.removeAttribute('open')
    ownStocks.set({})
    companyProductTotal.set({})
  }

  const placeHolder =
    validateMethod === 'PTT'
      ? '請輸入您的PTT帳號'
      : validateMethod === 'Google'
        ? '請輸入您完整的 Google 帳號'
        : validateMethod === 'Bahamut'
          ? '請輸入您的巴哈姆特帳號'
          : '不支援的認證方式'

  useEffect(() => {
    if (user) {
      // 處理使用者在賽季間切換的情況

      tryLogin(user.profile.name, user.profile.validateType)
        .then(([_, data]) => {
          if (data) {
            setUser(data)
            return Promise.allSettled([
              updateUserStock(round, data._id),
              updateUserCompanyProductTotal(round, data._id),
            ])
          } else resetUser()
        })
        .finally(() => setIsInitialized(true))
    } else {
      setIsInitialized(true)
    }
  }, [])

  if (!isInitialized)
    return (
      <div className="loading mx-4 inline-block h-8 loading-bars md:relative *:[summary]:px-2"></div>
    )

  return (
    <details className="group/user dropdown z-20 md:relative" ref={dropdownRef}>
      {user ? (
        <>
          <summary
            className="ignore-inherit btn max-w-full text-nowrap text-info"
            title={`當前登入使用者：${user.profile.name}`}
          >
            <i className="fa fa-user-o" aria-hidden="true"></i>
            <span
              dangerouslySetInnerHTML={{
                __html: styledValidateTypeMarkHtml(user.profile.validateType),
              }}
            />
            <p className="inline-block truncate">{user.profile.name}</p>
            <i className="fa fa-chevron-down group-open/user:hidden!"></i>
            <i className="fa fa-chevron-up hidden! group-open/user:inline-block!"></i>
          </summary>
          <div className="dropdown-content menu w-40 gap-y-1 rounded-box bg-base-300 text-base shadow-sm *:flex *:items-center *:justify-between">
            <a href={getAccountUrl(round, user._id)} className="ignore-inherit" title="帳號資訊">
              <i className="fa fa-user-circle" aria-hidden="true"></i>
              <span>{getPageTitle(PAGE.ACCOUNT_INFO)}</span>
            </a>
            <div title={`現有資金：${user.profile.money}`}>
              <i className="fa fa-usd" aria-hidden="true"></i>
              <span>{currencyFormat(user.profile.money)}</span>
            </div>
            {!isFirstRound && (
              <div title={`現有消費券：${user.profile.vouchers}`}>
                <i className="fa fa-money" aria-hidden="true"></i>
                <span>{currencyFormat(user.profile.vouchers)}</span>
              </div>
            )}
            <div title={`現有推薦票：${user.profile.voteTickets}`}>
              {isFirstRound ? (
                <i className="fa fa-money" aria-hidden="true"></i>
              ) : (
                <i className="fa fa-ticket" aria-hidden="true"></i>
              )}
              <span>{currencyFormat(user.profile.voteTickets)}</span>
            </div>
            {stoneTypeList.map((type) => (
              <div
                key={type}
                title={`現有${stoneDisplayName(type)}：${user.profile.stones[type]}個`}
              >
                <img className="size-4" src={getStoneIcon(type)} title={stoneDisplayName(type)} />
                <span>{user.profile.stones[type]}</span>
              </div>
            ))}
            <div className="divider m-0"></div>
            <a className="ignore-inherit" title="登出" href="#" onClick={logout}>
              <i className="fa fa-sign-out" aria-hidden="true"></i>
              <span>登出</span>
            </a>
          </div>
        </>
      ) : (
        <>
          <summary className="ignore-nherit btn">
            未登入
            <i className="fa fa-chevron-down group-open/user:hidden!"></i>
            <i className="fa fa-chevron-up hidden! group-open/user:inline-block!"></i>
          </summary>
          <ul className="dropdown-content menu rounded-box bg-base-300 shadow-sm">
            {validateMethod !== '' ? (
              <div className="flex w-auto min-w-2xs flex-col">
                <form className="join" onSubmit={login}>
                  <input
                    className="input join-item"
                    type="text"
                    placeholder={placeHolder}
                    ref={inputRef}
                  />
                  <button
                    type="button"
                    className="btn join-item"
                    onClick={() => changeValidateMethod('')}
                  >
                    取消
                  </button>
                  <button type="submit" className="ignore-inherit btn join-item btn-primary">
                    登入
                  </button>
                </form>
                {shouldShowError && (
                  <p className="ignore-inherit text-error">登入失敗，請重新嘗試</p>
                )}
                {isProcessing && (
                  <p>
                    登入中<span className="loading loading-dots"></span>
                  </p>
                )}
              </div>
            ) : (
              <>
                <li>
                  <button className="text-nowrap" onClick={() => changeValidateMethod('PTT')}>
                    以PTT帳號登入
                  </button>
                </li>
                <li>
                  <button className="text-nowrap" onClick={() => changeValidateMethod('Bahamut')}>
                    以巴哈姆特帳號登入
                  </button>
                </li>
                <li>
                  <button className="text-nowrap" onClick={() => changeValidateMethod('Google')}>
                    以Google帳號登入
                  </button>
                </li>
              </>
            )}
          </ul>
        </>
      )}
    </details>
  )
}
