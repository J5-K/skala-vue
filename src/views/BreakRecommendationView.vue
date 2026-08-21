<script setup>
import { useRouter } from 'vue-router'
import { useLocationStore } from '@/stores/locationStore'
import BreakRecommendation from '@/components/exercise/BreakRecommendation.vue'

const router = useRouter()
const locationStore = useLocationStore()

const goToWeather = () => {
  router.push({ name: 'weather-home' })
}
</script>

<template>
  <div class="break-view">
    <div class="view-heading">
      <div>
        <h2>🎒 SKALA 휴식 도우미</h2>
        <p>공부 흐름은 지키면서, 지금 날씨에 맞게 잠깐 쉬어가세요.</p>
      </div>
      <el-button type="primary" plain @click="goToWeather">내 지역 설정하러 가기</el-button>
    </div>

    <BreakRecommendation :city="locationStore.selectedCity" />
  </div>
</template>

<style scoped>
.break-view {
  width: 600px;
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
