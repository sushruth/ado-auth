import { TokenStore } from '../lib/types'

export enum PrepareTypes {
  refetch,
  fetch,
  noop,
}

export type PrepareReturn =
  | {
      type: PrepareTypes.refetch
      data: TokenStore
    }
  | {
      type: PrepareTypes.fetch
    }
  | {
      type: PrepareTypes.noop
      data: TokenStore
    }
