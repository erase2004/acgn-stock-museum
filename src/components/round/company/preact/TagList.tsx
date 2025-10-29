import { useState, useMemo } from 'preact/hooks'

const TAGS_LIMIT = 3

type Props = {
  tags: string[]
}

export default function TagList({ tags }: Props) {
  const [showAll, setShowAll] = useState(false)
  const displayTags = useMemo(() => {
    if (showAll) return tags

    return tags.slice(0, TAGS_LIMIT)
  }, [tags, showAll])

  if (tags.length === 0) return <></>

  return (
    <div class="flex flex-wrap gap-1">
      {displayTags.map((tag) => (
        <span
          key={tag}
          class="badge overflow-hidden badge-sm font-bold text-nowrap badge-neutral"
          title={tag}
        >
          {tag}
        </span>
      ))}
      {displayTags.length < tags.length && (
        <button
          class="btn badge badge-sm font-bold text-nowrap badge-primary"
          onClick={() => setShowAll(true)}
        >
          顯示全部標籤
        </button>
      )}
    </div>
  )
}
