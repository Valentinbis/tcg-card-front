<script setup lang="ts">
const props = defineProps({
  movements: {
    type: Array,
    required: true,
  },
});

const chartData = computed(() => ({
  labels: props.movements.map((movement: any) => movement.category),
  datasets: [
    {
      data: props.movements.map((movement: any) => movement.total),
      backgroundColor: ["#f97316", "#84cc16"],
      hoverBackgroundColor: ["#fb923c", "#a3e635"],
    },
  ],
}));
</script>

<template>
  <div class="card flex">
    <Chart type="doughnut" :data="chartData" class="w-40 md:w-[10rem]" />
  </div>
</template>
