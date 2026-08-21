<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'

const props = defineProps({
  city: {
    type: Object,
    default: null,
  },
})

const configStore = useConfigStore()

const recommendation = computed(() => {
  if (!props.city) {
    return null
  }

  const { weatherMain, temp, wind, precipitation } = props.city

  if (weatherMain === 'Thunderstorm') {
    return {
      icon: '⛈️',
      transport: '대중교통',
      reason: '천둥·번개가 예상되어 야외 이동과 자전거 이용을 피하는 것이 좋습니다.',
      preparation: '우산보다 우비를 준비하고 운행 지연 여부를 확인하세요.',
    }
  }

  if (weatherMain === 'Snow') {
    return {
      icon: '🌨️',
      transport: '대중교통',
      reason: '눈길에서는 미끄러짐과 차량 제동거리 증가 위험이 있습니다.',
      preparation: '미끄럼 방지 신발을 신고 평소보다 일찍 출발하세요.',
    }
  }

  if (weatherMain === 'Rain' || weatherMain === 'Drizzle' || precipitation > 0) {
    return {
      icon: '🌧️',
      transport: '대중교통',
      reason: '비로 인해 도보와 자전거 이동이 불편하고 도로가 미끄러울 수 있습니다.',
      preparation: '우산을 준비하고 혼잡과 지연을 고려해 여유 있게 출발하세요.',
    }
  }

  if (wind >= 10) {
    return {
      icon: '💨',
      transport: '대중교통',
      reason: `현재 풍속이 ${wind}m/s로 강해 자전거와 장시간 도보 이동이 불편할 수 있습니다.`,
      preparation: '바람에 날릴 수 있는 소지품을 단단히 챙기세요.',
    }
  }

  if (temp >= 30) {
    return {
      icon: '🥵',
      transport: '대중교통 또는 자차',
      reason: '기온이 높아 장시간 야외 이동 시 온열 질환 위험이 있습니다.',
      preparation: '물을 챙기고 냉방 가능한 이동 수단을 이용하세요.',
    }
  }

  if (temp <= 0) {
    return {
      icon: '🥶',
      transport: '대중교통 또는 자차',
      reason: '영하의 날씨로 노면 결빙과 장시간 야외 노출에 주의해야 합니다.',
      preparation: '방한용품을 챙기고 자차 이용 시 결빙 구간을 조심하세요.',
    }
  }

  if (weatherMain === 'Clear' && temp >= 10 && temp <= 27 && wind < 6) {
    return {
      icon: '🚲',
      transport: '도보 또는 자전거',
      reason: '기온이 쾌적하고 바람이 강하지 않아 야외 이동하기 좋은 날씨입니다.',
      preparation: '자외선 차단제와 물을 준비하면 좋습니다.',
    }
  }

  return {
    icon: '🚌',
    transport: '대중교통',
    reason: '현재 날씨에서 안정적이고 편하게 이동하기 좋은 방법입니다.',
    preparation: '출발 전 실시간 교통 상황을 확인하세요.',
  }
})

const displayTemp = computed(() => {
  if (!props.city) {
    return null
  }

  return configStore.convertTemperature(props.city.temp)
})
</script>

<template>
  <el-card class="commute-guide" shadow="never">
    <template v-if="city && recommendation">
      <div class="guide-heading">
        <div>
          <h3>🚦 {{ city.name }} 이동 가이드</h3>
          <p>
            현재 {{ displayTemp }}{{ configStore.unitSymbol }}, {{ city.status }}, 풍속
            {{ city.wind }}m/s
          </p>
        </div>
        <el-tag type="primary" size="large" effect="dark">
          {{ recommendation.icon }} {{ recommendation.transport }}
        </el-tag>
      </div>
      <p><strong>추천 이유:</strong> {{ recommendation.reason }}</p>
      <p><strong>준비 사항:</strong> {{ recommendation.preparation }}</p>
      <small>날씨만을 기준으로 한 참고용 안내이며 실제 교통 상황은 반영하지 않습니다.</small>
    </template>

    <el-alert
      v-else
      title="판교·울산·광주 중 내 지역을 설정하면 이동 가이드를 보여드립니다."
      type="info"
      :closable="false"
      show-icon
    />
  </el-card>
</template>

<style scoped>
.commute-guide {
  margin: 15px 0;
}

.guide-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.guide-heading h3,
.guide-heading p {
  margin: 0 0 6px;
}

.commute-guide small {
  color: #636e72;
}
</style>
