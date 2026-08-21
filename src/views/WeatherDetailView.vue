<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import axios from 'axios'

import WeatherForecast from '@/components/exercise/WeatherForecast.vue'

const route = useRoute()
const router = useRouter()

const configStore = useConfigStore()
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast'

const cityCoordinates = {
  city_01: { lat: 37.3947, lon: 127.1112 },
  city_02: { lat: 35.5384, lon: 129.3114 },
  city_03: { lat: 35.1595, lon: 126.8526 },
}

const apiDetails = ref(null)
const forecastList = ref([])
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

const createDailyForecast = (forecastData) => {
  const timezone = forecastData.city.timezone
  const dailyGroups = new Map()

  for (const item of forecastData.list) {
    const localDate = new Date((item.dt + timezone) * 1000)
    const dateKey = localDate.toISOString().slice(0, 10)
    const hour = localDate.getUTCHours()

    if (!dailyGroups.has(dateKey)) {
      dailyGroups.set(dateKey, [])
    }

    dailyGroups.get(dateKey).push({ item, hour })
  }

  return Array.from(dailyGroups.entries())
    .slice(0, 5)
    .map(([date, entries]) => {
      const representative = entries.reduce((closest, current) => {
        return Math.abs(current.hour - 12) < Math.abs(closest.hour - 12) ? current : closest
      })
      const minTemp = Math.min(...entries.map(({ item }) => item.main.temp_min))
      const maxTemp = Math.max(...entries.map(({ item }) => item.main.temp_max))
      const maxPop = Math.max(...entries.map(({ item }) => item.pop ?? 0))

      return {
        date,
        dateLabel: new Date(`${date}T00:00:00Z`).toLocaleDateString('ko-KR', {
          timeZone: 'UTC',
          month: 'numeric',
          day: 'numeric',
          weekday: 'short',
        }),
        minTemp: Math.round(minTemp),
        maxTemp: Math.round(maxTemp),
        status: representative.item.weather[0].description,
        icon: representative.item.weather[0].icon,
        pop: Math.round(maxPop * 100),
      }
    })
}

const fetchDetailWeather = async (cityId) => {
  const coordinates = cityCoordinates[cityId]
  apiDetails.value = null
  forecastList.value = []
  errorMessage.value = ''

  if (!coordinates) {
    return
  }

  isLoading.value = true

  try {
    const requestParams = {
      lat: coordinates.lat,
      lon: coordinates.lon,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    }

    const [currentResponse, forecastResponse] = await Promise.all([
      axios.get(BASE_URL, { params: requestParams }),
      axios.get(FORECAST_URL, { params: requestParams }),
    ])

    const data = currentResponse.data
    apiDetails.value = {
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      status: data.weather[0].description,
      humidity: `${data.main.humidity}%`,
      wind: `${data.wind.speed}m/s`,
      sunrise: formatLocalTime(data.sys.sunrise, data.timezone),
      sunset: formatLocalTime(data.sys.sunset, data.timezone),
    }
    forecastList.value = createDailyForecast(forecastResponse.data)
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

    <el-skeleton v-if="isLoading" :rows="4" animated />
    <el-alert
      v-if="errorMessage"
      :title="errorMessage"
      type="warning"
      :closable="false"
      show-icon
    />

    <el-card v-if="cityData" class="info-card" shadow="never">
      <h4>📌 지정 지역: {{ cityData.name }}</h4>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="실시간 기온">
          {{ displayTemp }}{{ configStore.unitSymbol }}
        </el-descriptions-item>
        <el-descriptions-item v-if="displayFeelsLike !== null" label="체감 온도">
          {{ displayFeelsLike }}{{ configStore.unitSymbol }}
        </el-descriptions-item>
        <el-descriptions-item label="기상 현황">{{ cityData.status }}</el-descriptions-item>
        <el-descriptions-item label="대기 습도">{{ cityData.humidity }}</el-descriptions-item>
        <el-descriptions-item label="현재 풍속">{{ cityData.wind }}</el-descriptions-item>
        <el-descriptions-item v-if="cityData.sunrise" label="🌅 일출">
          {{ cityData.sunrise }}
        </el-descriptions-item>
        <el-descriptions-item v-if="cityData.sunset" label="🌇 일몰">
          {{ cityData.sunset }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-empty v-else description="해당 지역의 상세 데이터가 존재하지 않습니다." />

    <WeatherForecast v-if="forecastList.length > 0" :forecast-list="forecastList" />

    <el-button type="primary" @click="goHome">← 메인 대시보드로 돌아가기</el-button>
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
  margin: 15px 0;
}
</style>
