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
    required: true,
  },
})

const emit = defineEmits([
  'select-card',
  'click-detail',
  'change-temperature',
  'update-temperature',
])

const changeTemperature = (amount) => {
  emit('change-temperature', {
    cityId: props.cityItem.id,
    amount,
  })
}

const updateTemperature = (event) => {
  emit('update-temperature', {
    cityId: props.cityItem.id,
    temperature: Number(event.target.value),
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
  <div class="weather-card" @click="emit('select-card', cityItem)">
    <h4>{{ cityItem.name }} ({{ cityItem.status }})</h4>
    <p>현재 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>
    <div v-if="displayFeelsLike !== null" class="weather-details">
      <span>체감 {{ displayFeelsLike }}{{ configStore.unitSymbol }}</span>
      <span>습도 {{ cityItem.humidity }}%</span>
      <span>풍속 {{ cityItem.wind }}m/s</span>
    </div>

    <div class="temp-controller" @click.stop>
      <button @click="changeTemperature(-1)">-</button>
      <input
        type="number"
        :value="cityItem.temp"
        aria-label="현재 기온"
        @input="updateTemperature"
      />
      <button @click="changeTemperature(1)">+</button>
    </div>

    <span v-if="cityItem.temp >= hotThreshold" class="badge hot">
      🥵 더워요 ({{ hotThreshold }}도 이상)
    </span>
    <span v-else class="badge cool">🆒 선선함 ({{ hotThreshold }}도 미만)</span>

    <button class="btn-detail" @click.stop="emit('click-detail', cityItem)">상세보기</button>
  </div>
</template>

<style scoped>
.weather-card {
  position: relative;
  padding: 12px;
  margin-bottom: 10px;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 6px;
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

.temp-controller button {
  padding: 6px 12px;
  cursor: pointer;
}

.temp-controller input {
  width: 60px;
  text-align: center;
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  color: #fff;
  font-size: 12px;
  border-radius: 4px;
}

.hot {
  background-color: #ff7675;
}

.cool {
  background-color: #74b9ff;
}

.btn-detail {
  position: absolute;
  top: 15px;
  right: 12px;
  padding: 6px 10px;
  cursor: pointer;
}
</style>
