<script setup>
import { computed } from 'vue';
const props = defineProps(['dataWeather','dataName', 'unit', 'emoji'])

const hour = () => {
  const d = new Date()
  const hour = d.getHours()
  return hour
}


const theData = computed( () =>{
  const theHour = hour()
  return props.dataWeather[theHour]
})

</script>


<template>
    <div class="weatherDiv mx-2 my-2 p-2 mx-auto">
      <h6 class="fw-bold text-center">{{ dataName }}  <i :class="emoji"> </i></h6>
      <p class="text-center"> {{theData}}{{ unit }}</p>
    </div>
</template>

<style scoped>

.weatherDiv{
  background-color: #ffffff1a;
  width: 100px;
  height: 70px;
  border-radius: 15px;
}

@media only screen and (min-width: 900px) {
  
  .weatherDiv{
  background-color: #ECEEF1;
  width: 15%;
  }
}

</style>
