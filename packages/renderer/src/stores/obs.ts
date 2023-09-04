import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useObs = defineStore('obs', () => {
  const sources = ref<string[]>([]);

  const loadSources = (data: { inputKind: string, inputName: string }[]) => {
    sources.value = data.map((item) => item.inputName);
  };

  return { sources, loadSources };
});
