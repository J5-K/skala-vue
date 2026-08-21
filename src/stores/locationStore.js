import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLocationStore = defineStore('location', () => {
  const selectedCityId = ref('')

  const selectLocation = (cityId) => {
    selectedCityId.value = cityId
  }

  return {
    selectedCityId,
    selectLocation,
  }
})
