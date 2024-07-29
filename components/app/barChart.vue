<script setup lang="ts">
import dayjs from "#build/dayjs.imports.mjs";
import "dayjs/locale/fr";

dayjs.locale("fr");

const props = defineProps({
  movements: {
    type: Array,
    required: true,
  },
});

const chartData = computed(() => ({
  labels: props.movements.map((movement: any) =>
    dayjs()
      .month(movement.month - 1)
      .format("MMMM")
  ),
  datasets: [
    {
      label: "Total des mouvements",
      data: props.movements.map((movement: any) => movement.total),
      backgroundColor: ["#f97316", "#84cc16"],
      hoverBackgroundColor: ["#fb923c", "#a3e635"],
    },
  ],
}));
</script>

<template>
  <Chart type="bar" :data="chartData" class="w-40 md:w-[10rem]" />
</template>
