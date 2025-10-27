import type { ValidateType } from '@/services/dbUsers'
import { useRef, useState } from 'preact/hooks'
import { actions } from 'astro:actions'
import { useUser } from '@/utils/hooks'
import {
  currencyFormat,
  getStoneIcon,
  stoneDisplayName,
  styledValidateTypeMarkHtml,
} from '@/utils/helpers'
import { getAccountUrl, getPageTitle, PAGE } from '@/libs/routes'
import { stoneTypeList } from '@/services/dbCompanyStones'

type Props = {
  round: string
}

export default function UserProfile({ round }: Props) {
  const { user, setUser, resetUser } = useUser()
  const [validateMethod, setValidateMethod] = useState<ValidateType | ''>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [shouldShowError, setShouldShowError] = useState(false)
  const dropdownRef = useRef<HTMLDetailsElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function resetForm() {
    setValidateMethod('')
    setShouldShowError(false)
    setIsProcessing(false)
  }

  function changeValidateMethod(method: ValidateType | '') {
    resetForm()
    setValidateMethod(method)
  }

  async function login() {
    if (!validateMethod) return
    if (isProcessing) return

    setIsProcessing(true)

    const { data, error } = await actions.user.login({
      round,
      name: inputRef.current?.value ?? '',
      type: validateMethod,
    })

    setIsProcessing(false)

    if (error) {
      setShouldShowError(true)
      resetUser()
      return
    }
    setUser(data)
    dropdownRef.current?.removeAttribute('open')
  }

  async function logout() {
    await actions.user.logout()
    resetForm()
    resetUser()
    dropdownRef.current?.removeAttribute('open')
  }

  const placeHolder =
    validateMethod === 'PTT'
      ? '請輸入您的PTT帳號'
      : validateMethod === 'Google'
        ? '請輸入您完整的 Google 帳號'
        : validateMethod === 'Bahamut'
          ? '請輸入您的巴哈姆特帳號'
          : '不支援的認證方式'

  return (
    <details class="group/user dropdown absolute z-0 mr-2 md:relative" ref={dropdownRef}>
      {user ? (
        <>
          <summary
            class="ignore-inherit btn max-w-60 text-nowrap text-info"
            title={`當前登入使用者：${user.profile.name}`}
          >
            <i class="fa fa-user-o" aria-hidden="true"></i>
            <span
              dangerouslySetInnerHTML={{
                __html: styledValidateTypeMarkHtml(user.profile.validateType),
              }}
            />
            <p class="inline-block truncate">{user.profile.name}</p>
            <i class="fa fa-chevron-up group-open/user:hidden!"></i>
            <i class="fa fa-chevron-down hidden! group-open/user:inline-block!"></i>
          </summary>
          <div class="dropdown-content menu w-40 gap-y-1 rounded-box bg-base-300 text-base shadow-sm *:flex *:items-center *:justify-between">
            <a href={getAccountUrl(round, user._id)} class="ignore-inherit" title="帳號資訊">
              <i class="fa fa-user-circle" aria-hidden="true"></i>
              <span>{getPageTitle(PAGE.ACCOUNT_INFO)}</span>
            </a>
            <div title={`現有資金：${user.profile.money}`}>
              <i class="fa fa-usd" aria-hidden="true"></i>
              <span>{currencyFormat(user.profile.money)}</span>
            </div>
            <div title={`現有消費券：${user.profile.vouchers}`}>
              <i class="fa fa-money" aria-hidden="true"></i>
              <span>{currencyFormat(user.profile.vouchers)}</span>
            </div>
            <div title={`現有推薦票：${user.profile.voteTickets}`}>
              <i class="fa fa-ticket" aria-hidden="true"></i>
              <span>{currencyFormat(user.profile.voteTickets)}</span>
            </div>
            {stoneTypeList.map((type) => (
              <div title={`現有${stoneDisplayName(type)}：${user.profile.stones[type]}個`}>
                <img class="size-4" src={getStoneIcon(type)} title={stoneDisplayName(type)} />
                <span>{user.profile.stones[type]}</span>
              </div>
            ))}
            <div class="divider m-0"></div>
            <a class="ignore-inherit" title="登出" href="#" onClick={logout}>
              <i class="fa fa-sign-out" aria-hidden="true"></i>
              <span>登出</span>
            </a>
          </div>
        </>
      ) : (
        <>
          <summary class="ignore-nherit btn">
            未登入
            <i class="fa fa-chevron-up group-open/user:hidden!"></i>
            <i class="fa fa-chevron-down hidden! group-open/user:inline-block!"></i>
          </summary>
          <ul class="dropdown-content menu rounded-box bg-base-300 shadow-sm">
            {validateMethod !== '' ? (
              <div class="flex w-max flex-col">
                <div class="join">
                  <input
                    class="input join-item"
                    type="text"
                    placeholder={placeHolder}
                    ref={inputRef}
                  />
                  <button class="btn join-item" onClick={() => changeValidateMethod('')}>
                    取消
                  </button>
                  <button class="ignore-inherit btn join-item btn-primary" onClick={login}>
                    登入
                  </button>
                </div>
                {shouldShowError && <p class="ignore-inherit text-error">登入失敗，請重新嘗試</p>}
                {isProcessing && (
                  <p>
                    登入中<span class="loading loading-dots"></span>
                  </p>
                )}
              </div>
            ) : (
              <>
                <li>
                  <button class="text-nowrap" onClick={() => changeValidateMethod('PTT')}>
                    以PTT帳號登入
                  </button>
                </li>
                <li>
                  <button class="text-nowrap" onClick={() => changeValidateMethod('Bahamut')}>
                    以巴哈姆特帳號登入
                  </button>
                </li>
                <li>
                  <button class="text-nowrap" onClick={() => changeValidateMethod('Google')}>
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
