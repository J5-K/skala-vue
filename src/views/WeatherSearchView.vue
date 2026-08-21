<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

import CitySearchForm from '@/components/exercise/CitySearchForm.vue'
import CitySearchResult from '@/components/exercise/CitySearchResult.vue'

const route = useRoute()
const router = useRouter()

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const GEOCODING_URL = 'https://api.openweathermap.org/geo/1.0/direct'
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'

const currentQuery = ref('')
const locations = ref([])
const selectedWeather = ref(null)
const isSearching = ref(false)
const isWeatherLoading = ref(false)
const errorMessage = ref('')

const searchLocations = async (query) => {
  currentQuery.value = query
  locations.value = []
  selectedWeather.value = null
  errorMessage.value = ''
  isSearching.value = true

  try {
    const response = await axios.get(GEOCODING_URL, {
      params: {
        q: query,
        limit: 5,
        appid: API_KEY,
      },
    })

    locations.value = response.data

    if (locations.value.length === 0) {
      errorMessage.value = '검색 결과와 일치하는 도시가 없습니다.'
    }
  } catch (error) {
    console.error('도시 검색 API 요청 실패:', error)
    errorMessage.value = '도시를 검색하지 못했습니다. 잠시 후 다시 시도해 주세요.'
  } finally {
    isSearching.value = false
  }
}

const handleSearch = (query) => {
  if (route.query.q === query) {
    searchLocations(query)
    return
  }

  router.push({
    name: 'weather-search',
    query: { q: query },
  })
}

const selectLocation = async (location) => {
  selectedWeather.value = null
  errorMessage.value = ''
  isWeatherLoading.value = true

  try {
    const response = await axios.get(WEATHER_URL, {
      params: {
        lat: location.lat,
        lon: location.lon,
        appid: API_KEY,
        units: 'metric',
        lang: 'kr',
      },
    })

    const data = response.data
    selectedWeather.value = {
      name: location.local_names?.ko ?? location.name,
      location: [location.state, location.country].filter(Boolean).join(', '),
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      status: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      wind: data.wind.speed,
    }
  } catch (error) {
    console.error('검색 도시 날씨 API 요청 실패:', error)
    errorMessage.value = '선택한 도시의 날씨를 불러오지 못했습니다.'
  } finally {
    isWeatherLoading.value = false
  }
}

watch(
  () => route.query.q,
  (query) => {
    const normalizedQuery = typeof query === 'string' ? query.trim() : ''

    if (normalizedQuery) {
      searchLocations(normalizedQuery)
    } else {
      currentQuery.value = ''
      locations.value = []
      selectedWeather.value = null
      errorMessage.value = ''
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="city-search-view">
    <header>
      <h2>🌍 다른 도시 날씨 검색</h2>
      <p>국내외 도시를 검색하고 현재 날씨를 확인해 보세요.</p>
    </header>

    <CitySearchForm
      :current-query="currentQuery"
      :is-loading="isSearching"
      @search-city="handleSearch"
    />

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <CitySearchResult
      :locations="locations"
      :selected-weather="selectedWeather"
      :is-loading="isWeatherLoading"
      @select-location="selectLocation"
    />
  </div>
</template>

<style scoped>
.city-search-view {
  width: min(680px, 100%);
  margin: 0 auto;
}

.city-search-view header {
  margin-bottom: 18px;
}

.city-search-view header h2,
.city-search-view header p {
  margin: 0 0 8px;
}

.error-message {
  padding: 12px;
  margin-top: 15px;
  color: #c0392b;
  text-align: center;
  background: #fff2f2;
  border-radius: 6px;
}
</style>
