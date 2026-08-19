<script setup>
const id = 'user-profile-card'
const src = 'https://vuejs.org/images/logo.png'
</script>

<template>
  <div class="practice-section">
    <h2>v-bind 디렉티브 고급 (단축 문법)</h2>
    <div :id>
      <img :src alt="Vue 로고" style="width: 100px" />
      <!-- //위의 :id와 :src는 v-bind:id="id"와 v-bind:src="src"의 축약형입니다. -->
    </div>
  </div>
</template>
