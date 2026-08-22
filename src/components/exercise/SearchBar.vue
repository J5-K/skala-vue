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
    <h3>SKALA 캠퍼스 검색</h3>
    <el-input
      :model-value="currentQuery"
      clearable
      placeholder="판교/울산/광주 중 입력"
      @update:model-value="updateQuery"
    />
    <p>
      검색 중인 캠퍼스: <strong>{{ currentQuery }}</strong>
    </p>
  </div>
</template>
