import { map } from 'nanostores'

export const isInitialized = map<Record<string, boolean>>({})

export const currentPage = map<Record<string, number>>({})

export const isDataLoading = map<Record<string, boolean>>({})

export const hasMore = map<Record<string, boolean>>({})
