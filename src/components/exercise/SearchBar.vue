<script setup>
const emit = defineEmits(['update-query'])

defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})

const updateQuery = (value) => {
  emit('update-query', value)
}
</script>

<template>
  <div class="search-inner">
    <h3>🔍 도시 검색</h3>
    <el-input
      :model-value="currentQuery"
      clearable
      placeholder="검색할 도시 이름 입력"
      @update:model-value="updateQuery"
    />
    <p>
      검색 중인 도시: <strong>{{ currentQuery }}</strong>
    </p>
  </div>
</template>
