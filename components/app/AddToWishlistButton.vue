<script setup lang="ts">
const props = defineProps<{
  cardId: string;
  cardName?: string;
}>();

const { addToWishlist, isInWishlist } = useWishlist();

const showDialog = ref(false);
const form = ref({
  priority: 0,
  notes: '',
  maxPrice: undefined as number | undefined,
});

const isInWishlistComputed = computed(() => isInWishlist.value(props.cardId));

const priorityOptions = [
  { label: 'Low (0)', value: 0 },
  { label: 'Medium (1)', value: 1 },
  { label: 'High (2)', value: 2 },
  { label: 'Very High (3)', value: 3 },
  { label: 'Critical (5)', value: 5 },
];

const handleAdd = async () => {
  await addToWishlist(
    props.cardId,
    form.value.priority,
    form.value.notes || undefined,
    form.value.maxPrice
  );

  showDialog.value = false;

  // Reset form
  form.value = {
    priority: 0,
    notes: '',
    maxPrice: undefined,
  };
};
</script>

<template>
  <div>
    <Button
      v-if="!isInWishlistComputed"
      icon="pi pi-heart"
      label="Add to Wishlist"
      severity="secondary"
      outlined
      @click="showDialog = true"
    />

    <Button v-else icon="pi pi-heart-fill" label="In Wishlist" severity="danger" disabled />

    <Dialog
      v-model:visible="showDialog"
      :header="`Add ${cardName || cardId} to Wishlist`"
      :modal="true"
      class="w-full md:w-1/2"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Priority *</label>
          <Select
            v-model="form.priority"
            :options="priorityOptions"
            option-label="label"
            option-value="value"
            class="w-full"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Max Price (optional)</label>
          <InputNumber
            v-model="form.maxPrice"
            :min="0"
            mode="currency"
            currency="USD"
            placeholder="Maximum price you're willing to pay"
            class="w-full"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Notes (optional)</label>
          <Textarea
            v-model="form.notes"
            rows="4"
            class="w-full"
            placeholder="Add notes about why you want this card..."
          />
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" severity="secondary" @click="showDialog = false" />
        <Button label="Add to Wishlist" icon="pi pi-heart" @click="handleAdd" />
      </template>
    </Dialog>
  </div>
</template>
