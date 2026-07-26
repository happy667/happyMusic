import { defineStore } from 'pinia'
export const useSearchStore = defineStore('search', {
  state: () => ({ searchKeywords: '', searchCurrentIndex: 0, showSearchList: false, selectSearchWord: null })
})