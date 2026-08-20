<script setup>
const emit = defineEmits(['update-query'])

defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})

const updateQuery = (event) => {
  emit('update-query', event.target.value)
}
</script>

<template>
  <div class="search-inner">
    <h3>🔍 도시 검색</h3>
    <input
      type="text"
      :value="currentQuery"
      @input="updateQuery"
      placeholder="검색할 도시 이름 입력"
    />
    <p>
      검색 중인 도시: <strong>{{ currentQuery }}</strong>
    </p>
  </div>
</template>

<style scoped>
.search-inner input {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  color: #2c3e50;
  background: #fff;
  border: 1px solid #ced4da;
  border-radius: 4px;
}
</style>
