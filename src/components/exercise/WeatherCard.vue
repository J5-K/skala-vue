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

const emit = defineEmits(['select-card', 'click-detail', 'set-my-location'])

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
    <div class="weather-heading">
      <h4>{{ cityItem.name }}</h4>
      <el-tag type="info" effect="plain">{{ cityItem.status }}</el-tag>
    </div>

    <p class="current-temperature">{{ displayTemp }}{{ configStore.unitSymbol }}</p>

    <div v-if="displayFeelsLike !== null" class="weather-details">
      <span>체감 {{ displayFeelsLike }}{{ configStore.unitSymbol }}</span>
      <span>습도 {{ cityItem.humidity }}%</span>
      <span>풍속 {{ cityItem.wind }}m/s</span>
    </div>

    <div class="weather-actions">
      <div class="weather-tags">
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
          :type="isMyLocation ? 'success' : 'default'"
          size="small"
          @click.stop="emit('set-my-location', cityItem)"
        >
          {{ isMyLocation ? '📍 내 지역' : '내 지역 설정' }}
        </el-button>
      </div>
    </div>

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

.weather-heading {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-right: 100px;
}

.weather-heading h4 {
  margin: 0;
  color: #1e293b;
  font-size: 22px;
  font-weight: 800;
}

.current-temperature {
  margin: 10px 0 8px;
  color: #0f172a;
  font-size: clamp(28px, 4vw, 34px);
  font-weight: 800;
  line-height: 1.2;
}

.weather-details {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 12px;
  margin-bottom: 10px;
  color: #636e72;
  font-size: 14px;
}

.btn-detail {
  position: absolute;
  top: 15px;
  right: 12px;
  padding: 6px 10px;
  cursor: pointer;
}

.weather-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
