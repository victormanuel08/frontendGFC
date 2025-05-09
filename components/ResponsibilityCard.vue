<template>
    <div class="border rounded-lg p-4 hover:border-primary-300 transition-colors bg-white">
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0 mt-0.5">
          <div class="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
            <UIcon name="i-heroicons-check-badge" class="w-5 h-5 text-primary-600" />
          </div>
        </div>
  
        <div class="flex-1 min-w-0">
          <p class="font-medium text-gray-800">
            {{ responsibility.code }} - {{ responsibility.name }}
          </p>
          <p v-if="responsibility.tax_full" class="text-sm text-gray-500 mt-1 flex items-center gap-1">
            <UIcon name="i-heroicons-receipt-percent" class="w-4 h-4" />
            <span>Impuesto: {{ responsibility.tax_full.name }}</span>
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps({
    responsibility: Object
  })
  </script>