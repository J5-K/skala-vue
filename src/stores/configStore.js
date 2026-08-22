import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

const getStoredNumber = (key) => {
  const storedValue = localStorage.getItem(key)

  if (storedValue === null) return null

  const numberValue = Number(storedValue)
  return Number.isNaN(numberValue) ? null : numberValue
}

export const useConfigStore = defineStore('config', () => {
  const unit = ref('celsius')
  const coldThreshold = ref(getStoredNumber('coldThreshold'))
  const hotThreshold = ref(getStoredNumber('hotThreshold'))

  const unitSymbol = computed(() => {
    return unit.value === 'celsius' ? '°C' : '°F'
  })

  const toggleUnit = () => {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  const convertTemperature = (celsius) => {
    if (unit.value === 'fahrenheit') {
      return Math.round((celsius * 9) / 5 + 32)
    }

    return celsius
  }

  watch([coldThreshold, hotThreshold], ([cold, hot]) => {
    if (cold === null || cold === undefined) {
      localStorage.removeItem('coldThreshold')
    } else {
      localStorage.setItem('coldThreshold', String(cold))
    }

    if (hot === null || hot === undefined) {
      localStorage.removeItem('hotThreshold')
    } else {
      localStorage.setItem('hotThreshold', String(hot))
    }
  })

  return {
    unit,
    unitSymbol,
    coldThreshold,
    hotThreshold,
    toggleUnit,
    convertTemperature,
  }
})
