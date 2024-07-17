<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useRecurrenceStore } from "~/stores/recurrence";
import { useCategoryStore } from "~/stores/category";
import type { Movement } from "~/types/movement";
import dayjs from "dayjs";

const { user } = storeToRefs(useAuthStore());
const { recurrences } = storeToRefs(useRecurrenceStore());
const { categories } = storeToRefs(useCategoryStore());

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
  amount: 0,
  type: null,
  recurrence: {
    name: undefined,
    startDate: undefined,
    endDate: undefined,
  },
  category: null,
  description: null,
});

const type = [
  { name: "Entrée", code: "income" },
  { name: "Dépense", code: "expense" },
];

const submitForm = () => {
  //format date to dd/mm/yyyy
  const date = dayjs(movement.value.date).format("DD/MM/YYYY");

  console.log(movement.value);
};
</script>

<template>
  Bienvenue sur votre dashboard {{ user?.lastName }} {{ user?.firstName }}!

  <div class="flex">
    <DatePicker
      id="movementDate"
      v-model="movement.date"
      dateFormat="dd/mm/yy"
      showIcon
      fluid
      showButtonBar
      placeholder="Date d'effet"
    />
    <InputText id="amount" v-model="movement.amount" placeholder="Montant" />
    <Select
      id="type"
      v-model="movement.category"
      :options="categories"
      optionLabel="name"
      optionValue="id"
      placeholder="Catégorie"
    />
    <Select
      id="type"
      v-model="movement.type"
      :options="type"
      optionLabel="name"
      optionValue="code"
      placeholder="Type de dépense"
    />
    <Select
      id="recurrence"
      v-model="movement.recurrence.name"
      :options="mappedRecurrences"
      optionLabel="name"
      optionValue="code"
      placeholder="Récurrence"
    />
    <DatePicker
      v-if="movement.recurrence?.name"
      id="startDate"
      v-model="movement.recurrence.startDate"
      dateFormat="dd/mm/yy"
      showIcon
      fluid
      showButtonBar
      placeholder="Date de début"
      required
    />
    <DatePicker
      v-if="movement.recurrence?.name"
      id="endDate"
      v-model="movement.recurrence.endDate"
      dateFormat="dd/mm/yy"
      showIcon
      fluid
      showButtonBar
      placeholder="Date de fin"
    />
    <Textarea
      id="description"
      v-model="movement.description"
      placeholder="Description"
    />
    <Button label="Soumettre" @click="submitForm" />
  </div>
</template>
