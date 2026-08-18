<script setup>
import SampleOne from './components/practices/basic/SampleOne.vue'
import SampleTwo from './components/practices/basic/SampleTwo.vue'

import VueHtml from './components/practices/basic/VueHtml.vue'
import VueHtmlXss from './components/practices/basic/VueHtmlXss.vue'
import VueText from './components/practices/basic/VueText.vue'
import VueBind from './components/practices/basic/VueBind.vue'
import VueBindClass from './components/practices/basic/VueBindClass.vue'
import VueBindStyle from './components/practices/basic/VueBindStyle.vue'
import VueBindShorthand from './components/practices/basic/VueBindShorthand.vue'
</script>

<template>
  <SampleOne />
  <SampleTwo />
  <VueHtml />
  <VueHtmlXss />
  <VueText />
  <VueBind />
  <VueBindClass />
  <VueBindStyle />
  <VueBindShorthand />
</template>

<style>
@import '@/assets/practice.css';
</style>
