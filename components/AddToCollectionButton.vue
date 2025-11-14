<script setup lang="ts">
interface Props {
  cardId: string;
}

const props = defineProps<Props>();

const { addToCollection, isInCollection, loading } = useCollection();

const visible = ref(false);
const formData = ref<{
  cardId: string;
  quantity: number;
  condition?: string;
  purchasePrice?: number;
  purchaseDate?: Date;
  notes?: string;
  languages?: string[];
}>({
  cardId: props.cardId,
  quantity: 1,
  condition: undefined,
  purchasePrice: undefined,
  purchaseDate: undefined,
  notes: undefined,
  languages: [],
});

const conditionOptions = [
  { label: 'Mint', value: 'mint' },
  { label: 'Near Mint', value: 'near_mint' },
  { label: 'Excellent', value: 'excellent' },
  { label: 'Good', value: 'good' },
  { label: 'Light Played', value: 'light_played' },
  { label: 'Played', value: 'played' },
  { label: 'Poor', value: 'poor' },
];

const languageOptions = [
  { label: 'Français', value: 'fr' },
  { label: 'Japonais', value: 'jap' },
  { label: 'Reverse', value: 'reverse' },
];

const handleAddToCollection = async () => {
  try {
    // Formater la date si elle existe
    let formattedDate: string | undefined;
    if (formData.value.purchaseDate) {
      const date = formData.value.purchaseDate as Date;
      formattedDate = date.toISOString().split('T')[0];
    }

    await addToCollection({
      cardId: props.cardId,
      quantity: formData.value.quantity || 1,
      condition: formData.value.condition,
      purchasePrice: formData.value.purchasePrice,
      purchaseDate: formattedDate,
      notes: formData.value.notes,
      languages: formData.value.languages,
    });

    visible.value = false;
    resetForm();
  } catch (error) {
    console.error("Erreur lors de l'ajout à la collection:", error);
  }
};

const resetForm = () => {
  formData.value = {
    cardId: props.cardId,
    quantity: 1,
    condition: undefined,
    purchasePrice: undefined,
    purchaseDate: undefined,
    notes: undefined,
    languages: [],
  };
};
</script>

<template>
  <div class="add-to-collection">
    <Button
      v-if="!isInCollection(cardId)"
      label="Ajouter à ma collection"
      icon="pi pi-plus"
      :loading="loading"
      @click="visible = true"
    />
    <Button
      v-else
      label="Dans ma collection"
      icon="pi pi-check"
      severity="success"
      outlined
      @click="visible = true"
    />

    <Dialog
      v-model:visible="visible"
      header="Ajouter à la collection"
      :modal="true"
      :style="{ width: '500px' }"
    >
      <div class="collection-form">
        <div class="field">
          <label for="quantity">Quantité *</label>
          <InputNumber id="quantity" v-model="formData.quantity" :min="1" placeholder="1" />
        </div>

        <div class="field">
          <label for="condition">État</label>
          <Dropdown
            id="condition"
            v-model="formData.condition"
            :options="conditionOptions"
            option-label="label"
            option-value="value"
            placeholder="Sélectionner un état"
          />
        </div>

        <div class="field">
          <label for="languages">Langues</label>
          <MultiSelect
            id="languages"
            v-model="formData.languages"
            :options="languageOptions"
            option-label="label"
            option-value="value"
            placeholder="Sélectionner les langues"
          />
        </div>

        <div class="field">
          <label for="purchasePrice">Prix d'achat</label>
          <InputNumber
            id="purchasePrice"
            v-model="formData.purchasePrice"
            mode="currency"
            currency="EUR"
            locale="fr-FR"
            placeholder="0,00 €"
          />
        </div>

        <div class="field">
          <label for="purchaseDate">Date d'achat</label>
          <Calendar
            id="purchaseDate"
            v-model="formData.purchaseDate"
            date-format="dd/mm/yy"
            placeholder="JJ/MM/AAAA"
          />
        </div>

        <div class="field">
          <label for="notes">Notes</label>
          <Textarea
            id="notes"
            v-model="formData.notes"
            rows="3"
            placeholder="Ajoutez une note..."
          />
        </div>
      </div>

      <template #footer>
        <Button label="Annuler" icon="pi pi-times" text @click="visible = false" />
        <Button
          label="Ajouter"
          icon="pi pi-check"
          :loading="loading"
          @click="handleAddToCollection"
        />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.add-to-collection {
  width: 100%;
}

.add-to-collection :deep(button) {
  width: 100%;
}

.collection-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color-secondary);
}
</style>
