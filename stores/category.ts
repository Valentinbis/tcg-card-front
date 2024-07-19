import { defineStore } from "pinia";
// import { useAuthStore } from "~/stores/auth";

export const useCategoryStore = defineStore(
  "category-store",
  () => {
    // const { user } = storeToRefs(useAuthStore());
    const categories = ref<any>([]);

    const fetchCategories = async () => {
      // const data = await useFetch("http://127.0.0.1:8000/api/recurrence", {
      //   method: "get",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${user.value?.apiToken}`,
      //   },
      // });
      const data = await useAPI("/categories");
      //   console.log(data.data.value);
      categories.value = data.data.value;
    };

    fetchCategories();

    return {
      categories,
      fetchCategories,
    };
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  }
);
