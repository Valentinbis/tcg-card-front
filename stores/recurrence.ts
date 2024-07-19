import { defineStore } from "pinia";
// import { useAuthStore } from "~/stores/auth";

export const useRecurrenceStore = defineStore(
  "recurrence-store",
  () => {
    // const { user } = storeToRefs(useAuthStore());
    const recurrences = ref<any>([]);

    const fetchRecurrences = async () => {
    // const data = await useFetch("http://127.0.0.1:8000/api/recurrence", {
    //   method: "get",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${user.value?.apiToken}`,
    //   },
    // });
    const data = await useAPI("/recurrence");
    //   console.log(data.data.value);
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
