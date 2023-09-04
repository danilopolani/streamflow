import type { AccessToken } from '@twurple/auth';

export type TwitchSettings = AccessToken & {
  userId: number|string
  userName: string
  pictureUrl?: string
  isPartner: boolean
  scopes: string[]
}

export type Reward = {
  title: string
  cost: number
  imageUrl: string
  backgroundColor: string
}

export enum TwitchSubject {
  Rewards = 'TWITCH_REWARDS',
}
