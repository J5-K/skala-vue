import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLocationStore = defineStore('location', () => {
  const selectedCityId = ref(localStorage.getItem('selectedCityId') || '')

  const selectLocation = (cityId) => {
    selectedCityId.value = cityId
    localStorage.setItem('selectedCityId', cityId)
  }

  return {
    selectedCityId,
    selectLocation,
  }
})
