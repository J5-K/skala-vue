<script setup>
import UnitToggler from './components/exercise/UnitToggler.vue'
</script>

<template>
  <div class="app-container">
    <header class="service-header">
      <h1>⛅ RESTful SKALA</h1>
      <p>API로 날씨를 받고, 일상에서 쉼을 더하다</p>
    </header>
    <nav class="navigation-bar">
      <RouterLink to="/" class="nav-item">SKALA 오늘의 날씨</RouterLink>
      <span class="divider">|</span>
      <RouterLink to="/break" class="nav-item">잠깐 쉬어가기</RouterLink>
      <span class="divider">|</span>
      <RouterLink to="/city-search" class="nav-item">여행지 날씨</RouterLink>
      <span class="divider">|</span>
      <RouterLink to="/about" class="nav-item">서비스소개</RouterLink>
      <span class="divider">|</span>
      <RouterLink to="/tips" class="nav-item">날씨 생활 정보</RouterLink>
      <UnitToggler />
    </nav>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style>
@import '@/assets/exercise.css';
</style>
