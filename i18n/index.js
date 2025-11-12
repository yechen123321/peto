import zhCN from '../locales/zh-CN.json'
import en from '../locales/en.json'

export const messages = {
  'zh-CN': zhCN,
  en
}

export function normalizeLocale(lang) {
  if (!lang) return 'en'
  const l = String(lang).toLowerCase()
  if (l.startsWith('zh')) return 'zh-CN'
  return 'en'
}

export function getInitialLocale() {
  const stored = uni.getStorageSync('locale')
  if (stored) return stored
  let sysLang = ''
  // #ifdef H5
  sysLang = typeof navigator !== 'undefined' ? navigator.language : ''
  // #endif
  // #ifndef H5
  try {
    const info = uni.getSystemInfoSync()
    sysLang = info && info.language ? info.language : ''
  } catch (e) {}
  // #endif
  return normalizeLocale(sysLang)
}

// 读取消息字典中的键（支持 dot 路径），并有英文回退
export function getMessage(lang, path, params = {}) {
  const safeLang = normalizeLocale(lang)
  const dict = messages[safeLang] || messages['en'] || {}
  const fallback = messages['en'] || {}
  const read = (obj, key) => key.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : undefined), obj)
  let val = read(dict, path)
  if (val == null) val = read(fallback, path)
  if (typeof val === 'string') {
    // 简单插值：替换 {name} 等占位符
    return val.replace(/\{(\w+)\}/g, (_, k) => (params[k] != null ? String(params[k]) : `{${k}}`))
  }
  return val
}

// 根据当前语言更新 tabBar 文案
export function applyTabBarLocale(locale) {
  const lang = normalizeLocale(locale)
  const home = getMessage(lang, 'tab.home') || 'Home'
  const pet = getMessage(lang, 'tab.pet') || 'Pet'
  const history = getMessage(lang, 'tab.history') || 'History'
  const profile = getMessage(lang, 'tab.profile') || 'Profile'
  // 依次更新 4 个 tab 项（H5 为 Promise，非 tab 页会报错，这里统一忽略）
  Promise.resolve(uni.setTabBarItem({ index: 0, text: home })).catch(() => {})
  Promise.resolve(uni.setTabBarItem({ index: 1, text: pet })).catch(() => {})
  Promise.resolve(uni.setTabBarItem({ index: 2, text: history })).catch(() => {})
  Promise.resolve(uni.setTabBarItem({ index: 3, text: profile })).catch(() => {})
}