<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  recommendations: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select-city', 'refresh'])
const failedImages = ref(new Set())

watch(
  () => props.recommendations,
  () => {
    failedImages.value = new Set()
  },
)

const markImageAsFailed = (cityId) => {
  failedImages.value.add(cityId)
}
</script>

<template>
  <section class="recommendation-section">
    <div class="recommendation-heading">
      <div>
        <h3>🎲 오늘의 추천 여행지</h3>
        <p>어디로 갈지 고민된다면 추천 도시의 날씨부터 확인해 보세요.</p>
      </div>
      <el-button plain :loading="isLoading" @click="emit('refresh')">다시 추천받기</el-button>
    </div>

    <el-skeleton v-if="isLoading" :rows="3" animated />

    <div v-else class="recommendation-grid">
      <el-card
        v-for="city in recommendations"
        :key="city.id"
        class="recommendation-card"
        shadow="hover"
      >
        <img
          v-if="city.imageUrl && !failedImages.has(city.id)"
          class="city-image"
          :src="city.imageUrl"
          :alt="`${city.name} 여행지 사진`"
          @error="markImageAsFailed(city.id)"
        />
        <div v-else class="city-placeholder" role="img" :aria-label="`${city.name} 기본 이미지`">
          <span>📍</span>
          <p>{{ city.name }}의 풍경을 상상해 보세요</p>
        </div>

        <div class="city-content">
          <h4>{{ city.name }}</h4>
          <a
            v-if="city.photographer"
            class="photo-credit"
            :href="city.photoUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Photo by {{ city.photographer }} on Pexels
          </a>
          <span v-else class="photo-credit">기본 여행지 이미지</span>
          <el-button type="primary" text @click="emit('select-city', city.searchQuery)">
            현재 날씨 보기 →
          </el-button>
        </div>
      </el-card>
    </div>

    <a
      class="pexels-link"
      href="https://www.pexels.com"
      target="_blank"
      rel="noopener noreferrer"
    >
      Photos provided by Pexels
    </a>
  </section>
</template>

<style scoped>
.recommendation-section {
  padding-top: 24px;
  margin-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.recommendation-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.recommendation-heading h3,
.recommendation-heading p {
  margin: 0;
}

.recommendation-heading h3 {
  margin-bottom: 5px;
}

.recommendation-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.recommendation-card :deep(.el-card__body) {
  padding: 0;
}

.recommendation-card {
  overflow: hidden;
  border: 0;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(51, 65, 85, 0.12);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.recommendation-card:hover {
  box-shadow: 0 14px 32px rgba(51, 65, 85, 0.18);
  transform: translateY(-3px);
}

.city-image,
.city-placeholder {
  width: 100%;
  height: 180px;
}

.city-image {
  display: block;
  object-fit: cover;
}

.city-placeholder {
  display: grid;
  place-content: center;
  padding: 16px;
  color: #64748b;
  text-align: center;
  background: linear-gradient(135deg, #dbeafe, #f0fdf4);
}

.city-placeholder span {
  font-size: 38px;
}

.city-placeholder p {
  margin: 7px 0 0;
}

.city-content {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 8px;
  padding: 14px;
}

.city-content h4 {
  margin: 0;
  font-size: 19px;
}

.photo-credit,
.pexels-link {
  color: #64748b;
  font-size: 11px;
}

.pexels-link {
  display: inline-block;
  margin-top: 12px;
}

@media (max-width: 760px) {
  .recommendation-grid {
    grid-template-columns: 1fr;
  }

  .recommendation-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
