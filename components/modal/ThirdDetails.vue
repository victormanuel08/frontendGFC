<!-- components/ResponsibilityCard.vue -->
<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 hover:border-red-300 dark:hover:border-red-700 transition-colors">
    <div class="flex items-start gap-3">
      <div class="bg-red-100 dark:bg-red-900/20 p-2 rounded-full flex-shrink-0">
        <UIcon name="i-heroicons-check-badge" class="w-4 h-4 text-red-600 dark:text-red-400" />
      </div>
      <div>
        <p class="font-semibold text-sm">
          {{ responsibility.code }} - {{ responsibility.name }}
        </p>
        <p v-if="responsibility.tax_full" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {{ responsibility.tax_full.name }}
        </p>
        
        <div v-if="responsibility.tax_full?.expirations_full?.length" class="mt-3">
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Próximos vencimientos:</p>
          <div class="space-y-1">
            <div v-for="(exp, idx) in responsibility.tax_full.expirations_full.slice(0, 2)" :key="idx" class="text-xs flex items-center gap-2">
              <span class="font-medium bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">{{ exp.digits }}</span>
              <span>{{ formatDate(exp.date) }}</span>
            </div>
            <UTooltip v-if="responsibility.tax_full.expirations_full.length > 2" text="Ver todos los vencimientos">
              <p class="text-xs text-red-500 cursor-pointer hover:underline mt-1">
                +{{ responsibility.tax_full.expirations_full.length - 2 }} más...
              </p>
            </UTooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  responsibility: {
    type: Object,
    required: true
  }
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { day: 'numeric', month: 'short' }
  return new Date(dateString).toLocaleDateString('es-CO', options)
}
</script>