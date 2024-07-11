<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const { authenticated, token } = storeToRefs(useAuthStore());

</script>

<template>
    coucou
    {{ authenticated }}
    {{ token }}
</template>