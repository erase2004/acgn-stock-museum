import { z } from 'astro/zod'
import { getAccountUrl } from '@/libs/routes'
import { styledValidateTypeMarkHtml } from '@/utils/helpers'
import { escape } from 'lodash-es'
import { useEffect, useState } from 'preact/hooks'
import { schema as schemaUserArchive } from '@/services/dbUserArchive'
import { getUser } from '@/libs/request'
import { SpecialUser } from '@/services/dbUsers'

const specialUserDisplayNameMap: Record<string, string> = {
  [SpecialUser.NONE]: '無',
  [SpecialUser.SYSTEM]: '系統',
  [SpecialUser.FSC]: '金管會',
}

const defaultText = '???'

type Props = {
  round: string
  userId?: string
}

export default function UserLink({ round, userId }: Props) {
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

    getUser(round, userId)
      .then(async (response) => {
        const { name, status, validateType } = await z
          .promise(schemaUserArchive)
          .parse(response.json())

        displayText =
          `${styledValidateTypeMarkHtml(validateType)}${escape(name)}`.trim() || defaultText

        if (status === 'registered') {
          const path = getAccountUrl(round, userId)
          setHtml(<a href={path} dangerouslySetInnerHTML={{ __html: displayText }}></a>)
          return
        }

        setHtml(<span dangerouslySetInnerHTML={{ __html: displayText }} />)
      })
      .catch(() => {
        displayText = defaultText

        setHtml(<span>{displayText}</span>)
      })
  }, [userId])

  return html
}
