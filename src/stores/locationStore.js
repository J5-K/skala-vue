import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLocationStore = defineStore('location', () => {
  const selectedCityId = ref('')
  const selectedCity = ref(null)

  const selectLocation = (city) => {
    selectedCityId.value = city.id
    selectedCity.value = city
  }

  return {
    selectedCityId,
    selectedCity,
    selectLocation,
  }
})
