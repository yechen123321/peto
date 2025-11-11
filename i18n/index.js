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