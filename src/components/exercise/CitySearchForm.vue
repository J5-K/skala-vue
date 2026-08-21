<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['search-city'])
const localQuery = ref(props.currentQuery)

watch(
  () => props.currentQuery,
  (newQuery) => {
    localQuery.value = newQuery
  },
)

const submitSearch = () => {
  const query = localQuery.value.trim()

  if (query) {
    emit('search-city', query)
  }
}
</script>

<template>
  <form class="city-search-form" @submit.prevent="submitSearch">
    <label for="city-query">검색할 도시</label>
    <div class="input-row">
      <input
        id="city-query"
        v-model.trim="localQuery"
        type="search"
        placeholder="예: 제주, Tokyo, Paris"
      />
      <button type="submit" :disabled="isLoading || !localQuery.trim()">
        {{ isLoading ? '검색 중...' : '검색' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.city-search-form {
  padding: 18px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
}

.city-search-form label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.input-row {
  display: flex;
  gap: 8px;
}

.input-row input {
  flex: 1;
  width: auto;
}

.input-row button {
  padding: 8px 18px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  background: #3498db;
  border: 0;
  border-radius: 4px;
}

.input-row button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
