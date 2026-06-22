import {
  showToast,
  showConfirmDialog ,
  showLoadingToast,
  showFailToast,
  closeToast,
} from 'vant'
import 'vant/es/toast/style';
import 'vant/es/dialog/style'
export default {
  install: (app) => {
    // 在 mount 之前设置所有全局属性
    app.config.globalProperties.$confirmDialog = showConfirmDialog
    app.config.globalProperties.$toast = showToast
    app.config.globalProperties.$loadingToast = showLoadingToast
    app.config.globalProperties.$failToast = showFailToast
    app.config.globalProperties.$closeToast = closeToast
  }
}