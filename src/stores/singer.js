import { defineStore } from 'pinia'
export const useSingerStore = defineStore('singer', {
  state: () => ({ singerCurrentIndex: 0, singer: null, isLoadPlayerImage: true, isLoadAlbumInfoImage: true, isLoadVideoInfoImage: true })
})