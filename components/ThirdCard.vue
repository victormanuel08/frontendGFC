<template>
  <div class="card" @click="onClick">
      <div class="card-image">
          <img :src="'api' + third.image || '/static/default-avatar.jpg'" alt="Foto de Tercero" />
      </div>
      <div class="card-content">
          <h3>{{ third.first_name }} {{ third.last_name }}</h3>
          <p><i class="fa fa-calendar"></i> Fecha de Nacimiento: {{ third.date_birth }}</p>
          <p><i class="fa fa-birthday-cake"></i> Edad: {{ calculatedAge }}</p>
          <p><i class="fa fa-list"></i> Plan: {{ third.training_plan_name }}</p>
          <p :class="statusClass"><i class="fa fa-circle"></i> Estado: {{ third.status }}</p>
      </div>
  </div>
</template>
<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
    third: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['click']);

const onClick = () => {
    emit('click', props.third);
};

const calculatedAge = computed(() => {
    const birthDate = new Date(props.third.date_birth);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
});

const statusClass = computed(() => {
    return props.third.status === 'Al día' ? 'status-green' : 'status-red';
});
//#091278
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.card {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 320px;
    padding: 20px;
    margin: 20px;
    border-radius: 15px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: pointer;
    background: linear-gradient(145deg, #ffffff 0%, #e6e6e6 50%, #2833ab  50%, #f24d0c 100%);
    font-family: 'Roboto', sans-serif;
}

.card:hover {
    transform: translateY(-10px);
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.3);
}

.card-image img {
    border-radius: 50%;
    width: 120px;
    height: 120px;
    object-fit: cover;
    border: 3px solid #f2f2f2;
}

.card-content {
    text-align: center;
    margin-top: 15px;
}

.card-content h3 {
    font-size: 1.5em;
    color: #333;
    margin-bottom: 10px;
}

.card-content p {
    font-size: 1em;
    color: #020202;
    margin: 5px 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.card-content p i {
    margin-right: 8px;
}

.status-green {
    color: green;
}

.status-red {
    color: red;
}
</style>
