import { createPinia } from 'pinia'
const pinia = createPinia()
export default pinia
export { useAppStore } from './app'
export { usePlayerStore } from './player'
export { useUserStore } from './user'
export { useSearchStore } from './search'
export { useSingerStore } from './singer'