<template>
    <div 
      class="flex items-center justify-between mt-4 p-4 rounded-2xl"
      :class="[gradient ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-blue-600']"
    >
      <div class="flex items-center space-x-3">
        <UIcon :name="icon" class="w-6 h-6 text-white" />
        <h1 class="text-xl font-bold text-white">{{ text }}</h1>
      </div>
      <slot></slot>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps({
    text: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: 'i-heroicons-document-text'
    },
    gradient: {
      type: Boolean,
      default: true
    }
  })
  </script>