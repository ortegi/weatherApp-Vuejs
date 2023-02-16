<script setup>
import { storeToRefs } from 'pinia';
import { useWeatherStore } from '../stores/weatherStore'
import { onMounted, ref, } from 'vue';
import  TheLoader from '../components/TheLoader.vue'
const useWeather = useWeatherStore ()
const {lat, lon, codeData} = storeToRefs(useWeather)

const dataDaily = ref('')
const dailyForecast = ref([])
onMounted(() => {
    getDailyWeather(lat.value, lon.value)
})


async function getDailyWeather(lat,lon){
    console.log(lat,lon)
    try {
        const response = await fetch ( `https://api.open-meteo.com/v1/forecast?timezone=auto&latitude=${lat}&longitude=${lon}&daily=temperature_2m_max&daily=temperature_2m_min&daily=weathercode`)
        if (response.ok){
            const jsonResponse = await response.json()
            dataDaily.value = jsonResponse
          
        }
    }catch (error){
        console.log(error)
    }

}

const makeDailyForecast = () => {
    if(dataDaily.value){
    const d = new Date()
    let day = d.getDay()
    console.log(day)
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

setTimeout(makeDailyForecast, 2000)
</script>


<template>
   <div class="container">
        <div class="row">
            <div class="col-12 d-flex big">
                <div v-if="!dailyForecast" class="text-center mx-auto mt-3">
                    <TheLoader/>
                </div>
                <div v-if="dailyForecast" v-for="item in dailyForecast" class="me-2 text-center p-3 nx-h">
                    <h5 class="fw-bold">{{ item.day }}</h5>
                    <h6>{{ Math.floor(item.temp_max) }} ºC</h6>
                    <h5 class="time fw-bold"><i :class="item.emoji[1]"></i> {{ item.emoji[0] }}</h5>
                    <h6>{{ Math.floor(item.temp_min) }} ºC</h6>
                </div>
            </div>
        </div>
   </div>
</template>

<style>

.time{
    width: 80px;
    height: 70px;
}
.time h5{
    font-size: 13px;
}

</style>