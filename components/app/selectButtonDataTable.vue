<script lang="ts" setup>
const props = defineProps({
  value: {
    type: Object,
    required: false,
  },
  options: {
    type: Array,
    required: false,
  },
});

const movements = ref<any>([]);
const selectedMovements = ref();
const expandedMovements = ref();
const value = ref(props.value);
const options = ref(props.options);

const fetchExpenseMovements = async (
  type: string | null,
  page?: number
) => {
  const params = {
    sort: "date",
    order: "desc",
    type: type || undefined,
    page: page || 1,
    limit: 10,
  };
  const data: { data: any } = await useAPI("/movements", {
    method: "GET",
    params: params,
    default: () => ({}),
  });
  movements.value = data.data.value;
};

function onPage(event: any) {
  const page = event.page + 1;
  fetchExpenseMovements(value.value?.key, page);
  // const from = (page - 1) * movements.value?.meta?.per_page;
  // const to = from + movements.value?.meta?.per_page;
}

onMounted(() => {
  onPage({ page: 0 });
});

watch(
  value,
  (newValue) => {
    fetchExpenseMovements(newValue?.key);
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
    lazy
    stripedRows
    paginator
    :rows="movements.meta?.per_page"
    :totalRecords="movements.meta?.total_items"
    v-model:selection="selectedMovements"
    v-model:expandedRows="expandedMovements"
    :value="movements.data"
    dataKey="id"
    class="shadow-lg rounded"
    @page="onPage"
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
