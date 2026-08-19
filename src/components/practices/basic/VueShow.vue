<script setup>
import { ref } from 'vue'
const inVisible = ref(false)
</script>

<template>
  <div class="practice-section">
    <h2>v-show 디렉티브 학습</h2>
    <button @click="inVisible = !inVisible">화면 토글하기</button>
    <br />
    <div v-show="inVisible" class="box">
      <p>v-show 상자</p>
      <p>조건이 false가 되면 CSS display 속성이 none으로 변경됩니다.</p>
    </div>
  </div>
</template>

<style scoped>
.box {
  padding: 10px;
  margin-top: 5px;
  color: white;
  border-radius: 5px;
  background-color: #3498db;
}
</style>
