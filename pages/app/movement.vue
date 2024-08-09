<script lang="ts" setup></script>
<template>
  <div class="flex">
    <div class="flex">
      <Card>
        <template #header>
          <h1 class="font-bold p-4">Les dernières transactions</h1>
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
