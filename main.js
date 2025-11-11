import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
import VueI18n from 'vue-i18n'
import { messages, getInitialLocale } from './i18n/index.js'
Vue.config.productionTip = false
App.mpType = 'app'
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages
})
const app = new Vue({
  i18n,
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { messages as v3Messages, getInitialLocale as v3GetInitialLocale } from './i18n/index.js'
export function createApp() {
  const app = createSSRApp(App)
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: v3GetInitialLocale(),
    fallbackLocale: 'en',
    messages: v3Messages
  })
  app.use(i18n)
  return {
    app
  }
}
// #endif