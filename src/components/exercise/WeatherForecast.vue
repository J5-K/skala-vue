<script setup>
import { useConfigStore } from '@/stores/configStore'

defineProps({
  forecastList: {
    type: Array,
    required: true,
  },
})

const configStore = useConfigStore()

const displayTemperature = (temperature) => {
  return configStore.convertTemperature(temperature)
}
</script>

<template>
  <section class="forecast-section">
    <h3>🗓️ 5일 날씨 예보</h3>

    <div class="forecast-list">
      <article v-for="forecast in forecastList" :key="forecast.date" class="forecast-card">
        <strong>{{ forecast.dateLabel }}</strong>
        <img
          :src="`https://openweathermap.org/img/wn/${forecast.icon}@2x.png`"
          :alt="forecast.status"
        />
        <span>{{ forecast.status }}</span>
        <span>
          {{ displayTemperature(forecast.minTemp) }} ~
          {{ displayTemperature(forecast.maxTemp) }}{{ configStore.unitSymbol }}
        </span>
        <small>강수 확률 {{ forecast.pop }}%</small>
      </article>
    </div>
  </section>
</template>

<style scoped>
.forecast-section {
  padding: 15px;
  margin: 15px 0;
  background: #f8fbff;
  border: 1px solid #dceeff;
  border-radius: 8px;
}

.forecast-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 10px;
}

.forecast-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 6px;
  text-align: center;
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 6px;
}

.forecast-card img {
  width: 56px;
  height: 56px;
}

.forecast-card small {
  color: #636e72;
}
</style>
