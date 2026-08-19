<script setup>
import { ref } from 'vue'

const weatherList = ref([
  { id: 'city_01', name: '판교', temp: 28, status: '맑음' },
  { id: 'city_02', name: '울산', temp: 24, status: '비' },
  { id: 'city_03', name: '광주', temp: 26, status: '구름' },
])

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색하세요')
const searchedCity = ref('')

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

const searchCity = () => {
  const query = searchQuery.value.trim()

  if (query === '') {
    searchedCity.value = ''
    selectedCityInfo.value = '전체 도시를 표시합니다.'
    return
  }

  for (const city of weatherList.value) {
    if (city.name === query) {
      searchedCity.value = city.name
      selectedCityInfo.value = `${city.name}의 현재 날씨는 ${city.status}, 기온은 ${city.temp}°C입니다.`
      return
    }
  }

  searchedCity.value = query
  selectedCityInfo.value = `"${query}" 검색 결과가 없습니다.`
}
</script>

<template>
  <div class="dashboard-wrapper">
    <section class="search-box">
      <h3>🔎 도시 검색</h3>
      <!-- <input
        type="text"
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value)"
        placeholder="검색할 도시 입력"
      /> -->
      <input
        type="text"
        v-model.trim="searchQuery"
        placeholder="판교, 울산, 광주 중 입력"
        @keyup.enter="searchCity"
      />

      <button @click="searchCity">검색</button>
      <p>
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
    </section>
    <section class="list-box">
      <h3>🌆 지역별 날씨 현황</h3>
      <div
        v-for="item in weatherList"
        :key="item.id"
        v-show="searchedCity === '' || item.name === searchedCity"
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

        <span v-if="item.temp >= 25" class="badge hot">🥵 더워요 (25도 이상)</span>
        <span v-else class="badge cool">🆒 선선함 (25도 미만)</span>

        <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">
          상세보기
        </button>
      </div>
    </section>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>

<style>
.search-control {
  display: flex;
  gap: 8px;
}

.search-control input {
  flex: 1;
  width: auto;
}

.search-control button,
.temp-controller button {
  padding: 6px 12px;
  cursor: pointer;
}

.temp-controller {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}

.temp-controller input {
  width: 60px;
  text-align: center;
}
</style>
