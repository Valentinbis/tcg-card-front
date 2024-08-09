import { defineStore } from "pinia";

export const useCategoryStore = defineStore(
  "category-store",
  () => {
    const categories = ref<any>([]);

    const fetchCategories = async () => {
      const data = await useAPI("/categories", {
        method: "GET",
        default: () => ({}),
      });
      categories.value = data.data.value;
    };

    const fetchCategoryChildren = async (id: number) => {
      const data = await useAPI(`/category/${id}/children`, {
        method: "GET",
        default: () => ({}),
      });

      return data.data.value;
    };

    fetchCategories();

    return {
      categories,
      fetchCategories,
      fetchCategoryChildren,
    };
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  }
);
