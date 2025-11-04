import { formatDateTimeText } from '@/libs/timeFormat'

type Props = {
  value: Parameters<typeof formatDateTimeText>[0]
}

export default function ClientDatetime({ value }: Props) {
  return <>{formatDateTimeText(value)}</>
}
