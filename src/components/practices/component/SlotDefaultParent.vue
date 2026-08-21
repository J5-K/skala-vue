<script setup>
import SlotDefaultChild from './SlotDefaultChild.vue'
</script>

<template>
  <div class="practice-section">
    <h2>Default Slot 레이아웃 주입 실습</h2>
    <SlotDefaultChild>
      <p>그냥 Parent Slot 한 줄 적는 겁니다</p>
    </SlotDefaultChild>
    <SlotDefaultChild>
      <h2 style="color: #e74c3c">🔥 경고 상태</h2>
      <button>확인</button>
    </SlotDefaultChild>
  </div>
</template>
