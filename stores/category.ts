import { defineStore } from "pinia";

export const useCategoryStore = defineStore(
  "category-store",
  () => {
    const categoriesParent = ref<any>([]);

    const fetchCategoriesParent = async () => {
      const data = await useAPI("/categories/parents", {
        method: "GET",
        default: () => ({}),
      });
      categoriesParent.value = data.data.value;
    };

    const fetchCategoryChildren = async (id: number) => {
      const data = await useAPI(`/category/${id}/children`, {
        method: "GET",
        default: () => ({}),
      });

      return data.data.value;
    };

    fetchCategoriesParent();

    return {
      categoriesParent,
      fetchCategoriesParent,
      fetchCategoryChildren,
    };
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  }
);
