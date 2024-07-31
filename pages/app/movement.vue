<script lang="ts" setup></script>
<template>
  <div class="flex">
    <div class="flex">
      <Card>
        <template #header>
          <h2 class="font-bold">Les dernières transactions</h2>
        </template>
        <template #content>
          <AppSelectButtonDataTable />
        </template>
      </Card>
    </div>
    <AppMovementForm />
  </div>
</template>
<style scoped></style>
