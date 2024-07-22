import { defineStore } from "pinia";

export const useRecurrenceStore = defineStore(
  "recurrence-store",
  () => {
    const recurrences = ref<any>([]);

    const fetchRecurrences = async () => {
    const data = await useAPI("/recurrence");
    recurrences.value = data.data.value;
    };

    fetchRecurrences();

    return {
      recurrences,
      fetchRecurrences,
    };
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  }
);
