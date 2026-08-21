<script setup>
import UnitToggler from './components/exercise/UnitToggler.vue'
</script>

<template>
  <div class="app-container">
    <h1>⛅ 날씨 과제</h1>
    <hr />
    <nav class="navigation-bar">
      <RouterLink to="/" class="nav-item">SKALA 오늘의 날씨</RouterLink>
      <span class="divider">|</span>
      <RouterLink to="/break" class="nav-item">잠깐 쉬어가기</RouterLink>
      <span class="divider">|</span>
      <RouterLink to="/city-search" class="nav-item">다른 도시 검색</RouterLink>
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
