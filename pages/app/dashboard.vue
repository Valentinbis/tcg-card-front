<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

const { user } = storeToRefs(useAuthStore());

// const fetchTransactionHistory = async () => {
//   await useAPI("/movements/total",

//   );
// };
const test = async () => {
  useAPI("/movements/total", {
    method: "GET",
    params: { startDate: "2023-01-01", endDate: "2025-01-31" },
    default: () => ({}),
  });
};

const expenseMovement = async () => {
  useAPI("/movements", {
    method: "GET",
    params: { type: "expense", categoryId: "1" },
    default: () => ({}),
  });
};

test();
expenseMovement();

</script>

<template>
  Bienvenue sur votre dashboard {{ user?.lastName }} {{ user?.firstName }}!
  <div>
    <h1 class="text-orange-950">Les dernières transactions</h1>
  </div>
</template>
