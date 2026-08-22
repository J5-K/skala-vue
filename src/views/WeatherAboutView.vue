<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const features = [
  {
    icon: '🌤️',
    title: '실시간 날씨',
    description: 'SKALA 캠퍼스의 현재 날씨와 5일 예보를 확인합니다.',
    route: 'weather-home',
    button: '날씨 확인하기',
  },
  {
    icon: '🚶',
    title: '이동과 생활 가이드',
    description: '내 지역 날씨에 맞는 이동 방법과 준비사항을 안내합니다.',
    route: 'weather-tips',
    button: '생활정보 보기',
  },
  {
    icon: '☺️',
    title: '잠깐 쉬어가기',
    description: '공부 중 쉬는 시간과 현재 날씨에 맞는 활동을 추천합니다.',
    route: 'break-recommendation',
    button: '휴식 추천받기',
  },
  {
    icon: '✈️',
    title: '여행지 날씨',
    description: '국내외 여행지를 검색하고 현재 날씨와 여행 팁을 확인합니다.',
    route: 'weather-search',
    button: '여행지 찾기',
  },
]

const technologies = [
  { label: 'Vue Composition API', content: '반응형 상태와 추천 조건 계산' },
  { label: 'Vue Router', content: '홈·상세·휴식·여행지 화면 분리' },
  { label: 'Pinia', content: '온도 단위와 선택 지역 상태 공유' },
  { label: 'Axios', content: 'OpenWeather 실시간 데이터 요청' },
  { label: 'Element Plus', content: '카드·상태 안내·접기 UI 구성' },
  { label: 'Vercel', content: '환경변수를 적용한 정적 웹 배포' },
]

const troubleshooting = [
  {
    title: '자식 컴포넌트에서 props를 직접 변경하려던 문제',
    problem: '자식에서 전달받은 값을 직접 수정해 단방향 데이터 흐름이 깨졌습니다.',
    solution: 'emit으로 변경을 요청하고 부모가 실제 상태를 수정하도록 역할을 나눴습니다.',
    learned: 'props는 읽기 전용이며 상태 변경의 책임은 소유한 컴포넌트에 있다는 점을 배웠습니다.',
  },
  {
    title: 'computed 값을 직접 수정한 문제',
    problem: '계산된 값을 일반 ref처럼 바꾸려고 해 원하는 결과가 유지되지 않았습니다.',
    solution: '원본 반응형 상태를 변경하고 computed는 그 상태를 계산하는 역할만 맡겼습니다.',
    learned: '원본 상태와 파생 상태를 구분해야 반응형 흐름을 예측하기 쉽다는 점을 알게 됐습니다.',
  },
  {
    title: '실습을 확인할 때마다 App.vue를 바꾸던 문제',
    problem: '연습 컴포넌트를 볼 때마다 과제 화면의 import와 template을 직접 교체했습니다.',
    solution: '연습 코드를 `/practice` Route로 분리해 과제 화면과 독립적으로 실행했습니다.',
    learned: 'Router는 페이지 이동뿐 아니라 서로 다른 목적의 코드를 분리하는 데도 유용했습니다.',
  },
  {
    title: 'Vercel 배포 후 날씨 API 401 오류',
    problem: '로컬에서는 동작했지만 배포 화면에서 API 요청이 인증 오류로 실패했습니다.',
    solution: 'Vercel Production 환경변수에 API 키를 등록하고 다시 배포했습니다.',
    learned: '로컬 환경변수와 배포 환경변수는 별도로 설정해야 한다는 점을 확인했습니다.',
  },
  {
    title: '화면이 왼쪽으로 치우치고 카드 너비가 맞지 않은 문제',
    problem: '부모와 자식 영역에 서로 다른 고정 너비가 적용되어 정렬이 어긋났습니다.',
    solution: '`width: 100%`, `max-width`, `margin: 0 auto`로 너비 기준을 통일했습니다.',
    learned: 'Grid뿐 아니라 Grid를 감싸는 부모 요소의 크기와 정렬도 함께 확인해야 했습니다.',
  },
]

const moveTo = (routeName) => {
  router.push({ name: routeName })
}
</script>

<template>
  <div class="about-view">
    <section class="about-hero">
      <el-tag type="primary" effect="dark" round>SKALA 교육생을 위한 날씨 서비스</el-tag>
      <h2>⛅ RESTful SKALA</h2>
      <p>
        캠퍼스 별 실시간 날씨를 확인하고 추천 이동 방법부터 휴식 활동까지 제안하는 SKALA 쉼터 도우미입니다.
      </p>
      <p class="name-story">
        REST API의 <strong>REST</strong>와 잠깐 쉬어가는 <strong>rest</strong>의 의미를 함께
        담았습니다.
      </p>
      <div class="tech-tags">
        <el-tag v-for="tech in technologies" :key="tech.label" effect="plain">
          {{ tech.label }}
        </el-tag>
      </div>
    </section>

    <section class="about-section">
      <div class="section-heading">
        <span class="section-icon">🧭</span>
        <div>
          <h3>구현한 기능들</h3>
          <p>날씨를 확인한 다음 필요한 행동까지 이어질 수 있도록 구성했습니다.</p>
        </div>
      </div>
      <el-row :gutter="16">
        <el-col v-for="feature in features" :key="feature.title" :xs="24" :sm="12">
          <el-card class="feature-card" shadow="hover">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h4>{{ feature.title }}</h4>
            <p>{{ feature.description }}</p>
            <el-button type="primary" text @click="moveTo(feature.route)">
              {{ feature.button }} →
            </el-button>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <section class="about-section">
      <div class="section-heading">
        <span class="section-icon">🌱</span>
        <div>
          <h3>3일 동안 진행 사항</h3>
          <p>배운 내용을 하루씩 적용하며 하나의 서비스로 확장했습니다.</p>
        </div>
      </div>
      <el-steps :active="3" finish-status="success" align-center>
        <el-step title="Day 1" description="기본 문법으로 검색과 온도 반응 구현" />
        <el-step title="Day 2" description="computed·watch와 컴포넌트 분리" />
        <el-step title="Day 3" description="Router·Pinia·Axios·배포로 확장" />
      </el-steps>
    </section>

    <section class="about-section">
      <div class="section-heading">
        <span class="section-icon">🛠️</span>
        <div>
          <h3>기술 사용 내역</h3>
          <p>기술 이름만 나열하지 않고 실제로 적용한 부분을 함께 정리했습니다.</p>
        </div>
      </div>
      <el-descriptions :column="2" border>
        <el-descriptions-item
          v-for="tech in technologies"
          :key="tech.label"
          :label="tech.label"
        >
          {{ tech.content }}
        </el-descriptions-item>
      </el-descriptions>
    </section>

    <section class="about-section">
      <div class="section-heading">
        <span class="section-icon">🔎</span>
        <div>
          <h3>문제를 해결하며 배운 점</h3>
          <p>진행 중 막혔던 부분과 직접 찾아본 해결 방법을 모았습니다.</p>
        </div>
      </div>
      <el-collapse accordion>
        <el-collapse-item
          v-for="(item, index) in troubleshooting"
          :key="item.title"
          :name="index"
        >
          <template #title>
            <strong>{{ index + 1 }}. {{ item.title }}</strong>
          </template>
          <dl class="trouble-content">
            <div>
              <dt>문제</dt>
              <dd>{{ item.problem }}</dd>
            </div>
            <div>
              <dt>해결</dt>
              <dd>{{ item.solution }}</dd>
            </div>
          </dl>
          <el-alert :title="item.learned" type="success" :closable="false" show-icon />
        </el-collapse-item>
      </el-collapse>
    </section>

    <div class="about-actions">
      <el-button type="primary" @click="moveTo('weather-home')">오늘의 날씨 보기</el-button>
      <el-button
        tag="a"
        href="https://github.com/J5-K/skala-vue"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub README 보기
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.about-view {
  width: min(1080px, 100%);
  margin: 0 auto;
}

.about-hero {
  padding: clamp(24px, 5vw, 48px);
  text-align: center;
  background: linear-gradient(120deg, #a6cff8, #eef2f7);
  border: 1px solid #dbeafe;
  border-radius: 10px;
}

.about-hero h2 {
  margin: 16px 0 10px;
  font-size: clamp(1.8rem, 4vw, 2.7rem);
}

.about-hero p {
  max-width: 720px;
  margin: 0 auto;
  color: #475569;
  line-height: 1.7;
}

.about-hero .name-story {
  margin-top: 10px;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

.about-section {
  margin-top: 36px;
}

.section-heading {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  margin-bottom: 16px;
  background: #f8fafc;
  border-left: 4px solid #409eff;
  border-radius: 0 10px 10px 0;
}

.section-icon {
  font-size: 22px;
  line-height: 1.2;
}

.section-heading h3 {
  margin: 0;
  font-size: 1.35rem;
}

.section-heading p {
  margin: 5px 0 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
}

.feature-card {
  min-height: 200px;
  margin-bottom: 16px;
}

.feature-icon {
  font-size: 30px;
}

.feature-card h4 {
  margin: 10px 0 6px;
  font-size: 1.1rem;
}

.feature-card p {
  min-height: 48px;
  margin: 0 0 10px;
  color: #64748b;
  line-height: 1.5;
}

.trouble-content {
  margin: 0 0 14px;
}

.trouble-content div {
  display: grid;
  grid-template-columns: 54px 1fr;
  gap: 10px;
  margin-bottom: 10px;
}

.trouble-content dt {
  color: #409eff;
  font-weight: bold;
}

.trouble-content dd {
  margin: 0;
  line-height: 1.6;
}

.about-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 36px;
}

@media (max-width: 600px) {
  .about-section :deep(.el-step__description) {
    display: none;
  }

  .about-section :deep(.el-descriptions__body) {
    overflow-x: auto;
  }

  .about-actions {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
