<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import UnitToggler from './components/exercise/UnitToggler.vue'

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<template>
  <div class="app-container">
    <header class="service-header">
      <h1>⛅ RESTful SKALA</h1>
      <p>API로 날씨를 받고, 일상에서 쉼을 더하다</p>
    </header>
    <nav class="navigation-bar" aria-label="주요 메뉴">
      <el-menu
        class="main-menu"
        mode="horizontal"
        router
        :default-active="activeMenu"
        :ellipsis="false"
      >
        <el-menu-item index="/">오늘의 날씨</el-menu-item>
        <el-menu-item index="/tips">생활정보</el-menu-item>
        <el-menu-item index="/break">쉬어가기</el-menu-item>
        <el-menu-item index="/city-search">여행지 날씨</el-menu-item>
        <el-menu-item index="/about">서비스 소개</el-menu-item>
      </el-menu>
      <div class="unit-setting">
        <UnitToggler />
      </div>
    </nav>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style>
@import '@/assets/exercise.css';
</style>
