<script setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import axios from 'axios'
import { useLocationStore } from '@/stores/locationStore'
import { useConfigStore } from '@/stores/configStore'
import { cityTargets } from '@/data/cityTargets'

import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import CommuteGuide from '../components/exercise/CommuteGuide.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'

const router = useRouter()
const route = useRoute()
const locationStore = useLocationStore()
const configStore = useConfigStore()
const { coldThreshold, hotThreshold } = storeToRefs(configStore)

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

// 모든 반응형 데이터는 부모 컴포넌트에서 관리합니다.
const weatherList = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

const initialSearch = typeof route.query.search === 'string' ? route.query.search : ''
const searchQuery = ref(initialSearch)
const selectedCityInfo = ref('카드를 클릭하거나 검색하세요')

const thresholdMessage = computed(() => {
  if (hotThreshold.value === null || coldThreshold.value === null) {
    return '더위와 추위 기준 온도를 입력해 주세요.'
  }

  if (coldThreshold.value >= hotThreshold.value) {
    return '추위 기준은 더위 기준보다 낮게 입력해 주세요.'
  }

  return `추위 ${coldThreshold.value}°C 이하 · 더위 ${hotThreshold.value}°C 이상`
})

const isThresholdValid = computed(() => {
  return (
    coldThreshold.value !== null &&
    hotThreshold.value !== null &&
    coldThreshold.value < hotThreshold.value
  )
})

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()

  if (!query) {
    return weatherList.value
  }

  return weatherList.value.filter((item) => item.name.includes(query))
})

const hotCityCount = computed(() => {
  if (!isThresholdValid.value) {
    return 0
  }

  return weatherList.value.filter((city) => city.temp >= hotThreshold.value).length
})

const coldCityCount = computed(() => {
  if (!isThresholdValid.value) {
    return 0
  }

  return weatherList.value.filter((city) => city.temp <= coldThreshold.value).length
})

const mildCityCount = computed(() => {
  if (!isThresholdValid.value) {
    return 0
  }

  return weatherList.value.filter(
    (city) => city.temp > coldThreshold.value && city.temp < hotThreshold.value,
  ).length
})

const averageTemperature = computed(() => {
  if (weatherList.value.length === 0) {
    return '0.0'
  }

  const total = weatherList.value.reduce((sum, city) => sum + city.temp, 0)
  return (total / weatherList.value.length).toFixed(1)
})

const myCity = computed(() => {
  return weatherList.value.find((city) => city.id === locationStore.selectedCityId) ?? null
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
      weatherMain: response.data.weather[0].main,
      humidity: response.data.main.humidity,
      wind: response.data.wind.speed,
      precipitation: response.data.rain?.['1h'] ?? response.data.snow?.['1h'] ?? 0,
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

const setMyLocation = (city) => {
  locationStore.selectLocation(city.id)
  selectedCityInfo.value = `${city.name}을(를) 내 지역으로 설정했습니다.`
}

const clickDetail = (city) => {
  router.push({
    name: 'weather-detail',
    params: {
      cityId: city.id,
    },
  })
}

</script>

<template>
  <div class="dashboard-wrapper">
    <div class="dashboard-grid">
      <aside class="dashboard-sidebar">
        <BaseDashboardCard>
          <SearchBar :current-query="searchQuery" @update-query="updateQuery" />
        </BaseDashboardCard>

        <BaseDashboardCard>
          <div class="standard-box">
            <h3>🌡️ 나만의 온도 기준</h3>
            <div class="threshold-inputs">
              <label>
                🥶 추위 기준:
                <el-input-number
                  v-model="coldThreshold"
                  :controls="false"
                  placeholder="예: 10"
                />
                °C 이하
              </label>

              <label>
                🥵 더위 기준:
                <el-input-number
                  v-model="hotThreshold"
                  :controls="false"
                  placeholder="예: 25"
                />
                °C 이상
              </label>
            </div>

            <small class="threshold-notice">온도 기준은 섭씨(°C)로 입력해 주세요.</small>

            <el-alert
              :title="thresholdMessage"
              :type="isThresholdValid ? 'success' : 'warning'"
              :closable="false"
              show-icon
            />
            <p>전체 도시 평균 기온: {{ averageTemperature }}°C</p>
            <p v-if="isThresholdValid">
              추운 도시: {{ coldCityCount }}곳 · 적당한 도시: {{ mildCityCount }}곳 · 더운
              도시: {{ hotCityCount }}곳
            </p>
          </div>
        </BaseDashboardCard>
      </aside>

      <BaseDashboardCard class="weather-panel">
        <h3>🌆 지역별 날씨 현황</h3>

        <el-skeleton v-if="isLoading" :rows="5" animated />
        <el-alert
          v-else-if="errorMessage"
          :title="errorMessage"
          type="error"
          :closable="false"
          show-icon
        />

        <template v-else>
          <WeatherCard
            v-for="item in filteredWeatherList"
            :key="item.id"
            :city-item="item"
            :hot-threshold="hotThreshold"
            :cold-threshold="coldThreshold"
            :is-my-location="locationStore.selectedCityId === item.id"
            @select-card="selectCard"
            @click-detail="clickDetail"
            @set-my-location="setMyLocation"
          />

          <el-empty
            v-if="filteredWeatherList.length === 0"
            description="검색 결과와 일치하는 도시가 없습니다."
          />
        </template>
      </BaseDashboardCard>
    </div>

    <CommuteGuide :city="myCity" />

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(290px, 360px) minmax(0, 1fr);
  gap: 20px;
  align-items: stretch;
}

.dashboard-sidebar {
  display: grid;
  gap: 20px;
}

.standard-box :deep(.el-input-number) {
  width: 110px;
}

.threshold-inputs {
  display: grid;
  gap: 12px;
  margin-bottom: 12px;
}

.threshold-notice {
  display: block;
  margin: -4px 0 12px;
  color: #64748b;
}

.threshold-inputs label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-bar {
  padding: 10px;
  color: #2e7d32;
  font-weight: bold;
  text-align: center;
  background: #e8f5e9;
  border-radius: 6px;
}

@media (max-width: 900px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .threshold-inputs label {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
