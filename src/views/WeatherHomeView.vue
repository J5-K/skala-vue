<script setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'

const router = useRouter()
const route = useRoute()

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

const cityTargets = [
  { id: 'city_01', name: '판교', lat: 37.3947, lon: 127.1112 },
  { id: 'city_02', name: '울산', lat: 35.5384, lon: 129.3114 },
  { id: 'city_03', name: '광주', lat: 35.1595, lon: 126.8526 },
]

// 모든 반응형 데이터는 부모 컴포넌트에서 관리합니다.
const weatherList = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

const initialSearch = typeof route.query.search === 'string' ? route.query.search : ''
const searchQuery = ref(initialSearch)
const selectedCityInfo = ref('카드를 클릭하거나 검색하세요')
const hotThreshold = ref(25)
const thresholdMessage = ref('현재 더움 기준 온도는 25°C입니다.')

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()

  if (!query) {
    return weatherList.value
  }

  return weatherList.value.filter((item) => item.name.includes(query))
})

const hotCityCount = computed(() => {
  return weatherList.value.filter((city) => city.temp >= hotThreshold.value).length
})

const averageTemperature = computed(() => {
  if (weatherList.value.length === 0) {
    return '0.0'
  }

  const total = weatherList.value.reduce((sum, city) => sum + city.temp, 0)
  return (total / weatherList.value.length).toFixed(1)
})

// 도시 좌표를 순회하며 세 도시의 실제 날씨를 동시에 요청합니다.
const fetchRealTimeWeather = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const responses = await Promise.all(
      cityTargets.map((city) =>
        axios.get(BASE_URL, {
          params: {
            lat: city.lat,
            lon: city.lon,
            appid: API_KEY,
            units: 'metric',
            lang: 'kr',
          },
        }),
      ),
    )

    weatherList.value = responses.map((response, index) => ({
      id: cityTargets[index].id,
      name: cityTargets[index].name,
      temp: Math.round(response.data.main.temp),
      feelsLike: Math.round(response.data.main.feels_like),
      status: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      wind: response.data.wind.speed,
    }))
  } catch (error) {
    console.error('날씨 API 요청 실패:', error)
    errorMessage.value = '실시간 날씨 정보를 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchRealTimeWeather()
})

watch(hotThreshold, (newTemperature, oldTemperature) => {
  thresholdMessage.value = `더움 기준이 ${oldTemperature}°C에서 ${newTemperature}°C로 변경되었습니다.`
})

watch(selectedCityInfo, (newInfo, oldInfo) => {
  console.log(`[watch 감지] "${oldInfo}" → "${newInfo}"`)
})

// 검색어를 URL에 저장하여 새로고침 후에도 검색 상태를 복원합니다.
watch(searchQuery, (newQuery) => {
  router.replace({
    name: 'weather-home',
    query: {
      search: newQuery || undefined,
    },
  })
})

watchEffect(() => {
  console.log(`[watchEffect 자동 호출] 현재 검색어: "${searchQuery.value}"`)
})

// 자식 컴포넌트가 emit한 이벤트를 받아 부모의 상태를 변경합니다.
const updateQuery = (query) => {
  searchQuery.value = query
}

const selectCard = (city) => {
  selectedCityInfo.value = `${city.name}의 날씨가 궁금하신가요?`
}

const clickDetail = (city) => {
  router.push({
    name: 'weather-detail',
    params: {
      cityId: city.id,
    },
    query: {
      temp: city.temp,
      status: city.status,
    },
  })
}

const findCity = (cityId) => {
  return weatherList.value.find((city) => city.id === cityId)
}

const changeTemperature = ({ cityId, amount }) => {
  const city = findCity(cityId)

  if (city) {
    city.temp += amount
  }
}

const updateTemperature = ({ cityId, temperature }) => {
  const city = findCity(cityId)

  if (city) {
    city.temp = temperature
  }
}
</script>

<template>
  <div class="dashboard-wrapper">
    <BaseDashboardCard>
      <SearchBar :current-query="searchQuery" @update-query="updateQuery" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <div class="standard-box">
        <h3>🌡️ 나만의 더위 기준</h3>
        <label>
          기준 온도:
          <input type="number" v-model.number="hotThreshold" />
          °C
        </label>
        <p>{{ thresholdMessage }}</p>
        <p>전체 도시 평균 기온: {{ averageTemperature }}°C</p>
        <p>더운 도시: {{ hotCityCount }}곳</p>
      </div>
    </BaseDashboardCard>

    <BaseDashboardCard>
      <h3>🌆 지역별 날씨 현황</h3>

      <p v-if="isLoading" class="loading-message">실시간 날씨를 불러오는 중입니다...</p>
      <p v-else-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <template v-else>
        <WeatherCard
          v-for="item in filteredWeatherList"
          :key="item.id"
          :city-item="item"
          :hot-threshold="hotThreshold"
          @select-card="selectCard"
          @click-detail="clickDetail"
          @change-temperature="changeTemperature"
          @update-temperature="updateTemperature"
        />

        <p v-if="filteredWeatherList.length === 0" class="empty-message">
          😭 검색 결과와 일치하는 도시가 없습니다.
        </p>
      </template>
    </BaseDashboardCard>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  width: 600px;
  margin: 0 auto;
}

.standard-box input {
  width: 70px;
}

.empty-message {
  padding: 10px 0;
  color: #e74c3c;
  text-align: center;
}

.loading-message,
.error-message {
  padding: 20px 0;
  font-weight: bold;
  text-align: center;
}

.loading-message {
  color: #3498db;
}

.error-message {
  color: #e74c3c;
}

.status-bar {
  padding: 10px;
  color: #2e7d32;
  font-weight: bold;
  text-align: center;
  background: #e8f5e9;
  border-radius: 6px;
}
</style>
