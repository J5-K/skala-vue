<script setup>
import { computed, ref, watch, watchEffect } from 'vue'

/*
 * 3일 동안 하나의 파일에서 발전시키는 날씨 과제입니다.
 * - Day 1: Vue 기본 문법으로 검색, 카드 표시, 온도 조절 구현
 * - Day 2: Composition API로 검색과 날씨 요약 기능 개선
 * - Day 3: 다음 수업 내용을 이 파일에 이어서 적용 예정
 */

const weatherList = ref([
  { id: 'city_01', name: '판교', temp: 28, status: '맑음' },
  { id: 'city_02', name: '울산', temp: 24, status: '비' },
  { id: 'city_03', name: '광주', temp: 26, status: '구름' },
])

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색하세요')

/*
 * [Day 1 핵심 기록]
 *
 * 1. ref()로 날씨 목록, 검색어, 선택 상태를 반응형으로 관리했습니다.
 * 2. v-model.trim으로 검색어의 양끝 공백을 제거했습니다.
 * 3. 검색 버튼과 Enter 이벤트로 searchCity()를 실행했습니다.
 * 4. for...of로 일치하는 도시를 찾고 searchedCity에 저장했습니다.
 * 5. v-show로 검색된 도시 카드만 표시했습니다.
 * 6. v-model.number로 온도를 변경하고 v-if/v-else로 배지를 구분했습니다.
 * 7. @click.stop으로 카드 내부 버튼의 이벤트 전파를 막았습니다.
 *
 * Day 1 검색 핵심 코드(현재는 Day 2 computed 검색으로 대체):
 *
 * const searchedCity = ref('')
 *
 * const searchCity = () => {
 *   const query = searchQuery.value.trim()
 *
 *   if (query === '') {
 *     searchedCity.value = ''
 *     return
 *   }
 *
 *   for (const city of weatherList.value) {
 *     if (city.name === query) {
 *       searchedCity.value = city.name
 *       return
 *     }
 *   }
 * }
 *
 * 템플릿 표시 조건:
 * v-for="item in weatherList"
 * v-show="searchedCity === '' || item.name === searchedCity"
 */

/*
 * [Day 2-1] computed 실시간 검색
 * searchQuery가 바뀔 때마다 검색 결과를 자동 계산합니다.
 * Day 1의 검색 버튼, searchCity 함수, v-show가 필요하지 않습니다.
 */
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()

  if (!query) {
    return weatherList.value
  }

  return weatherList.value.filter((item) => item.name.includes(query))
})

/*
 * [Day 2-2] 나만의 반응형 상태
 * 사용자가 더움의 기준 온도를 직접 정할 수 있습니다.
 */
const hotThreshold = ref(25)
const thresholdMessage = ref('현재 더움 기준 온도는 25°C입니다.')

// 기준 온도에 따라 더운 도시 수를 자동으로 계산합니다.
const hotCityCount = computed(() => {
  return weatherList.value.filter((city) => city.temp >= hotThreshold.value).length
})

// 도시 온도가 바뀔 때마다 전체 평균 온도를 자동으로 계산합니다.
const averageTemperature = computed(() => {
  const total = weatherList.value.reduce((sum, city) => sum + city.temp, 0)
  return (total / weatherList.value.length).toFixed(1)
})

/*
 * [Day 2-3] watch
 * 이전 값과 새로운 값을 이용해 기준 온도 변경 메시지를 만듭니다.
 */
watch(hotThreshold, (newTemperature, oldTemperature) => {
  thresholdMessage.value =
    `더움 기준이 ${oldTemperature}°C에서 ${newTemperature}°C로 변경되었습니다.`
})

// 카드 선택으로 상태 바 문구가 바뀌는 시점을 확인합니다.
watch(selectedCityInfo, (newInfo, oldInfo) => {
  console.log(`[watch 감지] "${oldInfo}" → "${newInfo}"`)
})

/*
 * [Day 2-4] watchEffect
 * 내부에서 사용한 searchQuery를 자동으로 감시하고 최초 실행 시에도 동작합니다.
 */
watchEffect(() => {
  console.log(`[watchEffect 자동 호출] 현재 검색어: "${searchQuery.value}"`)
})

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

/*
 * [Day 3]
 * 다음 수업에서 학습한 기능을 아래부터 이어서 추가합니다.
 */
</script>

<template>
  <div class="dashboard-wrapper">
    <!-- Day 2: computed를 이용한 실시간 검색 -->
    <section class="search-box">
      <h3>🔎 도시 실시간 검색</h3>
      <input type="text" v-model.trim="searchQuery" placeholder="판교, 울산, 광주 중 입력" />
      <p>
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <!-- Day 2: 사용자 기준 온도와 computed 요약 정보 -->
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

        <!-- Day 1 기능을 유지: 온도 변경과 이벤트 전파 방지 -->
        <div class="temp-controller" @click.stop>
          <button @click="item.temp--">-</button>
          <input type="number" v-model.number="item.temp" aria-label="현재 기온" />
          <button @click="item.temp++">+</button>
        </div>

        <!-- Day 2: 고정값 25 대신 사용자가 정한 hotThreshold 적용 -->
        <span v-if="item.temp >= hotThreshold" class="badge hot">
          🥵 더워요 ({{ hotThreshold }}도 이상)
        </span>
        <span v-else class="badge cool">🆒 선선함 ({{ hotThreshold }}도 미만)</span>

        <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">
          상세보기
        </button>
      </div>

      <p
        v-if="filteredWeatherList.length === 0"
        class="empty-message"
      >
        😭 검색 결과와 일치하는 도시가 없습니다.
      </p>
    </section>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>

<style scoped>
.standard-box {
  padding: 15px;
  margin-bottom: 15px;
  background: #fff8e1;
  border: 1px solid #ffe082;
  border-radius: 8px;
}

.standard-box input {
  width: 70px;
}

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

.empty-message {
  padding: 10px 0;
  color: #e74c3c;
  text-align: center;
}
</style>
