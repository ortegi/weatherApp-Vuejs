<script setup>
import {ref, onMounted, computed} from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import ExtraInfo from './components/ExtraInfo.vue'
import { storeToRefs } from 'pinia';
import { useWeatherStore } from './stores/weatherStore';
import { useRouter } from 'vue-router';

/*pinia*/
const useWeather = useWeatherStore ()
const {  nextHoursx, lat, lon, codeData } = storeToRefs(useWeather)
//other Data
const data = ref('')
const city = ref('')
const searchInput = ref('')
const cities = ref('')
const selectedCity = ref('')
const emoji = ref('')
//router
const router = useRouter();

onMounted( ()=>{
  getLocation()
  getCode()
 
})



const getLocation = async()=>{     //to get the current lat and lon values
  if(navigator.geolocation){
        return navigator.geolocation.getCurrentPosition(showPosition);
    }else{
        alert('geolocation not available in this navigator')
    }

}

const showPosition = async (position) =>{
    lon.value  = position.coords.longitude; 
    lat.value =  position.coords.latitude;
    getCityName(lat.value, lon.value)
    getWeather(lat.value, lon.value)  
}


const back = () => {   
    router.push("/");
};

const getCityName = async (la, lo) =>{
  try{
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${la}&lon=${lo}&zoom=10&format=jsonv2`)
    if(response.ok){
      const res = await response.json()
      city.value = res
      searchInput.value = res.name
    }
  }catch(error){
    console.log(error)
  }
}

const getWeather = async (la, lo) =>{
  try{
        const response = await fetch (`https://api.open-meteo.com/v1/forecast?latitude=${la}&longitude=${lo}&hourly=temperature_2m&hourly=apparent_temperature&hourly=weathercode&hourly=relativehumidity_2m&hourly=windspeed_10m&hourly=precipitation&hourly=cloudcover&hourly=snowfall`);
        if (response.ok){
            const res = await response.json()
            data.value = res
            makeNextHoursForeCast()
        }
    }catch (error){
        console.log(error)
       
    }
}


const getCityCoords = async() => {
  console.log('get')
    try{
        const response = await fetch (`https://nominatim.openstreetmap.org/search.php?city=${searchInput.value}&format=jsonv2`);
        if (response.ok){
          const jsonResponse = await response.json()
          cities.value = jsonResponse        
        }
    }catch (error){
    console.log(error)       
    }
}

const selectCity = ()=>{
  document.getElementById('inputi').style.borderColor = 'white'
  getCityCoords()
  if(cities.value){
     for(let i = 0; i < cities.value.length; i++){
    if(cities.value[i].display_name == searchInput.value){
      selectedCity.value = cities.value[i]
      city.value = cities.value[i].display_name
    }
  }
  test()
  }else{
    document.getElementById('inputi').style.borderColor = 'red'
  }
 
}


async function getCode(){
    try{
        const response = await fetch(`./weathercode.json`);
        if (response.ok){
            const jsonResponse = await response.json()
            codeData.value = await jsonResponse
        
        }
    }catch(error){
        console.log(error)
    }
 }

 const makeNextHoursForeCast =  () =>{
    const nextHours = ref([])
    const d = new Date()
    let hour = d.getHours()
    if(data.value && codeData.value){
    
    for (let i = 0; i < 11; i++){
        const currentHour = hour + i
        const temp = data.value.hourly.temperature_2m[currentHour]
        const codex = data.value.hourly.weathercode[currentHour]
        const emoji =   codeData.value[codex]
        nextHours.value.push({'temperature': temp, 'code': emoji[1], 'hour': currentHour})
       
      }
    }else if(!data.value){
      alert('data')
    }else if(!codeData.value){
      alert('code')
    }
    nextHoursx.value = nextHours.value
}


const getHour = computed(() =>{
  const months = ['Jan', "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept","Oct","Nov", "Dec"]
  const d = new Date();
  const currentMonth = months[d.getMonth()]
  let currentDay = d.getDate()
  const hour = d.getHours()
  const currentMinutes = d.getMinutes()
  return  `Today ${currentDay} ${currentMonth}  ${hour}:${currentMinutes}`
}) 


const getTemperature = computed (()=>{
  if(data.value){
    const hour = getDaHour()
    return Math.floor(data.value.hourly.temperature_2m[hour]) + ' Cº'
  }
  
})

const getDaHour = () => {
  const d = new Date()
  const hour = d.getHours()
  return hour
}


const getTempCode = computed( () => {
if(data.value && codeData.value){
    const hour = getDaHour()
    const codex = data.value.hourly.weathercode[hour]
    const timeCode = codeData.value[codex]
    emoji.value = timeCode[1]
    return timeCode[0]
}
})

const test = () =>{
  lat.value = selectedCity.value.lat
  lon.value = selectedCity.value.lon
  getCityName(selectedCity.value.lat, selectedCity.value.lon)
  getWeather(selectedCity.value.lat, selectedCity.value.lon)
  back()
}

</script>

<template>
  <div class="container">
    <!--First row-->
    <div class="row mt-4">
      <div class="col-12">
          <form method="get" @submit.prevent="" class="w-100">
          <input list="browsers" name="browser" v-model="searchInput" class="mx-auto"  @change="selectCity" autocomplete="off" id="inputi">
            <datalist id="browsers">
            <option v-for="city in cities">   {{ city.display_name }} </option>
            </datalist>
          </form>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-12">
        <p class="text-center">{{ getHour }}</p>
      </div>
    </div>
    
    <div class="row">
      <div class="col-12 text-center">
        <h1 class="">{{ getTemperature }}</h1>
        <p> <i :class="emoji" class="mx-1"></i>{{ getTempCode }}</p>
        <p class="text-center fw-bold"> {{ city.name }}</p>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="d-flex flex-row flex-wrap" v-if="data">
          <ExtraInfo :dataWeather="data.hourly.apparent_temperature" dataName="Feels like" unit="°C" emoji="fa-solid fa-temperature-empty"/>
          <ExtraInfo :dataWeather="data.hourly.relativehumidity_2m" dataName="Humidity" unit="%" emoji="fa-solid fa-droplet"/>
          <ExtraInfo :dataWeather="data.hourly.cloudcover" dataName="Clouds" unit="%" emoji="fa-solid fa-cloud"/>
          <ExtraInfo :dataWeather="data.hourly.snowfall" dataName="Snow" unit="cm" emoji="fa-regular fa-snowflake"/>
          <ExtraInfo :dataWeather="data.hourly.precipitation" dataName="Rain" unit="mm" emoji="fa-solid fa-cloud-showers-heavy" />
          <ExtraInfo :dataWeather="data.hourly.windspeed_10m" dataName="Wind" unit="km/h" emoji="fa-solid fa-wind"/>
        </div>
      </div>
    </div>


    <div class="row mt-3">
      <div class="col-12 text-center" >
        <nav>
          <router-link to="/" class="text-decoration-none fw-bold rt" active-class="active">Next Hours </router-link>
          <router-link to="/days" class="text-decoration-none fw-bold rt" active-class="active">Next Days</router-link>
        </nav>
      </div>
    </div>
    
    <div class="row mt-4">
      <div class="col-12">
        <RouterView />
      </div>
    </div>

  </div>
</template>
<style scoped>

input.mx-auto{
  width: 100%;
  background-color: transparent;
  color: white;
  outline: none; 
  padding: 8px 12px;
  margin: 8px 0;
  box-sizing: border-box;
  border: 2px solid #fff;
  -webkit-transition: 0.5s;
  transition: 0.5s;
  outline: none;
  border-radius: 12px;
}


input.mx-auto:focus{
  border: 2px solid #4F4789;
}


h1{
  font-size: 58px;
}


.active{
 color: #6A6B83;
}
</style>
