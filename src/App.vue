<script setup lang="ts">
import UnitToggler from './components/exercise/UnitToggler.vue'
</script>

<!-- 실습 및 연습용 -->
<!-- <script setup>
// import SampleOne from './components/practices/basic/SampleOne.vue'
// import SampleTwo from './components/practices/basic/SampleTwo.vue'

// import VueHtml from './components/practices/basic/VueHtml.vue'
// import VueHtmlXss from './components/practices/basic/VueHtmlXss.vue'
// import VueText from './components/practices/basic/VueText.vue'
// import VueBind from './components/practices/basic/VueBind.vue'
// import VueBindClass from './components/practices/basic/VueBindClass.vue'
// import VueBindStyle from './components/practices/basic/VueBindStyle.vue'
// import VueBindShorthand from './components/practices/basic/VueBindShorthand.vue'
// import VueIf from './components/practices/basic/VueIf.vue'
// import VueShow from './components/practices/basic/VueShow.vue'
// import VueFor from './components/practices/basic/VueFor.vue'
// import EventBasic from './components/practices/basic/EventBasic.vue'
// import EventObject from './components/practices/basic/EventObject.vue'
// import EventObject2 from './components/practices/basic/EventObject2.vue'
// import EventModifier from './components/practices/basic/EventModifier.vue'
// import EventModifier2 from './components/practices/basic/EventModifier2.vue'
// import ModelBasic from './components/practices/basic/ModelBasic.vue'
// import ModelForm from './components/practices/basic/ModelForm.vue'
// import ModelModifier from './components/practices/basic/ModelModifier.vue'

// import ReactiveRef from './components/practices/composition/ReactiveRef.vue'
// import ReactiveReactive from './components/practices/composition/ReactiveReactive.vue'
// import ComputedBasic from './components/practices/composition/ComputedBasic.vue'
// import WatchersBasic from './components/practices/composition/WatchersBasic.vue'
// import WatchersMulti from './components/practices/composition/WatchersMulti.vue'
// import WatchersDeep from './components/practices/composition/WatchersDeep.vue'
// import WatchersRefArray from './components/practices/composition/WatchersRefArray.vue'
// import WatchersWatchEffect from './components/practices/composition/WatchersWatchEffect.vue'
</script>

<template>
  <!-- <SampleOne />
  <SampleTwo />
  <VueHtml />
  <VueHtmlXss />
  <VueText />
  <VueBind />
  <VueBindClass />
  <VueBindStyle />
  <VueBindShorthand />
  <VueIf />
  <VueShow />
  <VueFor />
  <EventBasic />
  <EventObject />
  <EventObject2 />
  <EventModifier />
  <EventModifier2 />
  <ModelBasic />
  <ModelForm />
  <ModelModifier />

  <h1>1. Reactive State</h1>
  <hr />
  <ReactiveRef />
  <ReactiveReactive />

  <h1>2. Computed & Watchers</h1>
  <hr />
  <ComputedBasic />
  <WatchersBasic />
  <WatchersMulti />
  <WatchersDeep />
  <WatchersRefArray />
  <WatchersWatchEffect /> -->
</template>

<style>
@import '@/assets/practice.css';
</style> -->

<!-- 과제용 -->
<template>
  <div class="app-container">
    <h1>⛅ 날씨 과제</h1>
    <hr />
    <nav class="navigation-bar">
      <RouterLink to="/" class="nav-item">날씨 대시보드</RouterLink>
      <span class="divider">|</span>
      <RouterLink to="/about" class="nav-item">서비스소개</RouterLink>
      <span class="divider">|</span>
      <RouterLink to="/tips" class="nav-item">날씨 생활 정보</RouterLink>
      <UnitToggler />
    </nav>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style>
@import '@/assets/exercise.css';
</style>
