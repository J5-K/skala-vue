<script setup>
import { ref } from 'vue'

const message = ref('버튼을 눌러보세요')
const clickCount = ref(0)

const handleOnceClick = () => {
  clickCount.value++
  message.value = '이 이벤트는 한 번만 실행됩니다.'
}
</script>

<template>
  <div class="practice-section">
    <h2>이벤트 수식어 .once</h2>

    <button @click.once="handleOnceClick">한 번만 클릭 가능</button>

    <p>결과: {{ message }}</p>
    <p>실행 횟수: {{ clickCount }}</p>
  </div>
</template>
