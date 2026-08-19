# SKALA Vue 학습 및 날씨 과제

Vue 수업 내용을 실습하고, 배운 기능을 날씨 화면에 적용하며 3일 동안 단계적으로 발전시키는 프로젝트입니다.

## 실행 방법

```sh
npm install
npm run dev
```

## 진행 현황

| 구분  | 내용                                                    | 상태 |
| ----- | ------------------------------------------------------- | ---- |
| Day 1 | Vue 기본 문법, Composition API 실습 및 날씨 Mockup 개선 | 완료 |
| Day 2 | 수업 실습 및 과제 개선                                  | 예정 |
| Day 3 | 수업 실습 및 최종 개선                                  | 예정 |

---

## Day 1

### 수업 실습

데이터 출력과 바인딩, 조건·반복 렌더링, 이벤트, `v-model`, Composition API를 실습했습니다. 기본 예제를 그대로 확인하는 데 그치지 않고 다음 내용을 추가하거나 변경했습니다.

| 추가·변경 내용                                                      | 적용 파일                                |
| ------------------------------------------------------------------- | ---------------------------------------- |
| 키보드 이벤트에서 `key`, `code`, `shiftKey` 값을 확인하는 예제 추가 | `EventObject2.vue`                       |
| `.once`로 한 번만 실행되는 클릭 이벤트와 실행 횟수 표시 추가        | `EventModifier2.vue`                     |
| 숫자와 공백 처리가 실제로 동작하도록 `.number`, `.trim` 수식어 적용 | `ModelModifier.vue`                      |
| 실습 도시를 판교·울산·광주로 변경해 날씨 과제 데이터와 통일         | `WatchersBasic.vue`, `WatchersMulti.vue` |
| 객체 전체와 특정 속성을 나누어 감시하는 `deep watch` 실습           | `WatchersDeep.vue`                       |
| 배열의 특정 인덱스와 객체 내부 값 변경 감시 실습                    | `WatchersRefArray.vue`                   |
| 감시 대상을 자동으로 추적하고 즉시 실행되는 `watchEffect` 실습      | `WatchersWatchEffect.vue`                |
| 위 watcher 예제를 화면에서 함께 확인하도록 컴포넌트 연결            | `App.vue`                                |
| 다크 모드에서도 제목과 실습 카드 내용이 보이도록 색상 보완          | `practice.css`                           |

### 날씨 과제 개선

정적인 날씨 카드에 검색과 온도 조절 기능을 추가했습니다.

#### 1. 도시 검색

- 검색 버튼과 Enter 키로 검색 실행
- `v-model.trim`으로 검색어 앞뒤 공백 제거
- 검색된 도시만 `v-show`로 표시
- 빈 검색어 입력 시 전체 카드 표시
- 존재하지 않는 도시 검색 시 안내 문구 표시

#### 2. 온도 조절

- 카드별 `-`, `+` 버튼과 숫자 입력창 추가
- `v-model.number`로 입력값을 숫자로 관리
- 25도를 기준으로 `더워요 / 선선함` 배지가 즉시 변경
- 온도 조절 시 카드 클릭 이벤트가 실행되지 않도록 `.stop` 적용

#### 3. 반응형 상태

`ref()`로 날씨 목록, 검색어, 검색된 도시와 안내 문구를 관리했습니다. 상태가 바뀌면 검색 결과, 온도와 배지가 함께 갱신됩니다.

```js
const searchQuery = ref('')
const searchedCity = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색하세요')
```

#### 주요 추가 기능

| 기능                  | 적용한 Vue 문법                |
| --------------------- | ------------------------------ |
| 날씨 카드 반복 출력   | `v-for`, `:key`                |
| 도시 검색 결과 표시   | `ref`, `v-show`                |
| 검색어 입력           | `v-model.trim`, `@keyup.enter` |
| 온도 입력 및 변경     | `v-model.number`, `@click`     |
| 온도별 배지 표시      | `v-if`, `v-else`               |
| 중첩 클릭 이벤트 제어 | `@click.stop`                  |

#### 확인한 동작

- 판교·울산·광주 중 한 도시를 검색하면 해당 카드만 표시됩니다.
- 검색창을 비우고 다시 검색하면 전체 카드가 표시됩니다.
- 온도를 24도에서 25도로 올리면 배지가 `선선함`에서 `더워요`로 변경됩니다.
- 상세보기 버튼은 카드 선택 이벤트와 분리되어 날씨 알림만 실행합니다.

### Day 1 주요 파일

- `src/App.vue`
- `src/components/practices/basic/`
- `src/components/practices/composition/`
- `src/components/exercise/WeatherMockup.vue`
- `src/assets/practice.css`
- `src/assets/exercise.css`

---

## Day 2 — 작성 예정

수업에서 추가로 실습한 내용과 날씨 과제에 적용한 변경 사항을 기록합니다.

## Day 3 — 작성 예정

마지막 수업 내용과 과제의 최종 기능 및 검증 결과를 기록합니다.
