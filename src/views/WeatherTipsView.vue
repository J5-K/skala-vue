<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSelectedCityWeather } from '@/composables/useSelectedCityWeather'
import { useConfigStore } from '@/stores/configStore'
import CommuteGuide from '@/components/exercise/CommuteGuide.vue'

const router = useRouter()
const configStore = useConfigStore()
const {
  selectedCity: currentWeather,
  isLoading,
  errorMessage,
} = useSelectedCityWeather()
const activeTip = ref('')

const tips = [
  {
    name: 'hot',
    title: '더운 날',
    icon: '🥵',
    preparation: '물, 자외선 차단제, 모자',
    message: '한낮의 장시간 야외 활동은 피하고 물을 자주 마셔주세요.',
  },
  {
    name: 'cold',
    title: '추운 날',
    icon: '🥶',
    preparation: '따뜻한 겉옷, 장갑, 따뜻한 음료',
    message: '체온이 떨어지지 않도록 옷을 겹쳐 입고 야외에 오래 머무르지 마세요.',
  },
  {
    name: 'rain',
    title: '비 또는 천둥이 있는 날',
    icon: '🌧️',
    preparation: '우산, 미끄럽지 않은 신발',
    message: '평소보다 이동 시간을 여유롭게 잡고 미끄러운 길을 조심하세요.',
  },
  {
    name: 'snow',
    title: '눈 오는 날',
    icon: '🌨️',
    preparation: '방한용품, 미끄럼 방지 신발',
    message: '빙판길에서는 보폭을 줄이고 가능하면 대중교통을 이용하세요.',
  },
  {
    name: 'wind',
    title: '바람이 강한 날',
    icon: '💨',
    preparation: '바람막이, 단단히 닫히는 가방',
    message: '간판이나 낙하물에 주의하고 우산보다 우비를 사용하는 것이 안전해요.',
  },
  {
    name: 'clear',
    title: '맑은 날',
    icon: '☀️',
    preparation: '자외선 차단제, 물',
    message: '햇빛이 강할 수 있으니 외출 전에 자외선 차단제를 확인하세요.',
  },
  {
    name: 'cloud',
    title: '흐리거나 구름 많은 날',
    icon: '☁️',
    preparation: '얇은 겉옷',
    message: '기온 변화와 일교차에 대비해 가볍게 걸칠 옷을 준비하세요.',
  },
]

const currentTip = computed(() => {
  if (!currentWeather.value) return null

  const { temp, weatherMain, wind } = currentWeather.value

  if (temp >= 30) return tips.find((tip) => tip.name === 'hot')
  if (temp <= 0) return tips.find((tip) => tip.name === 'cold')
  if (['Rain', 'Drizzle', 'Thunderstorm'].includes(weatherMain)) {
    return tips.find((tip) => tip.name === 'rain')
  }
  if (weatherMain === 'Snow') return tips.find((tip) => tip.name === 'snow')
  if (wind >= 10) return tips.find((tip) => tip.name === 'wind')
  if (weatherMain === 'Clear') return tips.find((tip) => tip.name === 'clear')

  return tips.find((tip) => tip.name === 'cloud')
})

const displayTemp = computed(() => {
  if (!currentWeather.value) return null

  return configStore.convertTemperature(currentWeather.value.temp)
})

const goHome = () => {
  router.push({ name: 'weather-home' })
}

watch(currentTip, (tip) => {
  activeTip.value = tip?.name ?? ''
})
</script>

<template>
  <section class="tips-container">
    <header class="tips-heading">
      <div>
        <h2>💡 날씨 생활정보</h2>
        <p>내 지역의 현재 날씨와 상황별 준비사항을 확인해 보세요.</p>
      </div>
      <el-button type="primary" plain @click="goHome">내 지역 설정하러 가기</el-button>
    </header>

    <el-skeleton v-if="isLoading" :rows="3" animated />

    <el-alert
      v-else-if="errorMessage"
      :title="errorMessage"
      type="error"
      :closable="false"
      show-icon
    />

    <el-empty
      v-else-if="!currentWeather"
      description="내 지역을 설정하면 현재 날씨에 맞는 생활정보를 보여드려요."
    />

    <el-card v-else-if="currentTip" class="current-tip" shadow="never">
      <span class="eyebrow">지금 필요한 생활정보</span>
      <h3>{{ currentTip.icon }} {{ currentWeather.name }}는(은) 현재 {{ currentWeather.status }}</h3>
      <p>
        현재 기온 {{ displayTemp }}{{ configStore.unitSymbol }} · 풍속
        {{ currentWeather.wind }}m/s
      </p>
      <el-alert
        :title="currentTip.message"
        :description="`준비사항: ${currentTip.preparation}`"
        type="success"
        :closable="false"
        show-icon
      />
    </el-card>

    <CommuteGuide v-if="currentWeather" :city="currentWeather" />

    <div class="all-tips">
      <h3>상황별 생활정보 모아보기</h3>
      <el-collapse v-model="activeTip" accordion>
        <el-collapse-item v-for="tip in tips" :key="tip.name" :name="tip.name">
          <template #title>
            <strong>{{ tip.icon }} {{ tip.title }}</strong>
          </template>
          <p>{{ tip.message }}</p>
          <el-tag type="info">준비사항: {{ tip.preparation }}</el-tag>
        </el-collapse-item>
      </el-collapse>
    </div>
  </section>
</template>

<style scoped>
.tips-container {
  width: min(900px, 100%);
  padding: 20px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
}

.tips-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.tips-heading h2,
.tips-heading p {
  margin: 0;
}

.tips-heading h2 {
  margin-bottom: 6px;
}

.current-tip {
  margin-bottom: 24px;
}

.current-tip h3 {
  margin: 8px 0;
}

.eyebrow {
  color: #409eff;
  font-size: 13px;
  font-weight: bold;
}

.all-tips h3 {
  margin-bottom: 12px;
}

.all-tips p {
  margin-top: 0;
}

@media (max-width: 600px) {
  .tips-container {
    width: 100%;
    padding: 16px;
  }

  .tips-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
