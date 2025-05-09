<template>
  <div>
    <p class="text-sm font-medium text-gray-500 mb-1">{{ label }}</p>
    <UBadge 
      v-if="badgeColor" 
      :label="value" 
      :color="badgeColor" 
      variant="subtle"
      size="xs"
    />
    <p v-else class="text-sm text-gray-700 break-words">{{ value || 'No registrado' }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  label: String,
  value: [String, Number],
  badgeColor: String
})
</script>