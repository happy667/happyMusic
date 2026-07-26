import { defineStore } from 'pinia'
export const useAppStore = defineStore('app', {
  state: () => ({ homeCurrentIndex: 0, oldVideo: {}, audio: null, noCacheComponents: [] }),
  actions: {
    addNoCacheComponent (name) { if (!this.noCacheComponents.includes(name)) this.noCacheComponents.push(name) },
    removeNoCacheComponent (name) { const i = this.noCacheComponents.indexOf(name); if (i !== -1) this.noCacheComponents.splice(i, 1) }
  }
})