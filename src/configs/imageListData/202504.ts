import type { Data } from '@/components/index/types'

const round = 'round33'
const baseUrl = `/${round}/company/detail`

const data: Data[] = [
  {
    name: '97',
    ext: 'png',
    companyName: '長波(艦これ)',
    width: 452,
    height: 511,
    color: '#514440',
    url: `${baseUrl}/s9sQsYNZoZHYd9G8y`,
  },
  {
    name: '98',
    ext: 'mp4',
    companyName: '黑貓(五更琉璃)',
    width: 300,
    height: 300,
    color: '#e3d9dd',
    url: `${baseUrl}/bG2Ejf96PneGJcMei`,
    isVideo: true,
  },
  {
    name: '99',
    ext: 'jpg',
    companyName: '春日野穹',
    width: 300,
    height: 300,
    color: '#e0d7d2',
    url: `${baseUrl}/ZDKmWx2rPM9m95wZZ`,
  },
]

export default data
