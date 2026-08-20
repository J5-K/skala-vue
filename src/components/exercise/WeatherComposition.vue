<script setup>
import { computed, ref, watch, watchEffect } from 'vue'

const weatherList = ref([
  { id: 'city_01', name: '판교', temp: 28, status: '맑음' },
  { id: 'city_02', name: '울산', temp: 24, status: '비' },
  { id: 'city_03', name: '광주', temp: 26, status: '구름' },
])

const searchQuery = ref('')
const hotThreshold = ref(25)
const thresholdMessage = ref('현재 더움 기준 온도는 25°C입니다.')
const selectedCityInfo = ref('카드를 클릭하거나 검색하세요')

// [2일 차] 검색어가 변경될 때마다 검색 결과를 자동으로 계산합니다.
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()

  if (!query) {
    return weatherList.value
  }

  return weatherList.value.filter((item) => item.name.includes(query))
})

// 선택한 카드에 따라 상태 바가 변경되는 시점을 감시합니다.
watch(selectedCityInfo, (newInfo, oldInfo) => {
  console.log(`[watch 감지] "${oldInfo}" → "${newInfo}"`)
})

// 검색어를 자동으로 의존성에 등록하고 최초 실행 및 변경 시 로그를 출력합니다.
watchEffect(() => {
  console.log(`[watchEffect 자동 호출] 현재 검색어: "${searchQuery.value}"`)
})

const hotCityCount = computed(() => {
  return weatherList.value.filter((city) => city.temp >= hotThreshold.value).length
})

const averageTemperature = computed(() => {
  const total = weatherList.value.reduce((sum, city) => sum + city.temp, 0)

  return (total / weatherList.value.length).toFixed(1)
})

watch(hotThreshold, (newTemperature, oldTemperature) => {
  thresholdMessage.value = `더움 기준이 ${oldTemperature}°C에서 ${newTemperature}°C로 변경되었습니다.`

  console.log(`[기준 온도 변경] ${oldTemperature} → ${newTemperature}`)
})

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <section class="search-box">
      <h3>🔎 도시 실시간 검색</h3>
      <input type="text" v-model.trim="searchQuery" placeholder="판교, 울산, 광주 중 입력" />

      <p>
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <section class="standard-box">
      <h3>🌡️ 나만의 더위 기준</h3>

      <label>
        기준 온도:
        <input type="number" v-model.number="hotThreshold" />
        °C
      </label>

      <p>{{ thresholdMessage }}</p>
      <p>전체 도시 평균 기온: {{ averageTemperature }}°C</p>
      <p>더운 도시: {{ hotCityCount }}곳</p>
    </section>

    <section class="list-box">
      <h3>🌆 지역별 날씨 현황</h3>
      <div
        v-for="item in filteredWeatherList"
        :key="item.id"
        class="weather-card"
        @click="selectedCityInfo = `${item.name}의 날씨가 궁금하신가요?`"
      >
        <h4>{{ item.name }} ({{ item.status }})</h4>
        <p>현재 기온: {{ item.temp }}°C</p>

        <div class="temp-controller" @click.stop>
          <button @click="item.temp--">-</button>
          <input type="number" v-model.number="item.temp" aria-label="현재 기온" />
          <button @click="item.temp++">+</button>
        </div>

        <span v-if="item.temp >= hotThreshold" class="badge hot"
          >🥵 더워요 ({{ hotThreshold }}도 이상)</span
        >
        <span v-else class="badge cool">🆒 선선함 ({{ hotThreshold }}도 미만)</span>

        <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">
          상세보기
        </button>
      </div>

      <p
        v-if="filteredWeatherList.length === 0"
        style="text-align: center; color: #e74c3c; padding: 10px 0"
      >
        😭 검색 결과와 일치하는 도시가 없습니다.
      </p>
    </section>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>

<style>
.temp-controller {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}

.temp-controller button {
  padding: 6px 12px;
  cursor: pointer;
}

.temp-controller input {
  width: 60px;
  text-align: center;
}
</style>
