# SKALA Vue 날씨 과제

날씨 화면을 3일 동안 학습 내용에 맞춰 단계적으로 발전시키는 프로젝트입니다. 아래에는 기본 제공 기능보다 직접 추가하거나 확장한 내용을 중심으로 기록했습니다.

## 실행 방법

```sh
npm install
cp .env.example .env.local
npm run dev
```

실행 전 `.env.local`의 `VITE_OPENWEATHER_API_KEY`에 발급받은 OpenWeather API 키를 입력합니다.

## 진행 현황

| 구분  | 추가 구현 주제                                 | 상태 |
| ----- | ---------------------------------------------- | ---- |
| Day 1 | 도시 검색, 온도 조절, 반응형 배지              | 완료 |
| Day 2 | 실시간 검색, 날씨 요약, watcher, 컴포넌트 분리 | 완료 |
| Day 3 | Vue Router, Pinia, Axios 실시간 날씨           | 진행 중 |

---

## Day 1 — 기본 문법을 활용한 기능 추가

### 1. 도시 검색

- `searchQuery`와 `searchedCity`를 `ref()`로 관리했습니다.
- 검색 버튼 또는 Enter 키로 `searchCity()`를 실행했습니다.
- `for...of`로 일치하는 도시를 찾았습니다.
- `v-show`를 사용해 검색된 도시의 카드만 표시했습니다.
- 빈 검색어 입력 시 전체 카드를 다시 표시하고, 없는 도시는 안내 문구로 처리했습니다.

### 2. 카드별 온도 조절

- 각 카드에 온도 감소·증가 버튼과 숫자 입력창을 추가했습니다.
- `v-model.number`로 입력 온도를 숫자로 관리했습니다.
- 변경된 온도에 따라 `더워요 / 선선함` 배지가 즉시 갱신되도록 했습니다.
- 온도 조절 시 카드 선택 이벤트가 함께 실행되지 않도록 `.stop`을 적용했습니다.

### Day 1 핵심 문법

| 추가 기능        | 적용 내용                |
| ---------------- | ------------------------ |
| 검색 상태 관리   | `ref()`                  |
| 검색어 입력      | `v-model.trim`           |
| 검색 실행        | `@click`, `@keyup.enter` |
| 검색 결과 표시   | `v-show`                 |
| 카드 목록 출력   | `v-for`, `:key`          |
| 온도 입력        | `v-model.number`         |
| 배지 변경        | `v-if`, `v-else`         |
| 이벤트 전파 차단 | `@click.stop`            |

---

## Day 2 — Composition API와 컴포넌트 구조 적용

### 1. `computed` 기반 실시간 검색

- 기존의 `v-show` 검색 버튼 방식 대신 검색어가 바뀌면 결과가 자동 계산되도록 개선했습니다.
- `includes()`를 적용해 도시 이름의 일부만 입력해도 검색할 수 있습니다.
- 계산된 `filteredWeatherList`를 카드 목록에 직접 연결했습니다.
- 검색 결과가 비어 있으면 별도의 안내 문구를 표시합니다.

### 2. 나만의 더위 기준과 날씨 요약

- 사용자가 `hotThreshold` 값을 변경해 더움 기준 온도를 정할 수 있습니다.
- 고정된 25도 대신 사용자 기준으로 카드 배지가 변경됩니다.
- `hotCityCount`로 기준 온도 이상인 도시 수를 계산합니다.
- `averageTemperature`로 전체 도시의 평균 온도를 계산합니다.
- 도시 온도를 변경하면 배지, 더운 도시 수와 평균 온도가 함께 갱신됩니다.

### 3. `watch`와 `watchEffect` 활용

- `watch(hotThreshold)`로 기준 온도의 이전 값과 변경 값을 안내 문구에 표시합니다.
- `watch(selectedCityInfo)`로 카드 선택에 따른 상태 바 변경을 확인합니다.
- `watchEffect()`로 검색어를 자동 감시하고 최초 실행 및 변경 시점을 콘솔에서 확인합니다.

### 4. 역할별 컴포넌트 분리

기존 기능은 유지하면서 화면을 다음 네 컴포넌트로 분리했습니다.

| 컴포넌트                | 역할                                                                |
| ----------------------- | ------------------------------------------------------------------- |
| `WeatherParent.vue`     | 모든 반응형 상태, computed, watcher와 이벤트 처리 유지              |
| `BaseDashboardCard.vue` | 검색·기준 온도·목록 영역의 공통 디자인을 `<slot>`으로 제공          |
| `SearchBar.vue`         | 검색어를 props로 받고 `update-query` 이벤트로 부모에 전달           |
| `WeatherCard.vue`       | 도시와 기준 온도를 props로 받고 카드·상세보기·온도 변경 이벤트 전달 |

데이터는 다음과 같이 단방향으로 흐릅니다.

```text
WeatherParent의 상태
    ↓ props
SearchBar / WeatherCard
    ↓ emits
WeatherParent가 상태 변경
```

### 5. 추가로 확장한 컴포넌트 기능

- `WeatherCard`에서 prop을 직접 수정하지 않고 온도 변경을 emit으로 요청합니다.
- 부모가 도시 ID를 찾아 실제 온도를 변경하도록 구성했습니다.
- `BaseDashboardCard`를 세 영역에 재사용해 중복된 박스 디자인을 제거했습니다.
- 각 자식 컴포넌트의 스타일을 `<style scoped>`로 분리했습니다.

### Day 2 핵심 문법

| 추가 기능              | 적용 내용        |
| ---------------------- | ---------------- |
| 실시간 검색 결과       | `computed()`     |
| 더운 도시 수·평균 온도 | `computed()`     |
| 기준 온도 변경 감지    | `watch()`        |
| 검색어 자동 감지       | `watchEffect()`  |
| 부모에서 자식으로 전달 | `defineProps()`  |
| 자식에서 부모로 전달   | `defineEmits()`  |
| 공통 레이아웃 재사용   | `<slot>`         |
| 컴포넌트별 스타일 분리 | `<style scoped>` |

## Day 3 — Vue Router와 화면 간 상태 연결 (진행 중)

### 1. 날씨 화면을 View로 확장

- 기존 날씨 대시보드 기능을 `WeatherHomeView.vue`로 옮겨 `/` 경로에서 표시했습니다.
- `RouterLink`와 `RouterView`를 적용해 새로고침 없이 화면을 전환하도록 구성했습니다.
- 각 화면은 동적 import를 사용해 필요한 시점에 불러오도록 설정했습니다.

### 2. 검색어를 URL과 동기화

- 검색어가 변경되면 `watch()`와 `router.replace()`로 `search` query에 저장합니다.
- 페이지를 새로고침해도 URL의 검색어를 읽어 검색 상태를 복원합니다.
- 검색 기록을 불필요하게 쌓지 않도록 검색 중에는 `replace()`를 사용했습니다.

### 3. 변경된 날씨를 상세 페이지에 연동

- 상세보기 클릭 시 도시 ID를 `/weather/:cityId`의 동적 params로 전달합니다.
- 홈에서 변경한 현재 기온과 날씨 상태를 query로 함께 전달합니다.
- 상세 화면에서는 params로 도시를 찾고 query를 조합해 변경된 값을 표시합니다.

```text
/weather/city_01?temp=30&status=맑음
```

### 4. 직접 추가한 화면과 예외 처리

- `/tips`에 맑음·비·구름별 생활 수칙을 제공하는 화면을 추가했습니다.
- 존재하지 않는 주소는 Catch-all Route로 `NotFoundView.vue`에 연결했습니다.
- 소개·생활 정보·404 화면에 이름 기반 홈 이동 기능을 적용했습니다.

### 5. Pinia를 활용한 날씨 단위 설정

- 섭씨·화씨 단위 상태를 `configStore`에서 전역으로 관리합니다.
- 내비게이션의 단위변경 버튼으로 홈과 상세 화면의 단위를 함께 전환합니다.
- 섭씨 원본 데이터는 유지하고 `convertTemperature()`로 표시 온도만 변환합니다.
- 카드에서 온도를 변경해도 선택한 단위에 맞춰 표시 온도가 실시간 갱신됩니다.

### 6. Axios를 활용한 실시간 날씨 연동

- OpenWeather API를 호출해 판교·울산·광주의 실제 날씨를 카드에 표시합니다.
- 도시 좌표 배열을 `map()`으로 순회하고 `Promise.all()`로 동시에 요청합니다.
- API 응답을 기존 `WeatherCard`의 데이터 구조에 맞게 변환했습니다.
- `isLoading`과 `errorMessage`로 로딩 및 통신 실패 상태를 처리했습니다.
- API 온도는 섭씨로 저장하고 Pinia 설정에 따라 표시 단위만 변환합니다.
- API 키는 `.env.local`에서 관리하고 Git 커밋에서 제외했습니다.

### 7. 실시간 기상 정보 확장

- 날씨 카드에 API 응답의 체감온도·습도·풍속을 추가했습니다.
- 체감온도도 Pinia의 전역 단위 설정에 따라 섭씨·화씨로 함께 변환됩니다.
- 상세 화면에서는 선택한 도시 좌표로 최신 기상 정보를 다시 요청합니다.
- 일출·일몰 Unix 시간을 API의 timezone과 조합해 도시 현지 시각으로 표시합니다.
- 상세 API 요청 중에는 로딩 상태를, 실패 시에는 안내와 기본 데이터를 표시합니다.
- 홈에서 직접 변경한 온도와 상태는 기존 URL query 값을 우선해 유지합니다.

### 8. OpenWeather 5일 예보 API 연동

- 현재 날씨 API와 5일 예보 API를 `Promise.all()`로 동시에 요청했습니다.
- 3시간 단위 예보를 날짜별로 그룹화해 5일 단위 데이터로 가공했습니다.
- 날짜별 최저·최고 기온과 최대 강수 확률을 계산했습니다.
- 정오와 가장 가까운 시간의 날씨 상태와 아이콘을 대표 예보로 표시했습니다.
- 예보 화면을 `WeatherForecast.vue`로 분리하고 props로 데이터를 전달했습니다.
- Pinia의 단위 설정을 공유해 예보 온도도 섭씨·화씨로 변환됩니다.

### 9. 별도 도시 검색 화면 추가

- 기존 고정 도시 화면을 `SKALA 오늘의 날씨`로 유지했습니다.
- `/city-search` 경로에 국내외 도시를 검색하는 별도 View를 추가했습니다.
- OpenWeather Geocoding API로 도시 이름을 좌표로 변환합니다.
- 동일한 이름의 도시 후보를 최대 5개까지 표시하고 사용자가 지역을 선택하도록 했습니다.
- 선택한 도시 좌표로 Current Weather API를 호출해 실제 날씨를 표시합니다.
- 검색 폼과 결과 화면을 props와 emits 기반 컴포넌트로 분리했습니다.
- 검색어를 URL query에 저장해 새로고침 후에도 검색 상태를 복원합니다.
- 검색 결과에도 Pinia의 섭씨·화씨 설정을 공유했습니다.

### 10. 내 지역 선택과 날씨 기반 이동 가이드

- 판교·울산·광주 중 하나를 내 지역으로 설정하는 버튼을 날씨 카드에 추가했습니다.
- 선택한 도시 ID는 `locationStore`의 Pinia state에서 전역으로 관리합니다.
- `WeatherCard`는 선택 여부를 props로 받고, `set-my-location` 이벤트로 부모에게 변경을 요청합니다.
- 부모 View에서는 Store 상태와 도시 목록을 조합한 `computed`로 선택 도시 객체를 찾습니다.
- `CommuteGuide.vue`는 선택 도시를 props로 받아 날씨 상태·기온·풍속·강수량을 기준으로 이동 방식을 계산합니다.
- 비·눈·천둥·강풍·폭염·한파에는 대중교통이나 자차를, 쾌적한 날씨에는 도보나 자전거를 안내합니다.
- 이동 방식과 함께 추천 이유와 준비물을 표시하며, 실제 교통량을 반영하지 않은 날씨 기반 참고 정보임을 명시했습니다.
- 기존 Pinia 단위 설정을 공유해 선택 지역 온도도 섭씨·화씨로 함께 변환됩니다.

### Day 3 핵심 문법

| 추가 기능 | 적용 내용 |
| --- | --- |
| 화면 전환 | `RouterLink`, `RouterView` |
| 코드 분할 | 동적 `import()` |
| 동적 상세 경로 | `route.params`, `router.push()` |
| 화면 간 날씨 전달 | `route.query` |
| 검색 상태 유지 | `watch()`, `router.replace()` |
| 잘못된 주소 처리 | Catch-all Route |
| 전역 단위 상태 | `defineStore()`, Pinia |
| 단위별 표시 온도 | `computed()`, `convertTemperature()` |
| 여러 도시 동시 요청 | `axios`, `Promise.all()` |
| API 실행 상태 처리 | `async/await`, `try/catch/finally` |
| 상세 도시 변경 감지 | `watch()`, `route.params` |
| 일출·일몰 시각 변환 | Unix timestamp, timezone |
| 예보 날짜별 가공 | `Map`, `reduce()`, `map()` |
| 도시 이름 좌표 변환 | Geocoding API |
| 검색어 URL 유지 | `watch()`, `route.query` |
| 검색 컴포넌트 통신 | props, emits |
| 내 지역 전역 상태 | `defineStore()`, `ref()`, action |
| 선택 도시 계산 | `computed()`, `find()` |
| 카드 선택 통신 | props, emits |
| 이동 방식 추천 | `computed()`, 조건문 |

> Day 3는 진행 중이며, 이후 구현 내용은 같은 항목에 이어서 추가할 예정입니다.

## 현재 확인 가능한 기능

- 도시 이름 실시간 검색
- 검색 결과 없음 안내
- 사용자 더움 기준 온도 설정
- 전체 평균 온도와 더운 도시 수 표시
- 카드별 온도 감소·증가 및 직접 입력
- 기준 온도에 따른 배지 자동 변경
- 카드 선택 상태 표시와 도시별 상세 화면 이동
- 새로고침 후 검색어 복원
- 홈에서 변경한 기온과 날씨 상태의 상세 화면 연동
- 날씨 생활 정보 및 404 화면
- 홈·상세 화면의 섭씨/화씨 단위 동기화
- 판교·울산·광주의 실시간 날씨 및 API 로딩·오류 상태 표시
- 카드의 체감온도·습도·풍속과 상세 화면의 일출·일몰 표시
- 도시별 5일 예보와 날짜별 최저·최고 기온·강수 확률 표시
- 국내외 도시 검색, 지역 후보 선택 및 현재 날씨 확인
- 판교·울산·광주 내 지역 설정 및 날씨 기반 이동 방식 안내

## 주요 파일

```text
src/components/exercise/
├── BaseDashboardCard.vue
├── SearchBar.vue
├── WeatherCard.vue
├── UnitToggler.vue
├── WeatherForecast.vue
├── CitySearchForm.vue
├── CitySearchResult.vue
└── CommuteGuide.vue

src/stores/
├── configStore.js
└── locationStore.js

.env.example

src/views/
├── WeatherHomeView.vue
├── WeatherDetailView.vue
├── WeatherSearchView.vue
├── WeatherAboutView.vue
├── WeatherTipsView.vue
└── NotFoundView.vue
```
