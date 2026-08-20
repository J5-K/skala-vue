<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'

// 모든 반응형 데이터는 부모 컴포넌트에서 관리합니다.
const weatherList = ref([
  { id: 'city_01', name: '판교', temp: 28, status: '맑음' },
  { id: 'city_02', name: '울산', temp: 24, status: '비' },
  { id: 'city_03', name: '광주', temp: 26, status: '구름' },
])

const searchQuery = ref('')
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
  const total = weatherList.value.reduce((sum, city) => sum + city.temp, 0)
  return (total / weatherList.value.length).toFixed(1)
})

watch(hotThreshold, (newTemperature, oldTemperature) => {
  thresholdMessage.value =
    `더움 기준이 ${oldTemperature}°C에서 ${newTemperature}°C로 변경되었습니다.`
})

watch(selectedCityInfo, (newInfo, oldInfo) => {
  console.log(`[watch 감지] "${oldInfo}" → "${newInfo}"`)
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
  window.alert(`${city.name}의 현재 날씨는 [${city.status}] 상태입니다.`)
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

.status-bar {
  padding: 10px;
  color: #2e7d32;
  font-weight: bold;
  text-align: center;
  background: #e8f5e9;
  border-radius: 6px;
}
</style>
