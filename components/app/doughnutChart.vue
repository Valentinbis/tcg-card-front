<script setup lang="ts">

const props = defineProps({
  chartData: Object,
  chartOptions: Object,
  // chartDataProp: {
  //   type: Object,
  //   default: () => ({
  //     labels: [],
  //     datasets: [],
  //   }),
  // },
  // chartOptionsProp: {
  //   type: Object,
  //   default: () => ({}),
  // },
});
console.log(props.chartData);
const chartData = ref(props.chartData);
const chartOptions = ref(props.chartOptions);

</script>

<template>
  <div class="card flex justify-center">
    <Chart
      type="doughnut"
      :data="chartData"
      :options="chartOptions"
      class="w-full md:w-[30rem]"
    />
  </div>
</template>