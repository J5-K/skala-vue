<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
  searchMode: {
    type: String,
    default: 'domestic',
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['search-city', 'update:search-mode'])
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
    <div class="mode-selector">
      <span>국내/해외 선택</span>
      <el-radio-group
        :model-value="searchMode"
        @update:model-value="emit('update:search-mode', $event)"
      >
        <el-radio-button value="domestic">🇰🇷 국내</el-radio-button>
        <el-radio-button value="overseas">🌍 해외</el-radio-button>
      </el-radio-group>
    </div>

    <label for="city-query">어디로 떠나고 싶나요?</label>
    <div class="input-row">
      <input
        id="city-query"
        v-model.trim="localQuery"
        type="search"
        :placeholder="
          searchMode === 'domestic'
            ? '국내 도시 입력 (예: 제주, 부산)'
            : '해외 도시 입력 (예: Tokyo, Paris)'
        "
      />
      <button type="submit" :disabled="isLoading || !localQuery.trim()">
        {{ isLoading ? '찾는 중...' : '여행지 찾기' }}
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

.mode-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.mode-selector span {
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

@media (max-width: 560px) {
  .mode-selector,
  .input-row {
    align-items: stretch;
    flex-direction: column;
  }

  .mode-selector :deep(.el-radio-group) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  .mode-selector :deep(.el-radio-button__inner) {
    width: 100%;
  }
}
</style>
