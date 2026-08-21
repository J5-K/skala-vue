<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'

const props = defineProps({
  locations: {
    type: Array,
    required: true,
  },
  selectedWeather: {
    type: Object,
    default: null,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select-location'])
const configStore = useConfigStore()

const displayTemp = computed(() => {
  if (!props.selectedWeather) {
    return null
  }

  return configStore.convertTemperature(props.selectedWeather.temp)
})

const displayFeelsLike = computed(() => {
  if (!props.selectedWeather) {
    return null
  }

  return configStore.convertTemperature(props.selectedWeather.feelsLike)
})

const locationLabel = (location) => {
  return [location.name, location.state, location.country].filter(Boolean).join(', ')
}
</script>

<template>
  <section v-if="locations.length > 0" class="location-section">
    <h3>📍 검색된 지역</h3>
    <button
      v-for="location in locations"
      :key="`${location.lat}-${location.lon}`"
      class="location-button"
      type="button"
      @click="emit('select-location', location)"
    >
      {{ locationLabel(location) }}
    </button>
  </section>

  <p v-if="isLoading" class="loading-message">선택한 도시의 날씨를 불러오는 중입니다...</p>

  <section v-if="selectedWeather" class="weather-result">
    <div class="weather-title">
      <div>
        <h3>{{ selectedWeather.name }}</h3>
        <p>{{ selectedWeather.location }}</p>
      </div>
      <img
        :src="`https://openweathermap.org/img/wn/${selectedWeather.icon}@2x.png`"
        :alt="selectedWeather.status"
      />
    </div>

    <p>
      현재 기온: <strong>{{ displayTemp }}{{ configStore.unitSymbol }}</strong>
    </p>
    <p>
      체감 온도: <strong>{{ displayFeelsLike }}{{ configStore.unitSymbol }}</strong>
    </p>
    <p>날씨 상태: {{ selectedWeather.status }}</p>
    <p>습도: {{ selectedWeather.humidity }}%</p>
    <p>풍속: {{ selectedWeather.wind }}m/s</p>
  </section>
</template>

<style scoped>
.location-section,
.weather-result {
  padding: 18px;
  margin-top: 15px;
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
}

.location-button {
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 8px;
  color: #2c3e50;
  text-align: left;
  cursor: pointer;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
}

.location-button:hover {
  background: #eaf4ff;
}

.loading-message {
  padding: 20px;
  color: #3498db;
  font-weight: bold;
  text-align: center;
}

.weather-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.weather-title h3,
.weather-title p {
  margin: 0;
}

.weather-title img {
  width: 72px;
  height: 72px;
}
</style>
