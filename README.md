# SKALA Vue 날씨 과제

3일 동안 배운 Vue 문법을 날씨 화면에 하나씩 적용하며 기능을 발전시킨 프로젝트입니다. 단순히 실습 코드를 따라가는 데서 끝내지 않고, 사용하면서 불편했던 부분을 직접 개선하거나 새로 확장한 내용을 중심으로 기록했습니다.

## 실행 방법

```sh
npm install
cp .env.example .env.local
npm run dev
```

실행 전 `.env.local`의 `VITE_OPENWEATHER_API_KEY`에 발급받은 OpenWeather API 키를 입력합니다.

## 품질 점검 및 배포

기능 구현을 마친 뒤 바로 배포하지 않고, 먼저 전체 소스 코드의 오류와 production 환경에서의 실행 가능 여부를 순서대로 확인했습니다.

```sh
npm run lint
npm run build
```

- `npm run lint`로 전체 코드를 검사하고 ESLint 오류가 없음을 확인했습니다.
- `npm run build`로 production build를 실행해 `dist` 정적 파일이 정상 생성되는지 확인했습니다.
- 로컬 환경과 동일하게 동작하는지 확인한 뒤 GitHub 저장소를 Vercel에 연결했습니다.
- Vercel의 Build Command는 `npm run build`, Output Directory는 `dist`로 설정했습니다.
- OpenWeather API 키는 Vercel Production Environment Variables에 따로 등록했습니다.
- 배포 후 실시간 날씨, 상세 화면, 도시 검색, 휴식 도우미와 라우트 이동을 다시 확인했습니다.

배포 결과는 [SKALA 날씨 과제 실행하기](https://skala-vue-gules-two.vercel.app/)에서 확인할 수 있습니다. 로컬의 `.env.local`은 Git에서 제외하고, 실제 배포 환경에서는 Vercel 환경변수를 사용했습니다.

## 진행 현황

| 구분  | 추가 구현 주제                                 | 상태    |
| ----- | ---------------------------------------------- | ------- |
| Day 1 | 도시 검색, 온도 조절, 반응형 배지              | 완료    |
| Day 2 | 실시간 검색, 날씨 요약, watcher, 컴포넌트 분리 | 완료    |
| Day 3 | Vue Router, Pinia, Axios 실시간 날씨           | 진행 중 |

---

## Day 1 — 기본 문법을 활용한 기능 추가

첫날에는 Vue의 기본 문법이 실제 화면에서 어떻게 반응하는지 익히는 데 집중했습니다. 검색어와 온도를 상태로 관리하고, 그 값이 바뀌었을 때 카드와 안내 문구가 함께 달라지도록 구현했습니다.

### 1. 도시 검색

- 검색어와 검색 결과가 화면에 바로 반영되는 과정을 이해하기 위해 `searchQuery`와 `searchedCity`를 `ref()`로 관리했습니다.
- 버튼을 누르거나 Enter 키를 입력하면 `searchCity()`가 실행되도록 이벤트를 연결했습니다.
- 처음 배운 반복문을 활용해 `for...of`로 일치하는 도시를 찾고, `v-show`로 해당 카드만 보이게 했습니다.
- 검색어가 비어 있으면 전체 카드를 다시 보여주고, 일치하는 도시가 없을 때는 안내 문구가 나오도록 예외 상황도 처리했습니다.

### 2. 카드별 온도 조절

- 화면에서 값을 직접 바꿔보며 반응형 동작을 확인할 수 있도록 각 카드에 온도 감소·증가 버튼과 숫자 입력창을 추가했습니다.
- 입력값이 문자열이 되지 않도록 `v-model.number`를 사용했고, 변경된 온도에 따라 `더워요 / 선선함` 배지가 바로 바뀌게 했습니다.
- 온도 버튼을 눌렀을 때 카드 선택 이벤트까지 실행되는 문제는 `.stop`으로 이벤트 전파를 막아 해결했습니다.

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

둘째 날에는 Day 1 기능을 그대로 유지하면서 Composition API로 상태 계산과 감시를 연습했습니다. 화면이 커지면서 한 파일에서 모든 역할을 처리하기 어려워졌기 때문에, 데이터 흐름을 생각하며 역할별 컴포넌트로 나누었습니다.

### 1. `computed` 기반 실시간 검색

- Day 1의 버튼 검색 방식보다 자연스럽게 사용할 수 있도록, 기존의 `v-show` 검색 버튼 방식 대신 검색어가 바뀔 때 결과가 자동 계산되는 방식으로 개선했습니다.
- `includes()`를 사용해 도시 이름의 일부만 입력해도 찾을 수 있게 했고, `filteredWeatherList`를 카드 목록에 직접 연결했습니다.
- 계산 결과가 비어 있을 때는 사용자가 상황을 알 수 있도록 별도의 안내 문구를 표시했습니다.

### 2. 나만의 더위 기준과 날씨 요약

- 고정된 25도만으로 날씨를 판단하는 대신, 사용자가 `hotThreshold`를 바꿔 자신만의 더움 기준을 정하도록 했습니다.
- `hotCityCount`와 `averageTemperature`를 계산해 도시별 정보뿐 아니라 전체 날씨도 한눈에 볼 수 있게 했습니다.
- 도시 온도를 바꾸면 배지, 더운 도시 수, 평균 온도가 함께 갱신되는 모습을 통해 `computed`의 반응형 계산을 확인했습니다.

### 3. `watch`와 `watchEffect` 활용

- `watch(hotThreshold)`로 기준 온도의 이전 값과 변경 값을 비교해 안내 문구에 표시했습니다.
- `watch(selectedCityInfo)`로 카드 선택에 따라 상태 바가 바뀌는 과정을 확인했습니다.
- `watchEffect()`는 검색어를 자동으로 추적하게 하여 최초 실행과 변경 시점을 콘솔에서 직접 확인해 보았습니다.

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

이 과정에서 자식이 props를 직접 바꾸는 대신 emit으로 부모에게 변경을 요청해야 한다는 점과, 상태는 부모에서 관리하고 필요한 값만 자식에게 내려주는 흐름을 익혔습니다.

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

셋째 날에는 하나의 화면 안에서 동작하던 날씨 기능을 여러 페이지와 전역 상태, 실제 API로 확장했습니다. 기능이 늘어날수록 화면과 상태의 역할을 나누는 것이 중요하다는 점을 느꼈고, Router와 Pinia를 이용해 구조를 정리했습니다.

### 1. 날씨 화면을 View로 확장

- 기존 날씨 대시보드를 `WeatherHomeView.vue`로 옮기면서 컴포넌트와 페이지의 역할 차이를 익혔습니다.
- `RouterLink`와 `RouterView`로 새로고침 없이 화면을 전환하고, 각 화면은 동적 import로 필요한 시점에 불러오도록 구성했습니다.

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

- 홈과 상세 화면에서 같은 단위를 사용하기 위해 섭씨·화씨 상태를 `configStore`로 옮겨 전역 관리했습니다.
- 내비게이션의 단위 변경 버튼을 누르면 두 화면이 함께 바뀌도록 하면서 Pinia가 여러 컴포넌트의 상태를 공유하는 방식을 익혔습니다.
- 계산 과정에서 값이 반복 변환되지 않도록 섭씨 원본은 유지하고, `convertTemperature()`로 화면에 보이는 온도만 변환했습니다.

### 6. Axios를 활용한 실시간 날씨 연동

- Mock Data 대신 실제 값을 사용해 보기 위해 OpenWeather API로 판교·울산·광주의 날씨를 요청했습니다.
- 도시 좌표 배열을 `map()`으로 순회하고 `Promise.all()`로 동시에 호출하면서 여러 비동기 요청을 함께 처리하는 방법을 연습했습니다.
- 받아온 응답은 기존 `WeatherCard`가 사용하던 구조에 맞게 변환해 기존 컴포넌트를 그대로 활용했습니다.
- 요청 중이거나 실패했을 때 화면이 비어 보이지 않도록 `isLoading`과 `errorMessage` 상태도 따로 관리했습니다.
- API 키는 코드에 직접 작성하지 않고 `.env.local`에서 관리하며 Git 커밋에서 제외했습니다.

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

### 11. 사용자 온도 기준 기능 확장

- 사용자가 추위 기준과 더위 기준을 직접 입력하도록 변경했습니다.
- 두 기준의 입력 여부와 `추위 기준 < 더위 기준` 조건을 `computed`로 검증합니다.
- 입력값에 따라 각 도시를 `추워요`, `적당해요`, `더워요` 상태로 자동 분류합니다.
- 추운 도시·적당한 도시·더운 도시의 개수를 반응형으로 계산합니다.
- 기준이 없거나 범위가 잘못된 경우 날씨 배지 대신 입력 안내를 표시합니다.

### 12. Element Plus UI Library 적용

- 직접 CSS로 모든 요소를 새로 만드는 대신 공통 UI를 일관되게 표현해 보기 위해 Element Plus를 전역 등록했습니다.
- 검색과 온도 입력에는 `el-input`, `el-input-number`를 사용하고, 카드·배지·상태 안내도 각각 용도에 맞는 컴포넌트로 바꿨습니다.
- 특히 로딩·오류·빈 결과를 `el-skeleton`, `el-alert`, `el-empty`로 구분하면서 사용자가 현재 상태를 알아보기 쉽게 개선했습니다.
- 기존에 직접 만든 `BaseDashboardCard`와 레이아웃은 유지해 자체 컴포넌트와 UI Library를 함께 사용하는 방식으로 구성했습니다.

### 13. SKALA 날씨 기반 휴식 도우미

날씨 기능이 늘어나면서 메인 화면이 길어졌기 때문에, 휴식 추천은 `/break` 경로의 별도 페이지로 분리했습니다. SKALA에서 공부하다 잠깐 쉬는 상황을 생각해 5분·10분·20분·수업 후 중 원하는 시간을 고를 수 있게 했습니다.

- 선택한 시간과 내 지역의 현재 날씨를 함께 판단해 물 마시기, 스트레칭, 산책, 음악 듣기 같은 활동을 추천합니다.
- 비·눈·천둥·강풍·폭염·한파에는 야외 활동을 제외하고 실내 활동을 우선하도록 `computed`와 `filter()`를 사용했습니다.
- `다른 추천 보기`를 누르면 같은 조건에서 다음 활동을 보여주고, 시간이나 지역이 바뀌면 `watch`로 추천 순서를 처음으로 되돌립니다.
- 음악 활동이 나오면 현재 날씨를 검색어로 조합한 YouTube 검색 링크를 제공합니다.
- 선택한 도시의 날씨 객체를 Pinia Store에 저장해 홈 화면과 휴식 화면에서 함께 사용했습니다.
- `RouterLink`와 동적 import로 휴식 화면을 별도 View로 구성하고, Element Plus로 시간 선택·태그·알림·빈 화면을 표현했습니다.

이번 기능에서는 단순히 추천 목록을 추가하는 것뿐 아니라, 길어진 화면을 Router로 분리하고 서로 다른 View 사이의 데이터를 Pinia로 공유하는 과정을 함께 연습했습니다.

### 14. 전체 화면 반응형 UI 개선

기능이 늘어난 뒤 화면을 넓게 사용하려고 너비를 수정했지만, 일부 영역이 왼쪽에 치우치거나 카드 너비가 서로 맞지 않는 문제가 있었습니다.

스타일을 확인해 보니 `#app`, `.app-container`, `.dashboard-wrapper`, `.base-dashboard-card`가 각각 다른 고정 너비를 사용하고 있었습니다. 바깥 영역은 1280px인데 내부에는 1800px·1000px·600px이 함께 적용되어 화면 크기에 따라 정렬과 여백이 달라지는 것이 원인이었습니다.

고정 너비를 `width: 100%`와 `max-width` 기반으로 변경하고 `margin: 0 auto`로 가운데 정렬했습니다. 홈 화면은 CSS Grid를 이용해 검색·온도 기준 영역과 날씨 목록을 2열로 배치하고, 화면이 좁아지면 미디어 쿼리로 1열이 되도록 구성했습니다.

상세 날씨, 다른 도시 검색, 휴식 도우미도 같은 방식으로 최대 너비를 정해 페이지마다 화면 크기가 크게 달라지지 않도록 맞췄습니다. 이 작업을 통해 Grid만 보는 것이 아니라 Grid를 감싸는 부모 클래스의 너비와 정렬도 함께 확인해야 한다는 점을 배웠습니다.

### 15. RESTful SKALA 브랜딩 적용

날씨 확인뿐 아니라 이동과 휴식까지 추천하는 서비스의 특징을 보여주기 위해 이름을 `RESTful SKALA`로 정했습니다.

REST API의 `REST`와 공부 중 잠깐 쉬어가는 `rest`의 의미를 함께 담고, `API로 날씨를 받고, 일상에는 쉼을 더하다`를 부제로 사용했습니다. 화면 상단과 브라우저 탭의 제목을 변경하고, SKALA 캠퍼스 검색과 휴식 도우미 문구도 서비스 주제에 맞게 정리했습니다.

### Day 3 핵심 문법

| 추가 기능             | 적용 내용                                          |
| --------------------- | -------------------------------------------------- |
| 화면 전환             | `RouterLink`, `RouterView`                         |
| 코드 분할             | 동적 `import()`                                    |
| 동적 상세 경로        | `route.params`, `router.push()`                    |
| 화면 간 날씨 전달     | `route.query`                                      |
| 검색 상태 유지        | `watch()`, `router.replace()`                      |
| 잘못된 주소 처리      | Catch-all Route                                    |
| 전역 단위 상태        | `defineStore()`, Pinia                             |
| 단위별 표시 온도      | `computed()`, `convertTemperature()`               |
| 여러 도시 동시 요청   | `axios`, `Promise.all()`                           |
| API 실행 상태 처리    | `async/await`, `try/catch/finally`                 |
| 상세 도시 변경 감지   | `watch()`, `route.params`                          |
| 일출·일몰 시각 변환   | Unix timestamp, timezone                           |
| 예보 날짜별 가공      | `Map`, `reduce()`, `map()`                         |
| 도시 이름 좌표 변환   | Geocoding API                                      |
| 검색어 URL 유지       | `watch()`, `route.query`                           |
| 검색 컴포넌트 통신    | props, emits                                       |
| 내 지역 전역 상태     | `defineStore()`, `ref()`, action                   |
| 선택 도시 계산        | `computed()`, `find()`                             |
| 카드 선택 통신        | props, emits                                       |
| 이동 방식 추천        | `computed()`, 조건문                               |
| 사용자 온도 기준 검증 | `ref()`, `computed()`                              |
| Element Plus UI 적용  | `el-card`, `el-input-number`, `el-alert`, `el-tag` |
| 휴식 시간과 추천 순서 | `ref()`, `v-model`, 배열 인덱스                    |
| 날씨별 활동 필터링    | `computed()`, `filter()`                           |
| 추천 조건 초기화      | `watch()`                                          |
| 날씨별 음악 검색      | `computed()`, `encodeURIComponent()`               |
| 휴식 화면 상태 공유   | Pinia Store, props                                 |
| 반응형 화면 배치      | CSS Grid, `max-width`, 미디어 쿼리                 |
| 서비스 정보 설정      | `<title>`, meta description                        |

> Day 3는 진행 중이며, 이후 구현 내용은 같은 항목에 이어서 추가할 예정입니다.

## 현재 확인 가능한 기능

- 도시 이름 실시간 검색
- 검색 결과 없음 안내
- 사용자 추위·더위 기준 온도 설정과 입력값 검증
- 전체 평균 온도와 추운·적당한·더운 도시 수 표시
- 카드별 온도 감소·증가 및 직접 입력
- 기준 온도에 따른 추움·적당함·더움 배지 자동 변경
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
- 휴식 시간과 내 지역 날씨를 반영한 SKALA 휴식 활동 추천
- 음악 활동의 날씨별 YouTube 검색 연결

## 수업 실습 코드 정리

수업 중 작성한 기본 문법, Composition API, 컴포넌트, Pinia, Axios 예제는 날씨 과제 코드와 섞이지 않도록 `src/components/practices`에 주제별로 정리했습니다.

기존에는 실습을 확인할 때마다 `App.vue`의 import와 주석을 직접 바꿔야 했습니다. 이 과정을 줄이기 위해 실습 전용 `PracticeView.vue`를 만들고 `/practice` 경로에 연결했습니다.

```text
http://localhost:5173/practice
```

이 화면에서 Vue 기본 문법, 이벤트와 `v-model`, 반응형 상태, computed와 watcher, 컴포넌트 통신과 생명주기, Slot, Pinia, Axios 실습을 순서대로 확인할 수 있습니다.

`PracticeView.vue`는 동적 import로 불러오고 제출용 내비게이션에는 링크를 표시하지 않았습니다.
과제 화면은 그대로 유지하면서 필요할 때 주소로 실습 코드를 확인할 수 있습니다.

## 트러블슈팅

### 1. 자식 컴포넌트에서 props를 직접 변경하려던 문제

날씨 카드를 컴포넌트로 분리할 때 자식이 전달받은 도시 온도를 직접 바꾸면 데이터 흐름을 확인하기 어렵고 Vue의 단방향 흐름에도 맞지 않았습니다.

`WeatherCard`에서는 도시 ID와 변경값을 emit으로 부모에게 전달하고, 부모가 실제 `weatherList`의 값을 변경하도록 수정했습니다. 이 과정에서 props는 부모에서 자식으로 전달하고, 변경 요청은 emits로 다시 부모에게 전달하는 구조를 연습했습니다.

### 2. `computed` 값을 직접 수정한 문제

추위·더위 기준 안내 문구를 `computed`로 바꾼 뒤에도 기존 `watch`에서 `thresholdMessage.value`를 직접 수정하는 코드가 남아 있었습니다. 하지만 `computed`는 의존하는 상태를 바탕으로 계산되는 읽기 전용 값이므로 직접 대입하는 방식이 맞지 않았습니다.

기존 `watch`를 제거하고 `hotThreshold`와 `coldThreshold`의 값에 따라 안내 문구가 자동 계산되도록 정리했습니다. 이를 통해 상태 자체는 `ref`로 관리하고, 그 상태에서 만들어지는 값은 `computed`로 구분해야 한다는 점을 익혔습니다.

### 3. 실습을 확인할 때마다 `App.vue`를 바꾸던 문제

수업 실습을 실행할 때마다 `App.vue`의 import와 주석을 직접 변경하다 보니 과제 화면과 실습 코드가 섞이고, 다시 원래 상태로 돌려놓는 과정도 반복됐습니다.

실습 컴포넌트를 `PracticeView.vue`에 주제별로 모으고 `/practice` 라우트로 분리했습니다. 이제 과제 화면을 수정하지 않고도 주소만 이동해 모든 실습을 확인할 수 있습니다.

### 4. Vercel 배포 후 날씨 API 401 오류

로컬에서는 실시간 날씨가 정상적으로 표시됐지만, 처음 배포한 화면에서는 OpenWeather API 요청이 `401 Unauthorized`로 실패했습니다.

브라우저 개발자 도구에서 요청 URL을 확인해 보니 API 키를 전달하는 `appid`가 포함되지 않았습니다. `.env.local`은 Git에서 제외되며 Vercel 배포 환경에도 자동으로 전달되지 않는다는 것이 원인이었습니다.

Vercel의 Production 환경변수에 `VITE_OPENWEATHER_API_KEY`를 등록하고 다시 배포해 해결했습니다. 이 과정에서 로컬 환경변수와 배포 환경변수는 별도로 관리해야 하고, Vite에서 클라이언트 코드로 읽는 환경변수에는 `VITE_` 접두사가 필요하다는 점을 확인했습니다.

### 5. 전체 화면이 왼쪽으로 치우치고 카드 너비가 맞지 않은 문제

전체 화면을 넓게 사용하기 위해 CSS 너비를 수정한 뒤 일부 카드가 왼쪽에 치우치거나 부모 영역을 넘어가는 문제가 생겼습니다.

처음에는 CSS Grid가 원인이라고 생각했지만, 관련 요소를 감싸는 클래스와 `margin` 설정을 따라가며 확인해 보니 Grid보다 부모와 자식에 지정된 고정 너비가 서로 다른 것이 문제였습니다.

`#app`, `.app-container`, `.dashboard-wrapper`, `.base-dashboard-card`에 적용된 1280px·1800px·1000px·600px 값을 찾아 제거했습니다. 대신 `width: 100%`, `max-width`, `margin: 0 auto`를 적용하고, 화면 너비에 따라 2열에서 1열로 바뀌도록 미디어 쿼리를 추가했습니다.

이 문제를 해결하면서 화면에 보이는 자식 요소만 수정하기보다 해당 요소를 감싸고 있는 부모 클래스까지 따라가며 CSS를 확인해야 한다는 점을 익혔습니다.

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
├── CommuteGuide.vue
└── BreakRecommendation.vue

src/components/practices/
├── basic/
├── composition/
├── component/
└── library/

src/stores/
├── configStore.js
└── locationStore.js

.env.example

src/views/
├── WeatherHomeView.vue
├── WeatherDetailView.vue
├── WeatherSearchView.vue
├── BreakRecommendationView.vue
├── WeatherAboutView.vue
├── WeatherTipsView.vue
├── PracticeView.vue
└── NotFoundView.vue
```
