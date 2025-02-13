<template>
    <div class="carousel-container">
        <button class="carousel-button prev" @click="prevSlide">⮜</button>
        <div class="carousel">
            <div class="carousel-item" v-for="(image, index) in images" :key="index"
                :class="{ active: index === currentIndex }">
                <img :src="'api' + image" alt="Imagen del carrusel" class="carousel-image" />
            </div>
        </div>
        <button class="carousel-button next" @click="nextSlide">⮞</button>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const images = ref<string[]>([]);
const currentIndex = ref(0);

const retrieveDataFromApi = async () => {
    try {
        const response = await fetch('api/public/menu');
        const result = await response.json();
        images.value = [
            result.page.imagecar1,
            result.page.imagecar2,
            result.page.imagecar3,
            result.page.imagecar4,
            result.page.imagecar5,
            result.page.imagecar6
        ];
        startAutoSlide();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const nextSlide = () => {
    currentIndex.value = (currentIndex.value + 1) % images.value.length;
};

const prevSlide = () => {
    currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length;
};

let autoSlideInterval: number | undefined;

const startAutoSlide = () => {
    autoSlideInterval = window.setInterval(nextSlide, 3000); // Cambiar cada 3 segundos
};

const stopAutoSlide = () => {
    if (autoSlideInterval !== undefined) {
        clearInterval(autoSlideInterval);
    }
};

onMounted(() => {
    retrieveDataFromApi();
});
</script>
<style scoped>
.carousel-container {
    position: relative;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.carousel {
    display: flex;
    transition: transform 0.5s ease-in-out;
    width: 100%;
}

.carousel-item {
    min-width: 100%;
    transition: opacity 0.5s ease-in-out;
    opacity: 0;
    display: none;
}

.carousel-item.active {
    opacity: 1;
    display: block;
}

.carousel-image {
    width: 100%;
    height: auto;
    border-radius: 10px;
}

.carousel-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px;
    cursor: pointer;
}

.carousel-button.prev {
    left: 10px;
}

.carousel-button.next {
    right: 10px;
}

.carousel-button:hover {
    background-color: rgba(0, 0, 0, 0.7);
}
</style>