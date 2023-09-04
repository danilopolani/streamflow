import { ref } from 'vue';
import { defineStore } from 'pinia';
import { type Reward } from '~shared/TwitchSettings';

export const useTwitch = defineStore('twitch', () => {
  const rewards = ref<Reward[]>([]);

  return { rewards };
});
