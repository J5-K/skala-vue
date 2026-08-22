<script setup>
import { computed, ref, watch } from 'vue'
import { useConfigStore } from '@/stores/configStore'

const props = defineProps({
  city: {
    type: Object,
    default: null,
  },
})

const configStore = useConfigStore()
const selectedDuration = ref('5')
const recommendationIndex = ref(0)

const durationOptions = [
  { value: '5', label: '5분' },
  { value: '10', label: '10분' },
  { value: '20', label: '20분' },
  { value: 'afterClass', label: '수업 후' },
]

const activities = {
  5: [
    {
      name: '물 한 잔 마시기',
      icon: '💧',
      type: 'indoor',
      reason: '커밋은 했는데 물은 안 마셨다면, 지금이 딱 마실 타이밍이에요.',
      preparation: '텀블러만 챙겨서 정수대로 출발!',
    },
    {
      name: '목·어깨 스트레칭',
      icon: '🙆',
      type: 'indoor',
      reason: '화면과 너무 오래 눈싸움했어요. 굳은 어깨를 잠깐 풀어주세요.',
      preparation: '의자를 살짝 뒤로 밀고 주변 사람과 부딪히지만 않으면 준비 끝!',
    },
    {
      name: '아무 생각 없이 멍때리기',
      icon: '☁️',
      type: 'indoor',
      reason: '머릿속 탭도 가끔은 전부 닫아줘야 다시 잘 돌아가요.',
      preparation: '휴대폰은 뒤집어 두고 타이머만 5분 맞춰보세요.',
    },
  ],
  10: [
    {
      name: '가볍게 산책하기',
      icon: '🚶',
      type: 'outdoor',
      reason: '코드에서 잠깐 빠져나와 진짜 바깥 공기로 머리를 새로고침해 보세요.',
      preparation: '물 한 모금 챙기고 10분 안에 돌아올 수 있는 코스로!',
    },
    {
      name: '당 충전하기',
      icon: '🍪',
      type: 'indoor',
      reason: '집중력을 오래 끌어다 썼어요. 작은 간식으로 에너지를 채워볼까요?',
      preparation: '오후 수업이 졸리지 않도록 간단한 간식 하나면 충분해요.',
    },
    {
      name: '음악 두 곡 듣기',
      icon: '🎧',
      type: 'music',
      reason: '두 곡 정도면 흐름은 끊지 않으면서 기분은 확실히 바꿀 수 있어요.',
      preparation: '이어폰을 챙기고, 세 번째 곡의 유혹만 잘 참아보세요.',
    },
  ],
  20: [
    {
      name: '카페 다녀오기',
      icon: '☕',
      type: 'outdoor',
      reason: '자리와 분위기를 잠깐 바꾸면 막혔던 생각도 의외로 쉽게 풀릴 수 있어요.',
      preparation: '이동 시간을 생각해 가까운 곳으로, 동료 한 명을 데려가도 좋아요.',
    },
    {
      name: '짧고 굵게 낮잠 자기',
      icon: '😴',
      type: 'indoor',
      reason: '억지로 버티는 20분보다 제대로 쉬는 15분이 더 생산적일 때도 있어요.',
      preparation: '알람은 꼭 두 개! 너무 편한 자세는 수업 종료까지 잠들 위험이 있어요.',
    },
    {
      name: '가볍게 독서하기',
      icon: '📖',
      type: 'indoor',
      reason: '코드가 아닌 문장을 읽으며 머리를 다른 방향으로 잠깐 움직여 보세요.',
      preparation: '욕심내지 말고 짧은 글이나 한 챕터만 읽는 게 좋아요.',
    },
    {
      name: '느긋하게 음악 듣기',
      icon: '🎵',
      type: 'music',
      reason: '한 곡씩 따라가다 보면 복잡했던 머릿속도 자연스럽게 정리될 거예요.',
      preparation: '알람을 맞춰두면 플레이리스트 속에서 길을 잃지 않을 수 있어요.',
    },
  ],
  afterClass: [
    {
      name: '천천히 긴 산책하기',
      icon: '🌿',
      type: 'outdoor',
      reason: '하루 종일 쌓인 생각을 걸으면서 하나씩 정리하기 좋은 시간이에요.',
      preparation: '날씨를 확인하고 목적지보다 기분 좋은 코스를 골라보세요.',
    },
    {
      name: '가볍게 실내 운동하기',
      icon: '🏃',
      type: 'indoor',
      reason: '오늘 움직인 게 손가락뿐이었다면 이제 나머지 몸도 깨워줄 차례예요.',
      preparation: '기록 욕심보다는 개운하게 마무리할 정도로만 해주세요.',
    },
    {
      name: '오늘 분위기에 맞는 음악 듣기',
      icon: '🎶',
      type: 'music',
      reason: '오늘 해결한 문제들은 잠시 내려놓고 음악과 함께 천천히 퇴근해 보세요.',
      preparation: '이어폰과 여유만 챙기면 오늘의 디버깅은 완전히 종료!',
    },
  ],
}

const isOutdoorWeatherUnsafe = computed(() => {
  if (!props.city) {
    return false
  }

  const unsafeWeather = ['Rain', 'Drizzle', 'Snow', 'Thunderstorm']

  return (
    unsafeWeather.includes(props.city.weatherMain) ||
    props.city.precipitation > 0 ||
    props.city.wind >= 10 ||
    props.city.temp >= 30 ||
    props.city.temp <= 0
  )
})

const availableActivities = computed(() => {
  const candidates = activities[selectedDuration.value]

  if (!isOutdoorWeatherUnsafe.value) {
    return candidates
  }

  return candidates.filter((activity) => activity.type !== 'outdoor')
})

const currentRecommendation = computed(() => {
  if (availableActivities.value.length === 0) {
    return null
  }

  return availableActivities.value[recommendationIndex.value % availableActivities.value.length]
})

const displayTemp = computed(() => {
  if (!props.city) {
    return null
  }

  return configStore.convertTemperature(props.city.temp)
})

const youtubeSearchUrl = computed(() => {
  if (!props.city || currentRecommendation.value?.type !== 'music') {
    return ''
  }

  const keyword = `${props.city.status} 날씨에 듣기 좋은 음악`
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(keyword)}`
})

const showNextRecommendation = () => {
  recommendationIndex.value = (recommendationIndex.value + 1) % availableActivities.value.length
}

watch([selectedDuration, () => props.city?.id, () => props.city?.weatherMain], () => {
  recommendationIndex.value = 0
})
</script>

<template>
  <el-card class="break-recommendation" shadow="never">
    <template #header>
      <div>
        <h3>🎒 SKALA</h3>
        <p v-if="city">
          {{ city.name }}에서 열심히 공부 중이군요. 현재 {{ city.status }}, {{ displayTemp
          }}{{ configStore.unitSymbol }}예요.
        </p>
      </div>
    </template>

    <el-empty
      v-if="!city"
      description="내 지역을 설정하면 지금 날씨에 어울리는 휴식을 추천해 드려요."
    />

    <template v-else>
      <p class="question">얼마나 쉬어갈까요?</p>
      <el-radio-group v-model="selectedDuration" class="duration-selector">
        <el-radio-button
          v-for="option in durationOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </el-radio-button>
      </el-radio-group>

      <el-alert
        v-if="isOutdoorWeatherUnsafe"
        title="오늘은 날씨를 고려해 실내 활동 위주로 골라봤어요."
        type="warning"
        :closable="false"
        show-icon
      />

      <section v-if="currentRecommendation" class="recommendation-content">
        <div class="recommendation-heading">
          <div>
            <span class="eyebrow">오늘의 추천</span>
            <h4>{{ currentRecommendation.icon }} {{ currentRecommendation.name }}</h4>
          </div>
          <el-tag :type="currentRecommendation.type === 'outdoor' ? 'success' : 'primary'">
            {{ currentRecommendation.type === 'outdoor' ? '야외 활동' : '실내 활동' }}
          </el-tag>
        </div>

        <p>{{ currentRecommendation.reason }}</p>
        <el-alert
          :title="`💡 이것만 챙겨주세요 — ${currentRecommendation.preparation}`"
          type="info"
          :closable="false"
        />

        <div class="break-actions">
          <el-button type="primary" @click="showNextRecommendation">다른 추천 보기</el-button>
          <el-button
            v-if="youtubeSearchUrl"
            type="danger"
            tag="a"
            :href="youtubeSearchUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            YouTube에서 음악 찾기
          </el-button>
        </div>
      </section>
    </template>
  </el-card>
</template>

<style scoped>
.break-recommendation {
  margin: 15px 0;
}

.break-recommendation h3,
.break-recommendation p {
  margin: 0;
}

.break-recommendation h3 {
  margin-bottom: 6px;
}

.question {
  margin-bottom: 10px;
  font-weight: 700;
}

.duration-selector {
  margin-bottom: 14px;
}

.recommendation-content {
  padding-top: 18px;
}

.recommendation-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.recommendation-heading h4 {
  margin: 4px 0 0;
  font-size: 20px;
}

.eyebrow {
  color: #606266;
  font-size: 12px;
  font-weight: 700;
}

.recommendation-content > p {
  margin-bottom: 12px;
  line-height: 1.6;
}

.break-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

@media (max-width: 600px) {
  .duration-selector {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  .duration-selector :deep(.el-radio-button__inner) {
    width: 100%;
  }
}
</style>
