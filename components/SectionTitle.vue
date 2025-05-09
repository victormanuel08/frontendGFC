<template>
    <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2 text-lg">
      <UIcon :name="icon" class="w-5 h-5 text-primary-500" />
      <span class="relative">
        {{ title }}
        <span class="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary-400 to-purple-400"></span>
      </span>
    </h4>
  </template>
  
  <script setup lang="ts">
  defineProps({
    icon: String,
    title: String
  })
  </script>