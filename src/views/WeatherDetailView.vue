<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const configStore = useConfigStore()
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

const cityCoordinates = {
  city_01: { lat: 37.3947, lon: 127.1112 },
  city_02: { lat: 35.5384, lon: 129.3114 },
  city_03: { lat: 35.1595, lon: 126.8526 },
}

const apiDetails = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

const mockDetails = {
  city_01: {
    name: '경기도 성남시 판교',
    temp: 28,
    status: '맑음',
    humidity: '55%',
    wind: '2.5m/s',
  },
  city_02: {
    name: '울산광역시',
    temp: 24,
    status: '비',
    humidity: '85%',
    wind: '4.1m/s',
  },
  city_03: {
    name: '광주광역시',
    temp: 26,
    status: '구름',
    humidity: '65%',
    wind: '3.0m/s',
  },
}

const cityData = computed(() => {
  const original = mockDetails[route.params.cityId]

  if (!original) {
    return null
  }

  return {
    ...original,
    ...apiDetails.value,
    temp:
      route.query.temp !== undefined
        ? Number(route.query.temp)
        : (apiDetails.value?.temp ?? original.temp),
    status: route.query.status ?? apiDetails.value?.status ?? original.status,
  }
})

const formatLocalTime = (timestamp, timezone) => {
  const localTime = (timestamp + timezone) * 1000

  return new Date(localTime).toLocaleTimeString('ko-KR', {
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const fetchDetailWeather = async (cityId) => {
  const coordinates = cityCoordinates[cityId]
  apiDetails.value = null
  errorMessage.value = ''

  if (!coordinates) {
    return
  }

  isLoading.value = true

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        lat: coordinates.lat,
        lon: coordinates.lon,
        appid: API_KEY,
        units: 'metric',
        lang: 'kr',
      },
    })

    const data = response.data
    apiDetails.value = {
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      status: data.weather[0].description,
      humidity: `${data.main.humidity}%`,
      wind: `${data.wind.speed}m/s`,
      sunrise: formatLocalTime(data.sys.sunrise, data.timezone),
      sunset: formatLocalTime(data.sys.sunset, data.timezone),
    }
  } catch (error) {
    console.error('상세 날씨 API 요청 실패:', error)
    errorMessage.value = '실시간 상세 정보를 불러오지 못해 기본 정보를 표시합니다.'
  } finally {
    isLoading.value = false
  }
}

watch(
  () => route.params.cityId,
  (cityId) => fetchDetailWeather(cityId),
  { immediate: true },
)

const displayTemp = computed(() => {
  if (!cityData.value) {
    return 0
  }
  return configStore.convertTemperature(cityData.value.temp)
})

const displayFeelsLike = computed(() => {
  if (cityData.value?.feelsLike === undefined) {
    return null
  }

  return configStore.convertTemperature(cityData.value.feelsLike)
})

const goHome = () => {
  router.push({ name: 'weather-home' })
}
</script>

<template>
  <div class="detail-container">
    <h3>📊 지역별 상세 기상 관측 정보</h3>
    <hr />

    <p v-if="isLoading" class="loading-message">실시간 상세 날씨를 불러오는 중입니다...</p>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <div v-if="cityData" class="info-card">
      <h4>📌 지정 지역: {{ cityData.name }}</h4>
      <p>
        실시간 기온: <strong>{{ displayTemp }}{{ configStore.unitSymbol }}</strong>
      </p>
      <p v-if="displayFeelsLike !== null">
        체감 온도: <strong>{{ displayFeelsLike }}{{ configStore.unitSymbol }}</strong>
      </p>
      <p>기상 현황: {{ cityData.status }}</p>
      <p>대기 습도: {{ cityData.humidity }}</p>
      <p>현재 풍속: {{ cityData.wind }}</p>
      <p v-if="cityData.sunrise">🌅 일출: {{ cityData.sunrise }}</p>
      <p v-if="cityData.sunset">🌇 일몰: {{ cityData.sunset }}</p>
    </div>
    <div v-else>
      <p>해당 지역의 상세 데이터 장부가 존재하지 않습니다.</p>
    </div>

    <button class="back-btn" @click="goHome">← 메인 대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
.detail-container {
  margin: 0 auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.info-card {
  background: #f1f2f6;
  padding: 15px;
  border-radius: 6px;
  margin: 15px 0;
}
.loading-message {
  color: #3498db;
}
.error-message {
  color: #e74c3c;
}
.back-btn {
  padding: 8px 12px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
