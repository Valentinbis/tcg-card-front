<script setup>

const { data: recurrence } = await useAPI('/recurrence');

console.log(recurrence);

const movement = ref<Movement | null>(null);
// const recurrence = ref<Recurrence | null>(null);

// "amount": -100,
//     "type": "expense",
//     "recurrence": {
//         "name": "monthly",
//         "startDate": "01/06/1999",
//         "endDate": "10/06/2020"
//     },
//     "category": 1,
//     "date": "01/06/2024"

const categories = [
  { name: 'Entrée', code: 'income' },
  { name: 'Dépense', code: 'expense' }
];

const submitForm = () => {
  console.log(movement.value);
  // Ajoutez ici la logique pour traiter la movement
};
</script>

<template>
  <div class="flex">
    <DatePicker id="movementDate" v-model="movement.date" dateFormat="dd/mm/yy" showIcon fluid showButtonBar placeholder="Date de la movement" />
    <InputText id="amount" v-model="movement.amount" placeholder="Montant" />
    <Select id="type" v-model="movement.type" :options="categories" optionLabel="name" optionValue="code" placeholder="Type de dépense" />
    <Select id="recurrence" v-model="movement.recurrence" :options="recurrences" optionLabel="name" optionValue="code" placeholder="Récurrence" />
    <Textarea id="description" v-model="movement.description" placeholder="Description" />
    <Button label="Soumettre" @click="submitForm" />
  </div>
</template>



<style scoped>
.flex {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 1rem;
}
</style>