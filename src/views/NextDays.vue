<script setup>
import { storeToRefs } from 'pinia';
import { useWeatherStore } from '../stores/weatherStore'
import { onMounted, ref, } from 'vue';
import  TheLoader from '../components/TheLoader.vue'
const useWeather = useWeatherStore ()
const {lat, lon, codeData} = storeToRefs(useWeather)

const dataDaily = ref('')
const dailyForecast = ref([])
const loader = ref(false)
onMounted(() => {
    getDailyWeather(lat.value, lon.value)
    
})


async function getDailyWeather(lat,lon){
    loader.value = true
    try {
        const response = await fetch ( `https://api.open-meteo.com/v1/forecast?timezone=auto&latitude=${lat}&longitude=${lon}&daily=temperature_2m_max&daily=temperature_2m_min&daily=weathercode`)
        if (response.ok){
            const jsonResponse = await response.json()
            dataDaily.value = jsonResponse
            makeDailyForecast()
        }
    }catch (error){
        console.log(error)
    }finally{
        loader.value = false
    }

}

const makeDailyForecast = () => {
    if(dataDaily.value){
    const d = new Date()
    let day = d.getDay()
    let days = ['Sun','Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat']
     for (let i = 0; i < dataDaily.value.daily.time.length; i++){
        if(i == 0){
            let today = days[day]
            dailyForecast.value.push({temp_max: dataDaily.value.daily.temperature_2m_max[i], temp_min: dataDaily.value.daily.temperature_2m_min[i], day: today, emoji: codeData.value[dataDaily.value.daily.weathercode[i]]})
        }else{
            if(day + i <=6){
                let today = days[day + i]
                dailyForecast.value.push({temp_max: dataDaily.value.daily.temperature_2m_max[i], temp_min: dataDaily.value.daily.temperature_2m_min[i], day: today, emoji: codeData.value[dataDaily.value.daily.weathercode[i]]})
            }else{
                let today = days[(day + i) - 7]
                dailyForecast.value.push({temp_max: dataDaily.value.daily.temperature_2m_max[i], temp_min: dataDaily.value.daily.temperature_2m_min[i], day: today, emoji: codeData.value[dataDaily.value.daily.weathercode[i]]})
            }   
        }
     }
    }
}
</script>


<template>
    <div class="d-flex big mx-auto justify-content-center flex-row">
        <div v-if="loader" class="text-center mx-auto mt-3">
            <TheLoader/>
        </div>
        <div v-else-if="dailyForecast" v-for="item in dailyForecast" class="text-center p-2 nx-h mx-2">
            <h5 class="fw-bold mb-2 day">{{ item.day }}</h5>
            <h6>{{ Math.floor(item.temp_max) }} ºC</h6>
            <h5 class="time fw-bold text-center"><i :class="item.emoji[1]"></i> </h5>
            <h6>{{ Math.floor(item.temp_min) }} ºC</h6>
        </div>
    </div>
</template>

<style scoped>

@media only screen and (max-width: 600px){

    h5.fw-bold.mb-2.day{
    width: 50px;
    }
}

</style>