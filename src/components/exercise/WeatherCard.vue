<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()

const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
  hotThreshold: {
    type: Number,
    default: null,
  },
  coldThreshold: {
    type: Number,
    default: null,
  },
  isMyLocation: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'select-card',
  'click-detail',
  'change-temperature',
  'update-temperature',
  'set-my-location',
])

const changeTemperature = (amount) => {
  emit('change-temperature', {
    cityId: props.cityItem.id,
    amount,
  })
}

const updateTemperature = (temperature) => {
  emit('update-temperature', {
    cityId: props.cityItem.id,
    temperature,
  })
}

const displayTemp = computed(() => {
  return configStore.convertTemperature(props.cityItem.temp)
})

const displayFeelsLike = computed(() => {
  if (props.cityItem.feelsLike === undefined) {
    return null
  }

  return configStore.convertTemperature(props.cityItem.feelsLike)
})
</script>

<template>
  <el-card class="weather-card" shadow="hover" @click="emit('select-card', cityItem)">
    <h4>{{ cityItem.name }} ({{ cityItem.status }})</h4>
    <p>현재 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>
    <div v-if="displayFeelsLike !== null" class="weather-details">
      <span>체감 {{ displayFeelsLike }}{{ configStore.unitSymbol }}</span>
      <span>습도 {{ cityItem.humidity }}%</span>
      <span>풍속 {{ cityItem.wind }}m/s</span>
    </div>

    <div class="temp-controller" @click.stop>
      <el-button circle aria-label="기온 1도 감소" @click="changeTemperature(-1)">−</el-button>
      <el-input-number
        :model-value="cityItem.temp"
        :controls="false"
        aria-label="현재 기온"
        @update:model-value="updateTemperature"
      />
      <el-button circle aria-label="기온 1도 증가" @click="changeTemperature(1)">+</el-button>
    </div>

    <el-tag
      v-if="hotThreshold === null || coldThreshold === null"
      type="info"
      effect="dark"
    >
      🌡️ 기준을 입력해 주세요
    </el-tag>
    <el-tag v-else-if="coldThreshold >= hotThreshold" type="warning" effect="dark">
      ⚠️ 온도 기준을 확인해 주세요
    </el-tag>
    <el-tag v-else-if="cityItem.temp >= hotThreshold" type="danger" effect="dark">
      🥵 더워요 ({{ hotThreshold }}도 이상)
    </el-tag>
    <el-tag v-else-if="cityItem.temp <= coldThreshold" type="primary" effect="dark">
      🥶 추워요 ({{ coldThreshold }}도 이하)
    </el-tag>
    <el-tag v-else type="success" effect="dark">🙂 적당해요</el-tag>

    <el-button
      class="location-btn"
      :type="isMyLocation ? 'success' : 'default'"
      size="small"
      @click.stop="emit('set-my-location', cityItem)"
    >
      {{ isMyLocation ? '📍 내 지역' : '내 지역 설정' }}
    </el-button>

    <el-button class="btn-detail" type="primary" @click.stop="emit('click-detail', cityItem)">
      상세보기
    </el-button>
  </el-card>
</template>

<style scoped>
.weather-card {
  position: relative;
  margin-bottom: 10px;
  cursor: pointer;
}

.temp-controller {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}

.weather-details {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 12px;
  margin-bottom: 10px;
  color: #636e72;
  font-size: 13px;
}

.temp-controller :deep(.el-input-number) {
  width: 60px;
}

.btn-detail {
  position: absolute;
  top: 15px;
  right: 12px;
  padding: 6px 10px;
  cursor: pointer;
}

.location-btn {
  margin-left: 8px;
}
</style>
