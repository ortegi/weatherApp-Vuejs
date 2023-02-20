<script setup>
import { storeToRefs } from 'pinia';
import { useWeatherStore } from '../stores/weatherStore'
import { ref, onMounted} from 'vue'
import  TheLoader from '../components/TheLoader.vue'

const useWeather = useWeatherStore ()
const {nextHoursx} = storeToRefs(useWeather)

const loader = ref(false)
onMounted(() => {
    loader.value = true;
})
</script>

<template>
    <div class="d-flex big" >
        <div v-if="!nextHoursx" class="text-center mx-auto mt-3">
            <TheLoader/>
        </div>
        <div v-for="item in nextHoursx" class="nx-h  text-center p-2 mx-1" v-if="nextHoursx">
            <h5 class="text-center mt-2">{{item.hour}}:00</h5>
            <i :class="item.code" class="mt-2" ></i>   
            <h5  class="text-center mt-2">{{  Math.floor(item.temperature)}}ºC</h5>
        </div>
    </div>
</template>

