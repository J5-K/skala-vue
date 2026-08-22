<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { travelRecommendations } from '@/data/travelRecommendations'

import CitySearchForm from '@/components/exercise/CitySearchForm.vue'
import CitySearchResult from '@/components/exercise/CitySearchResult.vue'
import TravelRecommendations from '@/components/exercise/TravelRecommendations.vue'

const route = useRoute()
const router = useRouter()

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY
const GEOCODING_URL = 'https://api.openweathermap.org/geo/1.0/direct'
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
const PEXELS_URL = 'https://api.pexels.com/v1/search'

const currentQuery = ref('')
const searchMode = ref('domestic')
const locations = ref([])
const selectedWeather = ref(null)
const isSearching = ref(false)
const isWeatherLoading = ref(false)
const errorMessage = ref('')
const recommendations = ref([])
const recommendationsMode = ref('')
const areRecommendationsLoading = ref(false)
const photoCache = new Map()
let recommendationRequestId = 0

const pickRandomCities = (cities, count) => {
  const shuffledCities = [...cities]

  for (let index = shuffledCities.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffledCities[index], shuffledCities[randomIndex]] = [
      shuffledCities[randomIndex],
      shuffledCities[index],
    ]
  }

  return shuffledCities.slice(0, count)
}

const pickRandomPhoto = (photos, previousImageUrl) => {
  if (photos.length === 0) return null

  const newPhotos = photos.filter((photo) => photo.imageUrl !== previousImageUrl)
  const candidates = newPhotos.length > 0 ? newPhotos : photos

  return candidates[Math.floor(Math.random() * candidates.length)]
}

const loadCityPhoto = async (city, previousImageUrl) => {
  if (photoCache.has(city.id)) {
    const cachedPhoto = pickRandomPhoto(photoCache.get(city.id), previousImageUrl)
    return cachedPhoto ? { ...city, ...cachedPhoto } : city
  }

  try {
    const response = await axios.get(PEXELS_URL, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
      params: {
        query: city.photoQuery,
        orientation: 'landscape',
        per_page: 3,
      },
    })
    const photos = response.data.photos.map((photo) => ({
      imageUrl: photo.src.large,
      photographer: photo.photographer,
      photoUrl: photo.url,
    }))

    photoCache.set(city.id, photos)

    const selectedPhoto = pickRandomPhoto(photos, previousImageUrl)
    return selectedPhoto ? { ...city, ...selectedPhoto } : city
  } catch (error) {
    console.error(`${city.name} 이미지 요청 실패:`, error)
    return city
  }
}

const refreshRecommendations = async () => {
  const mode = searchMode.value
  const selectedCities = pickRandomCities(travelRecommendations[mode], 3)
  const requestId = ++recommendationRequestId
  const previousImages = new Map(recommendations.value.map((city) => [city.id, city.imageUrl]))

  recommendationsMode.value = mode
  recommendations.value = selectedCities

  if (!PEXELS_API_KEY) {
    areRecommendationsLoading.value = false
    return
  }

  areRecommendationsLoading.value = selectedCities.some((city) => !photoCache.has(city.id))

  const citiesWithPhotos = await Promise.all(
    selectedCities.map((city) => loadCityPhoto(city, previousImages.get(city.id))),
  )

  if (requestId === recommendationRequestId) {
    recommendations.value = citiesWithPhotos
    areRecommendationsLoading.value = false
  }
}

const searchLocations = async (query) => {
  const normalizedQuery = query.trim().replace(/\s+/g, ' ')
  const apiQuery = searchMode.value === 'domestic' ? `${normalizedQuery},KR` : normalizedQuery

  currentQuery.value = normalizedQuery
  locations.value = []
  selectedWeather.value = null
  errorMessage.value = ''
  isSearching.value = true

  try {
    const response = await axios.get(GEOCODING_URL, {
      params: {
        q: apiQuery,
        limit: 5,
        appid: API_KEY,
      },
    })

    locations.value = response.data.filter((location) => {
      return searchMode.value === 'domestic'
        ? location.country === 'KR'
        : location.country !== 'KR'
    })

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
  if (route.query.q === query && route.query.mode === searchMode.value) {
    searchLocations(query)
    return
  }

  router.push({
    name: 'weather-search',
    query: {
      q: query,
      mode: searchMode.value,
    },
  })
}

const changeSearchMode = (mode) => {
  searchMode.value = mode
  currentQuery.value = ''
  locations.value = []
  selectedWeather.value = null
  errorMessage.value = ''

  router.replace({
    name: 'weather-search',
    query: { mode },
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
      weatherMain: data.weather[0].main,
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
  [() => route.query.q, () => route.query.mode],
  ([query, mode]) => {
    searchMode.value = mode === 'overseas' ? 'overseas' : 'domestic'
    const normalizedQuery = typeof query === 'string' ? query.trim() : ''

    if (recommendationsMode.value !== searchMode.value) {
      refreshRecommendations()
    }

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
      <h2>✈️ 여행지 날씨 찾기</h2>
      <p>수업이 끝나면 어디로 떠나고 싶나요? 여행지의 현재 날씨부터 확인해 보세요.</p>
    </header>

    <CitySearchForm
      :current-query="currentQuery"
      :search-mode="searchMode"
      :is-loading="isSearching"
      @update:search-mode="changeSearchMode"
      @search-city="handleSearch"
    />

    <TravelRecommendations
      :recommendations="recommendations"
      :is-loading="areRecommendationsLoading"
      @select-city="handleSearch"
      @refresh="refreshRecommendations"
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
  width: min(960px, 100%);
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
