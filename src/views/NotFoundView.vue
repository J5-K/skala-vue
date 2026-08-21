<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push({ name: 'weather-home' })
}
</script>

<template>
  <section class="not-found-container">
    <div class="error-icon">☀️❓</div>
    <h2>페이지를 찾을 수 없습니다.</h2>
    <p>요청한 주소가 존재하지 않거나 아직 준비되지 않은 페이지입니다.</p>
    <button class="home-btn" @click="goHome">날씨 메인으로 이동</button>
  </section>
</template>

<style scoped>
.not-found-container {
  padding: 50px 24px;
  text-align: center;
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.error-icon {
  margin-bottom: 16px;
  font-size: 4rem;
}

.not-found-container h2 {
  color: #343a40;
}

.not-found-container p {
  color: #6c757d;
}

.home-btn {
  padding: 10px 24px;
  color: #fff;
  cursor: pointer;
  background: #3498db;
  border: 0;
  border-radius: 20px;
}
</style>
