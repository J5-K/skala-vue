<script setup>
import { ref } from 'vue'

const key = ref('')
const code = ref('')
const isShiftPressed = ref(false)
const result = ref('')

const handleKeydown = (e) => {
  key.value = e.key
  code.value = e.code
  isShiftPressed.value = e.shiftKey
    result.value = `${e.key} 키를 눌렀습니다.`
}
</script>

<template>
  <div class="practice-section">
    <h2>키보드(Shift) 이벤트 객체</h2>

    <input type="text" placeholder="키보드를 눌러보세요" @keydown="handleKeydown" />

    <p>입력된 문자: {{ key }}</p>
    <p>키보드 위치 코드: {{ code }}</p>
    <p>Shift 키 상태: {{ isShiftPressed }}</p>
    <p>결과: {{ result }}</p>
  </div>
</template>
