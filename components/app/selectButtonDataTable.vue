<script lang="ts" setup>
const props = defineProps({
  value: {
    type: Object,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
});

const movements = ref<any>([]);
const selectedMovements = ref();
const expandedMovements = ref();
const value = ref(props.value);
const options = ref(props.options);

const fetchExpenseMovements = async (type: string | null) => {
  let params: { sort: string; order: string; type?: string } = {
    sort: "date",
    order: "desc",
  };
  if (type) {
    params = { ...params, type: type };
  }
  const data = await useAPI("/movements", {
    method: "GET",
    params: params,
    default: () => ({}),
  });
  movements.value = data.data.value;
};

watch(
  value,
  (newValue) => {
    fetchExpenseMovements(newValue.key);
  },
  { immediate: true }
);
</script>
<template>
  <SelectButton
    v-model="value"
    :options="options"
    optionLabel="name"
    optionKey="key"
    aria-labelledby="basic"
  />
  <DataTable
    v-model:selection="selectedMovements"
    v-model:expandedRows="expandedMovements"
    :value="movements"
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
        <span :class="colorNumber(slotProps.data.amount)">
          {{ formatCurrency(slotProps.data.amount) }}
        </span>
      </template>
    </Column>
    <template #expansion="movement">
      <div class="p-4 rounded-lg">
        <p>Description : {{ movement.data?.description }}</p>
        <div v-if="movement.data.recurrence">
          <p>Type de recurrence : {{ movement.data.recurrence.name }}</p>
          <p>Date de début : {{ movement.data.recurrence.startDate }}</p>
          <p>Date de fin : {{ movement.data.recurrence.endDate }}</p>
        </div>
      </div>
    </template>
  </DataTable>
</template>
