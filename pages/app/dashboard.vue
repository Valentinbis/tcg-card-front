<script setup lang="ts">
import Column from "primevue/column";
import { useAuthStore } from "~/stores/auth";

const { user } = storeToRefs(useAuthStore());

const expenses = ref<any>([]);
const selectedExpenses = ref();
const expandedExpenses = ref();
const value = ref({ name: "Vos dernières transactions", key: "" });
const options = ref([
  { name: "Vos dernières transactions", key: "" },
  { name: "Vos dernières dépenses", key: "expense" },
  { name: "Vos derniers revenus", key: "income" },
]);
const formatCurrency = (value: any) => {
  return value.toLocaleString("fr-fr", { style: "currency", currency: "EUR" });
};
const amountClass = (value: any) => {
  return {
    "text-red-500": value < 0,
    "text-green-500": value > 0,
  };
};

const fetchTotalMovements = async () => {
  useAPI("/movements/total", {
    method: "GET",
    params: { startDate: "2023-01-01", endDate: "2025-01-31" },
    default: () => ({}),
  });
};

const fetchExpenseMovements = async (type: string | null) => {
  let params = {};
  if (type) {
    params = { type: type };
  }
  const data = await useAPI("/movements", {
    method: "GET",
    params: params,
    default: () => ({}),
  });
  expenses.value = data.data.value;
};

watch(
  value,
  (newValue) => {
    fetchExpenseMovements(newValue.key);
  },
  { immediate: true }
);

onMounted(async () => {
  await fetchTotalMovements();
  // await fetchExpenseMovements();
});

const setChartData = () => {
  console.log("setChartData");
  const documentStyle = getComputedStyle(document.body);

  return {
    labels: ["A", "B", "C"],
    datasets: [
      {
        data: [540, 325, 702],
        backgroundColor: [
          documentStyle.getPropertyValue("--p-cyan-500"),
          documentStyle.getPropertyValue("--p-orange-500"),
          documentStyle.getPropertyValue("--p-gray-500"),
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue("--p-cyan-400"),
          documentStyle.getPropertyValue("--p-orange-400"),
          documentStyle.getPropertyValue("--p-gray-400"),
        ],
      },
    ],
  };
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--p-text-color");

  return {
    plugins: {
      legend: {
        labels: {
          cutout: "60%",
          color: textColor,
        },
      },
    },
  };
};

const chartData = ref(setChartData());
const chartOptions = ref(setChartOptions());
</script>

<template>
  <AppDoughnutChart :chart-data-prop="chartData" :chart-options-prop="chartOptions"/>
  <div class="p-6">
    <h1 class="text-orange-950 text-2xl font-bold mb-4">
      Les dernières transactions
    </h1>
    <SelectButton
      v-model="value"
      :options="options"
      optionLabel="name"
      optionKey="key"
      aria-labelledby="basic"
    />
    <DataTable
      v-model:selection="selectedExpenses"
      v-model:expandedRows="expandedExpenses"
      :value="expenses"
      dataKey="id"
      class="shadow-lg rounded"
    >
      <Column
        selectionMode="multiple"
        headerStyle="width: 3rem"
        bodyStyle="text-align: center;"
      ></Column>
      <Column expander style="width: 5rem" />
      <Column
        field="date"
        header="Date"
        bodyStyle="font-weight: bold;"
        class="pr-4"
      ></Column>
      <Column field="category.name" header="Categorie" class="pr-4"></Column>
      <Column field="amount" header="Montant">
        <template #body="slotProps">
          <span :class="amountClass(slotProps.data.amount)">
            {{ formatCurrency(slotProps.data.amount) }}
          </span>
        </template>
      </Column>
      <template #expansion="expense">
        <div class="p-4 rounded-lg">
          <p>Description : {{ expense.data?.description }}</p>
          <div v-if="expense.data.recurrence">
            <p>Type de recurrence : {{ expense.data.recurrence.name }}</p>
            <p>Date de début : {{ expense.data.recurrence.startDate }}</p>
            <p>Date de fin : {{ expense.data.recurrence.endDate }}</p>
          </div>
        </div>
      </template>
    </DataTable>
  </div>
</template>
