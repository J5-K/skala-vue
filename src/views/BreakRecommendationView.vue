<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useLocationStore } from '@/stores/locationStore'
import { cityTargets } from '@/data/cityTargets'
import BreakRecommendation from '@/components/exercise/BreakRecommendation.vue'

const router = useRouter()
const locationStore = useLocationStore()
const selectedCity = ref(null)

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'

const fetchSelectedCityWeather = async (cityId) => {
  const target = cityTargets.find((city) => city.id === cityId)

  if (!target) {
    selectedCity.value = null
    return
  }

  try {
    const response = await axios.get(WEATHER_URL, {
      params: {
        lat: target.lat,
        lon: target.lon,
        appid: API_KEY,
        units: 'metric',
        lang: 'kr',
      },
    })

    selectedCity.value = {
      id: target.id,
      name: target.name,
      temp: Math.round(response.data.main.temp),
      status: response.data.weather[0].description,
      weatherMain: response.data.weather[0].main,
      wind: response.data.wind.speed,
      precipitation: response.data.rain?.['1h'] ?? response.data.snow?.['1h'] ?? 0,
    }
  } catch (error) {
    console.error('선택 지역 날씨 API 요청 실패:', error)
    selectedCity.value = null
  }
}

watch(
  () => locationStore.selectedCityId,
  (cityId) => {
    fetchSelectedCityWeather(cityId)
  },
  { immediate: true },
)

const goToWeather = () => {
  router.push({ name: 'weather-home' })
}
</script>

<template>
  <div class="break-view">
    <div class="view-heading">
      <div>
        <h2>☺️ SKALA 휴식 도우미</h2>
        <p>공부 흐름은 지키면서, 지금 날씨에 맞게 잠깐 쉬어가세요.</p>
      </div>
      <el-button type="primary" plain @click="goToWeather">내 지역 설정하러 가기</el-button>
    </div>

    <BreakRecommendation :city="selectedCity" />
  </div>
</template>

<style scoped>
.break-view {
  width: min(900px, 100%);
  margin: 0 auto;
}

.view-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.view-heading h2,
.view-heading p {
  margin: 0;
}

.view-heading h2 {
  margin-bottom: 6px;
}

@media (max-width: 600px) {
  .break-view {
    width: 100%;
  }

  .view-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
