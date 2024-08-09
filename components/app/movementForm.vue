<script setup lang="ts">
import type { Movement } from "~/types/movement";
import { useRecurrenceStore } from "~/stores/recurrence";
import { useCategoryStore } from "~/stores/category";

const { recurrences } = storeToRefs(useRecurrenceStore());
const { categoriesParent } = storeToRefs(useCategoryStore());
const { fetchCategoryChildren } = useCategoryStore();
const selectedCategory = ref<number | null>(null);
const categoriesChildren = ref();

const mappedRecurrences = recurrences.value.map((recurrence: string) => {
  let name;
  switch (recurrence) {
    case "daily":
      name = "Quotidien";
      break;
    case "weekly":
      name = "Hebdomadaire";
      break;
    case "bimonthly":
      name = "Bimensuel";
      break;
    case "quarterly":
      name = "Trimestriel";
      break;
    case "monthly":
      name = "Mensuel";
      break;
    case "yearly":
      name = "Annuel";
      break;
    default:
      name = "Inconnu";
  }
  return { code: recurrence, name };
});

const movement = ref<Movement>({
  date: undefined,
  amount: undefined,
  type: undefined,
  recurrence: {
    name: undefined,
    startDate: undefined,
    endDate: undefined,
  },
  category: null,
  description: undefined,
});

const type = [
  { name: "Entrée", code: "income" },
  { name: "Dépense", code: "expense" },
];

const sendMovementForm = async () => {
  await useAPI("/movement", {
    method: "POST",
    body: { ...movement.value },
    default: () => ({}),
  });
};

const submitForm = () => {
  movement.value.date = formatDateApi(movement.value.date);
  if (movement.value.recurrence.name) {
    movement.value.recurrence.startDate = formatDateApi(
      movement.value.recurrence.startDate
    );
    movement.value.recurrence.endDate = formatDateApi(
      movement.value.recurrence.endDate
    );
  } else {
    movement.value.recurrence.startDate = undefined;
    movement.value.recurrence.endDate = undefined;
  }
  sendMovementForm();
};

watch(selectedCategory, async (newCategory) => {
  if (newCategory !== null) {
    categoriesChildren.value = await fetchCategoryChildren(newCategory);
    movement.value.category = selectedCategory.value;
  } else {
    categoriesChildren.value = [];
  }
});
</script>

<template>
  <div class="flex">
    <Card>
      <template #header>
        <h2 class="font-bold">Ajouter une transaction</h2>
      </template>
      <template #content class="flex justify-content center">
        <div class="flex flex-wrap gap-2 pb-2">
          <Select
            id="type"
            v-model="movement.type"
            :options="type"
            optionLabel="name"
            optionValue="code"
            placeholder="Type de dépense"
          />
        </div>
        <div class="pb-2">
          <DatePicker
            id="movementDate"
            v-model="movement.date"
            showIcon
            fluid
            showButtonBar
            placeholder="Date d'effet"
          />
        </div>
        <div class="pb-2">
          <Select
            id="recurrence"
            v-model="movement.recurrence.name"
            :options="mappedRecurrences"
            optionLabel="name"
            optionValue="code"
            placeholder="Récurrence"
            showClear
          />
        </div>
        <div v-if="movement.recurrence?.name" class="pb-2">
          <DatePicker
            id="startDate"
            v-model="movement.recurrence.startDate"
            showIcon
            fluid
            showButtonBar
            placeholder="Date début récurrence"
            required
          />
        </div>
        <div v-if="movement.recurrence?.name" class="pb-2">
          <DatePicker
            id="endDate"
            v-model="movement.recurrence.endDate"
            showIcon
            fluid
            showButtonBar
            placeholder="Date fin récurrence"
          />
        </div>
        <div class="pb-2">
          <InputNumber
            id="amount"
            v-model="movement.amount"
            placeholder="Montant"
          />
        </div>
        <div class="pb-2">
          <Select
            id="category"
            v-model="selectedCategory"
            :options="categoriesParent"
            optionLabel="name"
            optionValue="id"
            placeholder="Catégorie"
            filter
          />
        </div>
        <div class="pb-2">
          <Select
            id="category"
            v-model="movement.category"
            :options="categoriesChildren"
            optionLabel="name"
            optionValue="id"
            placeholder="Sous catégorie"
            filter
          />
        </div>
        <div>
          <Textarea
            id="description"
            v-model="movement.description"
            placeholder="Description"
          />
        </div>
        <div>
          <Button label="Enregistrer" @click="submitForm" />
        </div>
      </template>
    </Card>
  </div>
</template>
