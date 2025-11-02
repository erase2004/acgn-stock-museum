import type { schema as shemaActionLog } from '@/services/dbViolationCaseActionLogs'
import type { stateMap, violatorSchema } from '@/services/dbViolationCases'
import type { z } from 'astro/zod'
import UserLink from '@/components/common/preact/UserLink'
import ActionLogReasonBlock from './ActionLogReasonBlock'
import Violator from './Violator'
import { formatDateTimeText } from '@/libs/timeFormat'
import { getViolationCaseUrl } from '@/libs/routes'

function stateTransitionActionText(state: keyof typeof stateMap) {
  switch (state) {
    case 'processing':
      return '開始處理本案件'
    case 'rejected':
      return '駁回了本案件'
    case 'closed':
      return '結束了本案件'
    default:
      return state
  }
}

type Props = z.infer<typeof shemaActionLog> & { round: string }

export default function ActionLog({ round, executedAt, executor, action, data }: Props) {
  let content: preact.JSX.Element

  switch (action) {
    case 'setState': {
      content = (
        <>
          <UserLink round={round} userId={executor} /> {stateTransitionActionText(data.state)}
          ，理由如下：
          <ActionLogReasonBlock reason={data.reason} />
        </>
      )
      break
    }
    case 'comment': {
      // 為第八季以前的邏輯
      content = (
        <>
          <UserLink round={round} userId={executor} /> 對案件增加了註解如下：
          <ActionLogReasonBlock reason={data.reason} />
        </>
      )
      break
    }
    case 'fscComment': {
      content = (
        <>
          金管會成員 <UserLink round={round} userId={executor} /> 對案件增加了註解如下：
          <ActionLogReasonBlock reason={data.reason} />
        </>
      )
      break
    }
    case 'informerComment': {
      content = (
        <>
          舉報人 {executor && <UserLink round={round} userId={executor} />} 對案件增加了說明如下：
          <ActionLogReasonBlock reason={data.reason} />
        </>
      )
      break
    }
    case 'violatorComment': {
      content = (
        <>
          違規人 <UserLink round={round} userId={executor} /> 對案件回報了說明如下：
          <ActionLogReasonBlock reason={data.reason} />
        </>
      )
      break
    }
    case 'addRelatedCase': {
      content = (
        <>
          <UserLink round={round} userId={executor} /> 將案件
          <a href={getViolationCaseUrl(round, data.relatedCaseId)}>{data.relatedCaseId}</a>
          加入為本案件的相關案件，理由如下：
          <ActionLogReasonBlock reason={data.reason} />
        </>
      )
      break
    }
    case 'removeRelatedCase': {
      content = (
        <>
          <UserLink round={round} userId={executor} /> 將案件
          <a href={getViolationCaseUrl(round, data.relatedCaseId)}>{data.relatedCaseId}</a>
          從本案件的相關案件中移除了，理由如下：
          <ActionLogReasonBlock reason={data.reason} />
        </>
      )
      break
    }
    case 'mergeViolatorsFromRelatedCase': {
      content = (
        <>
          <UserLink round={round} userId={executor} /> 把相關案件
          <a href={getViolationCaseUrl(round, data.relatedCaseId)}>{data.relatedCaseId}</a>
          的以下違規名單
          <ul>
            {data.newViolators.map((violator: z.infer<typeof violatorSchema>) => (
              <li key={violator.violatorId}>
                <Violator {...violator} round={round} />
              </li>
            ))}
          </ul>
          合併至本案件了，理由如下：
          <ActionLogReasonBlock reason={data.reason} />
        </>
      )
      break
    }
    case 'addViolator': {
      content = (
        <>
          <UserLink round={round} userId={executor} /> 將以下違規名單
          <ul>
            {data.newViolators.map((violator: z.infer<typeof violatorSchema>) => (
              <li key={violator.violatorId}>
                <Violator {...violator} round={round} />
              </li>
            ))}
          </ul>
          加入至本案件了，理由如下：
          <ActionLogReasonBlock reason={data.reason} />
        </>
      )
      break
    }
    case 'removeViolator': {
      content = (
        <>
          <UserLink round={round} userId={executor} /> 將
          <Violator {...data.violator} round={round} /> 從本案件的違規名單移除了，理由如下：
          <ActionLogReasonBlock reason={data.reason} />
        </>
      )
      break
    }
    default: {
      const unreachable: never = action
      content = (
        <>
          <UserLink round={round} userId={executor} /> 進行了動作 {unreachable}
        </>
      )
      break
    }
  }

  return (
    <div class="py-2">
      <strong>{formatDateTimeText(executedAt)}</strong> -<div class="px-3">{content}</div>
    </div>
  )
}
