<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const tips = [
  {
    status: '맑음',
    icon: '☀️',
    message: '자외선이 강할 수 있으니 외출 전 자외선 차단제를 확인하세요.',
  },
  {
    status: '비',
    icon: '🌧️',
    message: '우산을 준비하고 미끄러운 길에서는 평소보다 천천히 이동하세요.',
  },
  {
    status: '구름',
    icon: '☁️',
    message: '기온 변화에 대비해 가볍게 걸칠 옷을 준비하세요.',
  },
]

const goHome = () => {
  router.push({ name: 'weather-home' })
}
</script>

<template>
  <section class="tips-container">
    <h3>💡 날씨 생활 정보</h3>
    <p>날씨 상태에 맞는 간단한 생활 수칙을 확인해 보세요.</p>

    <div class="tips-list">
      <article v-for="tip in tips" :key="tip.status" class="tip-card">
        <h4>{{ tip.icon }} {{ tip.status }}</h4>
        <p>{{ tip.message }}</p>
      </article>
    </div>

    <button class="home-btn" @click="goHome">대시보드 홈으로 이동</button>
  </section>
</template>

<style scoped>
.tips-container {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}

.tips-list {
  display: grid;
  gap: 12px;
  margin: 18px 0;
}

.tip-card {
  padding: 14px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
}

.tip-card h4,
.tip-card p {
  margin: 0;
}

.tip-card p {
  margin-top: 6px;
}

.home-btn {
  width: 100%;
  padding: 10px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  background: #3498db;
  border: 0;
  border-radius: 4px;
}
</style>
