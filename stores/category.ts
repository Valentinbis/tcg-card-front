import { defineStore } from "pinia";

export const useCategoryStore = defineStore(
  "category-store",
  () => {
    const categories = ref<any>([]);

    const fetchCategories = async () => {
      const data = await useAPI("/categories");
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
