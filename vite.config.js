import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { VantResolver } from "@vant/auto-import-resolver"

const root = process.cwd().replace(/\\/g, "/")
function stylusCommonAlias() {
  const alias = root + "/src/assets/common"
  return {
    name: "stylus-common-alias",
    enforce: "pre",
    transform(code, id) {
      if (code.includes("~common")) {
        return code.replace(/~common/g, alias)
      }
    }
  }
}


export default defineConfig({
  plugins: [
    stylusCommonAlias(),
    vue(),
    AutoImport({ resolvers: [VantResolver()] }),
    Components({ resolvers: [VantResolver()], dirs: [] }),
  ],
  resolve: {
    alias: [
      { find: "@/", replacement: root + "/src/" },
      { find: "common", replacement: root + "/src/assets/common" },
    ],
    extensions: [".mjs", ".js", ".json", ".vue"]
  },
  css: {
    preprocessorOptions: {
      stylus: {
        additionalData: '@require "' + root + '/src/assets/common/stylus/variable.styl"',
      }
    }
  },
  server: {
    host: "0.0.0.0",
    port: 8080,
    proxy: {
      "/api/baiduApi": { target: "https://aip.baidubce.com", changeOrigin: true, rewrite: (p) => p.replace(/^\/api\/baiduApi/, "") },
      "/api/baiduMap": { target: "https://api.map.baidu.com", changeOrigin: true, rewrite: (p) => p.replace(/^\/api\/baiduMap/, "") },
      "/api/baiduMap/load": { target: "https://api.map.baidu.com", changeOrigin: true, rewrite: (p) => { const u = new URL(p, "http://localhost"); const ak = process.env.VITE_BAIDU_MAP_AK || ""; const cb = u.searchParams.get("callback") || "BMapCallback"; return "/api?v=3.0&ak=" + ak + "&callback=" + cb + "&s=1" } },
      "/api/weather": { target: "https://api.open-meteo.com", changeOrigin: true, rewrite: (p) => p.replace(/^\/api\/weather/, "") },
      "/api": { target: "http://localhost:3000", changeOrigin: true, rewrite: (p) => p.replace(/^\/api/, "") }
    }
  },
  build: { assetsDir: "static", sourcemap: false },
})
