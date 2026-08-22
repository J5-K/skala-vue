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

const travelTip = computed(() => {
  if (!props.selectedWeather) {
    return ''
  }

  const { weatherMain, temp, wind } = props.selectedWeather

  if (weatherMain === 'Rain' || weatherMain === 'Drizzle') {
    return '비가 오고 있어요. 실내 명소와 분위기 좋은 카페를 함께 찾아보세요.'
  }

  if (weatherMain === 'Snow') {
    return '눈 풍경을 즐기기 좋지만 이동 시간을 넉넉하게 잡아주세요.'
  }

  if (weatherMain === 'Thunderstorm' || wind >= 10) {
    return '날씨가 거칠어요. 이동 일정을 여유롭게 잡고 실내 코스를 준비해 보세요.'
  }

  if (temp >= 30) {
    return '한낮 야외 일정은 줄이고 시원한 실내 코스를 중심으로 계획해 보세요.'
  }

  if (temp <= 0) {
    return '따뜻한 옷을 챙기고 실내 명소를 중심으로 여행해 보세요.'
  }

  if (weatherMain === 'Clear') {
    return '산책과 야외 관광을 즐기기 좋은 날씨예요. 가볍게 떠나볼까요?'
  }

  return '현재 날씨를 참고해 실내와 야외 일정을 적절히 섞어보세요.'
})

const locationLabel = (location) => {
  return [location.name, location.state, location.country].filter(Boolean).join(', ')
}
</script>

<template>
  <section v-if="locations.length > 0" class="location-section">
    <h3>📍 찾은 여행지 후보</h3>
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
    <el-alert
      class="travel-tip"
      :title="travelTip"
      type="success"
      :closable="false"
      show-icon
    />
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

.travel-tip {
  margin-top: 14px;
}
</style>
