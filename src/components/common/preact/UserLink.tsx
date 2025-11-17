import { getAccountUrl } from '@/libs/routes'
import { styledValidateTypeMarkHtml } from '@/utils/helpers'
import { escape } from 'lodash-es'
import { useEffect, useState } from 'react'
import { SpecialUser } from '@/services/dbUsers'
import { userArchiveDict } from '@/stores/common'
import { useStore } from '@nanostores/react'

const specialUserDisplayNameMap: Record<string, string> = {
  [SpecialUser.NONE]: '無',
  [SpecialUser.SYSTEM]: '系統',
  [SpecialUser.FSC]: '金管會',
}

const defaultText = '???'

type Props = {
  round: string
  userId?: string | null
}

export default function UserLink({ round, userId }: Props) {
  const $userArchiveDict = useStore(userArchiveDict)
  const [html, setHtml] = useState(<span></span>)

  useEffect(() => {
    let displayText: string = defaultText

    if (!userId) {
      displayText = '（無資料）'
      setHtml(<span>{displayText}</span>)
      return
    }

    if (userId in specialUserDisplayNameMap) {
      displayText = specialUserDisplayNameMap[userId]

      setHtml(<span>{displayText}</span>)
      return
    }

    if (!$userArchiveDict) {
      setHtml(<span>{displayText}</span>)
      return
    }

    const userData = $userArchiveDict[userId]

    if (!userData) {
      setHtml(<span>{displayText}</span>)
      return
    }

    const { name, status, validateType } = userData
    displayText = `${styledValidateTypeMarkHtml(validateType)}${escape(name)}`.trim() || defaultText

    if (status === 'registered') {
      const path = getAccountUrl(round, userId)
      setHtml(<a href={path} dangerouslySetInnerHTML={{ __html: displayText }}></a>)
      return
    }

    setHtml(<span dangerouslySetInnerHTML={{ __html: displayText }} />)
  }, [userId, $userArchiveDict])

  return html
}
