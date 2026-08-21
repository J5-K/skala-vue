<script setup>
import SampleOne from '@/components/practices/basic/SampleOne.vue'
import SampleTwo from '@/components/practices/basic/SampleTwo.vue'
import VueHtml from '@/components/practices/basic/VueHtml.vue'
import VueHtmlXss from '@/components/practices/basic/VueHtmlXss.vue'
import VueText from '@/components/practices/basic/VueText.vue'
import VueBind from '@/components/practices/basic/VueBind.vue'
import VueBindClass from '@/components/practices/basic/VueBindClass.vue'
import VueBindStyle from '@/components/practices/basic/VueBindStyle.vue'
import VueBindShorthand from '@/components/practices/basic/VueBindShorthand.vue'
import VueIf from '@/components/practices/basic/VueIf.vue'
import VueShow from '@/components/practices/basic/VueShow.vue'
import VueFor from '@/components/practices/basic/VueFor.vue'
import EventBasic from '@/components/practices/basic/EventBasic.vue'
import EventObject from '@/components/practices/basic/EventObject.vue'
import EventObject2 from '@/components/practices/basic/EventObject2.vue'
import EventModifier from '@/components/practices/basic/EventModifier.vue'
import EventModifier2 from '@/components/practices/basic/EventModifier2.vue'
import ModelBasic from '@/components/practices/basic/ModelBasic.vue'
import ModelForm from '@/components/practices/basic/ModelForm.vue'
import ModelModifier from '@/components/practices/basic/ModelModifier.vue'

import ReactiveRef from '@/components/practices/composition/ReactiveRef.vue'
import ReactiveReactive from '@/components/practices/composition/ReactiveReactive.vue'
import ComputedBasic from '@/components/practices/composition/ComputedBasic.vue'
import WatchersBasic from '@/components/practices/composition/WatchersBasic.vue'
import WatchersMulti from '@/components/practices/composition/WatchersMulti.vue'
import WatchersDeep from '@/components/practices/composition/WatchersDeep.vue'
import WatchersRefArray from '@/components/practices/composition/WatchersRefArray.vue'
import WatchersWatchEffect from '@/components/practices/composition/WatchersWatchEffect.vue'

import LifecycleParent from '@/components/practices/component/LifecycleParent.vue'
import PropsEmitsParent from '@/components/practices/component/PropsEmitsParent.vue'
import SlotDefaultParent from '@/components/practices/component/SlotDefaultParent.vue'
import SlotNamedParent from '@/components/practices/component/SlotNamedParent.vue'
import SlotScopedParent from '@/components/practices/component/SlotScopedParent.vue'

import StoreCounter from '@/components/practices/library/StoreCounter.vue'
import AxiosWeather from '@/components/practices/library/AxiosWeather.vue'
</script>

<template>
  <div class="practice-view">
    <header class="practice-header">
      <h1>Vue 수업 실습 모음</h1>
      <p>수업에서 작성한 예제를 주제별로 나누어 확인하는 화면입니다.</p>
    </header>

    <section class="practice-section">
      <h2>1. Vue 기본 문법</h2>
      <div class="practice-list">
        <SampleOne />
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
      </div>
    </section>

    <section class="practice-section">
      <h2>2. 이벤트 처리</h2>
      <div class="practice-list">
        <EventBasic />
        <EventObject />
        <EventObject2 />
        <EventModifier />
        <EventModifier2 />
      </div>
    </section>

    <section class="practice-section">
      <h2>3. v-model 실습</h2>
      <div class="practice-list">
        <ModelBasic />
        <ModelForm />
        <ModelModifier />
      </div>
    </section>

    <section class="practice-section">
      <h2>4. 반응형 상태</h2>
      <div class="practice-list">
        <ReactiveRef />
        <ReactiveReactive />
      </div>
    </section>

    <section class="practice-section">
      <h2>5. Computed와 Watchers</h2>
      <div class="practice-list">
        <ComputedBasic />
        <WatchersBasic />
        <WatchersMulti />
        <WatchersDeep />
        <WatchersRefArray />
        <WatchersWatchEffect />
      </div>
    </section>

    <section class="practice-section">
      <h2>6. 컴포넌트 통신과 생명주기</h2>
      <div class="practice-list">
        <LifecycleParent />
        <PropsEmitsParent />
      </div>
    </section>

    <section class="practice-section">
      <h2>7. Slot 실습</h2>
      <div class="practice-list">
        <SlotDefaultParent />
        <SlotNamedParent />
        <SlotScopedParent />
      </div>
    </section>

    <section class="practice-section">
      <h2>8. Pinia 실습</h2>
      <div class="practice-list">
        <StoreCounter />
      </div>
    </section>

    <section class="practice-section">
      <h2>9. Axios 실습</h2>
      <div class="practice-list">
        <AxiosWeather />
      </div>
    </section>
  </div>
</template>

<style scoped>
.practice-view {
  width: min(900px, 100%);
  margin: 0 auto;
}

.practice-header {
  margin-bottom: 24px;
}

.practice-header h1,
.practice-header p {
  margin: 0;
}

.practice-header h1 {
  margin-bottom: 8px;
}

.practice-section {
  padding: 20px;
  margin-bottom: 20px;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}

.practice-section h2 {
  padding-bottom: 10px;
  margin: 0 0 16px;
  border-bottom: 1px solid #ebeef5;
}

.practice-list {
  display: grid;
  gap: 16px;
}
</style>
