<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

const { user } = storeToRefs(useAuthStore());
const total = ref();
const movements = ref<any>([]);

const value = ref({ name: "Vos dernières transactions", key: "" });
const options = ref([
  { name: "Vos dernières transactions", key: "" },
  { name: "Vos dernières dépenses", key: "expense" },
  { name: "Vos derniers revenus", key: "income" },
]);
const valueChart = ref({ name: "Semaine", key: "week" });
const optionsChart = ref([
  { name: "Semaine", key: "week" },
  { name: "Mois", key: "month" },
  { name: "Année", key: "year" },
]);

const fetchExpenseMovements = async (type: string | null) => {
  let params = {};
  if (type) {
    params = { type: type };
  }
  const data = await useAPI("/movements-by-categories", {
    method: "GET",
    params: params,
    default: () => ({}),
  });
  movements.value = data.data.value;
};

const fetchTotalMovementsBetweenDates = async () => {
  useAPI("/movements/total-between-dates", {
    method: "GET",
    params: { startDate: "2023-01-01", endDate: "2025-01-31" },
    default: () => ({}),
  });
};

const fetchTotalMovements = async () => {
  total.value = useAPI("/movements/total", {
    method: "GET",
    default: () => ({}),
  });
};

fetchTotalMovementsBetweenDates();
fetchTotalMovements();
fetchExpenseMovements("expense");

</script>

<template>
  <h1>Bienvenue sur le dashboard {{ user?.lastName }} {{ user?.firstName }}</h1>
  <h3>
    Votre solde total est de <span class="font-bold">{{ total?.data }}</span>
  </h3>
  <SelectButton
    v-model="valueChart"
    :options="optionsChart"
    optionLabel="name"
    optionKey="key"
    aria-labelledby="basic"
  />
  <AppDoughnutChart :movements="movements"/>
  <div class="p-6">
    <h1 class="text-orange-950 text-2xl font-bold mb-4">
      Les dernières transactions
    </h1>
    <AppSelectButtonDataTable :value="value" :options="options" />
  </div>
</template>
