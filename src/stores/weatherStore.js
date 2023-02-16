import { defineStore} from 'pinia'
import {ref} from  'vue'

export const useWeatherStore = defineStore( 'weather', ()=> {

    
    const nextHoursx = ref('')
    const lat = ref('')
    const lon = ref('')
    const codeData = ref('')
    return {
        nextHoursx,
        lat,
        lon, 
        codeData
    }

})