<script setup lang="ts">
const props = defineProps<{
  cardId: string;
  cardName?: string;
}>();

const { addToWishlist, isInWishlist, isLoading } = useWishlist();

const visible = ref(false);
const formData = ref<{
  cardId: string;
  priority: number;
  maxPrice?: number;
  notes?: string;
}>({
  cardId: props.cardId,
  priority: 5,
  maxPrice: undefined,
  notes: undefined,
});

const priorityOptions = [
  { label: 'Très basse (0)', value: 0 },
  { label: 'Basse (1)', value: 1 },
  { label: 'Moyenne (2)', value: 2 },
  { label: 'Élevée (3)', value: 3 },
  { label: 'Très élevée (4)', value: 4 },
  { label: 'Critique (5)', value: 5 },
  { label: 'Urgente (6)', value: 6 },
  { label: 'Priorité max (7)', value: 7 },
  { label: 'Indispensable (8)', value: 8 },
  { label: 'À avoir absolument (9)', value: 9 },
  { label: 'Mission impossible (10)', value: 10 },
];

const isInWishlistComputed = computed(() => isInWishlist.value(props.cardId));

const handleAddToWishlist = async () => {
  try {
    await addToWishlist(
      formData.value.cardId,
      formData.value.priority,
      formData.value.notes,
      formData.value.maxPrice
    );

    visible.value = false;

    // Reset form
    formData.value = {
      cardId: props.cardId,
      priority: 5,
      maxPrice: undefined,
      notes: undefined,
    };
  } catch {
    // Error is handled in the composable
  }
};

const openDialog = () => {
  visible.value = true;
};
</script>

<template>
  <div class="add-to-wishlist">
    <Button
      v-if="!isInWishlistComputed"
      label="Ajouter à la wishlist"
      icon="pi pi-heart"
      size="small"
      @click="openDialog"
    />
    <Button
      v-else
      label="Dans la wishlist"
      icon="pi pi-heart-fill"
      severity="success"
      size="small"
      outlined
      disabled
    />

    <Dialog
      v-model:visible="visible"
      header="Ajouter à la wishlist"
      :modal="true"
      :style="{ width: '450px' }"
    >
      <div v-if="cardName" class="mb-4">
        <p class="text-sm text-gray-600">
          Carte: <strong>{{ cardName }}</strong>
        </p>
      </div>
      <div class="flex flex-col gap-6 pt-4">
        <div class="flex flex-col gap-2">
          <label for="priority" class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >Priorité (0-10)</label
          >
          <Dropdown
            id="priority"
            v-model="formData.priority"
            :options="priorityOptions"
            option-label="label"
            option-value="value"
            placeholder="Sélectionner une priorité"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="maxPrice" class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >Prix maximum souhaité</label
          >
          <InputNumber
            id="maxPrice"
            v-model="formData.maxPrice"
            mode="currency"
            currency="EUR"
            locale="fr-FR"
            placeholder="Prix maximum"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="notes" class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >Notes</label
          >
          <Textarea
            id="notes"
            v-model="formData.notes"
            rows="3"
            placeholder="Notes personnelles sur cette carte"
          />
        </div>
      </div>
      <template #footer>
        <Button label="Annuler" icon="pi pi-times" text @click="visible = false" />
        <Button
          label="Ajouter"
          icon="pi pi-heart"
          :loading="isLoading"
          @click="handleAddToWishlist"
        />
      </template>
    </Dialog>
  </div>
</template>
