import { atom } from 'nanostores'

export const ownStocks = atom<Record<string, number>>({})
