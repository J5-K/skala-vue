import { ref, watch } from 'vue'
import axios from 'axios'
import { useLocationStore } from '@/stores/locationStore'
import { cityTargets } from '@/data/cityTargets'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'

export const useSelectedCityWeather = () => {
  const locationStore = useLocationStore()
  const selectedCity = ref(null)
  const isLoading = ref(false)
  const errorMessage = ref('')

  const fetchSelectedCityWeather = async (cityId) => {
    const target = cityTargets.find((city) => city.id === cityId)

    selectedCity.value = null
    errorMessage.value = ''

    if (!target) return

    isLoading.value = true

    try {
      const response = await axios.get(WEATHER_URL, {
        params: {
          lat: target.lat,
          lon: target.lon,
          appid: API_KEY,
          units: 'metric',
          lang: 'kr',
        },
      })

      selectedCity.value = {
        id: target.id,
        name: target.name,
        temp: Math.round(response.data.main.temp),
        feelsLike: Math.round(response.data.main.feels_like),
        status: response.data.weather[0].description,
        weatherMain: response.data.weather[0].main,
        humidity: response.data.main.humidity,
        wind: response.data.wind.speed,
        precipitation: response.data.rain?.['1h'] ?? response.data.snow?.['1h'] ?? 0,
      }
    } catch (error) {
      console.error('선택 지역 날씨 API 요청 실패:', error)
      errorMessage.value = '선택 지역의 최신 날씨를 불러오지 못했습니다.'
    } finally {
      isLoading.value = false
    }
  }

  watch(
    () => locationStore.selectedCityId,
    (cityId) => {
      fetchSelectedCityWeather(cityId)
    },
    { immediate: true },
  )

  return {
    selectedCity,
    isLoading,
    errorMessage,
    fetchSelectedCityWeather,
  }
}
