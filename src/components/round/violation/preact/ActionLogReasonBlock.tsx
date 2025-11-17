import { markdownToHtml } from '@/utils/helpers'

type Props = {
  reason: string
}

export default function ActionLogReasonBlock({ reason }: Props) {
  return (
    <div
      className="markdown-container violation-case-action-reason border border-base-content/25"
      dangerouslySetInnerHTML={{ __html: markdownToHtml(reason) }}
    ></div>
  )
}
